import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getDownloadURL, getStorage, ref as storageRef } from 'firebase/storage';
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
const downloadImage = async (uid) => {
    let pfpLink = '';
    try {
        pfpLink = await getDownloadURL(storageRef(storage, `pfp/${uid}/pfp`));
    }
    catch (error) {
        console.error(error);
        pfpLink = '';
    }
    return pfpLink;
};
const fetchProfile = async (uid, hasAvatar = false) => {
    if (!uid) {
        return;
    }
    let display_name = '', username = '', badges = [], pfp = '', bio = '', website = '';
    try {
        if (hasAvatar) {
            pfp = await downloadImage(uid);
        }
        const profile = await Promise.allSettled([
            await getDoc(doc(db, 'users', uid, 'public/profile')),
            await getDoc(doc(db, 'users', uid)),
            await getDoc(doc(db, 'users', uid, 'public/achievements'))
        ]);
        profile.forEach((result, i) => {
            if (result.status != 'fulfilled') {
                return;
            }
            const snap = result.value;
            if (!snap.exists()) {
                return;
            }
            switch (i) {
                case 0:
                    // users/[uid]/public/profile
                    ({ display_name = '', bio = '', website = '' } = snap.data());
                    break;
                case 1:
                    // users/[uid]
                    ({ username = '' } = snap.data());
                    break;
                case 2:
                    // users/[uid]/public/achievements
                    ({ badges = [] } = snap.data());
                    break;
            }
        });
    }
    catch (error) {
        console.error(error);
    }
    finally {
        return {
            uid,
            pfp,
            display_name,
            username,
            bio,
            website,
            badges
        };
    }
};
export { auth, db, storage, userDoc, rtdb, downloadImage, fetchProfile };
//# sourceMappingURL=firebase.js.map