import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME, FUNCTIONS } from "../utils/contract";
import { uploadManifest } from "../utils/walrus";

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

var gradBg = "linear-gradient(135deg, #7B61FF 0%, #00B4D8 100%)";

function CreateCase({ walletAddress, onCaseCreated }) {
  var [title, setTitle] = useState("");
  var [description, setDescription] = useState("");
  var [category, setCategory] = useState("freelance");
  var [loading, setLoading] = useState(false);
  var [status, setStatus] = useState("");

  var { mutate: signAndExecute } = useSignAndExecuteTransaction();

  async function saveCase(caseData) {
    // Upload manifest to Walrus
    try {
      setStatus("Uploading case manifest to Walrus...");
      var manifest = {
        caseId: caseData.id,
        title: caseData.title,
        description: caseData.description,
        category: caseData.category,
        owner: caseData.owner,
        createdAt: caseData.createdAt,
        status: caseData.status,
        txDigest: caseData.txDigest,
        files: [],
      };
      var manifestBlobId = await uploadManifest(manifest);
      caseData.manifestBlobId = manifestBlobId;
      setStatus("✓ Case stored on Walrus · Anchored on Sui");
    } catch (err) {
      console.error("Manifest upload failed:", err);
      setStatus("⚠ Case created — manifest upload failed");
    }

    // Save to localStorage
    var key = "prooflocker_cases_" + walletAddress;
    var existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(caseData);
    localStorage.setItem(key, JSON.stringify(existing));
    setLoading(false);
    onCaseCreated(caseData);
  }

  async function handleCreate() {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    setStatus("Creating case on Sui...");

    try {
      var caseData = {
        id: "case_" + Date.now(),
        title: title,
        description: description,
        category: category,
        owner: walletAddress,
        createdAt: new Date().toISOString(),
        status: "open",
        files: [],
        txDigest: null,
        manifestBlobId: null,
      };

      var tx = new Transaction();
      tx.moveCall({
        target: PACKAGE_ID + "::" + MODULE_NAME + "::" + FUNCTIONS.createCase,
        arguments: [
          tx.pure.vector("u8", Array.from(new TextEncoder().encode(title))),
          tx.pure.vector("u8", Array.from(new TextEncoder().encode(description))),
          tx.pure.vector("u8", Array.from(new TextEncoder().encode(category))),
          tx.pure.u64(Date.now()),
        ],
      });

      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async function (result) {
            setStatus("✓ Case anchored on Sui");
            caseData.txDigest = result.digest;
            await saveCase(caseData);
          },
          onError: async function (err) {
            console.error("Transaction failed:", err);
            setStatus("⚠ Chain anchor failed — saving locally");
            await saveCase(caseData);
          },
        }
      );
    } catch (err) {
      console.error("Case creation failed:", err);
      setLoading(false);
      setStatus("Failed to create case");
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.field}>
          <label style={s.label}>Case Title</label>
          <input
            style={s.input}
            type="text"
            placeholder="e.g. Logo design payment dispute"
            value={title}
            onChange={function (e) { setTitle(e.target.value); }}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Description</label>
          <textarea
            style={{ ...s.input, height: "110px", resize: "none" }}
            placeholder="Briefly describe the dispute or situation"
            value={description}
            onChange={function (e) { setDescription(e.target.value); }}
          />
        </div>

        <div style={s.field}>
          <label style={s.label}>Category</label>
          <select
            style={s.input}
            value={category}
            onChange={function (e) { setCategory(e.target.value); }}
          >
            <option value="freelance">Freelance</option>
            <option value="dao">DAO Contribution</option>
            <option value="agency">Agency</option>
            <option value="bug-bounty">Bug Bounty</option>
            <option value="remote-team">Remote Team</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={s.divider} />

        <div style={s.infoRow}>
          {[
            { label: "Storage", value: "Walrus Testnet" },
            { label: "Anchor", value: "Sui Blockchain" },
            { label: "Owner", value: walletAddress ? walletAddress.slice(0, 8) + "..." : "—" },
          ].map(function (item, i) {
            return (
              <div key={i} style={s.infoItem}>
                <div style={s.infoLabel}>{item.label}</div>
                <div style={s.infoValue}>{item.value}</div>
              </div>
            );
          })}
        </div>

        {status && <div style={s.status}>{status}</div>}

        <button
          style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? "Creating on Sui..." : "Create Case →"}
        </button>
      </div>

      <div style={s.hint}>
        After creating your case, you'll be able to upload evidence files stored permanently on Walrus with cryptographic proof anchored on Sui.
      </div>
    </div>
  );
}

var s = {
  wrap: { maxWidth: "580px" },
  card: { backgroundColor: "#0E0E1A", borderRadius: "16px", border: "1px solid #1E1E30", padding: "32px", marginBottom: "16px" },
  field: { marginBottom: "24px" },
  label: { display: "block", fontSize: "11px", fontWeight: 700, color: C.textMuted, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: "8px" },
  input: { width: "100%", backgroundColor: "#13131F", border: "1px solid #1E1E30", borderRadius: "10px", padding: "12px 16px", color: C.text, fontSize: "14px", outline: "none", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" },
  divider: { height: "1px", backgroundColor: "#1E1E30", margin: "8px 0 24px" },
  infoRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" },
  infoItem: { backgroundColor: "#13131F", borderRadius: "10px", padding: "14px", border: "1px solid #1E1E30" },
  infoLabel: { fontSize: "10px", color: C.textMuted, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" },
  infoValue: { fontSize: "12px", color: C.textSub, fontFamily: "monospace", wordBreak: "break-all" },
  status: { fontSize: "13px", color: "#00B4D8", fontWeight: 500, marginBottom: "16px", padding: "10px 14px", backgroundColor: "#00B4D810", borderRadius: "8px", border: "1px solid #00B4D820" },
  btn: { width: "100%", padding: "14px", borderRadius: "10px", border: "none", background: gradBg, color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  hint: { fontSize: "13px", color: C.textMuted, lineHeight: 1.6, padding: "0 4px" },
};

export default CreateCase;