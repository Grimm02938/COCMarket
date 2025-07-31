# CocMarket - Configuration Firebase

## Variables secrètes GitHub

Les variables suivantes doivent être configurées dans GitHub → Settings → Secrets and variables → Actions :

- `FIREBASE_SERVICE_ACCOUNT_COCMARKET_0` : Clé de service Firebase (déjà configurée)
- `GITHUB_TOKEN` : Token GitHub (automatique)

## Firebase CLI Commands

```bash
# Se connecter à Firebase
firebase login

# Voir les projets
firebase projects:list

# Déployer
firebase deploy

# Voir les logs
firebase functions:log
```

## Configuration locale

Pour tester localement, créer un fichier `.env` dans le dossier frontend :

```
REACT_APP_BACKEND_URL=http://localhost:8001
```

## URLs de production

- Site web : https://cocmarket-0.web.app
- Console Firebase : https://console.firebase.google.com/project/cocmarket-0