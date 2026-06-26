import { useState } from 'react';
import { Layout, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, BellOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import * as CvtAccountsCmd from '../../bulk_cmd/convert/account/ConvertAccountCmd';
import * as CstDef from '../../commons/CstDef';
import { applyCmd } from '../../bulk_cmd/api/ApplyCmdList';
import { getUserName } from '../../services/Service';

const { Header: AntHeader } = Layout;

interface HeaderProps {
  background: string;
}

const Header: React.FC<HeaderProps> = ({ background }) => {
  const userName = getUserName() || '사용자';
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    let cmd = CvtAccountsCmd.getLogOutToBulkCmd();
    const ret = await applyCmd(cmd);

    if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
      console.warn('Logout API failed:', ret.msg);
    }

    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    window.location.hash = '/login';
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader style={{ padding: 0, background, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ paddingLeft: 24, fontSize: 24, fontWeight: 550 }}>
        ARAD View Server
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingRight: 60 }}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 25 }} />}
          style={{ height: 40, width: 40 }}
          onClick={() => { /* TODO: 알림 기능 */ }}
        />
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
        >
          <Button
            type="text"
            style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40 }}
          >
            <UserOutlined style={{ fontSize: 25 }} />
            {dropdownOpen && <span>{userName}</span>}
            <DownOutlined style={{ fontSize: 12 }} />
          </Button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
