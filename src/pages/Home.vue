<template>
  <div>
    <PostList>
      <PostItem v-for="post in filterPosts" v-bind="post" :key="post.id" />
    </PostList>

    <post-details v-if="showPostDetails" />
    <post-upload v-if="showPostUpload" />
  </div>
</template>
<script setup>
import PostList from '../components/PostList.vue';
import PostItem from '../components/PostItem.vue';
import PostUpload from '@/components/PostUpload.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';
import PostDetails from '@/components/PostDetails.vue';

const store = useStore();
const showPostUpload = computed(() => store.state.post.showPopup);
const showPostDetails = computed(() => store.state.post.showPostDetails);
const filterPosts = computed(() =>
  store.state.post.posts.sort(
    (a, b) => b.publishedAt.seconds - a.publishedAt.seconds,
  ),
);
store.dispatch('post/fetchAllPosts');
</script>
<style scoped></style>
