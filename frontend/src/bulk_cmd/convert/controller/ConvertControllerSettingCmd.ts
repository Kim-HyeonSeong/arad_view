import * as CstDef from '../../../commons/CstDef';
import * as CvtValStr from '../../../commons/ConvertValStr';
import { getLocationStr } from '../../../commons/LocationContext';

// 다중선택 필드가 빈 배열로 들어오면 undefined 로 치환 (JSON.stringify 단계에서 key 가 drop 됨 → BE 에는 NULL 로 인식).
function normalizeController(controller: any) {
  return {
    ...controller,
    homenet_id: controller?.homenet_id?.length ? controller.homenet_id : undefined,
    constructor_id: controller?.constructor_id?.length ? controller.constructor_id : undefined,
  };
}

export function getControllerShowAllToBulkCmd() {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_CONTROLLER,
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

export function getControllerCreateToBulkCmd(controller : any) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_CONTROLLER,
    content: '',
    method: CstDef.BULK_METHOD_POST,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_ADD,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: normalizeController(controller),
    },
  };

  cmd.content = getContentCreateController(cmd.info);

  return cmd;
}

export function getControllerModifyToBulkCmd(controller : any) {
  let cmd = {
    seq_id: 0,
    category: CstDef.BULK_CATEGORY_CONTROLLER,
    content: '',
    method: CstDef.BULK_METHOD_PUT,
    action: CstDef.BULK_ACTION,
    fail: CstDef.BULK_FAIL_STOP,
    rollback: CstDef.BULK_ROLLBACK_SKIP,
    result: CstDef.BULK_PROC_DEFAULT,
    msg: '',
    info: {
      data: normalizeController(controller),
    },
  };
  
  cmd.content = getContentModifyController(cmd.info);

  return cmd;
}

// 여러 컨트롤러를 한 번에 삭제. records 의 id 만 모아 ids 배열로 전달.
// name 은 BulkCmdList "내용" 표시용 (실제 백엔드 호출엔 ids 만 쓰임).
export function getControllerDeleteToBulkCmd(records: Array<{ id: number; name: string }>) {
    const ids = records.map((r) => r.id);
    const names = records.map((r) => r.name);

    let cmd = {
        seq_id: 0,
        category: CstDef.BULK_CATEGORY_CONTROLLER,
        content: '',
        method: CstDef.BULK_METHOD_DELETE,
        action: CstDef.BULK_ACTION,
        fail: CstDef.BULK_FAIL_STOP,
        rollback: CstDef.BULK_ROLLBACK_SKIP,
        result: CstDef.BULK_PROC_DEFAULT,
        msg: '',
        info: {
            ids: ids,
            names: names,   // 표시 전용
        },
    };

    cmd.content = getContentDeleteController(cmd.info);

    return cmd;
}

function getContentCreateController(info: { data: any }): string {
  const content =
    'Create. Controller Name: ' + String(info.data.name) +
    ', IP: ' + String(info.data.ip) +
    ', Port: ' + String(info.data.port) +
    ', location: ' + getLocationStr(info.data.location_id) +
    ', Construction Company: ' + CvtValStr.getConstructorStr(info.data.constructor_id) +
    ', Homenet Company: ' + CvtValStr.getWallPadStr(info.data.homenet_id) +
    ', Description: ' + String(info.data.description);
  return content;
}

function getContentModifyController(info: { data: any }): string {
  const content =
    'Modify. ' +  
    'Controller Name: ' + String(info.data.name) +
    ', ID: ' + String(info.data.id) +
    ', IP: ' + String(info.data.ip) +
    ', Port: ' + String(info.data.port) +
    ', location: ' + getLocationStr(info.data.location_id) +
    ', Construction Company: ' + CvtValStr.getConstructorStr(info.data.constructor_id) +
    ', Homenet Company: ' + CvtValStr.getWallPadStr(info.data.homenet_id) +
    ', Description: ' + String(info.data.description);
  return content;
}

function getContentDeleteController(info: { ids: number[]; names: string[] }) {
    const count = info.ids.length;
    const preview = info.names
        .slice(0, 3)
        .map((name, idx) => `${name}(${info.ids[idx]})`)
        .join(', ');
    const more = count > 3 ? ` 외 ${count - 3}개` : '';
    return `Delete ${count}개. ${preview}${more}`;
}