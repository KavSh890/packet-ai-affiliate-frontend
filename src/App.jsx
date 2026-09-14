import { useState, useEffect } from "react";

const LOGO_SRC = "https://cdn.prod.website-files.com/6a0ebbf86e014c66a215ddd9/6a3a22ad836542601eb71691_packet-ai-logo-v3-transparent.png";

// ── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK = {
  name: "Rohan Mehta", code: "rohanm",
  cumulativeConversions: 8, clicks: 1243, conversions: 8,
  pendingEarnings: 340, totalEarned: 1120,
  payoutMethod: "Wise", payoutEmail: "rohan@example.com",
  log: [
    { date: "Sep 5, 2026",  product: "A100 Dedicated", invoice: 2400, commission: 120, status: "pending", paysOn: "Oct 5" },
    { date: "Aug 22, 2026", product: "L40S Reserved",   invoice: 1800, commission: 90,  status: "pending", paysOn: "Sep 22" },
    { date: "Aug 15, 2026", product: "B200 Dedicated",  invoice: 4800, commission: 240, status: "paid",    paysOn: null },
    { date: "Jul 30, 2026", product: "A100 Dedicated",  invoice: 2400, commission: 120, status: "paid",    paysOn: null },
    { date: "Jul 12, 2026", product: "L40S Reserved",   invoice: 1800, commission: 90,  status: "paid",    paysOn: null },
  ],
};

// ── THEME ─────────────────────────────────────────────────────────────────────
const getTheme = (dark) => ({
  dark,
  bg:          dark ? "#0A0E14"                   : "#FFFFFF",
  bg2:         dark ? "#0F1923"                   : "#F8FAFC",
  card:        dark ? "#131D2A"                   : "#FFFFFF",
  teal:        dark ? "#2DD4BF"                   : "#0D9488",
  tealHover:   dark ? "rgba(45,212,191,0.1)"      : "rgba(13,148,136,0.08)",
  tealBorder:  dark ? "rgba(45,212,191,0.25)"     : "rgba(13,148,136,0.3)",
  green:       dark ? "#22C55E"                   : "#16A34A",
  greenHover:  dark ? "rgba(34,197,94,0.09)"      : "rgba(22,163,74,0.08)",
  greenBorder: dark ? "rgba(34,197,94,0.25)"      : "rgba(22,163,74,0.28)",
  muted:       dark ? "#4B5563"                   : "#9CA3AF",
  dim:         dark ? "#9CA3AF"                   : "#374151",
  text:        dark ? "#FFFFFF"                   : "#0F172A",
  bdr:         dark ? "rgba(255,255,255,0.07)"    : "rgba(0,0,0,0.08)",
  navBg:       dark ? "rgba(10,14,20,0.88)"       : "rgba(255,255,255,0.88)",
  cardShadow:  dark ? "none"                      : "0 1px 4px rgba(0,0,0,0.07)",
  logoFilter:  dark ? "brightness(0) invert(1)"   : "none",
  font: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
});

// ── SHARED ────────────────────────────────────────────────────────────────────
const pillBtn = (active, theme, extra = {}) => ({
  fontFamily: theme.font, fontWeight: 700, fontSize: 15,
  cursor: "pointer", border: "none", borderRadius: 980,
  padding: "13px 28px",
  ...(active
    ? { background: theme.teal, color: theme.dark ? "#0A0E14" : "#FFFFFF" }
    : { background: theme.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
        border:     `1px solid ${theme.bdr}`,
        color:      theme.dim }),
  ...extra,
});

