// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Registry from '../components/Registry.vue';
import Home from '../components/Home/Home.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/registry',
    name: 'Registry',
    component: Registry
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/home',
    component: Home,
    name: 'Home',
    meta: {
      breadcrumb: ['工作台']
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;