import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './route/routes.js';
import store from '@/store/index.js';

const app = createApp(App);
app.config.errorHandler = (err, vm, info) => {
  console.log({ err, vm, info });
};
app.use(router);
app.use(store);
app.mount('#app');
