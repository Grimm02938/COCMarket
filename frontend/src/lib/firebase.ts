// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBHCeOGX-2D86NLYdaiSKc4h1VMtFuqZiQ',
  authDomain: 'cocmarket-0.firebaseapp.com',
  projectId: 'cocmarket-0',
  storageBucket: 'cocmarket-0.appspot.com',
  messagingSenderId: '42792374848',
  appId: '1:42792374848:web:b062f4f4db04e1e6056507'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Function to sign in with Google
export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};
