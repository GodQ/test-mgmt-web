import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: 'Home' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: 'Dashboard' }
                },
                {
                    path: '/test_result',
                    component: resolve => require(['../components/page/test_result.vue'], resolve),
                    meta: { title: 'Test Result' }
                },
                {
                    path: '/test_result_diff',
                    component: resolve => require(['../components/page/test_result_diff.vue'], resolve),
                    meta: { title: 'Test Result Diff' }
                },
                {
                    path: '/user_management',
                    component: resolve => require(['../components/page/user_management.vue'], resolve),
                    meta: { title: 'User Management', permission: 'admin' }
                },
                {
                    path: '/mock_service',
                    component: resolve => require(['../components/page/mock_service.vue'], resolve),
                    meta: { title: 'Mock Service' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'Messages' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
