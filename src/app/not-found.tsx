import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">Страница не найдена</p>
      <Link
        href="/catalog"
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary-hover transition-colors"
      >
        Вернуться в каталог
      </Link>
    </div>
  );
}