const inputStyle = (theme, hasError) => ({
  width: "100%", background: theme.dark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
  border: `1px solid ${hasError ? "#EF4444" : theme.bdr}`,
  borderRadius: 10, padding: "13px 16px", color: theme.text,
  fontSize: 14, fontFamily: theme.font, outline: "none", boxSizing: "border-box",
});

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav({ setView, theme, isDark, toggleTheme, scrolled }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? theme.navBg : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${theme.bdr}` : "none",
      transition: "all 0.3s ease",
      padding: "0 48px", height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div onClick={() => setView("landing")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <img src={LOGO_SRC} alt="packet.ai"
          style={{ height: 34, filter: theme.logoFilter, objectFit: "contain", transition: "filter 0.3s" }} />
        <span style={{
          fontSize: 11, color: theme.muted, fontFamily: theme.font,
          borderLeft: `1px solid ${theme.bdr}`, paddingLeft: 10, lineHeight: 1.3,
        }}>
          Affiliates
        </span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          background: theme.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          border: `1px solid ${theme.bdr}`, borderRadius: 8,
          width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", fontSize: 15, transition: "all 0.2s",
        }}>{isDark ? "☀" : "☽"}</button>
        <button onClick={() => setView("portal")} style={{
          background: "transparent", border: "none", color: theme.dim,
          fontFamily: theme.font, fontSize: 14, cursor: "pointer", padding: "8px 10px",
        }}>
          Portal login
        </button>
        <button onClick={() => setView("apply")} style={pillBtn(true, theme, { fontSize: 14, padding: "10px 22px" })}>
          Apply now
        </button>
      </div>
    </nav>
  );
}

// ── CALCULATOR ────────────────────────────────────────────────────────────────
function Calculator({ theme }) {
  const [refs, setRefs] = useState(5);
  const [deal, setDeal] = useState(2400);
  const rate    = refs >= 25 ? 0.10 : 0.05;
  const monthly = refs * deal * rate;

  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {[
          { label: "Monthly conversions", min: 1, max: 50, step: 1, val: refs, set: setRefs,
            display: refs, note: refs >= 25 ? "10% Growth tier active" : `${25 - refs} more to unlock 10%` },
          { label: "Avg. first invoice (USD)", min: 500, max: 10000, step: 100, val: deal, set: setDeal,
            display: `$${deal.toLocaleString()}`, note: "dedicated instances start at $2,400/mo" },
        ].map(s => (
          <div key={s.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 14, color: theme.dim, fontFamily: theme.font }}>{s.label}</span>
              <span style={{ fontSize: 14, color: theme.text, fontWeight: 700, fontFamily: theme.font }}>{s.display}</span>
            </div>
            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val}
              onChange={e => s.set(Number(e.target.value))}
              style={{ width: "100%", accentColor: theme.teal, cursor: "pointer", height: 4 }} />
            <div style={{ fontSize: 11, color: theme.muted, marginTop: 6, fontFamily: theme.font }}>{s.note}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 40, paddingTop: 32, borderTop: `1px solid ${theme.bdr}`,
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
      }}>
        <div>
          <div style={{ fontSize: 12, color: theme.muted, fontFamily: theme.font, marginBottom: 6 }}>Monthly earnings</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: theme.teal, letterSpacing: "-2px", lineHeight: 1, fontFamily: theme.font }}>
            ${Math.round(monthly).toLocaleString()}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.muted, fontFamily: theme.font, marginBottom: 6 }}>Annual earnings</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: theme.text, letterSpacing: "-2px", lineHeight: 1, fontFamily: theme.font }}>
            ${Math.round(monthly * 12).toLocaleString()}
          </div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: refs >= 25 ? theme.tealHover : (theme.dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
            border: `1px solid ${refs >= 25 ? theme.tealBorder : theme.bdr}`,
            borderRadius: 100, padding: "6px 14px",
            fontSize: 12, color: refs >= 25 ? theme.teal : theme.dim, fontFamily: theme.font,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: refs >= 25 ? theme.teal : theme.muted, display: "inline-block" }} />
            {rate * 100}% commission rate{refs >= 25 ? " (Growth tier)" : " (Standard)"}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LANDING ───────────────────────────────────────────────────────────────────
function Landing({ setView, theme }) {
  const [openFaq, setOpenFaq] = useState(null);

  const [openModal, setOpenModal] = useState(null);

  const TERMS_SECTIONS = [
    { h: "Commission rate", b: "Approved affiliates earn 5% of the first paid invoice for each referred customer. After 25 lifetime conversions, the rate increases to 10% on all subsequent commissions. The upgrade is automatic." },
    { h: "Attribution window", b: "A 30-day cookie is set when a visitor clicks your affiliate link. If they purchase within 30 days on any device that retains the cookie, the conversion is credited to you. Last-click attribution applies." },
    { h: "What qualifies", b: "Commission is earned on the first paid invoice for dedicated GPU instances and reserved plans. On-demand and hourly usage does not qualify. Enterprise deals invoiced manually outside Stripe do not qualify." },
    { h: "Payout schedule", b: "Commissions are paid monthly on a net-30 basis. 30 days must pass after the qualifying invoice before the commission is eligible. Payouts run at end of each calendar month. Your balance must reach $50 before a transfer is triggered. Balances below this roll to the next month." },
    { h: "Payout methods", b: "Payouts are sent via Wise or PayPal to the email address on file. It is your responsibility to keep this current. packet.ai is not liable for misdirected funds from incorrect payout details." },
    { h: "Prohibited activity", b: "Self-referrals are not permitted. Paid search on packet.ai branded terms, cookie stuffing, incentivised clicks, or any deceptive traffic method will result in immediate termination and forfeiture of pending commissions." },
    { h: "Refunds and chargebacks", b: "If a qualifying invoice is refunded or charged back within 60 days, the associated commission is reversed. If already paid out, the amount is deducted from your next payout." },
    { h: "Program changes", b: "packet.ai reserves the right to modify commission rates and terms at any time with 30 days notice. We reserve the right to terminate any affiliate account. Earned commissions through the termination date will be paid on schedule." },
  ];

  const PRIVACY_SECTIONS = [
    { h: "What we collect", b: "When you apply, we collect your name, email, website or channel URL, audience information, and payout details. When visitors click your affiliate link, we record an anonymised click identifier, the landing page URL, and the referrer URL. We do not store personally identifiable information about visitors." },
    { h: "How we use your data", b: "Application data is used to evaluate and manage your affiliate account. Click and conversion data is used to calculate commissions and detect fraud. Payout details are used solely to process your payments." },
    { h: "Cookies", b: "When a visitor clicks an affiliate link, a first-party cookie is set for 30 days containing an anonymised identifier. No third-party tracking or cross-site data sharing is involved." },
    { h: "Data sharing", b: "We do not sell or share your personal data with third parties for marketing. Payout data is shared with Wise or PayPal only to process your payment. Stripe receives referral attribution as metadata on the customer record." },
    { h: "Data retention", b: "Affiliate account data is retained for the duration of your participation and for 2 years after termination. Click and conversion logs are retained for 2 years." },
    { h: "Your rights", b: "You may request access to, correction of, or deletion of your personal data at any time by emailing affiliates@packet.ai. Requests are honoured within 30 days, subject to legal retention requirements." },
    { h: "Contact", b: "For privacy questions, email affiliates@packet.ai." },
  ];

  const Modal = ({ id }) => {
    const isTerms  = id === "terms";
    const title    = isTerms ? "Affiliate Program Terms" : "Privacy Policy";
    const sections = isTerms ? TERMS_SECTIONS : PRIVACY_SECTIONS;
    return (
      <div onClick={() => setOpenModal(null)} style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          background: theme.card, border: `1px solid ${theme.bdr}`,
          borderRadius: 18, maxWidth: 620, width: "100%",
          maxHeight: "80vh", overflowY: "auto",
          padding: "40px 44px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
          fontFamily: theme.font,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
            <h2 style={{ color: theme.text, fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>
              {title}
            </h2>
            <button onClick={() => setOpenModal(null)} style={{
              background: theme.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
              border: "none", borderRadius: 8, width: 32, height: 32,
              color: theme.dim, cursor: "pointer", fontSize: 20, lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, marginLeft: 16,
            }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {sections.map((s, i) => (
              <div key={i}>
                <div style={{ color: theme.text, fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{s.h}</div>
                <div style={{ color: theme.dim, fontSize: 14, lineHeight: 1.75 }}>{s.b}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1px solid ${theme.bdr}`, fontSize: 12, color: theme.muted }}>
            Last updated September 2026 · Hosted AI Inc. · affiliates@packet.ai
          </div>
        </div>
      </div>
    );
  };

  const faqs = [
    { q: "What counts as a conversion?",
      a: "A conversion is a customer who clicked your affiliate link, landed on packet.ai, and paid their first invoice within 30 days. On-demand and hourly usage does not qualify. Dedicated instances and reserved plans do." },
    { q: "When do I get paid?",
      a: "Monthly, net-30. Thirty days after the invoice clears, the commission becomes eligible. Payouts go out at the end of each month, once your balance has reached $50." },
    { q: "What is the $50 payout threshold?",
      a: "Your commissions accumulate in your affiliate balance. Once that balance hits $50, it is included in the next monthly payout batch. It is not a minimum payment we make to you — it is just the floor required to trigger a transfer. If your balance is $30, it rolls to the next month." },
    { q: "How does the Growth tier work?",
      a: "Once you accumulate 25 lifetime successful conversions, your commission rate upgrades to 10% automatically. All future commissions pay at the higher rate from that point on." },
    { q: "Can I refer myself?",
      a: "No. Self-referrals are detected automatically and reversed. Accounts sharing the same email or payment method as the affiliate are excluded from commission." },
    { q: "What if the customer gets a refund?",
      a: "If an invoice is refunded within 60 days, the tied commission is reversed. Already-paid commissions are netted against your next payout batch." },
    { q: "Does recurring revenue earn commission?",
      a: "No. Commission applies to the first invoice only. This keeps the program sustainable long-term and the 5% rate competitive." },
  ];

  const AudienceIcon = ({ type, color }) => {
    const s = { fill: "none", stroke: color, strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
    const icons = {
      youtube: (
        <svg width="22" height="22" viewBox="0 0 24 24" {...s}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="10,8.5 16,12 10,15.5" fill={color} stroke="none" />
        </svg>
      ),
      blog: (
        <svg width="22" height="22" viewBox="0 0 24 24" {...s}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      directory: (
        <svg width="22" height="22" viewBox="0 0 24 24" {...s}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      newsletter: (
        <svg width="22" height="22" viewBox="0 0 24 24" {...s}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <polyline points="2,4 12,13 22,4" />
        </svg>
      ),
      podcast: (
        <svg width="22" height="22" viewBox="0 0 24 24" {...s}>
          <rect x="9" y="2" width="6" height="11" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <line x1="8" y1="21" x2="16" y2="21" />
        </svg>
      ),
      launch: (
        <svg width="22" height="22" viewBox="0 0 24 24" {...s}>
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    };
    return icons[type] || null;
  };

  const audiences = [
    { type: "youtube",    label: "YouTubers",          desc: "GPU benchmarks, LLM tutorials, ML paper walkthroughs" },
    { type: "blog",       label: "Technical bloggers", desc: "Inference guides, GPU comparisons, fine-tuning breakdowns" },
    { type: "directory",  label: "Directory sites",    desc: "GPU cloud comparisons, AI tool listings, compute directories" },
    { type: "newsletter", label: "Newsletters",        desc: "ML papers weekly, AI roundups, developer digests" },
    { type: "podcast",    label: "Podcasters",         desc: "AI infrastructure, MLOps, and developer tooling shows" },
    { type: "launch",     label: "Launch platforms",   desc: "Microlaunch, Product Hunt, Fazier, and similar sites" },
  ];

  const cardStyle = {
    background: theme.card, border: `1px solid ${theme.bdr}`,
    borderRadius: 16, padding: "26px 24px",
    boxShadow: theme.cardShadow,
  };

  return (
    <div style={{ background: theme.bg, fontFamily: theme.font, overflowX: "hidden" }}>

      {/* HERO */}
      <div style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 48px 80px", textAlign: "center",
        background: theme.dark
          ? `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(45,212,191,0.08) 0%, transparent 70%), ${theme.bg}`
          : `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(13,148,136,0.06) 0%, transparent 70%), ${theme.bg}`,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: theme.tealHover, border: `1px solid ${theme.tealBorder}`,
          borderRadius: 100, padding: "7px 18px", marginBottom: 36,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: theme.teal, display: "inline-block" }} />
          <span style={{ fontSize: 13, color: theme.teal, fontWeight: 600 }}>Affiliate Program now open</span>
        </div>

        <h1 style={{
          fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 800, color: theme.text,
          margin: "0 0 24px", lineHeight: 1.0, letterSpacing: "-0.04em", maxWidth: 860,
        }}>
          Earn{" "}
          <span style={{ color: theme.teal }}>5%</span>
          {" "}on every GPU sale{" "}
          <br />
          you send our way.
        </h1>

        <p style={{ fontSize: 19, color: theme.dim, maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.65 }}>
          Share your affiliate link. When your audience buys GPU compute on packet.ai, you earn a cut of their first invoice. No cap. No fees.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <button onClick={() => setView("apply")} style={pillBtn(true, theme)}>Apply for free</button>
          <button onClick={() => setView("portal")} style={pillBtn(false, theme)}>I already have a link</button>
        </div>
        <div style={{ fontSize: 13, color: theme.muted }}>
          No platform fees · 30-day attribution · Paid via Wise or PayPal
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={{ borderTop: `1px solid ${theme.bdr}`, borderBottom: `1px solid ${theme.bdr}`, background: theme.bg, padding: "36px 48px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "clamp(36px, 7vw, 96px)", flexWrap: "wrap" }}>
          {[
            { v: "$2,400+",  l: "Average first invoice" },
            { v: "30 days",  l: "Attribution window" },
            { v: "5 to 10%", l: "Commission range" },
            { v: "Net-30",   l: "Payout schedule" },
            { v: "$50",      l: "Balance to trigger payout" },
          ].map(s => (
            <div key={s.l} style={{ textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: theme.text, letterSpacing: "-0.03em" }}>{s.v}</div>
              <div style={{ fontSize: 12, color: theme.muted, marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CALCULATOR + STEPS */}
      <div style={{
        padding: "120px 48px", maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start",
      }}>
        <div>
          <div style={{ fontSize: 13, color: theme.teal, fontWeight: 600, marginBottom: 20, letterSpacing: "0.05em" }}>
            EARNINGS CALCULATOR
          </div>
          <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 800, color: theme.text, margin: "0 0 20px", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            See exactly what you would earn.
          </h2>
          <p style={{ color: theme.dim, fontSize: 16, lineHeight: 1.7, margin: "0 0 40px" }}>
            A single A100 dedicated instance runs $2,400 per month. One conversion at 5% is $120. Ten is $1,200. The math compounds quickly.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {[
              { n: 1, title: "Apply and get your link",  desc: "Fill out a short application. We review manually. Approvals take 1 to 2 business days." },
              { n: 2, title: "Share it anywhere",        desc: "YouTube description, blog post, newsletter, listing. The 30-day cookie handles all the tracking." },
              { n: 3, title: "Get paid every month",    desc: "Commissions accumulate in your balance. Once you hit $50, payouts go out at month end via Wise or PayPal." },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                  background: theme.tealHover, border: `1px solid ${theme.tealBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, color: theme.teal,
                }}>{s.n}</div>
                <div>
                  <div style={{ color: theme.text, fontWeight: 600, fontSize: 15, marginBottom: 5 }}>{s.title}</div>
                  <div style={{ color: theme.muted, fontSize: 14, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Calculator theme={theme} />
      </div>

      {/* TIERS */}
      <div style={{ background: theme.bg2, padding: "100px 48px", borderTop: `1px solid ${theme.bdr}`, borderBottom: `1px solid ${theme.bdr}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: theme.text, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
            Two tiers. Both worth it.
          </h2>
          <p style={{ color: theme.dim, fontSize: 16, margin: "0 0 52px", lineHeight: 1.65 }}>
            Every affiliate starts at 5%. Reach 25 conversions and the rate moves to 10% automatically. No requests, no paperwork.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {[
              { name: "Standard", rate: "5%",  sub: "All approved affiliates",         featured: false,
                perks: ["5% of first invoice", "30-day attribution", "Monthly payouts", "Real-time dashboard"] },
              { name: "Growth",   rate: "10%", sub: "After 25 cumulative conversions", featured: true,
                perks: ["10% of first invoice", "30-day attribution", "Priority processing", "Real-time dashboard"] },
            ].map(tier => (
              <div key={tier.name} style={{
                background: tier.featured ? theme.tealHover : theme.card,
                border: `1px solid ${tier.featured ? theme.tealBorder : theme.bdr}`,
                borderRadius: 18, padding: "36px 32px", boxShadow: theme.cardShadow,
              }}>
                {tier.featured && (
                  <div style={{
                    display: "inline-block", background: theme.tealHover,
                    border: `1px solid ${theme.tealBorder}`,
                    borderRadius: 100, padding: "4px 12px",
                    fontSize: 11, color: theme.teal, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 16,
                  }}>GROWTH TIER</div>
                )}
                <div style={{ fontSize: 13, color: theme.muted, marginBottom: 6 }}>{tier.name}</div>
                <div style={{ fontSize: 64, fontWeight: 800, color: tier.featured ? theme.teal : theme.text, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>
                  {tier.rate}
                </div>
                <div style={{ fontSize: 13, color: theme.muted, marginBottom: 32 }}>{tier.sub}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {tier.perks.map(p => (
                    <div key={p} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ color: theme.green, fontSize: 14 }}>✓</span>
                      <span style={{ color: theme.dim, fontSize: 14 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHO */}
      <div style={{ padding: "100px 48px", maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: theme.text, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
          Who converts well.
        </h2>
        <p style={{ color: theme.dim, fontSize: 16, margin: "0 0 52px", lineHeight: 1.65, maxWidth: 540 }}>
          GPU decisions are not impulse buys. The affiliates who earn most have technical audiences who already understand what they are purchasing.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {audiences.map(a => (
            <div key={a.label} style={{
              ...cardStyle,
              display: "flex", flexDirection: "column", gap: 0,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, marginBottom: 18,
                background: theme.tealHover,
                border: `1px solid ${theme.tealBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <AudienceIcon type={a.type} color={theme.teal} />
              </div>
              <div style={{ color: theme.text, fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{a.label}</div>
              <div style={{ color: theme.muted, fontSize: 13, lineHeight: 1.6 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: theme.bg2, padding: "100px 48px", borderTop: `1px solid ${theme.bdr}`, borderBottom: `1px solid ${theme.bdr}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: theme.text, margin: "0 0 48px", letterSpacing: "-0.03em" }}>
            Common questions.
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                borderRadius: 12, overflow: "hidden",
                border: `1px solid ${openFaq === i ? theme.tealBorder : theme.bdr}`,
                background: openFaq === i ? theme.tealHover : "transparent",
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                  width: "100%", background: "transparent", border: "none",
                  padding: "20px 24px", textAlign: "left", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  fontFamily: theme.font,
                }}>
                  <span style={{ color: theme.text, fontSize: 15, fontWeight: 500 }}>{faq.q}</span>
                  <span style={{ color: theme.teal, fontSize: 22, lineHeight: 1, marginLeft: 20, flexShrink: 0 }}>
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 22px", color: theme.dim, fontSize: 14, lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{
        padding: "120px 48px", textAlign: "center",
        background: theme.dark
          ? `radial-gradient(ellipse 70% 50% at 50% 100%, rgba(45,212,191,0.07) 0%, transparent 70%)`
          : `radial-gradient(ellipse 70% 50% at 50% 100%, rgba(13,148,136,0.05) 0%, transparent 70%)`,
      }}>
        <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, color: theme.text, margin: "0 0 16px", letterSpacing: "-0.03em" }}>
          Ready to start earning?
        </h2>
        <p style={{ color: theme.dim, fontSize: 17, margin: "0 0 40px" }}>
          Applications are free. We reply within 1 to 2 business days.
        </p>
        <button onClick={() => setView("apply")} style={pillBtn(true, theme)}>Apply now</button>
        <div style={{ fontSize: 13, color: theme.muted, marginTop: 20 }}>
          Questions? Email affiliates@packet.ai
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${theme.bdr}`, padding: "28px 48px", background: theme.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <img src={LOGO_SRC} alt="packet.ai" style={{ height: 28, filter: theme.logoFilter, opacity: 0.6 }} />
          <div style={{ fontSize: 12, color: theme.muted }}>
            2026 Hosted AI Inc.
            <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
            <span onClick={() => setOpenModal("terms")}
              style={{ textDecoration: "underline", cursor: "pointer", color: theme.dim }}>
              Program Terms
            </span>
            <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
            <span onClick={() => setOpenModal("privacy")}
              style={{ textDecoration: "underline", cursor: "pointer", color: theme.dim }}>
              Privacy
            </span>
          </div>
        </div>
      </div>
      {openModal && <Modal id={openModal} />}
    </div>
  );
}

// ── APPLY ─────────────────────────────────────────────────────────────────────
function Apply({ setView, theme }) {
  const [form, setForm] = useState({ name:"", email:"", website:"", type:"", size:"", how:"", payoutMethod:"", payoutEmail:"" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = true;
    if (!form.email.trim())   e.email   = true;
    if (!form.website.trim()) e.website = true;
    if (!form.type)           e.type    = true;
    if (!form.how.trim())     e.how     = true;
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (!Object.keys(e).length) setDone(true);
  };

  const field = (key, label, placeholder, opts = {}) => (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: "flex", justifyContent: "space-between", color: theme.dim, fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
        <span>{label}</span>
        {errors[key] && <span style={{ color: "#EF4444", fontSize: 11, fontWeight: 400 }}>Required</span>}
      </label>
      {opts.textarea ? (
        <textarea value={form[key]} placeholder={placeholder}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          style={{ ...inputStyle(theme, errors[key]), minHeight: 100, resize: "vertical" }} />
      ) : opts.options ? (
        <select value={form[key]}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          style={{ ...inputStyle(theme, errors[key]), color: form[key] ? theme.text : theme.muted }}>
          <option value="" style={{ background: theme.bg }}>Select one</option>
          {opts.options.map(o => <option key={o.v} value={o.v} style={{ background: theme.bg }}>{o.l}</option>)}
        </select>
      ) : (
        <input type={opts.type || "text"} value={form[key]} placeholder={placeholder}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
          style={inputStyle(theme, errors[key])} />
      )}
    </div>
  );

  if (done) return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: theme.font, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", margin: "0 auto 28px",
          background: theme.tealHover, border: `2px solid ${theme.teal}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, color: theme.teal,
        }}>✓</div>
        <h2 style={{ color: theme.text, fontSize: 28, fontWeight: 800, margin: "0 0 14px", letterSpacing: "-0.03em" }}>
          Application received.
        </h2>
        <p style={{ color: theme.dim, fontSize: 15, lineHeight: 1.7, margin: "0 0 36px" }}>
          We review every application manually. Expect a reply within 1 to 2 business days at{" "}
          <span style={{ color: theme.text }}>{form.email}</span>.
        </p>
        <button onClick={() => setView("landing")} style={pillBtn(false, theme)}>Back to home</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: theme.font, padding: "100px 48px 80px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <button onClick={() => setView("landing")} style={{ background: "transparent", border: "none", color: theme.muted, cursor: "pointer", fontSize: 14, fontFamily: theme.font, padding: "0 0 32px" }}>
          Back
        </button>
        <img src={LOGO_SRC} alt="packet.ai" style={{ height: 30, filter: theme.logoFilter }} />
        <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.text, margin: "16px 0 12px", letterSpacing: "-0.03em" }}>
          Apply to the affiliate program
        </h1>
        <p style={{ color: theme.muted, fontSize: 14, margin: "0 0 40px", lineHeight: 1.7 }}>
          We look for technical audiences. Follower count matters less than whether your audience actually buys compute.
        </p>

        {field("name", "Full name", "Your name")}
        {field("email", "Email address", "you@example.com", { type: "email" })}
        {field("website", "Website or channel URL", "https://")}
        {field("type", "Audience type", "", { options: [
          { v: "youtube",    l: "YouTuber" },
          { v: "blog",       l: "Technical blogger" },
          { v: "directory",  l: "Directory or listing site" },
          { v: "newsletter", l: "Newsletter" },
          { v: "podcast",    l: "Podcaster" },
          { v: "other",      l: "Other" },
        ]})}
        {field("size", "Monthly audience size", "", { options: [
          { v: "u1k",      l: "Under 1,000" },
          { v: "1k-5k",    l: "1,000 to 5,000" },
          { v: "5k-20k",   l: "5,000 to 20,000" },
          { v: "20k-100k", l: "20,000 to 100,000" },
          { v: "100k+",    l: "100,000+" },
        ]})}
        {field("how", "How will you promote packet.ai?", "Video descriptions, benchmark articles, newsletter placements. Specifics help.", { textarea: true })}

        <div style={{ background: theme.card, border: `1px solid ${theme.bdr}`, borderRadius: 14, padding: "24px 26px", marginBottom: 26, boxShadow: theme.cardShadow }}>
          <div style={{ fontSize: 13, color: theme.text, fontWeight: 600, marginBottom: 20 }}>Payout details</div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", color: theme.dim, fontSize: 13, fontWeight: 500, marginBottom: 10 }}>
              Preferred payout method
            </label>
            <div style={{ display: "flex", gap: 10 }}>
              {["Wise", "PayPal"].map(m => (
                <button key={m} onClick={() => setForm({ ...form, payoutMethod: m })} style={{
                  flex: 1, fontFamily: theme.font, fontSize: 14, fontWeight: 500, cursor: "pointer", borderRadius: 10,
                  padding: "11px 16px",
                  border: `1px solid ${form.payoutMethod === m ? theme.tealBorder : theme.bdr}`,
                  background: form.payoutMethod === m ? theme.tealHover : "transparent",
                  color: form.payoutMethod === m ? theme.teal : theme.muted,
                }}>{m}</button>
              ))}
            </div>
          </div>
          <label style={{ display: "block", color: theme.dim, fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Payout email</label>
          <input type="email" value={form.payoutEmail} placeholder="Your Wise or PayPal email"
            onChange={e => setForm({ ...form, payoutEmail: e.target.value })} style={inputStyle(theme, false)} />
        </div>

        <button onClick={submit} style={{ ...pillBtn(true, theme), width: "100%", fontSize: 15, padding: "16px", borderRadius: 12 }}>
          Submit application
        </button>
        <div style={{ fontSize: 12, color: theme.muted, textAlign: "center", marginTop: 14 }}>
          By applying you agree to the affiliate program terms
        </div>
      </div>
    </div>
  );
}

// ── PORTAL ────────────────────────────────────────────────────────────────────
function Portal({ setView, theme }) {
  const [copied, setCopied] = useState(false);
  const link = `https://packet.ai?via=${MOCK.code}`;

  const copy = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pct = (MOCK.cumulativeConversions / 25) * 100;

  const stats = [
    { l: "Total clicks",    v: MOCK.clicks.toLocaleString(),            s: "all time" },
    { l: "Conversions",     v: MOCK.conversions,                        s: "paid first invoices" },
    { l: "Pending payout",  v: `$${MOCK.pendingEarnings}`,              s: "releases Oct 1",   col: theme.teal },
    { l: "Total earned",    v: `$${MOCK.totalEarned.toLocaleString()}`,  s: "lifetime",         col: theme.green },
  ];

  const rowBg = (i) => theme.dark ? "transparent" : (i % 2 === 0 ? "#FAFAFA" : "#FFFFFF");

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, fontFamily: theme.font }}>
      <div style={{
        borderBottom: `1px solid ${theme.bdr}`, padding: "16px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10, position: "sticky", top: 0,
        background: theme.navBg, backdropFilter: "blur(20px)", zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src={LOGO_SRC} alt="packet.ai" style={{ height: 28, filter: theme.logoFilter }} />
          <div style={{ width: 1, height: 20, background: theme.bdr }} />
          <div>
            <div style={{ color: theme.text, fontWeight: 600, fontSize: 14 }}>Welcome back, {MOCK.name}</div>
            <div style={{ color: theme.muted, fontSize: 11, marginTop: 1 }}>Affiliate dashboard</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ background: theme.tealHover, border: `1px solid ${theme.tealBorder}`, borderRadius: 100, padding: "5px 14px", fontSize: 12, color: theme.teal, fontWeight: 600 }}>
            Standard · 5%
          </div>
          <button onClick={() => setView("landing")} style={{ ...pillBtn(false, theme), fontSize: 13, padding: "8px 16px" }}>
            Program home
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 48px" }}>

        {/* Affiliate link */}
        <div style={{
          background: theme.card, border: `1px solid ${theme.bdr}`, borderRadius: 16,
          padding: "24px 28px", marginBottom: 16, boxShadow: theme.cardShadow,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: 11, color: theme.muted, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Your affiliate link
            </div>
            <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", color: theme.teal, fontSize: 16, wordBreak: "break-all" }}>
              {link}
            </div>
          </div>
          <button onClick={copy} style={{
            ...pillBtn(copied ? false : true, theme, { fontSize: 14, padding: "11px 22px", flexShrink: 0 }),
            ...(copied && { borderColor: theme.green, color: theme.green, background: theme.greenHover }),
          }}>
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        {/* Tier progress */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bdr}`, borderRadius: 16, padding: "22px 28px", marginBottom: 20, boxShadow: theme.cardShadow }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: theme.text, fontWeight: 500 }}>Growth tier progress</span>
            <span style={{ fontSize: 13, color: theme.muted }}>{MOCK.cumulativeConversions} of 25 conversions</span>
          </div>
          <div style={{ background: theme.dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderRadius: 100, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, background: `linear-gradient(90deg, rgba(45,212,191,0.7) 0%, ${theme.teal} 100%)`, height: "100%", borderRadius: 100 }} />
          </div>
          <div style={{ fontSize: 12, color: theme.muted, marginTop: 8 }}>
            {25 - MOCK.cumulativeConversions} more conversions to unlock the 10% Growth tier
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          {stats.map(s => (
            <div key={s.l} style={{ background: theme.card, border: `1px solid ${theme.bdr}`, borderRadius: 16, padding: "22px 20px", boxShadow: theme.cardShadow }}>
              <div style={{ fontSize: 11, color: theme.muted, fontWeight: 500, marginBottom: 10 }}>{s.l}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.col || theme.text, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: theme.muted, marginTop: 8 }}>{s.s}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 16 }}>Conversion history</div>
          <div style={{ background: theme.card, border: `1px solid ${theme.bdr}`, borderRadius: 16, overflow: "hidden", boxShadow: theme.cardShadow }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.bdr}`, background: theme.dark ? "transparent" : "#F8FAFC" }}>
                  {["Date", "Product", "Invoice", "Commission", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "14px 22px", color: theme.muted, fontWeight: 500, fontSize: 12, letterSpacing: "0.04em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK.log.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < MOCK.log.length - 1 ? `1px solid ${theme.bdr}` : "none", background: rowBg(i) }}>
                    <td style={{ padding: "16px 22px", color: theme.muted, fontSize: 13 }}>{row.date}</td>
                    <td style={{ padding: "16px 22px", color: theme.text, fontWeight: 500 }}>{row.product}</td>
                    <td style={{ padding: "16px 22px", color: theme.text }}>${row.invoice.toLocaleString()}</td>
                    <td style={{ padding: "16px 22px", color: theme.teal, fontWeight: 700 }}>${row.commission}</td>
                    <td style={{ padding: "16px 22px" }}>
                      <span style={{
                        background: row.status === "paid" ? theme.greenHover  : theme.tealHover,
                        color:      row.status === "paid" ? theme.green        : theme.teal,
                        border:    `1px solid ${row.status === "paid" ? theme.greenBorder : theme.tealBorder}`,
                        borderRadius: 100, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                      }}>
                        {row.status === "paid" ? "Paid" : `Pending · ${row.paysOn}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout settings */}
        <div style={{ background: theme.card, border: `1px solid ${theme.bdr}`, borderRadius: 16, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, boxShadow: theme.cardShadow }}>
          <div>
            <div style={{ fontSize: 14, color: theme.text, fontWeight: 500 }}>Payout settings</div>
            <div style={{ fontSize: 13, color: theme.muted, marginTop: 5 }}>
              {MOCK.payoutMethod} · {MOCK.payoutEmail} · Net-30 · pays out when balance hits $50
            </div>
          </div>
          <button style={{ ...pillBtn(false, theme), fontSize: 13, padding: "9px 18px" }}>Update</button>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]       = useState("landing");
  const [isDark, setIsDark]   = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const theme = getTheme(isDark);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, transition: "background 0.3s" }}>
      {view !== "portal" && (
        <Nav
          setView={setView} theme={theme} isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)} scrolled={scrolled}
        />
      )}
      {view === "landing" && <Landing setView={setView} theme={theme} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />}
      {view === "apply"   && <Apply   setView={setView} theme={theme} />}
      {view === "portal"  && <Portal  setView={setView} theme={theme} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />}
    </div>
  );
}
