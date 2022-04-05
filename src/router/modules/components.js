import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  meta: {
    title: 'Components',
    icon: 'component'
  },
  children: [
    {
      path: 'tinymce',
      component: () => import('@/views/components-demo/tinymce.vue'),
      name: 'TinymceDemo',
      meta: { title: 'Tinymce' }
    },
    {
      path: 'markdown',
      component: () => import('@/views/components-demo/markdown.vue'),
      name: 'MarkdownDemo',
      meta: { title: 'Markdown' }
    },
    {
      path: 'json',
      component: () => import('@/views/components-demo/Json-editor.vue'),
      name: 'JsonEditorDemo',
      meta: { title: 'JSON Editor' }
    }
  ]
}

export default componentsRouter
