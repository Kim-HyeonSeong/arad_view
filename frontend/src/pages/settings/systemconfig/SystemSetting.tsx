import { useState, useEffect } from 'react';
import {
  Tabs, Typography, Input, InputNumber, Slider, Tag, Row, Col, Button, Space, message,
} from 'antd';
import { ReloadOutlined, EditOutlined, PlusOutlined, UndoOutlined } from '@ant-design/icons';
import AuthTab from './tabs/AuthTab';
import CommunicationTab from './tabs/CommunicationTab';
import UiTab from './tabs/UiTab';
import AlertTab from './tabs/AlertTab';
import * as CvtSysset from '../../../bulk_cmd/convert/sysset/ConvertSyssetCmd';
import { applyCmd } from '../../../bulk_cmd/api/ApplyCmdList';
import * as CstDef from '../../../commons/CstDef';
import type { Cmd } from '../../../commons/Types';
import { getIsAdmin } from '../../../services/Service';
import BulkCmdList from '../../../bulk_cmd/convert/BulkCmdList';
import MonitoringTab from './tabs/MonitoringTab';

const { Title, Text } = Typography;

// 사이드바와 동일한 ARAD 네이비 색상
const ACCENT_COLOR = '#171C61';

// ========================= 공통 타입 / 메타 =========================

export interface SettingItem {
  id: number;
  key: string;
  value: string;
  default_value: string;
  unit?: string;
  description: string;
  value_type: 'int' | 'string' | 'json_array' | string;
  created_at: string;
  updated_at: string;
}

export interface SettingMeta {
  title: string;
  min?: number;
  max?: number;
  step?: number;
  tagColor?: string;
  useInput?: boolean;
}

// 범위는 backend/internal/setting/validator.go 와 동기화 필수 (CLAUDE.md 13 / 5-3).
export const SETTING_META: Record<string, SettingMeta> = {
  // agent.* (통신 설정)
  'agent.takeover.window_seconds':        { title: '세션 승계 윈도우',        min: 10,   max: 3600,     step: 10,        tagColor: 'blue'  },
  'agent.takeover.max_count':             { title: '세션 승계 최대 횟수',     min: 1,    max: 100,      step: 1,         tagColor: 'blue'  },
  'agent.takeover.retry_after_seconds':   { title: 'Retry-After 응답값',     min: 5,    max: 600,      step: 5,         tagColor: 'blue'  },
  'agent.message.read_limit_bytes':       { title: '메시지 수신 최대 크기',    min: 1024, max: 67108864, useInput: true, tagColor: 'green' },
  'agent.message.write_deadline_seconds': { title: '메시지 송신 Deadline',    min: 1,    max: 120,      step: 1,         tagColor: 'green' },
  'agent.whitelist':                      { title: '프록시 허용 경로 목록' },

  // auth.* (인증 설정)
  'auth.login.fail_limit':                { title: '로그인 실패 제한 횟수',    min: 3,    max: 10,       step: 1,         tagColor: 'blue'  },
  'auth.login.block_interval_seconds':    { title: '로그인 실패 시 잠금 시간', min: 60,   max: 86400,    step: 60,        tagColor: 'blue'  },
  'auth.password.expire_days':            { title: '비밀번호 변경 유효기간',    min: 30,   max: 365,      step: 5,         tagColor: 'green' },

  // ui.* (UI 설정)
  'ui.data_refresh_interval_seconds':     { title: '데이터 새로고침 주기',     min: 5,    max: 300,      step: 5,         tagColor: 'blue'  },

  // monitor.* (모니터링 설정)
  'monitor.threshold.cpu_percent' :      { title: 'CPU 사용률 임계값 (%)',   min: 0,    max: 100,      step: 1,         tagColor: 'red'   },
  'monitor.threshold.memory_percent' :   { title: '메모리 사용률 임계값 (%)', min: 0,    max: 100,      step: 1,         tagColor: 'red'   },
  'monitor.threshold.disk_percent' :     { title: '디스크 사용률 임계값 (%)', min: 0,    max: 100,      step: 1,         tagColor: 'red'   },
  'monitor.threshold.cooldown_minutes' : { title: '임계값 재발 방지 쿨다운 (분)', min: 1,    max: 60,     step: 1,         tagColor: 'orange' },
  'monitor.retention.event_days' :       { title: '이벤트 보관 기간 (일)',       min: 30,    max: 365,      step: 1,         tagColor: 'orange'   },
  'monitor.retention.unauth_log_days' :         { title: '인증되지 않은 로그 보관 기간 (일)',         min: 30,    max: 1095,      step: 1,         tagColor: 'orange'   },
  'monitor.cleanup.daily_hour' :        { title: '데이터 정리 실행 시각 (시)',   min: 0,    max: 23,       step: 1,         tagColor: 'green' },

};

