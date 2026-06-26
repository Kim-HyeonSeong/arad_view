import axios from "axios";
import { api } from "../../../api/Axios";
import * as CstDef from "../../../commons/CstDef";
import { devLog } from "../../../commons/Logger";
import type { CmdResult } from "../../../commons/Types";

const API_URL = '/api/v1/locations';

// POST /api/v1/locations 요청 body 스키마.
// 주의: 루트는 parent_id=0 으로 보내야 함 (BE 규약). GET 응답은 root 를 null 로 내려주므로
// 호출 측에서 null → 0 변환 필요.
export interface LocationCreatePayload {
    parent_id: number;
    name: string;
    code: string;
    lat: number;
    lng: number;
}

export interface LocationMovePayload {
    parent_id: number;
}

// /locations 응답 wrapping. items 와 total 둘 다 호출자에게 노출.
export interface LocationListData {
    items: unknown[];   // 호출 측에서 RegionItem[] 등으로 캐스팅.
    total: number;
}

export async function getLocationData(): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        // items + total 을 한 번에 노출. 호출자는 ret.data 를 LocationListData 로 캐스팅해서 사용.
        const payload: LocationListData = {
            items: response.data?.items ?? [],
            total: response.data?.total ?? 0,
        };
        ret.data = payload;
        devLog('GET locations response:', response.data);
        return ret;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            if (typeof data === 'string') {
                ret.msg = data;
            } else if (data && typeof data === 'object' && 'message' in data) {
                ret.msg = String((data as { message: unknown }).message);
            } else {
                ret.msg = String(data ?? error.message);
            }
        } else {
            ret.msg = String(error);
        }
        return ret;
    }
}

export async function getLocationOneData(regionId: number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + '/' + regionId);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        devLog(`GET location one response:`, response.data);
        return ret;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            if (typeof data === 'string') {
                ret.msg = data;
            }
            else if (data && typeof data === 'object' && 'message' in data) {
                ret.msg = String((data as { message: unknown }).message);
            }
            else {
                ret.msg = String(data ?? error.message);
            }
        }        else {
            ret.msg = String(error);
        }
        return ret;
    }
}

export async function getLocationDescendantData(regionId: number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + '/' + regionId + '/descendants');
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        devLog(`GET location descendant response:`, response.data);
        return ret;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            if (typeof data === 'string') {
                ret.msg = data;
            }
            else if (data && typeof data === 'object' && 'message' in data) {
                ret.msg = String((data as { message: unknown }).message);
            }
            else {
                ret.msg = String(data ?? error.message);
            }
        }        else {
            ret.msg = String(error);
        }
        return ret;
    }
}


export async function createLocationData(infodata: LocationCreatePayload): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.post(API_URL, infodata);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        devLog(`POST location create response:`, response.data);
        return ret;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            if (typeof data === 'string') {
                ret.msg = data;
            }
            else if (data && typeof data === 'object' && 'message' in data) {
                ret.msg = String((data as { message: unknown }).message);
            }
            else {
                ret.msg = String(data ?? error.message);
            }
        }        else {
            ret.msg = String(error);
        }
        return ret;
    }   
}

export async function modifyLocationData(regionId: number, infoData: Partial<LocationCreatePayload>): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.put(API_URL + '/' + regionId, infoData);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        devLog(`PUT location modify response:`, response.data);
        return ret;
    } catch (error) {        
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            if (typeof data === 'string') {
                ret.msg = data;
            }
            else if (data && typeof data === 'object' && 'message' in data) {
                ret.msg = String((data as { message: unknown }).message);
            }
            else {
                ret.msg = String(data ?? error.message);
            }
        }        else {
            ret.msg = String(error);
        }
        return ret;
    }
}

export async function deleteLocationData(regionId: number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.delete(API_URL + '/' + regionId);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        devLog(`DELETE location response:`, response.data);
        return ret;
        } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            if (typeof data === 'string') {
                ret.msg = data;
            }
            else if (data && typeof data === 'object' && 'message' in data) {
                ret.msg = String((data as { message: unknown }).message);
            }
            else {                
                ret.msg = String(data ?? error.message);
            }
        }        else {
            ret.msg = String(error);
        }
        return ret;
    }
}

export async function moveLocationData(regionId: number, infoData: LocationMovePayload): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.patch(API_URL + '/' + regionId + '/parent', infoData);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        devLog(`PATCH location move response:`, response.data);
        return ret;
        } catch (error) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            if (typeof data === 'string') {
                ret.msg = data;
            }
            else if (data && typeof data === 'object' && 'message' in data) {
                ret.msg = String((data as { message: unknown }).message);
            }
            else {                
                ret.msg = String(data ?? error.message);
            }
        }        else {
            ret.msg = String(error);
        }
        return ret;
    }
}
