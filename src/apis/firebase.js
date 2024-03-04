import { db, auth, storage } from '@/apis/auth.js';
import store from '@/store/index.js';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
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

export const uploadImage = async (file) => {
  const fileName = `${file.name.split('.')[0]}${Math.random().toString(16).slice(2)}.${file.name.split('.')[1]}`;
  const storageRef = ref(storage, 'images/' + fileName);
  await uploadBytes(storageRef, file);
  return fileName;
};

export const addPostIntoFirebase = async ({
  imageName = 'this is for test',
  description,
}) => {
  const docPayload = {
    imageName,
    description,
    author: store.state.user.userInfo.uid,
    likes: [],
    comments: [],
  };
  const targetCollection = collection(db, 'posts');
  await addDoc(targetCollection, docPayload);
};
