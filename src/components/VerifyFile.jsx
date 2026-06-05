import { useState } from "react";
import { hashFile } from "../utils/hash";

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

function VerifyFile({ caseData }) {
  var [file, setFile] = useState(null);
  var [result, setResult] = useState(null);
  var [verifying, setVerifying] = useState(false);

  function handleFileSelect(e) {
    setFile(e.target.files[0]);
    setResult(null);
  }
async function handleVerify() {
  if (!file) {
    alert("Please select a file to verify");
    return;
  }
  setVerifying(true);
  try {
    var hash = await hashFile(file);

    // Load all cases across all wallets
    var allCases = [];
    var keys = Object.keys(localStorage).filter(function (k) {
      return k.includes("prooflocker_cases_");
    });
    keys.forEach(function (key) {
      var cases = JSON.parse(localStorage.getItem(key) || "[]");
      allCases = allCases.concat(cases);
    });

    if (!caseData) {
      // Search across all cases
      var found = null;
      for (var i = 0; i < allCases.length; i++) {
        var match = allCases[i].files.find(function (f) { return f.hash === hash; });
        if (match) {
          found = { evidence: match, caseTitle: allCases[i].title };
          break;
        }
      }
      if (found) {
        setResult({ status: "verified", hash: hash, evidence: found.evidence, caseTitle: found.caseTitle });
      } else {
        setResult({ status: "failed", hash: hash });
      }
    } else {
      // Search within specific case
      var currentCase = allCases.find(function (c) { return c.id === caseData.id; });
      if (!currentCase || currentCase.files.length === 0) {
        setResult({ status: "no-evidence", hash: hash });
      } else {
        var matchedFile = currentCase.files.find(function (f) { return f.hash === hash; });
        if (matchedFile) {
          setResult({ status: "verified", hash: hash, evidence: matchedFile, caseTitle: currentCase.title });
        } else {
          setResult({ status: "failed", hash: hash });
        }
      }
    }
  } catch (err) {
    console.error("Verification failed:", err);
  }
  setVerifying(false);
}
  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.dropzone}>
          <input
            type="file"
            onChange={handleFileSelect}
            style={s.fileInput}
            id="verify-upload"
          />
          <label htmlFor="verify-upload" style={s.dropLabel}>
            <div style={s.dropIcon}>✦</div>
            <div style={s.dropText}>
              {file ? file.name : "Click to select file to verify"}
            </div>
            <div style={s.dropHint}>
              The file will be hashed and checked against Walrus evidence
            </div>
          </label>
        </div>

        <button
          style={{ ...s.btn, opacity: verifying ? 0.6 : 1 }}
          onClick={handleVerify}
          disabled={verifying}
        >
          {verifying ? "Verifying..." : "Verify File →"}
        </button>
      </div>

      {result && (
        <div style={{
          ...s.resultCard,
          borderColor: result.status === "verified"
            ? C.blue + "50"
            : result.status === "failed"
            ? "#FF444450"
            : C.border,
        }}>
          {result.status === "verified" && (
            <div>
              <div style={s.resultHeader}>
                <div style={{ ...s.resultIcon, backgroundColor: C.blue + "14", color: C.blue }}>✓</div>
                <div>
                  <div style={s.resultTitle}>File Verified</div>
                  <div style={s.resultSub}>This file matches evidence stored on Walrus</div>
                </div>
              </div>
              <div style={s.resultDivider} />
              <div style={s.metaGrid}>
                <div style={s.metaItem}>
                  <div style={s.metaLabel}>Original Filename</div>
                  <div style={s.metaValue}>{result.evidence.name}</div>
                </div>
                <div style={s.metaItem}>
                  <div style={s.metaLabel}>Case</div>
                  <div style={s.metaValue}>{result.caseTitle}</div>
                </div>
                <div style={s.metaItem}>
                  <div style={s.metaLabel}>Uploaded At</div>
                  <div style={s.metaValue}>
                    {new Date(result.evidence.uploadedAt).toLocaleString()}
                  </div>
                </div>
                <div style={s.metaItem}>
                  <div style={s.metaLabel}>Walrus Blob ID</div>
                  <div style={{ ...s.metaValue, color: C.blue, fontFamily: "monospace", fontSize: "11px", wordBreak: "break-all" }}>
                    {result.evidence.blobId}
                  </div>
                </div>
                <div style={{ ...s.metaItem, gridColumn: "1 / -1" }}>
                  <div style={s.metaLabel}>SHA256 Hash</div>
                  <div style={{ ...s.metaValue, color: C.textSub, fontFamily: "monospace", fontSize: "11px", wordBreak: "break-all" }}>
                    {result.hash}
                  </div>
                </div>
              </div>
            </div>
          )}

          {result.status === "failed" && (
            <div>
              <div style={s.resultHeader}>
                <div style={{ ...s.resultIcon, backgroundColor: "#FF444414", color: "#FF4444" }}>✗</div>
                <div>
                  <div style={{ ...s.resultTitle, color: "#FF4444" }}>Verification Failed</div>
                  <div style={s.resultSub}>
                    This file does not match any evidence in this case. It may have been altered.
                  </div>
                </div>
              </div>
              <div style={s.resultDivider} />
              <div style={s.metaItem}>
                <div style={s.metaLabel}>SHA256 Hash</div>
                <div style={{ ...s.metaValue, color: C.textMuted, fontFamily: "monospace", fontSize: "11px", wordBreak: "break-all" }}>
                  {result.hash}
                </div>
              </div>
            </div>
          )}

          {result.status === "no-evidence" && (
            <div>
              <div style={s.resultHeader}>
                <div style={{ ...s.resultIcon, backgroundColor: C.border, color: C.textMuted }}>!</div>
                <div>
                  <div style={{ ...s.resultTitle, color: C.textSub }}>No Evidence Found</div>
                  <div style={s.resultSub}>No files have been uploaded to this case yet.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

var s = {
  wrap: {
    maxWidth: "620px",
  },
  card: {
    backgroundColor: "#0E0E1A",
    borderRadius: "16px",
    border: "1px solid #1E1E30",
    padding: "32px",
    marginBottom: "16px",
  },
  downloadBtn: { padding: "5px 14px", borderRadius: "6px", border: "1px solid #00B4D840", backgroundColor: "#00B4D810", color: "#00B4D8", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
shareBtn: { padding: "8px 18px", borderRadius: "8px", border: "1px solid #7B61FF40", backgroundColor: "#7B61FF10", color: "#7B61FF", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginLeft: "8px" },
  dropzone: {
    border: "1.5px dashed #2E2E48",
    borderRadius: "12px",
    padding: "48px 32px",
    textAlign: "center",
    marginBottom: "24px",
    position: "relative",
    cursor: "pointer",
  },
  fileInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
    width: "100%",
    height: "100%",
  },
  dropLabel: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  dropIcon: {
    fontSize: "24px",
    background: gradBg,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: 800,
    marginBottom: "4px",
  },
  dropText: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#F2F2FF",
  },
  dropHint: {
    fontSize: "12px",
    color: "#44445A",
    letterSpacing: "0.3px",
  },
  btn: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: gradBg,
    color: "#fff",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  resultCard: {
    backgroundColor: "#0E0E1A",
    borderRadius: "16px",
    border: "1px solid",
    padding: "28px",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "4px",
  },
  resultIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: 700,
    flexShrink: 0,
  },
  resultTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#F2F2FF",
    fontFamily: "'Space Grotesk', sans-serif",
    marginBottom: "4px",
  },
  resultSub: {
    fontSize: "13px",
    color: "#8888AA",
    lineHeight: 1.5,
  },
  resultDivider: {
    height: "1px",
    backgroundColor: "#1E1E30",
    margin: "20px 0",
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  metaItem: {
    backgroundColor: "#13131F",
    borderRadius: "8px",
    padding: "12px 14px",
    border: "1px solid #1E1E30",
  },
  metaLabel: {
    fontSize: "10px",
    color: "#44445A",
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  metaValue: {
    fontSize: "13px",
    color: "#F2F2FF",
    fontWeight: 500,
  },
};

export default VerifyFile;