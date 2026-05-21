const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM   = process.env.EMAIL_FROM || 'Shaanti <noreply@shaanti-centre.fr>';
const APP_URL = 'https://shaanti-centre.netlify.app';

// ─── Utilitaires ──────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  const MONTHS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  const DAYS   = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const d = new Date(dateStr + 'T12:00:00Z');
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function base(title, body) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#FDFAF5;font-family:Georgia,'Times New Roman',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FDFAF5;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:#F7F0E6;border-bottom:3px solid #DCC5A8;padding:36px 48px;text-align:center;">
    <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:.35em;text-transform:uppercase;color:#A67C52;">Centre Bien-être</p>
    <p style="margin:0;font-family:Georgia,serif;font-size:34px;font-weight:400;color:#3D2B1F;letter-spacing:.04em;">Shaanti</p>
    <p style="margin:2px 0 0;font-family:Arial,sans-serif;font-size:8px;letter-spacing:.25em;text-transform:uppercase;color:#A67C52;">Thérapies · Bien-être · L'Union</p>
  </td></tr>

  <!-- BODY -->
  ${body}

  <!-- FOOTER -->
  <tr><td style="background:#3D2B1F;padding:28px 48px;text-align:center;">
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;color:#DCC5A8;letter-spacing:.15em;">CENTRE SHAANTI</p>
    <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;color:#A67C52;">37, Route de Bessières · 31240 L'Union</p>
    <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:10px;color:#6B5040;"><a href="${APP_URL}" style="color:#A67C52;text-decoration:none;">${APP_URL.replace('https://', '')}</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

function card(content) {
  return `<tr><td style="background:white;padding:44px 48px;border-left:1px solid #EDE0CC;border-right:1px solid #EDE0CC;">${content}</td></tr>`;
}

function bookingCard(bk) {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F0E6;border:1px solid #DCC5A8;border-radius:6px;margin:20px 0;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:17px;font-weight:bold;color:#3D2B1F;">${bk.service_name || bk.name || ''}</p>
        ${bk.pro_name ? `<p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:13px;color:#8B6340;">avec <strong>${bk.pro_name}</strong></p>` : ''}
        <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:18px;color:#8B6340;font-weight:bold;">${formatDate(bk.date)}</p>
        <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#6F5040;">${bk.start_time} – ${bk.end_time}</p>
        ${bk.price ? `<p style="margin:12px 0 0;font-family:Arial,sans-serif;font-size:15px;color:#3D2B1F;font-weight:bold;">${bk.price}€</p>` : ''}
      </td></tr>
    </table>`;
}

function btn(text, url) {
  return `<a href="${url}" style="display:inline-block;background:#8B6340;color:#FDFAF5;text-decoration:none;padding:13px 32px;border-radius:24px;font-family:Arial,sans-serif;font-size:13px;letter-spacing:.1em;margin-top:12px;">${text}</a>`;
}

function label(text, color = '#5A8A52') {
  return `<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:${color};">${text}</p>`;
}

async function send(to, subject, html) {
  if (!resend) { console.log(`📧 [email simulé → ${to}] ${subject}`); return; }
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error('Resend error:', err.message);
  }
}

// ─── Emails ───────────────────────────────────────────────────────────────────

async function sendWelcome(user) {
  const html = base('Bienvenue chez Shaanti', card(`
    ${label('Bienvenue', '#A67C52')}
    <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#3D2B1F;">Bonjour ${user.name} ✨</h2>
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#6F5040;">
      Votre compte est créé. Réservez dès maintenant vos cours de yoga, pilates et danse avec nos coachs au Centre Shaanti.
    </p>
    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#6F5040;">
      📍 <strong>37, Route de Bessières – 31240 L'Union</strong>
    </p>
    ${btn('Découvrir nos cours →', APP_URL + '/cours')}
  `));
  await send(user.email, '🌿 Bienvenue chez Shaanti', html);
}

async function sendBookingConfirmation(user, bk) {
  const html = base('Réservation confirmée', card(`
    ${label('Réservation confirmée')}
    <h2 style="margin:0 0 4px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#3D2B1F;">C'est confirmé !</h2>
    <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:14px;color:#6F5040;">Votre cours est réservé. À bientôt !</p>
    ${bookingCard(bk)}
    <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#6F5040;">
      📍 <strong>37, Route de Bessières, 31240 L'Union</strong> — Salle Ananda
    </p>
    <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#A67C52;">
      Annulation possible jusqu'à 2h avant le cours depuis votre espace.
    </p>
    ${btn('Mon espace', APP_URL + '/espace')}
  `));
  await send(user.email, `✅ ${bk.service_name} — ${formatDate(bk.date)} à ${bk.start_time}`, html);
}

async function sendBookingReminder(user, bk) {
  const html = base('Rappel de cours', card(`
    ${label('Rappel J-1', '#A67C52')}
    <h2 style="margin:0 0 16px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#3D2B1F;">Votre cours est demain 🌿</h2>
    ${bookingCard(bk)}
    <p style="margin:16px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#6F5040;">
      📍 <strong>37, Route de Bessières, 31240 L'Union</strong>
    </p>
  `));
  await send(user.email, `🔔 Demain à ${bk.start_time} — ${bk.service_name}`, html);
}

async function sendCancellation(user, bk) {
  const html = base('Annulation', card(`
    <h2 style="margin:0 0 20px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#3D2B1F;">Annulation confirmée</h2>
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.7;color:#6F5040;">
      Votre cours du <strong>${formatDate(bk.date)} à ${bk.start_time}</strong> a bien été annulé.
      Le créneau est libéré.
    </p>
    ${btn('Réserver un autre cours', APP_URL + '/cours')}
  `));
  await send(user.email, `Annulation — cours du ${formatDate(bk.date)}`, html);
}

async function sendRoomConfirmation(user, bk) {
  const html = base('Salle Ananda réservée', card(`
    ${label('Location confirmée')}
    <h2 style="margin:0 0 4px;font-family:Georgia,serif;font-size:26px;font-weight:400;color:#3D2B1F;">La salle Ananda est à vous !</h2>
    ${bookingCard({ ...bk, service_name: 'Salle Ananda', pro_name: null })}
    ${bk.purpose ? `<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#6F5040;"><em>Objet : ${bk.purpose}</em></p>` : ''}
    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#6F5040;">
      📍 <strong>37, Route de Bessières, 31240 L'Union</strong>
    </p>
    ${btn('Mon espace', APP_URL + '/espace')}
  `));
  await send(user.email, `✅ Salle Ananda — ${formatDate(bk.date)} ${bk.start_time}–${bk.end_time}`, html);
}

module.exports = {
  sendWelcome,
  sendBookingConfirmation,
  sendBookingReminder,
  sendCancellation,
  sendRoomConfirmation,
};
