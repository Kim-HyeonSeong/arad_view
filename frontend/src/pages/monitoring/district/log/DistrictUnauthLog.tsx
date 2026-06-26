import { Table, Tag, message } from 'antd';
import { getDvcTpToStr } from '../../../../commons/ConvertValStr';
import * as CstDef from '../../../../commons/CstDef';
import * as MonitoringCmd from '../../../../bulk_cmd/convert/monitoring/ConvertMonitoringCmd';
import { applyCmd } from '../../../../bulk_cmd/api/ApplyCmdList';
import { useEffect, useState } from 'react';

interface SecurityLogItem {
  index: number;
  update_time: string;
  dvc_nm: string;
  dvc_tp: number;
  protocol: string;
  src_ip_string: string;
  src_port: string;
  dst_ip_string: string;
  dest_port: string;
  event_msg: string;
  action: string;
  controller?: string;
}

interface Props {
  district: number;
  limit?: number;
}

const actionColor = (action: string) => {
  switch (action) {
    case 'DROP':
      return 'red';
    case 'REJECT':
      return 'volcano';
    default:
      return 'default';
  }
};

const DistrictUnauthLog: React.FC<Props> = ({ district, limit = 10 }) => {
  const [logData, setLogData] = useState<SecurityLogItem[]>([]);

  const getDistrictUnauthLogData = async () => {
    const category = 'location';
    const cmd = MonitoringCmd.getMonitoringUnauthLogToBulkCmd(category, district, limit);
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
      message.error(ret.msg || '비인가 로그 데이터를 불러오는데 실패했습니다.');
      return;
    }

    // 백엔드 응답: { logs: SecurityLogItem[]; totalCount: number } 래퍼 형태.
    // ret.data 통째로 setLogData 에 넣으면 antd Table 이 배열이 아닌 객체를 받아 some() 호출 시 터짐.
    const wrapper = (ret.data ?? {}) as { logs?: SecurityLogItem[]; totalCount?: number };
    setLogData(wrapper.logs ?? []);
  }

  useEffect(() => {
    getDistrictUnauthLogData();
  }, [district]);

  const columns = [
    { title: '#', dataIndex: 'index', key: 'index', width: 50, sorter: (a: SecurityLogItem, b: SecurityLogItem) => a.index - b.index },
    { title: '날짜', dataIndex: 'update_time', key: 'update_time', width: 150, sorter: (a: SecurityLogItem, b: SecurityLogItem) => new Date(a.update_time).getTime() - new Date(b.update_time).getTime() },
    { title: '컨트롤러', dataIndex: 'controller', key: 'controller', width: 120, sorter: (a: SecurityLogItem, b: SecurityLogItem) => (a.controller || '').localeCompare(b.controller || '') },
    { title: '이름', dataIndex: 'dvc_nm', key: 'dvc_nm', width: 100, sorter: (a: SecurityLogItem, b: SecurityLogItem) => a.dvc_nm.localeCompare(b.dvc_nm) },
    { title: '모델명', dataIndex: 'dvc_tp', key: 'dvc_tp', width: 100, render: (text: number) => getDvcTpToStr(text), sorter: (a: SecurityLogItem, b: SecurityLogItem) => a.dvc_tp - b.dvc_tp },
    { title: 'SRC IP', dataIndex: 'src_ip_string', key: 'src_ip_string', width: 120, sorter: (a: SecurityLogItem, b: SecurityLogItem) => a.src_ip_string.localeCompare(b.src_ip_string) },
    { title: 'DST IP', dataIndex: 'dst_ip_string', key: 'dst_ip_string', width: 120, sorter: (a: SecurityLogItem, b: SecurityLogItem) => a.dst_ip_string.localeCompare(b.dst_ip_string) },
    {
      title: '액션',
      dataIndex: 'action',
      key: 'action',
      width: 90,
      render: (action: string) => <Tag color={actionColor(action)}>{action}</Tag>,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={logData}
      rowKey="index"
      size="small"
      pagination={false}
    />
  );
};

export default DistrictUnauthLog;
