import { useState, useEffect, useRef } from 'react';
import { Card, Typography, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import { DatabaseOutlined, DesktopOutlined } from '@ant-design/icons';
import * as CvtDashboardCmd from '../../../bulk_cmd/convert/dashboard/ConvertDashboardCmd';
import { applyCmd } from '../../../bulk_cmd/api/ApplyCmdList';
import * as CstDef from '../../../commons/CstDef';
import type { ControllerSummary } from '../Dashboard';

const { Text } = Typography;

interface DeviceGroup {
  name: string;
  total: number;
  description: string;
  normal: number;
  error: number;
  icon: React.ReactNode;
}

interface contStatusInfo {
  on_count: number;
  off_count: number;
}

// 백엔드 device_status 응답 row — 컨트롤러 1대당 SGW/PGW 카운트.
interface DeviceStatusRow {
  controller_id: number;
  sgw_normal_count: number;
  sgw_error_count: number;
  pgw_normal_count: number;
  pgw_error_count: number;
}


const getMiniDonutOption = (normal: number, warning: number, error: number) => ({
  series: [
    {
      type: 'pie',
      radius: ['60%', '85%'],
      silent: true,
      label: { show: false },
      data: [
        { value: normal, itemStyle: { color: '#10B981' } },
        //{ value: warning, itemStyle: { color: '#F59E0B' } },
        { value: error, itemStyle: { color: '#EF4444' } },
      ],
    },
  ],
});

const StatusDot: React.FC<{ color: string; label: string; count: number }> = ({ color, label, count }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
    <Text style={{ fontSize: 13 }}>{label}: {count}</Text>
  </div>
);

interface DeviceStatusProps {
  refreshIntervalMs?: number;            // 부모(Dashboard)가 backend ui.data_refresh_interval_seconds 로 결정
  controllerSummary?: ControllerSummary; // Dashboard 가 region_summary 를 집계해 전달
}

const DeviceStatus: React.FC<DeviceStatusProps> = ({ refreshIntervalMs = 0, controllerSummary }) => {
  const [sgwData, setSgwData] = useState<DeviceGroup>({
    name: 'SGW', total: 0, description: 'SGW 장치 수', normal: 0, error: 0,
    icon: null,
  });

  const [pgwData, setPgwData] = useState<DeviceGroup>({
    name: 'PGW', total: 0, description: 'PGW 장치 수', normal: 0, error: 0,
    icon: null,
  });

  const getSgwIconColor = () => {
    if (sgwData.total === 0) return '#d9d9d9';
    if (sgwData.error > 0) return '#D50000';
    return '#03C75A';
  };

  const getPgwIconColor = () => {
    if (pgwData.total === 0) return '#d9d9d9';
    if (pgwData.error > 0) return '#D50000';
    return '#03C75A';
  };

  const getDeviceStatus = async () => {
    const cmd = CvtDashboardCmd.getDashboardDeviceStatusToBulkCmd();
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
      message.error(ret.msg || '조회에 실패했습니다.');
      return;
    }

    // 응답은 컨트롤러별 row 배열. 전체 SGW/PGW 카운트는 모든 row 합산.
    const rows = (ret.data ?? []) as DeviceStatusRow[];
    const agg = rows.reduce(
      (acc, r) => ({
        sgwNormal: acc.sgwNormal + (r.sgw_normal_count ?? 0),
        sgwError:  acc.sgwError  + (r.sgw_error_count  ?? 0),
        pgwNormal: acc.pgwNormal + (r.pgw_normal_count ?? 0),
        pgwError:  acc.pgwError  + (r.pgw_error_count  ?? 0),
      }),
      { sgwNormal: 0, sgwError: 0, pgwNormal: 0, pgwError: 0 },
    );

    setSgwData((prev) => ({
      ...prev,
      total: agg.sgwNormal + agg.sgwError,
      normal: agg.sgwNormal,
      error: agg.sgwError,
    }));
    setPgwData((prev) => ({
      ...prev,
      total: agg.pgwNormal + agg.pgwError,
      normal: agg.pgwNormal,
      error: agg.pgwError,
    }));
  };

  // 최신 fetch 함수 참조 유지 — setInterval closure 가 stale 한 함수를 잡지 않도록.
  const refreshRef = useRef(async () => {
    await getDeviceStatus();
  });

  refreshRef.current = async () => {
    await getDeviceStatus();
  };

  // 마운트 시 1회 fetch
  useEffect(() => {
    refreshRef.current();
  }, []);

  // 주기적 refresh — refreshIntervalMs 가 바뀌면 interval 재설정.
  useEffect(() => {
    if (refreshIntervalMs <= 0) return;
    const id = setInterval(() => { refreshRef.current(); }, refreshIntervalMs);
    return () => clearInterval(id);
  }, [refreshIntervalMs]);

  // "컨트롤러" 카드는 Dashboard 가 전달한 region_summary 집계값을 사용.
  // prop 이 없으면 0 으로 표시.
  const ctrlTotal = controllerSummary?.total ?? 0;
  const ctrlNormal = controllerSummary?.normal ?? 0;
  const ctrlError = controllerSummary?.error ?? 0;

  const deviceGroups: DeviceGroup[] = [
    {
      name: '컨트롤러',
      total: ctrlTotal,
      description: '등록된 전체 컨트롤러 수',
      normal: ctrlNormal,
      error: ctrlError,
      icon: null,
    },
    {
      ...sgwData,
      icon: <DatabaseOutlined style={{ fontSize: 48, color: getSgwIconColor() }} />,
    },
    {
      ...pgwData,
      icon: <DesktopOutlined style={{ fontSize: 48, color: getPgwIconColor() }} />,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
      {deviceGroups.map((group) => (
        <Card key={group.name} size="small">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>{group.name}</Text>
              </div>
              <div style={{ fontSize: 28, fontWeight: 'bold', margin: '4px 0' }}>{group.total}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>{group.description}</Text>
              <div style={{ marginTop: 8 }}>
                <StatusDot color="#10B981" label="정상" count={group.normal} />
                <StatusDot color="#EF4444" label="오류" count={group.error} />
              </div>
            </div>
            <div style={{ width: 80, height: 80 }}>
              {group.icon ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  {group.icon}
                </div>
              ) : (
                <ReactECharts
                  option={getMiniDonutOption(group.normal, 0, group.error)}
                  style={{ height: 80, width: 80 }}
                />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default DeviceStatus;
