const router = require('express').Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

router.get('/', (req, res) => {
  const { category, city, q } = req.query;
  let sql = `
    SELECT p.*, u.name, u.email, u.phone, u.avatar
    FROM professionals p
    JOIN users u ON u.id = p.user_id
    WHERE 1=1
  `;
  const params = [];
  if (category) { sql += ' AND p.category = ?'; params.push(category); }
  if (city) { sql += ' AND LOWER(p.city) LIKE ?'; params.push(`%${city.toLowerCase()}%`); }
  if (q) { sql += ' AND (LOWER(u.name) LIKE ? OR LOWER(p.specialties) LIKE ? OR LOWER(p.bio) LIKE ?)'; params.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  sql += ' ORDER BY p.rating DESC';

  const pros = db.prepare(sql).all(...params);
  res.json(pros);
});

router.get('/:id', (req, res) => {
  const pro = db.prepare(`
    SELECT p.*, u.name, u.email, u.phone, u.avatar
    FROM professionals p JOIN users u ON u.id = p.user_id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!pro) return res.status(404).json({ error: 'Professionnel introuvable' });

  const services = db.prepare('SELECT * FROM services WHERE professional_id = ? AND active = 1').all(pro.id);
  const reviews = db.prepare(`
    SELECT r.*, u.name as client_name, u.avatar as client_avatar
    FROM reviews r JOIN users u ON u.id = r.client_id
    WHERE r.professional_id = ?
    ORDER BY r.created_at DESC LIMIT 10
  `).all(pro.id);

  res.json({ ...pro, services, reviews });
});

router.get('/:id/slots', (req, res) => {
  const { date } = req.query;
  let sql = 'SELECT * FROM slots WHERE professional_id = ? AND is_booked = 0';
  const params = [req.params.id];
  if (date) { sql += ' AND date = ?'; params.push(date); }
  else { sql += ' AND date >= date("now")'; }
  sql += ' ORDER BY date, start_time';
  res.json(db.prepare(sql).all(...params));
});

router.get('/:id/availability', (req, res) => {
  const slots = db.prepare(`
    SELECT date FROM slots
    WHERE professional_id = ? AND is_booked = 0 AND date >= date('now')
    GROUP BY date ORDER BY date LIMIT 60
  `).all(req.params.id);
  res.json(slots.map(s => s.date));
});

// Tableau de bord pro
router.get('/dashboard/me', authMiddleware, (req, res) => {
  if (req.user.role !== 'pro') return res.status(403).json({ error: 'Accès réservé aux professionnels' });
  const pro = db.prepare('SELECT * FROM professionals WHERE user_id = ?').get(req.user.id);
  if (!pro) return res.status(404).json({ error: 'Profil pro non trouvé' });

  const bookings = db.prepare(`
    SELECT b.*, u.name as client_name, u.phone as client_phone,
           s.name as service_name, s.duration, s.price,
           sl.date, sl.start_time, sl.end_time
    FROM bookings b
    JOIN users u ON u.id = b.client_id
    JOIN services s ON s.id = b.service_id
    JOIN slots sl ON sl.id = b.slot_id
    WHERE b.professional_id = ?
    ORDER BY sl.date DESC, sl.start_time DESC
  `).all(pro.id);

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.date >= new Date().toISOString().split('T')[0]).length,
    revenue: bookings.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.price, 0)
  };

  res.json({ pro, bookings, stats });
});

module.exports = router;
