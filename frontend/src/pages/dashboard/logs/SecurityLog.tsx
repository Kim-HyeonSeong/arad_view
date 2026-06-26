import { useState, useEffect, useRef } from 'react';
import { Table, Typography, message } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import * as DashboardCmd from '../../../bulk_cmd/convert/dashboard/ConvertDashboardCmd';
import { applyCmd } from '../../../bulk_cmd/api/ApplyCmdList';
import * as CstDef from '../../../commons/CstDef';

const { Title } = Typography;

// /api/v1/dashboard/unauth_logs 응답 1건 스키마
interface UnauthLogItem {
  id: number;
  occurred_at: string;
  controller_id: number;
  controller_name: string;
  src_ip: string;
  src_port: number;
  src_mac: string;
  dst_ip: string;
  dst_port: number;
  dst_mac: string;
  protocol: string;
  action: string;
  created_at: string;
}

interface SecurityLogProps {
  refreshIntervalMs?: number;   // 부모(Dashboard)가 backend ui.data_refresh_interval_seconds 로 결정
}

const FETCH_SIZE = 10;   // 최근 N건

const SecurityLog: React.FC<SecurityLogProps> = ({ refreshIntervalMs = 0 }) => {
  const [logData, setLogData] = useState<UnauthLogItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const getLogData = async () => {
    setLoading(true);
    const cmd = DashboardCmd.getDashboardUnauthLogsToBulkCmd(FETCH_SIZE);
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
      message.error(ret.msg || '조회에 실패했습니다.');
      setLoading(false);
      return;
    }

    const data = ret.data as { logs: UnauthLogItem[]; totalCount: number } | null;
    setLogData(data?.logs ?? []);
    setTotalCount(data?.totalCount ?? 0);
    setLoading(false);
  };

  // 최신 fetch 참조 유지 — setInterval closure stale 방지
  const refreshRef = useRef(getLogData);
  refreshRef.current = getLogData;

  // 마운트 시 1회 fetch
  useEffect(() => {
    refreshRef.current();
  }, []);

  // 주기적 refresh — refreshIntervalMs 가 바뀌면 interval 재설정.
  useEffect(() => {
    if (refreshIntervalMs <= 0) return;
    const intervalId = setInterval(() => { refreshRef.current(); }, refreshIntervalMs);
    return () => clearInterval(intervalId);
  }, [refreshIntervalMs]);

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 60,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.id - b.id,
    },
    { title: '발생시각', dataIndex: 'occurred_at', key: 'occurred_at', width: 180,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) =>
        new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime(),
      defaultSortOrder: 'descend' as const,
    },
    { title: '컨트롤러 이름', dataIndex: 'controller_name', key: 'controller_name', width: 110,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.controller_name.localeCompare(b.controller_name),
    },
    { title: '컨트롤러 ID', dataIndex: 'controller_id', key: 'controller_id', width: 110,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.controller_id - b.controller_id,
    },
    { title: 'Protocol', dataIndex: 'protocol', key: 'protocol', width: 80,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.protocol.localeCompare(b.protocol),
    },
    { title: 'SRC IP', dataIndex: 'src_ip', key: 'src_ip', width: 130,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.src_ip.localeCompare(b.src_ip),
    },
    { title: 'SRC PORT', dataIndex: 'src_port', key: 'src_port', width: 90,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.src_port - b.src_port,
    },
    { title: 'SRC MAC', dataIndex: 'src_mac', key: 'src_mac', width: 150 },
    { title: 'DST IP', dataIndex: 'dst_ip', key: 'dst_ip', width: 130,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.dst_ip.localeCompare(b.dst_ip),
    },
    { title: 'DST PORT', dataIndex: 'dst_port', key: 'dst_port', width: 90,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.dst_port - b.dst_port,
    },
    { title: 'DST MAC', dataIndex: 'dst_mac', key: 'dst_mac', width: 150 },
    { title: 'ACTION', dataIndex: 'action', key: 'action', width: 90,
      sorter: (a: UnauthLogItem, b: UnauthLogItem) => a.action.localeCompare(b.action),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: '#171C61' }}>
          로그 목록 (전체 {totalCount}건 중 최근 {logData.length}건)
        </Title>
        <SyncOutlined
          style={{ fontSize: 20, cursor: 'pointer', color: '#171C61' }}
          spin={loading}
          onClick={() => getLogData()}
        />
      </div>
      <Table
        columns={columns}
        dataSource={logData}
        rowKey="id"
        size="small"
        loading={loading}
        pagination={{
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        }}
        scroll={{ x: 1300, y: 200 }}
      />
    </div>
  );
};

export default SecurityLog;
