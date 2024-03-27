<template>
  <h2 class="title">Result: {{ terms }}</h2>
  <post-list>
    <post-item
      v-for="post in searchResults"
      v-bind="post"
      :key="post.id"
    ></post-item>
  </post-list>
</template>
<script setup>
import PostList from '../components/PostList.vue';
import PostItem from '../components/PostItem.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();
const terms = computed(() => route.query.term);
const searchResults = computed(() =>
  store.state.post.posts.filter(({ description }) =>
    description.includes(terms.value),
  ),
);

onMounted(() => {
  store.dispatch('post/fetchAllPosts');
});
</script>

<style scoped lang="scss">
.title {
  margin-bottom: 1rem;
}
</style>
