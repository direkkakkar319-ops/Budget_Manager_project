# BudgetFlow - Documentation Index

Welcome to BudgetFlow! This document helps you navigate all the documentation available.

---

## 📚 Documentation Files

### 1. **README.md** (Main Documentation)
**Location**: `/client/README.md`

**Contents**:
- Project overview and features
- Tech stack details
- Installation instructions
- **🔑 Sample login credentials**
- API documentation
- Project structure
- Usage guide
- Role-based permissions

**Best for**: Getting started, understanding the project, API reference

---

### 2. **DOCS.md** (Comprehensive File Documentation)
**Location**: `/DOCS.md`

**Contents**:
- Detailed explanation of every file
- Purpose and responsibilities of each component
- Database schema documentation
- Design system specifications
- Security features
- Performance optimizations
- Testing recommendations
- Future enhancements

**Best for**: Understanding the codebase, contributing to the project, learning the architecture

---

### 3. **QUICKSTART.md** (Quick Reference)
**Location**: `/QUICKSTART.md`

**Contents**:
- **🔑 All sample login credentials in one place**
- Recommended testing order
- Quick start commands
- Tips for exploring each persona
- UI theme comparison

**Best for**: Quick reference, testing the application, demo purposes

---

### 4. **SYSTEM_DESIGN.md** (System Architecture)
**Location**: `/SYSTEM_DESIGN.md`

**Contents**:
- **🏗️ Mermaid diagrams** showing complete system architecture
- High-level MERN stack architecture
- API endpoints and connections
- Authentication & authorization flow
- Role-based access control (RBAC) visualization
- Database schema relationships (ER diagrams)
- Frontend component hierarchy
- Complete request-response cycles
- Technology stack details
- Deployment architecture

**Best for**: Understanding system design, architecture review, technical documentation

---

### 5. **API_REFERENCE.md** (API Documentation)
**Location**: `/API_REFERENCE.md`

**Contents**:
- **📡 Complete API endpoint reference**
- Request/response formats for all endpoints
- Authentication requirements
- Role-based permissions matrix
- Query parameters and filters
- Error response codes
- Example requests and responses
- Content types and headers

**Best for**: API integration, frontend development, testing

---

## 🔑 Sample Login Credentials (Quick Reference)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin123` |
| Enterprise | `cm@example.com` | `cm123` |
| Salary | `salary@example.com` | `salary123` |
| Self-Employed | `self@example.com` | `self123` |
| Accountant | `acct@example.com` | `acct123` |

---

## 🗂️ Project Structure

```
k/
├── README.md                    # This index file
├── DOCS.md                      # Comprehensive file documentation
├── QUICKSTART.md                # Quick start guide with credentials
├── SYSTEM_DESIGN.md             # System architecture with Mermaid diagrams
├── API_REFERENCE.md             # Complete API endpoint reference
│
├── client/                      # Frontend React application
│   ├── README.md               # Main project documentation
│   ├── src/
│   │   ├── App.jsx             # Main app with routing
│   │   ├── main.jsx            # Entry point
│   │   ├── index.css           # Global styles
│   │   │
│   │   ├── components/         # Reusable components
│   │   │   └── ui/            # Base UI components
│   │   │
│   │   ├── context/           # React Context (Auth)
│   │   │
│   │   ├── layouts/           # Layout components
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── SalaryLayout.jsx
│   │   │   ├── EnterpriseLayout.jsx
│   │   │   └── SelfEmployedLayout.jsx
│   │   │
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── salary/        # Salary persona pages
│   │   │   ├── enterprise/    # Enterprise persona pages
│   │   │   └── self-employed/ # Self-employed persona pages
│   │   │
│   │   └── lib/               # Utilities
│   │
│   └── package.json
│
└── server/                     # Backend Node.js application
    ├── src/
    │   └── index.js           # Main server file (all routes)
    ├── uploads/               # Uploaded files
    ├── public/                # Static files
    └── package.json
```

---

