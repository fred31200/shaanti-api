# Déployer le backend Shaanti (5 minutes)

Le frontend est déjà en ligne → https://shaanti-centre.netlify.app

Pour activer les réservations, il faut héberger le backend.
Voici les étapes exactes (gratuit, 5 minutes) :

---

## Option 1 — Render.com (recommandé, gratuit)

### Étape 1 — Créer un repo GitHub
1. Va sur https://github.com/new
2. Nom du repo : **shaanti-api**
3. Coche "Public"
4. Clique "Create repository"

### Étape 2 — Pousser le code
Ouvre un terminal dans `C:\Users\lesma\Documents\fitbook-app` et tape :

```bash
git remote add origin https://github.com/TON_USERNAME/shaanti-api.git
git push -u origin master
```
(remplace TON_USERNAME par ton nom d'utilisateur GitHub)

### Étape 3 — Déployer sur Render
1. Va sur https://render.com → "New" → "Web Service"
2. Connecte ton repo GitHub "shaanti-api"
3. Configure :
   - **Root Directory** : `backend`
   - **Build Command** : `npm install`
   - **Start Command** : `node src/index.js`
4. Clique "Create Web Service"
5. Attends 2 min → ton URL sera `https://shaanti-api.onrender.com`

### Étape 4 — Vérifier que ça marche
Visite : https://shaanti-api.onrender.com/api/health
→ Tu dois voir : `{"status":"ok","app":"Shaanti"}`

Le site complet sera alors disponible sur :
👉 **https://shaanti-centre.netlify.app**

---

## Option 2 — Tester en local (pour l'instant)

Lance `DEMARRER.bat` dans ce dossier.
Le site sera sur http://localhost:5173 avec toutes les fonctionnalités.
