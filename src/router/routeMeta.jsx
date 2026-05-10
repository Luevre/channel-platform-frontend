import {
  ApartmentOutlined,
  BranchesOutlined,
  LinkOutlined,
  NodeIndexOutlined,
  SettingOutlined,
} from '@ant-design/icons';

export const routeMetaList = [
  {
    key: 'channel-placement-params',
    path: '/channel/placement-params',
    title: '投放参数管理',
    menuKey: 'channel-placement-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-placement-params-create',
    path: '/channel/placement-params/create',
    title: '新增投放参数',
    menuKey: 'channel-placement-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-placement-params-edit',
    path: '/channel/placement-params/edit',
    title: '编辑投放参数',
    menuKey: 'channel-placement-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-placement-params-view',
    path: '/channel/placement-params/view',
    title: '查看投放参数',
    menuKey: 'channel-placement-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-placement-params-dict',
    path: '/channel/placement-params/dict',
    title: '参数字典表',
    menuKey: 'channel-placement-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-my-params',
    path: '/channel/my-params',
    title: '参数申请管理',
    menuKey: 'channel-my-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-my-params-view',
    path: '/channel/my-params/view',
    title: '查看我的参数',
    menuKey: 'channel-my-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-my-params-create',
    path: '/channel/my-params/create',
    title: '新增我的参数',
    menuKey: 'channel-my-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-my-params-review',
    path: '/channel/my-params/review',
    title: '审核我的参数',
    menuKey: 'channel-my-params',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-placement-review',
    path: '/channel/placement-review',
    title: '投放参数审核',
    menuKey: 'channel-placement-review',
    parentKey: 'channel-management',
  },
  {
    key: 'channel-placement-review-detail',
    path: '/channel/placement-review/detail',
    title: '审核参数详情',
    menuKey: 'channel-placement-review',
    parentKey: 'channel-management',
  },
  {
    key: 'callback-node-management',
    path: '/callback/node-management',
    title: '回传节点管理',
    menuKey: 'callback-node-management',
    parentKey: 'callback-management',
  },
  {
    key: 'callback-node-management-create',
    path: '/callback/node-management/create',
    title: '新增回传节点',
    menuKey: 'callback-node-management',
    parentKey: 'callback-management',
  },
  {
    key: 'callback-node-management-edit',
    path: '/callback/node-management/edit',
    title: '编辑回传节点',
    menuKey: 'callback-node-management',
    parentKey: 'callback-management',
  },
  {
    key: 'callback-node-management-view',
    path: '/callback/node-management/view',
    title: '查看回传节点',
    menuKey: 'callback-node-management',
    parentKey: 'callback-management',
  },
  {
    key: 'callback-strategy-review',
    path: '/callback/strategy-review',
    title: '回传策略审核',
    menuKey: 'callback-strategy-review',
    parentKey: 'callback-management',
  },
  {
    key: 'callback-strategy-management',
    path: '/callback/strategy-management',
    title: '策略申请管理',
    menuKey: 'callback-strategy-management',
    parentKey: 'callback-management',
  },
  {
    key: 'callback-strategy-management-create',
    path: '/callback/strategy-management/create',
    title: '新增回传策略',
    menuKey: 'callback-strategy-management',
    parentKey: 'callback-management',
  },
  {
    key: 'delivery-link-management',
    path: '/delivery/link-management',
    title: '投放场景管理',
    menuKey: 'delivery-link-management',
    parentKey: 'delivery-management',
  },
  {
    key: 'delivery-link-management-create',
    path: '/delivery/link-management/create',
    title: '新增投放链接',
    menuKey: 'delivery-link-management',
    parentKey: 'delivery-management',
  },
  {
    key: 'delivery-link-management-edit',
    path: '/delivery/link-management/edit',
    title: '编辑投放链接',
    menuKey: 'delivery-link-management',
    parentKey: 'delivery-management',
  },
  {
    key: 'delivery-link-management-view',
    path: '/delivery/link-management/view',
    title: '查看投放链接',
    menuKey: 'delivery-link-management',
    parentKey: 'delivery-management',
  },
  {
    key: 'delivery-my-scene',
    path: '/delivery/my-scene',
    title: '我的投放场景',
    menuKey: 'delivery-my-scene',
    parentKey: 'delivery-management',
  },
  {
    key: 'delivery-my-scene-create',
    path: '/delivery/my-scene/create',
    title: '新增我的投放场景',
    menuKey: 'delivery-my-scene',
    parentKey: 'delivery-management',
  },
  {
    key: 'delivery-my-scene-edit',
    path: '/delivery/my-scene/edit',
    title: '编辑我的投放场景',
    menuKey: 'delivery-my-scene',
    parentKey: 'delivery-management',
  },
  {
    key: 'delivery-scene-review',
    path: '/delivery/scene-review',
    title: '投放场景审核',
    menuKey: 'delivery-scene-review',
    parentKey: 'delivery-management',
  },
  {
    key: 'delivery-deeplink',
    path: '/delivery/deeplink',
    title: 'deeplink管理',
    menuKey: 'delivery-deeplink',
  },
  {
    key: 'public-data-management',
    path: '/public/data-management',
    title: '银证渠道回传管理',
    menuKey: 'public-data-management',
  },
];

export const routeMetaMap = routeMetaList.reduce((accumulator, item) => {
  accumulator[item.path] = item;
  return accumulator;
}, {});

export const menuItems = [
  {
    key: 'channel-management',
    icon: <SettingOutlined />,
    label: '投放参数管理',
    children: [
      {
        key: 'channel-placement-params',
        label: '投放参数管理',
      },
      {
        key: 'channel-my-params',
        label: '投放参数配置',
      },
      {
        key: 'channel-placement-review',
        label: '投放参数审核',
      },
    ],
  },
  {
    key: 'callback-management',
    icon: <NodeIndexOutlined />,
    label: '回传策略管理',
    children: [
      {
        key: 'callback-node-management',
        label: '回传节点管理',
      },
      {
        key: 'callback-strategy-management',
        label: '回传策略配置',
      },
      {
        key: 'callback-strategy-review',
        label: '回传策略审核',
      },
    ],
  },
  {
    key: 'delivery-management',
    icon: <LinkOutlined />,
    label: '投放场景管理',
    children: [
      {
        key: 'delivery-link-management',
        label: '投放场景配置',
      },
      {
        key: 'delivery-my-scene',
        label: '我的投放场景',
      },
      {
        key: 'delivery-scene-review',
        label: '投放场景审核',
      },
    ],
  },
  {
    key: 'delivery-deeplink',
    icon: <BranchesOutlined />,
    label: 'deeplink管理',
  },
  {
    key: 'public-data-management',
    icon: <ApartmentOutlined />,
    label: '银证渠道回传管理',
  },
];

export const menuKeyToPath = routeMetaList.reduce((accumulator, item) => {
  if (
    item.path.includes('/create') ||
    item.path.includes('/edit') ||
    item.path.includes('/view') ||
    item.path.includes('/detail') ||
    item.path.includes('/dict') ||
    item.path.endsWith('/review')
  ) {
    return accumulator;
  }

  accumulator[item.menuKey] = item.path;
  return accumulator;
}, {});

export const defaultOpenKeys = [];
