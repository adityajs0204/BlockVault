# 🔒 BlockVault — Blockchain-Based Digital Locker

## 🚀 Overview
**BlockVault** is a decentralized document storage and verification platform built using **blockchain technology**.  
It allows institutions to issue tamper-proof certificates and users to verify document authenticity via **QR codes**, ensuring transparency, trust, and immutability.

---

## ✨ Features
- 🔐 Secure document issuance on blockchain (Ganache + Smart Contract)
- ✅ Instant tamper detection using SHA-256 file hashing
- 📦 MongoDB integration for metadata & user management
- 📲 QR code-based verification link
- 🧑‍🏫 Role-based access: *Issuer*, *Verifier*, *User*

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, Tailwind CSS, Axios, React Router DOM |
| **Backend** | Node.js, Express.js, Ethers.js, Multer, Crypto, Nodemailer |
| **Blockchain** | Solidity Smart Contract on Ganache (Ethereum) |
| **Database** | MongoDB Atlas |
| **Email Service** | Nodemailer (Gmail API) |

---

## ⚙️ Project Setup

### 🧩 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/BlockVault.git
cd BlockVault
```

# Folder Structure
BlockVault/
│
├── backend/
│   ├── contract/             # Solidity smart contract files
│   ├── models/               # MongoDB models (User, Document)
│   ├── routes/               # Express route handlers
│   ├── utils/                # DB connection, middleware
│   ├── server.js             # Main backend entry
│   ├── .env                  # Environment variables
│
├── frontend/
│   ├── src/                  # React source files
│   ├── components/           # UI Components
│   ├── pages/                # Login, Dashboard, Verify pages
│   ├── App.jsx               # React root component
│   ├── index.css             # Tailwind styles
│
└── README.md

# Backend Support
1. Install Dependencies
   cd backend
   npm install
2. Required NPM Packages:
   npm install express cors dotenv mongoose ethers solc fs-extra multer crypto nodemailer uuid
3. Create .env file
    MONGO_URI=<your_mongodb_atlas_uri>
    JWT_SECRET=supersecretjwt
    RPC_URL=http://127.0.0.1:7545
    PRIVATE_KEY=<your_ganache_account_private_key>
    PORT=4000
    FRONTEND_ORIGIN=http://localhost:5173
4. -Deploy Smart Contract
   -node contract/deploy.js
   -node server.js

 # Frontend Supprt
 1. Install Dependencies
    cd ../frontend
    npm install
 2. Required NPM Packages:
    npm install react-router-dom axios qrcode.react tailwindcss @tailwindcss/vite lucide-react react-hot-toast clsx tailwind-merge
 3. Start Frontend
    npm run dev

# Running the full App
1.	Start Ganache (your local blockchain)
2.	Deploy contract → node contract/deploy.js
3.	Run backend → node server.js
4.	Run frontend → npm run dev
5.	Visit: http://localhost:5173


  | Role | Description |
|-------|-------------|
| **Issuer** | Uploads & issues blockchain-verified documents |
| **Backend** | Uploads and checks authenticity of documents |
| **Blockchain** | Views and downloads their verified documents |


# Overflow of the Proejct
	1.	Issuer uploads a document → Backend hashes it → Smart contract stores hash on blockchain
	2.	System emails the user with a QR link
	3.	Verifier scans QR or uploads doc → hash is recomputed and matched
	4.	If hashes match → ✅ Authentic | else ❌ Tampered
