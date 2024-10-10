<template>
  <div v-if="!isLoginOrRegistry" class="bg-custom-bg">
    <a-menu id="dddddd" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" style="width: 256px"
      mode="inline" :items="filteredItems" @click="handleClick"></a-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, h } from 'vue';
import type { MenuProps, ItemType } from 'ant-design-vue';
import { HomeOutlined, SettingOutlined, SnippetsOutlined, ProjectOutlined, ToolOutlined, GoldOutlined, BugOutlined} from '@ant-design/icons-vue';
import { getItem } from './menu.ts';
import { http } from '../../http'

const route = useRoute()
const router = useRouter()

const isLoginOrRegistry = computed(() => {
  return route.path === '/login' || route.path === '/registry'
})

const selectedKeys = ref<string[]>(['/home']);
const openKeys = ref<string[]>(['sub1']);

const fetchRoleList = async () => {
  const { data } = await http.post('/test/v1/users/get_role_list', { name: undefined });
  return data;
};

const items: ItemType[] = [
  getItem('工作台', '/home', () => h(HomeOutlined)),
  getItem('项目管理', '/projectManage', () => h(ProjectOutlined)),
  getItem('系统管理', '/roleManage', () => h(SettingOutlined), [
    getItem('角色管理', '/roleManage'),
    getItem('用户管理', '/userManage'),
    getItem('用户组织', '/groupManage'),
    getItem('客户信息管理', '/customerManage'),
  ]),
  getItem('标签管理', '/labelManage', () => h(SnippetsOutlined), [
    getItem('标签库', '/labelManage'),
  ]),
  getItem('样品管理', '/sampleManage', () => h(GoldOutlined), [
    getItem('样品信息', '/sampleManage'),
  ]),
  getItem('工具管理', '/toolManage', () => h(ToolOutlined), [
    getItem('工具管理', '/toolManage'),
  ]),
  getItem('漏洞管理', '/bugTypeManage', () => h(BugOutlined), [
    getItem('漏洞类型管理', '/bugTypeManage'),
    getItem('漏洞库', '/bugManage')
  ]),
];

const filteredItems = ref([...items]);  // 使用深拷贝来初始化

const filterItemsByRoleLimit = (items: ItemType[], role_limit: any) => {
  return items.map(item => {
    let newItem = { ...item }; // 深拷贝每个item
    if (newItem.children) {
      newItem.children = filterItemsByRoleLimit(newItem.children, role_limit);
      if (newItem.children.length === 0) return null;  // 如果子菜单为空则移除此项
    }
    return role_limit.some((permission: any) => permission.key === newItem.key) ? newItem : null;
  }).filter(item => item !== null);  // 过滤掉空值
};

const updateFilteredItems = async () => {
  if (localStorage.getItem('account') === 'admin') {
    filteredItems.value = [...items];  // 使用深拷贝来重新赋值
    return;
  }

  const user_role_id = localStorage.getItem('user_role_id');
  const data = await fetchRoleList();
  const currentRole = data.find(x => x.role_id === user_role_id);

  if (currentRole && currentRole.role_limit) {
    const role_limit = JSON.parse(currentRole.role_limit);
    filteredItems.value = filterItemsByRoleLimit([...items], role_limit);  // 深拷贝items进行过滤
  }
};

onMounted(async () => {
  await updateFilteredItems();
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
});

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange);
});

watch(() => route.path, updateFilteredItems);

const handleClick: MenuProps['onClick'] = e => {
  router.replace(e.key);
};

const handleHashChange = () => {
  const hash = window.location.hash.replace('#', '');
  selectedKeys.value = [hash];
};

</script>

<style scoped lang="less"></style>