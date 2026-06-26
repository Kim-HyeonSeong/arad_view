import { useEffect, useMemo, useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Button } from 'antd';
import * as CompanyList from '../../../commons/CompanyList';
import * as CvtContCmd from '../../../bulk_cmd/convert/controller/ConvertControllerSettingCmd';
import type { Cmd } from '../../../commons/Types';
import BulkCmdList from '../../../bulk_cmd/convert/BulkCmdList';
import { useLocations } from '../../../commons/LocationContext';

interface ControllerModalProps {
  open: boolean;
  editMode: boolean;
  initialValues?: {
    id: number;
    name: string;
    ip: string;
    port: number;
    status: string;
    location_id: number;
    homenet_id: number[];      // 여러 월패드 회사 선택 가능
    constructor_id: number[];  // 여러 시공 회사 선택 가능
    //anydesk_id: string;
    description: string;
  } | null;
  onOk: (values: ControllerFormValues) => void;
  onCancel: () => void;
  onSuccess?: () => void;
}

export interface ControllerFormValues {
    id: number;
    name: string;
    ip: string;
    port: number;
    status: string;
    location_id: number;
    homenet_id: number[];      // 여러 월패드 회사 선택 가능
    constructor_id: number[];  // 여러 시공 회사 선택 가능
    //anydesk_id: string;
    description: string;
}

