import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import koreaGeo from '../../../assets/korea-geo.json';
import type { LocationSummary } from '../Dashboard';

type RegionStatus = 'normal' | 'warning' | 'error' | 'empty';

const statusColor: Record<RegionStatus, string> = {
  normal: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  empty: '#6B7280',   // 진한 회색 — 컨트롤러 없음
};

// location 카운트 기반 status 산출.
// total === 0 → 'empty' (컨트롤러 없음), error > 0 → 'error', 그 외 → 'normal'.
const deriveStatus = (r: LocationSummary): RegionStatus =>
  r.total_count === 0 ? 'empty'
  : r.error_count > 0 ? 'error'
  : 'normal';

interface KoreaMapProps {
  locations: LocationSummary[];   // Dashboard 에서 fetch 한 location_summary 결과
}

const KoreaMap: React.FC<KoreaMapProps> = ({ locations }) => {
  const navigate = useNavigate();

  // 마운트 시 echarts map 등록.
  useEffect(() => {
    echarts.registerMap('korea', koreaGeo as never);
  }, []);

  const option = {
    geo: {
      map: 'korea',
      roam: false,
      zoom: 1.2,
      itemStyle: {
        areaColor: '#f3f4f6',
        borderColor: '#d1d5db',
      },
      emphasis: {
        itemStyle: { areaColor: '#e5e7eb' },
        label: { show: false },
      },
      label: { show: false },
    },
    series: [
      {
        // 지역명 라벨이 들어있는 짙은 원
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'circle',
        symbolSize: 40,
        label: {
          show: true,
          formatter: (params: { name: string }) => params.name,
          color: '#fff',
          fontSize: 11,
          fontWeight: 'bold',
        },
        itemStyle: { color: '#1f2937' },
        data: locations.map((r) => ({
          name: r.name.replace(/(특별시|광역시|특별자치시|특별자치도|남도|북도|도)$/, ''),
          value: [...r.coord, r.location_id],
        })),
      },
      {
        // 상태 색깔 점 — error_count 기반
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: (params: { dataIndex: number }) => statusColor[deriveStatus(locations[params.dataIndex])],
        },
        data: locations.map((r) => ({
          name: r.name,
          value: [r.coord[0] + 0.2, r.coord[1] + 0.2],
        })),
        z: 10,
      },
    ],
    title: {
      text: '지역별 관제 현황',
      left: 'center',
      bottom: 0,
      textStyle: { fontSize: 13, color: '#999', fontWeight: 'normal' },
    },
  };

  const onEvents = {
    click: (params: { seriesIndex: number; dataIndex: number }) => {
      if (params.seriesIndex === 0) {
        const location = locations[params.dataIndex];
        navigate('/monitoring/region', { state: { region: location.location_id } });
      }
    },
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '100%', minHeight: 500, cursor: 'pointer' }}
      onEvents={onEvents}
      notMerge   // locations state 변경 시 series.data 가 깔끔하게 교체되도록
    />
  );
};

export default KoreaMap;
