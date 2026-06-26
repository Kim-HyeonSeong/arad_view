import * as CstDef from "../../../commons/CstDef";
import type { Cmd, CmdResult } from "../../../commons/Types";
import * as BulkCmdApiSysset from './BulkCmdApiSysset';

export async function applyCmdListSyssetPost(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
   if (cmd.action === CstDef.BULK_ACTION) {
    ret = await BulkCmdApiSysset.resetSyssetInfo((cmd.info as { data?: unknown })?.data);
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '업데이트 실패';
  }
  return ret;
}

export async function applyCmdListSyssetGet(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.action === CstDef.BULK_ACTION) {
    ret = await BulkCmdApiSysset.getSyssetInfo();
  } else if (cmd.action === CstDef.BULK_ACTION_ONE) {
    ret = await BulkCmdApiSysset.getSyssetOneInfo((cmd.info as { key?: string })?.key ?? '');
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
  }
  return ret;
}

export async function applyCmdListSyssetPatch(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.action === CstDef.BULK_ACTION) {
    ret = await BulkCmdApiSysset.updateSyssetInfo((cmd.info as { data?: unknown })?.data);
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '업데이트 실패';
  }
  return ret;
}