# FakeShield 🛡️
> **Analyze Before You Trust.**

[![Problem ID: CS6](https://img.shields.io/badge/Hackathon%20Problem-CS6-blue.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Zero Cloud Subscriptions](https://img.shields.io/badge/Cloud%20Dependencies-Zero%20(100%25%20Local)-cyan.svg)](README.md)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-emerald.svg)](README.md)
[![Auth: Supabase](https://img.shields.io/badge/Auth-Supabase%20Auth-blue.svg)](README.md)

**FakeShield** is an indicative fake website and suspicious URL risk assessment platform developed for **Problem ID: CS6: Fake Website Detection Platform**. It analyzes observable website URL characteristics—including encryption protocol, direct IP hostnames, domain hierarchy, internationalized homographs (Punycode), non-standard ports, percent-encoding, and deceptive authentication keywords—to provide a transparent, deterministic 0–100 indicative risk score and granular security findings.

---

> [!IMPORTANT]
> ### Cybersecurity Disclaimer
> **"FakeShield provides an indicative risk assessment based on observable website characteristics. A low score does not guarantee that a website is safe, and a high score does not by itself prove that a website is malicious."**
> 
> FakeShield is built as a defensive decision-support tool. It never claims that a website is "definitely fake" or "100% safe."

---

## 🎯 Key Features

1. **Deterministic URL Risk Scoring Engine (`0–100`)**:
   - Transparent, explainable heuristic pipeline without opaque black-box AI hallucinations.
   - Evaluates HTTPS encryption, IPv4/IPv6 address hostnames, Punycode IDN homographs, excessive subdomains, non-standard network ports, `@` symbol userinfo tricks, excessive percent-encoding, and sensitive lure keywords.
   - Categorized into clear risk levels: **LOW RISK (0–29)**, **MEDIUM RISK (30–59)**, and **HIGH RISK (60–100)**.

2. **Granular Security Findings**:
   - Each evaluated signal includes a category, title, severity level (`SAFE`, `INFO`, `WARNING`, `HIGH`), detailed explanation, and risk points penalty.

3. **Contextual Safety Recommendations**:
   - Real-time actionable guidance tailored to the calculated risk tier (e.g., verifying domain registration, avoiding credential input, defense-in-depth).

4. **Dual User Role Architecture**:
   - **Guest**: Instant anonymous scanning directly from the landing page or scanner console without account registration. Results are generated in real time without storing user data.
   - **Registered User**: Automated scan persistence to Supabase PostgreSQL, personal dashboard analytics, searchable scan history, full report inspection, and secure scan record deletion.

5. **Cloud Security & Scalability**:
   - Connected directly to Supabase Auth and Supabase PostgreSQL with strict Row Level Security (RLS) policies.
   - All scan records, profiles, and threat signals are isolated and encrypted in transit.

6. **Safety by Design**:
   - Never visits, crawls, or executes arbitrary user-submitted URLs, fully mitigating Server-Side Request Forgery (SSRF) and malicious script execution.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, React Router Dom, Lucide React |
| **Backend & Cloud** | Supabase JavaScript Client (`@supabase/supabase-js`), Supabase Auth, Supabase PostgreSQL |
| **Data Protection** | PostgreSQL Row Level Security (RLS), Cascade Foreign Key constraints, SSL In-Transit |
| **Testing** | Node.js native test runner, build validation, unit & integration tests |

---

## 📂 Project Architecture & Directory Structure

```
FakeShield/
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx      # Responsive header with branding & auth
│   │   │   ├── Footer.tsx      # Cybersecurity disclaimer & footer links
│   │   │   ├── UrlInput.tsx    # URL input with validator & demo presets
│   │   │   ├── RiskScore.tsx   # Animated SVG radial gauge (0-100)
│   │   │   ├── RiskBadge.tsx   # LOW / MEDIUM / HIGH risk badges
│   │   │   ├── FindingCard.tsx # Individual heuristic finding cards
│   │   │   ├── ScanCard.tsx    # History & dashboard scan cards
│   │   │   ├── StatCard.tsx    # Dashboard analytics counter cards
│   │   │   ├── LoadingScanner.tsx # Real-time heuristic scanning animation
│   │   │   ├── ProtectedRoute.tsx # Route guard for authenticated pages
│   │   │   ├── EmptyState.tsx  # Empty state illustration & actions
│   │   │   └── ErrorMessage.tsx# Dismissible error alert banner
│   │   ├── pages/              # Application views
│   │   │   ├── Home.tsx        # Hero, quick scan, how it works, features
│   │   │   ├── Scanner.tsx     # Dedicated scanner console
│   │   │   ├── ScanResult.tsx  # Full saved assessment report (/scan/:id)
│   │   │   ├── Dashboard.tsx   # User analytics overview & recent scans
│   │   │   ├── History.tsx     # Full searchable & filterable scan history
│   │   │   ├── Login.tsx       # Local email/password login
│   │   │   ├── Register.tsx    # User registration with validation
│   │   │   └── About.tsx       # Methodology, heuristics, & disclaimer
│   │   ├── services/           # api.ts, auth.ts, scanner.ts
│   │   ├── hooks/              # useAuth.tsx (AuthContext & state)
│   │   ├── types/              # scanner.ts, user.ts
│   │   ├── utils/              # validation.ts
│   │   ├── App.tsx             # Routes & layout shell
│   │   ├── main.tsx            # React DOM root entry
│   │   └── index.css           # Modern dark cyber theme & design tokens
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts          # Vite configuration with API proxy
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── controllers/        # authController, scanController, dashboardController
│   │   ├── routes/             # authRoutes, scanRoutes, dashboardRoutes
│   │   ├── services/           # urlAnalyzer.ts, authService.ts
│   │   ├── middleware/         # authMiddleware.ts, errorMiddleware.ts
│   │   ├── database/           # db.ts (Supabase PostgreSQL client & RLS helper)
│   │   ├── utils/              # validation.ts
│   │   ├── types/              # scanner.ts, user.ts
│   │   └── server.ts           # Express server setup, security headers & Vercel serverless support
│   ├── tests/                  # urlAnalyzer.test.ts, api.test.ts, runTests.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL schema with RLS security policies
├── package.json                # Root orchestration with concurrently
└── README.md                   # Full documentation
```

---

## 🗄️ Database Architecture (`supabase/schema.sql`)

FakeShield utilizes **Supabase PostgreSQL** with strict **Row Level Security (RLS)** in production:

```sql
-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scans Table
CREATE TABLE IF NOT EXISTS public.scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    domain TEXT,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scan Findings Table
CREATE TABLE IF NOT EXISTS public.scan_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_id UUID NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('SAFE', 'INFO', 'WARNING', 'HIGH')),
    description TEXT NOT NULL,
    risk_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS): Authenticated users can only view, insert, update, and delete their own records
```

---

## 🔬 Risk Scoring Heuristics

The engine computes an additive score clamped between `0` and `100`:

| Heuristic Factor | Condition | Severity | Penalty |
| :--- | :--- | :--- | :--- |
| **HTTPS Encryption** | Protocol is `https:` | SAFE | `0 pts` |
| **Plaintext HTTP** | Protocol is `http:` | HIGH | `+20 pts` |
| **Direct IP Hostname** | Hostname is an IPv4 or IPv6 address | HIGH | `+25 pts` |
| **Userinfo / `@` Symbol** | Authority includes credentials or `@` | HIGH | `+20 pts` |
| **Punycode (IDN)** | Hostname contains `xn--` | WARNING | `+15 pts` |
| **Long Hostname** | Hostname exceeds 30 characters | INFO | `+5 pts` |
| **Excessive Subdomains** | Domain contains > 3 subdomain levels | WARNING | `+10 pts` |
| **Hyphen Stuffing** | Hostname contains ≥ 3 hyphens | WARNING | `+10 pts` |
| **URL Length** | Total length > 75 chars / > 120 chars | INFO / WARNING | `+10 / +15 pts` |
| **Non-Standard Port** | Port specified other than 80 or 443 | WARNING | `+10 pts` |
| **Excessive Percent-Encoding** | Multiple `%` hex-encoded tokens | WARNING | `+10 pts` |
| **Sensitive Keywords** | Contains `login`, `verify`, `account`, `wallet`, `claim`, etc. | INFO / WARNING | `+5 to +15 pts` |
| **Suspicious File Downloads** | Path references `.exe`, `.apk`, `.scr`, `.bat` | HIGH | `+15 pts` |
| **Open Redirect Query** | Query keys include `redirect`, `goto`, `url` | INFO | `+8 pts` |

### Risk Level Ranges
- **0 – 29: LOW RISK** (Conventional domain and encryption; standard browsing precautions)
- **30 – 59: MEDIUM RISK** (Elevated flags or sensitive lure keywords; verify domain spelling)
- **60 – 100: HIGH RISK** (Multiple high-severity flags; strong caution recommended)

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18.x, v20.x, or v22+ recommended)
- **npm** (comes with Node.js)

### 1. Clone & Install Dependencies
From the project root:
```bash
# Install root orchestration dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 2. Environment Configuration
The backend comes with an `.env.example` pre-configured for local execution:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=fakeshield_super_secret_jwt_key_hackathon_2025_cs6
DATABASE_PATH=../database/fakeshield.db
FRONTEND_URL=http://localhost:5173
```
Copy to `.env`:
```bash
cp backend/.env.example backend/.env
```

### 3. Run Both Frontend & Backend Concurrently
From the root directory:
```bash
npm run dev
```
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Running Individually
- Run backend only: `npm run server`
- Run frontend only: `npm run client`
- Run automated tests: `npm run test`
- Build for production: `npm run build`

---

## 🧪 Automated Testing

FakeShield includes a complete unit and integration test suite:
```bash
npm test --prefix backend
```

**Test Coverage Includes:**
- URL syntax validation and normalizer
- Disallowed scheme rejection (`javascript:`, `data:`, `file:`)
- Protocol detection (HTTP vs HTTPS)
- IP hostname identification
- Punycode and homograph pattern matching
- Subdomain and keyword heuristic scoring
- Score clamping (0–100)
- Public anonymous scan behavior
- User registration and duplicate email rejection
- Password hashing and login verification
- JWT issuance and session authentication
- Authenticated scan storage and Supabase cascade deletion
- Dashboard aggregation metrics

---

## 🔌 Data & Cloud Architecture

### Authentication
- Supabase Auth email/password signup and login
- Persistent session storage and real-time auth state synchronization
- Automatic user profile provisioning in `public.profiles`

### Scanner
- Client-side deterministic heuristic URL analysis
- Authenticated scan storage in `public.scans` and `public.scan_findings`
- Strict Row Level Security ensuring user data isolation

### Dashboard
- Real-time aggregate telemetry (`totalScans`, `lowRisk`, `mediumRisk`, `highRisk`, and recent scans) powered by Supabase

---

## 🎬 Hackathon Demo Walkthrough (Step-by-Step)

1. **Anonymous Assessment (Landing Page)**:
   - Open [http://localhost:5173/](http://localhost:5173/)
   - In the hero search bar, click the preset **✓ Safe HTTPS** (`https://example.com`) and click **Analyze Website**.
   - Notice the animated heuristic inspector and the **LOW RISK** (0 / 100) assessment with green indicators.
2. **Suspicious Pattern Demo**:
   - In the search bar, click **⚠ HTTP + IP Hostname** (`http://192.168.1.10/login`) and click **Analyze Website**.
   - Notice the elevated score (**HIGH RISK**), flagging unencrypted HTTP (+20), raw IP address (+25), and login lure (+5).
3. **Register Account**:
   - Click **Register** in the top navigation.
   - Enter your name, email, and password. Click **Create Account & Continue**.
   - You are automatically redirected to your personal **Dashboard**.
4. **Dashboard & History**:
   - The dashboard displays 4 live metric counters (Total Scans, Low Risk, Medium Risk, High Risk).
   - Click **Scanner**, enter a web URL to analyze. Authenticated scans are safely logged to Supabase.
   - Navigate to **History** to view all saved scans. Click **View Report** to inspect individual findings.
   - Click the **Trash** icon to delete a scan, verifying that the record and its findings are permanently purged from Supabase.
5. **Logout**:
   - Click **Logout** in the navigation bar to securely terminate the session.

---

## 🔮 Future Roadmap (Beyond MVP)

The modular service architecture is designed for future plug-and-play expansions:
- WHOIS domain age calculation
- DNS MX and SPF record validation
- SSL/TLS certificate chain inspection
- Google Safe Browsing / VirusTotal community reputation APIs
- AI-assisted contextual phishing explanations
- Automated homograph lookalike similarity distance (Levenshtein) against Fortune 500 domains

---

## 📜 License
Developed for Hackathon Problem ID: CS6. Distributed under the MIT License.
