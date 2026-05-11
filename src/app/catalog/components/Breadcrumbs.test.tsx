import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from '@/app/catalog/components/Breadcrumbs';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Breadcrumbs', () => {
  it('renders breadcrumb navigation', () => {
    render(<Breadcrumbs />);
    expect(screen.getByLabelText('Хлебные крошки')).toBeInTheDocument();
  });

  it('shows link to home page', () => {
    render(<Breadcrumbs />);
    const homeLink = screen.getByText('Главная');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('shows current page as Каталог', () => {
    render(<Breadcrumbs />);
    expect(screen.getByText('Каталог')).toHaveAttribute('aria-current', 'page');
  });
});
