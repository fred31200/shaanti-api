const { DatabaseSync } = require('node:sqlite');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'zenbook.db');
const db = new DatabaseSync(dbPath);

db.exec(`PRAGMA journal_mode = WAL`);
db.exec(`PRAGMA foreign_keys = ON`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'client',
    avatar TEXT,
    phone TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS professionals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    bio TEXT,
    address TEXT,
    city TEXT,
    zip TEXT,
    category TEXT NOT NULL,
    specialties TEXT,
    rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    price REAL NOT NULL,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professional_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    is_booked INTEGER DEFAULT 0,
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    professional_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    slot_id INTEGER NOT NULL,
    status TEXT DEFAULT 'confirmed',
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (professional_id) REFERENCES professionals(id),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (slot_id) REFERENCES slots(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    professional_id INTEGER NOT NULL,
    booking_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (professional_id) REFERENCES professionals(id)
  );

  CREATE TABLE IF NOT EXISTS room_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    is_booked INTEGER DEFAULT 0,
    price REAL DEFAULT 25
  );

  CREATE TABLE IF NOT EXISTS room_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    slot_id INTEGER NOT NULL,
    purpose TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (slot_id) REFERENCES room_slots(id)
  );
`);

function seedDatabase() {
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get();
  if (count.c > 0) return;

  const hash = (pwd) => bcrypt.hashSync(pwd, 10);
  const insertUser = db.prepare(`INSERT INTO users (name, email, password, role, avatar, phone) VALUES (?, ?, ?, ?, ?, ?)`);
  const insertPro = db.prepare(`INSERT INTO professionals (user_id, bio, address, city, zip, category, specialties, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertService = db.prepare(`INSERT INTO services (professional_id, name, description, duration, price) VALUES (?, ?, ?, ?, ?)`);
  const insertSlot = db.prepare(`INSERT INTO slots (professional_id, date, start_time, end_time) VALUES (?, ?, ?, ?)`);
  const insertRoomSlot = db.prepare(`INSERT INTO room_slots (date, start_time, end_time, price) VALUES (?, ?, ?, ?)`);

  const ADDR = '37, Route de Bessières';
  const CITY = "L'Union";
  const ZIP  = '31240';
  const PHOTO_BASE = 'https://liberfitmedia.s3.fr-par.scw.cloud/media/';

  // ── Compte démo admin ──────────────────────────────────────────
  insertUser.run('Frédéric Navarre', 'admin@shaanti-centre.fr', hash('shaanti2026'), 'client', null, '+33666233026');

  // ══════════════════════════════════════════════════════════════
  // YOGA
  // ══════════════════════════════════════════════════════════════

  // Sabrina B — Yoga (Yin, enfants, sonothérapie)
  const uSabrina = insertUser.run(
    'Sabrina B.',
    'sabrina@shaanti-centre.fr',
    hash('shaanti2026'),
    'pro',
    PHOTO_BASE + 'Photo_Sabrina.jpg',
    null
  );
  const pSabrina = insertPro.run(
    uSabrina.lastInsertRowid,
    `Passionnée par l'humain, le corps et le mouvement depuis mon plus jeune âge, j'ai découvert la méditation, puis le yoga, durant mes études de psychologie pour m'aider à mieux gérer entre autres mes douleurs chroniques.\n\nLe yoga est devenu, au fil des années, un compagnon de vie bienveillant.\n\nFormée en Yin yoga (2022), en yoga pour enfants & ados (2023), j'accompagne aujourd'hui avec joie celles et ceux qui souhaitent découvrir ou approfondir leur pratique.\n\nMon approche met l'accent sur la singularité de chacun.e avec douceur, bienveillance, écoute et respect.\n\nEn 2024, c'est la sonothérapie qui est venue enrichir mon approche.\n\nToujours curieuse, je continue à me former pour offrir un yoga vivant, sensible et adapté, nourri de psychologie, de méditation, de pranayama, et de sonothérapie.`,
    ADDR, CITY, ZIP, 'yoga',
    'Yin Yoga,Yoga Enfants & Ados,Méditation,Pranayama,Sonothérapie',
    4.9, 24
  );
  insertService.run(pSabrina.lastInsertRowid, 'Yin Yoga', 'Étirements profonds, relâchement et méditation pour tous niveaux', 75, 15);
  insertService.run(pSabrina.lastInsertRowid, 'Yoga Enfants & Ados', 'Pratique adaptée aux jeunes (6-17 ans), jeux et conscience corporelle', 60, 15);
  insertService.run(pSabrina.lastInsertRowid, 'Cours particulier Yoga', 'Séance individuelle personnalisée avec approche sonothérapie', 60, 65);

  // Elodie S — YinYang Yoga + Bachata Lady Style
  const uElodie = insertUser.run(
    'Elodie S.',
    'elodie@shaanti-centre.fr',
    hash('shaanti2026'),
    'pro',
    PHOTO_BASE + 'Photo_Elodie_Bachata.jpg',
    null
  );
  const pElodie = insertPro.run(
    uElodie.lastInsertRowid,
    `Danseuse et professeure de yoga certifiée, je propose des pratiques qui allient mouvement, ancrage et expression de soi.\n\nMon approche est née d'un besoin profond de me reconnecter à mon corps, de retrouver confiance, force et douceur après certaines épreuves de vie. Aujourd'hui, j'accompagne chacun·e avec bienveillance, respect et une exigence juste.\n\nJe propose deux types de cours de YinYang Yoga :\n• Un cours axé sur le renforcement, pour cultiver la stabilité, l'ancrage et l'énergie.\n• Un cours orienté fluidité et souplesse, pour délier le corps, bouger avec grâce et conscience.\n\nEn complément, j'anime un cours de Bachata Lady Style niveau débutant, conçu comme un espace pour développer la connexion à son corps, renforcer la confiance en soi et se reconnecter à sa féminité.`,
    ADDR, CITY, ZIP, 'yoga',
    'YinYang Yoga,Yoga Renforcement,Yoga Fluidité,Bachata Lady Style',
    4.8, 18
  );
  insertService.run(pElodie.lastInsertRowid, 'YinYang Yoga — Renforcement', 'Yoga dynamique pour cultiver stabilité, ancrage et énergie', 60, 15);
  insertService.run(pElodie.lastInsertRowid, 'YinYang Yoga — Fluidité', 'Yoga doux pour délier le corps et bouger avec grâce et conscience', 60, 15);
  insertService.run(pElodie.lastInsertRowid, 'Bachata Lady Style (débutant)', 'Connexion au corps, confiance en soi et féminité par la danse', 60, 10);

  // Laurence Cabrol — Yoga
  const uLaurence = insertUser.run(
    'Laurence Cabrol',
    'laurence@shaanti-centre.fr',
    hash('shaanti2026'),
    'pro',
    null,
    null
  );
  const pLaurence = insertPro.run(
    uLaurence.lastInsertRowid,
    'Professeure de yoga au Centre Shaanti, j\'accompagne mes élèves dans une pratique douce et bienveillante, accessible à tous les niveaux.',
    ADDR, CITY, ZIP, 'yoga',
    'Yoga,Méditation,Bien-être',
    4.7, 12
  );
  insertService.run(pLaurence.lastInsertRowid, 'Cours de Yoga', 'Pratique équilibrée alliant postures, respiration et relaxation', 60, 15);
  insertService.run(pLaurence.lastInsertRowid, 'Cours particulier Yoga', 'Accompagnement individuel personnalisé', 60, 60);

  // ══════════════════════════════════════════════════════════════
  // DANSE
  // ══════════════════════════════════════════════════════════════

  // Priscilla D — Salsa Lady Style + Danses Brésiliennes
  const uPriscilla = insertUser.run(
    'Priscilla D.',
    'priscilla@shaanti-centre.fr',
    hash('shaanti2026'),
    'pro',
    PHOTO_BASE + 'Photo_Profil.jpg',
    null
  );
  const pPriscilla = insertPro.run(
    uPriscilla.lastInsertRowid,
    `Passionnée par les danses latines et brésiliennes, j'ai eu la chance de danser de nombreuses années sur scène, en France et à l'étranger. Ces expériences riches et intenses m'ont permis de vivre la danse comme un véritable langage d'expression et de partage.\n\nAujourd'hui, je souhaite transmettre cet univers à travers des cours de salsa lady style et de danses brésiliennes, dans une atmosphère chaleureuse et bienveillante.\n\nQue vous soyez débutant(e) ou déjà passionné(e), je vous accompagnerai avec simplicité, pédagogie et bonne humeur, pour que chaque cours soit un moment d'épanouissement et de plaisir dans le mouvement.`,
    ADDR, CITY, ZIP, 'danse',
    'Salsa Lady Style,Danses Brésiliennes,Samba,Forró',
    4.9, 31
  );
  insertService.run(pPriscilla.lastInsertRowid, 'Salsa Lady Style', 'Technique, style et sensualité dans la danse latine — tous niveaux', 60, 10);
  insertService.run(pPriscilla.lastInsertRowid, 'Danses Brésiliennes', 'Samba, Forró et rythmes brésiliens — débutants bienvenus', 60, 10);
  insertService.run(pPriscilla.lastInsertRowid, 'Cours particulier Danse', 'Accompagnement individuel adapté à votre niveau et vos objectifs', 60, 55);

  // Satya F — Danse féminine & expression
  const uSatya = insertUser.run(
    'Satya F.',
    'satya@shaanti-centre.fr',
    hash('shaanti2026'),
    'pro',
    PHOTO_BASE + 'IMG_4663.JPG',
    null
  );
  const pSatya = insertPro.run(
    uSatya.lastInsertRowid,
    `Passant de nombreuses années à se produire pour divers événements, Satya a souhaité renouer avec l'essentiel : danser avec l'émotion du moment, en saisissant la magie de l'instant présent.\n\nLoin de la technique et de la performance, elle se laisse porter par la musique, son corps et son cœur. Les cours qu'elle propose se veulent en résonnance avec la féminité de chacune et chacun, cette part douce qui sommeille en nous.\n\nCe cours est un espace où l'on s'autorise à décompresser et se libérer, se reconnecter à soi et à son corps. Une invitation à s'aimer tel.le que l'on est et à accueillir ses émotions en toute bienveillance.`,
    ADDR, CITY, ZIP, 'danse',
    'Danse Féminine,Expression Corporelle,Danse Intuitive',
    4.8, 22
  );
  insertService.run(pSatya.lastInsertRowid, 'Danse Féminine & Expression', 'Reconnexion au corps, à l\'émotion et à la féminité par le mouvement', 60, 10);
  insertService.run(pSatya.lastInsertRowid, 'Atelier Danse Intuitive', 'Espace de liberté et d\'expression sans jugement ni performance', 90, 15);
  insertService.run(pSatya.lastInsertRowid, 'Cours particulier Danse', 'Accompagnement individuel sensible et bienveillant', 60, 55);

  // ══════════════════════════════════════════════════════════════
  // PILATES
  // ══════════════════════════════════════════════════════════════

  // Jessica B — Pilates & Pilates Postural Ball
  const uJessica = insertUser.run(
    'Jessica B.',
    'jessica@shaanti-centre.fr',
    hash('shaanti2026'),
    'pro',
    PHOTO_BASE + 'Photo_Jessica.jpg',
    null
  );
  const pJessica = insertPro.run(
    uJessica.lastInsertRowid,
    `Passionnée de sport depuis mon plus jeune âge, j'exerce comme coach sportive et maître-nageuse depuis 6 ans.\n\nBienveillante et passionnée par mon métier, vous pourrez me retrouver dans les cours de Pilates et les cours de Pilates Posturall Ball qui vous offriront un vrai moment de détente et de bien-être. Ces deux activités ont pour objectif le développement et le renforcement des muscles profonds, l'amélioration de la posture et l'équilibre musculaire ainsi que l'assouplissement.\n\nLes pratiques douces permettent de trouver un équilibre et une harmonie parfaite avec les activités physiques intenses et votre quotidien.\n\nNous nous retrouverons sur ces cours pour une belle combinaison entre remise en forme et détente parce que quoi qu'on en dise… le mouvement c'est la vie !`,
    ADDR, CITY, ZIP, 'pilates',
    'Pilates Mat,Pilates Postural Ball,Renforcement Musculaire,Souplesse',
    4.9, 29
  );
  insertService.run(pJessica.lastInsertRowid, 'Pilates Mat', 'Renforcement des muscles profonds, posture et souplesse', 55, 15);
  insertService.run(pJessica.lastInsertRowid, 'Pilates Postural Ball', 'Travail de la posture et de l\'équilibre avec le ballon', 55, 15);
  insertService.run(pJessica.lastInsertRowid, 'Cours particulier Pilates', 'Accompagnement individuel personnalisé selon vos besoins', 60, 65);

  // Laure S — Pilates & Sport-Santé
  const uLaure = insertUser.run(
    'Laure S.',
    'laure@shaanti-centre.fr',
    hash('shaanti2026'),
    'pro',
    PHOTO_BASE + 'PHotoLaureSct.jpg',
    null
  );
  const pLaure = insertPro.run(
    uLaure.lastInsertRowid,
    `Passionnée par le sport depuis 2014, j'en ai fait mon métier il y a plusieurs années. Attirée par le domaine du Sport-Santé, je souhaite rendre la pratique de l'activité physique accessible à tous, en mettant l'accent sur le bien-être.\n\nJe me suis spécialisée en Pilates, une discipline que j'affectionne particulièrement pour le contrôle qu'elle demande au corps et à l'esprit. Et ne vous y trompez pas : on peut tout à fait transpirer et se dépasser pendant les cours !`,
    ADDR, CITY, ZIP, 'pilates',
    'Pilates Mat,Sport-Santé,Renforcement,Rééducation Posturale',
    4.8, 35
  );
  insertService.run(pLaure.lastInsertRowid, 'Pilates Mat', 'Pilates au sol, contrôle et renforcement du centre', 55, 15);
  insertService.run(pLaure.lastInsertRowid, 'Pilates Sport-Santé', 'Pilates adapté, accessible à tous et orienté bien-être', 55, 15);
  insertService.run(pLaure.lastInsertRowid, 'Cours particulier Pilates', 'Séance individuelle avec programme personnalisé Sport-Santé', 60, 65);

  // Claire Schaeffer — Pilates
  const uClaire = insertUser.run(
    'Claire Schaeffer',
    'claire@shaanti-centre.fr',
    hash('shaanti2026'),
    'pro',
    PHOTO_BASE + 'PhotoProfil.jpeg',
    null
  );
  const pClaire = insertPro.run(
    uClaire.lastInsertRowid,
    'Professeure de Pilates au Centre Shaanti, je vous accompagne dans une pratique rigoureuse et bienveillante pour retrouver force, souplesse et équilibre.',
    ADDR, CITY, ZIP, 'pilates',
    'Pilates Mat,Renforcement,Souplesse',
    4.7, 10
  );
  insertService.run(pClaire.lastInsertRowid, 'Pilates Mat', 'Cours collectif au sol, renforcement et tonicité', 55, 15);
  insertService.run(pClaire.lastInsertRowid, 'Cours particulier Pilates', 'Séance individuelle sur mesure', 60, 65);

  // ══════════════════════════════════════════════════════════════
  // CRÉNEAUX (30 jours)
  // ══════════════════════════════════════════════════════════════
  const proList = [
    { id: pSabrina.lastInsertRowid, days: [1,3,6], times: ['09:30','18:00','19:15'] },  // Lun, Mer, Sam
    { id: pElodie.lastInsertRowid,  days: [2,4,6], times: ['09:00','18:30','10:30'] },  // Mar, Jeu, Sam
    { id: pLaurence.lastInsertRowid,days: [1,4],   times: ['10:30','17:00']         },  // Lun, Jeu
    { id: pPriscilla.lastInsertRowid,days:[2,5,6], times: ['19:00','10:00','11:30'] },  // Mar, Ven, Sam
    { id: pSatya.lastInsertRowid,   days: [3,6],   times: ['19:15','10:00']         },  // Mer, Sam
    { id: pJessica.lastInsertRowid, days: [1,3,5], times: ['09:00','10:00','18:30'] },  // Lun, Mer, Ven
    { id: pLaure.lastInsertRowid,   days: [2,4,6], times: ['09:30','10:45','19:00'] },  // Mar, Jeu, Sam
    { id: pClaire.lastInsertRowid,  days: [1,5],   times: ['11:00','18:30']         },  // Lun, Ven
  ];

  for (let day = 0; day < 60; day++) {
    const d = new Date();
    d.setDate(d.getDate() + day + 1);
    if (d.getDay() === 0) continue; // pas le dimanche
    const dateStr = d.toISOString().split('T')[0];
    const dow = d.getDay(); // 1=Lun ... 6=Sam

    for (const pro of proList) {
      if (!pro.days.includes(dow)) continue;
      for (const t of pro.times) {
        const [h, m] = t.split(':').map(Number);
        const totalMin = h * 60 + m + 55;
        const end = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
        insertSlot.run(pro.id, dateStr, t, end);
      }
    }
  }

  // ══════════════════════════════════════════════════════════════
  // LOCATION SALLE ANANDA (60 jours)
  // Prix : 40€ demi-journée / 25€ à l'heure
  // ══════════════════════════════════════════════════════════════
  const roomTimes = [
    '08:00','09:00','10:00','11:00','12:00',
    '14:00','15:00','16:00','17:00','18:00','19:00','20:00'
  ];
  for (let day = 0; day < 60; day++) {
    const d = new Date();
    d.setDate(d.getDate() + day + 1);
    if (d.getDay() === 0) continue;
    const dateStr = d.toISOString().split('T')[0];
    for (const t of roomTimes) {
      const [h] = t.split(':').map(Number);
      insertRoomSlot.run(dateStr, t, `${String(h + 1).padStart(2, '0')}:00`, 25);
    }
  }

  console.log('✅ Base de données Shaanti initialisée avec les 8 coachs réels');
}

seedDatabase();
module.exports = db;
