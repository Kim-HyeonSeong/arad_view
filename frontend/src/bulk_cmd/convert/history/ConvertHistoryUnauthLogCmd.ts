import * as CstDef from '../../../commons/CstDef';

export function getHistoryUnauthLogShowToBulkCmd(type: string, page: number, search: string | null) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_HISTORY_UNAUTH_LOG,
    content: '',
    method: CstDef.BULK_METHOD_GET,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      type: type,
      page: page,
      search: search,
      data: null,
    },
  };

  return cmd;
}