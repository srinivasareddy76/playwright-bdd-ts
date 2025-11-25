/**
 * Date Utilities Module
 * 
 * This module provides comprehensive date handling utilities for the BDD framework.
 * It includes date formatting, manipulation, validation, and timezone operations
 * with support for various date formats and business logic.
 * 
 * Key Features:
 * - Multiple date format support (ISO, custom formats, localized)
 * - Date arithmetic operations (add/subtract days, months, years)
 * - Business date calculations (working days, holidays)
 * - Timezone conversion and management
 * - Date validation and parsing
 * - Age calculations and date comparisons
 * - Random date generation for testing
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { logger } from './logger';

/**
 * Enumeration of common date formats used in testing
 */
export enum DateFormat {
  ISO_DATE = 'YYYY-MM-DD',
  ISO_DATETIME = 'YYYY-MM-DDTHH:mm:ss.sssZ',
  US_DATE = 'MM/DD/YYYY',
  EU_DATE = 'DD/MM/YYYY',
  DISPLAY_DATE = 'MMM DD, YYYY',
  DISPLAY_DATETIME = 'MMM DD, YYYY HH:mm:ss',
  FILE_TIMESTAMP = 'YYYYMMDD_HHmmss',
  LOG_TIMESTAMP = 'YYYY-MM-DD HH:mm:ss',
  API_TIMESTAMP = 'YYYY-MM-DDTHH:mm:ss.sssZ'
}

/**
 * Interface for date range operations
 */
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Interface for business day configuration
 */
export interface BusinessDayConfig {
  weekends: number[]; // 0 = Sunday, 6 = Saturday
  holidays: Date[];
}

/**
 * Comprehensive date utility class providing various date operations
 * for test automation and data manipulation
 */
export class DateUtils {
  private static readonly DEFAULT_TIMEZONE = 'UTC';
  private static readonly MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

  /**
   * Gets the current date and time
   * @param timezone - Optional timezone (defaults to UTC)
   * @returns Current Date object
   */
  static getCurrentDate(timezone: string = this.DEFAULT_TIMEZONE): Date {
    const now = new Date();
    if (timezone !== 'UTC') {
      // Convert to specified timezone
      return new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    }
    return now;
  }

  /**
   * Formats a date according to the specified format
   * @param date - Date to format
   * @param format - Format string or DateFormat enum
   * @param timezone - Optional timezone for formatting
   * @returns Formatted date string
   */
  static formatDate(date: Date, format: string | DateFormat, timezone?: string): string {
    try {
      const targetDate = timezone ? 
        new Date(date.toLocaleString('en-US', { timeZone: timezone })) : 
        date;

      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      const day = targetDate.getDate();
      const hours = targetDate.getHours();
      const minutes = targetDate.getMinutes();
      const seconds = targetDate.getSeconds();
      const milliseconds = targetDate.getMilliseconds();

      const formatStr = typeof format === 'string' ? format : String(format);

      return formatStr
        .replace(/YYYY/g, year.toString())
        .replace(/MM/g, month.toString().padStart(2, '0'))
        .replace(/DD/g, day.toString().padStart(2, '0'))
        .replace(/HH/g, hours.toString().padStart(2, '0'))
        .replace(/mm/g, minutes.toString().padStart(2, '0'))
        .replace(/ss/g, seconds.toString().padStart(2, '0'))
        .replace(/sss/g, milliseconds.toString().padStart(3, '0'))
        .replace(/MMM/g, this.getMonthName(month - 1, 'short'))
        .replace(/MMMM/g, this.getMonthName(month - 1, 'long'));
    } catch (error) {
      logger.error(`Error formatting date: ${error}`);
      return date.toISOString();
    }
  }

