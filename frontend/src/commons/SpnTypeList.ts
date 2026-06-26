import * as DeviceType from './DeviceType.ts';
import * as CstDef from './CstDef.ts';

export const AllDeviceList = [
  {
    label: DeviceType.DT_SGW_STR,
    value: DeviceType.DT_SGW,
  },
  {
    label: DeviceType.DT_ARA1000_48T_STR,
    value: DeviceType.DT_ARA1000_48T,
  },
  {
    label: DeviceType.DT_ARA2000_48T_STR,
    value: DeviceType.DT_ARA2000_48T,
  },
  {
    label: DeviceType.DT_AGENT_STR,
    value: DeviceType.DT_AGENT,
  },
  {
    label: DeviceType.DT_PGW_STR,
    value: DeviceType.DT_PGW,
  },
  {
    label: DeviceType.DT_ARAD100_3TC_STR,
    value: DeviceType.DT_ARAD100_3TC,
  },
  {
    label: DeviceType.DT_ARAD100_3T_STR,
    value: DeviceType.DT_ARAD100_3T,
  },
  {
    label: DeviceType.DT_ARAD200_5T_STR,
    value: DeviceType.DT_ARAD200_5T,
  },
  {
    label: DeviceType.DT_ARAD100_2T_STR,
    value: DeviceType.DT_ARAD100_2T,
  },
  {
    label: DeviceType.DT_ARAD900_8TA_STR,
    value: DeviceType.DT_ARAD900_8TA,
  },
];

export const OldDeviceList = [
  {
    label: DeviceType.DT_AGENT_STR,
    value: DeviceType.DT_AGENT,
  },
  {
    label: DeviceType.DT_PGW_STR,
    value: DeviceType.DT_PGW,
  },
];

export const AllCategoryMonitoringList = [
  {
    label: CstDef.MONITORING_CATEGORY_REGION_STR,
    value: CstDef.MONITORING_CATEGORY_REGION,
  },
  {
    label: CstDef.MONITORING_CATEGORY_DISTRICT_STR,
    value: CstDef.MONITORING_CATEGORY_DISTRICT,
  },
  {
    label: CstDef.MONITORING_CATEGORY_CONSTRUCTOR_STR,
    value: CstDef.MONITORING_CATEGORY_CONSTRUCTOR,
  },
  {
    label: CstDef.MONITORING_CATEGORY_HOMENET_STR,
    value: CstDef.MONITORING_CATEGORY_HOMENET,
  },
];

export const AllAdminTypeList = [
  {
    label: CstDef.ADMIN_TYPE_ADMIN_STR,
    value: CstDef.ADMIN_TYPE_ADMIN,
  },
  {
    label: CstDef.ADMIN_TYPE_NOADMIN_STR,
    value: CstDef.ADMIN_TYPE_NOADMIN,
  },
];

export const AllAdminPermList = [
  {
    label: CstDef.ADMIN_PERM_ADMINISTRATOR_STR,
    value: CstDef.ADMIN_PERM_ADMINISTRATOR,
  },
  {
    label: CstDef.ADMIN_PERM_OPERATOR_STR,
    value: CstDef.ADMIN_PERM_OPERATOR,
  },
  // {
  //   label: CstDef.ADMIN_PERM_SUPERUSER_STR,
  //   value: CstDef.ADMIN_PERM_SUPERUSER,
  // },
  // {
  //   label: CstDef.ADMIN_PERM_USER_STR,
  //   value: CstDef.ADMIN_PERM_USER,
  // },
  // {
  //   label: CstDef.ADMIN_PERM_GUEST_STR,
  //   value: CstDef.ADMIN_PERM_GUEST,
  // },
];