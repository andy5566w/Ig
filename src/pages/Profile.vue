<template>
  <div>
    <div class="profileContainer">
      <TheAvatar :width="186" :height="186" :src="user.avatar" />
      <div class="profile">
        <p class="name">
          <span>{{ user.name }}</span
          ><router-link to="/profile/edit">Edit profile</router-link>
        </p>
        <p class="handle">@{{ user.name }}</p>
        <div class="description">
          <pre>{{ user.intro }}</pre>
        </div>
      </div>
    </div>
    <div class="tabs">
      <div
        v-for="(tab, index) in tabs"
        class="tab"
        :class="{ active: index === currentTab }"
        :key="index"
        @click="currentTab = index"
      >
        <TheIcon :icon="tab.icon" />
        <p>{{ tab.label }}</p>
      </div>
    </div>
    <div class="tabContent">
      <post-list v-if="posts.length > 0">
        <post-item v-for="post in posts" v-bind="post" :key="post.id" />
      </post-list>
      <div v-else class="no-data">
        There is no data here; let's retrieve some posts you like.
      </div>
    </div>
  </div>
  <post-details v-if="showPostDetails" />
</template>
<script setup>
import TheIcon from '@/components/TheIcon.vue';
import TheAvatar from '../components/TheAvatar.vue';
import { useStore } from 'vuex';
import { computed, ref, watchEffect, watch } from 'vue';
import PostList from '@/components/PostList.vue';
import PostItem from '@/components/PostItem.vue';
import { getPostsByField } from '@/apis/firebase.js';
import PostDetails from '@/components/PostDetails.vue';

const store = useStore();
const posts = ref([]);
const showPostDetails = computed(() => store.state.post.showPostDetails);

const user = computed(() => store.state.user.userDoc);

watchEffect(async () => {
  const authorId = user.value?.id;
  if (authorId) {
    const data = await getPostsByField({
      field: 'author',
      opStr: '==',
      value: user.value.id,
    });
    posts.value = data.map((d) => d.data());
  }
});

const tabs = ref([
  {
    label: 'My',
    icon: 'posts',
  },
  {
    label: 'Liked',
    icon: 'like',
  },
  {
    label: 'Added',
    icon: 'favorite',
  },
]);

const currentTab = ref(0);

watch(currentTab, async () => {
  switch (currentTab.value) {
    case 0:
      const myPosts = await getPostsByField({
        field: 'author',
        opStr: '==',
        value: user.value.id,
      });
      posts.value = myPosts;
      store.commit('post/MUTATION_POSTS', myPosts);
      break;
    case 1:
      const likes = user.value.likes.map((id) => id);
      const likePosts = await getPostsByField({
        field: 'id',
        opStr: 'in',
        value: likes,
      });
      posts.value = likePosts.map((d) => d.data());
      store.commit(
        'post/MUTATION_POSTS',
        likePosts.map((d) => d.data()),
      );
      break;
    case 2:
      const favors = user.value.favors.map((id) => id);
      const favorPosts = await getPostsByField({
        field: 'id',
        opStr: 'in',
        value: favors,
      });
      posts.value = favorPosts.map((d) => d.data());
      store.commit(
        'post/MUTATION_POSTS',
        favorPosts.map((d) => d.data()),
      );
      break;
    default:
      return;
  }
});
</script>

<style scoped lang="scss">
.profileContainer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10vw;
}

.avatar {
  justify-self: end;
}

.profile {
  .name {
    display: flex;
    align-items: center;
    & > span {
      font-size: 26px;
    }

    & > a {
      color: #1da0ff;
      text-decoration: none;
      margin-left: 26px;
    }
  }

  .handle {
    margin-top: 4px;
    color: #848484;
  }

  .description {
    margin-top: 26px;
    margin-bottom: 22px;
  }
}

.tabs {
  display: grid;
  grid-template-columns: repeat(3, 88px);
  column-gap: 4vw;
  justify-content: center;

  margin-top: 7vmin;
  margin-bottom: 20px;
}

.tab {
  text-align: center;
  padding: 12px 0;
  cursor: pointer;

  & > svg {
    width: 32px;
    height: 32px;
    stroke: #8a9194;
    fill: #8a9194;
  }
  &.active {
    background: #f6f9fb;
    border-radius: 18px;
    & > svg {
      stroke: #1787d9;
      fill: #1787d9;
    }
    & > p {
      color: #1787d9;
    }
  }
}

.tabContent > p {
  text-align: center;
  font-weight: 600;
  margin-bottom: 32px;
}

.no-data {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.posts {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 40px;
}

.postImage {
  width: 100%;
  height: 321px;
  background: #eee;
  object-fit: cover;
}
</style>
