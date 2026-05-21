const router = require('express').Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, (req, res) => {
  const { professional_id, service_id, slot_id, notes } = req.body;
  if (!professional_id || !service_id || !slot_id) return res.status(400).json({ error: 'Données manquantes' });

  const slot = db.prepare('SELECT * FROM slots WHERE id = ? AND is_booked = 0').get(slot_id);
  if (!slot) return res.status(409).json({ error: 'Ce créneau n\'est plus disponible' });

  const existing = db.prepare('SELECT id FROM bookings WHERE client_id = ? AND slot_id = ?').get(req.user.id, slot_id);
  if (existing) return res.status(409).json({ error: 'Vous avez déjà réservé ce créneau' });

  let insertedId;
  try {
    db.exec('BEGIN');
    const result = db.prepare(`
      INSERT INTO bookings (client_id, professional_id, service_id, slot_id, notes)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.user.id, professional_id, service_id, slot_id, notes || null);
    db.prepare('UPDATE slots SET is_booked = 1 WHERE id = ?').run(slot_id);
    db.exec('COMMIT');
    insertedId = result.lastInsertRowid;
  } catch (err) {
    db.exec('ROLLBACK');
    console.error('Booking transaction error:', err);
    return res.status(500).json({ error: 'Erreur lors de la réservation' });
  }

  const full = db.prepare(`
    SELECT b.*, u.name as pro_name, s.name as service_name, s.duration, s.price,
           sl.date, sl.start_time, sl.end_time
    FROM bookings b
    JOIN users u ON u.id = (SELECT user_id FROM professionals WHERE id = b.professional_id)
    JOIN services s ON s.id = b.service_id
    JOIN slots sl ON sl.id = b.slot_id
    WHERE b.id = ?
  `).get(insertedId);

  res.status(201).json(full);
});

router.get('/my', authMiddleware, (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, u.name as pro_name, u.avatar as pro_avatar,
           s.name as service_name, s.duration, s.price,
           sl.date, sl.start_time, sl.end_time,
           p.category, p.city
    FROM bookings b
    JOIN professionals p ON p.id = b.professional_id
    JOIN users u ON u.id = p.user_id
    JOIN services s ON s.id = b.service_id
    JOIN slots sl ON sl.id = b.slot_id
    WHERE b.client_id = ?
    ORDER BY sl.date DESC, sl.start_time DESC
  `).all(req.user.id);
  res.json(bookings);
});

router.delete('/:id', authMiddleware, (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ? AND client_id = ?').get(req.params.id, req.user.id);
  if (!booking) return res.status(404).json({ error: 'Réservation introuvable' });

  const slot = db.prepare('SELECT * FROM slots WHERE id = ?').get(booking.slot_id);
  const slotDate = new Date(`${slot.date}T${slot.start_time}`);
  if (slotDate - new Date() < 3600000 * 2) {
    return res.status(400).json({ error: 'Annulation impossible moins de 2h avant le rendez-vous' });
  }

  try {
    db.exec('BEGIN');
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run('cancelled', req.params.id);
    db.prepare('UPDATE slots SET is_booked = 0 WHERE id = ?').run(booking.slot_id);
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    return res.status(500).json({ error: 'Erreur lors de l\'annulation' });
  }

  res.json({ success: true });
});

router.post('/:id/review', authMiddleware, (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Note invalide (1-5)' });

    const bookingId = parseInt(req.params.id, 10);
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ? AND client_id = ?').get(bookingId, req.user.id);
    if (!booking) return res.status(404).json({ error: 'Réservation introuvable' });
    if (booking.status !== 'confirmed') return res.status(400).json({ error: 'Réservation non confirmée' });

    const already = db.prepare('SELECT id FROM reviews WHERE booking_id = ?').get(bookingId);
    if (already) return res.status(409).json({ error: 'Avis déjà soumis' });

    db.prepare('INSERT INTO reviews (client_id, professional_id, booking_id, rating, comment) VALUES (?, ?, ?, ?, ?)').run(
      req.user.id, booking.professional_id, bookingId, parseInt(rating, 10), comment || null
    );

    const avg = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as cnt FROM reviews WHERE professional_id = ?').get(booking.professional_id);
    db.prepare('UPDATE professionals SET rating = ?, review_count = ? WHERE id = ?').run(
      Math.round(avg.avg * 10) / 10, avg.cnt, booking.professional_id
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Review error:', err);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'avis' });
  }
});

module.exports = router;
