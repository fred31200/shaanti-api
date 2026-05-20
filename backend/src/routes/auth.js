const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { SECRET } = require('../middleware/auth');

router.post('/register', (req, res) => {
  const { name, email, password, role = 'client', phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Champs requis manquants' });

  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'Email déjà utilisé' });

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)').run(name, email, hash, role, phone || null);

  const token = jwt.sign({ id: result.lastInsertRowid, email, role }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: result.lastInsertRowid, name, email, role } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
});

router.get('/me', (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Non authentifié' });
  try {
    const payload = jwt.verify(header.split(' ')[1], SECRET);
    const user = db.prepare('SELECT id, name, email, role, avatar, phone FROM users WHERE id = ?').get(payload.id);
    res.json(user);
  } catch {
    res.status(401).json({ error: 'Token invalide' });
  }
});

module.exports = router;
