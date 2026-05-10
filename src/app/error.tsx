"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(_error);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-foreground">
        Что-то пошло не так
      </h1>
      <p className="text-muted-foreground">
        Произошла ошибка при загрузке страницы
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary-hover transition-colors"
      >
        Попробовать снова
      </button>
    </div>
  );
}
