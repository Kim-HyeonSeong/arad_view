interface UserInfo {
  id: string;
  name: string;
  perm: string;  // JWT claims.role 그대로 저장 ('admin' 등)
}

export function getUserInfo(): UserInfo | null {
  const userInfoString = sessionStorage.getItem('user_info');
  if (userInfoString) {
    return JSON.parse(userInfoString);
  }
  return null;
}

export function setUserInfo(userInfo: UserInfo) {
  sessionStorage.setItem('user_info', JSON.stringify(userInfo));
}

export function getUserName(): string | null {
  const userInfo = getUserInfo();
  if (userInfo == null) {
    return null;
  }
  return String(userInfo.name);
}

export function setUserName(name: string) {
  const userInfo = getUserInfo();
  if (userInfo == null) {
    return;
  }
  userInfo.name = name;
  setUserInfo(userInfo);
}

export function getUserId(): string | null {
  const userInfo = getUserInfo();
  if (userInfo && userInfo.id) {
    return String(userInfo.id);
  }
  return null;
}

export function getIsAdmin(): boolean {
  const userInfo = getUserInfo();
  if (userInfo == null) {
    return false;
  }
  return userInfo.perm === 'admin';
}

export function getIsNotAdmin(): boolean {
  const userInfo = getUserInfo();
  if (userInfo == null) {
    return true;
  }
  return userInfo.perm === 'operator' || userInfo.perm === 'guest';
}

export function getAllowSetting(): boolean {
  const userInfo = getUserInfo();
  if (userInfo == null) {
    return false;
  }
  return userInfo.perm === 'admin' || userInfo.perm === 'operator';
}

export async function getDigestPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
