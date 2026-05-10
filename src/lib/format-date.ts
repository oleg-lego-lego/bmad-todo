const formatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatDate(date: string | Date): string {
  return formatter.format(new Date(date));
}
