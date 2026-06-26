import { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, Typography } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

export type CompanyType = 'constructor' | 'homenet';

export interface CompanyManager {
  name: string;
  position: string;
  phone: string;
}

export interface CompanyItem {
  id: number;
  type: CompanyType;
  name: string;
  code: string;
  managers: CompanyManager[];
}

export interface CompanyFormValues {
  type: CompanyType;
  name: string;
  code: string;
  managers: CompanyManager[];
}

interface CompanyNodeModalProps {
  open: boolean;
  editMode: boolean;
  target?: CompanyItem | null;       // edit 모드의 현재 행
  defaultType?: CompanyType;          // add 모드 진입 시 prefill 될 종류
  onCancel: () => void;
  onOk: (values: CompanyFormValues, editingId?: number) => void;
}

const { Text } = Typography;

const CompanyNodeModal: React.FC<CompanyNodeModalProps> = ({
  open,
  editMode,
  target,
  defaultType = 'constructor',
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm<CompanyFormValues>();

  useEffect(() => {
    if (!open) return;
    if (editMode && target) {
      form.setFieldsValue({
        type: target.type,
        name: target.name,
        code: target.code,
        managers: target.managers ?? [],
      });
    } else {
      form.resetFields();
      form.setFieldValue('type', defaultType);
      form.setFieldValue('managers', []);
    }
  }, [open, editMode, target, defaultType, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    onOk(values, editMode ? target?.id : undefined);
  };

  const titleText = editMode
    ? `업체 수정 — ${target?.name ?? ''}`
    : '업체 추가';

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
      width={640}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="종류"
          rules={[{ required: true, message: '종류를 선택하세요' }]}
        >
          <Select
            disabled={editMode}
            options={[
              { value: 'constructor', label: '건설사' },
              { value: 'homenet', label: '홈넷사' },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="이름"
          rules={[{ required: true, message: '이름을 입력하세요' }]}
        >
          <Input placeholder="예: GS건설" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="code"
          label="코드 (UNIQUE)"
          rules={[{ required: true, message: '코드를 입력하세요' }]}
        >
          <Input placeholder="예: GS_ENC" autoComplete="off" />
        </Form.Item>

        {/* 담당자 sub-table — Form.List 로 동적 필드 배열 관리. */}
        <Text strong style={{ display: 'block', marginBottom: 8 }}>담당자</Text>
        <Form.List name="managers">
          {(fields, { add, remove }) => (
            <div>
              {fields.length > 0 && (
                <Row gutter={8} style={{ marginBottom: 4, color: '#999', fontSize: 12 }}>
                  <Col span={7}>이름</Col>
                  <Col span={6}>직급</Col>
                  <Col span={9}>전화번호</Col>
                  <Col span={2}></Col>
                </Row>
              )}
              {fields.map(({ key, name }) => (
                <Row key={key} gutter={8} align="top" style={{ marginBottom: 4 }}>
                  <Col span={7}>
                    <Form.Item name={[name, 'name']} noStyle
                      rules={[{ required: true, message: '이름' }]}>
                      <Input placeholder="이름" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item name={[name, 'position']} noStyle
                      rules={[{ required: true, message: '직급' }]}>
                      <Input placeholder="직급" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={9}>
                    <Form.Item name={[name, 'phone']} noStyle
                      rules={[{ required: true, message: '전화번호' }]}>
                      <Input placeholder="010-1234-5678" autoComplete="off" />
                    </Form.Item>
                  </Col>
                  <Col span={2} style={{ textAlign: 'center' }}>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                    />
                  </Col>
                </Row>
              ))}
              <Button
                type="dashed"
                onClick={() => add({ name: '', position: '', phone: '' })}
                icon={<PlusOutlined />}
                block
                style={{ marginTop: 4 }}
              >
                담당자 추가
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CompanyNodeModal;
