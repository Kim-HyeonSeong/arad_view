import { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Row, Col } from 'antd';
import type { RegionItem } from './RegionTab';
import type { Cmd } from '../../../../commons/Types';
import * as CvtLocationCmd from '../../../../bulk_cmd/convert/location/ConvertLocationCmd';
import BulkCmdList from '../../../../bulk_cmd/convert/BulkCmdList';

export interface RegionFormValues {
  parent_id: number | null;
  name: string;
  code: string;
  lat: number;
  lng: number;
}

interface RegionNodeModalProps {
  open: boolean;
  editMode: boolean;
  // edit 모드: 현재 노드. add 모드: 부모로 지정된 노드 (parent_id 자동 설정).
  target?: RegionItem | null;
  // 부모 dropdown 옵션 — 보통 전체 노드 목록 (사이클 방지는 BE 또는 추가 검증으로).
  allItems: RegionItem[];
  onCancel: () => void;
  onSuccess?: () => void;
}

const RegionNodeModal: React.FC<RegionNodeModalProps> = ({ open, editMode, target, allItems, onCancel, onSuccess }) => {
  const [form] = Form.useForm<RegionFormValues>();
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cmdList, setCmdList] = useState<Cmd[]>([]);

  useEffect(() => {
    if (!open) return;
    if (editMode && target) {
      // 현재 노드 값으로 prefill.
      form.setFieldsValue({
        parent_id: target.parent_id,
        name: target.name,
        code: target.code,
        lat: target.lat,
        lng: target.lng,
      });
    } else {
      // add 모드: 클릭한 노드를 부모로 박고 나머지는 비움.
      form.resetFields();
      if (target) {
        form.setFieldValue('parent_id', target.id);
      }
    }
  }, [open, editMode, target, form]);

  // 부모 dropdown 옵션. edit 모드에서 자기 자신은 부모 후보에서 제외 (즉시 사이클 방지).
  const parentOptions = allItems
    .filter((it) => !(editMode && target && it.id === target.id))
    .map((it) => ({ value: it.id, label: `${it.name} [id=${it.id}]` }));

  const handleOk = async () => {
    const values = await form.validateFields();
    const list: Cmd[] = [];
    if (editMode) {
        const modifyValues = { ...values, id: target?.id };
        list.push(CvtLocationCmd.getLocationModifyToBulkCmd(modifyValues));
    } else {
        list.push(CvtLocationCmd.getLocationCreateToBulkCmd(values));
    }

    setCmdList(list);
    setBulkModalOpen(true);
  };

  const handleBulkClose = () => {
    setBulkModalOpen(false);
  };

  // BulkCmdList 성공 시 — 부모 refetch + 외곽 RegionNodeModal 까지 닫음.
  // 수동 닫기 (handleBulkClose) 와 분리: 실패/취소 시엔 입력값을 잃지 않도록 RegionNodeModal 유지.
  const handleBulkSuccess = () => {
    onSuccess?.();
    onCancel();
  };

  const titleText = editMode
    ? `위치 수정 — ${target?.name ?? ''}`
    : `위치 추가 — 부모: ${target?.name ?? '(없음)'}`;

  return (
    <Modal
      title={titleText}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="저장"
      cancelText="취소"
      centered
      destroyOnHidden
      width={480}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="parent_id" label="부모 노드">
          <Select
            // add 모드는 부모가 고정 (클릭한 노드). edit 은 변경 가능.
            disabled={true}
            options={parentOptions}
            placeholder="부모 노드를 선택하세요"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="이름"
          rules={[{ required: true, message: '이름을 입력하세요' }]}
        >
          <Input placeholder="예: 역삼동" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="code"
          label="코드 (UNIQUE)"
          rules={[{ required: true, message: '코드를 입력하세요' }]}
        >
          <Input placeholder="예: DISTRICT_SEOUL_GANGNAM_YEOKSAM" autoComplete="off" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="lat"
              label="위도"
              rules={[{ required: true, message: '위도를 입력하세요' }]}
            >
              <InputNumber style={{ width: '100%' }} step={0.0001} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lng"
              label="경도"
              rules={[{ required: true, message: '경도를 입력하세요' }]}
            >
              <InputNumber style={{ width: '100%' }} step={0.0001} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <BulkCmdList
          open={bulkModalOpen}
          cmdList={cmdList}
          onClose={handleBulkClose}
          onSuccess={handleBulkSuccess}
      />
    </Modal>
  );
};

export default RegionNodeModal;
