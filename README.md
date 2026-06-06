# ProofLocker 🔒

> Decentralized dispute evidence vault — built on Walrus, Sui & Tatum

**ProofLocker** lets anyone create a dispute case, upload evidence files, and lock everything on-chain permanently. Every file is hashed with SHA256, stored on Walrus, and anchored on Sui via a Move smart contract. Anyone can verify a file's integrity at any time — forever.

Built for the **Tatum × Walrus Hackathon 2026**.

---

## Live Demo

🌐 [proof-locker-main.vercel.app](https://proof-locker-main.vercel.app)

---

## The Problem

Online work disputes are messy. People lose files, edit screenshots, delete chats, and argue about timelines. There's no trustless way to prove what was delivered, agreed upon, or said.

## The Solution

ProofLocker creates an immutable, cryptographically verifiable record of dispute evidence. Every file gets a SHA256 hash, a Walrus blob ID, and a Sui transaction receipt. Tampered files fail verification. Original files always pass.

---

## How It Works

1. **Connect Wallet** — connect your Sui wallet (Sui Wallet or Slush)
2. **Create a Case** — open a dispute record anchored on Sui via Move smart contract
3. **Upload Evidence** — upload contracts, screenshots, invoices, videos — stored permanently on Walrus
4. **Share** — copy a shareable link that loads the case directly from Walrus
5. **Verify** — anyone can upload a file to check if it matches the original

---

## Tech Stack

| Layer | Technology |
|---|---|
| Decentralized Storage | [Walrus](https://walrus.space) |
| Blockchain | [Sui](https://sui.io) |
| Smart Contract | Sui Move |
| RPC Infrastructure | [Tatum](https://tatum.io) |
| File Integrity | SHA256 (client-side) |
| Frontend | React |
| Backend | Node.js / Express |

---

## Walrus Integration

Every evidence file is uploaded to Walrus as an immutable blob. Each file gets a unique **Blob ID** that can be verified on [Walruscan](https://walruscan.com). When evidence is uploaded, a **case manifest JSON** is also stored on Walrus — this enables the shareable link feature, allowing anyone to load a case directly from Walrus without needing a database.

## Sui Integration

A **Move smart contract** deployed on Sui mainnet handles:
- `create_case` — creates an on-chain case object with owner, title, category, and timestamp
- `add_evidence` — anchors evidence metadata (file hash, Walrus blob ID, timestamp) on-chain
- `resolve_case` — updates case status to resolved

Every case and evidence file has a **Sui transaction digest** that can be verified on [Suiscan](https://suiscan.xyz).

**Contract Package ID:**
```
0xd94de82bc25cd0cd9f9bb2d4912c1f6aa979b97f407751cc2856d534c4e45efe
```

## Tatum Integration

Tatum's Sui RPC nodes power all blockchain reads and writes:
- Live network checkpoint data
- Wallet transaction history
- On-chain case verification
- Evidence metadata anchoring

All Tatum calls are proxied through a secure backend — the API key never hits the frontend.

---

## Features

- 🔒 **Tamper-proof evidence storage** on Walrus
- ⛓️ **On-chain proof** anchored via Sui Move contract
- 🔍 **File integrity verification** — upload any file to check if it matches
- 🔗 **Shareable case links** — load cases directly from Walrus, no login needed
- 📥 **File download** — retrieve original files from Walrus anytime
- 📊 **Live Sui network stats** via Tatum RPC
- 👛 **Wallet-isolated cases** — each wallet sees only its own cases
- 📱 **Mobile responsive** — works on all screen sizes

---

## Use Cases

- **Freelancers** — prove delivery before a client disputes payment
- **DAOs** — record contributor work and decisions with immutable proof
- **Agencies** — maintain verifiable project records for every engagement
- **Bug Bounty Hunters** — timestamp exploit discoveries before disclosure
- **Remote Teams** — lock shared agreements and scope documents
- **Legal & Compliance** — create tamper-proof evidence trails for audits

---

## Running Locally

### Prerequisites
- Node.js 18+
- A Sui wallet (Sui Wallet or Slush extension)
- Tatum API key ([dashboard.tatum.io](https://dashboard.tatum.io))

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/prooflocker.git
cd prooflocker

# Install dependencies
npm install --legacy-peer-deps

# Create .env file
cp .env.example .env
# Add your TATUM_API_KEY to .env

# Start the backend server
node server.cjs

# In a new terminal, start the frontend
npm start
```

### Environment Variables

```env
TATUM_API_KEY=your_tatum_api_key_here
PORT=3001
```

---

## Smart Contract

The Move contract is in `/prooflocker_contract/sources/cases.move`.

To deploy:

```bash
cd prooflocker_contract
sui client publish --gas-budget 100000000
```

---

## Project Structure

```
prooflocker/
├── public/
│   ├── index.html
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── CreateCase.jsx
│   │   ├── UploadEvidence.jsx
│   │   ├── CaseTimeline.jsx
│   │   ├── VerifyFile.jsx
│   │   └── TatumStats.jsx
│   ├── utils/
│   │   ├── walrus.js
│   │   ├── tatum.js
│   │   ├── hash.js
│   │   └── contract.js
│   ├── App.jsx
│   └── index.js
├── server.cjs
└── prooflocker_contract/
    └── sources/
        └── cases.move
```

---

## Hackathon

Built for the **Tatum × Walrus Hackathon 2026**

- Targets **Best Walrus Integration** bonus prize
- Targets **Best Use of Tatum Tools** bonus prize

---

## License

MIT
