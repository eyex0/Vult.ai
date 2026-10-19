import { useEffect, useState } from "react";
import {
  ArrowRight, BarChart3, Bot, Building2, Check, ChevronDown, ChevronRight, CircleDot,
  Database, GitBranch, Mail, Menu, Search, Sparkles, Users, Workflow, X, Zap
} from "lucide-react";
import "./landing.css";

export function VultLogo({ size = 26, white = false }: { size?: number; white?: boolean }) {
  return <img src={white ? "/brand/vult-logo-white.png" : "/brand/vult-logo-black.png"} alt="" width={size} height={size} className="vl-logo-img" />;
}

export function Wordmark({ white = false }: { white?: boolean }) {
  return <a href="/" className={"vl-wordmark" + (white ? " white" : "")} aria-label="Vult home"><VultLogo white={white} /><span>vult</span></a>;
}

const navItems = [
  { label: "Platform", menu: [["Data model", "Build objects that fit your business", Database], ["AI agents", "Research, enrich and follow up automatically", Bot], ["Workflows", "Automate any process end to end", Workflow], ["Reporting", "Real-time insight into pipeline", BarChart3]] },
  { label: "Resources", menu: [["Guides", "Playbooks for modern revenue teams", Sparkles], ["Changelog", "Everything we shipped recently", GitBranch], ["Help center", "Answers and walkthroughs", CircleDot]] },
] as const;

const records = [
  { name: "Northwind Labs", domain: "northwind.io", stage: "Qualified", value: "€48,000", owner: "AR", color: "#5b7cfa" },
  { name: "Helio Systems", domain: "helio.dev", stage: "Proposal", value: "€126,500", owner: "MD", color: "#f0a03c" },
  { name: "Orbit Freight", domain: "orbitfreight.com", stage: "Negotiation", value: "€72,000", owner: "LS", color: "#2fb27a" },
  { name: "Quanta Studio", domain: "quanta.studio", stage: "Lead", value: "€18,900", owner: "DF", color: "#e0567c" },
  { name: "Pinecrest Health", domain: "pinecrest.care", stage: "Won", value: "€210,000", owner: "AR", color: "#8b5cf6" },
  { name: "Ferro & Co.", domain: "ferro.co", stage: "Qualified", value: "€39,400", owner: "MD", color: "#14b8c4" },
];
const stageColor: Record<string, string> = { Lead: "gray", Qualified: "blue", Proposal: "amber", Negotiation: "violet", Won: "green" };

const plans = [
  { name: "Free", price: "€0", note: "For individuals getting started", items: ["Up to 3 seats", "Unlimited contacts & companies", "Email & calendar sync", "Basic reporting"], cta: "Start for free" },
  { name: "Plus", price: "€29", note: "Per seat / month, billed yearly", items: ["Everything in Free", "Custom objects", "Sequences", "Advanced filters & views"], cta: "Start trial" },
  { name: "Pro", price: "€69", note: "Per seat / month, billed yearly", items: ["Everything in Plus", "AI agents & enrichment", "Workflow automations", "Advanced reporting"], cta: "Start trial", featured: true },
  { name: "Enterprise", price: "Custom", note: "For organizations at scale", items: ["Everything in Pro", "SSO & SCIM", "Audit logs", "Dedicated success manager"], cta: "Talk to sales" },
];

const faqs = [
  ["How long does it take to set up Vult?", "Most teams are live in under an hour. Connect your email and calendar and Vult builds your workspace from your existing relationships automatically."],
  ["Can I import data from another CRM?", "Yes. Import from CSV or migrate directly from popular CRMs — fields, records and relationships come with you."],
  ["Is my data secure?", "Data is encrypted in transit and at rest, with granular permissions, SSO and audit logs available on higher plans."],
  ["Can I customize objects and fields?", "Completely. Create your own objects, attributes and relationships so Vult models your business, not the other way round."],
];

