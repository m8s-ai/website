import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  
  apiKey: "AIzaSyCr-pFFXnQHQyIXEVq5XLoX7hhTRmAM92U",
  authDomain: "m8s-app.firebaseapp.com",
  projectId: "m8s-app",
  storageBucket: "m8s-app.firebasestorage.app",
  messagingSenderId: "752118799510",
  appId: "1:752118799510:web:8c5a38b5c7c8db029636b7",
  measurementId: "G-EFSN0S704L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics };