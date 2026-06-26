import axios from "axios";
import { api } from "../../../api/Axios";
import * as CstDef from "../../../commons/CstDef";
import type { CmdResult } from "../../../commons/Types";

const API_URL = '/v1/history/security_log';

export interface SecurityLogInfo {
    type: string;
    search: {
        dateFrom: string;
        dateTo: string;
        dvcName: string;
        dvcType: number;
        protocol: string;
        srcIp: string;
        srcPort: string;
        dstIp: string;
        dstPort: string;
    } | null;
    page: number;
}

export async function showHistoryUnauthLog(info: SecurityLogInfo): Promise<CmdResult> {
  const ret: CmdResult = {
    result: CstDef.BULK_PROC_FAIL,
    msg: '',
    data: null,
  };

  let addr = null;
  if (info.type === 'BRIEF') {
    addr = API_URL + '/brief_info';
  } else if (info.type === 'TOP_DEVICE') {
    const base = API_URL + '/top_device_info';
    const params = new URLSearchParams();
    if (info.search) {
      params.append('start_date', String(info.search.dateFrom));
      params.append('end_date', String(info.search.dateTo));
    }
    addr = `${base}?${params.toString()}`;
  } else if (info.type === 'CHART') {
    const base = API_URL + '/chart_info';
    const params = new URLSearchParams();
    if (info.search) {
      params.append('start_date', String(info.search.dateFrom));
      params.append('end_date', String(info.search.dateTo));
    }
    addr = `${base}?${params.toString()}`;
  } else if (info.type === 'LOG') {
    const base = API_URL;
    const params = new URLSearchParams();
    params.append('page_num', String(info.page));
    params.append('page_size', String(10)); // dashboard: 최근 10개
    if (info.search !== null) {
      if (info.search.dateFrom !== '') {
        params.append('start_date', String(info.search.dateFrom));
      }
      if (info.search.dateTo !== '') {
        params.append('end_date', String(info.search.dateTo));
      }
      if (info.search.dvcName !== '') {
        params.append('dvc_nm', String(info.search.dvcName));
      }
      if (info.search.dvcType !== 0x0) {
        params.append('dvc_tp', String(info.search.dvcType));
      }
      if (info.search.protocol !== '전체') {
        params.append('protocol', String(info.search.protocol));
      }
      if (info.search.srcIp !== '') {
        params.append('src_ip', String(info.search.srcIp));
      }
      if (info.search.srcPort !== '') {
        params.append('src_port', String(info.search.srcPort));
      }
      if (info.search.dstIp !== '') {
        params.append('dest_ip', String(info.search.dstIp));
      }
      if (info.search.dstPort !== '') {
        params.append('dest_port', String(info.search.dstPort));
      }
    }
    addr = `${base}?${params.toString()}`;
  } else {
    ret.msg = 'Brief Invalid Type: ' + String(info.type);
    return ret;
  }

  try {
    const response = await api.get(addr);

    ret.result = CstDef.BULK_PROC_SUCCESS;
    ret.data = response.data?.message ?? response.data ?? null;
    console.log('response:', response.data);
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