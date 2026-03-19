/**
 * Input validation utilities
 * Ensures data integrity and security
 */

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {Object} Validation result
 */
export const validateUsername = (username) => {
    const errors = [];
    
    if (!username || username.trim() === '') {
      errors.push('Username is required');
    }
    
    if (username && username.length < 3) {
      errors.push('Username must be at least 3 characters');
    }
    
    if (username && username.length > 20) {
      errors.push('Username must not exceed 20 characters');
    }
    
    if (username && !/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with strength score
   */
  export const validatePassword = (password) => {
    const errors = [];
    let strength = 0;
    
    if (!password || password.trim() === '') {
      errors.push('Password is required');
      return { isValid: false, errors, strength: 0 };
    }
    
    // Length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else {
      strength += 1;
    }
    
    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else {
      strength += 1;
    }
    
    // Lowercase check
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else {
      strength += 1;
    }
    
    // Number check
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    } else {
      strength += 1;
    }
    
    // Special character check
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    } else {
      strength += 1;
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      strength, // 0-5 scale
      strengthLabel: getPasswordStrengthLabel(strength)
    };
  };
  
  /**
   * Get password strength label
   * @param {number} strength - Strength score (0-5)
   * @returns {string} Strength label
   */
  const getPasswordStrengthLabel = (strength) => {
    if (strength <= 1) return 'Very Weak';
    if (strength === 2) return 'Weak';
    if (strength === 3) return 'Medium';
    if (strength === 4) return 'Strong';
    return 'Very Strong';
  };
  
  /**
   * Validate 2FA code format
   * @param {string} code - 2FA code to validate
   * @returns {Object} Validation result
   */
  export const validate2FACode = (code) => {
    const errors = [];
    
    if (!code || code.trim() === '') {
      errors.push('2FA code is required');
    }
    
    if (code && !/^\d{6}$/.test(code)) {
      errors.push('2FA code must be exactly 6 digits');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {Object} Validation result
   */
  export const validateEmail = (email) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || email.trim() === '') {
      errors.push('Email is required');
    }
    
    if (email && !emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Sanitize input to prevent XSS
   * @param {string} input - Input to sanitize
   * @returns {string} Sanitized input
   */
  export const sanitizeInput = (input) => {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  
  /**
   * Validate filename for log export
   * @param {string} filename - Filename to validate
   * @returns {Object} Validation result
   */
  export const validateFilename = (filename) => {
    const errors = [];
    
    if (!filename || filename.trim() === '') {
      errors.push('Filename is required');
    }
    
    if (filename && !/^[a-zA-Z0-9_\-\.]+$/.test(filename)) {
      errors.push('Filename contains invalid characters');
    }
    
    if (filename && filename.length > 100) {
      errors.push('Filename is too long');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Check for common SQL injection patterns
   * @param {string} input - Input to check
   * @returns {boolean} True if suspicious pattern detected
   */
  export const detectSQLInjection = (input) => {
    if (!input) return false;
    
    const sqlPatterns = [
      /(\bOR\b|\bAND\b).*?=.*?/i,
      /UNION.*?SELECT/i,
      /DROP.*?TABLE/i,
      /INSERT.*?INTO/i,
      /DELETE.*?FROM/i,
      /UPDATE.*?SET/i,
      /--/,
      /;.*?DROP/i,
      /;.*?DELETE/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  };
  
  /**
   * Check for XSS patterns
   * @param {string} input - Input to check
   * @returns {boolean} True if suspicious pattern detected
   */
  export const detectXSS = (input) => {
    if (!input) return false;
    
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<embed/gi,
      /<object/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  };
  
  /**
   * Validate all inputs for a login attempt
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Object} Combined validation result
   */
  export const validateLoginInputs = (username, password) => {
    const usernameValidation = validateUsername(username);
    const passwordValidation = validatePassword(password);
    
    const allErrors = [
      ...usernameValidation.errors,
      ...passwordValidation.errors
    ];
    
    // Check for injection attacks
    if (detectSQLInjection(username) || detectSQLInjection(password)) {
      allErrors.push('Suspicious input detected');
    }
    
    if (detectXSS(username) || detectXSS(password)) {
      allErrors.push('Potentially malicious input detected');
    }
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      usernameValid: usernameValidation.isValid,
      passwordValid: passwordValidation.isValid
    };
  };
  
  /**
   * Rate limiting helper (tracks attempts in memory)
   * @param {string} identifier - User identifier (username or IP)
   * @param {number} maxAttempts - Maximum attempts allowed
   * @param {number} windowMs - Time window in milliseconds
   * @returns {Object} Rate limit status
   */
  const attemptTracking = new Map();
  
  export const checkRateLimit = (identifier, maxAttempts = 5, windowMs = 300000) => {
    const now = Date.now();
    const userAttempts = attemptTracking.get(identifier) || [];
    
    // Filter attempts within time window
    const recentAttempts = userAttempts.filter(timestamp => 
      now - timestamp < windowMs
    );
    
    // Update tracking
    recentAttempts.push(now);
    attemptTracking.set(identifier, recentAttempts);
    
    const isLimited = recentAttempts.length > maxAttempts;
    const attemptsRemaining = Math.max(0, maxAttempts - recentAttempts.length + 1);
    
    return {
      isLimited,
      attempts: recentAttempts.length,
      attemptsRemaining,
      resetTime: new Date(now + windowMs)
    };
  };
  
  /**
   * Clear rate limit for identifier
   * @param {string} identifier - User identifier
   */
  export const clearRateLimit = (identifier) => {
    attemptTracking.delete(identifier);
  };