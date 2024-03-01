import { signIn, createAccountWithEmailAndPassword } from '@/apis/firebase.js';
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
      if (!ok) {
        Swal.fire({
          icon: 'error',
          text: errorMessage,
        });
      }
      return { ok, data: user, errorMessage };
    },
  },
};
