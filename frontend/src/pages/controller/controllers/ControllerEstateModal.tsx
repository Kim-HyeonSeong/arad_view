import { useEffect, useState } from 'react';
import { Modal, InputNumber, Button, Space, Typography, Tooltip } from 'antd';
import { PlusOutlined, MinusOutlined, LeftOutlined, RightOutlined, ReloadOutlined, FileExcelOutlined, } from '@ant-design/icons';

const { Text } = Typography;

// 단지 1개 = 페이지 1개. 페이지 안에 층/호 수에 따른 블록 그리드를 렌더.
interface BuildingPage {
  floors: number;          // 층 수
  units: number;           // 한 층당 호 수
  disabledKeys: string[];  // "{floor}-{unit}" 형식. 비어있는(존재하지 않는) 호.
}

interface UnitState {
  // 단지 idx, 층 idx, 호 idx 에 해당하는 호의 상태.
  // 기본 'normal' (녹색). 추후 'error' (빨강) 등 확장 예정.
  status: 'normal' | 'error';
}

interface ControllerEstateModalProps {
  open: boolean;
  onCancel: () => void;
  onOk?: (pages: BuildingPage[]) => void;
}

const DEFAULT_FLOORS = 5;
const DEFAULT_UNITS = 4;
const MAX_PAGES = 20;          // 단지 수 상한 — UI 보호용
const MIN_PAGES = 1;

const BLOCK_SIZE = 36;         // 블록 한 변 px
const BLOCK_GAP = 4;           // 블록 간격 px
const COLOR_NORMAL = '#22C55E';
const COLOR_ERROR  = '#EF4444';

// 새 페이지의 기본값. 빈 호 목록 없이 모두 채워진 상태로 시작.
const makeNewPage = (): BuildingPage => ({
  floors: DEFAULT_FLOORS,
  units: DEFAULT_UNITS,
  disabledKeys: [],
});

