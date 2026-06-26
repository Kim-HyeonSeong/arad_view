// 개발 빌드에서만 console 출력. 운영 빌드에서는 Vite 가 dead-code 로 제거.
// Vite 의 import.meta.env.DEV 는 `vite` 실행 시 true, `vite build` 결과물에선 false.

export const devLog = (...args: unknown[]): void => {
  if (import.meta.env.DEV) {
    console.log(...args);
  }
};

export const devWarn = (...args: unknown[]): void => {
  if (import.meta.env.DEV) {
    console.warn(...args);
  }
};

export const devError = (...args: unknown[]): void => {
  if (import.meta.env.DEV) {
    console.error(...args);
  }
};
