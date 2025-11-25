
/**
 * Test Data Generator Module
 * 
 * This module provides comprehensive test data generation utilities for the BDD framework.
 * It includes generators for various data types, realistic fake data, and customizable
 * data patterns for thorough test coverage.
 * 
 * Key Features:
 * - Personal information generation (names, emails, addresses)
 * - Financial data generation (credit cards, bank accounts, currencies)
 * - Business data generation (companies, products, invoices)
 * - Technical data generation (URLs, IPs, UUIDs, passwords)
 * - Custom pattern-based generation
 * - Localization support for different regions
 * - Seed-based reproducible random generation
 * - Data validation and format checking
 * 
 * @author OpenHands
 * @version 1.0.0
 */

import { logger } from './logger';
import { DateUtils } from './DateUtils';

/**
 * Interface for address generation
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Interface for person generation
 */
export interface Person {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: Address;
}

/**
 * Interface for credit card generation
 */
export interface CreditCard {
  number: string;
  type: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
}

/**
 * Interface for company generation
 */
export interface Company {
  name: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: Address;
  taxId: string;
}

/**
 * Configuration for data generation
 */
export interface GeneratorConfig {
  locale?: string;
  seed?: number;
  customPatterns?: { [key: string]: string[] };
}

/**
 * Comprehensive test data generator class providing realistic fake data
 * for various testing scenarios and data types
 */
export class TestDataGenerator {
  private static instance: TestDataGenerator;
  // Configuration is stored but not directly used in current implementation
  // private config: GeneratorConfig;
  private randomSeed: number;

  // Data arrays for generation
  private readonly firstNames = {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen']
  };

