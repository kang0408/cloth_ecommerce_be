export interface ISuccessResponse<T = any> {
  success: true;
  message: String;
  data: T;
}

export interface IErrorResponse {
  success: false;
  message: String;
}
