import { useState, useEffect } from 'react';
import { Card, Typography, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as CstDef from '../../../../commons/CstDef';
import * as MonitoringCmd from '../../../../bulk_cmd/convert/monitoring/ConvertMonitoringCmd';
import { DatabaseOutlined, DesktopOutlined } from '@ant-design/icons';
import { getRegionStr } from '../../../../commons/ConvertValStr';
import { applyCmd } from '../../../../bulk_cmd/api/ApplyCmdList';


const { Text } = Typography;

interface DeviceGroup {
  name: string;
  total: number;
  description: string;
  normal: number;
  error: number;
  icon: React.ReactNode;
}

// 백엔드 /api/v1/monitoring/{category}/{id} 응답 (CountSummary 3종 통합)
interface CountSummary {
  count: number;
  normal: number;
  error: number;
}
interface CategorySummaryResponse {
  id: number;
  name: string;
  controller: CountSummary;
  sgw: CountSummary;
  pgw: CountSummary;
}

interface RegionDeviceStatusProps {
  region: number;
}

const getMiniDonutOption = (normal: number, error: number) => ({
  series: [
    {
      type: 'pie',
      radius: ['60%', '85%'],
      silent: true,
      label: { show: false },
      data: [
        { value: normal, itemStyle: { color: '#10B981' } },
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

const RegionDeviceStatus: React.FC<RegionDeviceStatusProps> = ({ region }) => {
  const [controllerData, setControllerData] = useState<DeviceGroup>({
    name: '컨트롤러', total: 0, description: '컨트롤러 수', normal: 0, error: 0,
    icon: null,
  });
  const [sgwData, setSgwData] = useState<DeviceGroup>({
    name: 'SGW', total: 0, description: 'SGW 장치 수', normal: 0, error: 0,
    icon: null,
  });
  const [pgwData, setPgwData] = useState<DeviceGroup>({
    name: 'PGW', total: 0, description: 'PGW 장치 수', normal: 0, error: 0,
    icon: null,
  });


  const getRegionDeviceStatus = async () => {
    const category = 'location';
    const cmd = MonitoringCmd.getMonitoringStatusToBulkCmd(category, region);
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
      message.error(ret.msg || '지역별 모니터링 데이터를 불러오는데 실패했습니다.');
      return;
    }

    // 백엔드 응답: { id, name, controller, sgw, pgw } — 각각 { count, normal, error }
    const data = ret.data as CategorySummaryResponse | null;
    if (!data) return;

    setControllerData((prev) => ({
      ...prev,
      total: data.controller?.count ?? 0,
      normal: data.controller?.normal ?? 0,
      error: data.controller?.error ?? 0,
    }));
    setSgwData((prev) => ({
      ...prev,
      total: data.sgw?.count ?? 0,
      normal: data.sgw?.normal ?? 0,
      error: data.sgw?.error ?? 0,
    }));
    setPgwData((prev) => ({
      ...prev,
      total: data.pgw?.count ?? 0,
      normal: data.pgw?.normal ?? 0,
      error: data.pgw?.error ?? 0,
    }));
  };

  useEffect(() => {
    getRegionDeviceStatus();
  }, [region]);

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

  const deviceGroups: DeviceGroup[] = [
    {
      ...controllerData,
      name: `${getRegionStr(region)} 전체`,
      description: `${getRegionStr(region)}의 컨트롤러 수`,
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
              <Text strong>{group.name}</Text>
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
                  option={getMiniDonutOption(group.normal, group.error)}
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

export default RegionDeviceStatus;
