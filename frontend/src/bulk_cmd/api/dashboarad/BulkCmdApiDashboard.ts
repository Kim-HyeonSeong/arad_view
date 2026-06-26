import axios from "axios";
import { api } from "../../../api/Axios";
import * as CstDef from "../../../commons/CstDef";
import type { CmdResult } from "../../../commons/Types";

const API_URL = '/api/v1/dashboard/';

interface DashboardInfo {
  type: string;
}

export async function showServerStatus(): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + 'server_status');

        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data?.message ?? response.data ?? null;
        console.log('Server Status Response:', response.data);
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

export async function showDeviceStatus(): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + 'device_status');

        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data?.message ?? response.data ?? null;
        console.log('Device Status Response:', response.data);
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

export async function showLocationSummary(): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + 'location_summary');

        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data?.message ?? response.data ?? null;
        console.log('Location Summary Response:', response.data);
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

export async function showUnauthLogs(size: number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + 'unauth_logs', {
            params: { size },
        });
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        console.log('Unauth Logs Response:', response.data);
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