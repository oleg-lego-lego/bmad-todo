'use client';

import { toast } from 'sonner';

export function AddToCartButton() {
  const handleClick = () => {
    toast.info('Функция будет доступна в следующем обновлении');
  };

  return (
    <div className="sticky bottom-0 z-10 -mx-4 bg-background/95 backdrop-blur-sm px-4 py-3 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
      <button
        type="button"
        onClick={handleClick}
        aria-label="Добавить в корзину"
        className="w-full min-h-[44px] min-w-[44px] rounded-button bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
      >
        В корзину
      </button>
    </div>
  );
}
