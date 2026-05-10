import { PageContainer } from "@/components/layout/PageContainer";

export default function CatalogPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-foreground mb-4">Каталог</h1>
      <p className="text-muted-foreground">
        Каталог товаров будет доступен в следующих итерациях.
      </p>
    </PageContainer>
  );
}
