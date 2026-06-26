import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 60, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header background={colorBgContainer} />
        <Content style={{ flex: 1, overflow: 'auto', padding: '24px 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
