// Device Type
//// Main Type
const DT_MAIN_NONE = 0x0000; // old, ...
const DT_MAIN_SGW = 0x0200;
const DT_MAIN_PGW = 0x0300;
const DT_MAIN_AGENT = 0x0400; // CCTV, ...
//// Sub Type
////// SGW
const DT_SUB_SGW_OLD = 0x02;
const DT_SUB_ARA1000_48T = 0x01;
const DT_SUB_ARA2000_48T = 0x02;
////// PGW
const DT_SUB_PGW_OLD = 0x10;
const DT_SUB_ARAD200_5T = 0x11;
const DT_SUB_ARAD100_3T = 0x12;
const DT_SUB_ARAD100_3TC = 0x13;
const DT_SUB_ARAD100_2T = 0x14;
const DT_SUB_ARAD900_8TA = 0x15;
////// AGENT
const DT_SUB_AGENT_OLD = 0x20;
const DT_SUB_CCTV_DAHUA = 0x21;

export const DT_SGW = DT_MAIN_NONE | DT_SUB_SGW_OLD;
export const DT_ARA1000_48T = DT_MAIN_SGW | DT_SUB_ARA1000_48T;
export const DT_ARA2000_48T = DT_MAIN_SGW | DT_SUB_ARA2000_48T;
export const DT_PGW = DT_MAIN_NONE | DT_SUB_PGW_OLD;
export const DT_ARAD200_5T = DT_MAIN_PGW | DT_SUB_ARAD200_5T;
export const DT_ARAD100_3T = DT_MAIN_PGW | DT_SUB_ARAD100_3T;
export const DT_ARAD100_3TC = DT_MAIN_PGW | DT_SUB_ARAD100_3TC;
export const DT_ARAD100_2T = DT_MAIN_PGW | DT_SUB_ARAD100_2T;
export const DT_ARAD900_8TA = DT_MAIN_PGW | DT_SUB_ARAD900_8TA;
export const DT_AGENT = DT_MAIN_NONE | DT_SUB_AGENT_OLD;
export const DT_CCTV_DAHUA = DT_MAIN_AGENT | DT_SUB_CCTV_DAHUA;
export const DT_SGW_STR = 'SGW';
export const DT_AGENT_STR = 'AGENT';
export const DT_PGW_STR = 'ARA100-5T';
export const DT_ARA1000_48T_STR = 'ARA1000-48T';
export const DT_ARA2000_48T_STR = 'ARA2000-48T';
export const DT_ARAD200_5T_STR = 'ARAD200-5T';
export const DT_ARAD100_3T_STR = 'ARAD100-3T';
export const DT_ARAD100_3TC_STR = 'ARAD100-3TC';
export const DT_ARAD100_2T_STR = 'ARAD100-2T';
export const DT_ARAD900_8TA_STR = 'ARAD900-8TA';
export const DT_CCTV_DAHUA_STR = 'CCTV-DAHUA';