// ========================= 공통 컴포넌트 =========================

interface SettingRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

export const SettingRow: React.FC<SettingRowProps> = ({ label, description, children }) => (
  <Row gutter={16} align="middle" style={{ marginBottom: 32 }}>
    <Col xs={24} md={6}>
      <div style={{ paddingLeft: 5 }}>
        <Text strong style={{ fontSize: 14, display: 'block' }}>{label}</Text>
        {description && (
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            {description}
          </Text>
        )}
      </div>
    </Col>
    <Col xs={24} md={18}>{children}</Col>
  </Row>
);

interface ValuedSliderProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  tagColor?: string;
}

const ValuedSlider: React.FC<ValuedSliderProps> = ({
  value, onChange, min, max, step, unit, tagColor = 'blue',
}) => (
  <div style={{ width: '50%', marginLeft: 'auto' }}>
    <div style={{ textAlign: 'right', marginBottom: 4 }}>
      <Tag color={tagColor} style={{ padding: '2px 10px', fontSize: 12 }}>
        {unit === 'count'
          ? `count : ${value}, (${min} to ${max}, step ${step})`
          : `value : ${value} ${unit}, (${min} to ${max}, step ${step}${unit})`}
      </Tag>
    </div>
    <Slider value={value} onChange={onChange} min={min} max={max} step={step} tooltip={{ open: false }} />
  </div>
);

interface RangeInputProps {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  tagColor?: string;
}

const RangeInput: React.FC<RangeInputProps> = ({ value, onChange, min, max, unit, tagColor = 'blue' }) => (
  <div style={{ width: '50%', marginLeft: 'auto' }}>
    <div style={{ textAlign: 'right', marginBottom: 4 }}>
      <Tag color={tagColor} style={{ padding: '2px 10px', fontSize: 12 }}>
        {`range : ${min} ~ ${max}${unit ? ' ' + unit : ''}`}
      </Tag>
    </div>
    <InputNumber
      value={value}
      onChange={(v) => onChange(typeof v === 'number' ? v : min)}
      min={min}
      max={max}
      step={1}
      style={{ width: '100%' }}
    />
  </div>
);

interface WhitelistEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

