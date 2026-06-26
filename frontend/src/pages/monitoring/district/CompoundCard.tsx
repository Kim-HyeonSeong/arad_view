import { Card, Typography, Row, Col } from 'antd';

const { Text } = Typography;

export interface CompoundItem {
  id: number;
  name: string;
  construction_company: string;
  wall_pad_company: string;
  sgw_total: number;
  sgw_normal: number;
  sgw_error: number;
  pgw_total: number;
  pgw_normal: number;
  pgw_error: number;
}

interface Props {
  data: CompoundItem;
  onClick?: (item: CompoundItem) => void;
}

const CompoundCard: React.FC<Props> = ({ data, onClick }) => {
  const hasError = data.sgw_error > 0 || data.pgw_error > 0;
  const topBarColor = hasError ? '#EF4444' : '#10B981';

  return (
    <Card
      hoverable={!!onClick}
      onClick={() => onClick?.(data)}
      styles={{ body: { padding: 16 } }}
      style={{ borderTop: `3px solid ${topBarColor}` }}
    >
      <div style={{ marginBottom: 4 }}>
        <Text strong style={{ fontSize: 16 }}>{data.name}</Text>
      </div>
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 16 }}>
        {data.construction_company} · {data.wall_pad_company}
      </Text>
      <Row gutter={16}>
        <Col span={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>SGW</Text>
          <div>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{data.sgw_total}대</Text>
          </div>
          <div style={{ fontSize: 12, marginTop: 2 }}>
            <Text style={{ color: '#10B981' }}>정상 {data.sgw_normal}</Text>
            <Text type="secondary" style={{ margin: '0 4px' }}>·</Text>
            <Text style={{ color: data.sgw_error > 0 ? '#EF4444' : undefined }}>오류 {data.sgw_error}</Text>
          </div>
        </Col>
        <Col span={12}>
          <Text type="secondary" style={{ fontSize: 12 }}>PGW</Text>
          <div>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{data.pgw_total}대</Text>
          </div>
          <div style={{ fontSize: 12, marginTop: 2 }}>
            <Text style={{ color: '#10B981' }}>정상 {data.pgw_normal}</Text>
            <Text type="secondary" style={{ margin: '0 4px' }}>·</Text>
            <Text style={{ color: data.pgw_error > 0 ? '#EF4444' : undefined }}>오류 {data.pgw_error}</Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CompoundCard;
