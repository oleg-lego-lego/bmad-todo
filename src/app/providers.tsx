"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      })
  );

  const [mswReady, setMswReady] = useState(
    process.env.NEXT_PUBLIC_MSW_ENABLED !== "true"
  );

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MSW_ENABLED === "true") {
      import("@/mocks/browser")
        .then(({ worker }) =>
          worker.start({ onUnhandledRequest: "bypass" }).then(() => {
            setMswReady(true);
          })
        )
        .catch((err) => {
          console.error("MSW init failed:", err);
          setMswReady(true);
        });
    }
  }, []);

  if (!mswReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        {children}
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
