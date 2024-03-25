import {
  addCommentIntoFirebase,
  getAllCommentsByPostId,
  getSingleComment,
  updatePost,
  updateComment,
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
    async addComment({ state, rootState }, { comment, postId }) {
      if (!comment || !postId) {
        return;
      }
      const { id: commentId } = await addCommentIntoFirebase({
        comment,
        postId,
      });
      const post = rootState.post.posts.find(({ id }) => id === postId);
      post.comments.push(commentId);
      await updatePost(post);
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
    async updateComment({ state }, { comment, commentId }) {
      const source = state.comments.find(({ id }) => id === commentId);
      if (!source) {
        console.log(`can't find target comment by id (${commentId})`);
        return;
      }
      source.comment = comment;
      await updateComment(source);
    },
    clearComments({ state }) {
      state.comments = [];
    },
  },
};
