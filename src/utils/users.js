/**
 * User database for authentication
 * In production, this would be stored in a secure database with hashed passwords
 */

export const USERS = {
    admin: {
      username: 'admin',
      password: 'Admin@123', // In production: use bcrypt hashing
      role: 'admin',
      email: 'admin@trojan.edu',
      permissions: ['read', 'write', 'delete', 'execute', 'admin']
    },
    user: {
      username: 'user',
      password: 'User@123',
      role: 'user',
      email: 'user@trojan.edu',
      permissions: ['read', 'write', 'execute']
    },
    guest: {
      username: 'guest',
      password: 'Guest@123',
      role: 'guest',
      email: 'guest@trojan.edu',
      permissions: ['read']
    }
  };
  
  /**
   * Role definitions with permission levels
   */
  export const ROLES = {
    admin: {
      name: 'Administrator',
      level: 3,
      description: 'Full system access with all permissions',
      color: 'red'
    },
    user: {
      name: 'User',
      level: 2,
      description: 'Standard user with execute permissions',
      color: 'blue'
    },
    guest: {
      name: 'Guest',
      level: 1,
      description: 'Read-only access, cannot execute actions',
      color: 'gray'
    }
  };
  
  /**
   * Permission definitions
   */
  export const PERMISSIONS = {
    read: 'View information and logs',
    write: 'Modify settings',
    delete: 'Delete files and data',
    execute: 'Execute malicious actions',
    admin: 'Administrative functions'
  };
  
  /**
   * Validate user credentials
   * @param {string} username - Username to validate
   * @param {string} password - Password to validate
   * @returns {Object|null} User object if valid, null otherwise
   */
  export const validateCredentials = (username, password) => {
    const user = USERS[username.toLowerCase()];
    
    if (!user) {
      return null;
    }
    
    if (user.password === password) {
      // Return user without password for security
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  };
  
  /**
   * Check if user has specific permission
   * @param {Object} user - User object
   * @param {string} permission - Permission to check
   * @returns {boolean} True if user has permission
   */
  export const hasPermission = (user, permission) => {
    if (!user || !user.permissions) {
      return false;
    }
    return user.permissions.includes(permission);
  };
  
  /**
   * Check if user can execute malicious actions
   * @param {Object} user - User object
   * @returns {boolean} True if user can execute
   */
  export const canExecuteActions = (user) => {
    if (!user) return false;
    return user.role === 'admin' || user.role === 'user';
  };
  
  /**
   * Get user role information
   * @param {string} roleName - Role name
   * @returns {Object} Role information
   */
  export const getRoleInfo = (roleName) => {
    return ROLES[roleName] || ROLES.guest;
  };
  
  /**
   * Generate random 2FA code
   * @returns {string} 6-digit code
   */
  export const generate2FACode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  /**
   * Validate 2FA code format
   * @param {string} code - Code to validate
   * @returns {boolean} True if valid format
   */
  export const isValid2FACode = (code) => {
    return /^\d{6}$/.test(code);
  };
  
  