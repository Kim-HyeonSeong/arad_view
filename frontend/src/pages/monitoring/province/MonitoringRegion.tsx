import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Select, Card, Row, Col, Spin, message } from 'antd';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import * as CstDef from '../../../commons/CstDef';
import * as RegionList from '../../../commons/RegionList';
import * as RegionDef from '../../../commons/RegionDef';
import { getRegionStr } from '../../../commons/ConvertValStr';
import * as MonitoringCmd from '../../../bulk_cmd/convert/monitoring/ConvertMonitoringCmd';
import { applyCmd } from '../../../bulk_cmd/api/ApplyCmdList';
import koreaGeo from '../../../assets/korea-geo.json';
import koreaMunicipalities from '../../../assets/korea-municipalities.json';
import RegionDeviceStatus from './status/RegionDeviceStatus';
import DistrictStatusGrid, { type DistrictStatus } from './status/DistrictStatusGrid';
import DistrictMonitoring from '../district/DistrictMonitoring';
import { useLocations } from '../../../commons/LocationContext';

// summary API row (location 기준).
interface CountSummary { count: number; normal: number; error: number }
interface ControllerRow {
  controller_id: number;
  controller_name: string;
  ip: string;
  port: number;
  status: string;
  location_id: number;
  constructor_id?: number;
  homenet_id?: number;
  last_connect_at?: string;
  sgw: CountSummary;
  pgw: CountSummary;
}

const { Title } = Typography;

// GeoJSON은 옛 행정구역명을 사용하므로 새 이름 → 옛 이름 보정
const geoNameFallback: Record<string, string> = {
  '강원특별자치도': '강원도',
  '전북특별자치도': '전라북도',
};

// RegionDef value → 시군구 GeoJSON의 code prefix(앞 2자리) 매핑
const regionCodeMap: Record<number, string> = {
  [RegionDef.REGION_SEOUL]: '11',
  [RegionDef.REGION_BUSAN]: '21',
  [RegionDef.REGION_DAEGU]: '22',
  [RegionDef.REGION_INCHEON]: '23',
  [RegionDef.REGION_GWANGJU]: '24',
  [RegionDef.REGION_DAEJEON]: '25',
  [RegionDef.REGION_ULSAN]: '26',
  [RegionDef.REGION_SEJONG]: '29',
  [RegionDef.REGION_GYEONGGI]: '31',
  [RegionDef.REGION_GANGWON]: '32',
  [RegionDef.REGION_CHUNGCHEONGBUK]: '33',
  [RegionDef.REGION_CHUNGCHEONGNAM]: '34',
  [RegionDef.REGION_JEONBUK]: '35',
  [RegionDef.REGION_JEONNAM]: '36',
  [RegionDef.REGION_GYEONGSANGBUK]: '37',
  [RegionDef.REGION_GYEONGSANGNAM]: '38',
  [RegionDef.REGION_JEJU]: '39',
};

