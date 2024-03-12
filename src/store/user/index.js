import {
  signIn,
  createAccountWithEmailAndPassword,
  addUserIntoFirebase,
  updateUser,
  getUserById,
  updatePost,
  getSinglePostById,
  uploadImage,
} from '@/apis/firebase.js';
import Swal from 'sweetalert2';

export const user = {
  namespaced: true,
  state() {
    return {
      userInfo: null,
      userDoc: {},
    };
  },
  mutations: {
    MUTATION_USER(state, userInfo) {
      state.userInfo = userInfo;
    },
    MUTATION_USER_DOC(state, userDoc) {
      state.userDoc = userDoc;
    },
  },
  actions: {
    async signIn({ commit }, { email, password }) {
      const { ok, data: user, errorMessage } = await signIn(email, password);
      if (!ok) {
        Swal.fire({
          icon: 'error',
          text: errorMessage,
        });
      }
      return { ok, data: user, errorMessage };
    },
    async createAccount({ commit }, { email, password }) {
      const {
        ok,
        data: user,
        errorMessage,
      } = await createAccountWithEmailAndPassword(email, password);
      await addUserIntoFirebase({
        id: user.user.uid,
        email: user.user.email,
        name: user.user.displayName,
      });
      if (!ok) {
        Swal.fire({
          icon: 'error',
          text: errorMessage,
        });
      }
      return { ok, data: user, errorMessage };
    },
    async getUserByUserId({ commit }, userId) {
      const user = await getUserById(userId);
      commit('MUTATION_USER_DOC', user);
    },
    async likePost({ dispatch, rootState, state }, { postId }) {
      const user = state.userDoc;
      const post = await getSinglePostById(postId);
      const userIndex = user.likes.findIndex((id) => id === postId);
      const postIndex = post.likes.findIndex((id) => id === user.id);
      const isAlreadyLiked = userIndex !== -1 && postIndex !== -1;
      if (isAlreadyLiked) {
        user.likes.splice(userIndex, 1);
        post.likes.splice(postIndex, 1);
      } else {
        user.likes.push(postId);
        post.likes.push(user.id);
      }
      const promises = [updateUser(user), updatePost({ ...post, id: postId })];
      dispatch(
        'post/togglePostLike',
        { postId, likes: post.likes },
        { root: true },
      );
      await Promise.all(promises);
    },
    async addToFavors({ dispatch, rootState, state }, { postId }) {
      const user = state.userDoc;
      const post = await getSinglePostById(postId);
      const userIndex = user.favors.findIndex((id) => id === postId);
      const postIndex = post.favors.findIndex((id) => id === user.id);
      const isAlreadyLiked = userIndex !== -1 && postIndex !== -1;
      if (isAlreadyLiked) {
        user.favors.splice(userIndex, 1);
        post.favors.splice(postIndex, 1);
      } else {
        user.favors.push(postId);
        post.favors.push(user.id);
      }
      const promises = [updateUser(user), updatePost({ ...post, id: postId })];
      dispatch(
        'post/togglePostFavor',
        { postId, favors: post.favors },
        { root: true },
      );
      await Promise.all(promises);
    },
    async updateUser({ commit, state }, { file, profileData }) {
      const fileName = file ? await uploadImage(file) : state.userDoc.avatar;
      const newUserDoc = {
        ...state.userDoc,
        ...profileData,
        avatar: fileName,
      };
      await updateUser(newUserDoc);
      commit('MUTATION_USER_DOC', newUserDoc);
    },
  },
};
