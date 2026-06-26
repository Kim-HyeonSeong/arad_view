import * as CstDef from "../../../commons/CstDef";
import type { Cmd, CmdResult } from "../../../commons/Types";
import * as BulkCmdApiDashboard from './BulkCmdApiDashboard';

export async function applyCmdListDashboardPost(cmd: Cmd): Promise<CmdResult> {
  const ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  return ret;
}

export async function applyCmdListDashboardDelete(cmd: Cmd): Promise<CmdResult> {
  const ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  return ret;
}

export async function applyCmdListDashboardGet(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.action === CstDef.BULK_ACTION_DASHBOARD_SERVER_STATUS) {
    ret = await BulkCmdApiDashboard.showServerStatus();
  } else if (cmd.action === CstDef.BULK_ACTION_DASHBOARD_DEVICE_STATUS) {
    ret = await BulkCmdApiDashboard.showDeviceStatus();
  } else if (cmd.action === CstDef.BULK_ACTION_DASHBOARD_LOCATION_SUMMARY) {
    ret = await BulkCmdApiDashboard.showLocationSummary();
  } else if (cmd.action === CstDef.BULK_ACTION_DASHBOARD_UNAUTH_LOGS) {
    ret = await BulkCmdApiDashboard.showUnauthLogs((cmd.info as {size?: number}).size ?? 10);
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
  }
  return ret;
}

export async function applyCmdListDashboardPut(cmd: Cmd): Promise<CmdResult> {
  const ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  return ret;
}
