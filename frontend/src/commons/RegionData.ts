import * as RegionDef from './RegionDef';

// 광역 / 시군구 메타 데이터 더미.
// 좌표는 [경도, 위도] = [lng, lat] (echarts 관례).
// TODO: 백엔드 /api/v1/region API 도입 시 이 더미 대체 또는 import 일괄 갱신.

export interface RegionEntry {
  code: number;
  name: string;
  coord: [number, number];
}

// ========================= 광역행정구역 (17개) =========================

export const PROVINCES: RegionEntry[] = [
  { code: RegionDef.REGION_SEOUL,           name: RegionDef.REGION_SEOUL_STR,           coord: [126.98, 37.57] },
  { code: RegionDef.REGION_GYEONGGI,        name: RegionDef.REGION_GYEONGGI_STR,        coord: [127.20, 37.41] },
  { code: RegionDef.REGION_INCHEON,         name: RegionDef.REGION_INCHEON_STR,         coord: [126.60, 37.46] },
  { code: RegionDef.REGION_CHUNGCHEONGBUK,  name: RegionDef.REGION_CHUNGCHEONGBUK_STR,  coord: [127.70, 36.80] },
  { code: RegionDef.REGION_CHUNGCHEONGNAM,  name: RegionDef.REGION_CHUNGCHEONGNAM_STR,  coord: [126.80, 36.50] },
  { code: RegionDef.REGION_GANGWON,         name: RegionDef.REGION_GANGWON_STR,         coord: [128.20, 37.87] },
  { code: RegionDef.REGION_BUSAN,           name: RegionDef.REGION_BUSAN_STR,           coord: [129.07, 35.18] },
  { code: RegionDef.REGION_DAEGU,           name: RegionDef.REGION_DAEGU_STR,           coord: [128.60, 35.87] },
  { code: RegionDef.REGION_GWANGJU,         name: RegionDef.REGION_GWANGJU_STR,         coord: [126.85, 35.16] },
  { code: RegionDef.REGION_DAEJEON,         name: RegionDef.REGION_DAEJEON_STR,         coord: [127.38, 36.35] },
  { code: RegionDef.REGION_ULSAN,           name: RegionDef.REGION_ULSAN_STR,           coord: [129.31, 35.54] },
  { code: RegionDef.REGION_SEJONG,          name: RegionDef.REGION_SEJONG_STR,          coord: [127.28, 36.60] },
  { code: RegionDef.REGION_JEJU,            name: RegionDef.REGION_JEJU_STR,            coord: [126.53, 33.38] },
  { code: RegionDef.REGION_GYEONGSANGBUK,   name: RegionDef.REGION_GYEONGSANGBUK_STR,   coord: [128.90, 36.30] },
  { code: RegionDef.REGION_GYEONGSANGNAM,   name: RegionDef.REGION_GYEONGSANGNAM_STR,   coord: [128.20, 35.40] },
  { code: RegionDef.REGION_JEONBUK,         name: RegionDef.REGION_JEONBUK_STR,         coord: [127.10, 35.70] },
  { code: RegionDef.REGION_JEONNAM,         name: RegionDef.REGION_JEONNAM_STR,         coord: [126.90, 34.80] },
];

// ========================= 시군구 — 광역 그룹별 =========================
// coord 는 [0, 0] 더미. 실제 시군구 좌표는 추후 채워 넣을 것 (TODO).

