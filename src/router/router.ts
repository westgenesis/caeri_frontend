// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Registry from '../components/Registry.vue';
import Home from '../components/Home/Home.vue';
import RoleManage from '../components/RoleManage/RoleManage.vue';
import UserManage from '../components/UserManage/UserManage.vue';
import GroupManage from '../components/GroupManage/GroupManage.vue';

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
  },
  {
    path: '/roleManage',
    component: RoleManage,
    name: 'RoleManage',
    meta: {
      breadcrumb: ['系统管理', '角色管理']
    }
  },
  {
    path: '/userManage',
    component: UserManage,
    name: 'UserManage',
    meta: {
      breadcrumb: ['系统管理', '用户管理']
    }
  },
  {
    path: '/groupManage',
    component: GroupManage,
    name: 'GroupManage',
    meta: {
      breadcrumb: ['系统管理', '组织管理']
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;