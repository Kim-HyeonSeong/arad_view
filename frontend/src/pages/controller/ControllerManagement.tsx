import { useState, useEffect } from 'react';
import { Table, Typography, Input, Button, Space, Tooltip, Tag, Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined, DesktopOutlined, CopyOutlined, HomeOutlined } from '@ant-design/icons';
import { applyCmd } from '../../bulk_cmd/api/ApplyCmdList';
import * as CvtContAgentCmd from '../../bulk_cmd/convert/controller/ConvertControllerAgentCmd';
import * as CvtContCmd from '../../bulk_cmd/convert/controller/ConvertControllerSettingCmd';
import * as RegionDef from '../../commons/RegionDef';
import * as CompanyDef from '../../commons/CompanyDef';
import type { ColumnsType } from 'antd/es/table';
import * as CvtValStr from '../../commons/ConvertValStr';
import * as CstDef from '../../commons/CstDef';
import type { Cmd } from '../../commons/Types';
import type { ControllerFormValues } from './controllers/ControllerModal';
import ControllerModal from './controllers/ControllerModal';
import ControllerEstateModal from './controllers/ControllerEstateModal';
import BulkCmdListModal, { type ExecutedCmd } from '../../bulk_cmd/convert/BulkCmdList';
import { useLocations } from '../../commons/LocationContext';

const { Title } = Typography;

interface ControllerItem {
  id: number;
  name: string;
  ip: string;
  port: number;
  status: string;
  location_id : number;
  constructor_id  : number[]; // 여러 건설사 선택 가능
  homenet_id : number[];      // 여러 월패드 회사 선택 가능
  last_connect_at: string;
  created_at: string;
  updated_at: string;
  description: string;
}

