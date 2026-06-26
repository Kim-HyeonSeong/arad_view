import * as CstDef from '../../../commons/CstDef';

export function getControllerCreateTokenToBulkCmd(controllerId : number) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_CONTROLLER,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION_CONTROLLER_CREATE_TOKEN,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
        data: {
            controller_id: controllerId,
        },
    },
  };

    cmd.content = '컨트롤러 토큰 생성. Controller ID : ' + controllerId;
    return cmd;
}

export function getControllerDeleteTokenToBulkCmd(controllerId : number) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_CONTROLLER,
        content: '',
        method: CstDef.BULK_METHOD_POST,
        action: CstDef.BULK_ACTION_CONTROLLER_DELETE_TOKEN,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            data: {
                controller_id: controllerId,
            },
        },
    };

    cmd.content = '컨트롤러 토큰 삭제. Controller ID : ' + controllerId;
    return cmd;
}

export function getControllerRegenerateTokenToBulkCmd(controllerId : number) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_CONTROLLER,
        content: '',
        method: CstDef.BULK_METHOD_POST,
        action: CstDef.BULK_ACTION_CONTROLLER_REGENERATE_TOKEN,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            data: {
                controller_id: controllerId,
            },
        },
    };

    cmd.content = '컨트롤러 토큰 재생성. Controller ID : ' + controllerId;
    return cmd;
}