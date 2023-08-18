export const APP_CONSTANTS = {
  PAGINATION_LIMIT: 25,
  DEFAULT_DATE_FORMAT: 'YYYY-MM-DD',
  DEFAULT_FULL_DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DEFAULT_FULL_DATETIME_FORMAT_WITH_MILLISEC: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DEFAULT_FULL_DATETIME_FORMAT_WITH_TIMEZONE: 'YYYY-MM-DDTHH:mm:ssZ',
  TWENTY: 20,
  FIFTY: 50,
  EIGHT: 80,
  HUNDRED: 100,
  FIVE_HUNDRED: 500,
  LOGS_FETCH_LIMITS: 10,
  FIELD_CHANGE_DEBOUNCE: 1000,
  EDITOR_CHANGE_DEBOUNCE: 500,
  COMMENT_CHANGE_DEBOUNCE: 50,
  FILE_SAVED_DISAPPEAR_TIME: 3000,
  MAXIMUM_STEPPER_INDEX: 4,
  AGREEMENT_NAME_MAX_LENGTH: 500,
  TWO_THOUSAND: 2000,
  TWENTY_THREE: 23,
  FIFTY_NINE: 59,
  NINE_HUNDRED_NINETY_NINE: 999,
  QUESTION_UPDATE_DEBOUNCE: 500,
  QUESTION_OPTIONS_LIMIT: 12,
  ROOT_QUESTIONS_LIMIT: 25,
  QUESTION_SCROLL_ID: 'question-scroll-id-',
  THREE: 3,
  TEN: 10,
  THOUSAND: 1000,
  TWO: 2,
  FOLLOWUP_QUESTIONS_LIMIT: 25,
};

export const GENERAL_CONSTANTS = {
  SPECIAL_CHAR:
    ' , . ! @ # * & % ( ) - ? { } [ ] $ ¥ £ € ₹ ₩ : | ; / \\ _ + > < = ~ ` " ',
};
// sonarignore:start
export const FORM_PATTERNS = {};
// sonarignore:end

export const FORM_MAX_VALUES = {};

export const AG_GRID_CONSTANTS = {
  ROW_HEIGHT: 41,
  COLOUMN_MIN_WIDTH: 60,
};

// Order of extension matter. Like, .docs before .doc & .xlsx, .xlsm before .xls & .pptx before .ppt

export const AUTH_REQUIRED_PAGE = 'main/authorization-required';

export const NON_PRINTABLE_ASCII_CODE = /[^\x20-\x7E]/g; // NOSONAR