<template>
  <img :src="imgUrl" alt="avatar" class="avatar" />
</template>

<script setup>
import defaultAvatar from '@/assets/avatarDefault.png';
import { getImageByName } from '@/apis/firebase.js';
import { ref, watch } from 'vue';

const props = defineProps({
  src: String,
  width: {
    type: [String, Number],
    default: 34,
  },
  height: {
    type: [String, Number],
    default: 34,
  },
});
const imgUrl = ref(defaultAvatar);

watch(
  () => props.src,
  async (src) => {
    if (src && !src.match('https://firebasestorage')) {
      imgUrl.value = await getImageByName(src);
      return;
    }
    imgUrl.value = src;
  },
  { immediate: true },
);
</script>

<style scoped>
.avatar {
  width: v-bind(width + 'px');
  height: v-bind(height + 'px');
  border-radius: 50%;
  background-color: #eee;
  object-fit: cover;
  object-position: top center;
}
</style>
