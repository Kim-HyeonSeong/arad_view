import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Card, Button, message, Empty } from 'antd';
import { getConstructorStr, getWallPadStr } from '../../../commons/ConvertValStr';
import CompoundCard from './CompoundCard';
import type { CompoundItem } from './CompoundCard';
import * as CstDef from '../../../commons/CstDef';
import * as MonitoringCmd from '../../../bulk_cmd/convert/monitoring/ConvertMonitoringCmd';
import { applyCmd } from '../../../bulk_cmd/api/ApplyCmdList';
import DistrictUnauthLog from './log/DistrictUnauthLog';
import DistrictDeviceList from './device/DistrictDeviceList';
import { useLocations } from '../../../commons/LocationContext';

const { Title } = Typography;

interface Props {
  district: number;
}

// 백엔드 /api/v1/monitoring/{category}/{id}/summary 응답 row.
interface CountSummary {
  count: number;
  normal: number;
  error: number;
}
interface ControllerRow {
  controller_id: number;
  controller_name: string;
  ip: string;
  port: number;
  status: string;
  region_id: number;
  district_id: number;
  constructor_id?: number;
  homenet_id?: number;
  last_connect_at?: string;
  sgw: CountSummary;
  pgw: CountSummary;
}

const DistrictMonitoring: React.FC<Props> = ({ district }) => {
  const navigate = useNavigate();
  const { map: locationMap } = useLocations();
  const [compounds, setCompounds] = useState<CompoundItem[]>([]);
  // location 트리에서 district 의 노드명 조회.
  const districtName = locationMap.get(district)?.name ?? '---';

  const getDistrictData = async () => {
    const category = 'location';
    const cmd = MonitoringCmd.getMonitoringSummaryToBulkCmd(category, district);
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
      message.error(ret.msg || '구별 모니터링 데이터를 불러오는데 실패했습니다.');
      return;
    }

    // ControllerRow[] → CompoundItem[] 매핑. 구 단위 호출이라 응답 전 행이 모두 같은 district.
    const rows = (ret.data ?? []) as ControllerRow[];
    const mapped: CompoundItem[] = rows.map((row) => ({
      id: row.controller_id,
      name: row.controller_name,
      construction_company: row.constructor_id !== undefined ? getConstructorStr(row.constructor_id) : '',
      wall_pad_company: row.homenet_id !== undefined ? getWallPadStr(row.homenet_id) : '',
      sgw_total: row.sgw?.count ?? 0,
      sgw_normal: row.sgw?.normal ?? 0,
      sgw_error: row.sgw?.error ?? 0,
      pgw_total: row.pgw?.count ?? 0,
      pgw_normal: row.pgw?.normal ?? 0,
      pgw_error: row.pgw?.error ?? 0,
    }));
    setCompounds(mapped);
  };

  useEffect(() => {
    getDistrictData();
  }, [district]);

  const handleCompoundClick = (item: CompoundItem) => {
    navigate('/monitoring/detail', { state: { compound: item, district } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
      <Title level={5} style={{ margin: 0 }}>
        {districtName} 단지 · {compounds.length}개
      </Title>

      {compounds.length === 0 ? (
        <Empty description="등록된 단지가 없습니다" />
      ) : (
        <Row gutter={[16, 16]}>
          {compounds.map((c) => (
            <Col xs={24} md={12} lg={8} key={c.id}>
              <CompoundCard data={c} onClick={handleCompoundClick} />
            </Col>
          ))}
        </Row>
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title={`장비 목록 · ${districtName} 전체 (오류 우선)`}
            size="small"
            extra={<Button type="link" size="small">전체 보기 →</Button>}
            styles={{ body: { padding: 0 } }}
          >
            <DistrictDeviceList district={district} />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title="비인가 로그 · 최근 10건"
            size="small"
            extra={<Button type="link" size="small">전체 보기 →</Button>}
            styles={{ body: { padding: 0 } }}
          >
            <DistrictUnauthLog district={district} limit={10} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DistrictMonitoring;
