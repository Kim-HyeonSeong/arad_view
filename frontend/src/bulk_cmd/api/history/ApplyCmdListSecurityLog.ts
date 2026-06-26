import * as CstDef from '../../../commons/CstDef';
import type { Cmd, CmdResult } from "../../../commons/Types";
import * as BulkCmdApiHistoryUnauthLog from './BulkCmdApiSecurityLog';
import type { SecurityLogInfo } from './BulkCmdApiSecurityLog';

export async function applyCmdListHistoryUnauthLogPost(cmd : Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  return ret;
}

export async function applyCmdListHistoryUnauthLogDelete(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  return ret;
}

export async function applyCmdListHistoryUnauthLogGet(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.action === CstDef.BULK_ACTION) {
    ret = await BulkCmdApiHistoryUnauthLog.showHistoryUnauthLog(cmd.info as SecurityLogInfo);
  } 
//   else if (cmd.action === CstDef.NEW_BULK_ACTION_EXPORT) {
//     ret = await BulkCmdApiHistoryUnauthLog.exportHistoryUnauthLog(cmd.info);
//   } else if (cmd.action === CstDef.NEW_BULK_ACTION_FILTER) {
//     ret = await BulkCmdApiHistoryUnauthLog.showHistoryUnauthLogFilter();
//   } 
  else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
  }
  return ret;
}

// export async function applyCmdListHistoryUnauthLogPut(cmd: Cmd): Promise<CmdResult> {
//   let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
//   if (cmd.action === CstDef.BULK_ACTION_FILTER) {
//     ret = await BulkCmdApiHistoryUnauthLog.modifyHistoryUnauthLogFilter(
//       cmd.info
//     );
//   } else {
//     ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
//   }
//   return ret;
// }
