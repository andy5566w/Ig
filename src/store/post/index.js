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
      showPostDetails: false,
      currentId: null,
      posts: [],
    };
  },
  mutations: {
    CHANGE_SHOW_POPUP(state, isShow) {
      state.showPopup = isShow;
    },
    MUTATION_POSTS(state, posts) {
      state.posts = posts;
    },
    MUTATION_POST(state, { key, value, postId }) {
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        state.posts.splice(postIndex, 1, {
          ...post,
          [key]: value,
        });
      }
    },
    SHOW_POST_DETAILS(state, show) {
      state.showPostDetails = show;
    },
    MUTATION_CURRENT_ID(state, id) {
      state.currentId = id;
    },
  },
  getters: {
    getters_current_post: (state) =>
      state.posts.find(({ id }) => id === state.currentId),
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
    showPostDetails({ commit }, postId) {
      commit('SHOW_POST_DETAILS', true);
      commit('MUTATION_CURRENT_ID', postId);
    },
    hidePostDetails({ commit }) {
      commit('SHOW_POST_DETAILS', false);
      commit('MUTATION_CURRENT_ID', null);
    },
    togglePostLike({ commit }, { postId, likes }) {
      if (!postId) {
        return;
      }
      commit('MUTATION_POST', { postId, key: 'likes', value: likes });
    },
    togglePostFavor({ commit }, { postId, favors }) {
      if (!postId) {
        return;
      }
      commit('MUTATION_POST', { postId, key: 'favors', value: favors });
    },
  },
};
