import { useState } from 'react';
import { Checkbox, Typography } from 'antd';
import { SettingRow } from '../SystemSetting';

const { Text } = Typography;

const AlertTab: React.FC = () => {
  // TODO: 백엔드 setting 추가되면 SystemSetting 의 values/setOne 으로 전환.
  const [notifyDevice, setNotifyDevice] = useState<boolean>(true);
  const [notifyEvent, setNotifyEvent] = useState<boolean>(true);
  const [notifyUnauth, setNotifyUnauth] = useState<boolean>(true);

  return (
    <div>
      <SettingRow label="알림 설정">
        <div style={{ display: 'flex', gap: 24, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Checkbox checked={notifyDevice} onChange={(e) => setNotifyDevice(e.target.checked)}>
            장비
          </Checkbox>
          <Text type="secondary">/</Text>
          <Checkbox checked={notifyEvent} onChange={(e) => setNotifyEvent(e.target.checked)}>
            이벤트
          </Checkbox>
          <Text type="secondary">/</Text>
          <Checkbox checked={notifyUnauth} onChange={(e) => setNotifyUnauth(e.target.checked)}>
            비인가 로그
          </Checkbox>
        </div>
      </SettingRow>
    </div>
  );
};

export default AlertTab;
