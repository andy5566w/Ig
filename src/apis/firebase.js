import { db, auth, storage } from '@/apis/auth.js';
import { doc, getDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
export async function testFirebase(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  return await getDoc(docRef);
}

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { ok: true, data: userCredential };
  } catch (err) {
    if (err.code === 'auth/invalid-email') {
      return { ok: false, errorMessage: 'email or password are invalid' };
    }
    return { ok: false, errorMessage: err.message };
  }
};

export const getImageByName = async (name) => {
  try {
    const imageRef = ref(storage, `images/${name}`);
    return getDownloadURL(imageRef);
  } catch (error) {
    console.log(error);
  }
};

export const getAllImages = async () => {
  const imageRef = ref(storage, 'images/');
  const response = listAll(imageRef);
  const promise = [];
  response.items.forEach((item) => {
    promise.push(getDownloadURL(item));
  });
  return promise;
};

export const createAccountWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { ok: true, data: userCredential };
  } catch (err) {
    if (err.code === 'auth/invalid-email') {
      return { ok: false, errorMessage: 'email or password are invalid' };
    }
    return { ok: false, errorMessage: err.message };
  }
};