const WhitelistEditor: React.FC<WhitelistEditorProps> = ({ value, onChange }) => {
  const [draft, setDraft] = useState('');

  let parsed: string[] = [];
  try {
    const arr = JSON.parse(value || '[]');
    parsed = Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    parsed = [];
  }

  const commit = (next: string[]) => onChange(JSON.stringify(next));

  const handleAdd = () => {
    const v = draft.trim();
    if (!v) return;
    if (parsed.includes(v)) { setDraft(''); return; }
    commit([...parsed, v]);
    setDraft('');
  };

  const handleRemove = (target: string) => {
    commit(parsed.filter((x) => x !== target));
  };

  return (
    <div style={{ width: '50%', marginLeft: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onPressEnter={handleAdd}
          placeholder="/api/v1/..."
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined style={{ fontSize: '12px' }} />}
          style={{ width: 25, height: 25, minWidth: 25, flexShrink: 0 }}
          onClick={handleAdd}
        />
      </div>
      {parsed.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {parsed.map((path) => (
            <Tag
              key={path}
              closable
              onClose={(e) => { e.preventDefault(); handleRemove(path); }}
              style={{ padding: '4px 8px', fontSize: 12 }}
            >
              {path}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

// 각 SettingItem 을 적절한 위젯으로 렌더. tab 컴포넌트들이 호출하는 헬퍼.
export function renderSettingRow(
  it: SettingItem,
  values: Record<string, string>,
  setOne: (key: string, v: string) => void,
): React.ReactNode {
  const meta = SETTING_META[it.key] ?? { title: it.key };
  const currentRaw = values[it.key] ?? it.value;

  if (it.value_type === 'int' && meta.min !== undefined && meta.max !== undefined && meta.useInput) {
    const numVal = parseInt(currentRaw, 10) || 0;
    return (
      <SettingRow key={it.key} label={meta.title} description={it.description}>
        <RangeInput
          value={numVal}
          onChange={(v) => setOne(it.key, String(v))}
          min={meta.min}
          max={meta.max}
          unit={it.unit ?? ''}
          tagColor={meta.tagColor}
        />
      </SettingRow>
    );
  }

  if (
    it.value_type === 'int' &&
    meta.min !== undefined &&
    meta.max !== undefined &&
    meta.step !== undefined
  ) {
    const numVal = parseInt(currentRaw, 10) || 0;
    return (
      <SettingRow key={it.key} label={meta.title} description={it.description}>
        <ValuedSlider
          value={numVal}
          onChange={(v) => setOne(it.key, String(v))}
          min={meta.min}
          max={meta.max}
          step={meta.step}
          unit={it.unit ?? ''}
          tagColor={meta.tagColor}
        />
      </SettingRow>
    );
  }

  if (it.value_type === 'json_array') {
    return (
      <SettingRow key={it.key} label={meta.title} description={it.description}>
        <WhitelistEditor
          value={currentRaw}
          onChange={(v) => setOne(it.key, v)}
        />
      </SettingRow>
    );
  }

  return (
    <SettingRow key={it.key} label={meta.title} description={it.description}>
      <div style={{ width: '50%', marginLeft: 'auto' }}>
        <Input
          value={currentRaw}
          onChange={(e) => setOne(it.key, e.target.value)}
        />
      </div>
    </SettingRow>
  );
}

// ========================= 컨테이너 =========================

const SystemSetting: React.FC = () => {
  const [items, setItems] = useState<SettingItem[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cmdList, setCmdList] = useState<Cmd[]>([]);
  // 활성 탭 — getSettingValues 호출 시 (조회/저장 후) 첫 탭으로 리셋.
  const [activeTab, setActiveTab] = useState<string>('ui');

  const getSettingValues = async () => {
    const cmd = CvtSysset.getSyssetInfoToBulkCmd();
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
      message.error(ret.msg || '조회에 실패했습니다.');
      return;
    }

    const list = ret.data as SettingItem[] | null;
    if (!Array.isArray(list)) return;

    setItems(list);
    const init: Record<string, string> = {};
    list.forEach((it) => { init[it.key] = it.value; });
    setValues(init);
    // 조회/갱신 시 첫 탭으로 복귀.
    setActiveTab('ui');
  };

  useEffect(() => {
    getSettingValues();
  }, []);

  const handleRefresh = async () => {
    await getSettingValues();
  };

  const handleReset = () => {
    const isAdmin = getIsAdmin();
    if (!isAdmin) {
      message.error('설정 변경 권한이 없습니다.');
      return;
    }

    const cmd = CvtSysset.getSyssetResetToBulkCmd();
    setCmdList([cmd]);
    setBulkModalOpen(true);
  };

  const handleSave = async () => {
    const isAdmin = getIsAdmin();
    if (!isAdmin) {
      message.error('설정 변경 권한이 없습니다.');
      return;
    }

    const changes = items
      .filter((it) => values[it.key] !== it.value)
      .map((it) => ({ key: it.key, value: values[it.key] }));

    if (changes.length === 0) {
      message.info('변경된 항목이 없습니다.');
      return;
    }

    const cmd = CvtSysset.getSyssetModifyToBulkCmd({ changes });
    setCmdList([cmd]);
    setBulkModalOpen(true);
  };

  const handleBulkClose = () => {
    setBulkModalOpen(false);
  };

  const setOne = (key: string, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>시스템 설정</Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Text strong>버전</Text>
          <Input value="0.5 version" readOnly style={{ width: 200 }} />
        </div>
      </div>

      {/* 선택된 탭 스타일 커스터마이즈 */}
      <style>{`
        .systemsetting-tabs .ant-tabs-tab-active {
          background: ${ACCENT_COLOR};
          border-radius: 4px 4px 0 0;
        }
        .systemsetting-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #ffffff !important;
        }
        .systemsetting-tabs .ant-tabs-tab {
          padding: 8px 24px;
          margin: 0 4px 0 0 !important;
        }
        .systemsetting-tabs .ant-tabs-nav::before {
          border-bottom-color: #ffffff !important;
        }
        .systemsetting-tabs .ant-tabs-ink-bar {
          background: #ffffff !important;
          clip-path: inset(0 15% 0 15%);
        }
      `}</style>

      <Tabs
        className="systemsetting-tabs"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: 'ui',    label: 'UI 설정',  children: <UiTab items={items} values={values} setOne={setOne} /> },
          { key: 'auth',  label: '인증 설정', children: <AuthTab items={items} values={values} setOne={setOne} /> },
          { key: 'comm',  label: '통신 설정', children: <CommunicationTab items={items} values={values} setOne={setOne} /> },
          { key: 'monitor', label: '모니터링 설정', children: <MonitoringTab items={items} values={values} setOne={setOne} /> },
          { key: 'alert', label: '알림 설정', children: <AlertTab /> },
        ]}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>조회</Button>
          <Button icon={<UndoOutlined />} onClick={handleReset}>초기화</Button>
          <Button type="primary" icon={<EditOutlined />} onClick={handleSave}>수정</Button>
        </Space>
      </div>

      <BulkCmdList
        open={bulkModalOpen}
        cmdList={cmdList}
        onClose={handleBulkClose}
        onSuccess={getSettingValues}
      />
    </div>
  );
};

export default SystemSetting;
