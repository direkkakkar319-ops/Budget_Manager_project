# BudgetFlow - System Design Architecture

This document contains Mermaid diagrams showing the complete system architecture, API connections, and data flow for the MERN stack application.

---

## 🏗️ High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer - React Frontend"
        Browser[Web Browser]
        React[React 19 + Vite]
        Router[React Router]
        Auth[Auth Context]
        
        subgraph "UI Personas"
            Salary[Salary Persona<br/>Dark Theme]
            Enterprise[Enterprise Persona<br/>Professional Theme]
            SelfEmployed[Self-Employed Persona<br/>Warm Theme]
        end
        
        subgraph "Components"
            Pages[Pages]
            Layouts[Layouts]
            UIComponents[UI Components]
        end
    end
    
    subgraph "Server Layer - Node.js Backend"
        Express[Express Server<br/>Port 3001]
        JWT[JWT Authentication]
        RBAC[Role-Based Access Control]
        Multer[Multer File Upload]
        
        subgraph "API Routes"
            AuthAPI[Auth API]
            TransAPI[Transactions API]
            BudgetAPI[Budgets API]
            ClientAPI[Clients API]
            InvoiceAPI[Invoices API]
            DashAPI[Dashboard API]
            AuditAPI[Audit API]
        end
    end
    
    subgraph "Database Layer"
        MongoDB[(MongoDB)]
        
        subgraph "Collections"
            Users[Users Collection]
            Transactions[Transactions Collection]
            Budgets[Budgets Collection]
            Clients[Clients Collection]
            Invoices[Invoices Collection]
            Audits[Audit Logs Collection]
        end
    end
    
    subgraph "File Storage"
        Uploads[/uploads/<br/>Receipt Images]
        Public[/public/<br/>Generated PDFs]
    end
    
    Browser --> React
    React --> Router
    Router --> Auth
    Auth --> Salary
    Auth --> Enterprise
    Auth --> SelfEmployed
    
    Salary --> Pages
    Enterprise --> Pages
    SelfEmployed --> Pages
    Pages --> Layouts
    Layouts --> UIComponents
    
    React -->|HTTP/HTTPS| Express
    Express --> JWT
    JWT --> RBAC
    Express --> Multer
    
    AuthAPI --> Users
    TransAPI --> Transactions
    BudgetAPI --> Budgets
    ClientAPI --> Clients
    InvoiceAPI --> Invoices
    DashAPI --> Transactions
    DashAPI --> Budgets
    AuditAPI --> Audits
    
    Express --> MongoDB
    Multer --> Uploads
    Express --> Public
    
    style React fill:#61dafb,stroke:#000,stroke-width:2px
    style Express fill:#90c53f,stroke:#000,stroke-width:2px
    style MongoDB fill:#4db33d,stroke:#000,stroke-width:2px
