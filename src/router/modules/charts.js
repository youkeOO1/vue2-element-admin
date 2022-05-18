import Layout from '@/layout'
export default {
  path: '/charts',
  name: 'charts',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: 'Charts',
    icon: 'chart'
  },
  children: [
    {
      path: 'keyboard',
      name: 'KeyboardChart',
      component: () => import('@/views/charts/keyBoard.vue'),
      meta: {
        title: 'Keyboard Chart',
        noCache: true
      }
    },
    {
      path: 'line',
      name: 'LineChart',
      component: () => import('@/views/charts/line.vue'),
      meta: {
        title: 'Line Chart Chart',
        noCache: true
      }
    },
    {
      path: 'mix-chart',
      name: 'MixChart',
      component: () => import('@/views/charts/mix-chart.vue'),
      meta: {
        title: 'Mix Chart',
        noCache: true
      }
    }
  ]
}
