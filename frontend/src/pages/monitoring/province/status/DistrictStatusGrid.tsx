import { Card, Typography, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import { useLocations } from '../../../../commons/LocationContext';


const { Text, Title } = Typography;

// 시/군/구 카드 1개 표시용. MonitoringRegion 에서 만들어 props 로 전달.
export interface DistrictStatus {
  value: number;
  label: string;
  total: number;
  normal: number;
  error: number;
}

interface DistrictStatusGridProps {
  region: number;
  districts: DistrictStatus[];                   // 컨트롤러가 등록된 시/군/구만 (parent 에서 filter).
  onDistrictClick?: (district: number) => void;  // 카드 클릭 시 부모 (MonitoringRegion) 의 district 상태 변경.
}

const getMiniDonutOption = (normal: number, error: number) => ({
  series: [
    {
      type: 'pie',
      radius: ['60%', '85%'],
      silent: true,
      label: { show: false },
      data: [
        { value: normal || 0, itemStyle: { color: '#10B981' } },
        { value: error || 0, itemStyle: { color: '#EF4444' } },
        // 데이터가 없을 때 빈 도넛을 그리기 위한 fallback
        ...(normal === 0 && error === 0 ? [{ value: 1, itemStyle: { color: '#e8e8e8' } }] : []),
      ],
    },
  ],
});

const StatusDot: React.FC<{ color: string; label: string; count: number }> = ({ color, label, count }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
    <Text style={{ fontSize: 12 }}>{label}: {count}</Text>
  </div>
);

const DistrictStatusGrid: React.FC<DistrictStatusGridProps> = ({ region, districts, onDistrictClick }) => {
  const { map: locationMap } = useLocations();

  if (districts.length === 0) {
    return null;
  }

  const regionName = locationMap.get(region)?.name ?? '---';

  return (
    <div style={{ marginTop: 16 }}>
      <Title level={5} style={{ margin: '0 0 12px 0' }}>
        {regionName} 시/군/구 상태
      </Title>
      <Row gutter={[12, 12]}>
        {districts.map((district) => (
          <Col xs={12} sm={8} md={6} lg={4} key={district.value}>
            <Card
              size="small"
              hoverable={!!onDistrictClick}
              onClick={() => onDistrictClick?.(district.value)}
              styles={{ body: { padding: 12 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text strong style={{ fontSize: 13 }}>{district.label}</Text>
                  <div style={{ fontSize: 20, fontWeight: 'bold', margin: '2px 0' }}>{district.total}</div>
                  <div style={{ marginTop: 4 }}>
                    <StatusDot color="#10B981" label="정상" count={district.normal} />
                    <StatusDot color="#EF4444" label="오류" count={district.error} />
                  </div>
                </div>
                <ReactECharts
                  option={getMiniDonutOption(district.normal, district.error)}
                  style={{ height: 50, width: 50 }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DistrictStatusGrid;