const ControllerModal: React.FC<ControllerModalProps> = ({ open, editMode, initialValues, onOk, onCancel, onSuccess }) => {
    const { items: locationItems, map: locationMap } = useLocations();
    const [form] = Form.useForm<ControllerFormValues>();
    const [bulkModalOpen, setBulkModalOpen] = useState(false);
    const [cmdList, setCmdList] = useState<Cmd[]>([]);
    // 광역(도) 선택값 — 폼 제출 대상 아님. cascade 의 1단계 UI 상태로만 사용.
    // antd Form 의 임시 필드명 '_region_id' 로 watch 후 handleOk 에서 제외.
    const selectedRegionId = Form.useWatch('_region_id', form);

    // 광역 옵션 — 루트(대한민국) 의 직계 자식들.
    const regionOptions = useMemo(
        () => locationItems
            .filter((l) => l.parent_id === 1)
            .map((l) => ({ value: l.id, label: l.name })),
        [locationItems],
    );

    // 시/군/구 옵션 — 선택된 광역의 자식들. 미선택 시 빈 배열.
    const districtOptions = useMemo(
        () => selectedRegionId
            ? locationItems
                .filter((l) => l.parent_id === selectedRegionId)
                .map((l) => ({ value: l.id, label: l.name }))
            : [],
        [locationItems, selectedRegionId],
    );

    useEffect(() => {
        if (!open) return;
        if (editMode && initialValues) {
            // initialValues.location_id 가 시군구면 그 parent 가 광역. 광역 자체면 자기 자신.
            const loc = locationMap.get(initialValues.location_id);
            let regionId: number | undefined;
            if (loc) {
                regionId = loc.parent_id === 1 ? loc.id : (loc.parent_id ?? undefined);
            }
            form.setFieldsValue({
                name: initialValues.name,
                ip: initialValues.ip,
                port: initialValues.port,
                status: initialValues.status,
                _region_id: regionId,
                location_id: initialValues.location_id,
                homenet_id: initialValues.homenet_id ?? [],
                constructor_id: initialValues.constructor_id ?? [],
                description: initialValues.description,
            } as Partial<ControllerFormValues & { _region_id: number }>);
        } else {
            form.resetFields();
        }
    }, [open, editMode, initialValues, form, locationMap]);

    const handleOk = async () => {
        const values = await form.validateFields();
        // UI 전용 필드 (_region_id) 는 BE 로 보내지 않음.
        const { _region_id: _r, ...submit } = values as ControllerFormValues & { _region_id?: number };
        void _r;
        const list: Cmd[] = [];
        if (editMode) {
            list.push(CvtContCmd.getControllerModifyToBulkCmd({ ...submit, id: initialValues?.id }));
        } else {
            list.push(CvtContCmd.getControllerCreateToBulkCmd(submit));
        }
        setCmdList(list);
        setBulkModalOpen(true);
    };

    const handleBulkClose = () => {
        setBulkModalOpen(false);
        onOk({} as ControllerFormValues);
    };

    return (
        <Modal
            title={editMode ? '컨트롤러 수정' : '컨트롤러 추가'}
            open={open}
            onOk={handleOk}
            onCancel={onCancel}
            centered
            destroyOnHidden
            footer={[
                // 확인을 왼쪽, 취소를 오른쪽으로 배치 (요구사항).
                <Button key="ok" type="primary" onClick={handleOk}>확인</Button>,
                <Button key="cancel" onClick={onCancel}>취소</Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onKeyDown={(e) => {
                    // Enter 키만 처리. textarea (Input.TextArea) 안에서는 줄바꿈 허용해야 하므로 제외.
                    if (e.key !== 'Enter') return;
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'TEXTAREA') return;
                    e.preventDefault();
                    e.stopPropagation();
                    handleOk();
                }}
            >
                <Form.Item 
                    name="name" 
                    label="컨트롤러 이름" 
                    rules={[{ 
                        required: true, 
                        message: '컨트롤러 이름을 입력하세요'},
                        {min: 4, max: 30, message: '4~30자리로 입력해주세요',}
                    ]}
                >
                    <Input autoComplete='off'/>
                </Form.Item>
                <Form.Item 
                    name="ip" 
                    label="IP 주소" 
                    rules={[{
                        required: true,
                        message: 'IP 주소를 입력하세요' },
                        { pattern: /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/,
                        message: '유효한 IP 주소를 입력하세요'
                    }]}
                >
                    <Input autoComplete='one-time-code'/>
                </Form.Item>
                <Form.Item 
                    name="port" 
                    label="포트" 
                    rules={[
                        { 
                            required: true, 
                            message: '포트를 입력하세요' },
                        { type: 'number', min: 1, max: 65535, message: '1~65535 사이의 숫자를 입력하세요' }
                    ]}
                >
                    <InputNumber style={{ width: '100%' }} min={1} max={65535} />
                </Form.Item>
                {/* 광역(도/광역시) — UI 전용. _region_id 는 BE 로 안 감. */}
                <Form.Item name="_region_id" label="광역" rules={[{ required: true, message: '광역을 선택하세요' }]}>
                    <Select
                        placeholder="광역(도/광역시) 선택"
                        options={regionOptions}
                        onChange={() => form.setFieldValue('location_id', undefined)}
                    />
                </Form.Item>
                {/* 시/군/구 — 실제 BE 로 전송되는 location_id. */}
                <Form.Item name="location_id" label="시/군/구" rules={[{ required: true, message: '시/군/구를 선택하세요' }]}>
                    <Select
                        placeholder="시/군/구 선택"
                        disabled={!selectedRegionId}
                        options={districtOptions}
                    />
                </Form.Item>
                <Form.Item name="constructor_id" label="시공 회사">
                    <Select mode="multiple">
                        {CompanyList.AllConstructorList.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="homenet_id" label="월패드 회사">
                    <Select mode="multiple">
                        {CompanyList.AllWallPadList.map((item) => (
                            <Select.Option key={item.value} value={item.value}>
                                {item.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* <Form.Item name="anydesk_id" label="원격접속 고유번호">
                    <Input placeholder="AnyDesk ID를 입력하세요" />
                </Form.Item> */}
                <Form.Item name="description" label="설명">
                    <Input placeholder="설명을 입력하세요" />
                </Form.Item>
            </Form>

            <BulkCmdList
                open={bulkModalOpen}
                cmdList={cmdList}
                onClose={handleBulkClose}
                onSuccess={onSuccess}
            />
        </Modal>
    );
}

export default ControllerModal;