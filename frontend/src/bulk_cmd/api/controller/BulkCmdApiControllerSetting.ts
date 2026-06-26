import axios from "axios";
import { api } from "../../../api/Axios";
import * as CstDef from "../../../commons/CstDef";
import type { CmdResult } from "../../../commons/Types";

const API_URL = '/api/v1/controllers';


export async function getControllerData(): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data?.message ?? response.data ?? null;
        console.log('Controller Data Response:', response.data);
        return ret;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            ret.msg = error.response?.data;
        } else {
            ret.msg = String(error);
        }
        return ret;
    }
}

export async function createController(any: any): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.post(API_URL, any);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data?.message ?? response.data ?? null;
        console.log('Controller Create Response:', response.data);
        return ret;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            ret.msg = error.response?.data;
        } else {
            ret.msg = String(error);
        }
        return ret;
    }
}

export async function modifyController(id: string, any:any): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.put(API_URL +'/'+ id, any);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data?.message ?? response.data ?? null;
        console.log('Controller Modify Response:', response.data);
        return ret;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            ret.msg = error.response?.data;
        } else {
            ret.msg = String(error);
        }
        return ret;
    }
}

// ids 배열을 한 번의 DELETE 호출로 전송. body 로 { ids } 전달.
// 백엔드가 다른 컨벤션 (예: POST /bulk-delete) 을 쓰면 method/path 수정 필요.
export async function deleteController(ids: number[]): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.delete(API_URL, { data: { ids } });
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
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