import { AxiosError } from 'axios';

import { ErrorResponse } from '@/types/response';

const defaultMessage = 'Something went wrong. Please try again.';

export function handleAxiosError<E = unknown>(
  error: E,
  cb: (message: string, error?: E) => void,
  fallbackMessage?: string,
): void {
  if (error instanceof AxiosError) {
    const responseError = error as AxiosError<ErrorResponse>;

    cb?.(
      responseError.response?.data?.error.message ??
        (fallbackMessage || defaultMessage),
      error,
    );
  } else {
    // Network error
    console.log(error);
    cb?.(defaultMessage, error);
  }
}
