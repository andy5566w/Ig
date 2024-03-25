<template>
  <div class="comment">
    <TheAvatar :src="author?.avatar" />
    <span class="user">{{ author?.name }}</span>
    <span class="commentDate">{{
      dateToRelative(props.publishedAt.seconds * 1000)
    }}</span>
    <textarea
      class="commentContent"
      ref="textareaRef"
      @keydown.enter="handleSubmitCommit"
      @compositionstart="isCompisited = true"
      @compositionend="isCompisited = false"
      :class="{ edited: isCommentEdited }"
      :readonly="!isCommentEdited"
      v-model="comment"
    />
    <button
      class="editBtn"
      v-if="isAllowEdit && !isCommentEdited"
      @click="handleClickEditButton"
    >
      Edit
    </button>
  </div>
</template>
<script setup>
import TheAvatar from '@/components/TheAvatar.vue';
import { dateToRelative } from '@/utils/date.js';
import { getUserById } from '@/apis/firebase.js';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  author: String,
  comment: String,
  postId: String,
  publishedAt: Object,
  id: String,
});
const store = useStore();

const author = ref('');
const comment = ref(props.comment);
const textareaRef = ref(null);
const isAllowEdit = computed(() =>
  store.getters['user/isAuthor'](author.value.id),
);
const isCommentEdited = ref(false);
const isCompisited = ref(false);

onMounted(async () => {
  author.value = await getUserById(props.author);
});

const handleClickEditButton = () => {
  isCommentEdited.value = true;
  textareaRef.value.focus();
};

const handleSubmitCommit = async (event) => {
  if (event.shiftKey || isCompisited.value) {
    return;
  }
  isCommentEdited.value = false;
  await store.dispatch('comment/updateComment', {
    commentId: props.id,
    comment: comment.value,
  });
};
</script>
<style scoped lang="scss">
.comment {
  display: grid;
  grid-template-areas:
    'avatar name date'
    'comment comment comment';
  grid-template-columns: 34px 1fr 1fr;
  align-items: center;
  column-gap: 10px;
  row-gap: 14px;
  position: relative;

  &:hover {
    .editBtn {
      opacity: 1;
      visibility: visible;
    }
  }
}
.commentDate {
  grid-area: date;
  justify-self: end;
  color: #a7a7a7;
}
.commentContent {
  grid-area: comment;
  outline: none;
  resize: none;
  border: none;

  &.edited {
    border: 1px solid #ccc;
  }
}

.editBtn {
  border: none;
  background-color: transparent;
  font-size: 12px;
  white-space: nowrap;
  position: absolute;
  right: 0;
  bottom: 4px;
  color: darkred;
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease-in;
}
</style>
