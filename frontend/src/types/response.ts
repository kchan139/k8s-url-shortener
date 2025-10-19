export interface Response<T = object> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: boolean;
  error: {
    code: number;
    message: string;
  };
}
