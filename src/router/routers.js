
/**
 * meta 中除了原生参数外，可额外配置的参数:
 * meta: {
 *   access: 'String' 页面进行权限判定时，所对比的名称。如果该参数不存在，则使用 name 参数进行判定
 *   title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *   hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *   icon: 页面左侧图标
 * }
 *
 *
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('../views/Login')
  },
  {
    path: '/deny',
    name: 'error_403',
    meta: {
      title: '无权访问',
      hideInMenu: true
    },
    component: () => import('../views/error/Deny')
  },
  {
    path: '/error',
    name: 'error_500',
    meta: {
      title: '错误',
      hideInMenu: true
    },
    component: () => import('../views/error/Error')
  },
  {
    path: '/not_found',
    name: 'error_404',
    meta: {
      title: '无效页面',
      hideInMenu: true
    },
    component: () => import('../views/error/NotFound')
  },
  {
    path: '/',
    name: 'home',
    meta: {
      hideInMenu: true
    },
    redirect: '/dashboard/page',
    children: [

    ]
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: '概览',
      access: 'dashboard'
    },
    component: () => import('../views/Home'),
    children: [{
      path: 'page',
      name: 'dashboard-page',
      meta: {
        title: '概览',
        hideInMenu: true,
        access: 'dashboard'
      },
      component: () => import('../views/dashboard/Dashboard')
    }]
  },
  {
    path: '/auth',
    name: 'auth',
    meta: {
      title: '权限',
      icon: 'fingerprint',
      access: 'auth'
    },
    component: () => import('../views/Home'),
    children: [
      {
        path: 'account',
        name: 'account-mgr',
        meta: {
          title: '用户管理',
          access: 'account-mgr'
        },
        component: () => import('../views/auth/AccountMgr'),
        children: []
      },
      {
        path: 'role',
        name: 'role-mgr',
        meta: {
          title: '角色管理',
          access: 'role-mgr'
        },
        component: () => import('../views/auth/RoleMgr'),
        children: []
      }

    ]
  },
  {
    path: '/test',
    name: 'test',
    meta: {
      title: '测试',
      icon: 'code'
    },
    component: () => import('../views/Home'),
    children: [
      {
        path: '',
        name: 'one',
        meta: {
          title: 'one'
        },
        component: () => import('../views/Container'),
        children: [
          {
            path: '1-1',
            name: '1-1',
            meta: {
              title: '1-1'
            },
            component: () => import('../views/Test'),
            children: []
          },
          {
            path: '1-2',
            name: '1-2',
            meta: {
              title: '1-2'
            },
            component: () => import('../views/Test'),
            children: []
          }
        ]
      },
      {
        path: '',
        name: 'two',
        meta: {
          title: 'two'
        },
        component: () => import('../views/Container'),
        children: [
          {
            path: '2-1',
            name: '2-1',
            meta: {
              title: '2-1'
            },
            component: () => import('../views/Test'),
            children: [

            ]
          },
          {
            path: '2-2',
            name: '2-2',
            meta: {
              title: '2-2'
            },
            component: () => import('../views/Test'),
            children: [

            ]
          }
        ]
      }
    ]
  }
]
