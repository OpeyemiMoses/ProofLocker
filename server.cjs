const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const fetch = global.fetch || require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * =========================
 * BODY PARSER (IMPORTANT)
 * =========================
 */
app.use(express.json({ limit: "10mb" }));

/**
 * =========================
 * CORS CONFIG (CLEAN)
 * =========================
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://proof-locker-main.vercel.app",
  "https://proof-locker.vercel.app",
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
    allowedHeaders: ["Content-Type", "x-api-key"],
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
    time: new Date().toISOString(),
  });
});

/**
 * =========================
 * SUI RPC PROXY (TATUM)
 * =========================
 */
app.post("/api/sui-rpc", async (req, res) => {
  try {
    const apiKey = process.env.TATUM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing TATUM_API_KEY",
      });
    }

    const { method, params = [] } = req.body || {};

    if (!method) {
      return res.status(400).json({
        error: "Missing RPC method",
      });
    }

    const response = await fetch(
     "https://sui-mainnet.gateway.tatum.io/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method,
          params,
        }),
      }
    );

    // SAFE PARSING (prevents crashes)
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid JSON response from Tatum",
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
    const apiKey = process.env.TATUM_API_KEY;
    const { digest } = req.body;

    if (!digest) {
      return res.status(400).json({
        error: "Missing digest",
      });
    }

    const response = await fetch(
      "https://sui-mainnet.gateway.tatum.io/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sui_getTransactionBlock",
          params: [digest],
        }),
      }
    );

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Invalid Tatum response",
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
});