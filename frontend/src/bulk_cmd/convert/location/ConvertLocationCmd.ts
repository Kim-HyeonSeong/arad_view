import * as CstDef from '../../../commons/CstDef';

export function getLocationShowAllToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_LOCATION,
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

export function getLocationShowOneToBulkCmd(regionId: number) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_LOCATION,
        content: '',
        method: CstDef.BULK_METHOD_GET,
        action: CstDef.BULK_ACTION_LOCATION_ONE,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            data: {
                regionId : regionId,
            },
        },
    };
    return cmd;
}

export function getLocationShowDescendantToBulkCmd(regionId: number) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_LOCATION,
        content: '',
        method: CstDef.BULK_METHOD_GET,
        action: CstDef.BULK_ACTION_LOCATION_DESCENDANT,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            data: {
                regionId : regionId,
            },
        },
    };
    return cmd;
}

export function getLocationCreateToBulkCmd(location : any) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_LOCATION,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_ADD,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: location,
    },
  };

  cmd.content = getContentCreateLocation(cmd.info);

  return cmd;
}

export function getLocationModifyToBulkCmd(location : any) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_LOCATION,
    content: '',
    method: CstDef.BULK_METHOD_PUT,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: location,
    },
  };

  cmd.content = getContentModifyLocation(cmd.info);
  
  return cmd;
}

export function getLocationDeleteToBulkCmd(regionId: number) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_LOCATION,
    content: '',
    method: CstDef.BULK_METHOD_DELETE,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
        data: {
            regionId : regionId,
        },
    },
  };

  cmd.content = getContentDeleteLocation(cmd.info);

  return cmd;
}

export function getLocationMoveToBulkCmd(regionId: number, newParentId: number) {
    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_LOCATION,
        content: '',
        method: CstDef.BULK_METHOD_PATCH,
        action: CstDef.BULK_ACTION,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            data: {
                regionId : regionId,
                // BE payload 와 동일한 키로 통일.
                parent_id : newParentId,
            },
        },
    };

    cmd.content = getContentMoveLocation(cmd.info);

    return cmd;
}

function getContentCreateLocation(info: { data: any }): string {
    const content =
        'Create. Location Name: ' + String(info.data.name) +
        ', Parent ID: ' + String(info.data.parent_id) +
        ', Code: ' + String(info.data.code) +
        ', Latitude: ' + String(info.data.lat) +
        ', Longitude: ' + String(info.data.lng)
    return content;
}

function getContentModifyLocation(info: { data: any }): string {
    const content =
        'Modify. Location ID: ' + String(info.data.id) +
        ', Location Name: ' + String(info.data.name) +
        ', Parent ID: ' + String(info.data.parent_id) +
        ', Code: ' + String(info.data.code) +
        ', Latitude: ' + String(info.data.lat) +
        ', Longitude: ' + String(info.data.lng)
    return content;
}

function getContentDeleteLocation(info: { data: any }): string {
    const content =
        'Delete. Location ID: ' + String(info.data.regionId);
    return content;
}

function getContentMoveLocation(info: { data: any }): string {
    const content =
        'Move. Location ID: ' + String(info.data.regionId) +
        ', New Parent ID: ' + String(info.data.parent_id);
    return content;
}