
// 标准资源管理路由配置
const standardResourceRouter = {
  path: '/standardResource',
  name: 'StandardResource',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '标准资源',
    icon: 'FileText',
    order: 4, // 调整order值，使其在菜单管理界面中排序更靠前
    sortNo: 4, // 调整排序值，使其在菜单中显示更靠前
    roles: ['admin', 'standard_manager'], // 配置可访问的角色
    permission: 'standard.resource' // 添加权限标识
  },
  children: [
    {
      path: '',
      name: 'StandardResourceList',
      component: () => import('@/views/standardResource/index.vue'),
      meta: {
        title: '标准资源列表',
        icon: 'FileText',
        affix: true,
        permission: 'standard.resource.list' // 添加子菜单权限标识
      }
    },
    {
      path: 'detail/:id',
      name: 'StandardResourceDetail',
      component: () => import('@/views/standardResource/detail.vue'),
      meta: {
        title: '标准资源详情',
        icon: 'FileText',
        hidden: true,
        permission: 'standard.resource.detail' // 添加子菜单权限标识
      },
      props: true
    },
    {
      path: 'digitalContent',
      name: 'StandardDigitalContent',
      component: () => import('@/views/standardResource/digitalContent.vue'),
      meta: {
        title: '数字化内容',
        icon: 'Database',
        hidden: true,
        permission: 'standard.resource.digital' // 添加子菜单权限标识
      },
      props: (route) => ({
        id: route.query.id
      })
    },
    {
      path: 'applicationSupport',
      name: 'StandardApplicationSupport',
      component: () => import('@/views/standardResource/applicationSupport.vue'),
      meta: {
        title: '应用支持',
        icon: 'Code',
        hidden: true
      },
      props: (route) => ({
        id: route.query.id
      })
    }
  ]
}

export default standardResourceRouter