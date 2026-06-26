import axios from "axios";
import { api } from "../../../api/Axios";
import * as CstDef from "../../../commons/CstDef";
import type { CmdResult } from "../../../commons/Types";

const API_URL = '/api/v1/monitoring';

export async function getMonitoringCategoryData(category: string, id : number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + '/' + category + '/' + id);
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        console.log('Monitoring Category Response:', response.data);
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

export async function getMonitoringSummary(category: string, id : number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + '/' + category + '/' + id + '/summary');
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        console.log('Monitoring Summary Response:', response.data);
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

export async function getMonitoringUnauthLog(category: string, id : number, size: number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.get(API_URL + '/' + category + '/' + id + '/unauth_logs', { params: { size } });
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data ?? null;
        console.log('Monitoring Unauth Log Response:', response.data);
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
