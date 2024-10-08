// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Registry from '../components/Registry.vue';
import Home from '../components/Home/Home.vue';
import RoleManage from '../components/RoleManage/RoleManage.vue';
import UserManage from '../components/UserManage/UserManage.vue';
import GroupManage from '../components/GroupManage/GroupManage.vue';
import LabelManage from '../components/LabelManage/LabelManage.vue';
import CustomerManage from '../components/CustomerManage/CustomerManage.vue';
import ProjectManage from '../components/ProjectManage/ProjectManage.vue';
import CreateProject from '../components/ProjectManage/CreateProject.vue';
import ProjectDetail from '../components/ProjectManage/ProjectDetail.vue';
import SampleManage from '../components/SampleManage/SampleManage.vue';
import ToolManage from '../components/ToolManage/ToolManage.vue';
import BugTypeManage from '../components/BugManage/BugTypeManage.vue';
import BugManage from '../components/BugManage/BugManage.vue';

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
    path: '/customerManage',
    component: CustomerManage,
    name: 'CustomerManage',
    meta: {
      breadcrumb: ['系统管理', '客户信息管理']
    }
  },
  {
    path: '/groupManage',
    component: GroupManage,
    name: 'GroupManage',
    meta: {
      breadcrumb: ['系统管理', '组织管理']
    }
  },
  {
    path: '/labelManage',
    component: LabelManage,
    name: 'LabelManage',
    meta: {
      breadcrumb: ['标签管理', '标签库']
    }
  },
  {
    path: '/sampleManage',
    component: SampleManage,
    name: 'SampleManage',
    meta: {
      breadcrumb: ['样品管理', '样品信息']
    }
  },
  {
    path: '/projectManage',
    component: ProjectManage,
    name: 'projectManage'
  },
  {
    path: '/createProject',
    component: CreateProject,
    name: 'createProject'
  },
  {
    path: '/projectDetail',
    component: ProjectDetail,
    name: 'projectDetail'
  },
  {
    path: '/toolManage',
    component: ToolManage,
  }, {
    path: '/bugTypeManage',
    component: BugTypeManage,
    name: 'BugTypeManage',
    meta: {
      breadcrumb: ['系统管理', 'Bug类型管理']
    }
  }, {
    path: '/bugManage',
    component: BugManage,
    name: 'BugManage',
    meta: {
      breadcrumb: ['Bug管理', 'Bug信息']
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;