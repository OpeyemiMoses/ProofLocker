const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const fetch = global.fetch || require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * =========================
 * MAINNET ONLY CONFIG
 * =========================
 */
const TATUM_URL = "https://sui-mainnet.gateway.tatum.io/";

const API_KEY = process.env.TATUM_MAINNET_API_KEY;

/**
 * =========================
 * BODY PARSER
 * =========================
 */
app.use(express.json({ limit: "10mb" }));

/**
 * =========================
 * CORS CONFIG
 * =========================
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://proof-locker-main.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Sui RPC Proxy",
    network: "mainnet",
    time: new Date().toISOString(),
  });
});

/**
 * =========================
 * SUI RPC PROXY (MAINNET)
 * =========================
 */
app.post("/api/sui-rpc", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "Missing TATUM MAINNET API KEY",
      });
    }

    const { method, params = [] } = req.body || {};

    if (!method) {
      return res.status(400).json({
        error: "Missing RPC method",
      });
    }

    const response = await fetch(TATUM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method,
        params,
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON from Tatum",
        raw: text,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.json(data);
  } catch (err) {
    console.error("RPC Error:", err);

    return res.status(500).json({
      error: "RPC failed",
      message: err.message,
    });
  }
});

/**
 * =========================
 * VERIFY TRANSACTION
 * =========================
 */
app.post("/api/verify-tx", async (req, res) => {
  try {
    const { digest } = req.body;

    if (!digest) {
      return res.status(400).json({
        error: "Missing digest",
      });
    }

    const response = await fetch(TATUM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "sui_getTransactionBlock",
        params: [
          digest,
          {
            showInput: true,
            showEffects: true,
            showEvents: true,
            showObjectChanges: true,
          },
        ],
      }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid response",
        raw: text,
      });
    }

    return res.json({
      verified: true,
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Verification failed",
      message: err.message,
    });
  }
});

/**
 * =========================
 * START SERVER
 * =========================
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`NETWORK: MAINNET`);
});