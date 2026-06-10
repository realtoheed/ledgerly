"use client";

import { FormEvent, useMemo, useState } from "react";

type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

type Invoice = {
  id: string;
  client: string;
  initials: string;
  issued: string;
  due: string;
  amount: number;
  status: InvoiceStatus;
  color: string;
};

const initialInvoices: Invoice[] = [
  { id: "INV-0248", client: "Northstar Labs", initials: "NL", issued: "Jun 8, 2026", due: "Jun 22, 2026", amount: 4200, status: "Pending", color: "#2f6d62" },
  { id: "INV-0247", client: "Morrow Studio", initials: "MS", issued: "Jun 5, 2026", due: "Jun 5, 2026", amount: 1850, status: "Paid", color: "#886746" },
  { id: "INV-0246", client: "Fable & Co.", initials: "FC", issued: "May 29, 2026", due: "Jun 7, 2026", amount: 3200, status: "Overdue", color: "#9d514e" },
  { id: "INV-0245", client: "Kinship Coffee", initials: "KC", issued: "May 24, 2026", due: "Jun 14, 2026", amount: 975, status: "Pending", color: "#526c91" },
  { id: "INV-0244", client: "Onda Systems", initials: "OS", issued: "May 19, 2026", due: "May 19, 2026", amount: 5600, status: "Paid", color: "#68598a" },
];

