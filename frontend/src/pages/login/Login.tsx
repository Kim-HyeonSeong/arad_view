import { useState } from 'react';
import { Button, Card, Form, Input, message  } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setUserInfo } from '../../services/Service';
import { loginFailure, loginSuccess } from '../../stores/slices/authSlice';
import { useAppDispatch } from '../../stores/hooks';
import logo from '../../assets/images/arad_logo_1.png';
import * as CstDef from '../../commons/CstDef';
import * as CvtAccountsCmd from '../../bulk_cmd/convert/account/ConvertAccountCmd';
import * as CvtSysset from '../../bulk_cmd/convert/sysset/ConvertSyssetCmd';
import { applyCmd } from '../../bulk_cmd/api/ApplyCmdList';
import type { LoginResponse } from '../../bulk_cmd/api/account/BulkCmdApiAccount';
import ChangePw from './logins/ChangePw';
import { useLocations } from '../../commons/LocationContext';

const DEFAULT_EXPIRE_DAYS = 90;

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // 로그인 직후 location 트리를 즉시 불러오기 위한 트리거.
  const { refetch: refetchLocations } = useLocations();

  const [form] = Form.useForm<LoginForm>();
  const [changePwOpen, setChangePwOpen] = useState(false);
  // 'initial' : 428 분기 (토큰 없음, /initial-password-change 만 가능, 연기 불가)
  // 'expired' : 200 + password_expired=true 분기 (토큰 있음, /change-password 또는 /password/defer)
  const [changePwMode, setChangePwMode] = useState<'initial' | 'expired' | null>(null);
  const [pendingUsername, setPendingUsername] = useState<string>('');
  const [pendingPassword, setPendingPassword] = useState<string>('');
  // 비밀번호 만료/연기 알림 일수. backend setting auth.password.expire_days 와 동기화.
  // 만료 분기에서 토큰 받은 직후 fetch 하여 갱신; 그 외엔 default 사용.
  const [expireDays, setExpireDays] = useState<number>(DEFAULT_EXPIRE_DAYS);

  const getLogin = async () => {
    const values = form.getFieldsValue();

    // 비밀번호는 평문으로 전송 (HTTPS로 보호, 백엔드가 bcrypt 비교)
    const cmd = CvtAccountsCmd.getLoginToBulkCmd(values.username, values.password);
    const ret = await applyCmd(cmd);

    // 428: 초기 강제 변경 분기 — 토큰 없음. /initial-password-change 로만 변경 가능.
    if (ret.result === CstDef.BULK_PROC_PASSWORD_CHANGE_REQUIRED) {
      setPendingUsername(values.username);
      setPendingPassword(values.password);
      setChangePwMode('initial');
      setChangePwOpen(true);
      return;
    }

    if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
      message.error(ret.msg || '로그인에 실패했습니다.');
      dispatch(loginFailure());
      return;
    }

    const data = ret.data as LoginResponse | null;
    if (!data?.access_token || !data?.refresh_token) {
      message.error('로그인 응답이 비어있습니다.');
      dispatch(loginFailure());
      return;
    }

    // 토큰 저장
    sessionStorage.setItem('access_token', data.access_token);
    sessionStorage.setItem('refresh_token', data.refresh_token);

    // JWT payload에서 사용자 정보 추출 (sub=user_id, username=이름, role=권한)
    try {
      const claims = JSON.parse(atob(data.access_token.split('.')[1]));
      setUserInfo({
        id: claims.sub,
        name: claims.username ?? '',
        perm: claims.role,
      });
    } catch (e) {
      console.error('Failed to parse JWT:', e);
    }

    dispatch(loginSuccess({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    }));

    // 200 + password_expired=true: 만료 분기 — 토큰 발급됐으나 모달로 변경/연기 선택.
    if (data.password_expired) {
      // 모달의 "다음에 변경 (N일 뒤)" 표시를 위해 setting 값 fetch.
      // 토큰이 sessionStorage 에 저장된 직후라 AuthRequired 통과.
      try {
        const settingCmd = CvtSysset.getSyssetOneInfoToBulkCmd('auth.password.expire_days');
        const settingRet = await applyCmd(settingCmd);
        if (settingRet.result === CstDef.BULK_PROC_SUCCESS && settingRet.data) {
          const days = parseInt((settingRet.data as { value?: string }).value ?? '', 10);
          if (!isNaN(days)) setExpireDays(days);
        }
      } catch (e) {
        console.warn('Failed to fetch auth.password.expire_days, using default:', e);
      }

      setPendingUsername(values.username);
      setPendingPassword(values.password);
      setChangePwMode('expired');
      setChangePwOpen(true);
      return;
    }

    // 로그인 성공 — 인증된 상태로 location 트리 즉시 갱신 (인증 전 첫 fetch 가 401 로 비어있을 수 있음).
    refetchLocations();
    navigate('/dashboard');
  };

  const handleChangePwConfirm = async (newPassword: string) => {
    // mode 에 따라 호출 endpoint 가 다름.
    const cmd =
      changePwMode === 'initial'
        ? CvtAccountsCmd.getInitPwChange(pendingUsername, pendingPassword, newPassword)
        : CvtAccountsCmd.getChangePwToBulkCmd(pendingPassword, newPassword);
    const ret = await applyCmd(cmd);

    if (ret.result === CstDef.BULK_PROC_SUCCESS) {
      // 양쪽 다 token_version 증가 → 현재 AT 무효화. 세션 비우고 재로그인 유도.
      sessionStorage.clear();
      message.info('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      setChangePwOpen(false);
      setChangePwMode(null);
      setPendingPassword('');
      form.resetFields(['password']);
    } else {
      message.error(ret.msg || '비밀번호 변경에 실패했습니다.');
    }
  };

  const handleChangePwPostpone = async () => {
    // expired 분기에서만 호출 (initial 분기는 모달 체크박스 숨김으로 차단).
    const cmd = CvtAccountsCmd.getPassChangePwToBulkCmd();
    const ret = await applyCmd(cmd);

    if (ret.result === CstDef.BULK_PROC_SUCCESS) {
      message.info('비밀번호 변경이 연기되었습니다.');
      setChangePwOpen(false);
      setChangePwMode(null);
      setPendingPassword('');
      // defer 는 token_version 증가 없음 → 현재 AT 유효 → location 트리 갱신 + 대시보드 이동.
      refetchLocations();
      navigate('/dashboard');
    } else {
      message.error(ret.msg || '비밀번호 변경 연기에 실패했습니다.');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#A3BCE1',
      }}
    >
      <Card style={{ width: 400 }}>
        <div
          style={{
            textAlign: 'center',
            marginBottom: 24,
            marginTop: 8,
          }}
        >
          <img
            src={logo}
            alt="ARAD VIEW"
            style={{ height: 60, marginBottom: 12 }}
          />
          <h2 style={{ margin: 0, color: '#171C61' }}>ARAD View Server</h2>
        </div>
        <Form<LoginForm> form={form} onFinish={getLogin} layout="vertical" size="large" autoComplete="off">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '아이디를 입력해주세요' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="아이디" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" autoComplete="off" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block>
              로그인
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
          padding: '16px 0',
          backgroundColor:'#F5F5F5',
          color: '#171C61',
          fontSize: 13,
        }}
      >
        ARAD View ©{new Date().getFullYear()} Created by Arad
      </div>

      <ChangePw
        open={changePwOpen}
        canPostpone={changePwMode === 'expired'}
        elapsedDays={expireDays}
        nextRemindDays={expireDays}
        onConfirm={handleChangePwConfirm}
        onPostpone={handleChangePwPostpone}
        onCancel={() => setChangePwOpen(false)}
      />
    </div>
  );
};

export default Login;
