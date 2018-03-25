import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: 'EIC离校统计系统',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '找不到页面',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '列表',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/table', component: Table, name: '编辑' },
            { path: '/form', component: Form, name: '新建' },
            { path: '/user', component: user, name: '视图' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;