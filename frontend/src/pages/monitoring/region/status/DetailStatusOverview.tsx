import { Card, Typography, Row, Col, Progress } from 'antd';
import type { MonitoringDetailItem } from '../MonitoringDetail';

const { Text } = Typography;

interface Props {
  controller: MonitoringDetailItem;
  cpu?: number;
  memory?: number;
  network?: string;
  lastReceived?: { relative: string; absolute: string };
}

const GwStatusCard: React.FC<{
  label: string;
  total: number;
  normal: number;
  error: number;
  accent: string;
}> = ({ label, total, normal, error, accent }) => (
  <Card size="small" style={{ borderLeft: `4px solid ${accent}` }}>
    <Text type="secondary" style={{ fontSize: 13 }}>{label}</Text>
    <div style={{ margin: '4px 0' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold' }}>{total}</Text>
      <Text type="secondary" style={{ marginLeft: 4 }}>대</Text>
    </div>
    <div style={{ display: 'flex', gap: 12, fontSize: 13 }}>
      <span style={{ color: '#10B981' }}>정상 {normal}</span>
      <span style={{ color: '#EF4444' }}>오류 {error}</span>
    </div>
  </Card>
);

const DetailStatusOverview: React.FC<Props> = ({
  controller,
  cpu = 0,
  memory = 0,
  network = '-',
  lastReceived = { relative: '-', absolute: '-' },
}) => {
  const sgwNormal = controller.sgw_total - controller.sgw_error;
  const pgwNormal = controller.pgw_total - controller.pgw_error;

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <GwStatusCard
          label="S-GW 현황"
          total={controller.sgw_total}
          normal={sgwNormal}
          error={controller.sgw_error}
          accent="#10B981"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <GwStatusCard
          label="P-GW 현황"
          total={controller.pgw_total}
          normal={pgwNormal}
          error={controller.pgw_error}
          accent="#EF4444"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card size="small">
          <Text type="secondary" style={{ fontSize: 13 }}>리소스 사용률</Text>
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span>CPU</span><span>{cpu}%</span>
            </div>
            <Progress percent={cpu} showInfo={false} size="small" strokeColor="#10B981" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
              <span>Memory</span><span>{memory}%</span>
            </div>
            <Progress percent={memory} showInfo={false} size="small" strokeColor="#F59E0B" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
              <span>Network</span><span>{network}</span>
            </div>
          </div>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card size="small">
          <Text type="secondary" style={{ fontSize: 13 }}>마지막 수신</Text>
          <div style={{ margin: '4px 0' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{lastReceived.relative}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>{lastReceived.absolute}</Text>
        </Card>
      </Col>
    </Row>
  );
};

export default DetailStatusOverview;
