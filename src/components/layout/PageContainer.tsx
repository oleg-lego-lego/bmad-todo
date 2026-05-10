import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full max-w-[1280px] px-4 py-4 md:px-6 md:py-6 lg:px-8",
        "pb-20 md:pb-6",
        className
      )}
    >
      {children}
    </main>
  );
}
