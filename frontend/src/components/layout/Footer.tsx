import { useState, useEffect, useRef } from 'react';
import { Layout, Checkbox, Typography, message } from 'antd';
import { applyCmd } from '../../bulk_cmd/api/ApplyCmdList';
import * as CvtAccountsCmd from '../../bulk_cmd/convert/account/ConvertAccountCmd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

// 자동 로그아웃 타임아웃 (초)
const AUTO_LOGOUT_SEC = 10 * 60;  // 10분

const formatTime = (sec: number) => {
  const safe = Math.max(0, sec);
  const m = Math.floor(safe / 60).toString().padStart(2, '0');
  const s = (safe % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const Footer: React.FC = () => {
  // 기본 ON. 사용자가 체크 해제하면 자동 로그아웃 비활성화.
  const [enabled, setEnabled] = useState<boolean>(true);
  const [remaining, setRemaining] = useState(AUTO_LOGOUT_SEC);
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled) {
      // 해제 → 타이머 리셋. 다음 활성화 시 다시 카운트다운 시작.
      setRemaining(AUTO_LOGOUT_SEC);
      return;
    }

    lastActivityRef.current = Date.now();
    setRemaining(AUTO_LOGOUT_SEC);

    // 사용자 활동 감지 → 마지막 활동 시각 갱신 (ref 만 업데이트, re-render 없음).
    // mousemove 외에 keydown / click 도 포함 — 폼 입력 중에도 활동으로 인정.
    const handleActivity = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    // 1초마다 남은 시간 계산
    const interval = setInterval(async () => {
      const elapsed = Math.floor((Date.now() - lastActivityRef.current) / 1000);
      const newRemaining = AUTO_LOGOUT_SEC - elapsed;

      if (newRemaining <= 0) {
        clearInterval(interval);
        window.removeEventListener('mousemove', handleActivity);
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('click', handleActivity);
        await doAutoLogout();
        return;
      }
      setRemaining(newRemaining);
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [enabled]);

  const doAutoLogout = async () => {
    try {
      const cmd = CvtAccountsCmd.getLogOutToBulkCmd();
      await applyCmd(cmd);
    } catch {
      // 백엔드 호출 실패해도 로컬 정리는 진행
    }
    message.info('비활동으로 자동 로그아웃되었습니다.');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('user_info');
    // 메시지 잠깐 보여준 후 이동
    setTimeout(() => {
      window.location.href = '/#/login';
    }, 800);
  };

  return (
    <AntFooter style={{ position: 'relative', textAlign: 'center', padding: '16px 24px' }}>
      ARAD View ©{new Date().getFullYear()} Created by Arad
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Checkbox checked={enabled} onChange={(e) => setEnabled(e.target.checked)}>
          자동 로그아웃
        </Checkbox>
        {enabled && (
          <Text style={{ fontFamily: 'monospace', minWidth: 48 }}>
            {formatTime(remaining)}
          </Text>
        )}
      </div>
    </AntFooter>
  );
};

export default Footer;
