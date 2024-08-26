<template>
    <div v-if="!isLoginOrRegistry" class="h-[50px] flex bg-custom-bg justify-between items-center">
        <div class="flex items-center">
            <div class="h-full flex ml-[16px]">
                <img :src="logo" style="width: 20px; height: 20px;"/>
                <span class="ml-[20px]">
                    汽车信息安全测试系统
                </span>
            </div>
            <div class="ml-[10px]"></div>
        </div>
        <a-dropdown>
            <div class="right mr-[16px] min-w-[150px]  cursor-pointer">
                <UserOutlined class="ml-[10px]"/>{{ "游客" }}
            </div>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="backToLogin">
                        退出登录
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import logo from '../../assets/logo.png';

import { storeToRefs } from 'pinia';
import { useProjectStore } from '../stores/project';
import { UserOutlined } from '@ant-design/icons-vue'

const route = useRoute();
const router = useRouter();
const selectedProject = ref('');

const isLoginOrRegistry = computed(() => {
    return route.path === '/login' || route.path === '/registry'
})

const backToLogin = () => {
    router.push('/login');
}

</script>

<style scoped lang="less">
:deep(.ant-select-selector) {
    border: none !important;
    background-color: transparent !important;

    &:hover {
        background-color: #f3f3f3 !important;
    }
}

.topBarItem {
    background-color: transparent;
    color: #646466;
    font-size: 14px !important;
    border-radius: 0.5rem !important;
}

.bg-white {
    background-color: white;
    color: #70367f;
}

.right {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 5px;
    border-radius: 5px;
    &:hover {
        background-color: white;
    }
}
</style>