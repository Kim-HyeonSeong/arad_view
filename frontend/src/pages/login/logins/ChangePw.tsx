import { useEffect, useState } from 'react';
import { Modal, Form, Input, Checkbox, Button } from 'antd';
import { ExclamationCircleFilled, WarningOutlined } from '@ant-design/icons';

interface ChangePwProps {
  open: boolean;
  /** 비밀번호 마지막 변경 후 경과 일수 (서버에서 받아옴) */
  elapsedDays?: number;
  /** 연기 선택 시 다음 알림까지 일수 */
  nextRemindDays?: number;
  /** "다음에 변경" 체크박스 노출 여부. 초기 강제 변경(428) 분기에선 false. */
  canPostpone?: boolean;
  /** 비밀번호 변경 제출 */
  onConfirm: (newPassword: string) => void;
  /** 다음에 변경 (연기) */
  onPostpone: () => void;
  /** 모달 닫기 (X 버튼 등) */
  onCancel: () => void;
}

interface FormValues {
  newPassword: string;
  confirmPassword: string;
}

// 8~14자리, 영문/숫자/특수문자 모두 포함
const PASSWORD_PATTERN =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,14}$/;

const ChangePw: React.FC<ChangePwProps> = ({
  open,
  elapsedDays = 90,
  nextRemindDays = 90,
  canPostpone = true,
  onConfirm,
  onPostpone,
  onCancel,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [postpone, setPostpone] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setPostpone(false);
    }
  }, [open, form]);

  const handleOk = async () => {
    if (postpone) {
      onPostpone();
      return;
    }
    const values = await form.validateFields();
    onConfirm(values.newPassword);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      centered
      destroyOnHidden
      width={520}
      footer={[
        <Button
          key="submit"
          type={postpone ? 'default' : 'primary'}
          block
          onClick={handleOk}
        >
          {postpone ? '다음에 변경' : '확인'}
        </Button>,
      ]}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: 16,
          background: '#FFFBE6',
          border: '1px solid #FFE58F',
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <ExclamationCircleFilled style={{ color: '#FAAD14', fontSize: 22, marginTop: 2 }} />
        <div>
          {canPostpone ? (
            <>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>비밀번호 변경 필요</div>
              <div style={{ fontSize: 13, color: '#595959' }}>
                비밀번호 유효기간 <b style={{ color: '#FA8C16' }}>{elapsedDays}일</b>이 경과했습니다. 보안을 위해 새 비밀번호로 변경해주세요.
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>최초 비밀번호 변경 필요</div>
              <div style={{ fontSize: 13, color: '#595959' }}>
                최초 로그인 시에는 비밀번호를 변경해야합니다. 보안을 위해 새 비밀번호로 변경해주세요.
              </div>
            </>
          )}
        </div>
      </div>

      <Form form={form} layout="vertical" disabled={postpone}>
        <Form.Item
          name="newPassword"
          label="새 비밀번호"
          rules={[
            { required: !postpone, message: '새 비밀번호를 입력해주세요' },
            {
              pattern: PASSWORD_PATTERN,
              message: '8~14자리 문자, 숫자, 특수문자 조합이어야 합니다',
            },
          ]}
        >
          <Input.Password placeholder="8~14자리 문자, 숫자, 특수문자 조합" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="새 비밀번호 확인"
          dependencies={['newPassword']}
          rules={[
            { required: !postpone, message: '비밀번호 확인을 입력해주세요' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('비밀번호가 일치하지 않습니다'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="비밀번호 재입력" autoComplete="new-password" />
        </Form.Item>
      </Form>

      {canPostpone && (
        <div
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            marginTop: 8,
          }}
        >
          <Checkbox checked={postpone} onChange={(e) => setPostpone(e.target.checked)}>
            다음에 변경 ({nextRemindDays}일 뒤)
          </Checkbox>
          <div style={{ marginTop: 8, fontSize: 12, color: postpone ? '#FA8C16' : '#999' }}>
            {postpone ? (
              <>
                <WarningOutlined style={{ marginRight: 4 }} />
                연기를 선택했습니다. 확인 시 대시보드로 돌아가며 {nextRemindDays}일 뒤 다시 알림이 표시됩니다.
              </>
            ) : (
              <>체크하면 비밀번호 입력 없이 넘어갑니다. {nextRemindDays}일 뒤 다시 알림이 표시됩니다.</>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ChangePw;
