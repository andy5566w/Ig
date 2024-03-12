<template>
  <div class="postItem">
    <img
      :src="imageUrl"
      alt=""
      width="100%"
      height="100%"
      @click="$store.dispatch('post/showPostDetails', id)"
      style="background: #eee"
    />
    <div class="postInfo">
      <div class="postMeta">
        <TheAvatar :src="author?.avatar" />
        <span>{{ author?.name }}</span>
        <span class="postPubDate">{{
          dateToRelative(publishedAt?.seconds * 1000)
        }}</span>
        <PostActions
          :likes="props.likes"
          :comments="props.comments"
          :favors="props.favors"
          :likedByMe="likedByMe"
          :favoredByMe="favoredByMe"
          @like-click="$store.dispatch('user/likePost', { postId: id })"
          @favor-click="$store.dispatch('user/addToFavors', { postId: id })"
        />
      </div>
      <div class="postDesc">
        <p>
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import TheAvatar from '../components/TheAvatar.vue';
import PostActions from '../components/PostActions.vue';
import { dateToRelative } from '../utils/date';
import { watch, ref, computed } from 'vue';
import { getImageByName, getUserById } from '@/apis/firebase.js';
import { useStore } from 'vuex';

const imageUrl = ref('');
const author = ref({});
const store = useStore();
const props = defineProps({
  imageName: String,
  author: String,
  description: String,
  publishedAt: Object,
  likes: Array,
  comments: Array,
  favors: Array,
  id: String,
});

const likedByMe = computed(() => {
  return (props.likes || []).includes(store.state.user?.userInfo?.uid);
});

const favoredByMe = computed(() => {
  return (props.favors || []).includes(store.state.user?.userInfo?.uid);
});

watch(
  () => props.imageName,
  async (imageName) => {
    if (!imageName) return;
    imageUrl.value = await getImageByName(imageName);
  },
  { immediate: true },
);

watch(
  () => props.author,
  async (authorId) => {
    author.value = await getUserById(authorId);
  },
  { immediate: true },
);
</script>
<style scoped lang="scss">
.postItem {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  & > img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    background: #eee;
    cursor: pointer;
  }
}

.postInfo {
  padding: 24px;
}

.postMeta {
  display: grid;
  grid-template-areas:
    'avatar name actions'
    'pubDate pubDate actions';
  grid-template-columns: 42px 1fr 3fr;
  row-gap: 6px;
  .avatar {
    grid-area: avatar;
  }
  .postPubDate {
    grid-area: pubDate;
    color: #9f9f9f;
    font-size: 14px;
  }
}

.postActions {
  grid-area: actions;
  justify-self: end;
}

.postDesc {
  margin-top: 28px;
  white-space: pre-line;
}
</style>
