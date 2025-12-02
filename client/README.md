# BudgetFlow

A modern, full-stack budget management application built with the MERN stack (MongoDB, Express, React, Node.js). BudgetFlow features three distinct UI personas tailored for different user types: Salary earners, Enterprise/Client managers, and Self-employed professionals.

> 📖 **For detailed documentation of all files and components, see [DOCS.md](../DOCS.md)**

## ✨ Features

### Core Functionality
- **Transaction Management** - Track income and expenses with detailed categorization
- **Budget Planning** - Set and monitor budgets with progress tracking
- **Client Management** - Manage client information and relationships (Enterprise & Self-employed)
- **Invoice System** - Create, track, and manage invoices with automatic calculations
- **Multi-Account Support** - Track transactions across multiple accounts (Cash, Bank, Credit Card, UPI, etc.)
- **Advanced Filtering** - Filter transactions by date, category, account, tags, and more
- **CSV Import/Export** - Bulk import and export transaction data
- **Receipt Uploads** - Attach receipts to transactions
- **Role-Based Access Control** - Granular permissions based on user roles
- **Audit Logging** - Track all system actions for security and compliance

### Three Distinct UI Personas

#### 💼 Salary Persona
Modern, tech-focused dark UI designed for salaried employees:
- Sleek dark theme with cyan/blue accents
- Personal transaction tracking
- Budget management
- Expense categorization

#### 🏢 Enterprise Persona
Professional, data-driven UI for business managers:
- Clean, corporate design
- Client management dashboard
- Invoice generation and tracking
- Business reports and analytics
- Team collaboration features

#### 🎯 Self-Employed Persona
Hybrid UI combining personal and business features:
- Warm, earthy color palette
- Business expense tracking
- Client management
- Income/expense separation
- Project-based tracking

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **React Router DOM 7** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization and charts
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **PDFKit** - PDF generation
- **Morgan** - HTTP request logger
- **Winston** - Application logging

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Clone the Repository
```bash
git clone <repository-url>
cd k
```

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create environment variables (optional):
```bash
# Create a .env file in the server directory
PORT=3001
JWT_SECRET=your-secret-key-here
MONGO_URI=mongodb://localhost:27017/budget_manager
```

4. Start the server:
```bash
npm start
```

The server will run on `http://localhost:3001`

### Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

## 🚀 Usage

### 🔑 Demo Credentials

The application comes pre-seeded with demo accounts for testing each persona. **Use these credentials to login and explore the different interfaces:**

#### Quick Login Credentials

| Role | Email | Password | UI Theme | Features |
|------|-------|----------|----------|----------|
| **Admin** | `admin@example.com` | `admin123` | Full Access | All features + audit logs |
| **Enterprise/Client Manager** | `cm@example.com` | `cm123` | Professional | Client management, invoices, reports |
| **Salary Person** | `salary@example.com` | `salary123` | Dark/Modern | Personal finance, budgets, transactions |
| **Self-Employed** | `self@example.com` | `self123` | Warm/Hybrid | Business + personal tracking |
| **Accountant** | `acct@example.com` | `acct123` | View-Only | Read access to financial data |

> **💡 Tip**: Try logging in with different roles to see how the UI and available features change based on the user persona!

#### Recommended Test Flow
1. **Start with Salary Persona** (`salary@example.com` / `salary123`) - Experience the modern dark UI
2. **Try Enterprise Persona** (`cm@example.com` / `cm123`) - Explore client and invoice management
3. **Test Self-Employed Persona** (`self@example.com` / `self123`) - See the hybrid business/personal interface
4. **Admin Access** (`admin@example.com` / `admin123`) - View all features and audit logs

### Creating a New Account

1. Navigate to `/register`
2. Enter your email and password (minimum 6 characters)
3. Select your account type:
   - **Salary Person** - For personal finance tracking
   - **Self Employed** - For freelancers and small business owners
   - **Enterprise / Client Mgmt** - For business managers
   - **Admin** - Full system access
