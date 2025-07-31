# CocMarket - Marketplace pour villages Clash of Clans

CocMarket est une plateforme moderne de vente et d'achat de villages Clash of Clans avec un système de paiement sécurisé et une livraison instantanée.

## 🚀 Fonctionnalités

- **Marketplace avancé** avec filtres par niveau HDV, prix, serveur
- **2 modes de livraison** : Protection activée (automatique) et Protection désactivée (manuel)
- **Système d'avis certifiés** avec notes et commentaires
- **Interface moderne** avec thème sombre et effets 3D
- **Responsive design** optimisé mobile et desktop

## 🛠️ Technologies

- **Frontend** : React + TypeScript + Vite + Tailwind CSS
- **Backend** : FastAPI + Python + MongoDB
- **Déploiement** : Firebase Hosting + GitHub Actions
- **UI Components** : Radix UI + shadcn/ui

## 📁 Structure du projet

```
COCMarket/
├── frontend/          # Application React
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # API FastAPI
│   ├── server.py
│   └── requirements.txt
└── .github/workflows/ # Déploiement automatique
```

## 🔧 Installation et développement

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001
```

## 🚀 Déploiement

Le projet utilise Firebase Hosting avec déploiement automatique via GitHub Actions.

### Configuration Firebase
1. Installer Firebase CLI : `npm install -g firebase-tools`
2. Se connecter : `firebase login`
3. Déployer : `firebase deploy`

### Déploiement automatique
- **Push sur `main`** → Déploiement automatique en production
- **Pull Request** → Déploiement automatique en preview

## 🌐 URLs

- **Site en production** : https://cocmarket-0.web.app
- **API Backend** : Configuré dans les variables d'environnement
- **Repository GitHub** : https://github.com/Grimm02938/COCMarket

## 🔐 Variables d'environnement

### Frontend (.env)
```
REACT_APP_BACKEND_URL=votre_url_backend
```

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=cocmarket_db
```

## 📝 Scripts disponibles

### Frontend
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Preview du build

### Backend
- `uvicorn server:app --reload` - Serveur de développement
- `uvicorn server:app --host 0.0.0.0 --port 8001` - Serveur de production

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📧 Contact

Pour toute question ou suggestion, contactez : abdelmoulaadame800@gmail.com
