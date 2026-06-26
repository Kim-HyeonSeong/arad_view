import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as CstDef from './CstDef';
import { applyCmd } from '../bulk_cmd/api/ApplyCmdList';
import * as CvtLocationCmd from '../bulk_cmd/convert/location/ConvertLocationCmd';

// /api/v1/locations 응답 1건 — 광역/시군구 트리 노드.
export interface LocationNode {
  id: number;
  parent_id: number | null;   // null = 루트(대한민국)
  name: string;
  code: string;               // KR / REGION_* / DISTRICT_*
  lat: number;
  lng: number;
}

export interface RegionDistrictPair {
  region: string;             // 광역 이름 (없으면 '---')
  district: string;           // 시/군/구 이름 (광역 자체면 '---')
}

interface LocationContextValue {
  items: LocationNode[];
  map: Map<number, LocationNode>;
  loading: boolean;
  refetch: () => Promise<void>;
  // location_id → { region, district } 변환 헬퍼.
  getRegionDistrict: (locationId: number | null | undefined) => RegionDistrictPair;
}

const EMPTY_PAIR: RegionDistrictPair = { region: '---', district: '---' };

const LocationContext = createContext<LocationContextValue | null>(null);

// 모듈 레벨 캐시 — React 밖(예: cmd converter) 에서도 location 조회가 필요해서 sync 함수로 노출.
// LocationProvider 가 fetch 직후 이 캐시를 갱신함.
let _moduleLocationCache: Map<number, LocationNode> = new Map();

/**
 * location_id 를 "광역 시군구" 형태의 한국어 문자열로 변환.
 * 광역 자체면 "서울특별시", 시군구면 "서울특별시 강남구", 루트/미발견은 "---".
 *
 * React 컴포넌트 밖 (예: BulkCmd content 생성) 에서 호출 가능. 단, LocationProvider 가
 * 아직 데이터를 fetch 하지 않았으면 "---" 가 나올 수 있음 — 이는 상시 마운트되는 Provider 의
 * 첫 fetch 가 완료된 뒤엔 안정적.
 */
export function getLocationStr(locationId: number | null | undefined): string {
  if (locationId == null) return '---';
  const loc = _moduleLocationCache.get(locationId);
  if (!loc) return '---';
  if (loc.parent_id === null || loc.parent_id === 1) return loc.name;
  const parent = _moduleLocationCache.get(loc.parent_id);
  return parent ? `${parent.name} ${loc.name}` : loc.name;
}

interface LocationProviderProps {
  children: ReactNode;
}

// sessionStorage 캐시 — 같은 탭 내에서 새로고침/페이지 이동 시 즉시 사용.
// 로그아웃 시 자동 비워짐 (sessionStorage 가 탭 단위 lifecycle).
const CACHE_KEY = 'aradview_locations_cache';

function readCache(): LocationNode[] {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocationNode[]) : [];
  } catch {
    return [];
  }
}

function writeCache(items: LocationNode[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(items));
  } catch {
    // quota 초과 / private mode 등 — 캐시 미저장은 무해.
  }
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  // 초기 items 는 sessionStorage 캐시에서 즉시 복원. 캐시 있으면 1차 렌더부터 데이터 사용 가능.
  const [items, setItems] = useState<LocationNode[]>(() => readCache());
  // 캐시 있으면 loading=false 로 시작 (즉시 콘텐츠 표시 + 백그라운드 refetch).
  // 캐시 없으면 loading=true (Spinner 노출).
  const [loading, setLoading] = useState(() => readCache().length === 0);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const cmd = CvtLocationCmd.getLocationShowAllToBulkCmd();
      const ret = await applyCmd(cmd);
      if (ret.result !== CstDef.BULK_PROC_SUCCESS) return;
      const payload = ret.data as { items?: LocationNode[] } | null;
      const newItems = payload?.items ?? [];
      setItems(newItems);
      writeCache(newItems);   // 새 결과를 캐시에 박제.
    } finally {
      setLoading(false);
    }
  }, []);

  // 마운트 시 1회 fetch. 인증 실패면 캐시 (있다면) 가 유지되고, 없으면 빈 상태.
  // 로그인 성공 시 useLocations().refetch() 를 명시 호출하면 즉시 갱신.
  useEffect(() => {
    refetch();
  }, [refetch]);

  // id 빠른 조회용 Map 캐시.
  const map = useMemo(() => {
    const m = new Map<number, LocationNode>();
    items.forEach((it) => m.set(it.id, it));
    return m;
  }, [items]);

  // 모듈 레벨 캐시도 같이 갱신 — React 밖에서 getLocationStr 가 즉시 사용 가능.
  useEffect(() => {
    _moduleLocationCache = map;
  }, [map]);

  const getRegionDistrict = useCallback(
    (locationId: number | null | undefined): RegionDistrictPair => {
      if (locationId == null) return EMPTY_PAIR;
      const loc = map.get(locationId);
      if (!loc) return EMPTY_PAIR;

      // 광역 — 루트(대한민국, id=1) 의 직계 자식.
      if (loc.parent_id === 1) {
        return { region: loc.name, district: '---' };
      }
      // 루트 자체 — 보통 컨트롤러가 가리키지 않음.
      if (loc.parent_id === null) {
        return { region: loc.name, district: '---' };
      }
      // 시군구 — parent 가 광역.
      const parent = map.get(loc.parent_id);
      return {
        region: parent?.name ?? '---',
        district: loc.name,
      };
    },
    [map],
  );

  const value: LocationContextValue = {
    items,
    map,
    loading,
    refetch,
    getRegionDistrict,
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

// 어디서든 호출. Provider 밖에서 호출 시 명확한 에러로 안내.
export function useLocations(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocations 는 <LocationProvider> 안에서만 사용 가능합니다.');
  }
  return ctx;
}
