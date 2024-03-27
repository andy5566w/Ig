<template>
  <TheModal @close="$store.dispatch('post/hidePostDetails')">
    <div class="postDetails">
      <img
        class="postImage"
        :src="postImageUrl"
        alt="postImage"
        loading="lazy"
      />
      <div class="postMeta">
        <div class="author">
          <TheAvatar :src="author?.avatar" />
          <span>{{ post.user?.name }}</span>
        </div>
        <pre class="postDesc"
          >{{ post.description }}
          </pre
        >
        <div class="comments">
          <comment
            v-for="(comment, index) in comments"
            v-bind="comment"
            :key="index"
          />
        </div>
        <div class="actions">
          <PostActions
            v-if="isDisableAction"
            :likes="post.likes"
            :comments="post.comments"
            :favors="post.favors"
            :likedByMe="likedByMe"
            :favoredByMe="favoredByMe"
            @likeClick="$store.dispatch('user/likePost', { postId: post.id })"
            @favorClick="
              $store.dispatch('user/addToFavors', { postId: post.id })
            "
          />
          <span class="postPubDate">{{
            dateToRelative(post.publishedAt.seconds * 1000)
          }}</span>
          <input
            type="text"
            name="comment"
            :disabled="store.getters['user/isGuest']"
            v-model="content"
            id=""
            class="commentInput"
            placeholder="leave some comment..."
          />
          <button
            :disabled="store.getters['user/isGuest']"
            @click="handleSentComment"
            class="commentPubBtn"
          >
            sent
          </button>
        </div>
      </div>
    </div>
  </TheModal>
</template>
<script setup>
import TheAvatar from './TheAvatar.vue';
import PostActions from './PostActions.vue';
import TheModal from './TheModal.vue';
import Comment from '@/components/Comment.vue';
import { useStore } from 'vuex';
import { computed, ref, onBeforeUnmount, onMounted } from 'vue';
import { dateToRelative } from '../utils/date';
import { getImageByName, getUserById } from '@/apis/firebase.js';
import { useRoute } from 'vue-router';

const content = ref('');
const store = useStore();
const route = useRoute();
const postImageUrl = ref('');
const author = ref('');
const post = computed(() => store.getters['post/getters_current_post']);
const likedByMe = computed(() => {
  return post.value.likes.includes(store.state.user?.userInfo?.uid);
});
const favoredByMe = computed(() => {
  return post.value.favors.includes(store.state.user?.userInfo?.uid);
});
const comments = computed(() =>
  store.state.comment.comments.sort(
    (a, b) => a.publishedAt.seconds - b.publishedAt.seconds,
  ),
);
const isDisableAction = computed(() => route.name !== 'profile');

onMounted(async () => {
  store.dispatch('comment/getAllComments', post.value.id);
  postImageUrl.value = await getImageByName(post.value.imageName);
  author.value = await getUserById(post.value.author);
});

onBeforeUnmount(() => {
  store.dispatch('comment/clearComments');
});

const handleSentComment = () => {
  store.dispatch('comment/addComment', {
    comment: content.value,
    postId: post.value.id,
  });
  content.value = '';
};
</script>
<style scoped>
.postDetails {
  display: grid;
  grid-template-columns: 1fr minmax(auto, 300px);
  grid-template-rows: minmax(0, 1fr);
  width: 80vw;
  height: 80vh;
}
.postImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.postMeta {
  padding: 24px;
  padding-top: 36px;
  display: grid;
  align-items: start;
  grid-template-rows: max-content max-content 1fr max-content;
  max-height: 100%;
  height: 100%;
}

.author {
  display: flex;
  align-items: center;
  gap: 10px;
}
.postDesc {
  width: 100%;
  white-space: pre-wrap;
  margin-top: 24px;
}
.comments {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  grid-gap: 28px;
  align-items: start;
  overflow-y: auto;
  height: 100%;
}

.actions {
  border-top: 1px solid #eaeaea;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  margin: 20px -24px 0px -24px;
  padding: 20px 24px 0 24px;
  row-gap: 16px;
}

.postActions > :deep(svg) {
  transform: scale(0.8125);
}
.postPubDate {
  color: #9f9f9f;
  grid-column: 2 / 6;
  justify-self: end;
  font-size: 14px;
}
.commentInput {
  background: #ccc;
  border-radius: 16px;
  border: none;
  grid-column: 1 / 4;
}
.commentInput::placeholder {
  border: none;
}
.commentPubBtn {
  color: #1da0ff;
  border: none;
  background: none;
  font-size: 16px;
  margin-left: 20px;
  grid-column: 4 / 6;
}
</style>
