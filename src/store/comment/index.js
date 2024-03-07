import { addCommentIntoFirebase } from '@/apis/firebase.js';

export const comment = {
  namespaced: true,
  state() {},
  mutations: {},
  actions: {
    async addComment(_, { comment }) {
      if (!comment) {
        return;
      }
      const com = await addCommentIntoFirebase({ comment });
      console.log({ com });
    },
  },
};
