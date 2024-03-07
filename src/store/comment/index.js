import {
  addCommentIntoFirebase,
  getAllCommentsByPostId,
} from '@/apis/firebase.js';

export const comment = {
  namespaced: true,
  state() {
    return {
      comments: [],
    };
  },
  mutations: {
    MUTATION_COMMENTS(state, comments) {
      state.comments = comments;
    },
  },
  actions: {
    async addComment(_, { comment, postId }) {
      if (!comment || !postId) {
        return;
      }
      const com = await addCommentIntoFirebase({ comment, postId });
      console.log({ com });
    },
    async getAllComments({ commit }, postId) {
      if (!postId) {
        return;
      }
      const posts = await getAllCommentsByPostId(postId);
      commit(
        'MUTATION_COMMENTS',
        posts.map((p) => p.data()),
      );
    },
  },
};
