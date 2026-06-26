import * as CstDef from './CstDef.ts';
import * as CompanyList from './CompanyList.ts';
import * as SpnTypeList from './SpnTypeList.ts';
import * as RegionList from './RegionList.ts';

export function getDvcTpToStr(val: number) {
  for (let item of SpnTypeList.AllDeviceList) {
    if (item.value === val) {
      return String(item.label);
    }
  }
  return '---';
}

export function getDvcTpStrToVal(val : string) {
  for (let item of SpnTypeList.AllDeviceList) {
    if (item.label === val) {
      return Number(item.value);
    }
  }
  return 0x0;
}

export function getEventMsgToMac(event_msg: string, type: 'src' | 'dst' = 'src'): string {
  if (typeof event_msg !== 'string') {
    console.error('Invalid event_msg:', event_msg);
    return 'none';
  }
  const arr = event_msg.split(' ');
  for (const str of arr) {
    if (str.includes('MAC=')) {
      return type === 'src' ? String(str.slice(22, 39)) : String(str.slice(4, 21));
    }
  }
  return 'none';
}

export function getPermissionStr(val: number) {
  if (val === CstDef.ADMIN_TYPE_ADMIN) {
    return CstDef.ADMIN_TYPE_ADMIN_STR;
  } else if (val === CstDef.ADMIN_TYPE_NOADMIN) {
    return CstDef.ADMIN_TYPE_NOADMIN_STR;
  } else {
    return '---';
  }
}

export function getPermissionVal(str: string) {
  if (str === CstDef.ADMIN_TYPE_ADMIN_STR) {
    return CstDef.ADMIN_TYPE_ADMIN;
  } else if (str === CstDef.ADMIN_TYPE_NOADMIN_STR) {
    return CstDef.ADMIN_TYPE_NOADMIN;
  } else {
    return 0;
  }
}

export function getRegionStr(val: number) {
  for (const item of RegionList.AllRegionList) {
    if (item.value === val) {
      return String(item.label);
    }
  }
  return '---';
}

export function getRegionVal(str: string) {
  for (const item of RegionList.AllRegionList) {
    if (item.label === str) {
      return Number(item.value);
    }
  }
  return 0;
}

export function getDistrictStr(val: number) {
  for (const districts of Object.values(RegionList.AllDistrictList)) {
    for (const item of districts) {
      if (item.value === val) {
        return String(item.label);
      }
    }
  }
  return '---';
}

export function getDistrictVal(str: string) {
  for (const districts of Object.values(RegionList.AllDistrictList)) {
    for (const item of districts) {
      if (item.label === str) {
        return Number(item.value);
      }
    }
  }
  return 0;
}

export function getConstructorStr(val: number | number[]): string {
  if (Array.isArray(val)) {
    if (val.length === 0) return '---';
    return val.map((v) => getConstructorStr(v)).join(', ');
  }
  for (let item of CompanyList.AllConstructorList) {
    if (item.value === val) {
      return String(item.label);
    }
  }
  return '---';
}

export function getConstructorVal(str: string) {
  for (let item of CompanyList.AllConstructorList) {
    if (item.label === str) {
      return Number(item.value);
    }
  }
  return 0;
}

export function getWallPadStr(val: number | number[]): string {
  if (Array.isArray(val)) {
    if (val.length === 0) return '---';
    return val.map((v) => getWallPadStr(v)).join(', ');
  }
  for (let item of CompanyList.AllWallPadList) {
    if (item.value === val) {
      return String(item.label);
    }
  }
  return '---';
}

export function getWallPadVal(str: string) {
  for (let item of CompanyList.AllWallPadList) {
    if (item.label === str) {
      return Number(item.value);
    }
  }
  return 0;
}

export function getBulkCategoryStr(val: number): string {
  switch (val) {
    case CstDef.BULK_CATEGORY_DASHBOARD: return CstDef.BULK_CATEGORY_DASHBOARD_STR;
    case CstDef.BULK_CATEGORY_HISTORY_UNAUTH_LOG: return CstDef.BULK_CATEGORY_HISTORY_UNAUTH_LOG_STR;
    case CstDef.BULK_CATEGORY_CONTROLLER: return CstDef.BULK_CATEGORY_CONTROLLER_STR;
    case CstDef.BULK_CATEGORY_ACCOUNT: return CstDef.BULK_CATEGORY_ACCOUNT_STR;
    case CstDef.BULK_CATEGORY_SYSSET: return CstDef.BULK_CATEGORY_SYSSET_STR;
    default: return '---';
  }
}

export function getBulkMethodStr(val: number): string {
  switch (val) {
    case CstDef.BULK_METHOD_POST: return CstDef.BULK_METHOD_POST_STR;
    case CstDef.BULK_METHOD_DELETE: return CstDef.BULK_METHOD_DELETE_STR;
    case CstDef.BULK_METHOD_GET: return CstDef.BULK_METHOD_GET_STR;
    case CstDef.BULK_METHOD_PUT: return CstDef.BULK_METHOD_PUT_STR;
    case CstDef.BULK_METHOD_PATCH: return CstDef.BULK_METHOD_PATCH_STR;
    default: return '---';
  }
}

export function getBulkProcStr(val: number): string {
  switch (val) {
    case CstDef.BULK_PROC_DEFAULT: return CstDef.BULK_PROC_DEFAULT_STR;
    case CstDef.BULK_PROC_WAITING: return CstDef.BULK_PROC_WAITING_STR;
    case CstDef.BULK_PROC_SUCCESS: return CstDef.BULK_PROC_SUCCESS_STR;
    case CstDef.BULK_PROC_FAIL: return CstDef.BULK_PROC_FAIL_STR;
    default: return '';
  }
}