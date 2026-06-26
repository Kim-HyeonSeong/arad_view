import { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Progress, Popover } from 'antd';
import ReactECharts from 'echarts-for-react';
import KoreaMap from './map/KoreaMap';
import DeviceStatus from './devices/DeviceStatus';
import SecurityLog from './logs/SecurityLog';
import { applyCmd } from '../../bulk_cmd/api/ApplyCmdList';
import * as CvtSyssetCmd from '../../bulk_cmd/convert/sysset/ConvertSyssetCmd';
import * as DashboardCmd from '../../bulk_cmd/convert/dashboard/ConvertDashboardCmd';
import * as CstDef from '../../commons/CstDef';

const { Title, Text } = Typography;

// 바이트를 사람이 읽기 좋은 단위로 변환 (예: 7788920832 → "7.79 GB")
const formatBytes = (bytes: number): string => {
  if (bytes >= 1e12) return (bytes / 1e12).toFixed(2) + ' TB';
  if (bytes >= 1e9)  return (bytes / 1e9 ).toFixed(2) + ' GB';
  if (bytes >= 1e6)  return (bytes / 1e6 ).toFixed(2) + ' MB';
  if (bytes >= 1e3)  return (bytes / 1e3 ).toFixed(2) + ' KB';
  return bytes + ' B';
};

// 상세 카드에서 쓰는 막대 그래프. used/total bytes 또는 단순 percent 만 표시 가능.
interface DetailBarProps {
  label: string;
  subLabel?: string;          // 막대 위 작은 글씨 (예: "7.79 GB" 또는 "Mount: /")
  percent: number;
  color: string;
  leftValue?: string;         // 막대 아래 좌측 (예: "사용 2.51 GB")
  rightValue?: string;        // 막대 아래 우측 (예: "전체 7.79 GB")
}

const DetailBar: React.FC<DetailBarProps> = ({ label, subLabel, percent, color, leftValue, rightValue }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <Text strong style={{ fontSize: 14 }}>{label}</Text>
      {subLabel && (
        <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{subLabel}</Text>
      )}
    </div>
    <Progress percent={percent} showInfo={false} strokeColor={color} />
    {(leftValue || rightValue) && (
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#666', marginTop: 2 }}>
        <span>{leftValue ?? ''}</span>
        <span>{rightValue ?? ''}</span>
      </div>
    )}
  </div>
);

interface ServerStatus {
  cpu: number;
  memory: number;
  disk: number;
  controller: number;
}

// 백엔드 /api/v1/dashboard/location_summary 응답 1건 스키마.
// 응답에 광역(REGION_*) 과 시군구(DISTRICT_*) + 루트(KR) 가 모두 섞여 옴 — 화면별로 filter 필요.
export interface LocationSummary {
  location_id: number;
  parent_id: number | null;       // null = 루트 (대한민국), 1 = 광역, 광역id = 시군구
  code: string;
  name: string;
  coord: [number, number];
  normal_count: number;
  error_count: number;
  total_count: number;
}

// 전체 컨트롤러 집계값 — DeviceStatus 의 "컨트롤러" 카드에 표시.
export interface ControllerSummary {
  total: number;
  normal: number;
  error: number;
}

// 백엔드 /api/v1/dashboard/server_status 응답 (CPU / Memory / Disk 사용률 각 객체로 분리)
interface ServerStatusResponse {
  cpu: { usagePercent: number; cores: number; loadAvg1: number; loadAvg5: number; loadAvg15: number };
  memory: { usagePercent: number; totalBytes: number; usedBytes: number; availableBytes: number };
  disk: { usagePercent: number; totalBytes: number; usedBytes: number; mountPoint: string };
}


const getDonutOption = (value: number, color: string) => ({
  series: [
    {
      type: 'pie',
      radius: ['65%', '85%'],
      avoidLabelOverlap: false,
      label: {
        show: true,
        position: 'center',
        formatter: `${value}%`,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
      },
      emphasis: {
        scale: false,
      },
      data: [
        { value, itemStyle: { color } },
        { value: 100 - value, itemStyle: { color: '#e8e8e8' } },
      ],
    },
  ],
});

const statusItems = [
  { key: 'cpu', title: 'CPU 사용률', color: '#4169E1', label: 'CPU' },
  { key: 'memory', title: '메모리 사용률', color: '#8B5CF6', label: '메모리' },
  { key: 'disk', title: 'Disk 사용률', color: '#10B981', label: 'Disk' },
  { key: 'controller', title: '전체 컨트롤러 사용률', color: '#F59E0B', label: '컨트롤러' },
];

// 기본 새로고침 주기 (ms). backend setting fetch 실패 시 fallback.
const DEFAULT_REFRESH_MS = 15000;

