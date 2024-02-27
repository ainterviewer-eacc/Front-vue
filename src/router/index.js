import { createRouter, createWebHistory } from 'vue-router';
import PreferenceSelect from '@/components/PreferenceSelect.vue';
import ChatPage from '@/components/ChatPage.vue';

const routes = [{
        path: '/',
        name: 'PreferenceSelect',
        component: PreferenceSelect
    },
    {
        path: '/Chat/:session_id',
        name: 'Chat',
        component: ChatPage, // ChatPage包含HeaderMain、ChatWindow和InputArea
        props: true // 将路由参数作为组件的 props 传递
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;