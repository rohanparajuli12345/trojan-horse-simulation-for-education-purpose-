# Educational Trojan Horse Simulator

A cybersecurity awareness training tool that demonstrates Trojan horse malware behaviors in a safe, controlled environment.

## Features

- 🔐 Secure authentication with 2FA
- 👥 Role-Based Access Control (Admin, User, Guest)
- 🦠 Three malicious behavior simulations
- 📊 Transparent activity logging
- 🛡️ Optional defense mode
- 📥 Log export functionality

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup
\```bash
# Clone the repository
git clone https://github.com/yourusername/trojan-simulator.git
cd trojan-simulator

# Install dependencies
npm install

# Start development server
npm start
\```

The application will open at http://localhost:3000

## Usage

### Demo Credentials

- **Admin:** username: `admin` | password: `Admin@123`
- **User:** username: `user` | password: `User@123`  
- **Guest:** username: `guest` | password: `Guest@123`

### Features by Role

| Feature | Admin | User | Guest |
|---------|-------|------|-------|
| Scan & Remove Viruses | ✅ | ✅ | ❌ |
| Make Computer Faster | ✅ | ✅ | ❌ |
| Fix Problem | ✅ | ✅ | ❌ |
| View Activity Log | ✅ | ✅ | ✅ |
| Export Logs | ✅ | ✅ | ✅ |
| Defense Mode | ✅ | ✅ | ✅ |

## Educational Purpose

This tool simulates malicious Trojan behaviors WITHOUT causing actual harm:
- File operations occur in memory only
- No real file system access
- Complete transparency through activity logging
- Safe learning environment

## Security Features

- Multi-factor authentication (2FA)
- Role-based access control (RBAC)
- Secure session management
- Comprehensive audit logging
- Input validation
- No browser storage usage

## Development

\```bash
# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
\```

## Project Report

See `docs/PROJECT_REPORT.md` for comprehensive documentation including:
- DevSecOps methodology
- Security testing results
- User acceptance testing
- Technical architecture

## License

MIT License - Educational use only

## Authors

[Your Team Names and IDs]

## Acknowledgments

- ICT932 - Cybersecurity Testing and Assurance
- Charles Sturt University / CIHE
- S2 2025
\```