```

---

## 🔌 API Endpoints & Connections

```mermaid
graph LR
    subgraph "Frontend Components"
        Login[Login Page]
        Register[Register Page]
        Dashboard[Dashboard Pages]
        TransPage[Transactions Pages]
        BudgetPage[Budgets Pages]
        ClientPage[Clients Pages]
        InvoicePage[Invoices Pages]
    end
    
    subgraph "API Endpoints - Express Server"
        subgraph "Authentication /api/auth"
            PostRegister[POST /register]
            PostLogin[POST /login]
            GetMe[GET /me]
        end
        
        subgraph "Transactions /api/transactions"
            GetTrans[GET /]
            PostTrans[POST /]
            PutTrans[PUT /:id]
            DelTrans[DELETE /:id]
            ExportCSV[GET /export.csv]
            ImportCSV[POST /import.csv]
        end
        
        subgraph "Budgets /api/budgets"
            GetBudget[GET /]
            PostBudget[POST /]
            PutBudget[PUT /:id]
            DelBudget[DELETE /:id]
        end
        
        subgraph "Clients /api/clients"
            GetClient[GET /]
            GetClientID[GET /:id]
            PostClient[POST /]
            PutClient[PUT /:id]
            DelClient[DELETE /:id]
        end
        
        subgraph "Invoices /api/invoices"
            GetInvoice[GET /]
            GetInvoiceID[GET /:id]
            PostInvoice[POST /]
            PutInvoice[PUT /:id]
            DelInvoice[DELETE /:id]
        end
        
        subgraph "Dashboard /api/dashboard"
            GetDash[GET /]
        end
        
        subgraph "Utilities"
            GetCategories[GET /api/categories]
            GetAccounts[GET /api/accounts]
            GetAudit[GET /api/audit]
        end
    end
    
    subgraph "MongoDB Collections"
        UserDB[(Users)]
        TransDB[(Transactions)]
        BudgetDB[(Budgets)]
        ClientDB[(Clients)]
        InvoiceDB[(Invoices)]
        AuditDB[(Audit Logs)]
    end
    
    Login -->|POST| PostLogin
    Register -->|POST| PostRegister
    Dashboard -->|GET| GetMe
    Dashboard -->|GET| GetDash
    Dashboard -->|GET| GetCategories
    
    TransPage -->|GET| GetTrans
    TransPage -->|POST| PostTrans
    TransPage -->|PUT| PutTrans
    TransPage -->|DELETE| DelTrans
    TransPage -->|GET| ExportCSV
    TransPage -->|POST| ImportCSV
    
    BudgetPage -->|GET| GetBudget
    BudgetPage -->|POST| PostBudget
    BudgetPage -->|PUT| PutBudget
    BudgetPage -->|DELETE| DelBudget
    
    ClientPage -->|GET| GetClient
    ClientPage -->|GET| GetClientID
    ClientPage -->|POST| PostClient
    ClientPage -->|PUT| PutClient
    ClientPage -->|DELETE| DelClient
    
    InvoicePage -->|GET| GetInvoice
    InvoicePage -->|GET| GetInvoiceID
    InvoicePage -->|POST| PostInvoice
    InvoicePage -->|PUT| PutInvoice
    InvoicePage -->|DELETE| DelInvoice
    
    PostRegister --> UserDB
    PostLogin --> UserDB
    GetMe --> UserDB
    
    GetTrans --> TransDB
    PostTrans --> TransDB
    PutTrans --> TransDB
    DelTrans --> TransDB
    ExportCSV --> TransDB
    ImportCSV --> TransDB
    
    GetBudget --> BudgetDB
    PostBudget --> BudgetDB
    PutBudget --> BudgetDB
    DelBudget --> BudgetDB
    
    GetClient --> ClientDB
    GetClientID --> ClientDB
    PostClient --> ClientDB
    PutClient --> ClientDB
    DelClient --> ClientDB
    
    GetInvoice --> InvoiceDB
    GetInvoiceID --> InvoiceDB
    PostInvoice --> InvoiceDB
    PutInvoice --> InvoiceDB
    DelInvoice --> InvoiceDB
    
    GetDash --> TransDB
    GetDash --> BudgetDB
    
    GetAudit --> AuditDB
    
    style Login fill:#ffd700
    style Register fill:#ffd700
    style Dashboard fill:#87ceeb
    style TransPage fill:#87ceeb
    style BudgetPage fill:#87ceeb
    style ClientPage fill:#87ceeb
    style InvoicePage fill:#87ceeb
```

---

## 🔐 Authentication & Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant React as React Frontend
    participant AuthCtx as Auth Context
    participant API as Express API
    participant JWT as JWT Middleware
    participant RBAC as RBAC Middleware
    participant DB as MongoDB
    
    User->>React: Enter credentials
    React->>API: POST /api/auth/login
    API->>DB: Find user by email
    DB-->>API: User data
    API->>API: Verify password (bcrypt)
    API->>API: Generate JWT token
    API-->>React: Return token + role
    React->>AuthCtx: Store token in localStorage
    AuthCtx-->>React: Update auth state
    
    Note over User,DB: Subsequent API Requests
    
    User->>React: Access protected page
    React->>API: GET /api/transactions<br/>Header: Bearer {token}
    API->>JWT: Verify token
    JWT->>JWT: Decode payload
    JWT-->>API: User info (user_id, role)
    API->>RBAC: Check permissions
    RBAC->>RBAC: Validate role access
    RBAC->>DB: Log audit entry
    RBAC-->>API: Authorization granted
    API->>DB: Query transactions
    DB-->>API: Transaction data
    API-->>React: Return data
    React-->>User: Display transactions
```

---

## 📊 Data Flow - Transaction Creation

```mermaid
sequenceDiagram
    participant User
    participant TransPage as Transactions Page
    participant API as Express API
    participant Multer as Multer Middleware
    participant Auth as JWT + RBAC
    participant DB as MongoDB
    participant Storage as File Storage
    
    User->>TransPage: Fill transaction form
    User->>TransPage: Upload receipt (optional)
    TransPage->>API: POST /api/transactions<br/>multipart/form-data
    API->>Auth: Authenticate & Authorize
    Auth->>Auth: Verify JWT token
    Auth->>Auth: Check 'transactions.create' permission
    Auth-->>API: Authorized
    API->>Multer: Process file upload
    Multer->>Storage: Save receipt image
    Storage-->>Multer: File path
    Multer-->>API: File metadata
    API->>API: Validate data
    API->>API: Calculate amounts
    API->>DB: Create transaction document
    DB-->>API: Created transaction
    API-->>TransPage: Return transaction data
    TransPage-->>User: Show success message
    TransPage->>TransPage: Refresh transaction list
```