## 🎯 Where to Start?

### New to the Project?
1. Read **client/README.md** for overview
2. Use **QUICKSTART.md** for sample credentials
3. Start the app and login with test accounts

### Want to Understand the Code?
1. Read **DOCS.md** for file-by-file breakdown
2. Explore the source code
3. Check API documentation in README.md

### Want to Test/Demo?
1. Use **QUICKSTART.md** for credentials
2. Follow the recommended testing order
3. Explore all three personas

### Want to Contribute?
1. Read **DOCS.md** for architecture
2. Check **client/README.md** for tech stack
3. Follow the project structure
4. Review role-based permissions

---

## 🚀 Quick Commands

### Start the Application
```bash
# Terminal 1 - Start server
cd server
npm install
npm start

# Terminal 2 - Start client
cd client
npm install
npm run dev
```

### Access the Application
- **Client**: http://localhost:5173
- **Server**: http://localhost:3001
- **Login**: Use credentials from QUICKSTART.md

---

## 📖 Documentation Sections

### In README.md
- ✨ Features
- 🛠️ Tech Stack
- 📦 Installation
- 🔑 Demo Credentials ⭐
- 📚 API Documentation
- 📁 Project Structure
- 🎨 Styling
- 🔐 Role-Based Permissions

### In DOCS.md
- 📁 File-by-file documentation
- 🗄️ Database Schema
- 🎨 Design System
- 🔒 Security Features
- 🚀 Performance Optimizations
- 🧪 Testing Recommendations
- 🔄 Future Enhancements

### In QUICKSTART.md
- 🔑 All Sample Credentials ⭐
- 🎯 Recommended Testing Order
- 💡 Tips and Tricks
- 🎨 UI Theme Comparison

### In SYSTEM_DESIGN.md
- 🏗️ High-Level System Architecture
- 🔌 API Endpoints & Connections
- 🔐 Authentication & Authorization Flow
- 📊 Data Flow Diagrams
- 🎭 Role-Based Access Control (RBAC)
- 🗄️ Database Schema Relationships
- 🎨 Frontend Component Hierarchy
- 🔄 Complete Request-Response Cycle
- 📦 Technology Stack Details
- 🚀 Deployment Architecture

### In API_REFERENCE.md
- 📡 All API Endpoints
- 🔐 Authentication Endpoints
- 💰 Transaction Endpoints
- 📊 Budget Endpoints
- 👥 Client Endpoints
- 🧾 Invoice Endpoints
- 📈 Dashboard Endpoint
- 🔧 Utility Endpoints
- 🔑 Role-Based Permissions Matrix
- ❌ Error Response Codes

---

## 🎨 Three UI Personas

### 💼 Salary Persona
- **Theme**: Dark, modern, tech-focused
- **Color**: Cyan/Blue
- **Features**: Personal finance, budgets, transactions
- **Login**: `salary@example.com` / `salary123`

### 🏢 Enterprise Persona
- **Theme**: Professional, corporate, clean
- **Color**: Blue
- **Features**: Clients, invoices, reports
- **Login**: `cm@example.com` / `cm123`

### 🎯 Self-Employed Persona
- **Theme**: Warm, hybrid, friendly
- **Color**: Orange/Amber
- **Features**: Business + personal tracking
- **Login**: `self@example.com` / `self123`

---

## 💡 Pro Tips

1. **Each persona has a unique UI** - Login with different accounts to see the difference
2. **Role-based access control** - Different roles have different permissions
3. **Fully functional** - Create transactions, budgets, invoices, and more
4. **Responsive design** - Works on mobile, tablet, and desktop
5. **Modern tech stack** - React 19, Vite, MongoDB, Express

---

## 🆘 Need Help?

1. Check **QUICKSTART.md** for quick answers
2. Read **client/README.md** for detailed setup
3. Review **DOCS.md** for code understanding
4. Check API documentation in README.md

---

**BudgetFlow** - Manage your finances with ease 💰

*Last Updated: November 2025*
