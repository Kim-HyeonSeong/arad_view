import { Tabs, Typography } from 'antd';
import RegionTab from './tabs/RegionTab';
import ConstructorTab from './tabs/ConstructorTab';

const { Title } = Typography;

const ACCENT_COLOR = '#171C61';

const ReferenceSetting: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>기준 정보 관리</Title>
      </div>

      {/* 선택된 탭 스타일 커스터마이즈 — SystemSetting 과 동일 클래스명 재사용 */}
      <style>{`
        .systemsetting-tabs .ant-tabs-tab-active {
          background: ${ACCENT_COLOR};
          border-radius: 4px 4px 0 0;
        }
        .systemsetting-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #ffffff !important;
        }
        .systemsetting-tabs .ant-tabs-tab {
          padding: 8px 24px;
          margin: 0 4px 0 0 !important;
        }
        .systemsetting-tabs .ant-tabs-nav::before {
          border-bottom-color: #ffffff !important;
        }
        .systemsetting-tabs .ant-tabs-ink-bar {
          background: #ffffff !important;
          clip-path: inset(0 15% 0 15%);
        }
      `}</style>

      <Tabs
        className="systemsetting-tabs"
        defaultActiveKey="region"
        items={[
          { key: 'region',      label: '지역 설정', children: <RegionTab /> },
          { key: 'constructor', label: '업체 설정', children: <ConstructorTab /> },
        ]}
      />
    </div>
  );
};

export default ReferenceSetting;
