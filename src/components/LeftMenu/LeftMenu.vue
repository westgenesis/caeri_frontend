<template>
  <div v-if="!isLoginOrRegistry" class="bg-custom-bg">
    <a-menu id="dddddd" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" style="width: 256px"
      mode="inline" :items="items" @click="handleClick"></a-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reactive, ref, watch, VueElement, h } from 'vue';
import type { MenuProps, ItemType } from 'ant-design-vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined, HomeOutlined} from '@ant-design/icons-vue';
import { getItem, menus } from './menu.ts';
const route = useRoute()
const router = useRouter()

const isLoginOrRegistry = computed(() => {
  return route.path === '/login' || route.path === '/registry'
})

const selectedKeys = ref<string[]>(['/home']);
const openKeys = ref<string[]>(['sub1']);

const items: ItemType[] = ref([
    getItem('工作台', '/home', () => h(HomeOutlined)),
    getItem('系统管理', '/roleManage', () => h(SettingOutlined), [
      getItem('角色管理', '/roleManage'),
      getItem('用户管理', '/userManage'),
      getItem('用户组织', '/userOrganization'),
      getItem('客户信息管理', '/customerManage'),
      getItem('单工具配置', '/singleTools'),
    ]),
  ]);

const handleClick: MenuProps['onClick'] = e => {
  router.replace(e.key);
};
</script>

<style scoped lang="less"></style>