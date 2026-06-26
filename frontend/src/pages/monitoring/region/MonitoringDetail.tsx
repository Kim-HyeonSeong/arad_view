import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Card, Row, Col, Button, Space, Select, Empty } from 'antd';
import { ReloadOutlined, ExportOutlined, FileTextOutlined } from '@ant-design/icons';
import * as CompanyDef from '../../../commons/CompanyDef';
import type { CompoundItem } from '../district/CompoundCard';
import DetailHeader from './header/DetailHeader';
import DetailStatusOverview from './status/DetailStatusOverview';
import DetailDeviceList from './device/DetailDeviceList';
// import RecentEventList from './event/RecentEventList';
import DistrictUnauthLog from '../district/log/DistrictUnauthLog';
import ControllerModal from '../../controller/controllers/ControllerModal';
import type { ControllerFormValues } from '../../controller/controllers/ControllerModal';

const { Text, Title } = Typography;

export interface MonitoringDetailItem {
  id: number;
  name: string;
  ip: string;
  port: number;
  status: string;
  location_id: number;        // 통합 location 트리 노드 id (시군구 또는 광역)
  constructor_id: number[];
  homenet_id: number[];
  last_connect_at: string;
  description: string;
  anydesk_id: string;
  // 모니터링 데이터 (실제로는 별도 API)
  sgw_total: number;
  sgw_error: number;
  pgw_total: number;
  pgw_error: number;
}

interface LocationState {
  compound: CompoundItem;
  district: number;
}

// TODO: 백엔드 연동 후 mock 데이터 제거 — ControllerManagement 의 컨트롤러 목록을 사용.
// location_id 는 BE locations 트리의 실제 id (예: 41=강남구) 와 일치해야 표시가 정상.
const mockControllers: MonitoringDetailItem[] = [
  { id: 1, name: 'Controller_1', ip: '10.75.10.60', port: 443, status: 'Active',   location_id: 41,  constructor_id: [CompanyDef.Daewoo],  homenet_id: [CompanyDef.Kocom],   last_connect_at: '2026-04-08 09:30:00', description: 'Description_1', anydesk_id: '1642144979', sgw_total: 72, sgw_error: 6, pgw_total: 56, pgw_error: 2 },
  { id: 2, name: 'Controller_2', ip: '10.75.10.63', port: 443, status: 'Inactive', location_id: 44,  constructor_id: [CompanyDef.GS_EnC],   homenet_id: [CompanyDef.Commax],  last_connect_at: '2026-04-07 14:20:00', description: 'Description_2', anydesk_id: '',           sgw_total: 48, sgw_error: 0, pgw_total: 42, pgw_error: 0 },
  { id: 3, name: 'Controller_3', ip: '192.168.0.3', port: 443, status: 'Active',   location_id: 96,  constructor_id: [CompanyDef.HDC],      homenet_id: [CompanyDef.Zigbang], last_connect_at: '2026-04-06 08:15:00', description: 'Description_3', anydesk_id: '',           sgw_total: 60, sgw_error: 0, pgw_total: 52, pgw_error: 1 },
  { id: 4, name: 'Controller_4', ip: '192.168.0.4', port: 443, status: 'Inactive', location_id: 0,   constructor_id: [CompanyDef.Samsung],  homenet_id: [CompanyDef.HT],      last_connect_at: '2026-04-05 16:45:00', description: 'Description_4', anydesk_id: '',           sgw_total: 36, sgw_error: 0, pgw_total: 32, pgw_error: 0 },
  { id: 5, name: 'Controller_5', ip: '192.168.0.5', port: 443, status: 'Active',   location_id: 0,   constructor_id: [CompanyDef.SK],       homenet_id: [CompanyDef.Haion],   last_connect_at: '2026-04-04 11:30:00', description: 'Description_5', anydesk_id: '',           sgw_total: 28, sgw_error: 0, pgw_total: 24, pgw_error: 0 },
];

const MonitoringDetail: React.FC = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [selectedId, setSelectedId] = useState<number | null>(() => {
    // 단지 카드 클릭으로 들어오면 같은 id를 가진 컨트롤러를 자동 선택
    if (state?.compound) {
      const match = mockControllers.find((c) => c.id === state.compound.id);
      return match?.id ?? null;
    }
    return null;
  });

  const selected = useMemo(
    () => mockControllers.find((c) => c.id === selectedId) ?? null,
    [selectedId],
  );

  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditOk = (values: ControllerFormValues) => {
    console.log('Update:', values);
    // TODO: 백엔드 API 연동
    setEditModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowX: 'hidden', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Title level={4} style={{ margin: 0 }}>컨트롤러 상세 모니터링</Title>
        <Select
          placeholder="컨트롤러를 선택하세요"
          value={selectedId}
          onChange={setSelectedId}
          options={mockControllers.map((c) => ({ label: c.name, value: c.id }))}
          style={{ minWidth: 240 }}
          allowClear
        />
      </div>

      {selected ? (
        <>
          <DetailHeader controller={selected} onEdit={() => setEditModalOpen(true)} />

          <div style={{ marginBottom: 16 }}>
            <DetailStatusOverview
              controller={selected}
              cpu={42}
              memory={68}
              network="12 Mbps"
              lastReceived={{ relative: '방금 전', absolute: '2026-04-21 14:25:03' }}
            />
          </div>

          <Row gutter={[16, 16]} style={{ flex: 1 }}>
            <Col xs={24} lg={16}>
              <Card size="small">
                <DetailDeviceList />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* <Card title="최근 이벤트 (24h)" size="small" extra={<Text type="secondary">12건</Text>}>
                  <RecentEventList />
                </Card> */}
                <Card
                  title="비인가 로그 (최근 5건)"
                  size="small"
                  extra={<Button type="link" size="small">전체 보기 →</Button>}
                  styles={{ body: { padding: 0 } }}
                >
                  <DistrictUnauthLog district={selected.location_id} limit={5} />
                </Card>
              </div>
            </Col>
          </Row>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 0',
              marginTop: 16,
              borderTop: '1px solid #f0f0f0',
              flexWrap: 'wrap',
              gap: 8,
            }}
          >
            <Text type="secondary">
              자동 새로고침: <Text strong>30초</Text> (시스템 설정 적용) · 다음 갱신까지 <Text strong>12s</Text>
            </Text>
            <Space wrap>
              <Button icon={<ReloadOutlined />}>수동 새로고침</Button>
              <Button icon={<ExportOutlined />}>CSV 내보내기</Button>
              <Button type="primary" icon={<FileTextOutlined />}>전체 이력 보기</Button>
            </Space>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="컨트롤러를 선택하면 상세 정보가 표시됩니다." />
        </div>
      )}

      <ControllerModal
        open={editModalOpen}
        editMode={true}
        initialValues={selected}
        onOk={handleEditOk}
        onCancel={() => setEditModalOpen(false)}
      />
    </div>
  );
};

export default MonitoringDetail;
