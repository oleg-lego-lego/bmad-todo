export interface ApiResponse<T> {
  data: T;
  meta?: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type AppErrorType = 'network' | 'notFound' | 'validation' | 'unauthorized';
