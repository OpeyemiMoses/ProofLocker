import { useEffect, useState } from "react";
import CreateCase from "./components/CreateCase";
import UploadEvidence from "./components/UploadEvidence";
import CaseTimeline from "./components/CaseTimeline";
import VerifyFile from "./components/VerifyFile";
import { ConnectButton, useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import TatumStats from "./components/TatumStats";

var C = {
  purple: "#7B61FF",
  blue: "#00B4D8",
  dark: "#080810",
  surface: "#0E0E1A",
  surfaceAlt: "#13131F",
  border: "#1E1E30",
  text: "#F2F2FF",
  textSub: "#8888AA",
  textMuted: "#44445A",
};

var gradBg = "linear-gradient(135deg, #7B61FF 0%, #00B4D8 100%)";
var gradText = {
  background: "linear-gradient(90deg, #7B61FF 0%, #00B4D8 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};



// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function LandingPage({ onEnter }) {
  return (
    <div className="rise" style={lp.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1E1E30; border-radius: 4px; }
      `}</style>

      <nav style={lp.nav}>
        <div style={lp.navLogo}>
          <div style={lp.navLogoMark}>
            <span style={{ ...gradText, fontSize: "12px", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>PL</span>
          </div>
          <span style={lp.navLogoText}>ProofLocker</span>
        </div>
        <div style={lp.navLinks}>
          <a href="#how" style={lp.navLink}>How it works</a>
          <a href="#stack" style={lp.navLink}>Tech Stack</a>
          <button style={lp.navCta} onClick={onEnter}>Launch App →</button>
        </div>
      </nav>

      <section style={lp.hero}>
        <div style={lp.heroTag}>Dispute Evidence · On-Chain · Verifiable</div>
        <h1 style={lp.heroTitle}>
          Every byte.<br />
          <span style={gradText}>Provable.</span>
        </h1>
        <p style={lp.heroSub}>
          ProofLocker stores your dispute evidence permanently on Walrus,
          anchors cryptographic proof on Sui, and lets anyone verify
          file integrity — forever.
        </p>
        <div style={lp.heroBtns}>
          <button style={lp.heroPrimary} onClick={onEnter}>Launch App →</button>
          <a href="#how" style={lp.heroSecondary}>See how it works</a>
        </div>
        <div style={lp.heroPills}>
          {["Walrus Storage", "Sui Blockchain", "Tatum RPC", "SHA256 Hashing"].map(function (p, i) {
            return <span key={i} style={lp.pill}>{p}</span>;
          })}
        </div>
      </section>

      <div style={lp.strip}>
        <div style={lp.stripInner}>
          {["Immutable · ", "Verifiable · ", "Decentralized · ", "Trustless · ", "Permanent · ", "Cryptographic · ", "Immutable · ", "Verifiable · ", "Decentralized · ", "Trustless · "].map(function (t, i) {
            return <span key={i} style={lp.stripText}>{t}</span>;
          })}
        </div>
      </div>

      <section id="how" style={lp.section}>
        <div style={lp.sectionTag}>HOW IT WORKS</div>
        <h2 style={lp.sectionTitle}>Lock evidence.<br />Prove integrity.</h2>
        <div style={lp.steps}>
          {[
            { num: "01", title: "Create a Case", desc: "Open a dispute record and describe the situation. Your wallet address becomes the case owner on-chain." },
            { num: "02", title: "Upload Evidence", desc: "Upload contracts, screenshots, invoices, or any file. Each one is hashed with SHA256 and stored permanently on Walrus." },
            { num: "03", title: "Anchor on Sui", desc: "The file hash, Walrus blob ID, and timestamp get written to the Sui blockchain via a Move smart contract." },
            { num: "04", title: "Verify Anytime", desc: "Anyone can upload a file to check if it matches the original. Tampered files fail. Originals pass — always." },
          ].map(function (step, i) {
            return (
              <div key={i} style={lp.step}>
                <div style={lp.stepNum}>{step.num}</div>
                <div style={lp.stepLine} />
                <h3 style={lp.stepTitle}>{step.title}</h3>
                <p style={lp.stepDesc}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="stack" style={lp.section}>
        <div style={lp.sectionTag}>TECH STACK</div>
        <h2 style={lp.sectionTitle}>Built on the<br /><span style={gradText}>Sui Stack.</span></h2>
        <div style={lp.stackGrid}>
          {[
            { name: "Walrus", role: "Decentralized Storage", desc: "Every evidence file is stored as an immutable blob on Walrus. Files get a unique cryptographic ID that can never be altered.", color: C.blue },
            { name: "Sui", role: "Blockchain Anchor", desc: "A Move smart contract anchors file hashes, blob IDs, and timestamps on-chain. Every case is a verifiable Sui object.", color: C.purple },
            { name: "Tatum", role: "RPC Infrastructure", desc: "Tatum's Sui RPC nodes power all blockchain reads and writes — wallet activity, case ownership, and transaction history.", color: "#FF6B35" },
            { name: "SHA256", role: "File Integrity", desc: "Every uploaded file is hashed client-side before storage. Re-uploading the same file produces the same hash. Edited files don't match.", color: "#00D395" },
          ].map(function (item, i) {
            return (
              <div key={i} style={lp.stackCard}>
                <div style={{ ...lp.stackAccent, backgroundColor: item.color }} />
                <div style={lp.stackName}>{item.name}</div>
                <div style={{ ...lp.stackRole, color: item.color }}>{item.role}</div>
                <p style={lp.stackDesc}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section style={lp.section}>
        <div style={lp.sectionTag}>USE CASES</div>
        <h2 style={lp.sectionTitle}>Who uses<br />ProofLocker?</h2>
        <div style={lp.usecaseGrid}>
          {[
            { icon: "◈", label: "Freelancers", desc: "Prove delivery. Lock contracts and final files before a client disputes payment." },
            { icon: "✦", label: "DAOs", desc: "Record contributor work, votes, and decisions with immutable on-chain proof." },
            { icon: "⬡", label: "Agencies", desc: "Maintain verifiable project records and delivery proof for every client engagement." },
            { icon: "◎", label: "Bug Bounty Hunters", desc: "Timestamp your exploit discoveries before disclosure to establish priority." },
            { icon: "▣", label: "Remote Teams", desc: "Lock shared agreements, scope documents, and deliverable records." },
            { icon: "◑", label: "Legal & Compliance", desc: "Create tamper-proof evidence trails for disputes, audits, and regulatory review." },
          ].map(function (item, i) {
            return (
              <div key={i} style={lp.usecaseCard}>
                <div style={lp.usecaseIcon}>{item.icon}</div>
                <div style={lp.usecaseLabel}>{item.label}</div>
                <p style={lp.usecaseDesc}>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section style={lp.cta}>
        <div style={lp.ctaInner}>
          <h2 style={lp.ctaTitle}>Start locking evidence<br /><span style={gradText}>on-chain today.</span></h2>
          <p style={lp.ctaSub}>Free to use. No account required. Connect your Sui wallet and create your first case in minutes.</p>
          <button style={lp.ctaBtn} onClick={onEnter}>Launch ProofLocker →</button>
        </div>
      </section>

      <footer style={lp.footer}>
        <div style={lp.navLogo}>
          <div style={lp.navLogoMark}>
            <span style={{ ...gradText, fontSize: "12px", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>PL</span>
          </div>
          <span style={lp.navLogoText}>ProofLocker</span>
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted }}>
          Built for the Tatum × Walrus Hackathon · Powered by Walrus, Sui & Tatum
        </div>
      </footer>
    </div>
  );
}

var lp = {
  wrap: { backgroundColor: C.dark, minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: C.text },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 64px", height: "68px", borderBottom: "1px solid " + C.border, position: "sticky", top: 0, backgroundColor: C.dark + "EE", backdropFilter: "blur(12px)", zIndex: 100 },
  navLogo: { display: "flex", alignItems: "center", gap: "10px" },
  navLogoMark: { width: "32px", height: "32px", borderRadius: "8px", border: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: C.surfaceAlt },
  navLogoText: { fontSize: "15px", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif" },
  navLinks: { display: "flex", alignItems: "center", gap: "32px" },
  navLink: { fontSize: "14px", color: C.textSub, textDecoration: "none", fontWeight: 500 },
  navCta: { padding: "9px 20px", borderRadius: "8px", border: "none", background: gradBg, color: "#fff", fontSize: "14px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  hero: { padding: "120px 64px 100px", maxWidth: "800px" },
  heroTag: { display: "inline-block", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", color: C.blue, border: "1px solid " + C.blue + "40", borderRadius: "100px", padding: "5px 16px", marginBottom: "28px", textTransform: "uppercase" },
  heroTitle: { fontSize: "72px", fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "24px" },
  heroSub: { fontSize: "18px", color: C.textSub, lineHeight: 1.7, marginBottom: "40px", maxWidth: "520px" },
  heroBtns: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" },
  heroPrimary: { padding: "14px 32px", borderRadius: "10px", border: "none", background: gradBg, color: "#fff", fontSize: "16px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  heroSecondary: { fontSize: "15px", color: C.textSub, textDecoration: "none", fontWeight: 500, borderBottom: "1px solid " + C.border, paddingBottom: "2px" },
  heroPills: { display: "flex", flexWrap: "wrap", gap: "8px" },
  pill: { fontSize: "12px", color: C.textMuted, border: "1px solid " + C.border, borderRadius: "100px", padding: "5px 14px", fontWeight: 500 },
  strip: { borderTop: "1px solid " + C.border, borderBottom: "1px solid " + C.border, padding: "14px 0", overflow: "hidden", backgroundColor: C.surface },
  stripInner: { display: "flex", whiteSpace: "nowrap" },
  stripText: { fontSize: "13px", color: C.textMuted, fontWeight: 600, letterSpacing: "1px", paddingRight: "8px" },
  section: { padding: "100px 64px", borderTop: "1px solid " + C.border },
  sectionTag: { fontSize: "11px", color: C.purple, fontWeight: 700, letterSpacing: "2px", marginBottom: "16px" },
  sectionTitle: { fontSize: "48px", fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: "56px" },
  steps: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" },
  step: { display: "flex", flexDirection: "column" },
  stepNum: { fontSize: "13px", fontWeight: 800, color: C.purple, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "12px", letterSpacing: "1px" },
  stepLine: { width: "32px", height: "3px", background: gradBg, borderRadius: "3px", marginBottom: "20px" },
  stepTitle: { fontSize: "16px", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "10px" },
  stepDesc: { fontSize: "14px", color: C.textSub, lineHeight: 1.7 },
  stackGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" },
  stackCard: { backgroundColor: C.surface, borderRadius: "16px", border: "1px solid " + C.border, padding: "32px", position: "relative", overflow: "hidden" },
  stackAccent: { position: "absolute", top: 0, left: 0, right: 0, height: "2px" },
  stackName: { fontSize: "20px", fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "4px" },
  stackRole: { fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "16px", textTransform: "uppercase" },
  stackDesc: { fontSize: "14px", color: C.textSub, lineHeight: 1.7 },
  usecaseGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  usecaseCard: { backgroundColor: C.surface, borderRadius: "14px", border: "1px solid " + C.border, padding: "28px" },
  usecaseIcon: { fontSize: "20px", color: C.purple, marginBottom: "14px" },
  usecaseLabel: { fontSize: "15px", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "8px" },
  usecaseDesc: { fontSize: "13px", color: C.textSub, lineHeight: 1.6 },
  cta: { borderTop: "1px solid " + C.border, padding: "120px 64px", textAlign: "center" },
  ctaInner: { maxWidth: "600px", margin: "0 auto" },
  ctaTitle: { fontSize: "52px", fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1, letterSpacing: "-1px", marginBottom: "20px" },
  ctaSub: { fontSize: "16px", color: C.textSub, lineHeight: 1.7, marginBottom: "36px" },
  ctaBtn: { padding: "16px 40px", borderRadius: "12px", border: "none", background: gradBg, color: "#fff", fontSize: "17px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  footer: { borderTop: "1px solid " + C.border, padding: "32px 64px", display: "flex", justifyContent: "space-between", alignItems: "center" },
};

// ─── APP (Sidebar lives inside so it shares state directly) ───────────────────

function App() {
  var [landing, setLanding] = useState(true);
  var [walletAddress, setWalletAddress] = useState(null);
  var [view, setView] = useState("home");
  var [activeCase, setActiveCase] = useState(null);
  var [collapsed, setCollapsed] = useState(false);
var storageKey = "prooflocker_cases_" + (walletAddress || "guest");

var [cases, setCases] = useState([]);
useEffect(function () {
  var key = "prooflocker_cases_" + (walletAddress || "guest");
  var stored = JSON.parse(localStorage.getItem(key) || "[]");
  setCases(stored);
}, [walletAddress]);

  var currentAccount = useCurrentAccount();
  var { mutate: disconnectWallet } = useDisconnectWallet();
  useEffect(() => {
    if (currentAccount && currentAccount.address) {
      setWalletAddress(currentAccount.address);
    } else {
      setWalletAddress(null);
    }
  }, [currentAccount]);

useEffect(function () {
  var params = new URLSearchParams(window.location.search);
  var manifestBlobId = params.get("manifest");
  if (!manifestBlobId) return;

  setLanding(false);
  setView("loading");

  fetch("https://aggregator.walrus-testnet.walrus.space/v1/blobs/" + manifestBlobId)
    .then(function (res) { return res.json(); })
    .then(function (manifest) {
      var caseData = {
        id: manifest.caseId,
        title: manifest.title,
        description: manifest.description,
        category: manifest.category,
        owner: manifest.owner,
        createdAt: manifest.createdAt,
        status: manifest.status,
        txDigest: manifest.txDigest,
        manifestBlobId: manifestBlobId,
        files: manifest.files || [],
      };
      setActiveCase(caseData);
      setView("timeline");
    })
    .catch(function (err) {
      console.error("Failed to load manifest:", err);
      setView("home");
    });
}, []);
  function handleCaseCreated(caseData) {
    var updated = [...cases, caseData];
    setCases(updated);
    setActiveCase(caseData);
    setView("upload");
  }

  function handleEvidenceUploaded() {
    var updated = JSON.parse(localStorage.getItem("prooflocker_cases_" + walletAddress) || "[]");
    var found = updated.find(function (c) { return c.id === activeCase.id; });
    if (found) setActiveCase(found);
    setCases(updated);
    setView("timeline");
  }

  function handleDisconnectWallet() {
    disconnectWallet();
    setWalletAddress(null);
    setActiveCase(null);
    setView("home");
  }

  function goToLanding() {
    setLanding(true);
    setView("home");
  }

  if (landing) {
    return <LandingPage onEnter={function () { setLanding(false); }} />;
  }

  var sidebarWidth = collapsed ? "64px" : "260px";

  var nav = [
    { id: "home", label: "Dashboard", symbol: "◈" },
    { id: "create", label: "New Case", symbol: "+" },
    { id: "verify", label: "Verify File", symbol: "✦" },
  ];

  function Sidebar() {
    return (
      <div style={{ ...sb.wrap, width: sidebarWidth }}>
        <div style={sb.logoRow}>
          {!collapsed && (
            <div style={sb.logo} onClick={goToLanding}>
              <div style={sb.logoMark}>
                <span style={{ ...gradText, fontSize: "12px", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>PL</span>
              </div>
              <div style={sb.logoName}>ProofLocker</div>
            </div>
          )}
          <button style={sb.collapseBtn} onClick={function () { setCollapsed(!collapsed); }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <div style={sb.navSection}>
          {!collapsed && <div style={sb.navLabel}>MENU</div>}
          {nav.map(function (item) {
            var active = view === item.id;
            return (
              <button
                key={item.id}
                style={{ ...sb.navBtn, ...(active ? sb.navBtnActive : {}), justifyContent: collapsed ? "center" : "flex-start" }}
                onClick={function () { setView(item.id); }}
                title={item.label}
              >
                <span style={{ ...sb.navSymbol, color: active ? C.purple : C.textMuted }}>{item.symbol}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && <div style={sb.activePip} />}
              </button>
            );
          })}
        </div>

        {!collapsed && cases.length > 0 && (
          <div style={sb.navSection}>
            <div style={sb.navLabel}>CASES</div>
            {cases.slice(0, 4).map(function (c, i) {
              return (
                <button key={i} style={sb.caseBtn} onClick={function () { setActiveCase(cases[i]); setView("timeline"); }}>
                  <div style={sb.caseLine} />
                  <span style={sb.caseLabel}>{c.title}</span>
                </button>
              );
            })}
          </div>
        )}

        <div style={{ ...sb.bottom, padding: collapsed ? "16px 8px" : "20px" }}>
          {!collapsed && (
            !walletAddress ? (
              <div className="prooflocker-connect-wallet" style={sb.connectWrap}>
                <ConnectButton />
              </div>
            ) : (
              <div style={sb.connectedWrap}>
                <div style={sb.connected}>
                  <div style={sb.connectedDot} />
                  <span style={sb.connectedAddr}>{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</span>
                </div>
                <button style={sb.disconnectBtn} onClick={handleDisconnectWallet}>
                  Disconnect Wallet
                </button>
              </div>
            )
          )}
          {collapsed && (
            <div style={{ textAlign: "center", color: walletAddress ? "#00D395" : C.textMuted, fontSize: "16px" }}>
              {walletAddress ? "●" : "○"}
            </div>
          )}
          {!collapsed && <p style={sb.sidebarFooter}>Walrus · Sui · Tatum</p>}
        </div>
      </div>
    );
  }

      function ghostBtn(label, onClick, key) {
      return (
        <button
          key={key}
          style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid " + C.border, backgroundColor: "transparent", color: C.textSub, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          onClick={onClick}
        >
          {label}
        </button>
      );
    }

  function PageShell({ title, sub, onBack, backLabel, actions, children }) {
    return (
      <div style={ui.page}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
          <div>
            {onBack && (
              <button style={{ background: "none", border: "none", color: C.textMuted, fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }} onClick={onBack}>
                ← {backLabel || "Back"}
              </button>
            )}
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "6px", letterSpacing: "-0.5px" }}>{title}</h1>
            {sub && <p style={{ fontSize: "14px", color: C.textSub }}>{sub}</p>}
          </div>
          {actions && <div style={{ display: "flex", gap: "10px" }}>{actions}</div>}
        </div>
        {children}
      </div>
    );
  }

  function renderView() {
    if (view === "loading") {
  return (
    <div style={{ padding: "80px 56px", textAlign: "center" }}>
      <div style={{ fontSize: "24px", color: C.textSub, marginBottom: "12px" }}>◈</div>
      <div style={{ fontSize: "16px", color: C.textSub }}>Loading case from Walrus...</div>
    </div>
  );
}
    if (view === "create" && walletAddress) {
      return (
        <PageShell title="New Case" sub="Create a dispute record anchored on Sui" onBack={function () { setView("home"); }} backLabel="Dashboard">
          <CreateCase walletAddress={walletAddress} onCaseCreated={handleCaseCreated} />
        </PageShell>
      );
    }
    if (view === "upload" && activeCase) {
      return (
        <PageShell title="Upload Evidence" sub={activeCase.title} onBack={function () { setView("timeline"); }} backLabel="Skip to Timeline">
          <UploadEvidence caseData={activeCase} onEvidenceUploaded={handleEvidenceUploaded} />
        </PageShell>
      );
    }
    if (view === "timeline" && activeCase) {
      return (
        <PageShell
          title="Case Timeline" sub={activeCase.title}
          onBack={function () { setView("home"); }} backLabel="Dashboard"
              actions={[
        ghostBtn("+ Upload Evidence", function () { setView("upload"); }, "upload"),
        ghostBtn("Verify File", function () { setView("verify"); }, "verify"),
      ]}
        >
          <CaseTimeline caseData={activeCase} onVerify={function () { setView("verify"); }} />
        </PageShell>
      );
    }
    if (view === "verify") {
      return (
        <PageShell
          title="Verify File" sub="Check if a file matches evidence stored on Walrus"
          onBack={function () { setView(activeCase ? "timeline" : "home"); }}
          backLabel={activeCase ? "Timeline" : "Dashboard"}
        >
          <VerifyFile caseData={activeCase} />
        </PageShell>
      );
    }
    return (
      <div style={ui.page}>
        <div style={ui.hero}>
          <div style={ui.heroTag}>Dispute Evidence · On-Chain</div>
          <h1 style={ui.heroTitle}>Every byte. <span style={gradText}>Provable.</span></h1>
          <p style={ui.heroSub}>Store dispute evidence on Walrus. Anchor proof on Sui. Verify file integrity cryptographically — forever.</p>
          {walletAddress ? (
            <button style={ui.heroCta} onClick={function () { setView("create"); }}>+ Create a Case</button>
          ) : (
            <div style={ui.heroHint}>Connect your wallet from the sidebar to get started.</div>
          )}
        </div>

        <div style={ui.statsGrid}>
          {[
            { label: "Total Cases", value: cases.length },
            { label: "Open Cases", value: cases.filter(function(c){ return c.status === "open"; }).length },
            { label: "Evidence Files", value: cases.reduce(function(s,c){ return s + c.files.length; }, 0) },
            { label: "Network", value: "Sui Testnet" },
          ].map(function (stat, i) {
            return (
              <div key={i} style={ui.statCard}>
                <div style={ui.statLabel}>{stat.label}</div>
                <div style={{ ...gradText, fontSize: "28px", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{stat.value}</div>
              </div>
            );
          })}
        </div>

        {cases.length > 0 && (
          <div style={ui.section}>
            <div style={ui.sectionHeader}>
              <h2 style={ui.sectionTitle}>Your Cases</h2>
              <button style={ui.sectionAction} onClick={function () { setView("create"); }}>+ New Case</button>
            </div>
            <div style={ui.caseGrid}>
              {cases.map(function (c, i) {
                return (
                  <div key={i} style={ui.caseCard}
                    onClick={function () { setActiveCase(c); setView("timeline"); }}
                    onMouseEnter={function (e) { e.currentTarget.style.borderColor = C.purple + "44"; }}
                    onMouseLeave={function (e) { e.currentTarget.style.borderColor = C.border; }}
                  >
                    <div style={ui.caseTop}>
                      <span style={ui.caseCat}>{c.category}</span>
                      <span style={ui.caseBadge}>{c.status}</span>
                    </div>
                    <h3 style={ui.caseTitle}>{c.title}</h3>
                    <p style={ui.caseDesc}>{c.description}</p>
                    <div style={ui.caseMeta}>
                      <span>{c.files.length} file{c.files.length !== 1 ? "s" : ""}</span>
                      <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div style={ui.caseBar}>
                      <div style={{ ...ui.caseBarFill, width: c.files.length > 0 ? "100%" : "15%" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <TatumStats walletAddress={walletAddress} cases={cases} />
          </div>
        )}

        {walletAddress && cases.length === 0 && (
          <div style={ui.empty}>
            <div style={ui.emptyGlyph}>◈</div>
            <h2 style={ui.emptyTitle}>No cases yet</h2>
            <p style={ui.emptySub}>Create your first case to start locking evidence on-chain.</p>
            <button style={ui.heroCta} onClick={function () { setView("create"); }}>Create a Case</button>
          </div>
        )}

        {!walletAddress && (
          <div style={ui.infoRow}>
            {[
              { label: "Walrus Storage", desc: "Files stored as immutable blobs with cryptographic IDs" },
              { label: "Sui Anchoring", desc: "Metadata anchored on-chain via Move smart contract" },
              { label: "Tatum RPC", desc: "Real-time Sui data via Tatum's node infrastructure" },
            ].map(function (item, i) {
              return (
                <div key={i} style={ui.infoCard}>
                  <div style={ui.infoLine} />
                  <div style={ui.infoLabel}>{item.label}</div>
                  <div style={ui.infoDesc}>{item.desc}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: C.dark, fontFamily: "'DM Sans', sans-serif", color: C.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080810; }
        input, button, select, textarea { font-family: 'DM Sans', sans-serif; }
        input::placeholder { color: #44445A; }
        input:focus { outline: none; border-color: #7B61FF !important; box-shadow: 0 0 0 2px #7B61FF22; }
        .prooflocker-connect-wallet button {
          width: 100% !important;
          min-height: 40px !important;
          padding: 10px 14px !important;
          border-radius: 8px !important;
          border: none !important;
          background: ${gradBg} !important;
          color: #fff !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
          cursor: pointer !important;
          font-family: 'DM Sans', sans-serif !important;
          box-shadow: none !important;
          letter-spacing: 0.2px !important;
          transition: opacity 0.15s ease, transform 0.15s ease !important;
        }
        .prooflocker-connect-wallet button:hover {
          opacity: 0.88 !important;
          transform: translateY(-1px) !important;
        }
        .prooflocker-connect-wallet button:active {
          transform: translateY(0) !important;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1E1E30; border-radius: 4px; }
      `}</style>
      <Sidebar />
      <div key={view} className="rise" style={{ marginLeft: sidebarWidth, flex: 1, minHeight: "100vh", transition: "margin-left 0.25s ease" }}>
  {renderView()}
      </div>
    </div>
  );
}