  /**
   * Parses a date string into a Date object
   * @param dateString - Date string to parse
   * @param format - Expected format of the input string
   * @returns Parsed Date object
   */
  static parseDate(dateString: string, format?: string | DateFormat): Date {
    try {
      if (!format) {
        return new Date(dateString);
      }

      // Custom parsing logic for specific formats
      const formatStr = typeof format === 'string' ? format : String(format);
      
      if (formatStr === DateFormat.US_DATE) {
        const [month, day, year] = dateString.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
      
      if (formatStr === DateFormat.EU_DATE) {
        const [day, month, year] = dateString.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }

      // Default to native parsing
      return new Date(dateString);
    } catch (error) {
      logger.error(`Error parsing date string "${dateString}": ${error}`);
      throw new Error(`Invalid date string: ${dateString}`);
    }
  }

  /**
   * Adds specified amount of time to a date
   * @param date - Base date
   * @param amount - Amount to add
   * @param unit - Time unit (days, months, years, hours, minutes, seconds)
   * @returns New Date object with added time
   */
  static addTime(date: Date, amount: number, unit: 'days' | 'months' | 'years' | 'hours' | 'minutes' | 'seconds'): Date {
    const result = new Date(date);
    
    switch (unit) {
      case 'seconds':
        result.setSeconds(result.getSeconds() + amount);
        break;
      case 'minutes':
        result.setMinutes(result.getMinutes() + amount);
        break;
      case 'hours':
        result.setHours(result.getHours() + amount);
        break;
      case 'days':
        result.setDate(result.getDate() + amount);
        break;
      case 'months':
        result.setMonth(result.getMonth() + amount);
        break;
      case 'years':
        result.setFullYear(result.getFullYear() + amount);
        break;
      default:
        throw new Error(`Unsupported time unit: ${unit}`);
    }
    
    return result;
  }

  /**
   * Subtracts specified amount of time from a date
   * @param date - Base date
   * @param amount - Amount to subtract
   * @param unit - Time unit
   * @returns New Date object with subtracted time
   */
  static subtractTime(date: Date, amount: number, unit: 'days' | 'months' | 'years' | 'hours' | 'minutes' | 'seconds'): Date {
    return this.addTime(date, -amount, unit);
  }

  /**
   * Calculates the difference between two dates
   * @param date1 - First date
   * @param date2 - Second date
   * @param unit - Unit for the result
   * @returns Difference in specified unit
   */
  static dateDifference(date1: Date, date2: Date, unit: 'days' | 'hours' | 'minutes' | 'seconds' | 'milliseconds'): number {
    const diffMs = Math.abs(date1.getTime() - date2.getTime());
    
    switch (unit) {
      case 'milliseconds':
        return diffMs;
      case 'seconds':
        return Math.floor(diffMs / 1000);
      case 'minutes':
        return Math.floor(diffMs / (1000 * 60));
      case 'hours':
        return Math.floor(diffMs / (1000 * 60 * 60));
      case 'days':
        return Math.floor(diffMs / this.MILLISECONDS_PER_DAY);
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }
  }

  /**
   * Calculates age based on birth date
   * @param birthDate - Date of birth
   * @param referenceDate - Reference date (defaults to current date)
   * @returns Age in years
   */
  static calculateAge(birthDate: Date, referenceDate: Date = new Date()): number {
    let age = referenceDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = referenceDate.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Checks if a date falls within a specified range
   * @param date - Date to check
   * @param range - Date range to check against
   * @returns True if date is within range
   */
  static isDateInRange(date: Date, range: DateRange): boolean {
    return date >= range.startDate && date <= range.endDate;
  }

  /**
   * Gets the start of day (00:00:00.000)
   * @param date - Input date
   * @returns New Date object at start of day
   */
  static getStartOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Gets the end of day (23:59:59.999)
   * @param date - Input date
   * @returns New Date object at end of day
   */
  static getEndOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Checks if a date is a weekend
   * @param date - Date to check
   * @param weekendDays - Array of weekend day numbers (0=Sunday, 6=Saturday)
   * @returns True if date is a weekend
   */
  static isWeekend(date: Date, weekendDays: number[] = [0, 6]): boolean {
    return weekendDays.includes(date.getDay());
  }

  /**
   * Checks if a date is a business day
   * @param date - Date to check
   * @param config - Business day configuration
   * @returns True if date is a business day
   */
  static isBusinessDay(date: Date, config?: BusinessDayConfig): boolean {
    const defaultConfig: BusinessDayConfig = {
      weekends: [0, 6], // Sunday and Saturday
      holidays: []
    };
    
    const businessConfig = config || defaultConfig;
    
    // Check if it's a weekend
    if (businessConfig.weekends.includes(date.getDay())) {
      return false;
    }
    
    // Check if it's a holiday
    return !businessConfig.holidays.some(holiday => 
      this.isSameDay(date, holiday)
    );
  }

  /**
   * Gets the next business day
   * @param date - Starting date
   * @param config - Business day configuration
   * @returns Next business day
   */
  static getNextBusinessDay(date: Date, config?: BusinessDayConfig): Date {
    let nextDay = this.addTime(date, 1, 'days');
    
    while (!this.isBusinessDay(nextDay, config)) {
      nextDay = this.addTime(nextDay, 1, 'days');
    }
    
    return nextDay;
  }

  /**
   * Gets the previous business day
   * @param date - Starting date
   * @param config - Business day configuration
   * @returns Previous business day
   */
  static getPreviousBusinessDay(date: Date, config?: BusinessDayConfig): Date {
    let prevDay = this.subtractTime(date, 1, 'days');
    
    while (!this.isBusinessDay(prevDay, config)) {
      prevDay = this.subtractTime(prevDay, 1, 'days');
    }
    
    return prevDay;
  }

  /**
   * Checks if two dates are the same day
   * @param date1 - First date
   * @param date2 - Second date
   * @returns True if dates are the same day
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * Validates if a date string is valid
   * @param dateString - Date string to validate
   * @param format - Expected format
   * @returns True if valid date
   */
  static isValidDate(dateString: string, format?: string | DateFormat): boolean {
    try {
      const parsed = this.parseDate(dateString, format);
      return !isNaN(parsed.getTime());
    } catch {
      return false;
    }
  }

  /**
   * Generates a random date within a specified range
   * @param startDate - Start of range
   * @param endDate - End of range
   * @returns Random date within range
   */
  static generateRandomDate(startDate: Date, endDate: Date): Date {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const randomTime = startTime + Math.random() * (endTime - startTime);
    return new Date(randomTime);
  }

  /**
   * Gets an array of dates between two dates
   * @param startDate - Start date
   * @param endDate - End date
   * @param step - Step in days (default: 1)
   * @returns Array of dates
   */
  static getDateRange(startDate: Date, endDate: Date, step: number = 1): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + step);
    }
    
