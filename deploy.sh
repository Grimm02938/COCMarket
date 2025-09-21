#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status.

echo "🚀 Starting Frontend Deployment for CocMarket..."
echo "=============================================="

# Navigate to the frontend directory
echo "1. Navigating to the frontend directory..."
cd frontend

# Install dependencies using npm ci for cleaner installs in CI environments
echo "2. Installing dependencies..."
npm ci

# Build the production version of the site
echo "3. Building for production..."
npm run build

# Deploy only to Firebase Hosting
echo "4. Deploying to Firebase Hosting..."
# The --only hosting flag ensures only the frontend is deployed.
# The FIREBASE_TOKEN environment variable must be set in your CI/CD settings.
firebase deploy --only hosting --token "$FIREBASE_TOKEN"

echo "✅ Deployment successful!"
echo "🌐 Your site should be live at: https://cocmarket-0.web.app"
