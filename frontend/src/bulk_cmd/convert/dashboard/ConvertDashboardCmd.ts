import * as CstDef from '../../../commons/CstDef';

interface Cmd {
    type: string;
    id: string;
}

export function getDashboardServerStatusToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_DASHBOARD,
    content: '',
    method: CstDef.BULK_METHOD_GET,
    action: CstDef.BULK_ACTION_DASHBOARD_SERVER_STATUS,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: null,
    },
  };

  return cmd;
}

export function getDashboardDeviceStatusToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_DASHBOARD,
    content: '',
    method: CstDef.BULK_METHOD_GET,
    action: CstDef.BULK_ACTION_DASHBOARD_DEVICE_STATUS,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: null,
    },
  };

  return cmd;
}

export function getDashboardLocationSummaryToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_DASHBOARD,
    content: '',
    method: CstDef.BULK_METHOD_GET,
    action: CstDef.BULK_ACTION_DASHBOARD_LOCATION_SUMMARY,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: null,
    },
  };

  return cmd;
}

export function getDashboardUnauthLogsToBulkCmd(size: number) {
let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_DASHBOARD,
    content: '',
    method: CstDef.BULK_METHOD_GET,
    action: CstDef.BULK_ACTION_DASHBOARD_UNAUTH_LOGS,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: null,
      size: size,
    },
  };

  return cmd;
}