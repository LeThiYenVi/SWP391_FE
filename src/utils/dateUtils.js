import { format, isValid, parse } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Safely format a date to string
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'yyyy-MM-dd')
 * @returns {string} - Formatted date string or empty string if invalid
 */
export const safeFormatDate = (date, formatStr = 'yyyy-MM-dd') => {
  try {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!isValid(dateObj)) {
      console.warn('Invalid date provided to safeFormatDate:', date);
      return '';
    }
    
    return format(dateObj, formatStr, { locale: vi });
  } catch (error) {
    console.error('Error formatting date:', error, 'Date:', date);
    return '';
  }
};

/**
 * Safely parse a date string
 * @param {string} dateString - Date string to parse
 * @param {string} formatStr - Expected format (default: 'yyyy-MM-dd')
 * @returns {Date|null} - Parsed date or null if invalid
 */
export const safeParseDateString = (dateString, formatStr = 'yyyy-MM-dd') => {
  try {
    if (!dateString || typeof dateString !== 'string') return null;
    
    const parsedDate = parse(dateString, formatStr, new Date());
    
    if (!isValid(parsedDate)) {
      console.warn('Invalid date string provided to safeParseDateString:', dateString);
      return null;
    }
    
    return parsedDate;
  } catch (error) {
    console.error('Error parsing date string:', error, 'DateString:', dateString);
    return null;
  }
};

/**
 * Safely create a new Date object
 * @param {Date|string|number} date - Date input
 * @returns {Date|null} - Valid Date object or null if invalid
 */
export const safeCreateDate = (date) => {
  try {
    if (!date) return null;
    
    const dateObj = new Date(date);
    
    if (!isValid(dateObj)) {
      console.warn('Invalid date provided to safeCreateDate:', date);
      return null;
    }
    
    return dateObj;
  } catch (error) {
    console.error('Error creating date:', error, 'Date:', date);
    return null;
  }
};

/**
 * Get today's date as formatted string
 * @param {string} formatStr - Format string (default: 'yyyy-MM-dd')
 * @returns {string} - Today's date formatted
 */
export const getTodayFormatted = (formatStr = 'yyyy-MM-dd') => {
  return safeFormatDate(new Date(), formatStr);
};

/**
 * Check if a date string is valid
 * @param {string} dateString - Date string to validate
 * @param {string} formatStr - Expected format (default: 'yyyy-MM-dd')
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDateString = (dateString, formatStr = 'yyyy-MM-dd') => {
  return safeParseDateString(dateString, formatStr) !== null;
};

/**
 * Format date for display in Vietnamese
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string for display
 */
export const formatDateForDisplay = (date) => {
  return safeFormatDate(date, 'dd/MM/yyyy');
};

/**
 * Format date with day name in Vietnamese
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string with day name
 */
export const formatDateWithDayName = (date) => {
  return safeFormatDate(date, 'EEEE, dd/MM/yyyy');
};

export default {
  safeFormatDate,
  safeParseDateString,
  safeCreateDate,
  getTodayFormatted,
  isValidDateString,
  formatDateForDisplay,
  formatDateWithDayName,
}; 