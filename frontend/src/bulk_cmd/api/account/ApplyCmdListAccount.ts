import * as CstDef from "../../../commons/CstDef";
import type { Cmd, CmdResult } from "../../../commons/Types";
import * as BulkCmdApiAccount from './BulkCmdApiAccount';

interface LoginCmdInfo {
  data: {
    username: string;
    password: string;
  };
}

interface ChangePwCmdInfo {
  data: {
    currentPassword: string;
    newPassword: string;
  };
}

interface InitialChangePwCmdInfo {
  data: ChangePwCmdInfo['data'] & { username: string };
}

interface PassChangePwCmdInfo {
  data: {
    username: string;
  };
}

export async function applyCmdListAccountPost(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };

  if (cmd.action === CstDef.BULK_ACTION_LOGIN) {
    const info = cmd.info as LoginCmdInfo;
    ret = await BulkCmdApiAccount.login(info.data.username, info.data.password);
  } else if (cmd.action === CstDef.BULK_ACTION_LOGOUT) {
    await BulkCmdApiAccount.logout();
    ret.result = CstDef.BULK_PROC_SUCCESS;
  } else if (cmd.action === CstDef.BULK_ACTION_INIT_CHANGE_PW) {
    const info = cmd.info as InitialChangePwCmdInfo;
    ret = await BulkCmdApiAccount.initialPasswordChange(info.data.username, info.data.currentPassword, info.data.newPassword);
  } else if (cmd.action === CstDef.BULK_ACTION_CHANGE_PW) {
    const info = cmd.info as ChangePwCmdInfo;
    ret = await BulkCmdApiAccount.passwordChange(info.data.currentPassword, info.data.newPassword);
  } else if (cmd.action === CstDef.BULK_ACTION_PASS_CHANGE_PW) {
    const info = cmd.info as PassChangePwCmdInfo;
    ret = await BulkCmdApiAccount.passwordPass();
  } else {
    ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
  }

  if (ret.result === CstDef.BULK_PROC_FAIL && ret.msg === '') {
    ret.msg = '조회 실패';
  }
  return ret;
}
