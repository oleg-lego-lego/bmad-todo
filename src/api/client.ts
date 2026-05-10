import type { ApiResponse, ApiErrorResponse, AppErrorType } from '@/types/api';

export class AppError extends Error {
  constructor(
    public type: AppErrorType,
    message: string,
    public code?: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

function resolveAppErrorType(status: number): AppErrorType {
  switch (status) {
    case 401:
      return 'unauthorized';
    case 404:
      return 'notFound';
    case 422:
      return 'validation';
    default:
      return 'network';
  }
}

async function parseErrorResponse(response: Response): Promise<never> {
  try {
    const body = (await response.json()) as ApiErrorResponse;
    throw new AppError(
      resolveAppErrorType(response.status),
      body.error.message,
      body.error.code,
      body.error.details
    );
  } catch (e) {
    if (e instanceof AppError) throw e;
    const reason = e instanceof SyntaxError ? `Invalid JSON: ${e.message}` : String(e);
    throw new AppError('network', `HTTP ${response.status}: ${response.statusText} — ${reason}`);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new AppError('network', 'Ошибка сети. Проверьте подключение к интернету.');
  }

  if (!response.ok) {
    await parseErrorResponse(response);
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
}

export async function apiFetchPaginated<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  } catch {
    throw new AppError('network', 'Ошибка сети. Проверьте подключение к интернету.');
  }

  if (!response.ok) {
    await parseErrorResponse(response);
  }

  return (await response.json()) as ApiResponse<T>;
}
