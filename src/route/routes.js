import Home from '../pages/Home.vue';
import Search from '../pages/Search.vue';
import Profile from '../pages/Profile.vue';
import ProfileEditting from '../pages/ProfileEditting.vue';
import Login from '../pages/Login.vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store/index.js';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/search', name: 'search', component: Search },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/profile/edit', name: 'profileEdit', component: ProfileEditting },
  { path: '/login', name: 'login', component: Login },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach((to, form) => {
  if (
    store.getters['user/isGuest'] &&
    !['search', 'home', 'login'].includes(to.name)
  ) {
    return { name: 'home' };
  }
});
export default router;
