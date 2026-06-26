import { useState, useEffect } from 'react';
import { Table, Typography, Input, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { applyCmd } from '../../bulk_cmd/api/ApplyCmdList';
import * as CvtAccCmd from '../../bulk_cmd/convert/account/ConvertAccountCmd';
import * as CstDef from '../../commons/CstDef';
import * as SelOpt from '../../commons/SpnTypeList';
import type { Cmd } from '../../commons/Types';
import AccountModal from './users/AccountModal';
import type { AccountFormValues } from './users/AccountModal';
import BulkCmdListModal from '../../bulk_cmd/convert/BulkCmdList';

const { Title } = Typography;

interface AccountItem {
  id: number;
  admin_id: string;
  admin_name: string;
  permission: number;
  phone: string;
  last_login_time: string;
  pw_change_time: string;
}

const getPermissionStr = (val: number): string => {
  const found = SelOpt.AllAdminPermList.find((item) => item.value === val);
  return found ? found.label : '알 수 없음';
};

// TODO: 백엔드 연동 후 삭제
const mockAccountData: AccountItem[] = [
  { id:1, admin_id: 'admin', admin_name: 'Admin', permission: CstDef.ADMIN_PERM_ADMINISTRATOR, phone: '010-1234-5678', last_login_time: '2026-04-08 09:30:00', pw_change_time: '2026-03-01 10:00:00' },
  { id:2, admin_id: 'kimhs1258', admin_name: 'Arad_Tester1', permission: CstDef.ADMIN_PERM_ADMINISTRATOR, phone: '010-2345-6789', last_login_time: '2026-04-07 14:20:00', pw_change_time: '2026-02-15 11:00:00' },
  { id:3, admin_id: 'ap2132', admin_name: 'Arad_Tester2', permission: CstDef.ADMIN_PERM_OPERATOR, phone: '010-3456-7890', last_login_time: '2026-04-06 08:15:00', pw_change_time: '2026-01-20 09:00:00' },
  { id:4, admin_id: 'bla12', admin_name: 'Arad_Master', permission: CstDef.ADMIN_PERM_OPERATOR, phone: '010-4567-8901', last_login_time: '2026-04-05 16:45:00', pw_change_time: '2026-03-10 14:00:00' },
  { id:5, admin_id: 'ren2978', admin_name: 'Arad_Pro', permission: CstDef.ADMIN_PERM_ADMINISTRATOR, phone: '010-5678-9012', last_login_time: '2026-04-04 11:30:00', pw_change_time: '2026-02-28 08:00:00' },
];

const AccountManagement: React.FC = () => {
  const [accountData, setAccountData] = useState<AccountItem[]>(mockAccountData);
  const [filteredData, setFilteredData] = useState<AccountItem[]>(mockAccountData);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pageSize, setPageSize] = useState<number>(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editRecord, setEditRecord] = useState<AccountItem | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cmdList, setCmdList] = useState<Cmd[]>([]);

  const getAllUser = async () => {
    // TODO: 백엔드 API 연동 후 응답을 setAccountData, setFilteredData에 반영
    // const cmd = CvtAccCmd.getAccountShowAllToBulkCmd();
    // const ret = await applyCmd(cmd);
    // if (ret.result === CstDef.BULK_PROC_SUCCESS) {
    //   const data = ret.data as AccountItem[];
    //   setAccountData(data);
    //   setFilteredData(data);
    // }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value) {
      setFilteredData(accountData);
      return;
    }
    const lower = value.toLowerCase();
    setFilteredData(
      accountData.filter(
        (item) =>
          item.admin_id.toLowerCase().includes(lower) ||
          item.admin_name.toLowerCase().includes(lower) ||
          item.phone.includes(value),
      ),
    );
  };

  const handleNew = () => {
    setEditMode(false);
    setEditRecord(null);
    setModalOpen(true);
  };

  const handleRowDoubleClick = (record: AccountItem) => {
    setEditMode(true);
    setEditRecord(record);
    setModalOpen(true);
  };

  const handleModalOk = (values: AccountFormValues) => {
    console.log(editMode ? 'Update:' : 'Create:', values);
    // TODO: 백엔드 API 연동
    setModalOpen(false);
  };

  const handleDelete = () => {
    const list: Cmd[] = [];

    for (const key of selectedRowKeys) {
      const record = accountData.find((item) => item.id === key);
      if (record) {
        list.push(CvtAccCmd.getAccountDeleteToBulkCmd(record));
      }
    }

    setCmdList(list);
    setBulkModalOpen(true);
  };

  const clearData = async () => {
    setSelectedRowKeys([]);
    setSearchText('');
    setPageSize(20);
    await getAllUser();
  };

  const handleBulkClose = () => {
    setBulkModalOpen(false);
    setModalOpen(false);
    clearData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'admin_id', key: 'admin_id', width: 120, sorter: (a: AccountItem, b: AccountItem) => a.admin_id.localeCompare(b.admin_id) },
    { title: '이름', dataIndex: 'admin_name', key: 'admin_name', width: 100, sorter: (a: AccountItem, b: AccountItem) => a.admin_name.localeCompare(b.admin_name) },
    {
      title: '권한',
      dataIndex: 'permission',
      key: 'permission',
      width: 120,
      sorter: (a: AccountItem, b: AccountItem) => a.permission - b.permission,
      render: (val: number) => getPermissionStr(val),
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 150, sorter: (a: AccountItem, b: AccountItem) => a.phone.localeCompare(b.phone) },
    { title: '마지막 로그인', dataIndex: 'last_login_time', key: 'last_login_time', width: 180, sorter: (a: AccountItem, b: AccountItem) => a.last_login_time.localeCompare(b.last_login_time) },
    { title: '패스워드 변경', dataIndex: 'pw_change_time', key: 'pw_change_time', width: 180, sorter: (a: AccountItem, b: AccountItem) => a.pw_change_time.localeCompare(b.pw_change_time) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>계정 관리</Title>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
      </div>

      <div style={{ flex: 1 }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          size="small"
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
            getCheckboxProps: (record) => ({
              // ADMIN_PERM_ADMINISTRATOR 행은 선택 차단 + 체크박스 숨김 (컬럼 폭 유지 위해 visibility 사용).
              disabled: record.permission === CstDef.ADMIN_PERM_ADMINISTRATOR,
              style:
                record.permission === CstDef.ADMIN_PERM_ADMINISTRATOR
                  ? { visibility: 'hidden' }
                  : undefined,
            }),
          }}
          onRow={(record) => ({
            onDoubleClick: () => handleRowDoubleClick(record),
          })}
          pagination={{
            pageSize,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
            showSizeChanger: true,
            pageSizeOptions: ['20', '50', '100'],
            onShowSizeChange: (_, size) => setPageSize(size),
          }}
        />
      </div>

      <div style={{ paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
            NEW
          </Button>
          <Button
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleDelete}
          >
            DELETE
          </Button>
        </Space>
        {/* <Button
          type="link"
          onClick={() => setPageSize(pageSize === 99999 ? 20 : 99999)}
        >
          {pageSize === 99999 ? 'Paged' : 'All'}
        </Button> */}
      </div>
      <AccountModal
        open={modalOpen}
        editMode={editMode}
        initialValues={editRecord}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
      />

      <BulkCmdListModal
        open={bulkModalOpen}
        cmdList={cmdList}
        onClose={handleBulkClose}
      />
    </div>
  );
};

export default AccountManagement;