const navItems = [
  ["Dashboard", "grid"],
  ["Invoices", "file"],
  ["Clients", "users"],
  ["Subscriptions", "repeat"],
  ["Payments", "card"],
  ["Reports", "chart"],
] as const;

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    repeat: <><path d="m17 1 4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></>,
    card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 16 4-5 4 3 5-7" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.09A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.09 14H3v-4h.09A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63h.01A1.7 1.7 0 0 0 10 3.09V3h4v.09A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9v.01A1.7 1.7 0 0 0 20.91 10H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-8" /><path d="M15 7h6v6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [filter, setFilter] = useState<InvoiceStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [toast, setToast] = useState("");

  const filteredInvoices = useMemo(() => invoices.filter((invoice) => {
    const matchesFilter = filter === "All" || invoice.status === filter;
    const term = search.toLowerCase();
    return matchesFilter && (invoice.client.toLowerCase().includes(term) || invoice.id.toLowerCase().includes(term));
  }), [filter, invoices, search]);

  function createInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const client = String(data.get("client"));
    const amount = Number(data.get("amount"));
    const nextNumber = 249 + invoices.length - initialInvoices.length;
    setInvoices((current) => [{
      id: `INV-0${nextNumber}`,
      client,
      initials: client.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      issued: "Jun 10, 2026",
      due: String(data.get("due")),
      amount,
      status: "Draft",
      color: "#2f6d62",
    }, ...current]);
    setShowModal(false);
    setToast(`Draft invoice created for ${client}`);
    setTimeout(() => setToast(""), 3500);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">L</span><span>Ledgerly</span></div>
        <nav aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(([label, icon]) => (
            <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} onClick={() => setActiveNav(label)}>
              <Icon name={icon} /><span>{label}</span>{label === "Invoices" && <span className="nav-count">12</span>}
            </button>
          ))}
          <p className="nav-label nav-label-spaced">Manage</p>
          <button className="nav-item" onClick={() => setActiveNav("Settings")}><Icon name="settings" /><span>Settings</span></button>
        </nav>
        <div className="sidebar-card">
          <div className="sidebar-card-icon"><Icon name="trend" /></div>
          <strong>Unlock more insights</strong>
          <p>Connect your bank to reconcile payments automatically.</p>
          <button>Connect bank <Icon name="arrow" size={15} /></button>
        </div>
        <div className="profile">
          <div className="avatar">JD</div><div><strong>Jordan Davis</strong><span>Acme Studio</span></div><button aria-label="Open profile"><Icon name="chevron" size={16} /></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">L</span><strong>Ledgerly</strong></div>
          <div className="top-search"><Icon name="search" size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoices, clients..." aria-label="Search" /><kbd>⌘ K</kbd></div>
          <div className="top-actions"><button className="icon-button" aria-label="Notifications"><Icon name="bell" /><span className="notification-dot" /></button><button className="primary-button" onClick={() => setShowModal(true)}><Icon name="plus" size={17} /> New invoice</button></div>
        </header>

        <div className="page">
          <section className="welcome">
            <div><p className="eyebrow">Wednesday, June 10</p><h1>Good morning, Jordan.</h1><p>Here&apos;s how your business is doing this month.</p></div>
            <button className="primary-button welcome-button" onClick={() => setShowModal(true)}><Icon name="plus" size={17} /> New invoice</button>
          </section>

          <section className="stats-grid" aria-label="Business overview">
            <article className="stat-card"><div className="stat-top"><span>Revenue this month</span><span className="stat-icon green"><Icon name="trend" /></span></div><strong>$24,860.00</strong><p className="positive">↑ 12.4% <span>vs. last month</span></p></article>
            <article className="stat-card"><div className="stat-top"><span>Outstanding</span><span className="stat-icon amber"><Icon name="file" /></span></div><strong>$9,375.00</strong><p><b>4 invoices</b> awaiting payment</p></article>
            <article className="stat-card"><div className="stat-top"><span>Overdue</span><span className="stat-icon red"><Icon name="bell" /></span></div><strong>$3,200.00</strong><p className="danger"><b>1 invoice</b> needs attention</p></article>
            <article className="stat-card"><div className="stat-top"><span>Active clients</span><span className="stat-icon blue"><Icon name="users" /></span></div><strong>28</strong><p className="positive">↑ 3 <span>new this month</span></p></article>
          </section>

          <section className="dashboard-grid">
            <article className="panel revenue-panel">
              <div className="panel-heading"><div><h2>Revenue overview</h2><p>Income received over the last 6 months</p></div><select aria-label="Chart period"><option>Last 6 months</option><option>This year</option></select></div>
              <div className="chart-summary"><strong>$112,540</strong><span><Icon name="trend" size={14} /> 18.2%</span></div>
              <div className="chart">
                <div className="y-labels"><span>$30k</span><span>$20k</span><span>$10k</span><span>$0</span></div>
                <div className="chart-area">
                  <div className="grid-lines"><i /><i /><i /><i /></div>
                  <svg viewBox="0 0 600 190" preserveAspectRatio="none" aria-label="Revenue increased from January through June">
                    <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2f6d62" stopOpacity=".22" /><stop offset="100%" stopColor="#2f6d62" stopOpacity="0" /></linearGradient></defs>
                    <path className="area" d="M0 152 C55 145 65 116 120 122 S190 97 240 105 S315 50 360 71 S430 86 480 50 S545 38 600 18 L600 190 L0 190 Z" />
                    <path className="line" d="M0 152 C55 145 65 116 120 122 S190 97 240 105 S315 50 360 71 S430 86 480 50 S545 38 600 18" />
                    {[["0","152"],["120","122"],["240","105"],["360","71"],["480","50"],["600","18"]].map(([cx,cy]) => <circle key={cx} cx={cx} cy={cy} r="4" />)}
                  </svg>
                  <div className="x-labels"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
                </div>
              </div>
            </article>

            <article className="panel activity-panel">
              <div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates across your account</p></div><button className="text-button">View all</button></div>
              <div className="activity-list">
                <div className="activity-item"><span className="activity-icon paid"><Icon name="check" /></span><div><p><b>Payment received</b> from Morrow Studio</p><span>Invoice INV-0247 · $1,850.00</span><time>2 hours ago</time></div></div>
                <div className="activity-item"><span className="activity-icon sent"><Icon name="arrow" /></span><div><p><b>Invoice sent</b> to Northstar Labs</p><span>Invoice INV-0248 · $4,200.00</span><time>Yesterday</time></div></div>
                <div className="activity-item"><span className="activity-icon overdue"><Icon name="bell" /></span><div><p><b>Invoice overdue</b> for Fable & Co.</p><span>Invoice INV-0246 · $3,200.00</span><time>3 days ago</time></div></div>
                <div className="activity-item"><span className="activity-icon client"><Icon name="users" /></span><div><p><b>New client added</b></p><span>Kinship Coffee</span><time>5 days ago</time></div></div>
              </div>
            </article>
          </section>

          <section className="panel invoices-panel">
            <div className="invoice-header"><div><h2>Recent invoices</h2><p>Track and manage your latest invoices</p></div><button className="secondary-button">View all invoices <Icon name="arrow" size={15} /></button></div>
            <div className="filters" role="group" aria-label="Invoice status filter">
              {(["All", "Paid", "Pending", "Overdue", "Draft"] as const).map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}{item === "All" && <span>{invoices.length}</span>}</button>)}
            </div>
            <div className="table-wrap">
              <table><thead><tr><th>Invoice</th><th>Client</th><th>Issued</th><th>Due date</th><th>Amount</th><th>Status</th><th aria-label="Actions" /></tr></thead>
                <tbody>{filteredInvoices.map((invoice) => <tr key={invoice.id}><td><b>{invoice.id}</b></td><td><div className="client-cell"><span style={{ background: invoice.color }}>{invoice.initials}</span><b>{invoice.client}</b></div></td><td>{invoice.issued}</td><td>{invoice.due}</td><td className="amount">${invoice.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td><td><span className={`status ${invoice.status.toLowerCase()}`}>{invoice.status}</span></td><td><button className="row-action" aria-label={`Open ${invoice.id}`}><Icon name="chevron" size={16} /></button></td></tr>)}</tbody>
              </table>
              {filteredInvoices.length === 0 && <div className="empty-state">No invoices match your current search.</div>}
            </div>
          </section>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.slice(0, 4).map(([label, icon]) => <button key={label} className={activeNav === label ? "active" : ""} onClick={() => setActiveNav(label)}><Icon name={icon} /><span>{label}</span></button>)}
      </nav>

      {showModal && <div className="modal-backdrop" onMouseDown={() => setShowModal(false)}>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
          <div className="modal-header"><div><p className="eyebrow">Create</p><h2 id="modal-title">New invoice</h2></div><button className="icon-button" onClick={() => setShowModal(false)} aria-label="Close"><Icon name="close" /></button></div>
          <form onSubmit={createInvoice}>
            <label>Client<input name="client" placeholder="Client or company name" required autoFocus /></label>
            <div className="form-row"><label>Amount<input name="amount" type="number" min="1" step="0.01" placeholder="0.00" required /></label><label>Currency<select name="currency"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option></select></label></div>
            <label>Due date<input name="due" type="text" placeholder="Jun 30, 2026" required /></label>
            <label>Description<textarea name="description" placeholder="Design services, consulting, subscription..." rows={3} /></label>
            <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowModal(false)}>Cancel</button><button className="primary-button" type="submit">Create draft</button></div>
          </form>
        </div>
      </div>}
      {toast && <div className="toast" role="status"><Icon name="check" size={17} />{toast}</div>}
    </div>
  );
}
