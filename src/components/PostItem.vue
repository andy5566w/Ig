<template>
  <div class="postItem">
    <!--    @click="$store.dispatch('showPostDetails', post.id)"-->
    <img
      :src="imageUrl"
      alt=""
      width="100%"
      height="100%"
      style="background: #eee"
    />
    <div class="postInfo">
      <div class="postMeta">
        <TheAvatar :src="user?.avatarUrl" />
        <span>{{ user?.name }}</span>
        <span class="postPubDate">{{
          dateToRelative(publishedAt?.seconds * 1000)
        }}</span>
        <!--        <PostActions-->
        <!--          :likes="post.liked_bies"-->
        <!--          :comments="post.comments"-->
        <!--          :favors="post.favored_bies"-->
        <!--          :likedByMe="post.likedByMe"-->
        <!--          :favoredByMe="post.favoredByMe"-->
        <!--          @likeClick="$store.dispatch('toggleLike', post.id)"-->
        <!--          @favorClick="$store.dispatch('toggleFavor', post.id)"-->
        <!--          @commentsClick="this.$store.dispatch('showPostDetails', post.id)"-->
        <!--        />-->
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
import { watch, ref } from 'vue';
import { getImageByName, getUserById } from '@/apis/firebase.js';

const imageUrl = ref('');
const user = ref({});
const props = defineProps({
  imageName: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  publishedAt: {
    type: Object,
    default: {},
  },
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
  async (userId) => {
    user.value = await getUserById(userId);
    if (user.value.avatar) {
      console.log(user.value.avatar);
      user.value.avatarUrl = await getImageByName(user.value.avatar);
    }
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
