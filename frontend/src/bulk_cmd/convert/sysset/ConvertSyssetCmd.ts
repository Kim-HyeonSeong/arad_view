import * as CstDef from '../../../commons/CstDef';

export function getSyssetInfoToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_SYSSET,
    content: '',
    method: CstDef.BULK_METHOD_GET,
    action: CstDef.BULK_ACTION,
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

export function getSyssetOneInfoToBulkCmd(key: string) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_SYSSET,
    content: '',
    method: CstDef.BULK_METHOD_GET,
    action: CstDef.BULK_ACTION_ONE,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      key: key,
      data: null,
    },
  };

  return cmd;
}

export function getSyssetResetToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_SYSSET,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: null,
    },
  };

  cmd.content = 'Reset. System Setting to Default Values';

  return cmd;
}

export function getSyssetModifyToBulkCmd(info: any) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_SYSSET,
    content: '',
    method: CstDef.BULK_METHOD_PATCH,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: info,
    },
  };

    cmd.content = getContentModifySysset(cmd.info);
    return cmd;
}

function getContentModifySysset(info: any): string {
    const changes = (info?.data?.changes ?? []) as Array<{ key: string; value: string }>;
    const content = 'Modify. ' + changes.map((c) => `${c.key} : ${c.value}`).join(', ');

    return content;
}