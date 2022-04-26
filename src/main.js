import { createApp } from 'vue'
import Router from './router/index'
import App from './App.vue'
import socket from './components/WebSocket';
import svgIcon from './icons/index.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

let app = createApp(App);
let ws = socket();
app.config.globalProperties.ws = ws;

app.component('svg-icon', svgIcon)
    .use(Router)
    .use(Antd)
    .mount('#app');