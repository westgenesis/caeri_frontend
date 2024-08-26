<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { http } from '../http'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import loginPng from '../assets/login.png'

const router = useRouter();
const account = ref('');
const password = ref('');
const rememberMe = ref(true);

const onSubmitFormData = async () => {
  const formData = {
    account: account.value,
    password: password.value,
    remember_me: rememberMe.value,
  }
  try {
    const res: any = await http.post('/test/v1/login', formData)
    if (res.status === 'success') {
      window.localStorage.setItem('account', formData.account)
      if (formData.remember_me) {
        window.localStorage.setItem('password', formData.password)
      } else {
        window.localStorage.removeItem('password')
      }
      if (res?.access_token) {
        window.localStorage.setItem('token', res?.access_token);
      }
      router.replace('/home');
    } else {
      ElMessage.error('登录失败');
      router.replace('/home');
    }
  } catch (error) {
    ElMessage.error('登录失败');
    router.replace('/home');
  }
}

onMounted(() => {
  const storedAccount = window.localStorage.getItem('account')
  const storedPassword = window.localStorage.getItem('password')
  if (storedAccount) {
    account.value = storedAccount
  }
  if (storedAccount && storedPassword) {
    password.value = storedPassword
  }
})

</script>

<template>
  <div class="login-container">
    <img :src="loginPng" class="login-image">
    <div class="login-form">
      <div class="form mt-[32px] min-w-[480px]">
        <div class="title">

          <div class="title-0 m-[16px] flex justify-center">
            <span class="title-welcome one-line-text max-w-[300px]">
              信息安全测试系统
            </span>
          </div>
        </div>
        <form class="a-form">
          <div class="login-form-item">
            <el-input
              class="login-input"
              max-length="64"
              v-model="account"
              size="large"
              placeholder="请输入账号"
            />
          </div>
          <div class="login-form-item">
            <el-input
              v-model="password"
              type="password"
              class="login-password-input"
              placeholder="请输入密码"
              size="large"
              @keydown.enter="onSubmitFormData"
            />
          </div>
          <div class="flex">
            <el-checkbox v-model="rememberMe" label="记住密码"></el-checkbox>
          </div>
          <div class="mb-[20px] mt-[12px] flex-center">
            <el-button type="button" class="a-button primary large" long @click="onSubmitFormData">
              登陆
            </el-button>
          </div>
        </form>
        <div class="mt-4 flex items-center justify-center">
          <div class="loginType">
            <svg-icon name="scan_code" width="18px" height="18px" class="text-[rgb(var(--primary-6))]"></svg-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  .login-container {
    @apply flex h-screen;
  }

  .login-image {
    flex: 1;
    object-fit: cover;
  }

  .login-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title-welcome {
    color: rgb(var(--primary-5));
  }

  .form {
    @apply relative bg-white;
    padding: 40px;
    border-radius: var(--border-radius-large);
    box-shadow: 0 8px 10px 0 #3232330d, 0 16px 24px 0 #3232330d, 0 6px 30px 0 #3232330d;
    .login-form-item {
      margin-bottom: 28px;
    }
    .mask {
      @apply absolute left-0 top-0 h-full w-full;
    }
    .loginType {
      margin: 0 8px;
      width: 32px;
      height: 32px;
      border: 1px solid var(--color-text-n8);
      border-radius: 50%;
      @apply flex cursor-pointer items-center justify-center;
      .type-text {
        color: rgb(var(--primary-5));
        @apply font-medium;
      }
    }
  }

  .login-input {
    padding-right: 0;
    padding-left: 0;
    width: 400px;
    height: 36px;
  }

  .login-input :deep(.arco-input) {
    padding-right: 10px;
    padding-left: 10px;
  }

  .login-password-input {
    position: relative;
    padding-right: 0;
    padding-left: 0;
    width: 400px;
    height: 36px;
  }

  .login-password-input :deep(.arco-input) {
    padding-right: 50px;
    padding-left: 10px;
  }

  .login-password-input :deep(.arco-input-clear-btn) {
    position: absolute;
    top: 10px;
    float: right;
    margin-left: 350px;
  }

  .login-password-input :deep(.arco-input-suffix) {
    position: absolute;
    top: 10px;
    float: right;
    margin-left: 360px;
  }

  .flex-center {
    display: flex;
    justify-content: center;
  }
</style>