var sb = {
  wrap: { minHeight: "100vh", backgroundColor: C.surface, borderRight: "1px solid " + C.border, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, transition: "width 0.25s ease", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" },
  logoRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 16px", borderBottom: "1px solid " + C.border, minHeight: "68px" },
  logo: { display: "flex", alignItems: "center", gap: "10px", overflow: "hidden", cursor: "pointer" },
  logoMark: { width: "32px", height: "32px", borderRadius: "8px", border: "1px solid " + C.border, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: C.surfaceAlt, flexShrink: 0 },
  logoName: { fontSize: "15px", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif", whiteSpace: "nowrap" },
  collapseBtn: { width: "28px", height: "28px", borderRadius: "6px", border: "1px solid " + C.border, backgroundColor: C.surfaceAlt, color: C.textMuted, fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'DM Sans', sans-serif" },
  navSection: { padding: "16px 10px 8px" },
  navLabel: { fontSize: "10px", color: C.textMuted, fontWeight: 700, letterSpacing: "1.5px", padding: "0 6px", marginBottom: "8px", whiteSpace: "nowrap" },
  navBtn: { display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 10px", borderRadius: "8px", border: "none", backgroundColor: "transparent", color: C.textSub, fontSize: "14px", fontWeight: 500, cursor: "pointer", textAlign: "left", marginBottom: "2px", position: "relative", whiteSpace: "nowrap" },
  navBtnActive: { backgroundColor: C.purple + "14", color: C.text },
  navSymbol: { fontSize: "13px", width: "18px", textAlign: "center", flexShrink: 0 },
  activePip: { position: "absolute", right: "10px", width: "5px", height: "5px", borderRadius: "50%", backgroundColor: C.purple },
  caseBtn: { display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "7px 10px", borderRadius: "6px", border: "none", backgroundColor: "transparent", color: C.textMuted, fontSize: "12px", cursor: "pointer", textAlign: "left", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden" },
  caseLine: { width: "2px", height: "14px", borderRadius: "2px", background: gradBg, flexShrink: 0 },
  caseLabel: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 },
  bottom: { marginTop: "auto", borderTop: "1px solid " + C.border },
  connectWrap: { width: "100%", marginBottom: "8px" },
  connectedWrap: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" },
  connected: { display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", backgroundColor: C.surfaceAlt, border: "1px solid " + C.border },
  connectedDot: { width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#00D395", flexShrink: 0, boxShadow: "0 0 6px #00D39566" },
  connectedAddr: { fontSize: "12px", color: C.textSub, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  disconnectBtn: { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid " + C.border, backgroundColor: "transparent", color: C.textSub, fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  sidebarFooter: { fontSize: "11px", color: C.textMuted, textAlign: "center", marginTop: "8px" },
};

var ui = {
  page: { padding: "56px 56px 80px", maxWidth: "960px" },
  hero: { marginBottom: "48px" },
  heroTag: { display: "inline-block", fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px", color: C.blue, border: "1px solid " + C.blue + "40", borderRadius: "100px", padding: "4px 14px", marginBottom: "20px", textTransform: "uppercase" },
  heroTitle: { fontSize: "52px", fontWeight: 800, color: C.text, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1, marginBottom: "18px", letterSpacing: "-1px" },
  heroSub: { fontSize: "16px", color: C.textSub, lineHeight: 1.7, marginBottom: "28px", maxWidth: "480px" },
  heroCta: { padding: "13px 28px", borderRadius: "10px", border: "none", background: gradBg, color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  heroHint: { fontSize: "14px", color: C.textMuted, fontStyle: "italic" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "48px" },
  statCard: { backgroundColor: C.surface, borderRadius: "12px", border: "1px solid " + C.border, padding: "20px" },
  statLabel: { fontSize: "10px", color: C.textMuted, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" },
  section: { marginBottom: "40px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  sectionTitle: { fontSize: "17px", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif" },
  sectionAction: { padding: "8px 16px", borderRadius: "8px", border: "1px solid " + C.border, backgroundColor: "transparent", color: C.textSub, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  caseGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" },
  caseCard: { backgroundColor: C.surface, borderRadius: "14px", border: "1px solid " + C.border, padding: "24px", cursor: "pointer", transition: "border-color 0.2s" },
  caseTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  caseCat: { fontSize: "10px", color: C.blue, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" },
  caseBadge: { fontSize: "10px", color: C.purple, fontWeight: 700, backgroundColor: C.purple + "14", padding: "3px 10px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.5px" },
  caseTitle: { fontSize: "15px", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "8px", lineHeight: 1.3 },
  caseDesc: { fontSize: "13px", color: C.textSub, lineHeight: 1.6, marginBottom: "18px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  caseMeta: { display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.textMuted, marginBottom: "12px" },
  caseBar: { height: "2px", backgroundColor: C.border, borderRadius: "2px", overflow: "hidden" },
  caseBarFill: { height: "100%", background: gradBg, borderRadius: "2px", transition: "width 0.6s ease" },
  empty: { textAlign: "center", padding: "72px 40px", backgroundColor: C.surface, borderRadius: "16px", border: "1px solid " + C.border },
  emptyGlyph: { fontSize: "32px", color: C.purple, marginBottom: "14px" },
  emptyTitle: { fontSize: "20px", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "10px" },
  emptySub: { fontSize: "14px", color: C.textSub, marginBottom: "24px", lineHeight: 1.6 },
  infoRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginTop: "16px" },
  infoCard: { backgroundColor: C.surface, borderRadius: "12px", border: "1px solid " + C.border, padding: "24px" },
  infoLine: { width: "32px", height: "3px", background: gradBg, borderRadius: "3px", marginBottom: "14px" },
  infoLabel: { fontSize: "14px", fontWeight: 700, color: C.text, fontFamily: "'Space Grotesk', sans-serif", marginBottom: "8px" },
  infoDesc: { fontSize: "13px", color: C.textSub, lineHeight: 1.6 },
};

export default App;