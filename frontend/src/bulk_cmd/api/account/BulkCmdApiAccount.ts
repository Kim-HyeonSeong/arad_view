import axios from "axios";
import { api } from "../../../api/Axios";
import * as CstDef from "../../../commons/CstDef";

const API_URL = '/api/v1/auth';

interface LoginResult {
    result: number;
    msg: string;
    data: LoginResponse | null;
}

export interface LoginResponse {
    access_token: string;       // JWT (1시간)
    refresh_token: string;      // opaque random (24시간)
    password_expired?: boolean; // true → 만료 분기 (토큰 발급됐지만 변경/연기 모달 띄워야 함)
}

// 백엔드 에러 응답 형식: { code, message }
interface ErrorResponse {
    code?: string;
    message?: string;
}

// axios 에러에서 표시 가능한 string 메시지 추출
function extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as ErrorResponse | string | undefined;
        if (typeof data === 'string') return data;
        if (data && typeof data === 'object' && data.message) return data.message;
        return error.message;
    }
    if (error instanceof Error) return error.message;
    return String(error);
}

/**
 * 로그인 API
 * @param username 사용자 ID
 * @param password SHA-256으로 해시된 비밀번호
 */
export async function login(username: string, password: string): Promise<LoginResult> {
    const ret: LoginResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
    };

    try {
        const response = await api.post<LoginResponse>(API_URL + '/login', { username, password });

        if (response.data) {
            ret.result = CstDef.BULK_PROC_SUCCESS;
            ret.data = response.data;
        }
        return ret;
    } catch (error) {
        // 428: 비밀번호 변경 필요 — 정상 응답으로 분류
        if (axios.isAxiosError(error) && error.response?.status === 428) {
            ret.result = CstDef.BULK_PROC_PASSWORD_CHANGE_REQUIRED;
            ret.msg = 'PASSWORD_CHANGE_REQUIRED';
            return ret;
        }
        ret.msg = extractErrorMessage(error);
        return ret;
    }
}

export async function logout(): Promise<void> {
    try {
        await api.post(API_URL + '/logout');
    } catch (error) {
        console.error('Logout failed:', error);
    }
}

export async function refreshToken(): Promise<LoginResult> {
    const ret: LoginResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
    };

    try {
        const response = await api.post<LoginResponse>(API_URL + '/reissue', {
            id: sessionStorage.getItem('user_id'),
            token: sessionStorage.getItem('refresh_token'),
        });
        
        if (response.data) {
            ret.result = CstDef.BULK_PROC_SUCCESS;
            ret.data = response.data;
        }
        return ret;
    } catch (error) {
        ret.msg = extractErrorMessage(error);
        return ret;
    }
}

export async function passwordPass(): Promise<LoginResult> {
    const ret: LoginResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
    };

    try {
        const response = await api.post(API_URL + '/password/defer');

        if (response.data) {
            ret.result = CstDef.BULK_PROC_SUCCESS;
            ret.data = response.data['message'];
        }
        return ret;
    } catch (error) {
        ret.msg = extractErrorMessage(error);
        return ret;
    }
}

/**
 * 자발적 비밀번호 변경 (로그인된 상태에서)
 * POST /api/v1/auth/change-password (AuthRequired)
 */
export async function passwordChange(currentPassword: string, newPassword: string): Promise<LoginResult> {
    const ret: LoginResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
    };

    try {
        const response = await api.post(API_URL + '/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
        });
        if (response.status >= 200 && response.status < 300) {
            ret.result = CstDef.BULK_PROC_SUCCESS;
            ret.data = response.data ?? null;
        }
        return ret;
    } catch (error) {
        ret.msg = extractErrorMessage(error);
        return ret;
    }
}

/**
 * 강제 비밀번호 변경 (require_password_change=1 → 428 응답 후 사용)
 * POST /api/v1/auth/initial-password-change (인증 불필요)
 */
export async function initialPasswordChange(
    username: string,
    currentPassword: string,
    newPassword: string,
): Promise<LoginResult> {
    const ret: LoginResult = {
        result: CstDef.BULK_PROC_FAIL,
        msg: '',
        data: null,
    };

    try {
        const response = await api.post(API_URL + '/initial-password-change', {
            username,
            current_password: currentPassword,
            new_password: newPassword,
        });
        if (response.status >= 200 && response.status < 300) {
            ret.result = CstDef.BULK_PROC_SUCCESS;
            ret.data = response.data ?? null;
        }
        return ret;
    } catch (error) {
        ret.msg = extractErrorMessage(error);
        return ret;
    }
}
