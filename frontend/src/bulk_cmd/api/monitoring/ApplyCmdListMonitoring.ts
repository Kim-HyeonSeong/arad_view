import * as CstDef from '../../../commons/CstDef';
import type { Cmd, CmdResult } from "../../../commons/Types";
import * as BulkCmdApiMonitoring from './BulkCmdApiMonitoring';

export async function applyCmdListMonitoringGet(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };

    const data = (cmd.info as { data?: { category?: string; id?: number } })?.data;

    if (cmd.action === CstDef.BULK_ACTION_MONITORING_STATUS) {
        ret = await BulkCmdApiMonitoring.getMonitoringCategoryData(data?.category ?? '', data?.id ?? 0);
    } else if (cmd.action === CstDef.BULK_ACTION_MONITORING_SUMMARY) {
        ret = await BulkCmdApiMonitoring.getMonitoringSummary(data?.category ?? '', data?.id ?? 0);
    } else if (cmd.action === CstDef.BULK_ACTION_MONITORING_UNAUTH_LOGS) {
        ret = await BulkCmdApiMonitoring.getMonitoringUnauthLog(data?.category ?? '', data?.id ?? 0, (cmd.info as { data?: { size?: number } })?.data?.size ?? 0);
    } 
    else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
    }
    if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
    }
    return ret;
}