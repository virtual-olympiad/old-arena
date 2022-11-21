import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { collection, doc, getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'virtualolympiad.firebaseapp.com',
	databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
	projectId: 'virtualolympiad',
	storageBucket: 'virtualolympiad.appspot.com',
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

let db = getFirestore(app);
const userDoc = (uid) => doc(db, 'users', uid);

const rtdb = getDatabase(app);
const storage = getStorage(app);

export { auth, db, storage, userDoc, rtdb };
