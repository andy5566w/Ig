<template>
  <div class="comment">
    <TheAvatar :src="avatarUrl" />
    <span class="user">{{ author?.name }}</span>
    <span class="commentDate">{{
      dateToRelative(props.publishedAt.seconds * 1000)
    }}</span>
    <p class="commentContent">{{ props.comment }}</p>
  </div>
</template>
<script setup>
import TheAvatar from '@/components/TheAvatar.vue';
import { dateToRelative } from '@/utils/date.js';
import { getUserById, getImageByName } from '@/apis/firebase.js';
import { ref, onMounted } from 'vue';

const props = defineProps({
  author: String,
  comment: String,
  postId: String,
  publishedAt: Object,
});

const author = ref('');
const avatarUrl = ref('');

onMounted(async () => {
  author.value = await getUserById(props.author);
  avatarUrl.value = await getImageByName(author.value.avatar);
});
</script>
<style scoped>
.comment {
  display: grid;
  grid-template-areas:
    'avatar name date'
    'comment comment comment';
  grid-template-columns: 34px 1fr 1fr;
  align-items: center;
  column-gap: 10px;
  row-gap: 14px;
}
.commentDate {
  grid-area: date;
  justify-self: end;
  color: #a7a7a7;
}
.commentContent {
  grid-area: comment;
}
</style>
