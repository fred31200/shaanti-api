// ─── Job de rappels automatiques ─────────────────────────────────────────────
// Tourne toutes les heures. Envoie email + SMS/WhatsApp pour chaque cours
// du lendemain dont le rappel n'a pas encore été envoyé.

const db = require('../database');
const { sendBookingReminder } = require('../services/email');
const { notifyBookingReminder } = require('../services/sms');

async function runReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  let pending;
  try {
    pending = db.prepare(`
      SELECT b.id,
             u.name  AS client_name,
             u.email AS client_email,
             u.phone AS client_phone,
             u2.name AS pro_name,
             s.name  AS service_name,
             sl.date, sl.start_time, sl.end_time
      FROM bookings b
      JOIN users        u  ON u.id  = b.client_id
      JOIN professionals p  ON p.id  = b.professional_id
      JOIN users        u2 ON u2.id = p.user_id
      JOIN services     s  ON s.id  = b.service_id
      JOIN slots        sl ON sl.id = b.slot_id
      WHERE sl.date = ?
        AND b.status = 'confirmed'
        AND b.reminder_sent = 0
    `).all(tomorrowStr);
  } catch (e) {
    // La colonne reminder_sent peut ne pas exister sur les anciennes instances
    console.error('Reminder job DB error:', e.message);
    return;
  }

  for (const bk of pending) {
    try {
      await sendBookingReminder(
        { name: bk.client_name, email: bk.client_email },
        bk
      );
      await notifyBookingReminder(bk.client_phone, bk);
      db.prepare('UPDATE bookings SET reminder_sent = 1 WHERE id = ?').run(bk.id);
      console.log(`📬 Rappel envoyé — booking #${bk.id} (${bk.client_name})`);
    } catch (e) {
      console.error(`Rappel #${bk.id} erreur:`, e.message);
    }
  }

  if (pending.length > 0) {
    console.log(`⏰ ${pending.length} rappel(s) envoyé(s) pour le ${tomorrowStr}`);
  }
}

function start() {
  // Premier check 30 s après démarrage (laisser le temps à la DB de s'init)
  setTimeout(runReminders, 30_000);
  // Puis toutes les heures
  setInterval(runReminders, 60 * 60 * 1000);
  console.log('⏰ Job rappels démarré (vérification horaire)');
}

module.exports = { start };
