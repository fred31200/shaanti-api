const router = require('express').Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

router.put('/me', authMiddleware, (req, res) => {
  const { name, phone } = req.body;
  db.prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?').run(name, phone, req.user.id);
  res.json({ success: true });
});

module.exports = router;