function ProductWindow() {
  const [query, setQuery] = useState("");
  const rows = records.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
  return <div className="vl-window" aria-label="Vult product preview">
    <div className="vl-win-top"><span /><span /><span /><b>Vult — Deals</b></div>
    <div className="vl-win-body">
      <aside className="vl-win-side">
        <div className="vl-win-ws"><span className="vl-ws-mark"><VultLogo size={14} white /></span>Vult HQ <ChevronDown size={12} /></div>
        <div className="vl-win-search"><Search size={12} /> Search</div>
        {[["Home", CircleDot], ["Inbox", Mail], ["Automations", Zap]].map(([l, I]: any) => <div key={l} className="vl-win-link"><I size={13} />{l}</div>)}
        <small>Records</small>
        {[["Companies", Building2], ["People", Users], ["Deals", BarChart3]].map(([l, I]: any) => <div key={l} className={"vl-win-link" + (l === "Deals" ? " on" : "")}><I size={13} />{l}</div>)}
      </aside>
      <div className="vl-win-main">
        <div className="vl-win-bar"><b>All deals</b><span className="vl-chip">Sorted by value</span><span className="vl-chip">Filter</span><div className="grow" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search deals…" aria-label="Search deals" /></div>
        <div className="vl-table">
          <div className="vl-tr head"><span>Company</span><span>Stage</span><span>Value</span><span>Owner</span></div>
          {rows.map(r => <div className="vl-tr" key={r.name}>
            <span className="vl-co"><i style={{ background: r.color }}>{r.name[0]}</i><b>{r.name}</b><em>{r.domain}</em></span>
            <span><span className={"vl-stage " + stageColor[r.stage]}>{r.stage}</span></span>
            <span className="vl-num">{r.value}</span>
            <span><span className="vl-avatar">{r.owner}</span></span>
          </div>)}
          {rows.length === 0 && <div className="vl-empty">No deals match “{query}”</div>}
        </div>
      </div>
    </div>
  </div>;
}

function AgentCard() {
  const steps = ["Researching Helio Systems", "Found 3 new decision makers", "Enriched 14 attributes", "Drafted follow-up email"];
  const [n, setN] = useState(1);
  useEffect(() => { const t = setInterval(() => setN(v => v >= steps.length ? 1 : v + 1), 1400); return () => clearInterval(t); }, []);
  return <div className="vl-agent">
    <div className="vl-agent-head"><Sparkles size={14} /> Vult Agent <span>running</span></div>
    {steps.map((s, i) => <div key={s} className={"vl-agent-step" + (i < n ? " done" : "")}><span>{i < n ? <Check size={11} /> : null}</span>{s}</div>)}
  </div>;
}

function WorkflowCard() {
  return <div className="vl-flow">
    {[["Trigger", "Deal stage changed to Won", Zap], ["Action", "Create onboarding task", Check], ["Action", "Notify #sales in Slack", Mail], ["AI", "Summarize the deal history", Sparkles]].map(([k, t, I]: any, i) => <div key={t} className="vl-flow-node"><span className="vl-flow-ico"><I size={13} /></span><div><small>{k}</small><b>{t}</b></div>{i < 3 && <i className="vl-flow-line" />}</div>)}
  </div>;
}

function ObjectsCard() {
  return <div className="vl-objects">
    {[["Companies", "#5b7cfa", Building2], ["People", "#2fb27a", Users], ["Deals", "#f0a03c", BarChart3], ["Investors", "#8b5cf6", Database]].map(([n, c, I]: any) => <div key={n} className="vl-object"><span style={{ background: c }}><I size={14} /></span><b>{n}</b><em>Custom object</em></div>)}
  </div>;
}

function ReportCard() {
  const bars = [38, 52, 46, 64, 58, 76, 88, 72, 94];
  return <div className="vl-report"><div className="vl-report-head"><b>Pipeline value</b><span>+24% QoQ</span></div><div className="vl-bars">{bars.map((h, i) => <span key={i} style={{ height: h + "%" }} />)}</div></div>;
}

