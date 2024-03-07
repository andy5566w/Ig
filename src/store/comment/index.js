import {
  addCommentIntoFirebase,
  getAllCommentsByPostId,
  getSingleComment,
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
    async addComment({ state }, { comment, postId }) {
      if (!comment || !postId) {
        return;
      }
      const { id: commentId } = await addCommentIntoFirebase({
        comment,
        postId,
      });
      const newComment = await getSingleComment(commentId);
      state.comments.push(newComment);
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
