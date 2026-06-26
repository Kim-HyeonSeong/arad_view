import * as CstDef from "../../../commons/CstDef";
import type { Cmd, CmdResult } from "../../../commons/Types";
import * as BulkCmdApiController from './BulkCmdApiControllerSetting';
import * as BulkCmdApiControllerAgent from './BulkCmdApiControllerAgentToken';

export async function applyCmdListControllerGet(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.action === CstDef.BULK_ACTION) {
    ret = await BulkCmdApiController.getControllerData();
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
  }
  return ret;
}

export async function applyCmdListControllerPost(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.action === CstDef.BULK_ACTION) {
    // converter 가 controller 정보를 cmd.info.data 에 박음. Cmd.info 가 {} 타입이라 캐스팅 필요.
    const data = (cmd.info as { data?: any })?.data;
    ret = await BulkCmdApiController.createController(data);
  } else if (cmd.action === CstDef.BULK_ACTION_CONTROLLER_CREATE_TOKEN) {
    // converter 가 { controller_id } 객체로 감싸 보내므로 id 만 꺼냄.
    const data = (cmd.info as { data?: { controller_id?: number } })?.data;
    ret = await BulkCmdApiControllerAgent.createAgentToken(Number(data?.controller_id ?? 0));
  } else if (cmd.action === CstDef.BULK_ACTION_CONTROLLER_DELETE_TOKEN) {
    const data = (cmd.info as { data?: { controller_id?: number } })?.data;
    ret = await BulkCmdApiControllerAgent.deleteAgentToken(Number(data?.controller_id ?? 0));
  } else if (cmd.action === CstDef.BULK_ACTION_CONTROLLER_REGENERATE_TOKEN) {
    const data = (cmd.info as { data?: { controller_id?: number } })?.data;
    ret = await BulkCmdApiControllerAgent.regenerateAgentToken(Number(data?.controller_id ?? 0));
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
  }
  return ret;
}

export async function applyCmdListControllerPut(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.action === CstDef.BULK_ACTION) {
    // modify 도 동일하게 cmd.info.data 안에 컨트롤러 전체가 들어있음. id 는 그 안에서 꺼냄.
    const data = (cmd.info as { data?: { id?: number | string; [k: string]: any } })?.data;
    const id = String(data?.id ?? '');
    ret = await BulkCmdApiController.modifyController(id, data);
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
  }
  return ret;
}

export async function applyCmdListControllerDelete(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.action === CstDef.BULK_ACTION) {
    const ids = (cmd.info as { ids?: number[] })?.ids ?? [];
    if (ids.length === 0) {
      ret.msg = '삭제할 ID 가 없습니다';
      return ret;
    }
    ret = await BulkCmdApiController.deleteController(ids);
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }
  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
  }
  return ret;
}