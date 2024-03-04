import { addPostIntoFirebase, uploadImage } from '@/apis/firebase.js';
import Swal from 'sweetalert2';

export const post = {
  namespaced: true,
  state() {
    return {
      showPopup: false,
    };
  },
  mutations: {
    CHANGE_SHOW_POPUP(state, isShow) {
      state.showPopup = isShow;
    },
  },
  actions: {
    async uploadPost({ commit }, { file, description }) {
      Swal.showLoading();
      const imageName = await uploadImage(file);
      await addPostIntoFirebase({ imageName, description });
      commit('CHANGE_SHOW_POPUP', false);
      Swal.close();
    },
  },
};
