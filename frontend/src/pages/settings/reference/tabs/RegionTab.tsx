import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Tree, Button, Space, Typography, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import RegionNodeModal, { type RegionFormValues } from './RegionNodeModal';
import * as CstDef from '../../../../commons/CstDef';
import { applyCmd } from '../../../../bulk_cmd/api/ApplyCmdList';
import type { Cmd } from '../../../../commons/Types';
import * as CvtLocationCmd from '../../../../bulk_cmd/convert/location/ConvertLocationCmd';
import BulkCmdList, { type ExecutedCmd } from '../../../../bulk_cmd/convert/BulkCmdList';

const { Text } = Typography;

// 백엔드 응답 1건 — flat 리스트 형태. parent_id 로 계층 구성.
export interface RegionItem {
  id: number;
  parent_id: number | null;
  name: string;
  code: string;     // 루트=ISO ("KR") / 광역="REGION_*" / 시군구="DISTRICT_*"
  lat: number;
  lng: number;
}

// 트리 한 행의 표시. React.memo 로 감싸 부모 재렌더 시 prop 안 바뀐 행은 재렌더 회피.
// onAdd/onEdit/onDelete 는 부모에서 useCallback 으로 안정화된 참조여야 효과 있음.
interface RegionTreeNodeProps {
  item: RegionItem;
  onAdd: (item: RegionItem) => void;
  onEdit: (item: RegionItem) => void;
  onDelete: (item: RegionItem) => void;
  onDoubleClick?: (item: RegionItem) => void;   // 행 더블클릭 시 호출 (보통 수정 모달).
}
const RegionTreeNode = memo(({ item, onAdd, onDelete, onDoubleClick }: RegionTreeNodeProps) => {
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
      </span>
      <Space size={4} onClick={(e) => e.stopPropagation()}>
        <Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={() => onAdd(item)}>
          추가
        </Button>
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
RegionTreeNode.displayName = 'RegionTreeNode';

// flat 리스트를 antd Tree 가 받아먹는 DataNode[] 로 변환.
// titleRender 로 액션 버튼을 그리기 위해 원본 RegionItem 을 그대로 보존 (key 외에 별도 필드 안 씀).
function buildTree(items: RegionItem[]): DataNode[] {
  const byId = new Map<number, DataNode & { item: RegionItem }>();
  items.forEach((it) => {
    byId.set(it.id, { key: it.id, title: '', children: [], item: it });
  });
  const roots: DataNode[] = [];
  items.forEach((it) => {
    const node = byId.get(it.id)!;
    if (it.parent_id === null) {
      roots.push(node);
    } else {
      const parent = byId.get(it.parent_id);
      if (parent) {
        (parent.children as DataNode[]).push(node);
      } else {
        // parent_id 가 미존재 — 데이터 무결성 깨졌지만 화면은 죽지 않게 루트로 끌어올림.
        roots.push(node);
      }
    }
  });
  return roots;
}

const RegionTab: React.FC = () => {
  const [items, setItems] = useState<RegionItem[]>([]);
  // 모달 상태 — add/edit 공유 모달 1개.
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [modalTarget, setModalTarget] = useState<RegionItem | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cmdList, setCmdList] = useState<Cmd[]>([]);

  const treeData = useMemo(() => buildTree(items), [items]);
  // 초기엔 대한민국(root) + 서울특별시 만 펼침. 그 외 광역은 사용자가 직접 펼치도록.
  const defaultExpandedKeys = useMemo(() => {
    const keys: number[] = [];
    const root = items.find((it) => it.parent_id === null);
    if (root) keys.push(root.id);
    const seoul = items.find((it) => it.code === 'REGION_SEOUL');
    if (seoul) keys.push(seoul.id);
    return keys;
  }, [items]);

  const getLocationData = async () => {
      const cmd = CvtLocationCmd.getLocationShowAllToBulkCmd();
      const ret = await applyCmd(cmd);

      if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
          message.error(ret.msg || '지역 데이터를 불러오는데 실패했습니다.');
          return;
      }

      // 응답 shape: { items: RegionItem[], total: number }
      const locationData = ret.data as { items?: RegionItem[]; total?: number } | null;
      setItems(locationData?.items ?? []);
  }

  // 핸들러는 useCallback 으로 안정화 — RegionTreeNode 의 React.memo 가 제대로 동작하려면 prop 참조가 안 바뀌어야 함.
  const handleAddChild = useCallback((parent: RegionItem) => {
    setEditMode(false);
    setModalTarget(parent);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((record: RegionItem) => {
    setEditMode(true);
    setModalTarget(record);
    setModalOpen(true);
  }, []);

  // TODO: BE 연동. 자식 노드가 있으면 막아야 할 수도 있음 (정책 확정 후).
  const handleDelete = useCallback((record: RegionItem) => {
    //하위 노드가 있을 경우 알림으로 하위노드가 있어서 삭제가 불가라고 알림
    const hasChildren = items.some((it) => it.parent_id === record.id);
    if (hasChildren) {
      message.warning('하위 노드가 존재하여 삭제할 수 없습니다.');
      return;
    }
    
    const cmd = CvtLocationCmd.getLocationDeleteToBulkCmd(record.id);
    setCmdList([cmd]);
    setBulkModalOpen(true);
  }, []);

  // titleRender 도 useCallback — items 가 안 바뀌면 같은 참조 유지.
  const renderTitle = useCallback(
    (node: DataNode) => {
      const item = (node as DataNode & { item: RegionItem }).item;
      return (
        <RegionTreeNode
          item={item}
          onAdd={handleAddChild}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDoubleClick={handleEdit}
        />
      );
    },
    [handleAddChild, handleEdit, handleDelete],
  );

  const handleBulkClose = () => {
      setBulkModalOpen(false);
      setModalOpen(false);
  };

  const handleBulkSuccess = (executed: ExecutedCmd[]) => {
      getLocationData();
  };

  useEffect(() => {
    getLocationData();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      {/* items 가 채워진 뒤에야 Tree 마운트 — defaultExpandedKeys 가 빈 배열로 굳지 않게. */}
      {items.length > 0 && (
      <Tree
        treeData={treeData}
        defaultExpandedKeys={defaultExpandedKeys}
        showLine
        blockNode
        selectable={false}
        titleRender={renderTitle}
      />
      )}

      <RegionNodeModal
        open={modalOpen}
        editMode={editMode}
        target={modalTarget}
        allItems={items}
        onCancel={() => setModalOpen(false)}
        onSuccess={getLocationData}
      />

      <BulkCmdList
          open={bulkModalOpen}
          cmdList={cmdList}
          onClose={handleBulkClose}
          onSuccess={handleBulkSuccess}
      />
    </div>
  );
};

export default RegionTab;