---

## 🎭 Role-Based Access Control (RBAC)

```mermaid
graph TD
    subgraph "User Roles"
        Admin[Admin<br/>Full Access]
        ClientMgmt[Client Management<br/>Enterprise Features]
        SelfEmp[Self-Employed<br/>Business + Personal]
        Salary[Salary Person<br/>Personal Finance]
        Accountant[Accountant<br/>Read-Only + Reports]
        Viewer[Viewer<br/>Read-Only]
    end
    
    subgraph "Resources & Permissions"
        Dashboard[Dashboard: view]
        Trans[Transactions: view, create, update, delete, export, import]
        Budget[Budgets: view, create, update, delete]
        Client[Clients: view, detail, create, update, delete]
        Invoice[Invoices: view, detail, create, update, delete]
        Audit[Audit Logs: view]
    end
    
    Admin -->|All| Dashboard
    Admin -->|All| Trans
    Admin -->|All| Budget
    Admin -->|All| Client
    Admin -->|All| Invoice
    Admin -->|All| Audit
    
    ClientMgmt -->|view| Dashboard
    ClientMgmt -->|view, create, update, export, import| Trans
    ClientMgmt -->|view, create, update| Budget
    ClientMgmt -->|All except delete| Client
    ClientMgmt -->|All except delete| Invoice
    
    SelfEmp -->|view| Dashboard
    SelfEmp -->|view, create, update, export, import| Trans
    SelfEmp -->|view, create, update| Budget
    SelfEmp -->|All except delete| Client
    SelfEmp -->|All except delete| Invoice
    
    Salary -->|view| Dashboard
    Salary -->|view, create, update, export, import| Trans
    Salary -->|view, create, update| Budget
    
    Accountant -->|view| Dashboard
    Accountant -->|view, export| Trans
    Accountant -->|view| Budget
    Accountant -->|view, detail| Client
    Accountant -->|view, detail| Invoice
    
    Viewer -->|view| Dashboard
    Viewer -->|view| Trans
    Viewer -->|view| Budget
    
    style Admin fill:#ff6b6b
    style ClientMgmt fill:#4ecdc4
    style SelfEmp fill:#ffe66d
    style Salary fill:#95e1d3
    style Accountant fill:#a8e6cf
    style Viewer fill:#dfe6e9
```

---

## 🗄️ Database Schema Relationships

```mermaid
erDiagram
    USER ||--o{ TRANSACTION : creates
    USER ||--o{ BUDGET : creates
    USER ||--o{ CLIENT : manages
    USER ||--o{ INVOICE : creates
    USER ||--o{ AUDIT_LOG : generates
    CLIENT ||--o{ INVOICE : receives
    
    USER {
        ObjectId _id PK
        string email UK
        string password_hash
        string role
        date created_at
    }
    
    TRANSACTION {
        ObjectId _id PK
        ObjectId user_id FK
        date date
        number amount
        string currency
        string type
        string category_id
        string account
        array tags
        string vendor
        string client
        string project_id
        string invoice_id
        string receipt_url
        boolean reconciled
        string notes
        mixed splits
    }
    
    BUDGET {
        ObjectId _id PK
        ObjectId user_id FK
        string category_id
        number target
        date start_date
        date end_date
        string notes
        date created_at
    }
    
    CLIENT {
        ObjectId _id PK
        ObjectId user_id FK
        string name
        string email
        string phone
        string address
        string gstin
        date created_at
    }
    
    INVOICE {
        ObjectId _id PK
        ObjectId user_id FK
        ObjectId client_id FK
        string invoice_number UK
        string status
        date issue_date
        date due_date
        number subtotal
        number tax_rate
        number tax_amount
        number total
        string currency
        string notes
        array items
        date created_at
    }
    
    AUDIT_LOG {
        ObjectId _id PK
        ObjectId user_id FK
        string role
        string ip
        string path
        string resource
        string action
        string status
        string reason
        date timestamp
    }
```

---

## 🎨 Frontend Component Hierarchy

