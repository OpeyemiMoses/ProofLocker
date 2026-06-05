import { useState, useEffect } from "react";
import { getLatestCheckpoint, getWalletTransactions, verifyTransaction } from "../utils/tatum";

var gradBg = "linear-gradient(135deg, #7B61FF 0%, #00B4D8 100%)";
var C = {
  purple: "#7B61FF",
  blue: "#00B4D8",
  surface: "#0E0E1A",
  surfaceAlt: "#13131F",
  border: "#1E1E30",
  text: "#F2F2FF",
  textSub: "#8888AA",
  textMuted: "#44445A",
};

function TatumStats({ walletAddress, cases }) {
  var [checkpoint, setCheckpoint] = useState(null);
  var [transactions, setTransactions] = useState([]);
  var [verifiedCases, setVerifiedCases] = useState({});
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    async function fetchStats() {
      setLoading(true);

      try {
        var cp = await getLatestCheckpoint();
        setCheckpoint(cp);
      } catch (err) {
        console.error("Checkpoint fetch failed:", err);
      }

      if (walletAddress) {
        try {
          var txs = await getWalletTransactions(walletAddress);
          setTransactions(txs.data || []);
        } catch (err) {
          console.error("Wallet tx fetch failed:", err);
        }

        var verified = {};
        for (var i = 0; i < cases.length; i++) {
          var c = cases[i];
          if (c.txDigest) {
            try {
              var isVerified = await verifyTransaction(c.txDigest);
              verified[c.id] = isVerified;
            } catch (err) {
              verified[c.id] = false;
            }
          }
        }
        setVerifiedCases(verified);
      }

      setLoading(false);
    }

    fetchStats();
  }, [walletAddress]);

  var verifiedCount = Object.values(verifiedCases).filter(function (v) { return v === true; }).length;

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <div style={s.tag}>POWERED BY TATUM RPC</div>
          <h2 style={s.title}>Live Network Data</h2>
        </div>
        <div style={s.tatumBadge}>
          <div style={s.tatumDot} />
          Tatum · Sui Testnet
        </div>
      </div>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <div style={s.statLabel}>Latest Checkpoint</div>
          <div style={s.statValue}>
            {loading ? "—" : checkpoint ? Number(checkpoint).toLocaleString() : "—"}
          </div>
          <div style={s.statSub}>Sui Network</div>
        </div>

        <div style={s.statCard}>
          <div style={s.statLabel}>Recent Transactions</div>
          <div style={s.statValue}>
            {loading ? "—" : transactions.length}
          </div>
          <div style={s.statSub}>Your wallet activity</div>
        </div>

        <div style={s.statCard}>
          <div style={s.statLabel}>Verified On-Chain</div>
          <div style={s.statValue}>
            {loading ? "—" : verifiedCount}
          </div>
          <div style={s.statSub}>ProofLocker cases</div>
        </div>

        <div style={s.statCard}>
          <div style={s.statLabel}>RPC Provider</div>
          <div style={{ ...s.statValue, fontSize: "18px" }}>Tatum</div>
          <div style={s.statSub}>Enterprise grade</div>
        </div>
      </div>

      {transactions.length > 0 && (
        <div style={s.txSection}>
          <div style={s.txTitle}>Recent Wallet Transactions</div>
          {transactions.slice(0, 5).map(function (tx, i) {
            return (
              <div key={i} style={s.txItem}>
                <div style={s.txLeft}>
                  <div style={s.txDot} />
                  <div>
                    <div style={s.txDigest}>{tx.digest.slice(0, 24)}...</div>
                    <div style={s.txMeta}>
                      {tx.checkpoint ? "Checkpoint " + Number(tx.checkpoint).toLocaleString() : "Pending"}
                    </div>
                  </div>
                </div>
                <a
                  href={"https://suiscan.xyz/testnet/tx/" + tx.digest}
                  target="_blank"
                  rel="noreferrer"
                  style={s.txLink}
                >
                  View ↗
                </a>
              </div>
            );
          })}
        </div>
      )}

      {cases.length > 0 && Object.keys(verifiedCases).length > 0 && (
        <div style={s.txSection}>
          <div style={s.txTitle}>On-Chain Case Verification</div>
          {cases.map(function (c, i) {
            var isVerified = verifiedCases[c.id];
            var hasDigest = c.txDigest ? true : false;
            var dotColor = !hasDigest ? C.textMuted : isVerified ? "#00D395" : "#FF4444";
            var metaText = !hasDigest ? "No tx digest" : isVerified ? "Verified on Sui" : "Not found on-chain";
            return (
              <div key={i} style={s.txItem}>
                <div style={s.txLeft}>
                  <div style={{ ...s.txDot, backgroundColor: dotColor }} />
                  <div>
                    <div style={s.txDigest}>{c.title}</div>
                    <div style={s.txMeta}>{metaText}</div>
                  </div>
                </div>
                {hasDigest && (
                  <a
                    href={"https://suiscan.xyz/testnet/tx/" + c.txDigest}
                    target="_blank"
                    rel="noreferrer"
                    style={s.txLink}
                  >
                    View ↗
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

var s = {
  wrap: { marginTop: "48px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "20px" },
  tag: { fontSize: "10px", color: "#7B61FF", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "6px" },
  title: { fontSize: "17px", fontWeight: 700, color: "#F2F2FF", fontFamily: "'Space Grotesk', sans-serif" },
  tatumBadge: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#44445A", fontWeight: 600 },
  tatumDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FF6B35", boxShadow: "0 0 6px #FF6B3566" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" },
  statCard: { backgroundColor: "#0E0E1A", borderRadius: "12px", border: "1px solid #1E1E30", padding: "20px" },
  statLabel: { fontSize: "10px", color: "#44445A", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" },
  statValue: { fontSize: "24px", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", background: gradBg, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", lineHeight: 1, marginBottom: "4px" },
  statSub: { fontSize: "11px", color: "#44445A" },
  txSection: { backgroundColor: "#0E0E1A", borderRadius: "12px", border: "1px solid #1E1E30", padding: "20px", marginBottom: "16px" },
  txTitle: { fontSize: "13px", fontWeight: 700, color: "#F2F2FF", marginBottom: "16px", fontFamily: "'Space Grotesk', sans-serif" },
  txItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1E1E30" },
  txLeft: { display: "flex", alignItems: "center", gap: "12px" },
  txDot: { width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#00B4D8", flexShrink: 0 },
  txDigest: { fontSize: "13px", color: "#F2F2FF", fontFamily: "monospace", marginBottom: "2px" },
  txMeta: { fontSize: "11px", color: "#44445A" },
  txLink: { fontSize: "12px", color: "#7B61FF", fontWeight: 600, textDecoration: "none" },
};

export default TatumStats;