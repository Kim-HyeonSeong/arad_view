import { Table, Typography, Input, Button, Space, Tooltip, Tag, Modal, message, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import type { Cmd } from '../../../commons/Types';
import type { ColumnsType } from 'antd/es/table';
import BulkCmdList, { type ExecutedCmd } from '../../../bulk_cmd/convert/BulkCmdList';
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface DatabaseItem {
  id: number;
  db_name: string;
  version: string;
  admin_id: string;
  admin_name: string;
  db_location: string;
  backup_date: string;
}

const mockData: DatabaseItem[] = [
  {
    id: 1,
    db_name: 'backup_2024_01_01.sql',
    version: 'v1.0',
    admin_id: 'admin1',
    admin_name: '김현성',
    db_location: '/backups/backup_2024_01_01.sql',
    backup_date: '2024-01-01 12:00:00',
  },
  {
    id: 2,
    db_name: 'backup_2024_02_01.sql',
    version: 'v1.1',
    admin_id: 'admin1',
    admin_name: '김현성',
    db_location: '/backups/backup_2024_02_01.sql',
    backup_date: '2024-02-01 15:30:00',
  },
];

const DataManagementTab: React.FC = () => {
  const [dbData, setDbData] = useState<DatabaseItem[]>(mockData);
  const [filteredData, setFilteredData] = useState<DatabaseItem[]>(mockData);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState<number>(20);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [cmdList, setCmdList] = useState<Cmd[]>([]);

  const getAllDatabases = async () => {
      // TODO: 백엔드 API 연동
  };

  const handleSearch = (value: string) => {
      setSearchText(value);

      if (!value) {
          setFilteredData(dbData);
          return;
      }

      const lower = value.toLowerCase();
      // last_connect_at 은 한 번도 연결 안 된 컨트롤러면 NULL/undefined 라 옵셔널 체이닝 필수.
      // 나머지 string 필드는 DB NOT NULL 이지만 방어적으로 ?? '' 처리.
      setFilteredData(
          dbData.filter(
              (item) =>
              (item.db_name ?? '').toLowerCase().includes(lower) ||
              (item.version ?? '').toLowerCase().includes(lower) ||
              (item.backup_date ?? '').toLowerCase().includes(lower) ||
              (item.admin_name ?? '').toLowerCase().includes(lower)
          ),
      );
  };

  // TODO: BE 연동 — 선택된 백업본으로 DB 복원. confirm 거친 뒤 호출됨.
  const handleRestore = (id: number) => {
    message.info(`복원 요청: id=${id}`);
  };

  const columns: ColumnsType<DatabaseItem> = [
    { title: '파일', dataIndex: 'db_name', key: 'db_name', width: 150,
      sorter: (a, b) => (a.db_name || '').localeCompare(b.db_name || '') },
    { title: 'Version', dataIndex: 'version', key: 'version', width: 150,
      sorter: (a, b) => (a.version || '').localeCompare(b.version || '') },
    { title: '백업 일자', dataIndex: 'backup_date', key: 'backup_date', width: 160,
      sorter: (a, b) => (a.backup_date || '').localeCompare(b.backup_date || '') },
    { title: '등록자', dataIndex: 'admin_name', key: 'admin_name', width: 120,
      sorter: (a, b) => (a.admin_name || '').localeCompare(b.admin_name || '') },
    { title: '내려받기', key: 'download', width: 100, align: 'center',
      render: (_, record) => (
        <a href={record.db_location} download>다운로드</a>
      ),
    },
    { title: '복원', key: 'restore', width: 100, align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="DB 복원"
          description={`${record.db_name} 으로 복원하시겠습니까? 현재 데이터가 대체됩니다.`}
          onConfirm={() => handleRestore(record.id)}
          okText="복원"
          cancelText="취소"
          okButtonProps={{ danger: true }}
        >
          <Button type="link" danger>복원</Button>
        </Popconfirm>
      ),
    },
  ];

  const handleRowDoubleClick = (record: DatabaseItem) => {

  }

  const handleNew = () => {

  }

  const handleDelete = () => {
    setBulkModalOpen(true);
  }

  const handleBulkSuccess = (executedCmds: ExecutedCmd[]) => {
    message.success(`${executedCmds.length}개의 백업본이 삭제되었습니다.`);
    handleBulkClose();
  }

  const clearData = async () => {
      setSelectedRowKeys([]);
      setSearchText('');
      setPageSize(20);
      await getAllDatabases();
  };

  const handleBulkClose = () => {
      setBulkModalOpen(false);
      clearData();
  };
  

  useEffect(() => {
      getAllDatabases();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>데이터베이스 관리</Title>
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

        <BulkCmdList
            open={bulkModalOpen}
            cmdList={cmdList}
            onClose={handleBulkClose}
            onSuccess={handleBulkSuccess}
        />
      </div>
    </div>
  );
};

export default DataManagementTab;
