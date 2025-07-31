#!/bin/bash

echo "🚀 Script de déploiement CocMarket"
echo "=================================="

# Aller dans le dossier frontend
cd frontend

echo "📦 Installation des dépendances..."
npm ci

echo "🔨 Build de production..."
npm run build

echo "🌐 Déploiement sur Firebase..."
firebase deploy

echo "✅ Déploiement terminé !"
echo "🌐 Votre site est disponible à : https://cocmarket-0.web.app"