const ControllerEstateModal: React.FC<ControllerEstateModalProps> = ({ open, onCancel, onOk }) => {
  // 페이지(단지) 배열 — 최초 진입 시 1개로 시작.
  const [pages, setPages] = useState<BuildingPage[]>([makeNewPage()]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // 모달이 열릴 때마다 초기화.
  useEffect(() => {
    if (open) {
      setPages([makeNewPage()]);
      setCurrentIdx(0);
    }
  }, [open]);

  const current = pages[currentIdx] ?? { floors: 0, units: 0, disabledKeys: [] };

  const updateCurrent = (patch: Partial<BuildingPage>) => {
    setPages((prev) => {
      const next = [...prev];
      next[currentIdx] = { ...next[currentIdx], ...patch };
      return next;
    });
  };

  // 단지(페이지) 추가 — 끝에 새 페이지 추가 후 그 페이지로 이동.
  const handleAddPage = () => {
    if (pages.length >= MAX_PAGES) return;
    setPages((prev) => [...prev, makeNewPage()]);
    setCurrentIdx(pages.length);
  };

  // 단지(페이지) 삭제 — 현재 페이지 제거. 1개 미만으로 줄지 않음.
  const handleRemovePage = () => {
    if (pages.length <= MIN_PAGES) return;
    setPages((prev) => prev.filter((_, i) => i !== currentIdx));
    setCurrentIdx((i) => Math.max(0, i - 1));
  };

  const handlePrev = () => setCurrentIdx((i) => Math.max(0, i - 1));
  const handleNext = () => setCurrentIdx((i) => Math.min(pages.length - 1, i + 1));

  // 현재 단지를 기본값(층/호 + 비활성 호 목록)으로 초기화. 다른 단지는 그대로 둠.
  const handleResetCurrent = () => {
    updateCurrent({ floors: DEFAULT_FLOORS, units: DEFAULT_UNITS, disabledKeys: [] });
  };

  // 현재 단지 데이터를 Excel 파일 import.
  const handleExcelImport = () => {
    // TODO: Excel 파일 import 로직 구현

  };

  // 호 블록 클릭 → 해당 호의 disabled 토글. 비어있던 호를 다시 클릭하면 살아남.
  const toggleBlock = (f: number, u: number) => {
    const key = `${f}-${u}`;
    setPages((prev) => {
      const next = [...prev];
      const page = { ...next[currentIdx] };
      page.disabledKeys = page.disabledKeys.includes(key)
        ? page.disabledKeys.filter((k) => k !== key)
        : [...page.disabledKeys, key];
      next[currentIdx] = page;
      return next;
    });
  };

  // 블록 그리드 생성 — floors × units 만큼 div 를 깔아 시각화.
  // 위 행이 최상층(예: 5층), 아래 행이 1층이 되도록 렌더.
  const renderBlocks = () => {
    const { floors, units, disabledKeys } = current;
    if (floors <= 0 || units <= 0) {
      return <Text type="secondary">층과 호 수를 입력하세요.</Text>;
    }
    const disabledSet = new Set(disabledKeys);
    const rows: React.ReactNode[] = [];
    for (let f = floors; f >= 1; f--) {
      const cols: React.ReactNode[] = [];
      for (let u = 1; u <= units; u++) {
        const key = `${f}-${u}`;
        const isDisabled = disabledSet.has(key);
        const status = 'normal' as UnitState['status'];   // TODO: 실제 상태 매핑
        const label = `${f}층 ${String(u).padStart(2, '0')}호${isDisabled ? ' (없음)' : ''}`;
        cols.push(
          <Tooltip key={key} title={label}>
            <div
              onClick={() => toggleBlock(f, u)}
              style={{
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                boxSizing: 'border-box',   // 테두리 포함 36×36 유지 → disabled 블록도 옆을 밀지 않음
                background: isDisabled
                  ? 'transparent'
                  : status === 'error' ? COLOR_ERROR : COLOR_NORMAL,
                // 채워진 블록은 투명 테두리로 크기 보정, disabled 는 점선 표시.
                border: isDisabled ? '1px dashed #D9D9D9' : '1px solid transparent',
                borderRadius: 4,
                boxShadow: isDisabled ? 'none' : 'inset 0 -3px 0 rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transition: 'background 120ms ease, border-color 120ms ease',
              }}
            />
          </Tooltip>
        );
      }
      rows.push(
        <div key={`floor-${f}`} style={{ display: 'flex', gap: BLOCK_GAP, alignItems: 'center' }}>
          <Text type="secondary" style={{ width: 32, textAlign: 'right', fontSize: 12 }}>
            {f}F
          </Text>
          <div style={{ display: 'flex', gap: BLOCK_GAP }}>{cols}</div>
        </div>
      );
    }
    return <div style={{ display: 'flex', flexDirection: 'column', gap: BLOCK_GAP }}>{rows}</div>;
  };

  // 활성(있음) 호 개수 — 전체 - disabled. 음수 방지 위해 max 0.
  const activeUnitCount = Math.max(0, current.floors * current.units - current.disabledKeys.length);

  return (
    <Modal
      title="단지 구성"
      open={open}
      onCancel={onCancel}
      onOk={() => onOk?.(pages)}
      width={720}
      centered
      destroyOnHidden
      okText="저장"
      cancelText="취소"
    >
      {/* 페이지 네비게이션 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Space>
          <Button icon={<LeftOutlined />} onClick={handlePrev} disabled={currentIdx === 0} />
          <Text strong>
            단지 {currentIdx + 1} / {pages.length}
          </Text>
          <Button icon={<RightOutlined />} onClick={handleNext} disabled={currentIdx >= pages.length - 1} />
        </Space>
        <Space>
          <Tooltip title="Excel Import">
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={handleExcelImport}
            >
              Import
            </Button>
          </Tooltip>
          <Tooltip title="현재 단지 초기화">
            <Button icon={<ReloadOutlined />} onClick={handleResetCurrent} />
          </Tooltip>
          <Tooltip title="단지 추가">
            <Button icon={<PlusOutlined />} onClick={handleAddPage} disabled={pages.length >= MAX_PAGES} />
          </Tooltip>
          <Tooltip title="현재 단지 삭제">
            <Button icon={<MinusOutlined />} danger onClick={handleRemovePage} disabled={pages.length <= MIN_PAGES} />
          </Tooltip>
        </Space>
      </div>

      {/* 층/호 입력 */}
      <Space style={{ marginBottom: 16 }}>
        <span>층 수</span>
        <InputNumber
          min={1}
          max={100}
          value={current.floors}
          onChange={(v) => updateCurrent({ floors: Number(v ?? 0) })}
          style={{ width: 100 }}
        />
        <span style={{ marginLeft: 12 }}>호 수</span>
        <InputNumber
          min={1}
          max={50}
          value={current.units}
          onChange={(v) => updateCurrent({ units: Number(v ?? 0) })}
          style={{ width: 100 }}
        />
        <Text type="secondary" style={{ marginLeft: 12 }}>
          실거주 {activeUnitCount} / 전체 {current.floors * current.units} 세대
        </Text>
      </Space>

      {/* 안내 문구 */}
      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
        존재하지 않는 호는 블록을 클릭해서 제외하세요. 다시 클릭하면 복구됩니다.
      </Text>

      {/* 블록 시각화 영역 */}
      <div
        style={{
          background: '#FAFAFA',
          border: '1px solid #F0F0F0',
          borderRadius: 4,
          padding: 16,
          maxHeight: 420,
          overflow: 'auto',
        }}
      >
        {renderBlocks()}
      </div>
    </Modal>
  );
};

export default ControllerEstateModal;
