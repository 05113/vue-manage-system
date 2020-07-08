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
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/testPlan_list',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/TestPlanTable.vue'),
                    meta: { title: '测试计划列表' }
                },
                {
                    path: '/testPlan_create',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/TestApi.vue'),
                    meta: { title: '新建测试计划' }
                },
                {
                    path: '/testPlan_detail',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/TestPlanDetailTable.vue'),
                    meta: { title: '新建测试计划详情' }
                },
                {
                    path: '/testPlan_update',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/TestApi.vue'),
                    meta: { title: '修改测试计划' }
                },
                {
                    path: '/interface_create',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/TestApi.vue'),
                    meta: { title: '单接口测试' }
                },
                {
                    path: '/interface_list',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/InterfaceTable.vue'),
                    meta: { title: '接口列表'}
                },                
                {
                    path: '/project',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/ProjectTable.vue'),
                    meta: { title: '项目管理'}
                },
                {
                    path: '/api',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/ApiTable.vue'),
                    meta: { title: 'api管理' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
