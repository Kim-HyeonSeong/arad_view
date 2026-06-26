import axios from "axios";
import { api } from "../../../api/Axios";
import * as CstDef from "../../../commons/CstDef";
import type { CmdResult } from "../../../commons/Types";

const API_URL = '/api/v1/controllers/agent';

// BE 에러 응답을 항상 string 으로 정규화. object 가 들어가면 BulkCmdList 의 메시지 컬럼이
// React child 로 객체를 렌더하다 터짐 (white screen) — 반드시 string 으로 평탄화한다.
// 친숙한 한글 메시지가 필요한 code 는 여기서 분기 처리.
function extractErrorMsg(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === 'string') return data;
        if (data && typeof data === 'object') {
            const code = (data as { code?: string }).code;
            const msg = (data as { message?: string }).message;
            // 자주 발생하는 도메인 에러 코드 → 한글 메시지 매핑
            if (code === 'AGENT_TOKEN_ALREADY_ACTIVE') {
                return '이미 활성 토큰이 존재합니다. 재발급(regenerate) 을 사용하세요.';
            }
            return msg || code || JSON.stringify(data);
        }
        return error.message || 'request failed';
    }
    return String(error);
}

export async function createAgentToken(controllerId: number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.post(API_URL +'/'+ controllerId+'/token');
        ret.result = CstDef.BULK_PROC_SUCCESS;
        // BE 응답 shape: { id, token } — 평문 token 을 1회만 노출. token 필드를 우선 꺼냄.
        ret.data = response.data?.token ?? response.data?.message ?? response.data ?? null;
        return ret;
    } catch (error) {
        ret.msg = extractErrorMsg(error);
        return ret;
    }
}

export async function deleteAgentToken(controllerId: number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.post(API_URL +'/'+ controllerId+'/revoke');
        ret.result = CstDef.BULK_PROC_SUCCESS;
        ret.data = response.data?.message ?? response.data ?? null;
        return ret;
    } catch (error) {
        ret.msg = extractErrorMsg(error);
        return ret;
    }
}

export async function regenerateAgentToken(controllerId: number): Promise<CmdResult> {
    const ret: CmdResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
        id: null,
    };

    try {
        const response = await api.post(API_URL +'/'+ controllerId+'/regenerate');
        ret.result = CstDef.BULK_PROC_SUCCESS;
        // BE 응답 shape: { id, token } — 재발급된 평문 token 을 1회만 노출.
        ret.data = response.data?.token ?? response.data?.message ?? response.data ?? null;
        return ret;
    } catch (error) {
        ret.msg = extractErrorMsg(error);
        return ret;
    }
}