    return dates;
  }

  /**
   * Converts date to different timezone
   * @param date - Date to convert
   * @param fromTimezone - Source timezone
   * @param toTimezone - Target timezone
   * @returns Converted date
   */
  static convertTimezone(date: Date, fromTimezone: string, toTimezone: string): Date {
    try {
      // Convert to UTC first, then to target timezone
      const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
      return new Date(utcDate.toLocaleString('en-US', { timeZone: toTimezone }));
    } catch (error) {
      logger.error(`Error converting timezone from ${fromTimezone} to ${toTimezone}: ${error}`);
      return date;
    }
  }

  /**
   * Gets the month name
   * @param monthIndex - Month index (0-11)
   * @param format - 'short' or 'long'
   * @returns Month name
   */
  private static getMonthName(monthIndex: number, format: 'short' | 'long'): string {
    const months = {
      short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    
    return months[format][monthIndex] || '';
  }

  /**
   * Gets common date presets for testing
   * @returns Object with common date presets
   */
  static getDatePresets() {
    const now = new Date();
    
    return {
      today: now,
      yesterday: this.subtractTime(now, 1, 'days'),
      tomorrow: this.addTime(now, 1, 'days'),
      lastWeek: this.subtractTime(now, 7, 'days'),
      nextWeek: this.addTime(now, 7, 'days'),
      lastMonth: this.subtractTime(now, 1, 'months'),
      nextMonth: this.addTime(now, 1, 'months'),
      lastYear: this.subtractTime(now, 1, 'years'),
      nextYear: this.addTime(now, 1, 'years'),
      startOfYear: new Date(now.getFullYear(), 0, 1),
      endOfYear: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      startOfMonth: new Date(now.getFullYear(), now.getMonth(), 1),
      endOfMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    };
  }
}
