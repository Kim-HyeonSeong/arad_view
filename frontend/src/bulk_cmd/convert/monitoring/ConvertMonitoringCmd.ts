import * as CstDef from '../../../commons/CstDef';

export function getMonitoringStatusToBulkCmd(category: string, id: number) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_MONITORING,
        content: '',
        method: CstDef.BULK_METHOD_GET,
        action: CstDef.BULK_ACTION_MONITORING_STATUS,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            data: {
                category,
                id,
            },
        },
    };
    return cmd;
}

export function getMonitoringSummaryToBulkCmd(category: string, id: number) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_MONITORING,
        content: '',
        method: CstDef.BULK_METHOD_GET,
        action: CstDef.BULK_ACTION_MONITORING_SUMMARY,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            data: {
                category,
                id,
            },
        },
    };
    return cmd;
}

export function getMonitoringUnauthLogToBulkCmd(category: string, id: number, size: number) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_MONITORING,
        content: '',
        method: CstDef.BULK_METHOD_GET,
        action: CstDef.BULK_ACTION_MONITORING_UNAUTH_LOGS,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            data: {
                category,
                id,
                size,
            },
        },
    };
    return cmd;
}