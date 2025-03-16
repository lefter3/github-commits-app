export function getYMDFormat(fullDate?: Date | string): string {
  let date: Date;
  if (fullDate) {
    if (typeof fullDate === 'string') {
      date = new Date(fullDate);
    } else {
      date = fullDate;
    }
  } else {
    date = new Date();
  }
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
  const day = date.getUTCDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function isDateToday(date: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
}
