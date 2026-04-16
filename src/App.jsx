import { Navigate, useRoutes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { CallbackNodeFormPage } from './pages/callback/CallbackNodeFormPage';
import { CallbackNodeListPage } from './pages/callback/CallbackNodeListPage';
import { CallbackStrategyFormPage } from './pages/callback/CallbackStrategyFormPage';
import { CallbackStrategyListPage } from './pages/callback/CallbackStrategyListPage';
import { MyParameterFormPage } from './pages/channel/MyParameterFormPage';
import { MyParameterListPage } from './pages/channel/MyParameterListPage';
import { PlacementParameterDetailPage } from './pages/channel/PlacementParameterDetailPage';
import { PlacementParameterFormPage } from './pages/channel/PlacementParameterFormPage';
import { PlacementParameterListPage } from './pages/channel/PlacementParameterListPage';
import { PlacementReviewDetailPage } from './pages/channel/PlacementReviewDetailPage';
import { PlacementReviewListPage } from './pages/channel/PlacementReviewListPage';
import { DeliveryLinkFormPage } from './pages/delivery/DeliveryLinkFormPage';
import { DeliveryLinkListPage } from './pages/delivery/DeliveryLinkListPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { routeMetaList } from './router/routeMeta.jsx';
// ↓ 新增这两行
import AuthGuard from './router/AuthGuard';
import LoginPage from './pages/Login';

function createPlaceholder(title, description) {
  return <PlaceholderPage title={title} description={description} />;
}

export default function App() {
  const routes = useRoutes([
    // ↓ 新增登录路由
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/',
      // ↓ 只改这一行：套上 AuthGuard
      element: <AuthGuard><AppLayout /></AuthGuard>,
      children: [
        { index: true, element: <Navigate to="/channel/placement-params" replace /> },
        { path: 'channel/placement-params', element: <PlacementParameterListPage /> },
        { path: 'channel/placement-params/create', element: <PlacementParameterFormPage mode="create" /> },
        { path: 'channel/placement-params/edit', element: <PlacementParameterFormPage mode="edit" /> },
        { path: 'channel/placement-params/view', element: <PlacementParameterDetailPage /> },
        { path: 'channel/my-params', element: <MyParameterListPage /> },
        { path: 'channel/my-params/create', element: <MyParameterFormPage mode="create" /> },
        { path: 'channel/my-params/review', element: <MyParameterFormPage mode="edit" /> },
        { path: 'channel/placement-review', element: <PlacementReviewListPage /> },
        { path: 'channel/placement-review/detail', element: <PlacementReviewDetailPage from="review" /> },
        { path: 'callback/node-management', element: <CallbackNodeListPage /> },
        { path: 'callback/node-management/create', element: <CallbackNodeFormPage mode="create" /> },
        { path: 'callback/node-management/edit', element: <CallbackNodeFormPage mode="edit" /> },
        { path: 'callback/my-node', element: createPlaceholder('我的节点管理', '页面建设中，原型图完善后补充。') },
        { path: 'callback/node-review', element: createPlaceholder('回传节点审核', '页面建设中，原型图完善后补充。') },
        { path: 'callback/strategy-management', element: <CallbackStrategyListPage /> },
        { path: 'callback/strategy-management/create', element: <CallbackStrategyFormPage /> },
        { path: 'delivery/link-management', element: <DeliveryLinkListPage /> },
        { path: 'delivery/link-management/create', element: <DeliveryLinkFormPage mode="create" /> },
        { path: 'delivery/link-management/edit', element: <DeliveryLinkFormPage mode="edit" /> },
        { path: 'delivery/my-scene', element: createPlaceholder('我的投放场景', '页面建设中，原型图完善后补充。') },
        { path: 'delivery/scene-review', element: createPlaceholder('投放场景审核', '页面建设中，原型图完善后补充。') },
        {
          path: 'delivery/deeplink',
          element: createPlaceholder('deeplink管理', '原型中暂未给出 deeplink 页面，先保留菜单入口。'),
        },
        {
          path: 'public/data-management',
          element: createPlaceholder('公域数据管理', '原型中暂未给出公域数据页面，后续可继续扩展。'),
        },
        {
          path: 'report/performance',
          element: createPlaceholder('渠道投放成效管理', '原型中暂未给出成效页面，后续可继续扩展。'),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to={routeMetaList[0].path} replace />,
    },
  ]);

  return routes;
}
