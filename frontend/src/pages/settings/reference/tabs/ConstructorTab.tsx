import { useMemo, useState, useCallback, memo } from 'react';
import { Tree, Button, Space, Typography, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import * as CompanyDef from '../../../../commons/CompanyDef';
import CompanyNodeModal, {
  type CompanyItem,
  type CompanyType,
  type CompanyFormValues,
} from './CompanyNodeModal';

const { Text, Title } = Typography;

// TODO: BE 연동 후 mock 제거. CompanyDef 의 상수를 사용해 초기 시드를 만든다.
const SEED_CONSTRUCTORS: CompanyItem[] = [
  { id: CompanyDef.GS_EnC,   type: 'constructor', name: CompanyDef.GS_EnC_STR,   code: 'GS_ENC',   managers: [] },
  { id: CompanyDef.Hyundai,  type: 'constructor', name: CompanyDef.Hyundai_STR,  code: 'HYUNDAI',  managers: [] },
  { id: CompanyDef.Lotte,    type: 'constructor', name: CompanyDef.Lotte_STR,    code: 'LOTTE',    managers: [] },
  { id: CompanyDef.Samsung,  type: 'constructor', name: CompanyDef.Samsung_STR,  code: 'SAMSUNG',  managers: [] },
  { id: CompanyDef.HDC,      type: 'constructor', name: CompanyDef.HDC_STR,      code: 'HDC',      managers: [] },
  { id: CompanyDef.Doosan,   type: 'constructor', name: CompanyDef.Doosan_STR,   code: 'DOOSAN',   managers: [] },
  { id: CompanyDef.Daewoo,   type: 'constructor', name: CompanyDef.Daewoo_STR,   code: 'DAEWOO',   managers: [] },
  { id: CompanyDef.Posco,    type: 'constructor', name: CompanyDef.Posco_STR,    code: 'POSCO',    managers: [] },
  { id: CompanyDef.DL,       type: 'constructor', name: CompanyDef.DL_STR,       code: 'DL',       managers: [] },
  { id: CompanyDef.SK,       type: 'constructor', name: CompanyDef.SK_STR,       code: 'SK',       managers: [] },
  { id: CompanyDef.Woomi,    type: 'constructor', name: CompanyDef.Woomi_STR,    code: 'WOOMI',    managers: [] },
];

const SEED_HOMENETS: CompanyItem[] = [
  { id: CompanyDef.Kocom,     type: 'homenet', name: CompanyDef.Kocom_STR,     code: 'KOCOM',     managers: [] },
  { id: CompanyDef.Zigbang,   type: 'homenet', name: CompanyDef.Zigbang_STR,   code: 'ZIGBANG',   managers: [] },
  { id: CompanyDef.Commax,    type: 'homenet', name: CompanyDef.Commax_STR,    code: 'COMMAX',    managers: [] },
  { id: CompanyDef.HT,        type: 'homenet', name: CompanyDef.HT_STR,        code: 'HT',        managers: [] },
  { id: CompanyDef.Kyungdong, type: 'homenet', name: CompanyDef.Kyungdong_STR, code: 'KYUNGDONG', managers: [] },
  { id: CompanyDef.SJI,       type: 'homenet', name: CompanyDef.SJI_STR,       code: 'SJI',       managers: [] },
  { id: CompanyDef.Haion,     type: 'homenet', name: CompanyDef.Haion_STR,     code: 'HAION',     managers: [] },
  { id: CompanyDef.Jinsung,   type: 'homenet', name: CompanyDef.Jinsung_STR,   code: 'JINSUNG',   managers: [] },
];

// 트리 한 행 — React.memo 로 prop 안 바뀐 행 재렌더 회피.
interface CompanyTreeNodeProps {
  item: CompanyItem;
  onEdit: (item: CompanyItem) => void;
  onDelete: (item: CompanyItem) => void;
  onDoubleClick?: (item: CompanyItem) => void;   // 행 더블클릭 시 호출 (보통 수정 모달).
}
const CompanyTreeNode = memo(({ item, onEdit, onDelete, onDoubleClick }: CompanyTreeNodeProps) => {
  return (
    <div
      onDoubleClick={() => onDoubleClick?.(item)}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', cursor: onDoubleClick ? 'pointer' : 'default' }}
    >
      <span>
        <Text strong>{item.name}</Text>
        <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
          [id={item.id}, {item.code}]
        </Text>
        {item.managers.length > 0 && (
          <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
            · 담당자 {item.managers.length}명
          </Text>
        )}
      </span>
      <Space size={4} onClick={(e) => e.stopPropagation()}>
        {/* <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(item)}>
          수정
        </Button> */}
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => onDelete(item)}>
          삭제
        </Button>
      </Space>
    </div>
  );
});
CompanyTreeNode.displayName = 'CompanyTreeNode';

