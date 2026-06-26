import { Typography } from 'antd';

const { Text } = Typography;

export type EventLevel = 'critical' | 'warning' | 'info' | 'success';

export interface DetailEventItem {
  index: number;
  level: EventLevel;
  time: string;
  title: string;
  desc: string;
}

interface Props {
  events?: DetailEventItem[];
}

// TODO: 백엔드 연동 후 mock 데이터 제거
const mockEvents: DetailEventItem[] = [
  { index: 1, level: 'critical', time: '11:02:30', title: 'SGW-0012 응답 없음', desc: 'Timeout 30s 초과' },
  { index: 2, level: 'warning',  time: '10:58:40', title: 'PGW-0005 CPU 경고', desc: '사용률 98% 초과' },
  { index: 3, level: 'success',  time: '09:30:12', title: 'SGW-0008 정상 복구', desc: '12분간 오류 후 복구' },
  { index: 4, level: 'info',     time: '08:15:40', title: '설정 업데이트',     desc: 'admin · 포트 변경 80 → 443' },
  { index: 5, level: 'critical', time: '02:18:22', title: '비인가 접속 시도',  desc: '203.0.113.42 → DROP' },
];

const dotColor = (level: EventLevel) => {
  switch (level) {
    case 'critical': return '#EF4444';
    case 'warning':  return '#F59E0B';
    case 'success':  return '#10B981';
    case 'info':
    default:         return '#3B82F6';
  }
};

const RecentEventList: React.FC<Props> = ({ events = mockEvents }) => {
  return (
    <div>
      {events.map((evt, idx) => (
        <div
          key={evt.index}
          style={{
            display: 'flex',
            gap: 12,
            padding: '12px 0',
            borderBottom: idx < events.length - 1 ? '1px dashed #f0f0f0' : 'none',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: dotColor(evt.level),
              marginTop: 6,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>{evt.time}</Text>
            <div><Text strong>{evt.title}</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>{evt.desc}</Text>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentEventList;
