import { useMemo, useState } from 'react';
import { Table, Tag, Radio, Typography } from 'antd';

const { Text } = Typography;

export interface DetailDeviceItem {
  index: number;
  status: 'normal' | 'error';
  type: 'SGW' | 'PGW';
  device_id: string;
  ip: string;
  last_comm: string;
  desc: string;
}

type Filter = 'all' | 'normal' | 'error';

// TODO: 백엔드 연동 후 mock 데이터 제거
const mockDevices: DetailDeviceItem[] = [
  { index: 1, status: 'error',  type: 'SGW', device_id: 'SGW-0012', ip: '10.75.10.112', last_comm: '11:02:30', desc: '응답 없음 (timeout)' },
  { index: 2, status: 'error',  type: 'SGW', device_id: 'SGW-0018', ip: '10.75.10.118', last_comm: '11:02:28', desc: '인증 실패' },
  { index: 3, status: 'error',  type: 'SGW', device_id: 'SGW-0024', ip: '10.75.10.124', last_comm: '11:01:55', desc: '응답 없음 (timeout)' },
  { index: 4, status: 'error',  type: 'PGW', device_id: 'PGW-0005', ip: '10.75.11.25',  last_comm: '10:58:40', desc: 'CPU 과부하 (98%)' },
  { index: 5, status: 'error',  type: 'SGW', device_id: 'SGW-0031', ip: '10.75.10.131', last_comm: '10:55:12', desc: '메모리 부족' },
  { index: 6, status: 'error',  type: 'SGW', device_id: 'SGW-0047', ip: '10.75.10.147', last_comm: '10:42:08', desc: '응답 없음 (timeout)' },
  { index: 7, status: 'normal', type: 'SGW', device_id: 'SGW-0008', ip: '10.75.10.108', last_comm: '14:25:01', desc: '-' },
  { index: 8, status: 'normal', type: 'PGW', device_id: 'PGW-0003', ip: '10.75.10.103', last_comm: '14:23:11', desc: '-' },
];

const statusTag = (s: DetailDeviceItem['status']) =>
  s === 'error' ? <Tag color="red">오류</Tag> : <Tag color="green">정상</Tag>;

const DetailDeviceList: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('error');

  const total = mockDevices.length;
  const errorCount = mockDevices.filter((d) => d.status === 'error').length;

  const data = useMemo(() => {
    if (filter === 'all') return mockDevices;
    return mockDevices.filter((d) => d.status === filter);
  }, [filter]);

  const columns = [
    { title: '상태', dataIndex: 'status', key: 'status', width: 80, render: (s: DetailDeviceItem['status']) => statusTag(s) },
    { title: '유형', dataIndex: 'type', key: 'type', width: 70 },
    { title: '장비 ID', dataIndex: 'device_id', key: 'device_id', width: 120 },
    { title: 'IP', dataIndex: 'ip', key: 'ip', width: 130 },
    { title: '마지막 통신', dataIndex: 'last_comm', key: 'last_comm', width: 110 },
    { title: '설명', dataIndex: 'desc', key: 'desc' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Text strong style={{ fontSize: 16 }}>장비 목록</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            총 {total}대 · 오류 {errorCount}대
          </Text>
        </div>
        <Radio.Group value={filter} onChange={(e) => setFilter(e.target.value)} optionType="button">
          <Radio.Button value="all">전체</Radio.Button>
          <Radio.Button value="normal">정상만</Radio.Button>
          <Radio.Button value="error">오류만 (기본)</Radio.Button>
        </Radio.Group>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="index"
        size="small"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default DetailDeviceList;
