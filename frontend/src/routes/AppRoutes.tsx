import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import AccountManagement from '../pages/auth/AccountManagement';
import Login from '../pages/login/Login';
import ControllerManagement from '../pages/controller/ControllerManagement';
import SystemSetting from '../pages/settings/systemconfig/SystemSetting';
import MonitoringRegion from '../pages/monitoring/province/MonitoringRegion';
import MonitoringDetail from '../pages/monitoring/region/MonitoringDetail';
import MonitoringCompany from '../pages/monitoring/company/MonitoringCompany';
import DataManagement from '../pages/settings/databases/DataManagement';
import ReferenceSetting from '../pages/settings/reference/ReferenceSetting';

const isAuthenticated = () => {
  // TODO: 백엔드 완성 후 토큰 검증 활성화
  // return !!sessionStorage.getItem('access_token');
  return true;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<AccountManagement />} />
        <Route path="/monitoring/region" element={<MonitoringRegion />} />
        <Route path="/monitoring/detail" element={<MonitoringDetail />} />
        <Route path="/monitoring/company" element={<MonitoringCompany />} />
        <Route path="/controller" element={<ControllerManagement />} />
        <Route path="/settings/system" element={<SystemSetting />} />
        <Route path="/settings/database" element={<DataManagement />} />
        <Route path="/settings/reference" element={<ReferenceSetting />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
