import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

export type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'relative' | 'distance' | 'time' | 'date' | 'datetime';

export interface DateFormatterOptions {
  locale?: 'en' | 'fr';
  format?: DateFormat;
  includeTime?: boolean;
  timeZone?: string;
}

const locales = {
  en: enUS,
  fr: fr
};

const formatPatterns = {
  short: 'MMM d',
  medium: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  full: 'EEEE, MMMM d, yyyy',
  time: 'HH:mm:ss',
  date: 'yyyy-MM-dd',
  datetime: 'yyyy-MM-dd HH:mm:ss'
};

export const formatDate = (
  date: Date | string | number,
  options: DateFormatterOptions = {}
): string => {
  const {
    locale = 'en',
    format: formatType = 'medium',
    includeTime = false,
    timeZone
  } = options;

  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = parseISO(date);
  } else if (typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  if (!isValid(dateObj)) {
    return 'Invalid date';
  }

  const selectedLocale = locales[locale];

  try {
    switch (formatType) {
      case 'relative':
        return formatRelative(dateObj, new Date(), { locale: selectedLocale });
      
      case 'distance':
        return formatDistance(dateObj, new Date(), { 
          locale: selectedLocale,
          addSuffix: true 
        });
      
      case 'time':
        return format(dateObj, formatPatterns.time, { locale: selectedLocale });
      
      case 'date':
        return format(dateObj, formatPatterns.date, { locale: selectedLocale });
      
      case 'datetime':
        return format(dateObj, formatPatterns.datetime, { locale: selectedLocale });
      
      default:
        const pattern = formatPatterns[formatType];
        if (includeTime) {
          return format(dateObj, `${pattern} HH:mm`, { locale: selectedLocale });
        }
        return format(dateObj, pattern, { locale: selectedLocale });
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid date';
  }
};

export const formatTimeAgo = (date: Date | string | number): string => {
  return formatDate(date, { format: 'distance' });
};

export const formatRelativeDate = (date: Date | string | number): string => {
  return formatDate(date, { format: 'relative' });
};

export const formatTime = (date: Date | string | number): string => {
  return formatDate(date, { format: 'time' });
};

export const formatDateOnly = (date: Date | string | number): string => {
  return formatDate(date, { format: 'date' });
};

export const formatDateTime = (date: Date | string | number): string => {
  return formatDate(date, { format: 'datetime' });
};

export const isToday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const today = new Date();
  
  return format(dateObj, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
};

export const isYesterday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return format(dateObj, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd');
};

export const isThisWeek = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  return dateObj >= startOfWeek;
};

export const isThisMonth = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  const now = new Date();
  
  return dateObj.getMonth() === now.getMonth() && 
         dateObj.getFullYear() === now.getFullYear();
}; 