const MonitoringRegion: React.FC = () => {
  const location = useLocation();
  const initialRegion = (location.state as { region?: number } | null)?.region ?? RegionDef.REGION_SEOUL;
  const DISTRICT_ALL = 0;
  const [region, setRegion] = useState<number>(initialRegion);
  const [district, setDistrict] = useState<number>(DISTRICT_ALL);
  const chartRef = useRef<ReactECharts>(null);

  const { items: locationItems, loading: locationsLoading, refetch: refetchLocations } = useLocations();
  // 컨트롤러가 등록된 시/군/구별 카운트 — summary API 응답을 location_id 단위로 집계.
  const [districtCounts, setDistrictCounts] = useState<Map<number, { total: number; normal: number; error: number }>>(new Map());

  // 광역에 속한 모든 시/군/구 노드 (BE locations 트리 기준).
  const childDistricts = useMemo(
    () => locationItems.filter((l) => l.parent_id === region),
    [locationItems, region],
  );

  // 등록된 시/군/구만 추려 DistrictStatusGrid 로 전달.
  const registeredDistricts: DistrictStatus[] = useMemo(
    () => childDistricts
      .map((it) => {
        const c = districtCounts.get(it.id);
        if (!c || c.total === 0) return null;
        return { value: it.id, label: it.name, total: c.total, normal: c.normal, error: c.error };
      })
      .filter((d): d is DistrictStatus => d !== null),
    [childDistricts, districtCounts],
  );

  // 지도에서 클릭 가능한 시/군/구 이름 Set — 등록된 곳만 통과.
  const clickableNames = useMemo(
    () => new Set(registeredDistricts.map((d) => d.label)),
    [registeredDistricts],
  );

  // summary API 호출 — region 바뀔 때마다.
  useEffect(() => {
    const fetchSummary = async () => {
      const cmd = MonitoringCmd.getMonitoringSummaryToBulkCmd('location', region);
      const ret = await applyCmd(cmd);
      if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
        message.error(ret.msg || '지역별 모니터링 데이터를 불러오는데 실패했습니다.');
        return;
      }
      const rows = (ret.data ?? []) as ControllerRow[];
      const counts = new Map<number, { total: number; normal: number; error: number }>();
      for (const row of rows) {
        const c = counts.get(row.location_id) ?? { total: 0, normal: 0, error: 0 };
        c.total += 1;
        if (row.status === 'online') c.normal += 1;
        else c.error += 1;
        counts.set(row.location_id, c);
      }
      setDistrictCounts(counts);
    };
    fetchSummary();
  }, [region]);

  // 광역 select 옵션 — 루트의 자식들 (parent_id === 1).
  const regionOptions = useMemo(
    () => locationItems.filter((l) => l.parent_id === 1).map((l) => ({ label: l.name, value: l.id })),
    [locationItems],
  );

  // 시군구 select 옵션 — 선택된 광역의 자식들. value = location_id 통일.
  const districtOptions = useMemo(
    () => [
      { label: '전체', value: DISTRICT_ALL },
      ...childDistricts.map((d) => ({ label: d.name, value: d.id })),
    ],
    [childDistricts],
  );

  const handleRegionChange = (value: number) => {
    setRegion(value);
    setDistrict(DISTRICT_ALL);
  };


  // 광역 윤곽선 (fallback용, 코드가 매핑되지 않은 경우)
  const regionOutlineGeo = useMemo(() => {
    const label = getRegionStr(region);
    const name = geoNameFallback[label] || label;
    const feature = (koreaGeo as { features: { properties: { name: string } }[] }).features.find(
      (f) => f.properties.name === name,
    );
    return feature ? { type: 'FeatureCollection', features: [feature] } : null;
  }, [region]);

  // 선택된 광역의 시군구만 필터링
  const filteredGeo = useMemo(() => {
    const codePrefix = regionCodeMap[region];
    if (!codePrefix) return regionOutlineGeo;

    const features = (koreaMunicipalities as { features: { properties: { code: string; name: string } }[] }).features
      .filter((f) => f.properties.code.startsWith(codePrefix));

    return features.length > 0
      ? { type: 'FeatureCollection', features }
      : regionOutlineGeo;
  }, [region, regionOutlineGeo]);

  useEffect(() => {
    if (filteredGeo) {
      echarts.registerMap('selectedProvince', filteredGeo as never);
    }
  }, [filteredGeo]);

  const getCurrentZoom = (): number => {
    const instance = chartRef.current?.getEchartsInstance();
    if (!instance) return 1;
    const opt = instance.getOption() as { geo?: { zoom?: number }[] };
    return opt.geo?.[0]?.zoom ?? 1;
  };

  const setZoom = (zoom: number) => {
    const instance = chartRef.current?.getEchartsInstance();
    instance?.setOption({ geo: { zoom } });
  };

  // 지도의 각 시/군/구 별 styling — 등록 안 된 곳은 회색 + 호버/클릭 시 강조 없음.
  const geoRegionsStyle = useMemo(() => {
    if (!filteredGeo) return [] as Array<{ name: string; itemStyle?: object; emphasis?: object; select?: object; label?: object }>;
    const features = (filteredGeo as { features: { properties: { name: string } }[] }).features;
    return features.map((f) => {
      const name = f.properties.name;
      const registered = clickableNames.has(name);
      if (registered) return { name };   // 기본 스타일 사용
      return {
        name,
        itemStyle: { areaColor: '#f0f0f0', borderColor: '#bfbfbf' },
        emphasis: { itemStyle: { areaColor: '#f0f0f0' }, label: { color: '#999' } },
        select: { itemStyle: { areaColor: '#f0f0f0' } },
        label: { color: '#999' },
      };
    });
  }, [filteredGeo, clickableNames]);

  const option = useMemo(
    () => ({
      toolbox: {
        show: true,
        left: 10,
        top: 10,
        feature: {
          myReset: {
            show: true,
            title: '원래대로',
            icon: 'path://M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z',
            onclick: () => setZoom(1),
          },
          myZoomIn: {
            show: true,
            title: '확대',
            icon: 'path://M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z',
            onclick: () => setZoom(getCurrentZoom() * 1.3),
          },
          myZoomOut: {
            show: true,
            title: '축소',
            icon: 'path://M19,13H5V11H19V13Z',
            onclick: () => setZoom(getCurrentZoom() / 1.3),
          },
        },
      },
      geo: {
        map: 'selectedProvince',
        roam: true,
        itemStyle: {
          areaColor: '#e6f4ff',
          borderColor: '#1677ff',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: { areaColor: '#bae0ff' },
          label: { show: true, color: '#000', fontWeight: 'bold' },
        },
        select: {
          itemStyle: { areaColor: '#69b1ff' },
          label: { show: true },
        },
        label: {
          show: true,
          color: '#333',
          fontSize: 11,
        },
        // 등록 안 된 시/군/구는 개별 region 스타일로 회색 표시.
        regions: geoRegionsStyle,
      },
      series: [],
    }),
    [geoRegionsStyle],
  );

  const onEvents = {
    click: (params: { name: string }) => {
      // 등록 안 된 시/군/구는 클릭 무시.
      if (!clickableNames.has(params.name)) return;
      // 이름 → location_id 매핑은 등록된 시군구 (registeredDistricts) 에서 찾음.
      const matched = registeredDistricts.find((d) => d.label === params.name);
      if (matched) {
        setDistrict(matched.value);
      }
    },
  };

  // 1) fetch 진행 중 — 로딩 표시.
  if (locationsLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 400, gap: 12 }}>
        <Spin size="large" />
        <span style={{ color: '#999' }}>지역 정보를 불러오는 중...</span>
      </div>
    );
  }

  // 2) fetch 완료됐지만 데이터가 비어있음 — BE 오류 / 인증 만료 등.
  //    무한 로딩 빠지지 않게 에러 + 재시도 버튼으로 명확히 노출.
  if (locationItems.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 400, gap: 12 }}>
        <span style={{ color: '#999' }}>지역 정보를 불러오지 못했습니다.</span>
        <button onClick={() => refetchLocations()} style={{ padding: '4px 16px', cursor: 'pointer' }}>
          재시도
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>지역별 모니터링</Title>
        <Select
          placeholder="도를 선택하세요"
          value={region}
          onChange={handleRegionChange}
          style={{ width: 200, marginLeft: 16 }}
          options={regionOptions}
        />
        <Select
          placeholder="시군구를 선택하세요"
          value={district}
          onChange={setDistrict}
          style={{ width: 200, marginLeft: 16 }}
          options={districtOptions}
        />
      </div>

      {district === DISTRICT_ALL ? (
        <>
          <Row gutter={[16, 16]} style={{ flex: 1 }}>
            <Col xs={24} lg={16} style={{ display: 'flex', flexDirection: 'column' }}>
              <Card style={{ flex: 1 }} styles={{ body: { height: '100%', padding: 0 } }}>
                {filteredGeo && (
                  <ReactECharts
                    ref={chartRef}
                    key={region}
                    option={option}
                    onEvents={onEvents}
                    style={{ width: '100%', height: '100%', minHeight: 500 }}
                  />
                )}
              </Card>
            </Col>
            <Col xs={24} lg={8} style={{ display: 'flex', flexDirection: 'column' }}>
              <RegionDeviceStatus region={region} />
            </Col>
          </Row>

          <DistrictStatusGrid region={region} districts={registeredDistricts} onDistrictClick={setDistrict} />
        </>
      ) : (
        <DistrictMonitoring district={district} />
      )}
    </div>
  );
};

export default MonitoringRegion;
