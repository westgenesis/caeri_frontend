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
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { getItem } from './menu.ts';
const route = useRoute()
const router = useRouter()

const isLoginOrRegistry = computed(() => {
    return route.path === '/login' || route.path === '/registry'
})

const selectedKeys = ref<string[]>(['/project/projectManage']);
const openKeys = ref<string[]>(['sub1']);



const items: ItemType[] = ref([
  getItem('项目管理', '/project/projectManage'),
]);

const handleClick: MenuProps['onClick'] = e => {
  router.replace(e.key);
};

watch(openKeys, val => {
  console.log('openKeys', val);
});

watch(route, (newRoute) => {
  selectedKeys.value = [newRoute.path];
  if (newRoute.path.startsWith('/project')) {
    items.value = [getItem('项目管理', '/project/projectManage')];
  } else if (newRoute.path.startsWith('/requirement')) {
    items.value = [getItem('功能模块', '/requirement/functionModules'), getItem('功能点', '/requirement/functionPoint')];
  } else if (newRoute.path.startsWith('/usecase')) {
    items.value = [getItem('用例管理', '/usecase/usecaseManage')];
  }
});
</script>

<style scoped lang="less"></style>