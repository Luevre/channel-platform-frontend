import { MenuOutlined } from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Grid, Layout, Menu, Tabs } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  defaultOpenKeys,
  menuItems,
  menuKeyToPath,
  routeMetaList,
  routeMetaMap,
} from '../router/routeMeta.jsx';

const { Header, Sider, Content } = Layout;

function buildDefaultTabs(pathname) {
  const activeMeta = routeMetaMap[pathname] || routeMetaList[0];
  return [activeMeta];
}

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const [openTabs, setOpenTabs] = useState(() => buildDefaultTabs(location.pathname));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const currentMeta = routeMetaMap[location.pathname];
    if (!currentMeta) {
      return;
    }

    setOpenTabs((previous) => {
      const exists = previous.some((item) => item.path === currentMeta.path);
      return exists ? previous : [...previous, currentMeta];
    });
  }, [location.pathname]);

  const selectedKeys = useMemo(() => {
    const currentMeta = routeMetaMap[location.pathname];
    return currentMeta?.menuKey ? [currentMeta.menuKey] : [];
  }, [location.pathname]);

  const onMenuClick = ({ key }) => {
    const targetPath = menuKeyToPath[key];
    if (targetPath) {
      navigate(targetPath);
      if (isMobile) {
        setDrawerOpen(false);
      }
    }
  };

  const onTabChange = (activeKey) => {
    navigate(activeKey);
  };

  const onTabEdit = (targetKey, action) => {
    if (action !== 'remove') {
      return;
    }

    const closableTabs = openTabs.filter((item) => item.path !== targetKey);
    if (closableTabs.length === 0) {
      const firstTab = routeMetaList[0];
      setOpenTabs([firstTab]);
      navigate(firstTab.path);
      return;
    }

    setOpenTabs(closableTabs);

    if (location.pathname === targetKey) {
      const removedIndex = openTabs.findIndex((item) => item.path === targetKey);
      const nextTab = closableTabs[removedIndex - 1] || closableTabs[0];
      navigate(nextTab.path);
    }
  };

  const tabItems = openTabs.map((item, index) => ({
    key: item.path,
    label: item.title,
    closable: index !== 0,
  }));

  return (
    <Layout className="app-shell">
      {isMobile ? null : (
        <Sider width={248} className="app-sider" theme="dark">
          <div className="app-logo">渠道投放管理平台</div>
          <Menu
            theme="dark"
            mode="inline"
            items={menuItems}
            selectedKeys={selectedKeys}
            defaultOpenKeys={defaultOpenKeys}
            onClick={onMenuClick}
            className="app-menu"
          />
        </Sider>
      )}
      <Drawer
        title="渠道投放管理平台"
        placement="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className="mobile-menu-drawer"
        width={248}
      >
        <Menu
          mode="inline"
          items={menuItems}
          selectedKeys={selectedKeys}
          defaultOpenKeys={defaultOpenKeys}
          onClick={onMenuClick}
        />
      </Drawer>
      <Layout className="app-main">
        <Header className="app-header">
          {isMobile ? (
            <div className="mobile-topbar">
              <div className="mobile-topbar-title">渠道投放管理平台</div>
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                className="mobile-menu-button"
              />
            </div>
          ) : null}
          <Tabs
            hideAdd
            type="editable-card"
            items={tabItems}
            activeKey={location.pathname}
            onChange={onTabChange}
            onEdit={onTabEdit}
            className="app-tabs"
          />
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
