import * as CstDef from '../../commons/CstDef';
import type { Cmd, CmdResult } from '../../commons/Types';
import * as ApiAccounts from './account/ApplyCmdListAccount';
import * as ApiDashboard from './dashboarad/ApplyCmdListDashboard';
import * as ApiHistory from './history/ApplyCmdListSecurityLog';
import * as ApiController from './controller/ApplyCmdListControllerSetting';
import * as ApiMonitoring from './monitoring/ApplyCmdListMonitoring';
import * as ApiSysset from './sysset/ApplyCmdListSysset';
import * as ApiLocation from './location/ApplyCmdListLocation';

export async function applyCmd(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
    if (cmd.category === CstDef.BULK_CATEGORY_DASHBOARD) {
        ret = await applyCmdListDashboard(cmd);
    } else if (cmd.category === CstDef.BULK_CATEGORY_HISTORY_UNAUTH_LOG) {
        ret = await applyCmdListHistoryUnauthLog(cmd);
    } else if (cmd.category === CstDef.BULK_CATEGORY_CONTROLLER) {
        ret = await applyCmdListController(cmd);
    } else if (cmd.category === CstDef.BULK_CATEGORY_MONITORING) {
        ret = await applyCmdListMonitoring(cmd);
    } else if (cmd.category === CstDef.BULK_CATEGORY_ACCOUNT) {
        ret = await applyCmdListAccount(cmd);
    } else if (cmd.category === CstDef.BULK_CATEGORY_SYSSET) {
        ret = await applyCmdListSysset(cmd);
    } else if (cmd.category === CstDef.BULK_CATEGORY_LOCATION) {
        ret = await applyCmdListLocation(cmd);
    } else {
        ret.msg = 'Invalid Category(' + String(cmd.category) + ')';
    }
    return ret;
}

export async function applyCmdListAccount(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.method === CstDef.BULK_METHOD_POST) {
    ret = await ApiAccounts.applyCmdListAccountPost(cmd);
  } 
  // else if (cmd.method === CstDef.BULK_METHOD_GET) {
  //   ret = await ApiAccounts.applyCmdListAccountGet(cmd);
  // } else if (cmd.method === CstDef.BULK_METHOD_PUT) {
  //   ret = await ApiAccounts.applyCmdListAccountPut(cmd);
  // } else if (cmd.method === CstDef.BULK_METHOD_DELETE) {
  //   ret = await ApiAccounts.applyCmdListAccountDelete(cmd);
  // } 
  else {
    ret.msg = 'Invalid Method(' + String(cmd.method) + ')';
  }
  return ret;
}

export async function applyCmdListDashboard(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
    if (cmd.method === CstDef.BULK_METHOD_POST) {
      ret = await ApiDashboard.applyCmdListDashboardPost(cmd);
    } else if (cmd.method === CstDef.BULK_METHOD_DELETE) {
      ret = await ApiDashboard.applyCmdListDashboardDelete(cmd);
    } else if (cmd.method === CstDef.BULK_METHOD_GET) {
      ret = await ApiDashboard.applyCmdListDashboardGet(cmd);
    } else if (cmd.method === CstDef.BULK_METHOD_PUT) {
      ret = await ApiDashboard.applyCmdListDashboardPut(cmd);
    } else {
      ret.result = CstDef.BULK_PROC_FAIL;
      ret.msg = 'Invalid Method(' + String(cmd.method) + ')';
    }
    return ret;
}

export async function applyCmdListHistoryUnauthLog(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.method === CstDef.BULK_METHOD_POST) {
    ret = await ApiHistory.applyCmdListHistoryUnauthLogPost(cmd);
  } else if (cmd.method === CstDef.BULK_METHOD_DELETE) {
    ret = await ApiHistory.applyCmdListHistoryUnauthLogDelete(cmd);
  } else if (cmd.method === CstDef.BULK_METHOD_GET) {
    ret = await ApiHistory.applyCmdListHistoryUnauthLogGet(cmd);
  }
  // else if (cmd.method === CstDef.BULK_METHOD_PUT) {
  //   ret = await ApiHistory.applyCmdListHistoryUnauthLogPut(cmd);
  // }
  else {
    ret.result = CstDef.BULK_PROC_FAIL;
    ret.msg = 'Invalid Method(' + String(cmd.method) + ')';
  }
  return ret;
}

export async function applyCmdListController(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.method === CstDef.BULK_METHOD_GET) {
    ret = await ApiController.applyCmdListControllerGet(cmd);
  } else if (cmd.method === CstDef.BULK_METHOD_POST) {
    ret = await ApiController.applyCmdListControllerPost(cmd);
  } else if (cmd.method === CstDef.BULK_METHOD_PUT) {
    ret = await ApiController.applyCmdListControllerPut(cmd);
  } else if (cmd.method === CstDef.BULK_METHOD_DELETE) {
    ret = await ApiController.applyCmdListControllerDelete(cmd);
  } else {
    ret.result = CstDef.BULK_PROC_FAIL;
    ret.msg = 'Invalid Method(' + String(cmd.method) + ')';
  }
  return ret;
}

export async function applyCmdListMonitoring(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.method === CstDef.BULK_METHOD_GET) {
    ret = await ApiMonitoring.applyCmdListMonitoringGet(cmd);
  } else {
    ret.result = CstDef.BULK_PROC_FAIL;
    ret.msg = 'Invalid Method(' + String(cmd.method) + ')';
  }
  return ret;
}

export async function applyCmdListSysset(cmd: Cmd): Promise<CmdResult> {
  let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
  if (cmd.method === CstDef.BULK_METHOD_POST) {
    ret = await ApiSysset.applyCmdListSyssetPost(cmd);
  } else if (cmd.method === CstDef.BULK_METHOD_GET) {
    ret = await ApiSysset.applyCmdListSyssetGet(cmd);
  } else if (cmd.method === CstDef.BULK_METHOD_PATCH) {
    ret = await ApiSysset.applyCmdListSyssetPatch(cmd);
  } else {
    ret.result = CstDef.BULK_PROC_FAIL;
    ret.msg = 'Invalid Method(' + String(cmd.method) + ')';
  }
  return ret;
}

export async function applyCmdListLocation(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
    if (cmd.method === CstDef.BULK_METHOD_POST) {
        ret = await ApiLocation.applyCmdListLocationPost(cmd);
    } else if (cmd.method === CstDef.BULK_METHOD_PUT) {
        ret = await ApiLocation.applyCmdListLocationPut(cmd);
    } else if (cmd.method === CstDef.BULK_METHOD_DELETE) {
        ret = await ApiLocation.applyCmdListLocationDelete(cmd);
    } else if (cmd.method === CstDef.BULK_METHOD_PATCH) {
        ret = await ApiLocation.applyCmdListLocationMove(cmd);
    } else if (cmd.method === CstDef.BULK_METHOD_GET) {
        ret = await ApiLocation.applyCmdListLocationGet(cmd);
    } else {
        ret.result = CstDef.BULK_PROC_FAIL;
        ret.msg = 'Invalid Method(' + String(cmd.method) + ')';
    }
    return ret;
}