export default function Landing() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [yearly, setYearly] = useState(true);
  useEffect(() => { document.title = "Vult: The AI-native CRM"; }, []);

  return <div className="vl" onClick={() => setOpen(null)}>
    <a className="vl-banner" href="#agents">Introducing Vult Agents — your always-on revenue team <ChevronRight size={14} /></a>
    <header className="vl-nav">
      <Wordmark />
      <nav className="vl-links">
        {navItems.map(item => <div key={item.label} className="vl-dd" onClick={e => e.stopPropagation()}>
          <button onClick={() => setOpen(open === item.label ? null : item.label)} aria-expanded={open === item.label}>{item.label} <ChevronDown size={13} /></button>
          {open === item.label && <div className="vl-menu">{item.menu.map(([t, d, I]: any) => <a key={t} href="#platform" onClick={() => setOpen(null)}><span><I size={15} /></span><div><b>{t}</b><small>{d}</small></div></a>)}</div>}
        </div>)}
        <a href="#workflows">Automations</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a>
      </nav>
      <div className="vl-nav-cta"><a href="/vult/home" className="vl-signin">Sign in</a><a href="/vult/home" className="vl-btn dark">Start for free</a></div>
      <button className="vl-burger" onClick={() => setMobile(!mobile)} aria-label="Menu">{mobile ? <X size={20} /> : <Menu size={20} />}</button>
    </header>
    {mobile && <div className="vl-mobile">{["Platform", "Automations", "Pricing", "FAQ"].map(l => <a key={l} href={"#" + (l === "Automations" ? "workflows" : l.toLowerCase())} onClick={() => setMobile(false)}>{l}</a>)}<a href="/vult/home" className="vl-btn dark">Start for free</a></div>}

    <main>
      <section className="vl-hero">
        <a className="vl-pill" href="#agents"><span>New</span> AI agents that run your pipeline <ChevronRight size={13} /></a>
        <h1>The CRM that builds<br />itself around you.</h1>
        <p>Vult is the AI-native CRM that captures every relationship, automates the busywork and helps your team close more — without the data entry.</p>
        <div className="vl-hero-cta"><a href="/vult/home" className="vl-btn dark lg">Start for free <ArrowRight size={15} /></a><a href="#pricing" className="vl-btn lg">Talk to sales</a></div>
        <small className="vl-hero-note">Free forever for small teams · No credit card required</small>
        <ProductWindow />
      </section>

      <section className="vl-stats">
        {[["10×", "faster setup than legacy CRMs"], ["0", "manual data entry required"], ["24/7", "agents working your pipeline"], ["100%", "flexible data model"]].map(([n, l]) => <div key={l}><b>{n}</b><span>{l}</span></div>)}
      </section>

      <section className="vl-section" id="platform">
        <div className="vl-head"><span className="vl-kicker">Platform</span><h2>Everything your revenue team needs.<br /><em>Nothing it doesn't.</em></h2><p>Vult connects to your inbox, calendar and tools, then turns raw activity into a living map of every relationship.</p></div>
        <div className="vl-grid">
          <article className="vl-card wide"><div><span className="vl-kicker">Data model</span><h3>Model your business, your way</h3><p>Create custom objects, attributes and relationships in seconds. Vult adapts to how you sell, fundraise or recruit.</p></div><ObjectsCard /></article>
          <article className="vl-card"><span className="vl-kicker">Enrichment</span><h3>Always-fresh records</h3><p>Every company and person is enriched automatically with firmographics, social profiles and interaction history.</p><div className="vl-enrich">{["Industry · Software", "Employees · 120–250", "HQ · Milan, Italy", "Funding · Series B"].map(t => <span key={t}>{t}</span>)}</div></article>
          <article className="vl-card"><span className="vl-kicker">Reporting</span><h3>Insight in real time</h3><p>Build dashboards on any object. Track pipeline, forecast revenue and spot risk before it happens.</p><ReportCard /></article>
        </div>
      </section>

      <section className="vl-dark" id="agents">
        <div className="vl-dark-inner">
          <div><span className="vl-kicker light">Vult Agents</span><h2>Your pipeline, on autopilot.</h2><p>Agents research accounts, enrich records, draft follow-ups and keep every deal moving — around the clock, with you in control.</p>
            <ul>{["Research prospects and surface buying signals", "Write personalized outreach in your voice", "Update records after every call and email", "Escalate deals that need your attention"].map(t => <li key={t}><Check size={15} />{t}</li>)}</ul>
            <a href="/vult/home" className="vl-btn light">Try Vult Agents <ArrowRight size={15} /></a></div>
          <AgentCard />
        </div>
      </section>

      <section className="vl-section" id="workflows">
        <div className="vl-split">
          <div className="vl-head left"><span className="vl-kicker">Automations</span><h2>Automate anything.<br /><em>Code optional.</em></h2><p>Drag-and-drop workflows and multi-step sequences that react to every change in your data. Connect Vult to the tools you already use.</p><a href="/vult/automations/workflows" className="vl-link">Explore workflows <ChevronRight size={14} /></a></div>
          <WorkflowCard />
        </div>
      </section>

      <section className="vl-section alt" id="pricing">
        <div className="vl-head"><span className="vl-kicker">Pricing</span><h2>Start free. Scale when you're ready.</h2>
          <div className="vl-toggle"><button className={yearly ? "on" : ""} onClick={() => setYearly(true)}>Yearly</button><button className={!yearly ? "on" : ""} onClick={() => setYearly(false)}>Monthly</button></div></div>
        <div className="vl-plans">{plans.map(p => {
          const n = parseInt(p.price.slice(1), 10);
          const price = !yearly && n > 0 ? `€${Math.round(n * 1.2)}` : p.price;
          return <div key={p.name} className={"vl-plan" + (p.featured ? " featured" : "")}>{p.featured && <span className="vl-badge">Most popular</span>}<h3>{p.name}</h3><div className="vl-price">{price}</div><small>{!yearly && n > 0 ? "Per seat / month, billed monthly" : p.note}</small><a href="/vult/home" className={"vl-btn" + (p.featured ? " dark" : "")}>{p.cta}</a><ul>{p.items.map(i => <li key={i}><Check size={14} />{i}</li>)}</ul></div>;
        })}</div>
      </section>

      <section className="vl-section" id="faq">
        <div className="vl-head"><span className="vl-kicker">FAQ</span><h2>Questions, answered.</h2></div>
        <div className="vl-faq">{faqs.map(([q, a], i) => <div key={q} className={"vl-faq-item" + (faq === i ? " open" : "")}><button onClick={() => setFaq(faq === i ? null : i)}>{q}<ChevronDown size={16} /></button>{faq === i && <p>{a}</p>}</div>)}</div>
      </section>

      <section className="vl-final">
        <VultLogo size={56} />
        <h2>Build your CRM with Vult.</h2>
        <p>Set up in minutes. Free for small teams.</p>
        <div className="vl-hero-cta"><a href="/vult/home" className="vl-btn dark lg">Start for free <ArrowRight size={15} /></a><a href="#pricing" className="vl-btn lg">Talk to sales</a></div>
      </section>
    </main>

    <footer className="vl-footer">
      <div className="vl-foot-brand"><Wordmark /><p>The AI-native CRM for modern revenue teams.</p></div>
      {[["Product", ["Platform", "Agents", "Automations", "Pricing"]], ["Company", ["About", "Careers", "Blog", "Contact"]], ["Resources", ["Help center", "Guides", "Changelog", "Status"]], ["Legal", ["Privacy", "Terms", "Security", "DPA"]]].map(([h, ls]: any) => <div key={h} className="vl-foot-col"><b>{h}</b>{ls.map((l: string) => <a key={l} href="#">{l}</a>)}</div>)}
      <div className="vl-foot-bottom">© {new Date().getFullYear()} Vult. All rights reserved.</div>
    </footer>
  </div>;
}
