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
  const insertUser = db.prepare(`INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)`);
  const insertPro = db.prepare(`INSERT INTO professionals (user_id, bio, city, category, specialties, rating, review_count) VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const insertService = db.prepare(`INSERT INTO services (professional_id, name, description, duration, price) VALUES (?, ?, ?, ?, ?)`);
  const insertSlot = db.prepare(`INSERT INTO slots (professional_id, date, start_time, end_time) VALUES (?, ?, ?, ?)`);
  const insertRoomSlot = db.prepare(`INSERT INTO room_slots (date, start_time, end_time) VALUES (?, ?, ?)`);

  // Client démo
  insertUser.run('Sophie Martin', 'client@demo.fr', hash('demo123'), 'client', '0612345678');

  // Yoga — Léa
  const u2 = insertUser.run('Léa Dubois', 'lea@yoga.fr', hash('demo123'), 'pro', '0687654321');
  const p1 = insertPro.run(u2.lastInsertRowid,
    'Professeure de yoga certifiée 200h RYT, formée en Inde. Cours de Hatha doux et Vinyasa dynamique pour tous les niveaux.',
    'Centre Shaanti', 'yoga', 'Hatha,Vinyasa,Yin,Prénatal', 4.9, 38);
  insertService.run(p1.lastInsertRowid, 'Cours individuel Hatha', 'Séance personnalisée, postures et respiration', 60, 55);
  insertService.run(p1.lastInsertRowid, 'Cours individuel Vinyasa', 'Enchaînements fluides et dynamiques', 60, 60);
  insertService.run(p1.lastInsertRowid, 'Yin Yoga', 'Étirements profonds et méditation', 75, 65);
  insertService.run(p1.lastInsertRowid, 'Yoga prénatal', 'Adapté aux futures mamans', 60, 60);

  // Danse — Marie
  const u3 = insertUser.run('Marie Leclerc', 'marie@danse.fr', hash('demo123'), 'pro', '0698765432');
  const p2 = insertPro.run(u3.lastInsertRowid,
    'Professeure de danse contemporaine et modern jazz, diplômée d\'État. Cours pour adultes et adolescents, débutants bienvenus.',
    'Centre Shaanti', 'danse', 'Contemporaine,Modern Jazz,Improvisation', 4.8, 52);
  insertService.run(p2.lastInsertRowid, 'Cours de danse contemporaine', 'Expression corporelle et technique moderne', 60, 50);
  insertService.run(p2.lastInsertRowid, 'Modern Jazz', 'Technique jazz avec musicalité et style', 60, 50);
  insertService.run(p2.lastInsertRowid, 'Atelier d\'improvisation', 'Liberté de mouvement et créativité', 90, 65);

  // Pilates — Clara
  const u4 = insertUser.run('Clara Petit', 'clara@pilates.fr', hash('demo123'), 'pro', '0654321987');
  const p3 = insertPro.run(u4.lastInsertRowid,
    'Coach Pilates certifiée, spécialisée en rééducation posturale et renforcement du centre. Studio équipé Reformer.',
    'Centre Shaanti', 'pilates', 'Pilates Mat,Pilates Reformer,Posture', 4.7, 44);
  insertService.run(p3.lastInsertRowid, 'Pilates Mat', 'Travail au sol, renforcement et souplesse', 55, 50);
  insertService.run(p3.lastInsertRowid, 'Pilates Reformer', 'Sur machine, travail en profondeur', 60, 70);
  insertService.run(p3.lastInsertRowid, 'Bilan postural + programme', 'Évaluation et programme personnalisé', 75, 75);

  // Créneaux cours (30 jours)
  const proIds = [p1.lastInsertRowid, p2.lastInsertRowid, p3.lastInsertRowid];
  const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'];

  for (let day = 0; day < 30; day++) {
    const d = new Date();
    d.setDate(d.getDate() + day + 1);
    if (d.getDay() === 0) continue; // pas le dimanche
    const dateStr = d.toISOString().split('T')[0];

    for (const proId of proIds) {
      // Chaque pro n'a pas tous les créneaux chaque jour
      const daySlots = times.filter((_, i) => (i + proId + day) % 2 === 0);
      for (const t of daySlots) {
        const [h, m] = t.split(':').map(Number);
        const totalMin = h * 60 + m + 60;
        const end = `${String(Math.floor(totalMin / 60)).padStart(2, '0')}:${String(totalMin % 60).padStart(2, '0')}`;
        insertSlot.run(proId, dateStr, t, end);
      }
    }
  }

  // Créneaux location de salle (30 jours)
  const roomTimes = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
  for (let day = 0; day < 30; day++) {
    const d = new Date();
    d.setDate(d.getDate() + day + 1);
    if (d.getDay() === 0) continue;
    const dateStr = d.toISOString().split('T')[0];
    for (const t of roomTimes) {
      const [h] = t.split(':').map(Number);
      insertRoomSlot.run(dateStr, t, `${String(h + 1).padStart(2, '0')}:00`);
    }
  }

  console.log('✅ Base de données Shaanti initialisée');
}

seedDatabase();
module.exports = db;
