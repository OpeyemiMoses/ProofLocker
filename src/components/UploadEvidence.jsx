import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { uploadToWalrus } from "../utils/walrus";
import { hashFile } from "../utils/hash";
import { PACKAGE_ID, MODULE_NAME, FUNCTIONS } from "../utils/contract";

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

function UploadEvidence({ caseData, onEvidenceUploaded }) {
  var [files, setFiles] = useState([]);
  var [uploading, setUploading] = useState(false);
  var [uploaded, setUploaded] = useState([]);
  var [progress, setProgress] = useState("");
  var [currentFile, setCurrentFile] = useState(0);

  var { mutate: signAndExecute } = useSignAndExecuteTransaction();

  function handleFileSelect(e) {
    setFiles(Array.from(e.target.files));
  }

  // Anchor all evidence files in a single Sui transaction
  function anchorAllEvidence(results) {
    return new Promise(function (resolve) {
      try {
        var tx = new Transaction();

        results.forEach(function (evidence) {
          tx.moveCall({
            target: PACKAGE_ID + "::" + MODULE_NAME + "::" + FUNCTIONS.addEvidence,
            arguments: [
              tx.pure.address(caseData.owner),
              tx.pure.vector("u8", Array.from(new TextEncoder().encode(evidence.name))),
              tx.pure.vector("u8", Array.from(new TextEncoder().encode(evidence.hash))),
              tx.pure.vector("u8", Array.from(new TextEncoder().encode(evidence.blobId))),
              tx.pure.u64(Date.now()),
            ],
          });
        });

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: function (result) {
              console.log("Anchor success:", result.digest);
              resolve(result.digest);
            },
            onError: function (err) {
              console.log("Anchor error:", err.message);
              resolve(null);
            },
          }
        );
      } catch (err) {
        console.log("Anchor build error:", err.message);
        resolve(null);
      }
    });
  }

  async function handleUpload() {
    if (files.length === 0) {
      alert("Please select at least one file");
      return;
    }
    setUploading(true);
    var results = [];

    // Step 1 — hash and upload all files to Walrus
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      setCurrentFile(i + 1);
      try {
        setProgress("Hashing " + file.name + "...");
        var hash = await hashFile(file);

        setProgress("Uploading " + file.name + " to Walrus...");
        var blobId = await uploadToWalrus(file);

        results.push({
          name: file.name,
          size: file.size,
          type: file.type,
          hash: hash,
          blobId: blobId,
          uploadedAt: new Date().toISOString(),
          caseId: caseData.id,
          txDigest: null,
        });

        setProgress("✓ " + file.name + " stored on Walrus");
      } catch (err) {
        console.error("Walrus upload failed:", err);
        setProgress("✗ Failed to upload: " + file.name);
      }
    }

    // Step 2 — anchor all files in one Sui transaction
    if (results.length > 0) {
      setProgress("Anchoring evidence on Sui...");
      var digest = await anchorAllEvidence(results);

      // Attach digest to all results
      results = results.map(function (r) {
        return { ...r, txDigest: digest };
      });
    }

    // Step 3 — save to localStorage
    var key = "prooflocker_cases_" + caseData.owner;
var cases = JSON.parse(localStorage.getItem(key) || "[]");
var updatedCase = null;
var updated = cases.map(function (c) {
  if (c.id === caseData.id) {
    updatedCase = { ...c, files: [...c.files, ...results] };
    return updatedCase;
  }
  return c;
});
localStorage.setItem(key, JSON.stringify(updated));

