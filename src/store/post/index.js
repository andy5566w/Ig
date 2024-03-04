import {
  addPostIntoFirebase,
  uploadImage,
  getAllDocFromCollection,
  getSinglePostById,
} from '@/apis/firebase.js';
import Swal from 'sweetalert2';

export const post = {
  namespaced: true,
  state() {
    return {
      showPopup: false,
      posts: [],
    };
  },
  mutations: {
    CHANGE_SHOW_POPUP(state, isShow) {
      state.showPopup = isShow;
    },
  },
  actions: {
    async fetchAllPosts() {
      await getAllDocFromCollection('posts');
    },
    async uploadPost({ commit, state }, { file, description }) {
      Swal.showLoading();
      const imageName = await uploadImage(file);
      const docRef = await addPostIntoFirebase({ imageName, description });
      const post = await getSinglePostById(docRef.id);
      state.posts.unshift(post);
      commit('CHANGE_SHOW_POPUP', false);
      Swal.close();
    },
  },
};
