import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import store from '@/store/index.js';
import router from '@/route/routes.js';

export const getJwtToken = () => localStorage.getItem('jwt_token');
export const setJwtToken = (token) => localStorage.setItem('jwt_token', token);

const firebaseConfig = {
  apiKey: import.meta.env['VITE_API_KEY'],
  authDomain: 'vuejs-http-2a4c4.firebaseapp.com',
  databaseURL: 'https://vuejs-http-2a4c4.firebaseio.com',
  projectId: 'vuejs-http-2a4c4',
  storageBucket: 'vuejs-http-2a4c4.appspot.com',
  messagingSenderId: '281355232505',
  appId: '1:281355232505:web:d96f3ec2d2b6c40b5dae28',
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

export const storage = getStorage(firebaseApp);

export const logout = async () => {
  await signOut(auth);
  store.commit('user/MUTATION_USER', null);
};

onAuthStateChanged(auth, (userCredential) => {
  if (!userCredential) {
    router.push({ name: 'login' });
    return;
  }
  store.commit('user/MUTATION_USER', {
    ...userCredential?.reloadUserInfo,
    uid: userCredential.uid,
  });
});
