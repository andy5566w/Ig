import { createStore } from 'vuex';
import { post } from '@/store/post/index.js';
import { comment } from '@/store/comment/index.js';
import { user } from '@/store/user/index.js';

const store = createStore({
  modules: { post, comment, user },
});

export default store;
