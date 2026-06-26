import { useState, useEffect } from 'react';
import { Modal, Table, Button, Progress, Tag, Space, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { Cmd, CmdResult } from '../../commons/Types';
import * as CstDef from '../../commons/CstDef';
import { getBulkCategoryStr, getBulkMethodStr, getBulkProcStr } from '../../commons/ConvertValStr';
import { applyCmd } from '../../bulk_cmd/api/ApplyCmdList';

// 실행된 cmd 1건. applyCmd 응답 data (예: 토큰 발급 결과 문자열) 를 row 에 함께 보관.
export interface ExecutedCmd extends Cmd {
  seq_id: number;
  result: number;
  msg: string;
  data?: unknown;
}

type CmdRow = ExecutedCmd;

interface BulkCmdListProps {
  open: boolean;
  cmdList: Cmd[];
  onClose: () => void;
  // 전체 성공 시 자동 닫기 직전 호출. 실행된 row 들을 넘겨 부모가 응답 data 까지 접근 가능.
  onSuccess?: (rows: ExecutedCmd[]) => void;
}

const HEADER_COLOR = '#171C61';

const BulkCmdList: React.FC<BulkCmdListProps> = ({ open, cmdList, onClose, onSuccess }) => {
  const [rows, setRows] = useState<CmdRow[]>([]);
  const [running, setRunning] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);

  useEffect(() => {
    if (open) {
      const initialRows: CmdRow[] = cmdList.map((cmd, index) => ({
        ...cmd,
        seq_id: index + 1,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
      }));
      setRows(initialRows);
      setSuccessCount(0);
      setFailCount(0);
      setWaitingCount(cmdList.length);
      setRunning(false);
    }
  }, [open, cmdList]);

  const totalCount = rows.length;
  const progressPercent = totalCount > 0 ? Math.round(((successCount + failCount) / totalCount) * 100) : 0;

  const handleRunCommands = async () => {
    setRunning(true);
    let success = 0;
    let fail = 0;
    let waiting = rows.length;

    // setRows 는 비동기라 onSuccess 직전에 최신 rows 를 끌어올 수 없음.
    // 루프 동안 동기적으로 누적해 onSuccess 인자로 그대로 전달.
    const executed: CmdRow[] = rows.map((r) => ({ ...r }));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      setRows((prev) => {
        const next = [...prev];
        next[i] = { ...next[i], result: CstDef.BULK_PROC_WAITING };
        return next;
      });

      try {
        const ret: CmdResult = await applyCmd(row);
        if (ret.result === CstDef.BULK_PROC_SUCCESS) {
          success++;
        } else {
          fail++;
        }
        waiting--;
        executed[i] = { ...executed[i], result: ret.result, msg: ret.msg, data: ret.data };
        setRows((prev) => {
          const next = [...prev];
          next[i] = executed[i];
          return next;
        });
      } catch (error) {
        fail++;
        waiting--;
        executed[i] = { ...executed[i], result: CstDef.BULK_PROC_FAIL, msg: String(error) };
        setRows((prev) => {
          const next = [...prev];
          next[i] = executed[i];
          return next;
        });
      }

      setSuccessCount(success);
      setFailCount(fail);
      setWaitingCount(waiting);
    }

    setRunning(false);

    // 전체 성공 시 1초 뒤 자동 닫기. 실패가 있으면 메시지 확인을 위해 유지.
    if (fail === 0 && success === rows.length) {
      onSuccess?.(executed);
      setTimeout(() => onClose(), 1000);
    }
  };

  const handleExport = () => {
    // TODO: CSV/Excel export
    console.log('Export:', rows);
  };

  const renderResult = (val: number) => {
    if (val === CstDef.BULK_PROC_DEFAULT) return null;
    if (val === CstDef.BULK_PROC_WAITING) return <Tag color="processing">{getBulkProcStr(val)}</Tag>;
    if (val === CstDef.BULK_PROC_SUCCESS) return <Tag color="success">{getBulkProcStr(val)}</Tag>;
    if (val === CstDef.BULK_PROC_FAIL) return <Tag color="error">{getBulkProcStr(val)}</Tag>;
    return null;
  };

  const columns = [
    { title: '순서', dataIndex: 'seq_id', key: 'seq_id', width: 60 },
    { title: '카테고리', dataIndex: 'category', key: 'category', width: 120, render: (val: number) => getBulkCategoryStr(val) },
    { title: 'Method', dataIndex: 'method', key: 'method', width: 90, render: (val: number) => getBulkMethodStr(val) },
    {
      title: '내용',
      dataIndex: 'content',
      key: 'content',
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip
          placement="topLeft"
          title={text}
          color="#161C61"
          styles={{ root: { maxWidth: 600, wordBreak: 'break-all' } }}
        >
          {text}
        </Tooltip>
      ),
    },
    { title: '결과', dataIndex: 'result', key: 'result', width: 90, render: renderResult },
    {
      title: '메시지',
      dataIndex: 'msg',
      key: 'msg',
      width: 200,
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <Tooltip
          placement="topLeft"
          title={text}
          styles={{ root: { maxWidth: 600, wordBreak: 'break-all' } }}
        >
          {text}
        </Tooltip>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
            <span style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                Command List (성공: {successCount} / 실패: {failCount} / 대기중: {waitingCount})
            </span>
            <Progress
                percent={progressPercent}
                style={{ flex: 0.5, marginBottom: 0 }}
                strokeColor={failCount > 0 ? '#ff4d4f' : '#52c41a'}
                trailColor="rgba(255,255,255,0.3)"
                format={(p) => <span style={{ color: '#fff' }}>{p}%</span>}
            />
          </div>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>
            EXPORT
          </Button>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={1000}
      centered
      maskClosable={false}
      className="bulk-cmd-modal"
      styles={{
        header: {
          background: HEADER_COLOR,
          padding: '12px 24px',
          margin: 0,
          borderRadius: '4px 4px 0 0',
        },
        body: {
          padding: '8px 8px 0 8px',
        },
        footer: {
          marginTop: 0,
        }
        // content: {
        //   padding: 0,
        //   overflow: 'hidden',
        // },
      }}
      closeIcon={null}
      footer={
        <div style={{ 
            //borderTop: '1px solid #f0f0f0', 
            padding: '12px 0', 
            display: 'flex', 
            justifyContent: 'center' }}>
          <Space>
            <Button
              type="primary"
              onClick={handleRunCommands}
              loading={running}
              disabled={running || rows.length === 0}
            >
              명령리스트 수행
            </Button>
            <Button type="primary" onClick={onClose}>
              종료
            </Button>
          </Space>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="seq_id"
        size="small"
        pagination={false}
        scroll={{ y: 400 }}
      />
    </Modal>
  );
};

export default BulkCmdList;
