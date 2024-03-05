import { auth, db, storage } from '@/apis/auth.js';
import store from '@/store/index.js';
import {
  addDoc,
  setDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';

// For account
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

// For image
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

export const uploadImage = async (file) => {
  const fileName = `${file.name.split('.')[0]}${Math.random().toString(16).slice(2)}.${file.name.split('.')[1]}`;
  const storageRef = ref(storage, 'images/' + fileName);
  await uploadBytes(storageRef, file);
  return fileName;
};

// For post
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
    publishedAt: Timestamp.fromDate(new Date()),
  };
  const targetCollection = collection(db, 'posts');
  return await addDoc(targetCollection, docPayload);
};

export const getSinglePostById = async (id) => {
  const postSnap = await getDoc(doc(db, 'posts', id));
  if (!postSnap.exists()) {
    console.log('no document at all');
    return;
  }
  return postSnap.data();
};

export const getAllDocFromCollection = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const posts = querySnapshot.docs.map((doc) => {
    return {
      ...doc.data(),
      id: doc.id,
    };
  });
  store.commit('post/MUTATION_POSTS', posts);
  return posts;
};

// For user
export const addUserIntoFirebase = async ({ id, name, email }) => {
  const docPayload = {
    id,
    email,
    name: name || email.split('@')[0],
    avatar: 'default-avatar.jpeg',
    startAt: Timestamp.fromDate(new Date()),
    likes: [],
    favors: [],
  };
  const docRef = doc(db, 'users', id);
  return await setDoc(docRef, docPayload);
};

export const getUserById = async (id) => {
  const docRef = doc(db, 'users', id);
  const userSnap = await getDoc(docRef);
  if (!userSnap.exists()) {
    console.log('no document at all');
    return;
  }
  return userSnap.data();
};
