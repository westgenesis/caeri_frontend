import { createApp, h } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/tailwind.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia';
import { plugin } from 'echarts-for-vue';
import * as echarts from 'echarts';

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.use(Antd)
app.mount('#app')
app.use(plugin, { echarts, h });    