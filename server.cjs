const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const fetch = global.fetch || require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API server running on port ${PORT}`);
});

/**
 * CORS CONFIG
 * Allow localhost (dev) + production frontend
 */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://proof-locker-main.vercel.app/", 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile apps / postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

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
 * SUI RPC PROXY (via Tatum)
 */
app.post("/api/sui-rpc", async (req, res) => {
  try {
    const apiKey = process.env.TATUM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Missing TATUM_API_KEY in environment variables",
      });
    }

    const { method, params = [] } = req.body;

    if (!method) {
      return res.status(400).json({
        error: "RPC method is required",
      });
    }

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
    console.error("Tatum RPC Error:", err);

    return res.status(500).json({
      error: "Tatum RPC call failed",
      message: err.message,
    });
  }
});

/**
 * VERIFY TRANSACTION (optional but useful for your case system)
 */
app.post("/api/verify-tx", async (req, res) => {
  try {
    const apiKey = process.env.TATUM_API_KEY;
    const { digest } = req.body;

    if (!digest) {
      return res.status(400).json({ error: "Missing transaction digest" });
    }

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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
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
 * START SERVER
 */
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});