const Dashboard: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    cpu: 0,
    memory: 0,
    disk: 0,
    controller: 0,
  });
  // 도넛에 쓰지 않는 상세값 (cores, loadAvg, bytes 등) 보관용
  const [serverDetail, setServerDetail] = useState<ServerStatusResponse | null>(null);
  // 클릭으로 선택된 상세 카드. null 이면 닫힘.
  const [detailKey, setDetailKey] = useState<'cpu' | 'memory' | 'disk' | 'controller' | null>(null);
  // backend ui.data_refresh_interval_seconds 와 동기화. 자식 컴포넌트에 prop 으로 전달.
  const [refreshIntervalMs, setRefreshIntervalMs] = useState<number>(DEFAULT_REFRESH_MS);
  // /api/v1/dashboard/location_summary 응답 — KoreaMap 과 DeviceStatus 가 공유.
  const [locations, setLocations] = useState<LocationSummary[]>([]);

  const getRefreshInterval = async () => {
    const cmd = CvtSyssetCmd.getSyssetOneInfoToBulkCmd('ui.data_refresh_interval_seconds');
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS || !ret.data) return;

    // backend 단건 응답은 row 객체 { value: "15", default_value: ..., ... }
    const seconds = parseInt((ret.data as { value?: string }).value ?? '', 10);
    if (!isNaN(seconds) && seconds > 0) {
      setRefreshIntervalMs(seconds * 1000);
    }
  };

  const checkControllerStatus = async () => {
    const cmd = DashboardCmd.getDashboardServerStatusToBulkCmd();
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS || !ret.data) return;

    // 응답 객체에서 usagePercent 만 추려 평탄화. 소수점 1자리로 반올림 (도넛 가독성).
    const data = ret.data as ServerStatusResponse;
    setServerStatus((prev) => ({
      ...prev,
      cpu:    Math.round((data.cpu?.usagePercent    ?? 0) * 10) / 10,
      memory: Math.round((data.memory?.usagePercent ?? 0) * 10) / 10,
      disk:   Math.round((data.disk?.usagePercent   ?? 0) * 10) / 10,
      // controller 는 별도 API (device brief) 에서 산출하므로 prev 유지
    }));
    setServerDetail(data);   // 상세 카드용 원본 데이터 보관
  };

  const getLocationSummary = async () => {
    const cmd = DashboardCmd.getDashboardLocationSummaryToBulkCmd();
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS || !ret.data) return;
    setLocations(ret.data as LocationSummary[]);
  };

  // 전체 컨트롤러 집계 — DeviceStatus "컨트롤러" 카드에 prop 으로 전달.
  // BE 가 계층 rollup 으로 카운트를 내려주므로 루트(대한민국) 노드 값이 곧 전국 합계.
  // 광역/시군구 까지 더하면 동일 컨트롤러가 중복 카운트됨.
  const root = locations.find((l) => l.parent_id === null);
  const controllerSummary: ControllerSummary = {
    total:  root?.total_count  ?? 0,
    normal: root?.normal_count ?? 0,
    error:  root?.error_count  ?? 0,
  };

  // 마운트 시 1회 호출 — 새로고침 주기와 초기 상태 둘 다 즉시 가져옴.
  useEffect(() => {
    getRefreshInterval();
    checkControllerStatus();
    getLocationSummary();
  }, []);

  // 주기적 refresh — refreshIntervalMs 가 바뀌면 setInterval 재설정.
  useEffect(() => {
    if (refreshIntervalMs <= 0) return;
    const id = setInterval(() => {
      checkControllerStatus();
      getLocationSummary();
    }, refreshIntervalMs);
    return () => clearInterval(id);
  }, [refreshIntervalMs]);

  return (
    <div>
      <Title level={4} style={{ margin: '0 0 16px 0' }}>
        통합관제 서버 상태
      </Title>
      <Row gutter={[16, 16]}>
        {statusItems.map((item) => {
          const clickable =
            item.key === 'cpu' || item.key === 'memory' || item.key === 'disk' || item.key === 'controller';
          const isSelected = detailKey === item.key;
          // 컨트롤러 카드는 controllerSummary 기반 퍼센트(정상/전체) 를 표시. 그 외는 serverStatus.
          const controllerPercent =
            controllerSummary.total > 0
              ? Math.round((controllerSummary.normal / controllerSummary.total) * 1000) / 10
              : 0;
          const donutValue =
            item.key === 'controller' ? controllerPercent : serverStatus[item.key as keyof ServerStatus];
          const cardEl = (
            <Card
              hoverable={clickable}
              style={{
                cursor: clickable ? 'pointer' : 'default',
                borderColor: isSelected ? item.color : undefined,
                borderWidth: isSelected ? 2 : undefined,
              }}
            >
              <div style={{ textAlign: 'center', color: '#999', fontSize: 13, marginBottom: 8 }}>
                {item.title}
              </div>
              <ReactECharts
                option={getDonutOption(donutValue, item.color)}
                style={{ height: 120 }}
              />
              <div style={{ textAlign: 'center', color: '#666', fontSize: 14, marginTop: 8 }}>
                {item.label}
              </div>
            </Card>
          );

          if (!clickable) {
            return (
              <Col xs={24} sm={12} lg={6} key={item.key}>
                {cardEl}
              </Col>
            );
          }

          // CPU / Memory / Disk / Controller: Popover 로 감싸 클릭 시 카드 아래에 상세 패널 펼침.
          return (
            <Col xs={24} sm={12} lg={6} key={item.key}>
              <Popover
                open={isSelected}
                onOpenChange={(open) =>
                  setDetailKey(open ? (item.key as 'cpu' | 'memory' | 'disk' | 'controller') : null)
                }
                trigger="click"
                placement="bottom"
                title={
                  item.key === 'cpu'        ? 'CPU 상세' :
                  item.key === 'memory'     ? '메모리 상세' :
                  item.key === 'disk'       ? '디스크 상세' :
                                              '컨트롤러 상세'
                }
                content={
                  <div style={{ width: 380 }}>
                    {item.key === 'cpu' && serverDetail && (
                      <>
                        <DetailBar
                          label="CPU 사용률"
                          subLabel={`${serverDetail.cpu.usagePercent.toFixed(2)}%`}
                          percent={serverDetail.cpu.usagePercent}
                          color="#4169E1"
                          leftValue={`Cores: ${serverDetail.cpu.cores}`}
                          rightValue={`${serverDetail.cpu.usagePercent.toFixed(2)}%`}
                        />
                        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12, color: '#555', flexWrap: 'wrap' }}>
                          <span>Load Avg (1분): <b>{serverDetail.cpu.loadAvg1.toFixed(2)}</b></span>
                          <span>Load Avg (5분): <b>{serverDetail.cpu.loadAvg5.toFixed(2)}</b></span>
                          <span>Load Avg (15분): <b>{serverDetail.cpu.loadAvg15.toFixed(2)}</b></span>
                        </div>
                      </>
                    )}
                    {item.key === 'memory' && serverDetail && (
                      <DetailBar
                        label="메모리 사용량"
                        subLabel={formatBytes(serverDetail.memory.usedBytes)}
                        percent={serverDetail.memory.usagePercent}
                        color="#8B5CF6"
                        leftValue={`사용 ${formatBytes(serverDetail.memory.usedBytes)} / 가용 ${formatBytes(serverDetail.memory.availableBytes)}`}
                        rightValue={`전체 ${formatBytes(serverDetail.memory.totalBytes)}`}
                      />
                    )}
                    {item.key === 'disk' && serverDetail && (
                      <DetailBar
                        label="디스크 사용량"
                        subLabel={formatBytes(serverDetail.disk.usedBytes)}
                        percent={serverDetail.disk.usagePercent}
                        color="#10B981"
                        leftValue={`사용 ${formatBytes(serverDetail.disk.usedBytes)} / Mount: ${serverDetail.disk.mountPoint}`}
                        rightValue={`전체 ${formatBytes(serverDetail.disk.totalBytes)}`}
                      />
                    )}
                    {item.key === 'controller' && (
                      <DetailBar
                        label="컨트롤러 정상 비율"
                        subLabel={`${controllerPercent.toFixed(1)}%`}
                        percent={controllerPercent}
                        color="#F59E0B"
                        leftValue={`정상 ${controllerSummary.normal} · 오류 ${controllerSummary.error}`}
                        rightValue={`전체 ${controllerSummary.total}`}
                      />
                    )}
                  </div>
                }
              >
                {cardEl}
              </Popover>
            </Col>
          );
        })}
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }} align="stretch">
        <Col xs={24} lg={16} style={{ display: 'flex', flexDirection: 'column' }}>
          <Title level={4} style={{ margin: '0 0 16px 0' }}>지도로 보기</Title>
          <Card style={{ flex: 1 }}>
            <KoreaMap locations={locations.filter((l) => l.parent_id === 1)} />
          </Card>
        </Col>
        <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column' }}>
          <Title level={4} style={{ margin: '0 0 16px 0' }}>장치 상태 현황</Title>
          <DeviceStatus refreshIntervalMs={refreshIntervalMs} controllerSummary={controllerSummary} />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }} align="stretch">
        <Col xs={24} lg={24} style={{ display: 'flex', flexDirection: 'column' }}>
          <Title level={4} style={{ margin: '0 0 16px 0' }}>비인가 로그</Title>
          <Card style={{ flex: 1 }} styles={{ body: { paddingBottom: 8 } }}>
            <SecurityLog refreshIntervalMs={refreshIntervalMs} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
