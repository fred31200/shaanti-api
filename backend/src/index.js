const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const profRoutes = require('./routes/professionals');
const bookingRoutes = require('./routes/bookings');
const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/room');
const reminders = require('./jobs/reminders');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://shaanti-centre.netlify.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/professionals', profRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/room', roomRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'Shaanti', node: process.version }));

// Gestionnaire d'erreurs global — renvoie du JSON, jamais du HTML
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
});

app.listen(PORT, () => {
  console.log(`🌿 Shaanti API démarrée sur http://localhost:${PORT}`);
  reminders.start();
});
