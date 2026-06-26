export const VERSION = '1.0.0.0';
export const SEL_TOTAL = 0;
export const SEL_TOTAL_STR = '전체';

// Remote SSH Port
export const REMOTE_SSH_PORT = 4122;

// Connection Limit
export const CONN_LIMIT = 16;

// Bulk Setup: Process
export const BULK_PROC_DEFAULT = 0;
export const BULK_PROC_WAITING = 1;
export const BULK_PROC_SUCCESS = 2;
export const BULK_PROC_FAIL = 3;
export const BULK_PROC_PASSWORD_CHANGE_REQUIRED = 4;  // 로그인 시 비밀번호 변경 필요 (HTTP 428)
export const BULK_PROC_DEFAULT_STR = '';
export const BULK_PROC_WAITING_STR = '대기중';
export const BULK_PROC_SUCCESS_STR = '성공';
export const BULK_PROC_FAIL_STR = '실패';

// Bulk Setup: Method
export const BULK_METHOD_POST = 1;
export const BULK_METHOD_DELETE = 2;
export const BULK_METHOD_GET = 3;
export const BULK_METHOD_PUT = 4;
export const BULK_METHOD_PATCH = 5;
export const BULK_METHOD_POST_STR = 'POST';
export const BULK_METHOD_DELETE_STR = 'DELETE';
export const BULK_METHOD_GET_STR = 'GET';
export const BULK_METHOD_PUT_STR = 'PUT';
export const BULK_METHOD_PATCH_STR = 'PATCH';

// Bulk Setup: Action
export const BULK_ACTION = 101; //POST, DELETE, GET, PUT, PATCH (세부 액션은 카테고리마다 다름)
export const BULK_ACTION_LOGIN = 102; //POST
export const BULK_ACTION_LOGOUT = 103; //POST
export const BULK_ACTION_INIT_CHANGE_PW = 104; //POST
export const BULK_ACTION_CHANGE_PW = 105; //POST
export const BULK_ACTION_PASS_CHANGE_PW = 106; //POST
export const BULK_ACTION_COPY = 107; //POST
export const BULK_ACTION_WRITE = 108; //POST
export const BULK_ACTION_LOOKUP_REG = 109; //POST
export const BULK_ACTION_UPLOAD = 110; //POST
export const BULK_ACTION_ONE = 111; //GET

export const BULK_ACTION_DELETE = 201; //DELETE

export const BULK_ACTION_DOWNLOAD = 301; //GET
export const BULK_ACTION_NEW = 302;
export const BULK_ACTION_DEF = 303;

export const BULK_ACTION_SITE_NAME = 401; //PUT

// Bulk Dashboard API
export const BULK_ACTION_DASHBOARD_SERVER_STATUS = 501; //POST, DELETE, GET, PUT
export const BULK_ACTION_DASHBOARD_DEVICE_STATUS = 502; //POST, DELETE, GET, PUT
export const BULK_ACTION_DASHBOARD_LOCATION_SUMMARY = 503; //POST, DELETE, GET, PUT
export const BULK_ACTION_DASHBOARD_UNAUTH_LOGS = 504; //POST, DELETE, GET, PUT

// Bulk Monitoring API
export const BULK_ACTION_MONITORING_STATUS = 601; //GET
export const BULK_ACTION_MONITORING_SUMMARY = 602; //GET
export const BULK_ACTION_MONITORING_UNAUTH_LOGS = 603; //GET

// Bulk ControllerToken API
export const BULK_ACTION_CONTROLLER_CREATE_TOKEN = 701; //POST
export const BULK_ACTION_CONTROLLER_DELETE_TOKEN = 702; //POST
export const BULK_ACTION_CONTROLLER_REGENERATE_TOKEN = 703; //POST

// Bulk Location API
export const BULK_ACTION_LOCATION_DESCENDANT = 801; //GET
export const BULK_ACTION_LOCATION_ONE = 802;

// Category str
export const BULK_CATEGORY_DASHBOARD = 1;
export const BULK_CATEGORY_HISTORY_UNAUTH_LOG = 2;
export const BULK_CATEGORY_CONTROLLER = 3;
export const BULK_CATEGORY_ACCOUNT = 4;
export const BULK_CATEGORY_MONITORING = 5;
export const BULK_CATEGORY_SYSSET = 8;
export const BULK_CATEGORY_LOCATION = 9;
export const BULK_CATEGORY_DASHBOARD_STR = 'DASHBOARD';
export const BULK_CATEGORY_HISTORY_UNAUTH_LOG_STR = '비인가 로그';
export const BULK_CATEGORY_CONTROLLER_STR = '컨트롤러 관리';
export const BULK_CATEGORY_ACCOUNT_STR = '계정 관리';
export const BULK_CATEGORY_MONITORING_STR = '모니터링';
export const BULK_CATEGORY_SYSSET_STR = '시스템 설정';
export const BULK_CATEGORY_LOCATION_STR = '위치 관리';

// Bulk Setup: Fail Action
export const BULK_FAIL_STOP = 1;
export const BULK_FAIL_CONTINUE = 2;

// Bulk Setup: Rollback
export const BULK_ROLLBACK_ADD = 1;
export const BULK_ROLLBACK_SKIP = 2;

// Monitoring Category
export const MONITORING_CATEGORY_REGION = 1;
export const MONITORING_CATEGORY_DISTRICT = 2;
export const MONITORING_CATEGORY_CONSTRUCTOR = 3;
export const MONITORING_CATEGORY_HOMENET = 4;
export const MONITORING_CATEGORY_REGION_STR = '지역';
export const MONITORING_CATEGORY_DISTRICT_STR = '시군구';
export const MONITORING_CATEGORY_CONSTRUCTOR_STR = '건설사';
export const MONITORING_CATEGORY_HOMENET_STR = '홈넷';

// 관리자 계정 타입
export const ADMIN_TYPE_ADMIN = 1;
export const ADMIN_TYPE_NOADMIN = 2;
export const ADMIN_TYPE_ADMIN_STR = '마스터계정';
export const ADMIN_TYPE_NOADMIN_STR = '일반계정';

// 관리자 계정 권한
export const ADMIN_PERM_ADMINISTRATOR = 1;
export const ADMIN_PERM_OPERATOR = 2;

//아래는 사용안함
export const ADMIN_PERM_SUPERUSER = 3;
export const ADMIN_PERM_USER = 4;
export const ADMIN_PERM_GUEST = 5;
export const ADMIN_PERM_ADMINISTRATOR_STR = 'Administrator';
export const ADMIN_PERM_OPERATOR_STR = 'Operator';
export const ADMIN_PERM_SUPERUSER_STR = 'Superuser';
export const ADMIN_PERM_USER_STR = 'User';
export const ADMIN_PERM_GUEST_STR = 'Guest';