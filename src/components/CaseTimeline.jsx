import { useState } from "react";
import toast from "react-hot-toast";

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

var gradText = {
  background: "linear-gradient(90deg, #7B61FF 0%, #00B4D8 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 800,
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "22px",
};

function CaseTimeline({ caseData, onVerify }) {
  var [expanded, setExpanded] = useState(null);
  var files = caseData && caseData.files ? caseData.files : [];

  function toggle(i) {
    setExpanded(expanded === i ? null : i);
  }

  function walrusUrl(blobId) {
    return "https://aggregator.walrus-testnet.walrus.space/v1/blobs/" + blobId;
  }

  function walrusscanUrl(blobId) {
    return "https://walruscan.com/testnet/blob/" + blobId;
  }

  function suiscanUrl(digest) {
    return "https://suiscan.xyz/mainnet/tx/" + digest;
  }

  return (
    <div style={s.wrap}>
      <div style={s.summaryRow}>
        <div style={s.summaryCard}>
          <div style={s.summaryLabel}>Status</div>
          <div style={s.statusBadge}>{caseData.status.toUpperCase()}</div>
        </div>
        <div style={s.summaryCard}>
          <div style={s.summaryLabel}>Category</div>
          <div style={s.summaryValue}>{caseData.category}</div>
        </div>
        <div style={s.summaryCard}>
          <div style={s.summaryLabel}>Evidence Files</div>
          <div style={{ ...s.summaryValue, ...gradText }}>{files.length}</div>
        </div>
        <div style={s.summaryCard}>
          <div style={s.summaryLabel}>Created</div>
          <div style={s.summaryValue}>
            {new Date(caseData.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div style={s.ownerBar}>
        <span style={s.ownerLabel}>Case Owner</span>
        <span style={s.ownerAddr}>{caseData.owner}</span>
      </div>

      {caseData.txDigest && (
        <div style={s.suiscanBar}>
          <span style={s.suiscanLabel}>Case anchored on Sui</span>
          <a
            href={suiscanUrl(caseData.txDigest)}
            target="_blank"
            rel="noreferrer"
            style={s.suiscanLink}
          >
            View on Suiscan ↗
          </a>
        </div>
      )}

      <div style={s.section}>
       <div style={s.sectionHeader}>
  <h2 style={s.sectionTitle}>Evidence Timeline</h2>
  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
    <button style={s.verifyBtn} onClick={onVerify}>
      Verify a File
    </button>
    <button
      style={s.shareBtn}
      onClick={function () {
        if (!caseData.manifestBlobId) {
         toast.error("No manifest available — recreate this case to enable sharing");
          return;
        }
        var url = window.location.origin + "?manifest=" + caseData.manifestBlobId;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }}
    >
      Share Case ↗
    </button>
  </div>
        </div>

        {files.length === 0 && (
          <div style={s.empty}>
            <div style={s.emptyGlyph}>◈</div>
            <div style={s.emptyText}>No evidence uploaded yet.</div>
          </div>
        )}

        {files.length > 0 && (
          <div style={s.timeline}>
            {files.map(function (file, i) {
              var isOpen = expanded === i;
              return (
                <div key={i} style={s.timelineItem}>
                  <div style={s.timelineLine}>
                    <div style={s.timelineDot} />
                    {i < files.length - 1 && <div style={s.timelineConnector} />}
                  </div>
                  <div style={s.card}>
                    <div style={s.cardTop}>
                      <div style={s.cardLeft}>
                        <div style={s.cardName}>{file.name}</div>
                        <div style={s.cardDate}>
                          {new Date(file.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                      <div style={s.cardRight}>
                        <span style={s.fileSize}>
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        <button
                          style={s.toggleBtn}
                          onClick={function () { toggle(i); }}
                        >
                          {isOpen ? "Hide" : "Details"}
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div style={s.expanded}>
                        <div style={s.expandDivider} />
                        <div style={s.metaGrid}>
                          <div style={s.metaItem}>
                            <div style={s.metaLabel}>Walrus Blob ID</div>
                            <div style={s.metaBlob}>{file.blobId}</div>
                          </div>
                          <div style={s.metaItem}>
                            <div style={s.metaLabel}>SHA256 Hash</div>
                            <div style={s.metaHash}>{file.hash}</div>
                          </div>
                          {file.txDigest && (
                            <div style={s.metaItem}>
                              <div style={s.metaLabel}>Sui Transaction</div>
                              <div style={{ ...s.metaBlob, color: "#00D395" }}>{file.txDigest}</div>
                            </div>
                          )}
                        </div>
                        <div style={s.linkRow}>
                          <a
                            href={walrusUrl(file.blobId)}
                            target="_blank"
                            rel="noreferrer"
                            style={s.link}
                          >
                            View on Walrus ↗
                          </a>
                          <a
                            href={walrusscanUrl(file.blobId)}
                            target="_blank"
                            rel="noreferrer"
                            style={{ ...s.link, color: C.purple }}
                          >
                            View on Walruscan ↗
                          </a>
        
                                    {file.txDigest && (
                                      <a
                
                  href={"https://suiscan.xyz/mainnet/tx/" + file.txDigest}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...s.link, color: "#00D395" }}
                >
                  View on Sui Explorer ↗
                </a>
              )}
              <button
  style={s.downloadBtn}
  onClick={async function () {
    try {
      var response = await fetch(walrusUrl(file.blobId));
      var blob = await response.blob();
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Download failed: " + err.message);
    }
  }}
>
  ↓ Download
</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

var s = {
  shareBtn: { padding: "8px 18px", borderRadius: "8px", border: "1px solid #7B61FF40", backgroundColor: "#7B61FF10", color: "#7B61FF", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  downloadBtn: { padding: "5px 14px", borderRadius: "6px", border: "1px solid #00B4D840", backgroundColor: "#00B4D810", color: "#00B4D8", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
shareBtn: { padding: "8px 18px", borderRadius: "8px", border: "1px solid #7B61FF40", backgroundColor: "#7B61FF10", color: "#7B61FF", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginLeft: "8px" },
  wrap: { maxWidth: "720px" },
  summaryRow: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" },
  summaryCard: { backgroundColor: "#0E0E1A", borderRadius: "12px", border: "1px solid #1E1E30", padding: "18px" },
  summaryLabel: { fontSize: "10px", color: "#44445A", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" },
  summaryValue: { fontSize: "14px", fontWeight: 600, color: "#F2F2FF" },
  statusBadge: { display: "inline-block", fontSize: "11px", color: "#7B61FF", fontWeight: 700, backgroundColor: "#7B61FF14", padding: "3px 10px", borderRadius: "100px", letterSpacing: "0.5px" },
  ownerBar: { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#0E0E1A", borderRadius: "10px", border: "1px solid #1E1E30", padding: "14px 18px", marginBottom: "12px" },
  ownerLabel: { fontSize: "11px", color: "#44445A", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", flexShrink: 0 },
  ownerAddr: { fontSize: "12px", color: "#8888AA", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  suiscanBar: { display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#00D39510", borderRadius: "10px", border: "1px solid #00D39530", padding: "12px 18px", marginBottom: "32px" },
  suiscanLabel: { fontSize: "12px", color: "#00D395", fontWeight: 600 },
  suiscanLink: { fontSize: "12px", color: "#00D395", fontWeight: 700, textDecoration: "none" },
  section: { marginBottom: "32px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", gap: "12px" },
  sectionTitle: { fontSize: "16px", fontWeight: 700, color: "#F2F2FF", fontFamily: "'Space Grotesk', sans-serif" },
  verifyBtn: { padding: "8px 18px", borderRadius: "8px", border: "1px solid #00B4D840", backgroundColor: "#00B4D810", color: "#00B4D8", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  empty: { textAlign: "center", padding: "56px", backgroundColor: "#0E0E1A", borderRadius: "14px", border: "1px solid #1E1E30" },
  emptyGlyph: { fontSize: "28px", color: "#44445A", marginBottom: "12px" },
  emptyText: { fontSize: "14px", color: "#44445A" },
  timeline: { display: "flex", flexDirection: "column", gap: "0px" },
  timelineItem: { display: "flex", gap: "16px", marginBottom: "8px" },
  timelineLine: { display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "18px", flexShrink: 0 },
  timelineDot: { width: "10px", height: "10px", borderRadius: "50%", background: gradBg, flexShrink: 0 },
  timelineConnector: { width: "2px", flex: 1, backgroundColor: "#1E1E30", marginTop: "6px", minHeight: "24px" },
  card: { flex: 1, backgroundColor: "#0E0E1A", borderRadius: "12px", border: "1px solid #1E1E30", padding: "18px 20px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  cardLeft: { flex: 1 },
  cardName: { fontSize: "14px", fontWeight: 600, color: "#F2F2FF", marginBottom: "4px" },
  cardDate: { fontSize: "12px", color: "#44445A" },
  cardRight: { display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 },
  fileSize: { fontSize: "12px", color: "#44445A" },
  toggleBtn: { padding: "5px 14px", borderRadius: "6px", border: "1px solid #1E1E30", backgroundColor: "transparent", color: "#8888AA", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  expanded: { marginTop: "16px" },
  expandDivider: { height: "1px", backgroundColor: "#1E1E30", marginBottom: "16px" },
  metaGrid: { display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" },
  metaItem: { backgroundColor: "#13131F", borderRadius: "8px", padding: "12px 14px", border: "1px solid #1E1E30" },
  metaLabel: { fontSize: "10px", color: "#44445A", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" },
  metaBlob: { fontSize: "12px", color: "#00B4D8", fontFamily: "monospace", wordBreak: "break-all" },
  metaHash: { fontSize: "12px", color: "#8888AA", fontFamily: "monospace", wordBreak: "break-all" },
  linkRow: { display: "flex", gap: "16px", flexWrap: "wrap" },
  link: { fontSize: "13px", color: "#00B4D8", fontWeight: 600, textDecoration: "none" },
};

export default CaseTimeline;