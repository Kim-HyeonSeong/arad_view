import axios from 'axios';
import { message } from 'antd';

let isTokenRefreshing = false;

// 백엔드 주소:
//  - dev: 항상 빈 문자열 (vite proxy가 /api/* 를 백엔드로 forward) → 브라우저 입장에선 same-origin
//    VITE_API_URL은 vite.config.ts의 proxy target에서만 사용됨 (axios는 무시)
//  - prod: VITE_API_URL이 있으면 명시된 URL 사용, 없으면 same-origin
export const getBaseURL = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return '';
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 30000,
});

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

const api_wo_to = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

api_wo_to.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${sessionStorage.getItem('access_token')}`;
  return config;
});

// 응답 인터셉터 - 토큰 자동 갱신 + 에러 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Timeout
    if (error.code === 'ECONNABORTED' || error.response?.status === 408) {
      console.error('Request timeout');
      return Promise.reject(error);
    }

    const { config, response: { status } = {} } = error;

    if (status === 401 && config) {
      // 이미 갱신 시도한 요청은 무한루프 방지
      if (config._retry) {
        return Promise.reject(error);
      }

      // /refresh 자체가 401이면 RT도 만료 → 로그인 페이지로
      if (typeof config.url === 'string' && config.url.includes('/auth/refresh')) {
        sessionStorage.clear();
        message.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.hash = '/login';
        return Promise.reject(error);
      }

      // 다른 요청이 이미 갱신 중이면 대기 후 재시도
      if (isTokenRefreshing) {
        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (!isTokenRefreshing) {
              clearInterval(interval);
              const newToken = sessionStorage.getItem('access_token');
              if (newToken) {
                config._retry = true;
                config.headers.Authorization = `Bearer ${newToken}`;
                resolve(api(config));
              } else {
                reject(error);
              }
            }
          }, 200);
        });
      }

      // 토큰 갱신 시도
      isTokenRefreshing = true;
      const refreshToken = sessionStorage.getItem('refresh_token');

      if (!refreshToken) {
        isTokenRefreshing = false;
        sessionStorage.clear();
        window.location.hash = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${baseURL}/api/v1/auth/refresh`,
          { refresh_token: refreshToken },
        );

        if (data?.access_token && data?.refresh_token) {
          sessionStorage.setItem('access_token', data.access_token);
          sessionStorage.setItem('refresh_token', data.refresh_token);
          isTokenRefreshing = false;

          // 원래 요청 재시도
          config._retry = true;
          config.headers.Authorization = `Bearer ${data.access_token}`;
          return api(config);
        }
        throw new Error('Token refresh failed: empty response');
      } catch (refreshError) {
        isTokenRefreshing = false;
        console.error('Refresh failed:', refreshError);
        sessionStorage.clear();
        message.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.hash = '/login';
        return Promise.reject(refreshError);
      }
    } else if (status === 403 || status === 504) {
      sessionStorage.clear();
      window.location.hash = '/login';
    }

    return Promise.reject(error);
  },
);

// 인증이 필요하지 않은 API 요청을 위한 별도의 Axios 인스턴스
const unauthApi = axios.create({
  baseURL: baseURL,
});

export { api, api_wo_to, unauthApi };
