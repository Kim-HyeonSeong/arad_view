import { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import {
  DashboardOutlined,
  LaptopOutlined,
  DesktopOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const buildMenuItems = (): MenuProps['items'] => {
  const items: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '대시보드',
    },
    {
      key: 'monitoring-group',
      icon: <DesktopOutlined />,
      label: '모니터링',
      children: [
        { key: '/monitoring/region', label: '지역별 모니터링' },
        { key: '/monitoring/company',  label: '업체별 모니터링' },
        { key: '/monitoring/detail',   label: ' 컨트롤러 상세 모니터링' },
      ],
    },
    {
      key: '/controller',
      icon: <LaptopOutlined />,
      label: '컨트롤러 관리',
    },
    {
      key: '/accounts',
      icon: <UserOutlined />,
      label: '계정 관리',
    },
    {
      key: 'settings-group',
      icon: <SettingOutlined />,
      label: '설정',
      children: [
        { key: '/settings/system', label: '시스템 설정' },
        { key: '/settings/reference', label: '기준 정보 관리' },
        { key: '/settings/database', label: '데이터베이스 설정' },
      ],
    },
  ];

  return items;
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const menuItems = buildMenuItems();

  const handleMenuClick = (e: { key: string }) => {
    // URL 형태의 key만 navigate (그룹용 식별자는 무시)
    if (e.key.startsWith('/')) {
      navigate(e.key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      collapsedWidth={60}
      width={200}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      style={{
        overflow: 'hidden',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        transition: 'all 0.2s',
      }}
    >
      <div
        style={{
          height: 32,
          margin: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {collapsed ? (
          <img
            src={logo}
            alt="ARAD VIEW"
            style={{ height: 28, width: 28, objectFit: 'contain' }}
          />
        ) : (
          <span style={{ color: '#fff', fontWeight: 'bold' }}>ARAD VIEW</span>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['/']}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
