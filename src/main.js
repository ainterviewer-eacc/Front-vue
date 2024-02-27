import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/global.css';
import axios from 'axios';
import router from './router';
import anime from 'animejs';

const app = createApp(App);
app.use(ElementPlus);
app.use(router);
app.config.globalProperties.$anime = anime; // 如果你全局安装了 anime
app.config.globalProperties.$axios = axios; // 如果你全局安装了 axios
// 设置 axios 的全局默认配置
axios.defaults.baseURL = 'http://101.43.4.104:80'; // 示例 URL，根据你的后端服务地址更改

app.mount('#app');
