// src/components/TrojanSimulator.jsx
// Updated version using utility files

import React, { useState } from 'react';
import { Shield, AlertTriangle, Lock, Eye, EyeOff, User, Key, Activity, FileText, Zap, Settings, LogOut, Download } from 'lucide-react';

// Import utilities
import { 
  validateCredentials, 
  canExecuteActions, 
  getRoleInfo,
  generate2FACode as generateCode,
  isValid2FACode
} from '../utils/users';

import {
  createLogEntry,
  exportLogsToFile,
  LOG_SEVERITY,
  LOG_ACTIONS
} from '../utils/logger';

import {
  validateUsername,
  validatePassword,
  validate2FACode,
  validateLoginInputs,
  checkRateLimit,
  clearRateLimit
} from '../utils/validators';

const TrojanSimulator = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [show2FA, setShow2FA] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [twoFACode, setTwoFACode] = useState('');
  const [generated2FA, setGenerated2FA] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activityLog, setActivityLog] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [files, setFiles] = useState([
    { id: 1, name: 'document1.txt', hidden: false, infected: true },
    { id: 2, name: 'photo.jpg', hidden: false, infected: false },
    { id: 3, name: 'report.docx', hidden: false, infected: true },
    { id: 4, name: 'data.csv', hidden: false, infected: false },
    { id: 5, name: 'backup.zip', hidden: false, infected: false }
  ]);
  const [defenseMode, setDefenseMode] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Add log entry using utility
  const addLog = (action, details, severity = LOG_SEVERITY.INFO) => {
    const logEntry = createLogEntry(action, details, severity, user?.username || 'System');
    setActivityLog(prev => [logEntry, ...prev]);
  };

  // Handle login with validation
  const handleLogin = () => {
    setValidationErrors([]);
    
    // Validate inputs
    const validation = validateLoginInputs(credentials.username, credentials.password);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      addLog(LOG_ACTIONS.LOGIN_FAILED, `Validation failed: ${validation.errors.join(', ')}`, LOG_SEVERITY.DANGER);
      return;
    }
    
    // Check rate limiting
    const rateCheck = checkRateLimit(credentials.username, 5, 300000);
    if (rateCheck.isLimited) {
      alert(`Too many login attempts. Please try again after ${rateCheck.resetTime.toLocaleTimeString()}`);
      addLog(LOG_ACTIONS.LOGIN_FAILED, 'Rate limit exceeded', LOG_SEVERITY.WARNING);
      return;
    }
    
    // Validate credentials
    const validUser = validateCredentials(credentials.username, credentials.password);
    
    if (validUser) {
      const code = generateCode();
      setGenerated2FA(code);
      setShow2FA(true);
      addLog(LOG_ACTIONS.TWO_FA_GENERATED, `Code sent to ${validUser.email}`, LOG_SEVERITY.INFO);
      addLog(LOG_ACTIONS.LOGIN_ATTEMPT, `User ${credentials.username} entered correct credentials`, LOG_SEVERITY.SUCCESS);
    } else {
      addLog(LOG_ACTIONS.LOGIN_FAILED, `Invalid credentials for ${credentials.username}`, LOG_SEVERITY.DANGER);
      alert('Invalid username or password!');
    }
  };

  // Verify 2FA with validation
  const verify2FA = () => {
    // Validate 2FA code format
    const validation = validate2FACode(twoFACode);
    
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      addLog(LOG_ACTIONS.TWO_FA_FAILED, `Invalid format: ${validation.errors.join(', ')}`, LOG_SEVERITY.DANGER);
      return;
    }
    
    if (twoFACode === generated2FA) {
      const validUser = validateCredentials(credentials.username, credentials.password);
      setUser(validUser);
      setShowLogin(false);
      setShow2FA(false);
      clearRateLimit(credentials.username); // Clear rate limit on successful login
      addLog(LOG_ACTIONS.TWO_FA_SUCCESS, '2FA verified successfully', LOG_SEVERITY.SUCCESS);
      addLog(LOG_ACTIONS.LOGIN_SUCCESS, `${credentials.username} authenticated successfully with role: ${validUser.role}`, LOG_SEVERITY.SUCCESS);
    } else {
      addLog(LOG_ACTIONS.TWO_FA_FAILED, 'Invalid 2FA code entered', LOG_SEVERITY.DANGER);
      alert('Invalid 2FA code!');
    }
  };

  // Handle logout
  const handleLogout = () => {
    addLog(LOG_ACTIONS.LOGOUT, `User ${user.username} logged out`, LOG_SEVERITY.INFO);
    setUser(null);
    setShowLogin(true);
    setCredentials({ username: '', password: '' });
    setTwoFACode('');
    setValidationErrors([]);
  };

  // Scan and remove viruses
  const scanAndRemoveViruses = async () => {
    if (!canExecuteActions(user)) {
      alert('You do not have permission for this action!');
      addLog(LOG_ACTIONS.PERMISSION_DENIED, `${user.username} (${user.role}) attempted virus scan`, LOG_SEVERITY.WARNING);
      return;
    }

    setScanning(true);
    addLog(LOG_ACTIONS.VIRUS_SCAN_START, 'Initiating fake virus removal', LOG_SEVERITY.WARNING);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const infectedFiles = files.filter(f => f.infected && !f.hidden);
    setFiles(prev => prev.filter(f => !f.infected || f.hidden));
    
    addLog(
      LOG_ACTIONS.VIRUS_SCAN_COMPLETE, 
      `Deleted ${infectedFiles.length} infected files: ${infectedFiles.map(f => f.name).join(', ')}`, 
      LOG_SEVERITY.DANGER
    );
    
    if (defenseMode) {
      addLog(
        LOG_ACTIONS.DEFENSE_ALERT, 
        'ANTIVIRUS DETECTION: Unauthorized file deletion detected! Trojan behavior identified.', 
        LOG_SEVERITY.DANGER
      );
    }
    
    setScanning(false);
  };

  // Make computer faster (creates duplicates)
  const makeComputerFaster = async () => {
    if (!canExecuteActions(user)) {
      alert('You do not have permission for this action!');
      addLog(LOG_ACTIONS.PERMISSION_DENIED, `${user.username} (${user.role}) attempted speed optimization`, LOG_SEVERITY.WARNING);
      return;
    }

    setProcessing(true);
    addLog(LOG_ACTIONS.SPEED_OPTIMIZATION_START, 'Creating duplicate files to slow system', LOG_SEVERITY.WARNING);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newFiles = [];
    files.forEach(file => {
      for (let i = 1; i <= 3; i++) {
        newFiles.push({
          id: Date.now() + Math.random(),
          name: `${file.name}_copy${i}`,
          hidden: false,
          infected: false
        });
      }
    });
    
    setFiles(prev => [...prev, ...newFiles]);
    addLog(
      LOG_ACTIONS.SPEED_OPTIMIZATION_COMPLETE, 
      `Created ${newFiles.length} duplicate files (system will slow down significantly)`, 
      LOG_SEVERITY.DANGER
    );
    
    if (defenseMode) {
      addLog(
        LOG_ACTIONS.DEFENSE_ALERT, 
        'ANTIVIRUS DETECTION: Suspicious file multiplication detected! Possible disk space attack.', 
        LOG_SEVERITY.DANGER
      );
    }
    
    setProcessing(false);
  };

  // Fix problem (renames and hides files)
  const fixProblem = async () => {
    if (!canExecuteActions(user)) {
      alert('You do not have permission for this action!');
      addLog(LOG_ACTIONS.PERMISSION_DENIED, `${user.username} (${user.role}) attempted problem fix`, LOG_SEVERITY.WARNING);
      return;
    }

    setProcessing(true);
    addLog(LOG_ACTIONS.PROBLEM_FIX_START, 'Renaming and hiding files', LOG_SEVERITY.WARNING);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const modifiedFiles = [];
    setFiles(prev => prev.map(file => {
      if (!file.hidden && Math.random() > 0.5) {
        modifiedFiles.push(file.name);
        return {
          ...file,
          name: `corrupted_${file.name}`,
          hidden: true
        };
      }
      return file;
    }));
    
    addLog(
      LOG_ACTIONS.PROBLEM_FIX_COMPLETE, 
      `Renamed and hid ${modifiedFiles.length} files: ${modifiedFiles.join(', ')}`, 
      LOG_SEVERITY.DANGER
    );
    
    if (defenseMode) {
      addLog(
        LOG_ACTIONS.DEFENSE_ALERT, 
        'ANTIVIRUS DETECTION: Unauthorized file modification and hiding! Data integrity compromised.', 
        LOG_SEVERITY.DANGER
      );
    }
    
    setProcessing(false);
  };

  // Export logs using utility
  const exportLogs = () => {
    exportLogsToFile(activityLog, `trojan_activity_log_${Date.now()}.txt`);
    addLog(LOG_ACTIONS.LOG_EXPORT, `Exported ${activityLog.length} log entries`, LOG_SEVERITY.INFO);
  };

  // Toggle defense mode
  const toggleDefenseMode = () => {
    const newMode = !defenseMode;
    setDefenseMode(newMode);
    addLog(
      newMode ? LOG_ACTIONS.DEFENSE_MODE_ENABLED : LOG_ACTIONS.DEFENSE_MODE_DISABLED,
      newMode 
        ? 'Antivirus detection simulation activated' 
        : 'Antivirus detection simulation deactivated',
      LOG_SEVERITY.INFO
    );
  };

  // Render login screen
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-blue-500">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Educational Trojan Simulator
          </h1>
          <p className="text-center text-gray-400 mb-6">Cybersecurity Awareness Training</p>
          
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-900 border border-red-500 rounded-lg">
              <p className="text-sm font-semibold text-red-200 mb-1">Validation Errors:</p>
              {validationErrors.map((error, index) => (
                <p key={index} className="text-xs text-red-300">• {error}</p>
              ))}
            </div>
          )}
          
          {!show2FA ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="admin, user, or guest"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Login
              </button>
              
              <div className="mt-4 p-3 bg-gray-700 rounded-lg text-sm text-gray-300">
                <p className="font-semibold mb-1">Demo Credentials:</p>
                <p>Admin: admin / Admin@123</p>
                <p>User: user / User@123</p>
                <p>Guest: guest / Guest@123</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-900 border border-blue-500 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-200 mb-2">
                  2FA code sent to: {validateCredentials(credentials.username, credentials.password)?.email}
                </p>
                <p className="text-xl font-mono font-bold text-white text-center">
                  {generated2FA}
                </p>
                <p className="text-xs text-blue-300 text-center mt-2">
                  (In production, this would be sent via email/SMS)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Enter 2FA Code</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={twoFACode}
                    onChange={(e) => setTwoFACode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
              </div>
              
              <button
                onClick={verify2FA}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Verify & Login
              </button>
              
              <button
                onClick={() => {
                  setShow2FA(false); 
                  setTwoFACode('');
                  setValidationErrors([]);
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Get user role info
  const roleInfo = getRoleInfo(user.role);

  // Main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-4 border border-red-500">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Trojan Horse Simulator</h1>
                <p className="text-sm text-gray-400">
                  User: {user.username} | Role: <span className={`font-semibold text-${roleInfo.color}-400`}>
                    {roleInfo.name}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDefenseMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                  defenseMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Shield className="w-5 h-5" />
                Defense Mode: {defenseMode ? 'ON' : 'OFF'}
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-200"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Malicious Actions Panel */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-500">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6 text-red-400" />
              Malicious Actions
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={scanAndRemoveViruses}
                disabled={scanning || processing}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition duration-200"
              >
                <span className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Scan & Remove Viruses
                </span>
                {scanning && <Activity className="w-5 h-5 animate-spin" />}
              </button>
              
              <p className="text-sm text-gray-400 px-2">
                ⚠️ Claims to remove viruses, actually deletes important files
              </p>
              
              <button
                onClick={makeComputerFaster}
                disabled={scanning || processing}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition duration-200"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Make Computer Faster
                </span>
                {processing && <Activity className="w-5 h-5 animate-spin" />}
              </button>
              
              <p className="text-sm text-gray-400 px-2">
                ⚠️ Claims to speed up system, creates duplicates to slow it down
              </p>
              
              <button
                onClick={fixProblem}
                disabled={scanning || processing}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-semibold transition duration-200"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Fix Problem
                </span>
                {processing && <Activity className="w-5 h-5 animate-spin" />}
              </button>
              
              <p className="text-sm text-gray-400 px-2">
                ⚠️ Claims to fix issues, renames and hides your files
              </p>
            </div>

            {/* File System Display */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-between">
                <span>Simulated File System</span>
                <span className="text-sm text-gray-400">
                  {files.filter(f => !f.hidden).length} visible files
                </span>
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                {files.filter(f => !f.hidden).map(file => (
                  <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded transition">
                    <span className="text-gray-300 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {file.name}
                    </span>
                    {file.infected && (
                      <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                        INFECTED
                      </span>
                    )}
                  </div>
                ))}
                {files.filter(f => !f.hidden).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No visible files</p>
                )}
              </div>
              {files.filter(f => f.hidden).length > 0 && (
                <p className="text-xs text-yellow-400 mt-2">
                  ⚠️ {files.filter(f => f.hidden).length} file(s) hidden from view
                </p>
              )}
            </div>
          </div>

          {/* Activity Log Panel */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-400" />
                Activity Log
                <span className="text-sm text-gray-400 font-normal">
                  ({activityLog.length} entries)
                </span>
              </h2>
              <button
                onClick={exportLogs}
                disabled={activityLog.length === 0}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm font-semibold transition duration-200"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 max-h-[600px] overflow-y-auto space-y-2">
              {activityLog.map(log => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    log.severity === LOG_SEVERITY.DANGER || log.severity === LOG_SEVERITY.CRITICAL 
                      ? 'bg-red-900 border-red-500' :
                    log.severity === LOG_SEVERITY.WARNING 
                      ? 'bg-yellow-900 border-yellow-500' :
                    log.severity === LOG_SEVERITY.SUCCESS 
                      ? 'bg-green-900 border-green-500' :
                    'bg-blue-900 border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{log.action}</p>
                      <p className="text-xs text-gray-300 mt-1">{log.details}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">User: {log.user}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      log.severity === LOG_SEVERITY.DANGER || log.severity === LOG_SEVERITY.CRITICAL 
                        ? 'bg-red-700 text-red-100' :
                      log.severity === LOG_SEVERITY.WARNING 
                        ? 'bg-yellow-700 text-yellow-100' :
                      log.severity === LOG_SEVERITY.SUCCESS 
                        ? 'bg-green-700 text-green-100' :
                      'bg-blue-700 text-blue-100'
                    }`}>
                      {log.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
              
              {activityLog.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500">No activity logged yet</p>
                  <p className="text-xs text-gray-600 mt-1">Actions will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Educational Info Panel */}
        <div className="mt-4 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg shadow-lg p-6 border border-blue-500">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Educational Purpose & How Trojans Work
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-300 mb-2">
                <strong className="text-white">What This Demonstrates:</strong>
              </p>
              <ul className="text-gray-400 space-y-1 list-disc list-inside">
                <li>Deceptive user interfaces that hide true intentions</li>
                <li>Gap between claimed and actual functionality</li>
                <li>Importance of activity monitoring and logging</li>
                <li>How antivirus software detects malicious behavior</li>
              </ul>
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                <strong className="text-white">Safety Features:</strong>
              </p>
              <ul className="text-gray-400 space-y-1 list-disc list-inside">
                <li>All operations simulated in memory only</li>
                <li>No real file system access or modifications</li>
                <li>Complete transparency via activity log</li>
                <li>Role-based access control prevents abuse</li>
              </ul>
            </div>
          </div>
          <p className="text-gray-300 text-xs mt-3 italic">
            💡 Tip: Enable Defense Mode to see how antivirus software would detect these malicious behaviors!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrojanSimulator;