export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './User/Login' },
      { name: '注册', path: '/user/register', component: './User/Register' }
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '接口管理页',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin/InterfaceInfo',
    // routes: [
    //   { path: '/admin', redirect: '/admin/sub-page' },
    //   { path: '/admin/sub-page', name: '接口管理', component: './Admin/InterfaceInfo' },
    // ],
  },
  { name: '接口信息', icon: 'table', path: '/list', component: './Admin/InterfaceInfo' },
  { name: '接口信息', icon: 'table', path: '/list2', component: './InterfaceInfo' },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
