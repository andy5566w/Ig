import {
  signIn,
  createAccountWithEmailAndPassword,
  addUserIntoFirebase,
  updateUser,
  getUserById,
  updatePost,
  getSinglePostById,
} from '@/apis/firebase.js';
import { auth } from '@/apis/auth.js';
import Swal from 'sweetalert2';

export const user = {
  namespaced: true,
  state() {
    return {
      userInfo: null,
    };
  },
  mutations: {
    MUTATION_USER(state, userInfo) {
      state.userInfo = userInfo;
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
    async likePost({ dispatch }, { postId }) {
      const user = await getUserById(auth.currentUser.uid);
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
    async addToFavors({ dispatch }, { postId }) {
      const user = await getUserById(auth.currentUser.uid);
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
  },
};