export const DISTRICTS_BY_PROVINCE: Record<number, RegionEntry[]> = {
  // 서울특별시 (25개 구)
  [RegionDef.REGION_SEOUL]: [
    { code: RegionDef.DISTRICT_SEOUL_JONGNO,       name: RegionDef.DISTRICT_SEOUL_JONGNO_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_JUNG,         name: RegionDef.DISTRICT_SEOUL_JUNG_STR,         coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_YONGSAN,      name: RegionDef.DISTRICT_SEOUL_YONGSAN_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_SEONGDONG,    name: RegionDef.DISTRICT_SEOUL_SEONGDONG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_GWANGJIN,     name: RegionDef.DISTRICT_SEOUL_GWANGJIN_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_DONGDAEMUN,   name: RegionDef.DISTRICT_SEOUL_DONGDAEMUN_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_JUNGNANG,     name: RegionDef.DISTRICT_SEOUL_JUNGNANG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_SEONGBUK,     name: RegionDef.DISTRICT_SEOUL_SEONGBUK_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_GANGBUK,      name: RegionDef.DISTRICT_SEOUL_GANGBUK_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_DOBONG,       name: RegionDef.DISTRICT_SEOUL_DOBONG_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_NOWON,        name: RegionDef.DISTRICT_SEOUL_NOWON_STR,        coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_EUNPYEONG,    name: RegionDef.DISTRICT_SEOUL_EUNPYEONG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_SEODAEMUN,    name: RegionDef.DISTRICT_SEOUL_SEODAEMUN_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_MAPO,         name: RegionDef.DISTRICT_SEOUL_MAPO_STR,         coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_YANGCHEON,    name: RegionDef.DISTRICT_SEOUL_YANGCHEON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_GANGSEO,      name: RegionDef.DISTRICT_SEOUL_GANGSEO_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_GURO,         name: RegionDef.DISTRICT_SEOUL_GURO_STR,         coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_GEUMCHEON,    name: RegionDef.DISTRICT_SEOUL_GEUMCHEON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_YEONGDEUNGPO, name: RegionDef.DISTRICT_SEOUL_YEONGDEUNGPO_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_DONGJAK,      name: RegionDef.DISTRICT_SEOUL_DONGJAK_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_GWANAK,       name: RegionDef.DISTRICT_SEOUL_GWANAK_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_SEOCHO,       name: RegionDef.DISTRICT_SEOUL_SEOCHO_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_GANGNAM,      name: RegionDef.DISTRICT_SEOUL_GANGNAM_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_SONGPA,       name: RegionDef.DISTRICT_SEOUL_SONGPA_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_SEOUL_GANGDONG,     name: RegionDef.DISTRICT_SEOUL_GANGDONG_STR,     coord: [0, 0] },
  ],

  // 경기도 (28개 시, 3개 군)
  [RegionDef.REGION_GYEONGGI]: [
    { code: RegionDef.DISTRICT_GYEONGGI_SUWON,       name: RegionDef.DISTRICT_GYEONGGI_SUWON_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_SEONGNAM,    name: RegionDef.DISTRICT_GYEONGGI_SEONGNAM_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_UIJEONGBU,   name: RegionDef.DISTRICT_GYEONGGI_UIJEONGBU_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_ANYANG,      name: RegionDef.DISTRICT_GYEONGGI_ANYANG_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_BUCHEON,     name: RegionDef.DISTRICT_GYEONGGI_BUCHEON_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_GWANGMYEONG, name: RegionDef.DISTRICT_GYEONGGI_GWANGMYEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_PYEONGTAEK,  name: RegionDef.DISTRICT_GYEONGGI_PYEONGTAEK_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_DONGDUCHEON, name: RegionDef.DISTRICT_GYEONGGI_DONGDUCHEON_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_ANSAN,       name: RegionDef.DISTRICT_GYEONGGI_ANSAN_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_GOYANG,      name: RegionDef.DISTRICT_GYEONGGI_GOYANG_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_GWACHEON,    name: RegionDef.DISTRICT_GYEONGGI_GWACHEON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_GURI,        name: RegionDef.DISTRICT_GYEONGGI_GURI_STR,        coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_NAMYANGJU,   name: RegionDef.DISTRICT_GYEONGGI_NAMYANGJU_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_OSAN,        name: RegionDef.DISTRICT_GYEONGGI_OSAN_STR,        coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_SIHEUNG,     name: RegionDef.DISTRICT_GYEONGGI_SIHEUNG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_GUNPO,       name: RegionDef.DISTRICT_GYEONGGI_GUNPO_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_UIWANG,      name: RegionDef.DISTRICT_GYEONGGI_UIWANG_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_HANAM,       name: RegionDef.DISTRICT_GYEONGGI_HANAM_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_YONGIN,      name: RegionDef.DISTRICT_GYEONGGI_YONGIN_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_PAJU,        name: RegionDef.DISTRICT_GYEONGGI_PAJU_STR,        coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_ICHEON,      name: RegionDef.DISTRICT_GYEONGGI_ICHEON_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_ANSEONG,     name: RegionDef.DISTRICT_GYEONGGI_ANSEONG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_GIMPO,       name: RegionDef.DISTRICT_GYEONGGI_GIMPO_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_HWASEONG,    name: RegionDef.DISTRICT_GYEONGGI_HWASEONG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_GWANGJU,     name: RegionDef.DISTRICT_GYEONGGI_GWANGJU_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_YANGJU,      name: RegionDef.DISTRICT_GYEONGGI_YANGJU_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_POCHEON,     name: RegionDef.DISTRICT_GYEONGGI_POCHEON_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_YEOJU,       name: RegionDef.DISTRICT_GYEONGGI_YEOJU_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_YEONCHEON,   name: RegionDef.DISTRICT_GYEONGGI_YEONCHEON_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_GAPYEONG,    name: RegionDef.DISTRICT_GYEONGGI_GAPYEONG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGGI_YANGPYEONG,  name: RegionDef.DISTRICT_GYEONGGI_YANGPYEONG_STR,  coord: [0, 0] },
  ],

  // 인천광역시 (8개 구, 2개 군)
  [RegionDef.REGION_INCHEON]: [
    { code: RegionDef.DISTRICT_INCHEON_JUNG,     name: RegionDef.DISTRICT_INCHEON_JUNG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_DONG,     name: RegionDef.DISTRICT_INCHEON_DONG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_MICHUHOL, name: RegionDef.DISTRICT_INCHEON_MICHUHOL_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_YEONSU,   name: RegionDef.DISTRICT_INCHEON_YEONSU_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_NAMDONG,  name: RegionDef.DISTRICT_INCHEON_NAMDONG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_BUPYEONG, name: RegionDef.DISTRICT_INCHEON_BUPYEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_GYEYANG,  name: RegionDef.DISTRICT_INCHEON_GYEYANG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_SEO,      name: RegionDef.DISTRICT_INCHEON_SEO_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_GANGHWA,  name: RegionDef.DISTRICT_INCHEON_GANGHWA_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_INCHEON_ONGJIN,   name: RegionDef.DISTRICT_INCHEON_ONGJIN_STR,   coord: [0, 0] },
  ],

  // 충청북도 (3개 시, 8개 군)
  [RegionDef.REGION_CHUNGCHEONGBUK]: [
    { code: RegionDef.DISTRICT_CHUNGBUK_CHEONGJU,    name: RegionDef.DISTRICT_CHUNGBUK_CHEONGJU_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_CHUNGJU,     name: RegionDef.DISTRICT_CHUNGBUK_CHUNGJU_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_JECHEON,     name: RegionDef.DISTRICT_CHUNGBUK_JECHEON_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_BOEUN,       name: RegionDef.DISTRICT_CHUNGBUK_BOEUN_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_OKCHEON,     name: RegionDef.DISTRICT_CHUNGBUK_OKCHEON_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_YEONGDONG,   name: RegionDef.DISTRICT_CHUNGBUK_YEONGDONG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_JEUNGPYEONG, name: RegionDef.DISTRICT_CHUNGBUK_JEUNGPYEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_JINCHEON,    name: RegionDef.DISTRICT_CHUNGBUK_JINCHEON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_GOESAN,      name: RegionDef.DISTRICT_CHUNGBUK_GOESAN_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_EUMSEONG,    name: RegionDef.DISTRICT_CHUNGBUK_EUMSEONG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGBUK_DANYANG,     name: RegionDef.DISTRICT_CHUNGBUK_DANYANG_STR,     coord: [0, 0] },
  ],

  // 충청남도 (8개 시, 7개 군)
  [RegionDef.REGION_CHUNGCHEONGNAM]: [
    { code: RegionDef.DISTRICT_CHUNGNAM_CHEONAN,    name: RegionDef.DISTRICT_CHUNGNAM_CHEONAN_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_GONGJU,     name: RegionDef.DISTRICT_CHUNGNAM_GONGJU_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_BORYEONG,   name: RegionDef.DISTRICT_CHUNGNAM_BORYEONG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_ASAN,       name: RegionDef.DISTRICT_CHUNGNAM_ASAN_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_SEOSAN,     name: RegionDef.DISTRICT_CHUNGNAM_SEOSAN_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_NONSAN,     name: RegionDef.DISTRICT_CHUNGNAM_NONSAN_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_GYERYONG,   name: RegionDef.DISTRICT_CHUNGNAM_GYERYONG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_DANGJIN,    name: RegionDef.DISTRICT_CHUNGNAM_DANGJIN_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_GEUMSAN,    name: RegionDef.DISTRICT_CHUNGNAM_GEUMSAN_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_BUYEO,      name: RegionDef.DISTRICT_CHUNGNAM_BUYEO_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_SEOCHEON,   name: RegionDef.DISTRICT_CHUNGNAM_SEOCHEON_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_CHEONGYANG, name: RegionDef.DISTRICT_CHUNGNAM_CHEONGYANG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_HONGSEONG,  name: RegionDef.DISTRICT_CHUNGNAM_HONGSEONG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_YESAN,      name: RegionDef.DISTRICT_CHUNGNAM_YESAN_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_CHUNGNAM_TAEAN,      name: RegionDef.DISTRICT_CHUNGNAM_TAEAN_STR,      coord: [0, 0] },
  ],

  // 강원특별자치도 (7개 시, 11개 군)
  [RegionDef.REGION_GANGWON]: [
    { code: RegionDef.DISTRICT_GANGWON_CHUNCHEON,   name: RegionDef.DISTRICT_GANGWON_CHUNCHEON_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_WONJU,       name: RegionDef.DISTRICT_GANGWON_WONJU_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_GANGNEUNG,   name: RegionDef.DISTRICT_GANGWON_GANGNEUNG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_DONGHAE,     name: RegionDef.DISTRICT_GANGWON_DONGHAE_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_TAEBAEK,     name: RegionDef.DISTRICT_GANGWON_TAEBAEK_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_SOKCHO,      name: RegionDef.DISTRICT_GANGWON_SOKCHO_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_SAMCHEOK,    name: RegionDef.DISTRICT_GANGWON_SAMCHEOK_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_HONGCHEON,   name: RegionDef.DISTRICT_GANGWON_HONGCHEON_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_HOENGSEONG,  name: RegionDef.DISTRICT_GANGWON_HOENGSEONG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_YEONGWOL,    name: RegionDef.DISTRICT_GANGWON_YEONGWOL_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_PYEONGCHANG, name: RegionDef.DISTRICT_GANGWON_PYEONGCHANG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_JEONGSEON,   name: RegionDef.DISTRICT_GANGWON_JEONGSEON_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_CHEORWON,    name: RegionDef.DISTRICT_GANGWON_CHEORWON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_HWACHEON,    name: RegionDef.DISTRICT_GANGWON_HWACHEON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_YANGGU,      name: RegionDef.DISTRICT_GANGWON_YANGGU_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_INJE,        name: RegionDef.DISTRICT_GANGWON_INJE_STR,        coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_GOSEONG,     name: RegionDef.DISTRICT_GANGWON_GOSEONG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GANGWON_YANGYANG,    name: RegionDef.DISTRICT_GANGWON_YANGYANG_STR,    coord: [0, 0] },
  ],

  // 부산광역시 (15개 구, 1개 군)
  [RegionDef.REGION_BUSAN]: [
    { code: RegionDef.DISTRICT_BUSAN_JUNG,      name: RegionDef.DISTRICT_BUSAN_JUNG_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_SEO,       name: RegionDef.DISTRICT_BUSAN_SEO_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_DONG,      name: RegionDef.DISTRICT_BUSAN_DONG_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_YEONGDO,   name: RegionDef.DISTRICT_BUSAN_YEONGDO_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_BUSANJIN,  name: RegionDef.DISTRICT_BUSAN_BUSANJIN_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_DONGNAE,   name: RegionDef.DISTRICT_BUSAN_DONGNAE_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_NAM,       name: RegionDef.DISTRICT_BUSAN_NAM_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_BUK,       name: RegionDef.DISTRICT_BUSAN_BUK_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_HAEUNDAE,  name: RegionDef.DISTRICT_BUSAN_HAEUNDAE_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_SAHA,      name: RegionDef.DISTRICT_BUSAN_SAHA_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_GEUMJEONG, name: RegionDef.DISTRICT_BUSAN_GEUMJEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_GANGSEO,   name: RegionDef.DISTRICT_BUSAN_GANGSEO_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_YEONJE,    name: RegionDef.DISTRICT_BUSAN_YEONJE_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_SUYEONG,   name: RegionDef.DISTRICT_BUSAN_SUYEONG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_SASANG,    name: RegionDef.DISTRICT_BUSAN_SASANG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_BUSAN_GIJANG,    name: RegionDef.DISTRICT_BUSAN_GIJANG_STR,    coord: [0, 0] },
  ],

  // 대구광역시 (7개 구, 2개 군)
  [RegionDef.REGION_DAEGU]: [
    { code: RegionDef.DISTRICT_DAEGU_JUNG,     name: RegionDef.DISTRICT_DAEGU_JUNG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEGU_DONG,     name: RegionDef.DISTRICT_DAEGU_DONG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEGU_SEO,      name: RegionDef.DISTRICT_DAEGU_SEO_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEGU_NAM,      name: RegionDef.DISTRICT_DAEGU_NAM_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEGU_BUK,      name: RegionDef.DISTRICT_DAEGU_BUK_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEGU_SUSEONG,  name: RegionDef.DISTRICT_DAEGU_SUSEONG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEGU_DALSEO,   name: RegionDef.DISTRICT_DAEGU_DALSEO_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEGU_DALSEONG, name: RegionDef.DISTRICT_DAEGU_DALSEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEGU_GUNWI,    name: RegionDef.DISTRICT_DAEGU_GUNWI_STR,    coord: [0, 0] },
  ],

  // 광주광역시 (5개 구)
  [RegionDef.REGION_GWANGJU]: [
    { code: RegionDef.DISTRICT_GWANGJU_DONG,     name: RegionDef.DISTRICT_GWANGJU_DONG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GWANGJU_SEO,      name: RegionDef.DISTRICT_GWANGJU_SEO_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GWANGJU_NAM,      name: RegionDef.DISTRICT_GWANGJU_NAM_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GWANGJU_BUK,      name: RegionDef.DISTRICT_GWANGJU_BUK_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GWANGJU_GWANGSAN, name: RegionDef.DISTRICT_GWANGJU_GWANGSAN_STR, coord: [0, 0] },
  ],

  // 대전광역시 (5개 구)
  [RegionDef.REGION_DAEJEON]: [
    { code: RegionDef.DISTRICT_DAEJEON_DONG,    name: RegionDef.DISTRICT_DAEJEON_DONG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEJEON_JUNG,    name: RegionDef.DISTRICT_DAEJEON_JUNG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEJEON_SEO,     name: RegionDef.DISTRICT_DAEJEON_SEO_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEJEON_YUSEONG, name: RegionDef.DISTRICT_DAEJEON_YUSEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_DAEJEON_DAEDEOK, name: RegionDef.DISTRICT_DAEJEON_DAEDEOK_STR, coord: [0, 0] },
  ],

  // 울산광역시 (4개 구, 1개 군)
  [RegionDef.REGION_ULSAN]: [
    { code: RegionDef.DISTRICT_ULSAN_JUNG, name: RegionDef.DISTRICT_ULSAN_JUNG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_ULSAN_NAM,  name: RegionDef.DISTRICT_ULSAN_NAM_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_ULSAN_DONG, name: RegionDef.DISTRICT_ULSAN_DONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_ULSAN_BUK,  name: RegionDef.DISTRICT_ULSAN_BUK_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_ULSAN_ULJU, name: RegionDef.DISTRICT_ULSAN_ULJU_STR, coord: [0, 0] },
  ],

  // 세종특별자치시 (단일)
  [RegionDef.REGION_SEJONG]: [
    { code: RegionDef.DISTRICT_SEJONG, name: RegionDef.DISTRICT_SEJONG_STR, coord: [0, 0] },
  ],

  // 제주특별자치도 (2개 행정시)
  [RegionDef.REGION_JEJU]: [
    { code: RegionDef.DISTRICT_JEJU_JEJU,     name: RegionDef.DISTRICT_JEJU_JEJU_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEJU_SEOGWIPO, name: RegionDef.DISTRICT_JEJU_SEOGWIPO_STR, coord: [0, 0] },
  ],

  // 경상북도 (10개 시, 12개 군)
  [RegionDef.REGION_GYEONGSANGBUK]: [
    { code: RegionDef.DISTRICT_GYEONGBUK_POHANG,     name: RegionDef.DISTRICT_GYEONGBUK_POHANG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_GYEONGJU,   name: RegionDef.DISTRICT_GYEONGBUK_GYEONGJU_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_GIMCHEON,   name: RegionDef.DISTRICT_GYEONGBUK_GIMCHEON_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_ANDONG,     name: RegionDef.DISTRICT_GYEONGBUK_ANDONG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_GUMI,       name: RegionDef.DISTRICT_GYEONGBUK_GUMI_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_YEONGJU,    name: RegionDef.DISTRICT_GYEONGBUK_YEONGJU_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_YEONGCHEON, name: RegionDef.DISTRICT_GYEONGBUK_YEONGCHEON_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_SANGJU,     name: RegionDef.DISTRICT_GYEONGBUK_SANGJU_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_MUNGYEONG,  name: RegionDef.DISTRICT_GYEONGBUK_MUNGYEONG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_GYEONGSAN,  name: RegionDef.DISTRICT_GYEONGBUK_GYEONGSAN_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_UISEONG,    name: RegionDef.DISTRICT_GYEONGBUK_UISEONG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_CHEONGSONG, name: RegionDef.DISTRICT_GYEONGBUK_CHEONGSONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_YEONGYANG,  name: RegionDef.DISTRICT_GYEONGBUK_YEONGYANG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_YEONGDEOK,  name: RegionDef.DISTRICT_GYEONGBUK_YEONGDEOK_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_CHEONGDO,   name: RegionDef.DISTRICT_GYEONGBUK_CHEONGDO_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_GORYEONG,   name: RegionDef.DISTRICT_GYEONGBUK_GORYEONG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_SEONGJU,    name: RegionDef.DISTRICT_GYEONGBUK_SEONGJU_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_CHILGOK,    name: RegionDef.DISTRICT_GYEONGBUK_CHILGOK_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_YECHEON,    name: RegionDef.DISTRICT_GYEONGBUK_YECHEON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_BONGHWA,    name: RegionDef.DISTRICT_GYEONGBUK_BONGHWA_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_ULJIN,      name: RegionDef.DISTRICT_GYEONGBUK_ULJIN_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGBUK_ULLEUNG,    name: RegionDef.DISTRICT_GYEONGBUK_ULLEUNG_STR,    coord: [0, 0] },
  ],

  // 경상남도 (8개 시, 10개 군)
  [RegionDef.REGION_GYEONGSANGNAM]: [
    { code: RegionDef.DISTRICT_GYEONGNAM_CHANGWON,    name: RegionDef.DISTRICT_GYEONGNAM_CHANGWON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_JINJU,       name: RegionDef.DISTRICT_GYEONGNAM_JINJU_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_TONGYEONG,   name: RegionDef.DISTRICT_GYEONGNAM_TONGYEONG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_SACHEON,     name: RegionDef.DISTRICT_GYEONGNAM_SACHEON_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_GIMHAE,      name: RegionDef.DISTRICT_GYEONGNAM_GIMHAE_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_MIRYANG,     name: RegionDef.DISTRICT_GYEONGNAM_MIRYANG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_GEOJE,       name: RegionDef.DISTRICT_GYEONGNAM_GEOJE_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_YANGSAN,     name: RegionDef.DISTRICT_GYEONGNAM_YANGSAN_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_UIRYEONG,    name: RegionDef.DISTRICT_GYEONGNAM_UIRYEONG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_HAMAN,       name: RegionDef.DISTRICT_GYEONGNAM_HAMAN_STR,       coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_CHANGNYEONG, name: RegionDef.DISTRICT_GYEONGNAM_CHANGNYEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_GOSEONG,     name: RegionDef.DISTRICT_GYEONGNAM_GOSEONG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_NAMHAE,      name: RegionDef.DISTRICT_GYEONGNAM_NAMHAE_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_HADONG,      name: RegionDef.DISTRICT_GYEONGNAM_HADONG_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_SANCHEONG,   name: RegionDef.DISTRICT_GYEONGNAM_SANCHEONG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_HAMYANG,     name: RegionDef.DISTRICT_GYEONGNAM_HAMYANG_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_GEOCHANG,    name: RegionDef.DISTRICT_GYEONGNAM_GEOCHANG_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_GYEONGNAM_HAPCHEON,    name: RegionDef.DISTRICT_GYEONGNAM_HAPCHEON_STR,    coord: [0, 0] },
  ],

  // 전북특별자치도 (6개 시, 8개 군)
  [RegionDef.REGION_JEONBUK]: [
    { code: RegionDef.DISTRICT_JEONBUK_JEONJU,    name: RegionDef.DISTRICT_JEONBUK_JEONJU_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_GUNSAN,    name: RegionDef.DISTRICT_JEONBUK_GUNSAN_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_IKSAN,     name: RegionDef.DISTRICT_JEONBUK_IKSAN_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_JEONGEUP,  name: RegionDef.DISTRICT_JEONBUK_JEONGEUP_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_NAMWON,    name: RegionDef.DISTRICT_JEONBUK_NAMWON_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_GIMJE,     name: RegionDef.DISTRICT_JEONBUK_GIMJE_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_WANJU,     name: RegionDef.DISTRICT_JEONBUK_WANJU_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_JINAN,     name: RegionDef.DISTRICT_JEONBUK_JINAN_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_MUJU,      name: RegionDef.DISTRICT_JEONBUK_MUJU_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_JANGSU,    name: RegionDef.DISTRICT_JEONBUK_JANGSU_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_IMSIL,     name: RegionDef.DISTRICT_JEONBUK_IMSIL_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_SUNCHANG,  name: RegionDef.DISTRICT_JEONBUK_SUNCHANG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_GOCHANG,   name: RegionDef.DISTRICT_JEONBUK_GOCHANG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONBUK_BUAN,      name: RegionDef.DISTRICT_JEONBUK_BUAN_STR,      coord: [0, 0] },
  ],

  // 전라남도 (5개 시, 17개 군)
  [RegionDef.REGION_JEONNAM]: [
    { code: RegionDef.DISTRICT_JEONNAM_MOKPO,     name: RegionDef.DISTRICT_JEONNAM_MOKPO_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_YEOSU,     name: RegionDef.DISTRICT_JEONNAM_YEOSU_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_SUNCHEON,  name: RegionDef.DISTRICT_JEONNAM_SUNCHEON_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_NAJU,      name: RegionDef.DISTRICT_JEONNAM_NAJU_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_GWANGYANG, name: RegionDef.DISTRICT_JEONNAM_GWANGYANG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_DAMYANG,   name: RegionDef.DISTRICT_JEONNAM_DAMYANG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_GOKSEONG,  name: RegionDef.DISTRICT_JEONNAM_GOKSEONG_STR,  coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_GURYE,     name: RegionDef.DISTRICT_JEONNAM_GURYE_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_GOHEUNG,   name: RegionDef.DISTRICT_JEONNAM_GOHEUNG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_BOSEONG,   name: RegionDef.DISTRICT_JEONNAM_BOSEONG_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_HWASUN,    name: RegionDef.DISTRICT_JEONNAM_HWASUN_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_JANGHEUNG, name: RegionDef.DISTRICT_JEONNAM_JANGHEUNG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_GANGJIN,   name: RegionDef.DISTRICT_JEONNAM_GANGJIN_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_HAENAM,    name: RegionDef.DISTRICT_JEONNAM_HAENAM_STR,    coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_YEONGAM,   name: RegionDef.DISTRICT_JEONNAM_YEONGAM_STR,   coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_MUAN,      name: RegionDef.DISTRICT_JEONNAM_MUAN_STR,      coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_HAMPYEONG, name: RegionDef.DISTRICT_JEONNAM_HAMPYEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_YEONGGWANG,name: RegionDef.DISTRICT_JEONNAM_YEONGGWANG_STR,coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_JANGSEONG, name: RegionDef.DISTRICT_JEONNAM_JANGSEONG_STR, coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_WANDO,     name: RegionDef.DISTRICT_JEONNAM_WANDO_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_JINDO,     name: RegionDef.DISTRICT_JEONNAM_JINDO_STR,     coord: [0, 0] },
    { code: RegionDef.DISTRICT_JEONNAM_SINAN,     name: RegionDef.DISTRICT_JEONNAM_SINAN_STR,     coord: [0, 0] },
  ],
};

// ========================= 평탄화된 시군구 (검색용) =========================

export const ALL_DISTRICTS: RegionEntry[] = Object.values(DISTRICTS_BY_PROVINCE).flat();

// ========================= 헬퍼 =========================

export const getProvinceByCode = (code: number): RegionEntry | undefined =>
  PROVINCES.find((p) => p.code === code);

export const getDistrictByCode = (code: number): RegionEntry | undefined =>
  ALL_DISTRICTS.find((d) => d.code === code);

export const getDistrictsByProvince = (provinceCode: number): RegionEntry[] =>
  DISTRICTS_BY_PROVINCE[provinceCode] ?? [];