// Update Walrus manifest with new files
if (updatedCase && updatedCase.manifestBlobId) {
  try {
    setProgress("Updating case manifest on Walrus...");
    var { uploadManifest } = await import("../utils/walrus");
    var newManifest = {
      caseId: updatedCase.id,
      title: updatedCase.title,
      description: updatedCase.description,
      category: updatedCase.category,
      owner: updatedCase.owner,
      createdAt: updatedCase.createdAt,
      status: updatedCase.status,
      txDigest: updatedCase.txDigest,
      manifestBlobId: updatedCase.manifestBlobId,
      files: updatedCase.files,
    };
    var newManifestBlobId = await uploadManifest(newManifest);
    updatedCase.manifestBlobId = newManifestBlobId;

    // Save updated manifest blob ID back to localStorage
    var finalCases = updated.map(function (c) {
      if (c.id === caseData.id) return updatedCase;
      return c;
    });
    localStorage.setItem(key, JSON.stringify(finalCases));
    setProgress("✓ Manifest updated on Walrus");
  } catch (err) {
    console.error("Manifest update failed:", err);
  }
}

    setUploaded(results);
    setUploading(false);
    setProgress("");
    onEvidenceUploaded(results);
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.dropzone}>
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            style={s.fileInput}
            id="evidence-upload"
          />
          <label htmlFor="evidence-upload" style={s.dropLabel}>
            <div style={s.dropIcon}>↑</div>
            <div style={s.dropText}>
              {files.length > 0
                ? files.length + " file" + (files.length !== 1 ? "s" : "") + " selected"
                : "Click to select evidence files"}
            </div>
            <div style={s.dropHint}>
              PDFs · Images · Screenshots · Invoices · ZIPs · Videos
            </div>
          </label>
        </div>

        {files.length > 0 && (
          <div style={s.fileList}>
            {files.map(function (f, i) {
              return (
                <div key={i} style={s.fileItem}>
                  <div style={s.fileBar} />
                  <div style={s.fileInfo}>
                    <span style={s.fileName}>{f.name}</span>
                    <span style={s.fileSize}>{(f.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {uploading && (
          <div style={s.progressWrap}>
            <div style={s.progressBar}>
              <div style={{ ...s.progressFill, width: Math.round((currentFile / files.length) * 100) + "%" }} />
            </div>
            <div style={s.progressText}>{progress}</div>
          </div>
        )}

        <button
          style={{ ...s.btn, opacity: uploading ? 0.6 : 1 }}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading & Anchoring..." : "Upload Evidence →"}
        </button>
      </div>

      {uploaded.length > 0 && (
        <div style={s.results}>
          <div style={s.resultsHeader}>
            <div style={s.resultsTitle}>Evidence Stored</div>
            <div style={s.resultsBadge}>{uploaded.length} file{uploaded.length !== 1 ? "s" : ""}</div>
          </div>
          {uploaded.map(function (ev, i) {
            return (
              <div key={i} style={s.resultItem}>
                <div style={s.resultLeft}>
                  <div style={s.resultAccent} />
                  <div>
                    <div style={s.resultName}>{ev.name}</div>
                    <div style={s.resultMeta}>{new Date(ev.uploadedAt).toLocaleString()}</div>
                  </div>
                </div>
                <div style={s.resultRight}>
                  <div style={s.resultBlobLabel}>Blob ID</div>
                  <div style={s.resultBlob}>{ev.blobId.slice(0, 20)}...</div>
                  {ev.txDigest && (
                    <>
                      <div style={{ ...s.resultBlobLabel, marginTop: "6px" }}>Tx Digest</div>
                      <a
                        href={"https://suiscan.xyz/mainnet/tx/" + ev.txDigest}
                        target="_blank"
                        rel="noreferrer"
                        style={{ ...s.resultBlob, color: C.purple, textDecoration: "none" }}
                      >
                        {ev.txDigest.slice(0, 20)}... ↗
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

var s = {
  downloadBtn: { padding: "5px 14px", borderRadius: "6px", border: "1px solid #00B4D840", backgroundColor: "#00B4D810", color: "#00B4D8", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
shareBtn: { padding: "8px 18px", borderRadius: "8px", border: "1px solid #7B61FF40", backgroundColor: "#7B61FF10", color: "#7B61FF", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginLeft: "8px" },
  wrap: { maxWidth: "620px" },
  card: { backgroundColor: "#0E0E1A", borderRadius: "16px", border: "1px solid #1E1E30", padding: "32px", marginBottom: "16px" },
  dropzone: { border: "1.5px dashed #2E2E48", borderRadius: "12px", padding: "48px 32px", textAlign: "center", marginBottom: "24px", position: "relative", cursor: "pointer" },
  fileInput: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", height: "100%" },
  dropLabel: { cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
  dropIcon: { fontSize: "28px", background: gradBg, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontWeight: 800, marginBottom: "4px" },
  dropText: { fontSize: "15px", fontWeight: 600, color: "#F2F2FF" },
  dropHint: { fontSize: "12px", color: "#44445A", letterSpacing: "0.3px" },
  fileList: { marginBottom: "24px", display: "flex", flexDirection: "column", gap: "8px" },
  fileItem: { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#13131F", borderRadius: "8px", padding: "12px 16px", border: "1px solid #1E1E30" },
  fileBar: { width: "3px", height: "28px", borderRadius: "3px", background: gradBg, flexShrink: 0 },
  fileInfo: { display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1 },
  fileName: { fontSize: "13px", color: "#F2F2FF", fontWeight: 500 },
  fileSize: { fontSize: "12px", color: "#44445A" },
  progressWrap: { marginBottom: "20px" },
  progressBar: { height: "3px", backgroundColor: "#1E1E30", borderRadius: "3px", overflow: "hidden", marginBottom: "10px" },
  progressFill: { height: "100%", background: gradBg, borderRadius: "3px", transition: "width 0.4s ease" },
  progressText: { fontSize: "13px", color: "#00B4D8", fontWeight: 500 },
  btn: { width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: gradBg, color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  results: { backgroundColor: "#0E0E1A", borderRadius: "16px", border: "1px solid #1E1E30", padding: "24px" },
  resultsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  resultsTitle: { fontSize: "15px", fontWeight: 700, color: "#F2F2FF", fontFamily: "'Space Grotesk', sans-serif" },
  resultsBadge: { fontSize: "11px", color: "#00B4D8", fontWeight: 700, backgroundColor: "#00B4D814", padding: "4px 12px", borderRadius: "100px" },
  resultItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#13131F", borderRadius: "10px", border: "1px solid #1E1E30", marginBottom: "8px" },
  resultLeft: { display: "flex", alignItems: "center", gap: "12px" },
  resultAccent: { width: "3px", height: "36px", borderRadius: "3px", background: gradBg, flexShrink: 0 },
  resultName: { fontSize: "14px", fontWeight: 600, color: "#F2F2FF", marginBottom: "4px" },
  resultMeta: { fontSize: "12px", color: "#44445A" },
  resultRight: { textAlign: "right" },
  resultBlobLabel: { fontSize: "10px", color: "#44445A", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" },
  resultBlob: { fontSize: "12px", color: "#00B4D8", fontFamily: "monospace" },
};

export default UploadEvidence;