import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import * as CstDef from '../../../commons/CstDef';
import * as SelOpt from '../../../commons/SpnTypeList';
import { getDigestPassword } from '../../../services/Service';
import * as CvtAccCmd from '../../../bulk_cmd/convert/account/ConvertAccountCmd';
import type { Cmd } from '../../../commons/Types';
import BulkCmdList from '../../../bulk_cmd/convert/BulkCmdList';

interface AccountModalProps {
  open: boolean;
  editMode: boolean;
  initialValues?: {
    id: number;
    admin_id: string;
    admin_name: string;
    permission: number;
    phone: string;
  } | null;
  onOk: (values: AccountFormValues) => void;
  onCancel: () => void;
}

export interface AccountFormValues {
  id ?: number;
  admin_id: string;
  admin_name: string;
  password?: string;
  confirm_password?: string;
  permission: number;
  phone: string;
}

const AccountModal: React.FC<AccountModalProps> = ({ open, editMode, initialValues, onOk, onCancel }) => {
  const [form] = Form.useForm<AccountFormValues>();
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cmdList, setCmdList] = useState<Cmd[]>([]);

  useEffect(() => {
    if (open) {
      if (editMode && initialValues) {
        form.setFieldsValue({
          id : initialValues.id,
          admin_id: initialValues.admin_id,
          admin_name: initialValues.admin_name,
          permission: initialValues.permission,
          phone: initialValues.phone,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editMode, initialValues, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    delete values.confirm_password;

    if (values.password) {
      values.password = await getDigestPassword(values.password);
    } else {
      delete values.password;
    }

    const list: Cmd[] = [];
    if (editMode) {
      const modifyValues = { ...values, id: initialValues?.id };
      list.push(CvtAccCmd.getAccountModifyToBulkCmd(modifyValues));
    } else {
      list.push(CvtAccCmd.getAccountCreateToBulkCmd(values));
    }
    setCmdList(list);
    setBulkModalOpen(true);
  };

  const handleBulkClose = () => {
    setBulkModalOpen(false);
    onOk({} as AccountFormValues);
  };

  return (
    <Modal
      title={editMode ? '계정 수정' : '계정 생성'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={editMode ? '수정' : '생성'}
      cancelText="취소"
      destroyOnClose
    >
      <Form form={form} layout="vertical" autoComplete="off" style={{ marginTop: 16 }}>
        <Form.Item
          name="admin_id"
          label="ID"
          rules={[
            { required: true, message: 'ID를 입력해주세요' },
            { min: 4, max: 12, message: '4~12자리로 입력해주세요' },
            { pattern: /^[a-zA-Z0-9]+$/, message: '영문, 숫자만 사용 가능합니다' },
          ]}
        >
          <Input placeholder="4~12자리 영문, 숫자" disabled={editMode} />
        </Form.Item>

        <Form.Item
          name="admin_name"
          label="이름"
          rules={[
            { required: true, message: '이름을 입력해주세요' },
            { min: 3, max: 12, message: '3~12자리로 입력해주세요' },
          ]}
        >
          <Input placeholder="3~12자리" />
        </Form.Item>

        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            { required: !editMode, message: '비밀번호를 입력해주세요' },
            { min: 8, max: 12, message: '8~12자리로 입력해주세요' },
            {
              pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,12}$/,
              message: '문자, 숫자, 특수문자를 조합해주세요',
            },
          ]}
        >
          <Input.Password placeholder="8~12자리 문자, 숫자, 특수문자 조합" />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="비밀번호 확인"
          dependencies={['password']}
          rules={[
            { required: !editMode, message: '비밀번호를 다시 입력해주세요' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('비밀번호가 일치하지 않습니다'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="비밀번호 재입력" />
        </Form.Item>

        <Form.Item
          name="permission"
          label="권한"
          rules={[{ required: true, message: '권한을 선택해주세요' }]}
        >
          <Select placeholder="권한 선택">
            {SelOpt.AllAdminPermList.map((item) => (
              <Select.Option key={item.value} value={item.value} disabled={item.value === CstDef.ADMIN_PERM_ADMINISTRATOR}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="phone"
          label="전화번호"
          rules={[
            { message: '전화번호를 입력해주세요' },
            { pattern: /^[\d-]+$/, message: '숫자와 -만 입력 가능합니다' },
          ]}
        >
          <Input placeholder="010-0000-0000" />
        </Form.Item>
      </Form>

      <BulkCmdList
        open={bulkModalOpen}
        cmdList={cmdList}
        onClose={handleBulkClose}
      />
    </Modal>
  );
};

export default AccountModal;
