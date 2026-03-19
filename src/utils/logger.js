/**
 * Activity logger utility for tracking user actions
 * Provides comprehensive audit trail for security analysis
 */

export const LOG_SEVERITY = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    CRITICAL: 'critical'
  };
  
  export const LOG_ACTIONS = {
    // Authentication
    LOGIN_ATTEMPT: 'Login Attempt',
    LOGIN_SUCCESS: 'Login Success',
    LOGIN_FAILED: 'Login Failed',
    LOGOUT: 'Logout',
    TWO_FA_GENERATED: '2FA Generated',
    TWO_FA_SUCCESS: '2FA Verified',
    TWO_FA_FAILED: '2FA Failed',
    
    // Malicious Actions
    VIRUS_SCAN_START: 'Virus Scan Started',
    VIRUS_SCAN_COMPLETE: 'Virus Scan Complete',
    SPEED_OPTIMIZATION_START: 'Speed Optimization Started',
    SPEED_OPTIMIZATION_COMPLETE: 'Speed Optimization Complete',
    PROBLEM_FIX_START: 'Problem Fix Started',
    PROBLEM_FIX_COMPLETE: 'Problem Fix Complete',
    
    // Security
    PERMISSION_DENIED: 'Permission Denied',
    DEFENSE_MODE_ENABLED: 'Defense Mode Enabled',
    DEFENSE_MODE_DISABLED: 'Defense Mode Disabled',
    DEFENSE_ALERT: 'Defense Alert',
    
    // System
    LOG_EXPORT: 'Log Export',
    SESSION_TIMEOUT: 'Session Timeout',
    SYSTEM_ERROR: 'System Error'
  };
  
  /**
   * Create a log entry
   * @param {string} action - Action performed
   * @param {string} details - Detailed description
   * @param {string} severity - Log severity level
   * @param {string} username - User who performed action
   * @returns {Object} Formatted log entry
   */
  export const createLogEntry = (action, details, severity = LOG_SEVERITY.INFO, username = 'System') => {
    return {
      id: Date.now() + Math.random(), // Unique ID
      timestamp: new Date().toLocaleString(),
      isoTimestamp: new Date().toISOString(),
      action,
      details,
      severity,
      user: username
    };
  };
  
  /**
   * Format log for export
   * @param {Object} log - Log entry
   * @returns {string} Formatted log string
   */
  export const formatLogForExport = (log) => {
    return `[${log.timestamp}] [${log.severity.toUpperCase()}] ${log.user} - ${log.action}: ${log.details}`;
  };
  
  /**
   * Export logs to text file
   * @param {Array} logs - Array of log entries
   * @param {string} filename - Output filename
   */
  export const exportLogsToFile = (logs, filename = 'trojan_activity_log.txt') => {
    // Add header
    const header = `Educational Trojan Horse Simulator - Activity Log
  Generated: ${new Date().toLocaleString()}
  Total Entries: ${logs.length}
  ${'='.repeat(80)}
  
  `;
  
    // Format logs
    const logText = logs.map(formatLogForExport).join('\n');
    
    // Combine
    const content = header + logText;
    
    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  /**
   * Filter logs by severity
   * @param {Array} logs - Array of log entries
   * @param {string} severity - Severity level to filter
   * @returns {Array} Filtered logs
   */
  export const filterLogsBySeverity = (logs, severity) => {
    return logs.filter(log => log.severity === severity);
  };
  
  /**
   * Filter logs by user
   * @param {Array} logs - Array of log entries
   * @param {string} username - Username to filter
   * @returns {Array} Filtered logs
   */
  export const filterLogsByUser = (logs, username) => {
    return logs.filter(log => log.user === username);
  };
  
  /**
   * Filter logs by date range
   * @param {Array} logs - Array of log entries
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Filtered logs
   */
  export const filterLogsByDateRange = (logs, startDate, endDate) => {
    return logs.filter(log => {
      const logDate = new Date(log.isoTimestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  };
  
  /**
   * Get log statistics
   * @param {Array} logs - Array of log entries
   * @returns {Object} Statistics object
   */
  export const getLogStatistics = (logs) => {
    const stats = {
      total: logs.length,
      bySeverity: {},
      byUser: {},
      byAction: {}
    };
    
    logs.forEach(log => {
      // Count by severity
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
      
      // Count by user
      stats.byUser[log.user] = (stats.byUser[log.user] || 0) + 1;
      
      // Count by action
      stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1;
    });
    
    return stats;
  };
  
  /**
   * Search logs by keyword
   * @param {Array} logs - Array of log entries
   * @param {string} keyword - Search keyword
   * @returns {Array} Matching logs
   */
  export const searchLogs = (logs, keyword) => {
    const lowerKeyword = keyword.toLowerCase();
    return logs.filter(log => 
      log.action.toLowerCase().includes(lowerKeyword) ||
      log.details.toLowerCase().includes(lowerKeyword) ||
      log.user.toLowerCase().includes(lowerKeyword)
    );
  };
  
  