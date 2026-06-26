import * as CstDef from '../../../commons/CstDef';
import type { Cmd, CmdResult } from "../../../commons/Types";
import * as BulkCmdApiLocation from './BulkCmdApiLocation';

export async function applyCmdListLocationGet(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
    if (cmd.action === CstDef.BULK_ACTION) {
        ret = await BulkCmdApiLocation.getLocationData();
    } else if (cmd.action === CstDef.BULK_ACTION_LOCATION_ONE) {
        // converter 가 { regionId } 객체로 감싸 보내므로 그 안에서 꺼냄.
        const data = (cmd.info as { data?: { regionId?: number } })?.data;
        const regionId = Number(data?.regionId ?? NaN);
        if (isNaN(regionId)) {
            ret.msg = 'Invalid region ID in cmd.info.data.regionId: ' + String(data?.regionId);
            return ret;
        }
        ret = await BulkCmdApiLocation.getLocationOneData(regionId);
    } else if (cmd.action === CstDef.BULK_ACTION_LOCATION_DESCENDANT) {
        const data = (cmd.info as { data?: { regionId?: number } })?.data;
        const regionId = Number(data?.regionId ?? NaN);
        if (isNaN(regionId)) {
            ret.msg = 'Invalid region ID in cmd.info.data.regionId: ' + String(data?.regionId);
            return ret;
        }
        ret = await BulkCmdApiLocation.getLocationDescendantData(regionId);
    } else {
        ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
    }
    return ret;
}

export async function applyCmdListLocationPost(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
    if (cmd.action === CstDef.BULK_ACTION) {
        // converter 가 location 정보를 cmd.info.data 에 박음. Cmd.info 가 {} 타입이라 캐스팅 필요.
        const data = (cmd.info as { data?: any })?.data;
        ret = await BulkCmdApiLocation.createLocationData(data);
    } else {
        ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
    }
    return ret;
}

export async function applyCmdListLocationPut(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
    if (cmd.action === CstDef.BULK_ACTION) {
        // modify 도 동일하게 cmd.info.data 안에 위치 전체가 들어있음. id 는 그 안에서 꺼냄.
        const data = (cmd.info as { data?: { id?: number | string; [k: string]: any } })?.data;
        if (!data) {
            ret.msg = 'cmd.info.data 가 비어있습니다';
            return ret;
        }
        const regionId = Number(data.id ?? NaN);
        if (isNaN(regionId)) {
            ret.msg = 'Invalid region ID in cmd.info.data.id: ' + String(data.id);
            return ret;
        }
        ret = await BulkCmdApiLocation.modifyLocationData(regionId, data as Partial<BulkCmdApiLocation.LocationCreatePayload>);
    } else {
        ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
    }
    return ret;
}

export async function applyCmdListLocationDelete(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
    if (cmd.action === CstDef.BULK_ACTION) {
        // converter 가 { regionId } 객체로 감싸 보내므로 그 안에서 꺼냄.
        const data = (cmd.info as { data?: { regionId?: number } })?.data;
        const regionId = Number(data?.regionId ?? NaN);
        if (isNaN(regionId)) {
            ret.msg = 'Invalid region ID in cmd.info.data.regionId: ' + String(data?.regionId);
            return ret;
        }
        ret = await BulkCmdApiLocation.deleteLocationData(regionId);
    } else {
        ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
    }
    return ret;
}

export async function applyCmdListLocationMove(cmd: Cmd): Promise<CmdResult> {
    let ret: CmdResult = { result: CstDef.BULK_PROC_FAIL, msg: '' };
    if (cmd.action === CstDef.BULK_ACTION) {
        // converter 가 { regionId, parent_id } 객체로 감싸 보내므로 두 값 모두 꺼냄.
        const data = (cmd.info as { data?: { regionId?: number; parent_id?: number } })?.data;
        if (!data) {
            ret.msg = 'cmd.info.data 가 비어있습니다';
            return ret;
        }
        const regionId = Number(data.regionId ?? NaN);
        const parent_id = Number(data.parent_id ?? NaN);
        if (isNaN(regionId) || isNaN(parent_id)) {
            ret.msg = 'Invalid region ID or parent ID in cmd.info.data: ' + String(data.regionId) + ', ' + String(data.parent_id);
            return ret;
        }
        ret = await BulkCmdApiLocation.moveLocationData(regionId, { parent_id });
    } else {
        ret.msg = 'Invalid Action(' + String(cmd.action) + ')';
    }
    return ret;
}