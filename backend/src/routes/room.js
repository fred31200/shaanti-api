const router = require('express').Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

router.get('/availability', (req, res) => {
  const dates = db.prepare(`
    SELECT date FROM room_slots WHERE is_booked = 0 AND date >= date('now')
    GROUP BY date ORDER BY date LIMIT 60
  `).all();
  res.json(dates.map(d => d.date));
});

router.get('/slots', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date requise' });
  const slots = db.prepare(`
    SELECT * FROM room_slots WHERE date = ? AND is_booked = 0 ORDER BY start_time
  `).all(date);
  res.json(slots);
});

router.post('/book', authMiddleware, (req, res) => {
  const { slot_id, purpose } = req.body;
  if (!slot_id) return res.status(400).json({ error: 'Créneau requis' });

  const slot = db.prepare('SELECT * FROM room_slots WHERE id = ? AND is_booked = 0').get(slot_id);
  if (!slot) return res.status(409).json({ error: 'Ce créneau n\'est plus disponible' });

  const booking = db.prepare(() => {
    const r = db.prepare('INSERT INTO room_bookings (client_id, slot_id, purpose) VALUES (?, ?, ?)').run(req.user.id, slot_id, purpose || null);
    db.prepare('UPDATE room_slots SET is_booked = 1 WHERE id = ?').run(slot_id);
    return r;
  });

  try {
    let bookingId;
    db.prepare('BEGIN').run();
    const result = db.prepare('INSERT INTO room_bookings (client_id, slot_id, purpose) VALUES (?, ?, ?)').run(req.user.id, slot_id, purpose || null);
    db.prepare('UPDATE room_slots SET is_booked = 1 WHERE id = ?').run(slot_id);
    db.prepare('COMMIT').run();
    bookingId = result.lastInsertRowid;
    res.status(201).json({ id: bookingId, success: true });
  } catch (e) {
    db.prepare('ROLLBACK').run();
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/my-bookings', authMiddleware, (req, res) => {
  const bookings = db.prepare(`
    SELECT rb.*, rs.date, rs.start_time, rs.end_time, rs.price
    FROM room_bookings rb
    JOIN room_slots rs ON rs.id = rb.slot_id
    WHERE rb.client_id = ?
    ORDER BY rs.date DESC, rs.start_time DESC
  `).all(req.user.id);
  res.json(bookings);
});

module.exports = router;
