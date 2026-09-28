import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);

// Initialize Firestore with offline persistence enabled
const getDbInstance = () => {
  try {
    const firestoreSettings = {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    };
    return firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
      ? initializeFirestore(app, firestoreSettings, firebaseConfig.firestoreDatabaseId)
      : initializeFirestore(app, firestoreSettings);
  } catch (err) {
    console.warn('Firestore offline persistence initialization notice:', err);
    return getFirestore(app);
  }
};

export const db = getDbInstance();
