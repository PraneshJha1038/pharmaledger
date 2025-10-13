# 💊 PharmaLedger — Medicine Authenticity Verification Platform

**PharmaLedger** is an open, verifiable medicine-tracking system designed to detect counterfeit drugs and build transparency in the pharmaceutical supply chain.

### 🚀 Problem
Counterfeit medicines are a global health threat — especially in developing countries. Patients often have no way to verify whether a medicine is genuine or fake. PharmaLedger provides a trust layer between manufacturers, distributors, pharmacies, and end users.

---

## 🧠 Core Features (MVP)
- **Role-based login system**: Manufacturer, Distributor, Pharmacy, Admin, and User.
- **Batch registration** by manufacturers with unique QR code generation.
- **Chain verification**: Track a medicine’s journey through verified distributors and pharmacies.
- **QR-based public verification** for customers.
- **Suspicious batch reporting** and analytics dashboard for admins.
- **Crowdsourced feedback**: Users can report counterfeit suspicions.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js / Next.js (or Streamlit for MVP) |
| Backend | Python (FastAPI or Flask) |
| Database | SQLite (upgradeable to PostgreSQL) |
| Authentication | Firebase Auth or JWT |
| QR Code Generation | Python `qrcode` library |
| Hosting | Vercel (Frontend) / Render (Backend) |

---

## 🧩 Folder Structure