4. Click "Create Account"
5. Login with your credentials

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: { email, password, role }
Response: { id, email, role }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, role }
```

#### Get Current User
```
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { user_id, role, email }
```

### Transaction Endpoints

#### Get Transactions
```
GET /api/transactions
Headers: { Authorization: "Bearer <token>" }
Query Params: type, account, category_id, tag, reconciled, from, to, q
Response: [{ transaction objects }]
```

#### Create Transaction
```
POST /api/transactions
Headers: { Authorization: "Bearer <token>" }
Body: { date, amount, type, category_id, account, tags, vendor, client, notes, ... }
Response: { transaction object }
```

#### Update Transaction
```
PUT /api/transactions/:id
Headers: { Authorization: "Bearer <token>" }
Body: { fields to update }
Response: { updated transaction }
```

#### Delete Transaction
```
DELETE /api/transactions/:id
Headers: { Authorization: "Bearer <token>" }
Response: { deleted transaction }
```

#### Export Transactions (CSV)
```
GET /api/transactions/export.csv
Headers: { Authorization: "Bearer <token>" }
Response: CSV file download
```

#### Import Transactions (CSV)
```
POST /api/transactions/import.csv
Headers: { Authorization: "Bearer <token>" }
Body: FormData with CSV file
Response: { imported: count }
```

### Budget Endpoints

#### Get Budgets
```
GET /api/budgets
Headers: { Authorization: "Bearer <token>" }
Response: [{ budget objects }]
```

#### Create Budget
```
POST /api/budgets
Headers: { Authorization: "Bearer <token>" }
Body: { category_id, target, start_date, end_date, notes }
Response: { budget object }
```

### Client Endpoints

#### Get Clients
```
GET /api/clients
Headers: { Authorization: "Bearer <token>" }
Response: [{ client objects }]
```

#### Get Client Details
```
GET /api/clients/:id
Headers: { Authorization: "Bearer <token>" }
Response: { client object }
```

#### Create Client
```
POST /api/clients
Headers: { Authorization: "Bearer <token>" }
Body: { name, email, phone, address, gstin }
Response: { client object }
```

#### Update Client
```
PUT /api/clients/:id
Headers: { Authorization: "Bearer <token>" }
Body: { fields to update }
Response: { updated client }
```

### Invoice Endpoints

#### Get Invoices
```
GET /api/invoices
Headers: { Authorization: "Bearer <token>" }
Response: [{ invoice objects with populated client data }]
```

#### Get Invoice Details
```
GET /api/invoices/:id
Headers: { Authorization: "Bearer <token>" }
Response: { invoice object with client data }
```

#### Create Invoice
```
POST /api/invoices
Headers: { Authorization: "Bearer <token>" }
Body: { client_id, invoice_number, issue_date, due_date, items[], status, notes }
Response: { invoice object }
```

#### Update Invoice
```
PUT /api/invoices/:id
Headers: { Authorization: "Bearer <token>" }
Body: { fields to update }
Response: { updated invoice }
```

#### Delete Invoice
```
DELETE /api/invoices/:id
Headers: { Authorization: "Bearer <token>" }
Response: { deleted invoice }
```

### Dashboard Endpoint

#### Get Dashboard Data
```
GET /api/dashboard
Headers: { Authorization: "Bearer <token>" }
Response: { balance, cashflow_30d, cashflow_90d, upcoming_bills, budgets[] }
```

### Utility Endpoints

#### Get Categories
```
GET /api/categories
Response: [{ id, name, icon }]
```

#### Get Accounts
```
GET /api/accounts
Response: ["Cash", "Bank", "Credit Card", ...]
```

## 📁 Project Structure

```
k/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   └── ui/       # Base UI components (Button, Input, Modal, etc.)
│   │   ├── context/      # React Context providers
│   │   ├── layouts/      # Layout components for different personas
│   │   ├── pages/        # Page components
│   │   │   ├── salary/   # Salary persona pages
│   │   │   ├── enterprise/ # Enterprise persona pages
│   │   │   └── self-employed/ # Self-employed persona pages
│   │   ├── lib/          # Utility functions
│   │   ├── App.jsx       # Main app component with routing
│   │   ├── index.css     # Global styles and utility classes
│   │   └── main.jsx      # App entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                # Node.js backend
    ├── src/
    │   └── index.js      # Express server with all routes
    ├── uploads/          # Uploaded files (receipts, CSVs)
    ├── public/           # Static files
    └── package.json
```

## 🎨 Styling

The application uses **vanilla CSS** with custom utility classes (no Tailwind CSS dependency). All styles are defined in `client/src/index.css` and include:

- CSS custom properties for theming
- Utility classes for common patterns
- Component-specific styles
- Responsive design utilities
- Animation and transition classes
- Three theme variants (salary, enterprise, self-employed)

## 🔐 Role-Based Permissions

| Resource | Admin | Client Mgmt | Self-Employed | Salary | Accountant | Viewer |
|----------|-------|-------------|---------------|--------|------------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Transactions (View) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Transactions (Create/Update) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Transactions (Delete) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Budgets (View) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Budgets (Create/Update) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Clients (View) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| Clients (Create/Update) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Audit Logs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

## 🛠️ Development

### Build for Production

Client:
```bash
cd client
npm run build
```

Server:
```bash
cd server
npm start
```

### Linting

```bash
cd client
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for React 19
- Vite team for the blazing-fast build tool
- MongoDB team for the excellent database
- All open-source contributors

---

**BudgetFlow** - Manage your finances with ease 💰
