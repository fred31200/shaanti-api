// ─── SMS & WhatsApp via Twilio ─────────────────────────────────────────────
// Variables d'env requises :
//   TWILIO_ACCOUNT_SID   — Account SID (commence par AC…)
//   TWILIO_AUTH_TOKEN    — Auth token
//   TWILIO_SMS_FROM      — Numéro Twilio pour SMS  ex: +33757xxxxxx
//   TWILIO_WA_FROM       — Numéro WhatsApp Twilio  ex: whatsapp:+14155238886
//                          (sandbox Twilio = whatsapp:+14155238886)

let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log('📱 Twilio connecté');
  } catch (e) {
    console.warn('⚠️  Twilio non disponible:', e.message);
  }
}

const SMS_FROM = process.env.TWILIO_SMS_FROM;
const WA_FROM  = process.env.TWILIO_WA_FROM || 'whatsapp:+14155238886';

// Normalise un numéro français → format E.164 (+33…)
function normalizePhone(phone) {
  if (!phone) return null;
  const clean = phone.replace(/[\s\-\.]/g, '');
  if (clean.startsWith('+')) return clean;
  if (clean.startsWith('0')) return '+33' + clean.slice(1);
  return '+33' + clean;
}

async function sendSMS(phone, message) {
  if (!client || !SMS_FROM) return;
  const to = normalizePhone(phone);
  if (!to) return;
  try {
    await client.messages.create({ from: SMS_FROM, to, body: message });
    console.log(`📱 SMS → ${to}`);
  } catch (e) {
    console.error('SMS error:', e.message);
  }
}

async function sendWhatsApp(phone, message) {
  if (!client) return;
  const to = normalizePhone(phone);
  if (!to) return;
  try {
    await client.messages.create({ from: WA_FROM, to: 'whatsapp:' + to, body: message });
    console.log(`💬 WhatsApp → ${to}`);
  } catch (e) {
    console.error('WhatsApp error:', e.message);
  }
}

// ─── Messages métier ────────────────────────────────────────────────────────

function formatDateShort(dateStr) {
  const MONTHS = ['jan','fév','mars','avr','mai','juin','juil','août','sep','oct','nov','déc'];
  const d = new Date(dateStr + 'T12:00:00Z');
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

async function notifyBookingConfirmation(phone, bk) {
  if (!phone) return;
  const msg =
    `🌿 Shaanti — Réservation confirmée !\n` +
    `📚 ${bk.service_name}\n` +
    (bk.pro_name ? `👤 avec ${bk.pro_name}\n` : '') +
    `📅 ${formatDateShort(bk.date)} à ${bk.start_time}\n` +
    `📍 37 Rte de Bessières, L'Union\n\n` +
    `Gérez vos réservations : shaanti-centre.netlify.app/espace`;
  await sendSMS(phone, msg);
  await sendWhatsApp(phone, msg);
}

async function notifyBookingReminder(phone, bk) {
  if (!phone) return;
  const msg =
    `🔔 Shaanti — Rappel !\n` +
    `Votre cours "${bk.service_name}" est demain à ${bk.start_time}\n` +
    (bk.pro_name ? `👤 ${bk.pro_name}\n` : '') +
    `📍 37 Rte de Bessières, L'Union`;
  await sendSMS(phone, msg);
  await sendWhatsApp(phone, msg);
}

async function notifyRoomConfirmation(phone, bk) {
  if (!phone) return;
  const msg =
    `🏛️  Shaanti — Salle Ananda réservée !\n` +
    `📅 ${formatDateShort(bk.date)} — ${bk.start_time} à ${bk.end_time}\n` +
    (bk.purpose ? `📝 ${bk.purpose}\n` : '') +
    `📍 37 Rte de Bessières, L'Union`;
  await sendSMS(phone, msg);
  await sendWhatsApp(phone, msg);
}

module.exports = {
  sendSMS,
  sendWhatsApp,
  notifyBookingConfirmation,
  notifyBookingReminder,
  notifyRoomConfirmation,
};
