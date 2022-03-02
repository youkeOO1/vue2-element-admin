import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout'

Vue.use(VueRouter)
// {
//   hidden: 是否隐藏路由
//   alwaysShow: 一直展示
//   meta: {
//     title: 标题
//     icon: 图标
//     affix: tagsView 中是否一直展示
//     breadcrumb: 是否出现在面包屑导航中
//     noCache: 不缓存
//   }
// }
export const constantRoutes = [
  {
    path: '/',
    name: 'layout',
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@v/dashboard'),
        meta: {
          title: 'Dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@v/login')
  },
  {
    path: '/404',
    component: () => import('@v/error-log/404.vue'),
    hidden: true
  }
]
export const asynceRouter = [
  {
    path: '/permission',
    component: Layout,
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin']
    }
  },
  {
    path: '/sadmin',
    component: Layout,
    name: 'sadmin',
    meta: {
      title: 'sadmin',
      icon: 'lock',
      roles: ['editor']
    }
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: 'Example',
      icon: 'el-icon-s-help'
    },
    children: [
      {
        path: 'create',
        component: () => import('../views/pagetest/create.vue'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('../views/pagetest/edit.vue'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('../views/pagetest/list.vue'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  // 404 路由放到最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new VueRouter({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

/**
 * 重置路由，将路由恢复到没有动态路由
 */
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