```mermaid
graph TD
    App[App.jsx<br/>Router Setup]
    
    subgraph "Authentication"
        AuthLayout[Auth Layout]
        Login[Login Page]
        Register[Register Page]
    end
    
    subgraph "Salary Persona"
        SalaryLayout[Salary Layout<br/>Dark Theme]
        SalaryDash[Dashboard]
        SalaryTrans[Transactions]
        SalaryBudget[Budgets]
    end
    
    subgraph "Enterprise Persona"
        EntLayout[Enterprise Layout<br/>Professional Theme]
        EntDash[Dashboard]
        EntClients[Clients]
        EntInvoices[Invoices]
        EntReports[Reports]
    end
    
    subgraph "Self-Employed Persona"
        SelfLayout[Self-Employed Layout<br/>Warm Theme]
        SelfDash[Dashboard]
        SelfBusiness[Business]
        SelfFinances[Finances]
    end
    
    subgraph "Shared Components"
        Button[Button]
        Input[Input]
        Modal[Modal]
        NavLink[NavLink]
        Skeleton[Skeleton]
        Tabs[Tabs]
    end
    
    subgraph "Context"
        AuthContext[Auth Context<br/>JWT Token Management]
    end
    
    App --> AuthContext
    App --> AuthLayout
    App --> SalaryLayout
    App --> EntLayout
    App --> SelfLayout
    
    AuthLayout --> Login
    AuthLayout --> Register
    
    SalaryLayout --> SalaryDash
    SalaryLayout --> SalaryTrans
    SalaryLayout --> SalaryBudget
    
    EntLayout --> EntDash
    EntLayout --> EntClients
    EntLayout --> EntInvoices
    EntLayout --> EntReports
    
    SelfLayout --> SelfDash
    SelfLayout --> SelfBusiness
    SelfLayout --> SelfFinances
    
    Login --> Button
    Login --> Input
    Register --> Button
    Register --> Input
    
    SalaryDash --> Button
    SalaryDash --> Modal
    SalaryTrans --> Modal
    SalaryTrans --> Tabs
    
    EntClients --> Modal
    EntClients --> Button
    EntInvoices --> Modal
    
    SelfBusiness --> Modal
    SelfFinances --> Button
    
    AuthContext -.->|Provides Auth State| App
    
    style App fill:#61dafb
    style AuthContext fill:#ffd700
```

---

## 🔄 Complete Request-Response Cycle

```mermaid
sequenceDiagram
    participant Browser
    participant React as React App<br/>(Port 5173)
    participant Axios as Axios HTTP Client
    participant Express as Express Server<br/>(Port 3001)
    participant Auth as Authentication
    participant RBAC as Authorization
    participant Mongoose as Mongoose ODM
    participant MongoDB as MongoDB Database
    
    Browser->>React: User clicks "View Transactions"
    React->>React: Check auth state
    React->>Axios: GET /api/transactions<br/>Headers: { Authorization: Bearer {token} }
    Axios->>Express: HTTP Request
    
    Express->>Auth: authenticate() middleware
    Auth->>Auth: Extract JWT from header
    Auth->>Auth: Verify token signature
    Auth->>Auth: Decode payload
    Auth-->>Express: req.user = { user_id, role, email }
    
    Express->>RBAC: authorize('transactions', 'view')
    RBAC->>RBAC: Check permissions[transactions][view]
    RBAC->>RBAC: Verify role in allowed list
    RBAC->>Mongoose: Create audit log
    Mongoose->>MongoDB: Insert audit document
    MongoDB-->>Mongoose: Success
    RBAC-->>Express: next()
    
    Express->>Express: Build query filter
    Express->>Mongoose: Transaction.find(match)
    Mongoose->>MongoDB: Query transactions collection
    MongoDB-->>Mongoose: Transaction documents
    Mongoose-->>Express: Transaction array
    
    Express->>Express: Apply filters (date, category, etc)
    Express->>Express: Format response
    Express-->>Axios: JSON response
    Axios-->>React: Transaction data
    React->>React: Update component state
    React-->>Browser: Render transaction list
```

---

## 📦 Technology Stack Details

