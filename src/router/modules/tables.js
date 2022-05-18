import Layout from '@/layout'

export default {
  path: '/table',
  name: 'Table',
  component: Layout,
  redirect: 'noRedirect',
  meta: {
    title: 'Table',
    icon: 'table'
  },
  children: [
    {
      path: 'dynamic-table',
      name: 'DynamicTable',
      component: () => import('@/views/table/dynamic-table'),
      meta: {
        title: 'Dynamic Table'
      }
    },
    {
      path: 'drag-table',
      name: 'DargTable',
      component: () => import('../../views/table/drag-table.vue'),
      meta: {
        title: 'Darg Table'
      }
    }
  ]
}