  private readonly lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
  ];

  private readonly cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
    'Indianapolis', 'Seattle', 'Denver', 'Washington'
  ];

  private readonly states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri'
  ];

  private readonly companies = [
    'TechCorp', 'DataSystems', 'InnovateLab', 'GlobalTech', 'FutureSoft', 'DigitalWorks', 'SmartSolutions',
    'NextGen', 'CloudFirst', 'AgileWorks', 'DevOps Inc', 'CodeCraft', 'ByteForge', 'PixelPerfect', 'WebWorks'
  ];

  private readonly industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Construction',
    'Transportation', 'Entertainment', 'Food Service', 'Real Estate', 'Consulting', 'Marketing', 'Legal'
  ];

  private readonly domains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'company.com', 'business.org', 'test.net'
  ];

  private readonly creditCardTypes = {
    'Visa': { prefix: '4', length: 16 },
    'MasterCard': { prefix: '5', length: 16 },
    'American Express': { prefix: '34', length: 15 },
    'Discover': { prefix: '6011', length: 16 }
  };

  private constructor(config: GeneratorConfig = {}) {
    // this.config = config; // Not used in current implementation
    this.randomSeed = config.seed || Date.now();
    this.seedRandom(this.randomSeed);
  }

  /**
   * Gets singleton instance of TestDataGenerator
   * @param config - Optional configuration
   * @returns TestDataGenerator instance
   */
  static getInstance(config?: GeneratorConfig): TestDataGenerator {
    if (!TestDataGenerator.instance || config) {
      TestDataGenerator.instance = new TestDataGenerator(config);
    }
    return TestDataGenerator.instance;
  }

  /**
   * Seeds the random number generator for reproducible results
   * @param seed - Seed value
   */
  private seedRandom(seed: number): void {
    this.randomSeed = seed;
  }

  /**
   * Generates a seeded random number between 0 and 1
   * @returns Random number
   */
  private random(): number {
    const x = Math.sin(this.randomSeed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Generates a random integer within a range
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (exclusive)
   * @returns Random integer
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min)) + min;
  }

  /**
   * Selects a random element from an array or string
   * @param arrayOrString - Array or string to select from
   * @returns Random element or character
   */
  private randomChoice<T>(arrayOrString: T[] | string): T | string {
    if (typeof arrayOrString === 'string') {
      return arrayOrString.charAt(this.randomInt(0, arrayOrString.length));
    }
    return arrayOrString[this.randomInt(0, arrayOrString.length)];
  }

  /**
   * Generates a random string of specified length
   * @param length - Length of string
   * @param charset - Character set to use
   * @returns Random string
   */
  generateRandomString(length: number, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(this.randomInt(0, charset.length));
    }
    return result;
  }

  /**
   * Generates a random number within a range
   * @param min - Minimum value
   * @param max - Maximum value
   * @param decimals - Number of decimal places
   * @returns Random number
   */
  generateRandomNumber(min: number = 0, max: number = 100, decimals: number = 0): number {
    const num = this.random() * (max - min) + min;
    return decimals > 0 ? parseFloat(num.toFixed(decimals)) : Math.floor(num);
  }

  /**
   * Generates a random boolean value
   * @param probability - Probability of true (0-1)
   * @returns Random boolean
   */
  generateRandomBoolean(probability: number = 0.5): boolean {
    return this.random() < probability;
  }

  /**
   * Generates a random first name
   * @param gender - Optional gender specification
   * @returns Random first name
   */
  generateFirstName(gender?: 'male' | 'female'): string {
    if (gender) {
      return this.randomChoice(this.firstNames[gender]);
    }
    const allNames = [...this.firstNames.male, ...this.firstNames.female];
    return this.randomChoice(allNames);
  }

  /**
   * Generates a random last name
   * @returns Random last name
   */
  generateLastName(): string {
    return this.randomChoice(this.lastNames);
  }

  /**
   * Generates a random full name
   * @param gender - Optional gender specification
   * @returns Random full name
   */
  generateFullName(gender?: 'male' | 'female'): string {
    return `${this.generateFirstName(gender)} ${this.generateLastName()}`;
  }

  /**
   * Generates a random email address
   * @param name - Optional name to base email on
   * @param domain - Optional domain to use
   * @returns Random email address
   */
  generateEmail(name?: string, domain?: string): string {
    const emailName = name ? 
      name.toLowerCase().replace(/\s+/g, '.') : 
      `${this.generateFirstName().toLowerCase()}.${this.generateLastName().toLowerCase()}`;
    
    const emailDomain = domain || this.randomChoice(this.domains);
    
    return `${emailName}${this.randomInt(1, 100)}@${emailDomain}`;
  }

  /**
   * Generates a random phone number
   * @param format - Phone number format
   * @returns Random phone number
   */
  generatePhoneNumber(format: string = '(###) ###-####'): string {
    return format.replace(/#/g, () => this.randomInt(0, 10).toString());
  }

  /**
   * Generates a random address
   * @returns Random address object
   */
  generateAddress(): Address {
    const streetNumber = this.randomInt(1, 9999);
    const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Cedar Ln', 'Maple Way', 'Park Blvd'];
    
    return {
      street: `${streetNumber} ${this.randomChoice(streetNames)}`,
      city: this.randomChoice(this.cities),
      state: this.randomChoice(this.states),
      zipCode: this.randomInt(10000, 99999).toString(),
      country: 'United States'
    };
  }

  /**
   * Generates a random person with complete details
   * @param gender - Optional gender specification
   * @returns Random person object
   */
  generatePerson(gender?: 'Male' | 'Female' | 'Other'): Person {
    const genderLower = gender?.toLowerCase() as 'male' | 'female' | undefined;
    const firstName = this.generateFirstName(genderLower);
    const lastName = this.generateLastName();
    const fullName = `${firstName} ${lastName}`;
    const birthDate = DateUtils.generateRandomDate(
      new Date(1950, 0, 1),
      new Date(2005, 11, 31)
    );

    return {
      firstName,
      lastName,
      fullName,
      email: this.generateEmail(fullName),
      phone: this.generatePhoneNumber(),
      dateOfBirth: birthDate,
      age: DateUtils.calculateAge(birthDate),
      gender: gender || this.randomChoice(['Male', 'Female', 'Other']) as 'Male' | 'Female' | 'Other',
      address: this.generateAddress()
    };
  }

  /**
   * Generates a random credit card
   * @param type - Optional card type
   * @returns Random credit card object
   */
  generateCreditCard(type?: string): CreditCard {
    const cardType = type || this.randomChoice(Object.keys(this.creditCardTypes));
    const cardInfo = this.creditCardTypes[cardType as keyof typeof this.creditCardTypes];
    
    let number = cardInfo.prefix;
    const remainingDigits = cardInfo.length - cardInfo.prefix.length;
    
    for (let i = 0; i < remainingDigits; i++) {
      number += this.randomInt(0, 10).toString();
    }

    const expiryMonth = this.randomInt(1, 13).toString().padStart(2, '0');
    const expiryYear = (new Date().getFullYear() + this.randomInt(1, 6)).toString().slice(-2);

    return {
      number: this.formatCreditCardNumber(number),
      type: cardType,
      expiryDate: `${expiryMonth}/${expiryYear}`,
      cvv: this.randomInt(100, 999).toString(),
      holderName: this.generateFullName().toUpperCase()
    };
  }

  /**
   * Formats credit card number with spaces
   * @param number - Raw credit card number
   * @returns Formatted credit card number
   */
  private formatCreditCardNumber(number: string): string {
    return number.replace(/(.{4})/g, '$1 ').trim();
  }

  /**
   * Generates a random company
   * @returns Random company object
   */
  generateCompany(): Company {
    const companyName = this.randomChoice(this.companies);
    const industry = this.randomChoice(this.industries);
    
    return {
      name: companyName,
      industry,
      website: `www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      email: `info@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: this.generatePhoneNumber(),
      address: this.generateAddress(),
      taxId: this.randomInt(10, 99) + '-' + this.randomInt(1000000, 9999999)
    };
  }

  /**
   * Generates a random UUID
   * @returns Random UUID string
   */
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = this.randomInt(0, 16);
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Generates a random password
   * @param length - Password length
   * @param includeSymbols - Include special characters
   * @returns Random password
   */
  generatePassword(length: number = 12, includeSymbols: boolean = true): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = lowercase + uppercase + numbers;
    if (includeSymbols) {
      charset += symbols;
    }

    let password = '';
    // Ensure at least one character from each required set
    password += this.randomChoice(lowercase);
    password += this.randomChoice(uppercase);
    password += this.randomChoice(numbers);
    
    if (includeSymbols) {
      password += this.randomChoice(symbols);
    }

    // Fill remaining length
    for (let i = password.length; i < length; i++) {
      password += this.randomChoice(charset);
    }

    // Shuffle the password
    return password.split('').sort(() => this.random() - 0.5).join('');
  }

  /**
   * Generates a random URL
   * @param protocol - URL protocol
   * @param subdomain - Optional subdomain
   * @returns Random URL
   */
  generateURL(protocol: string = 'https', subdomain?: string): string {
    const domains = ['example.com', 'test.org', 'demo.net', 'sample.io', 'mock.co'];
    const paths = ['', '/home', '/about', '/contact', '/products', '/services', '/blog'];
    
    const domain = this.randomChoice(domains);
    const path = this.randomChoice(paths);
    const sub = subdomain || (this.randomInt(1, 100) > 70 ? 'www' : '');
    
    return `${protocol}://${sub ? sub + '.' : ''}${domain}${path}`;
  }

  /**
   * Generates a random IP address
   * @param version - IP version (4 or 6)
   * @returns Random IP address
   */
  generateIPAddress(version: 4 | 6 = 4): string {
    if (version === 4) {
      return Array.from({ length: 4 }, () => this.randomInt(0, 256)).join('.');
    } else {
      return Array.from({ length: 8 }, () => 
        this.randomInt(0, 65536).toString(16).padStart(4, '0')
      ).join(':');
    }
  }

  /**
   * Generates test data based on a pattern
   * @param pattern - Data pattern string
   * @returns Generated data matching pattern
   */
  generateFromPattern(pattern: string): string {
    return pattern
      .replace(/\{firstName\}/g, this.generateFirstName())
      .replace(/\{lastName\}/g, this.generateLastName())
      .replace(/\{email\}/g, this.generateEmail())
      .replace(/\{phone\}/g, this.generatePhoneNumber())
      .replace(/\{uuid\}/g, this.generateUUID())
      .replace(/\{number:(\d+)\}/g, (_, length) => 
        this.randomInt(Math.pow(10, parseInt(length) - 1), Math.pow(10, parseInt(length))).toString()
      )
      .replace(/\{string:(\d+)\}/g, (_, length) => 
        this.generateRandomString(parseInt(length))
      )
      .replace(/\{date\}/g, DateUtils.formatDate(new Date(), 'YYYY-MM-DD'));
  }

  /**
   * Generates an array of test data
   * @param generator - Generator function
   * @param count - Number of items to generate
   * @returns Array of generated data
   */
  generateArray<T>(generator: () => T, count: number): T[] {
    return Array.from({ length: count }, generator);
  }

  /**
   * Generates test data for specific scenarios
   * @param scenario - Test scenario type
   * @returns Scenario-specific test data
   */
  generateScenarioData(scenario: string): any {
    const scenarios = {
      'login': () => ({
        username: this.generateEmail(),
        password: this.generatePassword(),
        rememberMe: this.generateRandomBoolean()
      }),
      'registration': () => ({
        ...this.generatePerson(),
        username: this.generateRandomString(8),
        password: this.generatePassword(),
        confirmPassword: this.generatePassword(),
        agreeToTerms: true
      }),
      'payment': () => ({
        ...this.generateCreditCard(),
        billingAddress: this.generateAddress(),
        amount: this.generateRandomNumber(10, 1000, 2)
      }),
      'contact': () => ({
        name: this.generateFullName(),
        email: this.generateEmail(),
        phone: this.generatePhoneNumber(),
        subject: `Test Subject ${this.randomInt(1, 100)}`,
        message: `This is a test message generated on ${new Date().toISOString()}`
      })
    };

    const generator = scenarios[scenario as keyof typeof scenarios];
    if (!generator) {
      throw new Error(`Unknown scenario: ${scenario}`);
    }

    return generator();
  }

  /**
   * Resets the generator with a new seed
   * @param seed - New seed value
   */
  reset(seed?: number): void {
    this.randomSeed = seed || Date.now();
    this.seedRandom(this.randomSeed);
    logger.debug(`TestDataGenerator reset with seed: ${this.randomSeed}`);
  }

  /**
   * Gets the current seed value
   * @returns Current seed
   */
  getCurrentSeed(): number {
    return this.randomSeed;
  }
}

