const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const fetch = global.fetch || require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * CORS CONFIG (FIXED)
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://proof-locker-main.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked: " + origin));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

app.use(express.json({ limit: "10mb" }));

app.options("*", cors());

/**
 * HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Sui RPC Proxy",
    time: new Date().toISOString(),
  });
});

/**
 * SUI RPC PROXY
 */
app.post("/api/sui-rpc", async (req, res) => {
  try {
    const apiKey = process.env.TATUM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing TATUM_API_KEY",
      });
    }

    const { method, params = [] } = req.body;

    const response = await fetch(
      "https://sui-testnet.gateway.tatum.io/",
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

    const data = await response.json();

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
 * VERIFY TX
 */
app.post("/api/verify-tx", async (req, res) => {
  try {
    const apiKey = process.env.TATUM_API_KEY;
    const { digest } = req.body;

    const response = await fetch(
      "https://sui-testnet.gateway.tatum.io/",
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

    const data = await response.json();

    return res.json({
      verified: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Verification failed",
      message: err.message,
    });
  }
});

/**
 * START SERVER (ONLY ONCE)
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});