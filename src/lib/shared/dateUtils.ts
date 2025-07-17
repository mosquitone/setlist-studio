/**
 * Utility functions for date formatting with Japan timezone (JST)
 */

export const formatDateJST = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTimeJST = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatEventDateJST = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
};

export const formatDateForInput = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return date.toISOString().split('T')[0];
};
