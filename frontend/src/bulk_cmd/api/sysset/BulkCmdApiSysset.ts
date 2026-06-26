import axios from "axios";
import { api } from "../../../api/Axios";
import * as CstDef from "../../../commons/CstDef";
import type { CmdResult } from "../../../commons/Types";

const API_URL = '/api/v1/settings';

export async function getSyssetInfo(): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data.items ?? null;
        console.log('response:', response.data);
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

//단건 조회
export async function getSyssetOneInfo(key: string): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + '/' + key);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        console.log('response:', response.data);
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

export async function updateSyssetInfo(info: any): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.patch(API_URL, info);
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

export async function resetSyssetInfo(info: any): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.post(API_URL + '/reset', info);
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