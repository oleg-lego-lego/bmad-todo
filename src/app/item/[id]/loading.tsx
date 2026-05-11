import { PageContainer } from '@/components/layout/PageContainer';

export default function ItemPageLoading() {
  return (
    <PageContainer>
      {/* Breadcrumbs skeleton */}
      <div className="mb-4 flex items-center gap-1.5">
        <div className="h-4 w-14 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Gallery skeleton */}
        <div className="w-full lg:w-[60%]">
          <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-muted" />
          <div className="mt-2 hidden lg:flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square w-16 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="flex flex-col gap-3 w-full lg:w-[40%]">
          <div className="h-12 w-36 animate-pulse rounded-lg bg-muted" />
          <div className="h-8 w-44 animate-pulse rounded bg-muted" />
          <div className="h-6 w-64 animate-pulse rounded bg-muted" />
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-12 w-full animate-pulse rounded-button bg-muted" />
          <div className="mt-2 h-32 w-full animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </PageContainer>
  );
}
