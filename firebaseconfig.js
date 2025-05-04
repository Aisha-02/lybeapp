// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDsnlwb_D55tmcDn68UyzYdkyYKfyOey3Y",
    authDomain: "lybe-6c648.firebaseapp.com",
    projectId: "lybe-6c648",
    storageBucket: "lybe-6c648.firebasestorage.app",
    messagingSenderId: "814924696691",
    appId: "1:814924696691:web:32b0acac41910c551bae06",
    measurementId: "G-C31R5L4VBV"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export default app;