// TODO: 백엔드 연동 후 삭제
const ControllerManagement: React.FC = () => {
    // Location 트리는 LocationProvider 가 앱 단위로 1회 fetch. 여기선 헬퍼만 가져옴.
    const { getRegionDistrict } = useLocations();
    const [controllerData, setControllerData] = useState<ControllerItem[]>([]);
    const [filteredData, setFilteredData] = useState<ControllerItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pageSize, setPageSize] = useState<number>(20);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editRecord, setEditRecord] = useState<ControllerItem | null>(null);
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
    const [cmdList, setCmdList] = useState<Cmd[]>([]);
    // 토큰 발급/재발급 결과 1회 노출 모달. 닫으면 다시 못 봄 (10번 설계 — "등록 시 1회만 화면에 표시").
    const [tokenModalOpen, setTokenModalOpen] = useState(false);
    const [issuedToken, setIssuedToken] = useState<string>('');
    // 단지(아파트) 구성 모달.
    const [estateModalOpen, setEstateModalOpen] = useState(false);
    const [estateRecord, setEstateRecord] = useState<ControllerItem | null>(null);

    const getAllControllers = async () => {
        // TODO: 백엔드 API 연동
    };

    useEffect(() => {
        getAllControllers();
    }, []);

    const handleSearch = (value: string) => {
        setSearchText(value);

        if (!value) {
            setFilteredData(controllerData);
            return;
        }

        const lower = value.toLowerCase();
        // last_connect_at 은 한 번도 연결 안 된 컨트롤러면 NULL/undefined 라 옵셔널 체이닝 필수.
        // 나머지 string 필드는 DB NOT NULL 이지만 방어적으로 ?? '' 처리.
        setFilteredData(
            controllerData.filter(
                (item) =>
                (item.name ?? '').toLowerCase().includes(lower) ||
                (item.ip ?? '').toLowerCase().includes(lower) ||
                (item.status ?? '').toLowerCase().includes(lower) ||
                getRegionDistrict(item.location_id).region.toLowerCase().includes(lower) ||
                getRegionDistrict(item.location_id).district.toLowerCase().includes(lower) ||
                CvtValStr.getConstructorStr(item.constructor_id).toLowerCase().includes(lower) ||
                CvtValStr.getWallPadStr(item.homenet_id).toLowerCase().includes(lower) ||
                (item.last_connect_at ?? '').toLowerCase().includes(lower),
            ),
        );
    };

    const handleNew = () => {
        setEditMode(false);
        setEditRecord(null);
        setModalOpen(true);
    };

    const handleRowDoubleClick = (record: ControllerItem) => {
        setEditMode(true);
        setEditRecord(record);
        setModalOpen(true);
    };

    const handleModalOk = (values: ControllerFormValues) => {
        console.log(editMode ? 'Update:' : 'Create:', values);
        // TODO: 백엔드 API 연동
        setModalOpen(false);
    };

    const getControllerData = async () => {
        const cmd = CvtContCmd.getControllerShowAllToBulkCmd();
        const ret = await applyCmd(cmd);

        if (ret.result !== CstDef.BULK_PROC_SUCCESS) {
            message.error(ret.msg || '컨트롤러 데이터를 불러오는데 실패했습니다.');
            return;
        }

        setControllerData((ret.data as ControllerItem[]) ?? []);
        setFilteredData((ret.data as ControllerItem[]) ?? []);
    }

    const handleDelete = () => {
        // 선택된 행들의 record 를 한 번에 모아 ids: [...] 형태로 전달.
        const records = controllerData.filter((item) => selectedRowKeys.includes(item.id));
        if (records.length === 0) {
            message.warning('선택된 항목이 없습니다.');
            return;
        }

        const cmd = CvtContCmd.getControllerDeleteToBulkCmd(records);
        setCmdList([cmd]);
        setBulkModalOpen(true);
    };

    const clearData = async () => {
        setSelectedRowKeys([]);
        setSearchText('');
        setPageSize(20);
        await getAllControllers();
    };

    const handleBulkClose = () => {
        setBulkModalOpen(false);
        setModalOpen(false);
        clearData();
    };

    // BulkCmdListModal 이 모든 cmd 를 성공 처리한 직후 호출됨.
    // 토큰 발급/재발급 cmd 가 섞여 있으면 응답의 토큰을 꺼내 1회 노출 모달로 띄움.
    // 컨트롤러 목록은 어떤 액션이든 안전하게 refetch.
    const handleBulkSuccess = (executed: ExecutedCmd[]) => {
        const tokenRow = executed.find(
            (r) =>
                r.action === CstDef.BULK_ACTION_CONTROLLER_CREATE_TOKEN ||
                r.action === CstDef.BULK_ACTION_CONTROLLER_REGENERATE_TOKEN,
        );
        if (tokenRow && typeof tokenRow.data === 'string' && tokenRow.data.length > 0) {
            setIssuedToken(tokenRow.data);
            setTokenModalOpen(true);
        }
        getControllerData();
    };

    // TODO: BE 연동. 토큰 발급 후 1회만 화면에 노출하는 모달 필요 (10번 설계 문서 참고).
    const handleTokenCreate = async (record: ControllerItem) => {
        const cmd = CvtContAgentCmd.getControllerCreateTokenToBulkCmd(record.id);
        
        setCmdList([cmd]);
        setBulkModalOpen(true);
    };

    const handleCopyToken = async () => {
        try {
            await navigator.clipboard.writeText(issuedToken);
            message.success('토큰이 클립보드에 복사되었습니다.');
        } catch {
            message.error('복사에 실패했습니다. 토큰을 직접 선택해서 복사해주세요.');
        }
    };

    const handleTokenModalClose = () => {
        setTokenModalOpen(false);
        // 닫으면 메모리에서 토큰 제거 (다시 못 봄 정책 강화).
        setIssuedToken('');
    };

    // TODO: BE 연동. 현재는 모달 열기만. 저장 시 단지 구성 데이터를 컨트롤러에 묶어 보낼 예정.
    const handleEstateOpen = (record: ControllerItem) => {
        setEstateRecord(record);
        setEstateModalOpen(true);
    };

    const handleEstateClose = () => {
        setEstateModalOpen(false);
        setEstateRecord(null);
    };

    const handleTokenDelete = async (record: ControllerItem) => {
        let cmd = CvtContAgentCmd.getControllerDeleteTokenToBulkCmd(record.id);

        setCmdList([cmd]);
        setBulkModalOpen(true);
    };

    const handleTokenReissue = async (record: ControllerItem) => {
        let cmd = CvtContAgentCmd.getControllerRegenerateTokenToBulkCmd(record.id);
        
        setCmdList([cmd]);
        setBulkModalOpen(true);
    };

    const handleAnyDeskConnect = (record: ControllerItem) => {
        // if (!record.anydesk_id) {
        //     message.warning(`${record.cont_name}에 AnyDesk ID가 등록되지 않았습니다.`);
        //     return;
        // }
        // const link = document.createElement('a');
        // link.href = `anydesk:${record.anydesk_id}`;
        // link.style.display = 'none';
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
        // message.info(`AnyDesk 연결 시도: ${record.cont_name} (${record.anydesk_id})`);
    };

    const columns: ColumnsType<ControllerItem> = [
        { title: '컨트롤러 이름', dataIndex: 'name', key: 'name', width: 150,
            sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: 'IP 주소', dataIndex: 'ip', key: 'ip', width: 150,
            sorter: (a, b) => a.ip.localeCompare(b.ip) },
        { title: '포트', dataIndex: 'port', key: 'port', width: 100,
            sorter: (a, b) => a.port - b.port },
        { title: '상태', dataIndex: 'status', key: 'status', width: 120,
            sorter: (a, b) => a.status.localeCompare(b.status) },
        { title: '광역', key: 'region', width: 150,
            render: (_: unknown, record: ControllerItem) => getRegionDistrict(record.location_id).region,
            sorter: (a, b) =>
                getRegionDistrict(a.location_id).region.localeCompare(getRegionDistrict(b.location_id).region) },
        { title: '시/군/구', key: 'district', width: 150,
            render: (_: unknown, record: ControllerItem) => getRegionDistrict(record.location_id).district,
            sorter: (a, b) =>
                getRegionDistrict(a.location_id).district.localeCompare(getRegionDistrict(b.location_id).district) },
        { title: '월패드 제조사', dataIndex: 'homenet_id', key: 'homenet_id', width: 150,
            render: (val: number | number[]) => CvtValStr.getWallPadStr(val),
            sorter: (a, b) => CvtValStr.getWallPadStr(a.homenet_id).localeCompare(CvtValStr.getWallPadStr(b.homenet_id)) },
        { title: '시공사', dataIndex: 'constructor_id', key: 'constructor_id', width: 150,
            render: (val: number | number[]) => CvtValStr.getConstructorStr(val),
            sorter: (a, b) => CvtValStr.getConstructorStr(a.constructor_id).localeCompare(CvtValStr.getConstructorStr(b.constructor_id)) },
        { title: '마지막 연결 시간', dataIndex: 'last_connect_at', key: 'last_connect_at', width: 180,
            sorter: (a, b) => (a.last_connect_at || '').localeCompare(b.last_connect_at || '') },
                // {
                //     title: '원격 접속',
                //     key: 'anydesk',
                //     width: 100,
                //     align: 'center' as const,
                //     render: (_: unknown, record: ControllerItem) => (
                //         <Tooltip title={record.anydesk_id ? `AnyDesk: ${record.anydesk_id}` : 'AnyDesk ID 미등록'}>
                //             <Button
                //                 type="link"
                //                 icon={<DesktopOutlined />}
                //                 disabled={!record.anydesk_id}
                //                 onClick={(e) => {
                //                     e.stopPropagation();
                //                     handleAnyDeskConnect(record);
                //                 }}
                //             />
                //         </Tooltip>
                //     ),
                // },
        { title: '토큰', key: 'token', width: 180,
            render: (_: unknown, record: ControllerItem) => (
                <Space size={4} onClick={(e) => e.stopPropagation()}>
                    <Tag color="green" style={{ cursor: 'pointer', margin: 0 }}
                         onClick={() => handleTokenCreate(record)}>생성</Tag>
                    <Tag color="red" style={{ cursor: 'pointer', margin: 0 }}
                         onClick={() => handleTokenDelete(record)}>삭제</Tag>
                    <Tag color="blue" style={{ cursor: 'pointer', margin: 0 }}
                         onClick={() => handleTokenReissue(record)}>재발급</Tag>
                </Space>
            ),
        },
        { title: '단지 설정', key: 'estate', width: 110, align: 'center' as const,
            render: (_: unknown, record: ControllerItem) => (
                <Tooltip title="단지 구성 (층/호) 설정">
                    <Button
                        size="small"
                        icon={<HomeOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEstateOpen(record);
                        }}
                    >
                        구성
                    </Button>
                </Tooltip>
            ),
        },
        { title: '설명', dataIndex: 'description', key: 'description', width: 200,
            sorter: (a, b) => (a.description || '').localeCompare(b.description || '') },
    ];

    useEffect(() => {
        getControllerData();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>컨트롤러 관리</Title>
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

                <ControllerModal
                    open={modalOpen}
                    editMode={editMode}
                    initialValues={editRecord}
                    onOk={handleModalOk}
                    onCancel={() => setModalOpen(false)}
                    onSuccess={getControllerData}
                />

                <BulkCmdListModal
                    open={bulkModalOpen}
                    cmdList={cmdList}
                    onClose={handleBulkClose}
                    onSuccess={handleBulkSuccess}
                />

                <ControllerEstateModal
                    open={estateModalOpen}
                    onCancel={handleEstateClose}
                    onOk={(pages) => {
                        // TODO: BE 연동 시 estateRecord.id 와 함께 pages 를 전송
                        console.log('단지 구성 저장:', estateRecord?.id, pages);
                        handleEstateClose();
                    }}
                />

                <Modal
                    title="에이전트 토큰 발급"
                    open={tokenModalOpen}
                    onCancel={handleTokenModalClose}
                    centered
                    destroyOnHidden
                    footer={null}
                >
                    <div style={{ marginBottom: 12, color: '#EF4444', fontSize: 13 }}>
                        ⚠ 이 토큰은 다시 표시되지 않습니다. 지금 복사해서 안전한 곳에 보관하세요.
                    </div>
                    <Input.TextArea
                        value={issuedToken}
                        readOnly
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        style={{ fontFamily: 'monospace', fontSize: 13 }}
                    />
                    <div style={{ marginTop: 12, textAlign: 'right' }}>
                        <Button icon={<CopyOutlined />} onClick={handleCopyToken}>
                            복사
                        </Button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default ControllerManagement;