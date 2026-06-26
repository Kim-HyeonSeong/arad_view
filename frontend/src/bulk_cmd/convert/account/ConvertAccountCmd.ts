import * as CstDef from '../../../commons/CstDef';

export function getLoginToBulkCmd(id: string, pw: string) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_ACCOUNT,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION_LOGIN,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: {
        username: id,
        password: pw,
      },
    },
  };

  return cmd;
}

export function getLogOutToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_ACCOUNT,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION_LOGOUT,
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

export function getChangePwToBulkCmd(currentPassword: string, newPassword: string) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_ACCOUNT,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION_CHANGE_PW,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: {
        currentPassword,
        newPassword,
      },
    },
  };

  return cmd;
}

export function getInitPwChange(username: string, currentPassword: string, newPassword: string) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_ACCOUNT,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION_INIT_CHANGE_PW,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: {
        username: username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
    },
  };

  return cmd;
}

export function getPassChangePwToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_ACCOUNT,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION_PASS_CHANGE_PW,
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

export function getAccountShowAllToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_ACCOUNT,
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

export function getAccountCreateToBulkCmd(acc : any) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_ACCOUNT,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_ADD,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: acc,
    },
  };

  cmd.content = getContentCreateAccount(cmd.info);

  return cmd;
}

export function getAccountModifyToBulkCmd(acc : any) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_ACCOUNT,
    content: '',
    method: CstDef.BULK_METHOD_PUT,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      acc_id : acc.id,
      acc_admin_id: acc.admin_id,
      acc_admin_name: acc.admin_name,
      acc_name: acc.admin_name,
      data: acc,
    },
  };

  cmd.content = getContentModifyAccount(cmd.info);

  return cmd;
}

export function getAccountDeleteToBulkCmd(acc : any) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_ACCOUNT,
        content: '',
        method: CstDef.BULK_METHOD_DELETE,
        action: CstDef.BULK_ACTION,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            acc_id: acc.id,
            acc_admin_id: acc.admin_id,
            acc_name: acc.admin_name,
        },
    };

    cmd.content = getContentDeleteAccount(cmd.info);

    return cmd;
}

//content
export function getContentCreateAccount(info: { data: any }): string {
  const content =
    'Create. admin_login_id: ' + String(info.data.admin_id) +
    ', admin_name: ' + String(info.data.admin_name) +
    ', password: ' + String(info.data.password) +
    ', permission: ' + String(info.data.permission) +
    ', phone: ' + String(info.data.phone);
  return content;
}

export function getContentModifyAccount(info: { acc_id: Number, acc_admin_id: string, acc_admin_name: string, acc_name: string, data: any }): string {
  let content =
    'Modify. admin_id: ' + Number(info.acc_id) +
    ', admin_login_id: ' + String(info.acc_admin_id) +
    ', admin_name: ' + String(info.acc_admin_name);
  if (info.data.password !== undefined) {
    content += ', password: ' + String(info.data.password);
  }
  content +=
    ', permission: ' + String(info.data.permission) +
    ', phone: ' + String(info.data.phone);
  return content;
}

export function getContentDeleteAccount(info: { acc_id: string, acc_admin_id: string, acc_name: string }): string {
  const content =
    'Delete. ' + String(info.acc_name) + '(' + 
    String(info.acc_admin_id) + ', ' + 
    String(info.acc_id) + ')';
  return content;
}