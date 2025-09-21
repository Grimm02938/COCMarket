# Configuration Guide - COCMarket

## 🔐 Variables d'environnement requises

### Frontend (.env)
Créer un fichier `frontend/.env` avec les variables suivantes :

```env
# URL du backend
VITE_BACKEND_URL=http://localhost:8001

# Clé publique Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_stripe
```

### Backend (.env)
Créer un fichier `backend/.env` avec les variables suivantes :

```env
# Base de données MongoDB
MONGO_URL="mongodb+srv://username:password@cluster.mongodb.net/"
DB_NAME="cocmarket"

# Configuration Stripe
STRIPE_SECRET_KEY="sk_test_votre_cle_secrete_stripe"
STRIPE_PUBLISHABLE_KEY="pk_test_votre_cle_publique_stripe"
STRIPE_WEBHOOK_SECRET="whsec_votre_secret_webhook"
```

## 🔥 Configuration Firebase

### 1. Configuration Frontend
Le fichier `frontend/src/lib/firebase.ts` contient la configuration Firebase :

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyBHCeOGX-2D86NLYdaiSKc4h1VMtFuqZiQ",
  authDomain: "cocmarket-0.firebaseapp.com",
  projectId: "cocmarket-0",
  storageBucket: "cocmarket-0.appspot.com",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID", // À remplacer
  appId: "VOTRE_APP_ID" // À remplacer
};
```

**⚠️ Actions requises :**
1. Aller sur [Firebase Console](https://console.firebase.google.com/project/cocmarket-0)
2. Aller dans Settings > Project settings > General
3. Récupérer le `messagingSenderId` et `appId`
4. Remplacer les valeurs dans le fichier

### 2. Configuration Backend (Firebase Admin SDK)
Créer un fichier `backend/firebase-service-account.json` avec les clés de service :

1. Aller sur [Firebase Console](https://console.firebase.google.com/project/cocmarket-0)
2. Settings > Service accounts
3. Cliquer sur "Generate new private key"
4. Télécharger le fichier JSON
5. Renommer en `firebase-service-account.json` et placer dans `backend/`

## 💳 Configuration Stripe

### Obtenir les clés Stripe :
1. Aller sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Developers > API keys
3. Récupérer :
   - **Publishable key** (pk_test_...) → pour le frontend
   - **Secret key** (sk_test_...) → pour le backend

### Configuration des webhooks (optionnel) :
1. Stripe Dashboard > Developers > Webhooks
2. Créer un endpoint pointant vers votre backend : `/api/webhook/stripe`
3. Récupérer le webhook secret → `STRIPE_WEBHOOK_SECRET`

## 🚨 Sécurité

### Fichiers à ne jamais committer :
- `backend/.env` (contient les clés secrètes)
- `backend/firebase-service-account.json` (clés de service Firebase)
- `frontend/.env` (peut contenir des informations sensibles)

### Ces fichiers sont dans .gitignore :
✅ `backend/.env`
✅ `backend/firebase-service-account.json`  
✅ `frontend/.env.local`

### Fichiers d'exemple fournis :
- `backend/.env.example`
- `frontend/.env.example`

## ✅ Vérification de la configuration

### Vérifier Stripe :
1. Lancer le frontend : dans la console du navigateur, vérifier : `Stripe publishable key: Present`
2. Lancer le backend : vérifier dans les logs : `Stripe configured.`

### Vérifier Firebase :
1. Frontend : tester la connexion Google
2. Backend : vérifier dans les logs : `Firebase Admin SDK initialized successfully.`

### Vérifier la base de données :
1. Backend : vérifier dans les logs la connexion MongoDB

## 🔧 Commandes de test

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

## 📞 Aide

Si vous avez des problèmes de configuration :
1. Vérifiez que tous les fichiers `.env` sont créés
2. Vérifiez que toutes les clés sont correctes
3. Consultez les logs pour identifier l'erreur exacte