const ConstructorTab: React.FC = () => {
  const [constructors, setConstructors] = useState<CompanyItem[]>(SEED_CONSTRUCTORS);
  const [homenets, setHomenets] = useState<CompanyItem[]>(SEED_HOMENETS);
  // 등록/수정 모달 상태.
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalTarget, setModalTarget] = useState<CompanyItem | null>(null);
  const [defaultType, setDefaultType] = useState<CompanyType>('constructor');

  // 동일 type 안에서 다음 id 부여. 단순 max+1 (BE 연동 전 mock 용).
  const nextId = (list: CompanyItem[]) =>
    list.reduce((max, it) => Math.max(max, it.id), 0) + 1;

  // 핸들러 — useCallback 으로 안정 참조 유지 (React.memo 가 prop 비교에 의존).
  const handleEdit = useCallback((item: CompanyItem) => {
    setEditMode(true);
    setModalTarget(item);
    setModalOpen(true);
  }, []);

  // TODO: BE 연동. 컨트롤러에서 참조 중인 업체는 막아야 할 수도 있음.
  const handleDelete = useCallback((item: CompanyItem) => {
    if (item.type === 'constructor') {
      setConstructors((prev) => prev.filter((c) => c.id !== item.id));
    } else {
      setHomenets((prev) => prev.filter((c) => c.id !== item.id));
    }
    message.success(`삭제됨: ${item.name}`);
  }, []);

  const handleAdd = () => {
    setEditMode(false);
    setModalTarget(null);
    setDefaultType('constructor');
    setModalOpen(true);
  };

  const handleModalOk = (values: CompanyFormValues, editingId?: number) => {
    if (editingId !== undefined) {
      // edit — 종류 변경 불가 가정. 같은 type 의 list 에서 갱신.
      const updater = (prev: CompanyItem[]) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...values } : c));
      if (values.type === 'constructor') setConstructors(updater);
      else setHomenets(updater);
      message.success('수정되었습니다.');
    } else {
      // add — 선택된 type 의 list 에 새 row 추가.
      const list = values.type === 'constructor' ? constructors : homenets;
      const newItem: CompanyItem = { id: nextId(list), ...values };
      if (values.type === 'constructor') setConstructors((prev) => [...prev, newItem]);
      else setHomenets((prev) => [...prev, newItem]);
      message.success('추가되었습니다.');
    }
    setModalOpen(false);
  };

  // 트리용 데이터 변환. 단일 레벨이라 각 row 가 곧 root.
  const makeTreeData = (items: CompanyItem[]): DataNode[] =>
    items.map((it) => ({ key: `${it.type}-${it.id}`, title: '', isLeaf: true, item: it } as DataNode & { item: CompanyItem }));

  const constructorTree = useMemo(() => makeTreeData(constructors), [constructors]);
  const homenetTree = useMemo(() => makeTreeData(homenets), [homenets]);

  const renderTitle = useCallback(
    (node: DataNode) => {
      const item = (node as DataNode & { item: CompanyItem }).item;
      return <CompanyTreeNode item={item} onEdit={handleEdit} onDelete={handleDelete} onDoubleClick={handleEdit}/>;
    },
    [handleEdit, handleDelete],
  );

  return (
    <div style={{ padding: 16 }}>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Title level={5} style={{ marginTop: 0 }}>건설사 ({constructors.length})</Title>
          <Tree
            treeData={constructorTree}
            blockNode
            selectable={false}
            titleRender={renderTitle}
          />
        </Col>
        <Col xs={24} md={12}>
          <Title level={5} style={{ marginTop: 0 }}>홈넷사 ({homenets.length})</Title>
          <Tree
            treeData={homenetTree}
            blockNode
            selectable={false}
            titleRender={renderTitle}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          업체 등록
        </Button>
      </div>

      <CompanyNodeModal
        open={modalOpen}
        editMode={editMode}
        target={modalTarget}
        defaultType={defaultType}
        onCancel={() => setModalOpen(false)}
        onOk={handleModalOk}
      />
    </div>
  );
};

export default ConstructorTab;