```mermaid
graph TB
    subgraph "Frontend Stack"
        React19[React 19.0.0<br/>UI Library]
        ReactDOM[React DOM 19.0.0<br/>DOM Rendering]
        ReactRouter[React Router 7.1.1<br/>Client-side Routing]
        Vite[Vite 6.0.3<br/>Build Tool & Dev Server]
        FramerMotion[Framer Motion 11.15.0<br/>Animations]
        Recharts[Recharts 2.15.0<br/>Charts & Graphs]
        Lucide[Lucide React 0.469.0<br/>Icons]
        Axios[Axios 1.7.9<br/>HTTP Client]
        CSS[Vanilla CSS<br/>Styling]
    end
    
    subgraph "Backend Stack"
        Node[Node.js<br/>Runtime]
        Express4[Express 4.x<br/>Web Framework]
        Mongoose[Mongoose 8.x<br/>MongoDB ODM]
        JWT[jsonwebtoken<br/>Authentication]
        Bcrypt[bcryptjs<br/>Password Hashing]
        Multer2[Multer<br/>File Upload]
        PDFKit[PDFKit<br/>PDF Generation]
        Morgan[Morgan<br/>HTTP Logger]
        CORS[CORS<br/>Cross-Origin]
        DotEnv[dotenv<br/>Environment Config]
    end
    
    subgraph "Database"
        MongoDB2[(MongoDB<br/>NoSQL Database)]
        Mongoose2[Mongoose Schemas]
    end
    
    subgraph "Development Tools"
        ESLint[ESLint<br/>Code Linting]
        PostCSS[PostCSS<br/>CSS Processing]
        Git[Git<br/>Version Control]
    end
    
    React19 --> ReactDOM
    ReactDOM --> Vite
    React19 --> ReactRouter
    React19 --> FramerMotion
    React19 --> Recharts
    React19 --> Lucide
    ReactRouter --> Axios
    
    Axios -->|HTTP/HTTPS| Express4
    
    Node --> Express4
    Express4 --> Mongoose
    Express4 --> JWT
    Express4 --> Bcrypt
    Express4 --> Multer2
    Express4 --> PDFKit
    Express4 --> Morgan
    Express4 --> CORS
    Express4 --> DotEnv
    
    Mongoose --> MongoDB2
    Mongoose2 --> MongoDB2
    
    style React19 fill:#61dafb
    style Express4 fill:#90c53f
    style MongoDB2 fill:#4db33d
    style Vite fill:#646cff
```

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Client Deployment"
        ViteBuild[Vite Build Process]
        StaticFiles[Static Files<br/>HTML, CSS, JS]
        CDN[CDN / Static Hosting<br/>Vercel, Netlify, etc.]
    end
    
    subgraph "Server Deployment"
        NodeServer[Node.js Server<br/>Express App]
        PM2[PM2 Process Manager]
        CloudServer[Cloud Server<br/>AWS, DigitalOcean, etc.]
    end
    
    subgraph "Database Deployment"
        MongoAtlas[MongoDB Atlas<br/>Cloud Database]
        MongoLocal[Local MongoDB<br/>Development]
    end
    
    subgraph "File Storage"
        LocalStorage[Local File System<br/>/uploads, /public]
        CloudStorage[Cloud Storage<br/>S3, Cloudinary, etc.]
    end
    
    ViteBuild --> StaticFiles
    StaticFiles --> CDN
    
    NodeServer --> PM2
    PM2 --> CloudServer
    
    NodeServer -->|Production| MongoAtlas
    NodeServer -->|Development| MongoLocal
    
    NodeServer -->|Development| LocalStorage
    NodeServer -->|Production| CloudStorage
    
    CDN -->|API Calls| CloudServer
    
    style CDN fill:#ff6b6b
    style CloudServer fill:#4ecdc4
    style MongoAtlas fill:#4db33d
```

---

## 📝 Summary

### **Frontend (React)**
- **Port**: 5173 (development)
- **Framework**: React 19 + Vite
- **Routing**: React Router
- **State Management**: Context API (Auth)
- **Styling**: Vanilla CSS with custom properties
- **HTTP Client**: Axios

### **Backend (Node.js + Express)**
- **Port**: 3001
- **Framework**: Express 4.x
- **Authentication**: JWT (jsonwebtoken)
- **Authorization**: Custom RBAC middleware
- **File Upload**: Multer
- **Password Security**: bcryptjs

### **Database (MongoDB)**
- **Type**: NoSQL Document Database
- **ODM**: Mongoose
- **Collections**: Users, Transactions, Budgets, Clients, Invoices, Audit Logs

### **API Endpoints**
- **Authentication**: `/api/auth/*`
- **Transactions**: `/api/transactions/*`
- **Budgets**: `/api/budgets/*`
- **Clients**: `/api/clients/*`
- **Invoices**: `/api/invoices/*`
- **Dashboard**: `/api/dashboard`
- **Utilities**: `/api/categories`, `/api/accounts`, `/api/audit`

### **Security Features**
- JWT-based authentication
- Role-based access control (6 roles)
- Password hashing with bcrypt
- Audit logging for all actions
- CORS protection
- Input validation

---

**Last Updated**: November 2025
