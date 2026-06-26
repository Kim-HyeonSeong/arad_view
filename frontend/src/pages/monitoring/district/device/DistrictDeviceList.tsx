import { useMemo } from 'react';
import { Table, Tag } from 'antd';

export interface DeviceItem {
  index: number;
  status: 'normal' | 'error';
  type: 'SGW' | 'PGW';
  name: string;
  ip: string;
  controller: string;
  last_comm: string;
}

interface Props {
  district: number;
  limit?: number;
}

// TODO: 백엔드 연동 후 mock 데이터 제거
const mockDevices: DeviceItem[] = [
  { index: 1, status: 'error',  type: 'SGW', name: 'SGW_0012',     ip: '10.75.10.112', controller: '강남힐스테이트', last_comm: '11:02:30' },
  { index: 2, status: 'error',  type: 'PGW', name: 'PGW_0005_3_2', ip: '10.75.11.25',  controller: '강남힐스테이트', last_comm: '10:58:40' },
  { index: 3, status: 'error',  type: 'PGW', name: 'PGW_0011_2_1', ip: '10.75.12.41',  controller: '반포자이',       last_comm: '10:42:08' },
  { index: 4, status: 'normal', type: 'SGW', name: 'SGW_0008',     ip: '10.75.10.108', controller: '래미안강남',     last_comm: '14:25:01' },
  { index: 5, status: 'normal', type: 'PGW', name: 'PGW_0003_1_1', ip: '10.75.10.103', controller: '래미안강남',     last_comm: '14:23:11' },
];

const statusTag = (status: DeviceItem['status']) => {
  if (status === 'error') return <Tag color="red">오류</Tag>;
  return <Tag color="green">정상</Tag>;
};

const DistrictDeviceList: React.FC<Props> = ({ limit }) => {
  // TODO: district 파라미터로 해당 시군구의 장비만 조회
  // 오류 우선 정렬
  const data = useMemo(() => {
    const sorted = [...mockDevices].sort((a, b) => {
      if (a.status === b.status) return 0;
      return a.status === 'error' ? -1 : 1;
    });
    return limit ? sorted.slice(0, limit) : sorted;
  }, [limit]);

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      sorter: (a: DeviceItem, b: DeviceItem) => a.index - b.index,
    },
    {
      title: '유형',
      dataIndex: 'type',
      key: 'type',
      width: 70,
      sorter: (a: DeviceItem, b: DeviceItem) => a.type.localeCompare(b.type),
    },
    {
      title: '장비 이름',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      sorter: (a: DeviceItem, b: DeviceItem) => a.name.localeCompare(b.name),
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
      width: 130,
      sorter: (a: DeviceItem, b: DeviceItem) => a.ip.localeCompare(b.ip),
    },
    {
      title: '컨트롤러',
      dataIndex: 'controller',
      key: 'controller',
      width: 200,
      sorter: (a: DeviceItem, b: DeviceItem) => a.controller.localeCompare(b.controller),
    },
    {
      title: '마지막 통신',
      dataIndex: 'last_comm',
      key: 'last_comm',
      width: 100,
      sorter: (a: DeviceItem, b: DeviceItem) => a.last_comm.localeCompare(b.last_comm),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 70,
      sorter: (a: DeviceItem, b: DeviceItem) => a.status.localeCompare(b.status),
      render: (s: DeviceItem['status']) => statusTag(s),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="index"
      size="small"
      pagination={false}
    />
  );
};

export default DistrictDeviceList;
