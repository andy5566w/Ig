<template>
  <template v-if="$route.name !== 'login'">
    <header class="header">
      <Navigator />
    </header>
    <the-layout>
      <router-view />
    </the-layout>
  </template>
  <template v-else>
    <router-view />
  </template>
  <footer class="footer" :class="{ inside: $route.name === 'login' }">
    &copy; All Rights Reserved.
  </footer>
  <post-upload v-if="showPostUpload" />
  <post-details v-if="showPostDetails" />
</template>

<script setup>
import Navigator from './components/Navigator.vue';
import TheLayout from './components/TheLayout.vue';
import PostUpload from '@/components/PostUpload.vue';
import PostDetails from '@/components/PostDetails.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const showPostUpload = computed(() => store.state.post.showPopup);
const showPostDetails = computed(() => store.state.post.showPostDetails);
</script>

<style scoped lang="scss">
.header {
  height: 80px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.footer {
  text-align: center;
  padding: 38px 0;
  color: #828282;
  &.inside {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>
