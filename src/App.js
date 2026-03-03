// src/App.js
import React, { useEffect, useMemo, useState } from "react";

/**
 * ✅ Single-file App.js (one unified app)
 * - Admin has ALL employee tabs + extra admin tabs
 * - Employees can VIEW their stuff; Admin can EDIT sensitive items
 * - Admin can "View As" any employee
 * - Simple GPS: Admin sets office location/radius; Employee only sees status
 *
 * Note: This is still using in-memory state (mock data). Next step is wiring to Supabase.
 */

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_EMPLOYEES = [
  {
    id: "E001",
    name: "Marcus Johnson",
    email: "marcus@company.com",
    password: "pass123",
    role: "hourly",
    position: "Cashier",
    department: "Retail",
    hourlyRate: 18,
    salary: null,
    manager: false,
    active: true,
    startDate: "2023-03-15",
    tax: { filing: "Single", allowances: 1, federal: 22, state: 6 },
    directDeposit: {
      bank: "Chase",
      routing: "021000021",
      account: "****4521",
      type: "Checking",
    },
    timeOff: { vacation: 80, sick: 40, personal: 16 },
    punchHistory: [
      { date: "2025-02-20", in: "08:02", out: "16:05", hours: 8.05 },
      { date: "2025-02-21", in: "08:00", out: "16:00", hours: 8.0 },
      { date: "2025-02-19", in: "07:58", out: "16:02", hours: 8.07 },
    ],
    timeOffRequests: [
      {
        id: "TO001",
        type: "Vacation",
        start: "2025-03-10",
        end: "2025-03-14",
        status: "Pending",
        note: "Family trip",
      },
    ],
    payStatements: [
      { period: "Feb 1-15, 2025", gross: 1440, net: 1123, date: "2025-02-20" },
      { period: "Jan 16-31, 2025", gross: 1440, net: 1123, date: "2025-02-05" },
    ],
  },
  {
    id: "E002",
    name: "Sarah Chen",
    email: "sarah@company.com",
    password: "pass123",
    role: "salary",
    position: "Store Manager",
    department: "Management",
    hourlyRate: null,
    salary: 75000,
    manager: true,
    active: true,
    startDate: "2021-06-01",
    tax: { filing: "Married", allowances: 2, federal: 22, state: 6 },
    directDeposit: {
      bank: "Bank of America",
      routing: "026009593",
      account: "****8834",
      type: "Checking",
    },
    timeOff: { vacation: 120, sick: 60, personal: 24 },
    punchHistory: [],
    timeOffRequests: [],
    payStatements: [
      { period: "Feb 1-15, 2025", gross: 3125, net: 2341, date: "2025-02-20" },
      { period: "Jan 16-31, 2025", gross: 3125, net: 2341, date: "2025-02-05" },
    ],
  },
  {
    id: "E003",
    name: "David Okafor",
    email: "david@company.com",
    password: "pass123",
    role: "hourly",
    position: "Warehouse Associate",
    department: "Operations",
    hourlyRate: 20,
    salary: null,
    manager: false,
    active: true,
    startDate: "2022-11-20",
    tax: { filing: "Single", allowances: 0, federal: 22, state: 6 },
    directDeposit: {
      bank: "Wells Fargo",
      routing: "121000248",
      account: "****2209",
      type: "Savings",
    },
    timeOff: { vacation: 80, sick: 40, personal: 16 },
    punchHistory: [
      { date: "2025-02-20", in: "09:00", out: "17:30", hours: 8.5 },
      { date: "2025-02-21", in: "08:55", out: "17:00", hours: 8.08 },
    ],
    timeOffRequests: [],
    payStatements: [{ period: "Feb 1-15, 2025", gross: 1600, net: 1230, date: "2025-02-20" }],
  },
];

const ADMIN_CREDENTIALS = { email: "admin@company.com", password: "admin2025" };

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    clock: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12,6 12,12 16,14" />
      </svg>
    ),
    dollar: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    calendar: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    users: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    shield: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    logout: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16,17 21,12 16,7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    check: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="20,6 9,17 4,12" />
      </svg>
    ),
    x: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    download: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7,10 12,15 17,10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    plus: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    trash: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="3,6 5,6 21,6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    ),
    home: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9,22 9,12 15,12 15,22" />
      </svg>
    ),
    file: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
      </svg>
    ),
    book: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    settings: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    bell: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    user: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    bank: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <line x1="3" y1="22" x2="21" y2="22" />
        <line x1="6" y1="18" x2="6" y2="11" />
        <line x1="10" y1="18" x2="10" y2="11" />
        <line x1="14" y1="18" x2="14" y2="11" />
        <line x1="18" y1="18" x2="18" y2="11" />
        <polygon points="12,2 20,7 4,7" />
      </svg>
    ),
    edit: (
      <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  };
  return icons[name] || null;
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: #0A0F1E; --navy-mid: #111827; --navy-light: #1C2740;
    --accent: #00D4AA; --accent2: #FF6B4A; --accent3: #5B8DEF;
    --text: #F0F4FF; --text-muted: #7A8BA6; --border: rgba(255,255,255,0.07);
    --card: rgba(255,255,255,0.04); --card-hover: rgba(255,255,255,0.07);
    --success: #10B981; --warning: #F59E0B; --danger: #EF4444;
    --radius: 14px; --radius-sm: 8px;
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--navy); color: var(--text); min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--navy);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(0,212,170,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(91,141,239,0.06) 0%, transparent 50%); }
  .login-card { background: var(--navy-light); border: 1px solid var(--border); border-radius: 20px;
    padding: 48px 40px; width: 420px; max-width: 95vw; box-shadow: 0 40px 80px rgba(0,0,0,0.5); }
  .login-logo { text-align: center; margin-bottom: 32px; }
  .login-logo-mark { width: 56px; height: 56px; background: linear-gradient(135deg, var(--accent), var(--accent3));
    border-radius: 16px; display: inline-flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px; color: var(--navy); margin-bottom: 12px; }
  .login-title { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
  .login-sub { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
  .login-type-tabs { display: flex; gap: 8px; margin-bottom: 28px; background: var(--navy); border-radius: var(--radius-sm); padding: 4px; }
  .login-tab { flex: 1; padding: 10px; border: none; border-radius: 6px; font-family: 'DM Sans',sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; background: transparent; color: var(--text-muted); }
  .login-tab.active { background: var(--accent); color: var(--navy); font-weight: 600; }
  .form-group { margin-bottom: 18px; }
  .form-label { font-size: 13px; color: var(--text-muted); margin-bottom: 8px; display: block; font-weight: 500; }
  .form-input { width: 100%; background: var(--navy); border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 12px 16px; color: var(--text); font-family: 'DM Sans',sans-serif; font-size: 15px; transition: border-color 0.2s; outline: none; }
  .form-input:focus { border-color: var(--accent); }
  .btn { padding: 12px 24px; border: none; border-radius: var(--radius-sm); font-family: 'DM Sans',sans-serif;
    font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-primary { background: var(--accent); color: var(--navy); width: 100%; justify-content: center; }
  .btn-primary:hover { background: #00bfa0; transform: translateY(-1px); }
  .btn-danger { background: rgba(239,68,68,0.12); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .btn-ghost { background: var(--card); color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--card-hover); }
  .btn-sm { padding: 8px 16px; font-size: 13px; }
  .btn-icon { padding: 8px; border-radius: 8px; background: var(--card); border: 1px solid var(--border); color: var(--text-muted); }
  .btn-icon:hover { color: var(--text); background: var(--card-hover); }
  .error-msg { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: var(--danger);
    padding: 10px 14px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 16px; }

  .shell { display: flex; min-height: 100vh; }
  .sidebar { width: 240px; min-height: 100vh; background: var(--navy-mid); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; position: fixed; left: 0; top: 0; z-index: 100; }
  .sidebar-logo { padding: 24px 20px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
  .logo-mark { width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent), var(--accent3));
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 16px; color: var(--navy); flex-shrink: 0; }
  .logo-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; }
  .sidebar-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
  .nav-section-label { font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;
    letter-spacing: 1px; padding: 12px 8px 6px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px;
    cursor: pointer; color: var(--text-muted); font-size: 14px; font-weight: 500; transition: all 0.15s; margin-bottom: 2px;
    border: none; background: none; width: 100%; text-align: left; }
  .nav-item:hover { color: var(--text); background: var(--card); }
  .nav-item.active { color: var(--accent); background: rgba(0,212,170,0.08); }
  .sidebar-user { padding: 16px 12px; border-top: 1px solid var(--border); }
  .user-card { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px;
    background: var(--card); border: 1px solid var(--border); }
  .user-avatar { width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: white; flex-shrink: 0; }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 11px; color: var(--text-muted); }

  .main { margin-left: 240px; flex: 1; }
  .topbar { height: 60px; border-bottom: 1px solid var(--border); display: flex; align-items: center;
    padding: 0 28px; gap: 16px; background: var(--navy-mid); position: sticky; top: 0; z-index: 50; }
  .topbar-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; flex: 1; }
  .page { padding: 28px; max-width: 1200px; }

  .card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; }
  .card-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 4px; }
  .card-sub { color: var(--text-muted); font-size: 13px; }
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .stat-label { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; }
  .stat-value.green { color: var(--accent); }
  .stat-value.orange { color: var(--accent2); }
  .stat-value.blue { color: var(--accent3); }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .table-wrap { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; }
  th { background: var(--navy-mid); padding: 12px 16px; font-size: 12px; font-weight: 600; color: var(--text-muted);
    text-align: left; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 14px 16px; font-size: 14px; border-top: 1px solid var(--border); }
  tr:hover td { background: var(--card); }

  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-green { background: rgba(16,185,129,0.12); color: var(--success); }
  .badge-orange { background: rgba(245,158,11,0.12); color: var(--warning); }
  .badge-red { background: rgba(239,68,68,0.12); color: var(--danger); }
  .badge-blue { background: rgba(91,141,239,0.12); color: var(--accent3); }
  .badge-teal { background: rgba(0,212,170,0.12); color: var(--accent); }

  .tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 28px; overflow-x: auto; }
  .tab-btn { padding: 12px 20px; background: none; border: none; border-bottom: 2px solid transparent;
    color: var(--text-muted); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    cursor: pointer; white-space: nowrap; transition: all 0.2s; }
  .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
  .tab-btn:hover { color: var(--text); }

  .flex { display: flex; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }
  .mb-8 { margin-bottom: 8px; }
  .mb-16 { margin-bottom: 16px; }
  .mb-24 { margin-bottom: 24px; }
  .mt-16 { margin-top: 16px; }
  .text-muted { color: var(--text-muted); }
  .text-sm { font-size: 13px; }
  .text-xs { font-size: 11px; }
  .w-full { width: 100%; }
  .select-input { background: var(--navy); border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 10px 14px; color: var(--text); font-family: 'DM Sans',sans-serif; font-size: 14px; outline: none; width: 100%; }
  .tag { display: inline-flex; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .tag-salary { background: rgba(91,141,239,0.15); color: var(--accent3); }
  .tag-hourly { background: rgba(0,212,170,0.12); color: var(--accent); }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
    z-index: 200; backdrop-filter: blur(4px); }
  .modal { background: var(--navy-light); border: 1px solid var(--border); border-radius: 20px;
    padding: 32px; width: 520px; max-width: 95vw; max-height: 85vh; overflow-y: auto;
    box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 24px; }
  .info-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .info-row:last-child { border-bottom: none; }

  @media (max-width: 768px) {
    .sidebar { width: 64px; }
    .sidebar .logo-text, .sidebar .nav-item span, .sidebar .user-info, .nav-section-label { display: none; }
    .sidebar .nav-item { justify-content: center; padding: 12px; }
    .main { margin-left: 64px; }
    .grid-2 { grid-template-columns: 1fr; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
  }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtCurrency = (n) => `$${fmt(n)}`;
const today = () => new Date().toISOString().slice(0, 10);
const timeNow = () => new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
const initials = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase();

function haversineMeters(a, b) {
  if (!a || !b) return null;
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 = Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(s1 + s2), Math.sqrt(1 - (s1 + s2)));
  return R * c;
}

// ─── EMPLOYEE TABS (VIEW + SOME ACTIONS) ───────────────────────────────────────
function EmpHome({ emp, employees, setTab }) {
  const currentEmp = employees.find((e) => e.id === emp.id) || emp;
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
          Welcome back, {emp.name.split(" ")[0]} 👋
        </div>
        <div className="text-muted">{emp.position} · {emp.department} · ID: {emp.id}</div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Hours This Period</div>
          <div className="stat-value green">{currentEmp.punchHistory.reduce((a, r) => a + r.hours, 0).toFixed(1)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vacation Days Left</div>
          <div className="stat-value blue">{Math.floor(currentEmp.timeOff.vacation / 8)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value orange">{currentEmp.timeOffRequests.filter((r) => r.status === "Pending").length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Last Pay Net</div>
          <div className="stat-value green">{currentEmp.payStatements[0] ? fmtCurrency(currentEmp.payStatements[0].net) : "-"}</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title mb-8">Employment Info</div>
          <div className="info-row"><span className="text-muted">Start Date</span><span style={{ fontWeight: 600 }}>{emp.startDate}</span></div>
          <div className="info-row"><span className="text-muted">Department</span><span style={{ fontWeight: 600 }}>{emp.department}</span></div>
          <div className="info-row"><span className="text-muted">Position</span><span style={{ fontWeight: 600 }}>{emp.position}</span></div>
          <div className="info-row">
            <span className="text-muted">Pay Type</span>
            <span style={{ fontWeight: 600 }}>
              <span className={`tag ${emp.role === "salary" ? "tag-salary" : "tag-hourly"}`}>{emp.role}</span>
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-8">Quick Links</div>
          {["timecard", "pay", "timeoff", "directdeposit", "gpsstatus"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="w-full btn btn-ghost mb-8"
              style={{ justifyContent: "flex-start" }}
            >
              <Icon name={t === "gpsstatus" ? "settings" : t === "timecard" ? "clock" : t === "pay" ? "dollar" : t === "timeoff" ? "calendar" : "bank"} size={16} />
              {t === "gpsstatus" ? "GPS Status" : t === "timecard" ? "Time Card" : t === "pay" ? "Pay" : t === "timeoff" ? "Time Off" : "Direct Deposit"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmpTimeCard({ emp }) {
  const history = emp.punchHistory || [];
  const totalHours = history.reduce((a, r) => a + r.hours, 0);
  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">This Period</div><div className="stat-value green">{totalHours.toFixed(1)} hrs</div></div>
        <div className="stat-card"><div className="stat-label">Pending Pay</div><div className="stat-value orange">{fmtCurrency(totalHours * (emp.hourlyRate || 0))}</div></div>
        <div className="stat-card"><div className="stat-label">Rate</div><div className="stat-value blue" style={{ fontSize: 20 }}>{emp.hourlyRate ? `$${emp.hourlyRate}/hr` : "Salary"}</div></div>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-16">
          <div><div className="card-title">Time Card History</div><div className="card-sub">Current pay period</div></div>
        </div>
        {history.length === 0 ? (
          <div className="text-muted text-sm" style={{ textAlign: "center", padding: "30px" }}>
            No punch records for this period
          </div>
        ) : (
          history.map((r, i) => (
            <div key={i} style={{ padding: 14, borderRadius: 10, background: "var(--card)", border: "1px solid var(--border)", marginBottom: 8 }}>
              <div className="flex justify-between items-center">
                <div>
                  <div style={{ fontWeight: 600 }}>{r.date}</div>
                  <div className="text-sm text-muted">{r.in} → {r.out || "—"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, color: "var(--accent)" }}>{r.hours.toFixed(2)} hrs</div>
                  <div className="text-sm text-muted">{fmtCurrency(r.hours * (emp.hourlyRate || 0))}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EmpPay({ emp }) {
  const ytdGross = (emp.payStatements || []).reduce((a, p) => a + (p.gross || 0), 0);
  const ytdNet = (emp.payStatements || []).reduce((a, p) => a + (p.net || 0), 0);
  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">YTD Gross</div><div className="stat-value green">{fmtCurrency(ytdGross)}</div></div>
        <div className="stat-card"><div className="stat-label">YTD Net</div><div className="stat-value orange">{fmtCurrency(ytdNet)}</div></div>
        <div className="stat-card"><div className="stat-label">Pay Type</div><div className="stat-value blue" style={{ fontSize: 20 }}>{emp.role === "salary" ? "Salary" : "Hourly"}</div></div>
      </div>

      <div className="card">
        <div className="card-title mb-16">Last Pay Statement</div>
        {emp.payStatements?.[0] ? (
          <>
            <div className="info-row"><span className="text-muted">Pay Period</span><span style={{ fontWeight: 600 }}>{emp.payStatements[0].period}</span></div>
            <div className="info-row"><span className="text-muted">Gross Pay</span><span style={{ fontWeight: 700, color: "var(--accent)" }}>{fmtCurrency(emp.payStatements[0].gross)}</span></div>
            <div className="info-row"><span className="text-muted">Net Pay</span><span style={{ fontWeight: 800, color: "var(--accent2)", fontSize: 18 }}>{fmtCurrency(emp.payStatements[0].net)}</span></div>
          </>
        ) : (
          <div className="text-muted text-sm">No statements yet</div>
        )}

        <div className="mt-16">
          <div className="card-title mb-16">All Statements</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Period</th><th>Gross</th><th>Net</th><th>Date</th></tr></thead>
              <tbody>
                {(emp.payStatements || []).map((s, i) => (
                  <tr key={i}>
                    <td>{s.period}</td>
                    <td style={{ color: "var(--accent)" }}>{fmtCurrency(s.gross)}</td>
                    <td style={{ color: "var(--success)" }}>{fmtCurrency(s.net)}</td>
                    <td className="text-muted">{s.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmpTimeOff({ emp, employees, setEmployees, canEditAny }) {
  // employees can submit their own request; admin can change statuses in Team tab (separate)
  const [form, setForm] = useState({ type: "Vacation", start: "", end: "", note: "" });
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (!form.start || !form.end) return;
    const newReq = { id: `TO${Date.now()}`, ...form, status: "Pending" };
    const updated = employees.map((e) => (e.id === emp.id ? { ...e, timeOffRequests: [...e.timeOffRequests, newReq] } : e));
    setEmployees(updated);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 2500);
    setForm({ type: "Vacation", start: "", end: "", note: "" });
  };

  const currentEmp = employees.find((e) => e.id === emp.id) || emp;

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Vacation Hours</div><div className="stat-value green">{currentEmp.timeOff.vacation}</div></div>
        <div className="stat-card"><div className="stat-label">Sick Hours</div><div className="stat-value orange">{currentEmp.timeOff.sick}</div></div>
        <div className="stat-card"><div className="stat-label">Personal Hours</div><div className="stat-value blue">{currentEmp.timeOff.personal}</div></div>
      </div>

      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card">
          <div className="card-title mb-16">Request Time Off</div>
          {submitted && (
            <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "var(--success)", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
              ✓ Request submitted successfully!
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="select-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Vacation</option><option>Sick</option><option>Personal</option><option>Bereavement</option><option>Other</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Start Date</label><input type="date" className="form-input" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">End Date</label><input type="date" className="form-input" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Note (optional)</label><input type="text" className="form-input" placeholder="Add a note..." value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></div>
          <button className="btn btn-primary" onClick={submit}>Submit Request</button>

          {canEditAny && (
            <div className="mt-16 text-sm text-muted">
              Admin note: approvals are in <b>Team → Time Off Approvals</b>.
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title mb-16">My Requests</div>
          {currentEmp.timeOffRequests.length === 0 ? (
            <div className="text-muted text-sm">No requests submitted</div>
          ) : (
            currentEmp.timeOffRequests.map((r, i) => (
              <div key={i} style={{ padding: "12px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 8 }}>
                <div className="flex justify-between items-center mb-8">
                  <span style={{ fontWeight: 600 }}>{r.type}</span>
                  <span className={`badge ${r.status === "Approved" ? "badge-green" : r.status === "Denied" ? "badge-red" : "badge-orange"}`}>{r.status}</span>
                </div>
                <div className="text-sm text-muted">{r.start} → {r.end}</div>
                {r.note && <div className="text-sm text-muted" style={{ marginTop: 8 }}>{r.note}</div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DirectDepositCard({ emp, canEdit, onSave }) {
  const dd = emp.directDeposit || { bank: "", routing: "", account: "", type: "Checking" };
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(dd);

  useEffect(() => {
    // keep form synced when switching "View As"
    setForm(dd);
    setEdit(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emp.id]);

  const save = () => {
    onSave(form);
    setEdit(false);
  };

  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <div className="flex items-center gap-12 mb-24">
        <div style={{ width: 44, height: 44, background: "rgba(91,141,239,0.12)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="bank" color="var(--accent3)" size={22} />
        </div>
        <div>
          <div className="card-title">Direct Deposit</div>
          <div className="card-sub">{canEdit ? "Admin can update employee payment account" : "View only — admin must update"}</div>
        </div>
      </div>

      {!edit ? (
        <>
          <div className="info-row"><span className="text-muted">Bank</span><span style={{ fontWeight: 600 }}>{dd.bank || "—"}</span></div>
          <div className="info-row"><span className="text-muted">Account Type</span><span style={{ fontWeight: 600 }}>{dd.type || "—"}</span></div>
          <div className="info-row"><span className="text-muted">Account Number</span><span style={{ fontWeight: 600 }}>{dd.account || "—"}</span></div>
          <div className="info-row"><span className="text-muted">Routing Number</span><span style={{ fontWeight: 600 }}>{dd.routing || "—"}</span></div>

          <div className="mt-16">
            {canEdit ? (
              <button className="btn btn-primary btn-sm" onClick={() => setEdit(true)}>
                <Icon name="edit" size={14} /> Edit
              </button>
            ) : (
              <div className="text-sm text-muted">Only admin can update direct deposit.</div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="form-group"><label className="form-label">Bank</label>
            <input className="form-input" value={form.bank || ""} onChange={(e) => setForm({ ...form, bank: e.target.value })} />
          </div>
          <div className="form-group"><label className="form-label">Account Type</label>
            <select className="select-input" value={form.type || "Checking"} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option>Checking</option>
              <option>Savings</option>
            </select>
          </div>
          <div className="form-group"><label className="form-label">Routing Number</label>
            <input className="form-input" value={form.routing || ""} onChange={(e) => setForm({ ...form, routing: e.target.value })} />
          </div>
          <div className="form-group"><label className="form-label">Account (masked)</label>
            <input className="form-input" value={form.account || ""} onChange={(e) => setForm({ ...form, account: e.target.value })} />
          </div>

          <div className="flex gap-8">
            <button className="btn btn-primary" onClick={save}>Save</button>
            <button className="btn btn-ghost" onClick={() => { setForm(dd); setEdit(false); }}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}

function EmpTax({ emp }) {
  const tax = emp.tax || { filing: "Single", allowances: 0, federal: 22, state: 6 };
  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <div className="card-title mb-16">Tax Withholding</div>
      <div className="info-row"><span className="text-muted">Filing Status</span><span style={{ fontWeight: 600 }}>{tax.filing}</span></div>
      <div className="info-row"><span className="text-muted">Allowances</span><span style={{ fontWeight: 600 }}>{tax.allowances}</span></div>
      <div className="info-row"><span className="text-muted">Federal Rate</span><span style={{ fontWeight: 600 }}>{tax.federal}%</span></div>
      <div className="info-row"><span className="text-muted">State Rate</span><span style={{ fontWeight: 600 }}>{tax.state}%</span></div>
      <div className="info-row"><span className="text-muted">FICA</span><span style={{ fontWeight: 600 }}>7.65%</span></div>
      <div className="mt-16" style={{ background: "rgba(0,212,170,0.06)", border: "1px solid rgba(0,212,170,0.15)", borderRadius: 10, padding: 16 }}>
        <div className="text-sm text-muted" style={{ marginBottom: 8 }}>Effective Total Withholding</div>
        <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 32, color: "var(--accent)" }}>{(tax.federal + tax.state + 7.65).toFixed(2)}%</div>
      </div>
    </div>
  );
}

function EmpPolicies() {
  const policies = [
    { title: "Employee Code of Conduct", updated: "Jan 2025", pages: 12 },
    { title: "Attendance & Punctuality Policy", updated: "Jan 2025", pages: 4 },
    { title: "Anti-Harassment Policy", updated: "Mar 2024", pages: 8 },
    { title: "PTO & Time Off Policy", updated: "Jan 2025", pages: 6 },
    { title: "Remote Work Policy", updated: "Jun 2024", pages: 5 },
    { title: "Benefits Summary Guide", updated: "Jan 2025", pages: 20 },
  ];
  return (
    <div>
      <div className="card-title mb-16">Company Policies</div>
      <div style={{ display: "grid", gap: 12 }}>
        {policies.map((p, i) => (
          <div key={i} className="card flex justify-between items-center" style={{ padding: "16px 20px" }}>
            <div className="flex items-center gap-12">
              <Icon name="file" color="var(--accent3)" size={20} />
              <div>
                <div style={{ fontWeight: 600 }}>{p.title}</div>
                <div className="text-sm text-muted">Updated {p.updated} · {p.pages} pages</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm flex items-center gap-8">
              <Icon name="download" size={14} />
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmpLearning() {
  const courses = [
    { title: "Workplace Safety Fundamentals", progress: 100, category: "Required", due: null },
    { title: "Customer Service Excellence", progress: 65, category: "Development", due: "2025-03-31" },
    { title: "Anti-Harassment Training", progress: 100, category: "Required", due: null },
    { title: "Leadership Essentials", progress: 20, category: "Development", due: "2025-04-15" },
    { title: "Data Privacy & Security", progress: 0, category: "Required", due: "2025-03-15" },
  ];
  return (
    <div>
      <div className="card-title mb-16">Learning & Development</div>
      <div style={{ display: "grid", gap: 12 }}>
        {courses.map((c, i) => (
          <div key={i} className="card">
            <div className="flex justify-between items-center mb-8">
              <div style={{ fontWeight: 600 }}>{c.title}</div>
              <div className="flex gap-8 items-center">
                <span className={`badge ${c.category === "Required" ? "badge-red" : "badge-blue"}`}>{c.category}</span>
                {c.progress === 100 && <span className="badge badge-green">✓ Complete</span>}
              </div>
            </div>
            {c.due && <div className="text-sm text-muted mb-8">Due: {c.due}</div>}
            <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${c.progress}%`, borderRadius: 3, background: "linear-gradient(90deg, var(--accent), var(--accent3))" }} />
            </div>
            <div className="text-sm text-muted" style={{ marginTop: 8 }}>{c.progress}% complete</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MANAGER / ADMIN TEAM TABS ────────────────────────────────────────────────
function TeamSchedule({ employees }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const shifts = ["8:00 AM - 4:00 PM", "4:00 PM - 12:00 AM", "12:00 AM - 8:00 AM", "OFF"];
  const team = employees.filter((e) => e.active && e.role === "hourly");
  return (
    <div>
      <div className="card-title mb-16">Team Schedule — Demo</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Employee</th>{days.map((d) => <th key={d}>{d}</th>)}</tr></thead>
          <tbody>
            {team.map((e, i) => (
              <tr key={e.id}>
                <td><div style={{ fontWeight: 600 }}>{e.name}</div><div className="text-sm text-muted">{e.position}</div></td>
                {days.map((d, j) => (
                  <td key={`${e.id}-${d}`} style={{ fontSize: 12 }}>
                    <span style={{
                      color: j === 5 || j === 6 ? "var(--text-muted)" : "var(--accent)",
                      background: j === 5 || j === 6 ? "transparent" : "rgba(0,212,170,0.06)",
                      padding: "4px 8px",
                      borderRadius: 6,
                      display: "inline-block",
                    }}>
                      {j === 5 || j === 6 ? "OFF" : shifts[i % 2]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamTimeCard({ employees }) {
  const team = employees.filter((e) => e.active);
  return (
    <div>
      <div className="card-title mb-16">Team Time Cards — Current Period</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Type</th><th>Total Hours</th><th>Est. Pay</th><th>Status</th></tr></thead>
          <tbody>
            {team.map((e) => {
              const hrs = (e.punchHistory || []).reduce((a, r) => a + r.hours, 0);
              const pay = e.role === "hourly" ? hrs * (e.hourlyRate || 0) : (e.salary || 0) / 26;
              return (
                <tr key={e.id}>
                  <td><div style={{ fontWeight: 600 }}>{e.name}</div><div className="text-sm text-muted">{e.position}</div></td>
                  <td><span className={`tag ${e.role === "salary" ? "tag-salary" : "tag-hourly"}`}>{e.role}</span></td>
                  <td style={{ color: "var(--accent)", fontWeight: 700 }}>{hrs.toFixed(1)} hrs</td>
                  <td style={{ color: "var(--success)" }}>{fmtCurrency(pay)}</td>
                  <td><span className="badge badge-green">On Track</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamTimeOffApproval({ employees, setEmployees }) {
  const allRequests = employees.flatMap((e) => (e.timeOffRequests || []).map((r) => ({ ...r, empId: e.id, empName: e.name })));
  const pending = allRequests.filter((r) => r.status === "Pending");

  const updateStatus = (empId, reqId, status) => {
    setEmployees(
      employees.map((e) =>
        e.id !== empId
          ? e
          : { ...e, timeOffRequests: e.timeOffRequests.map((r) => (r.id !== reqId ? r : { ...r, status })) }
      )
    );
  };

  return (
    <div>
      <div className="card-title mb-16">Team Time Off Requests</div>
      {pending.length === 0 && <div className="card text-muted text-sm" style={{ textAlign: "center", padding: 40 }}>No pending requests</div>}
      {pending.map((r) => (
        <div key={`${r.empId}-${r.id}`} className="card mb-16">
          <div className="flex justify-between items-center">
            <div>
              <div style={{ fontWeight: 800 }}>{r.empName}</div>
              <div style={{ fontWeight: 500, marginTop: 6 }}>{r.type} — {r.start} to {r.end}</div>
              {r.note && <div className="text-sm text-muted" style={{ marginTop: 8 }}>{r.note}</div>}
            </div>
            <div className="flex gap-8">
              <button className="btn btn-ghost btn-sm" onClick={() => updateStatus(r.empId, r.id, "Approved")}>
                <Icon name="check" size={14} /> Approve
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => updateStatus(r.empId, r.id, "Denied")}>
                <Icon name="x" size={14} /> Deny
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN-ONLY MANAGEMENT ────────────────────────────────────────────────────
function AdminEmployeeList({ employees, setEmployees, onViewAs }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    password: "",
    role: "hourly",
    position: "",
    department: "",
    hourlyRate: 18,
    salary: 75000,
    manager: false,
  });

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase())
  );

  const addEmployee = () => {
    if (!newEmp.name || !newEmp.email || !newEmp.password) return;
    const emp = {
      ...newEmp,
      id: `E${String(employees.length + 1).padStart(3, "0")}`,
      active: true,
      startDate: today(),
      hourlyRate: newEmp.role === "hourly" ? parseFloat(newEmp.hourlyRate) : null,
      salary: newEmp.role === "salary" ? parseFloat(newEmp.salary) : null,
      tax: { filing: "Single", allowances: 1, federal: 22, state: 6 },
      directDeposit: { bank: "", routing: "", account: "", type: "Checking" },
      timeOff: { vacation: 80, sick: 40, personal: 16 },
      punchHistory: [],
      timeOffRequests: [],
      payStatements: [],
    };
    setEmployees([...employees, emp]);
    setShowAdd(false);
    setNewEmp({ name: "", email: "", password: "", role: "hourly", position: "", department: "", hourlyRate: 18, salary: 75000, manager: false });
  };

  const deleteEmployee = (id) => {
    if (window.confirm("Remove this employee? This action cannot be undone.")) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16" style={{ gap: 12, flexWrap: "wrap" }}>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: 320 }}
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setShowAdd(true)}>
          <Icon name="plus" size={16} />
          Add Employee
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Department</th>
              <th>Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id}>
                <td>
                  <div className="flex items-center gap-12">
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,var(--accent2),var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {initials(e.name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{e.name}</div>
                      <div className="text-sm text-muted">{e.email} · {e.id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`tag ${e.role === "salary" ? "tag-salary" : "tag-hourly"}`}>{e.role}</span>
                  {e.manager && <span className="badge badge-teal" style={{ marginLeft: 6, fontSize: 10 }}>MGR</span>}
                </td>
                <td>{e.department}</td>
                <td style={{ color: "var(--accent)" }}>
                  {e.role === "hourly" ? `$${e.hourlyRate}/hr` : `$${(e.salary / 1000).toFixed(0)}k/yr`}
                </td>
                <td><span className={`badge ${e.active ? "badge-green" : "badge-red"}`}>{e.active ? "Active" : "Inactive"}</span></td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => onViewAs(e.id)}>
                    <Icon name="user" size={14} />
                    View As
                  </button>
                  <button className="btn-icon" style={{ color: "var(--danger)" }} onClick={() => deleteEmployee(e.id)} title="Remove employee">
                    <Icon name="trash" size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">Add New Employee</div>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="e.g. John Smith" value={newEmp.name} onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="john@company.com" value={newEmp.email} onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Temporary password" value={newEmp.password} onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })} /></div>

            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group"><label className="form-label">Position</label><input className="form-input" placeholder="e.g. Cashier" value={newEmp.position} onChange={(e) => setNewEmp({ ...newEmp, position: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Department</label><input className="form-input" placeholder="e.g. Retail" value={newEmp.department} onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })} /></div>
            </div>

            <div className="form-group">
              <label className="form-label">Pay Type</label>
              <select className="select-input" value={newEmp.role} onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value })}>
                <option value="hourly">Hourly</option>
                <option value="salary">Salary</option>
              </select>
            </div>

            {newEmp.role === "hourly" && (
              <div className="form-group"><label className="form-label">Hourly Rate ($)</label><input className="form-input" type="number" value={newEmp.hourlyRate} onChange={(e) => setNewEmp({ ...newEmp, hourlyRate: e.target.value })} /></div>
            )}
            {newEmp.role === "salary" && (
              <div className="form-group"><label className="form-label">Annual Salary ($)</label><input className="form-input" type="number" value={newEmp.salary} onChange={(e) => setNewEmp({ ...newEmp, salary: e.target.value })} /></div>
            )}

            <div className="form-group">
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={newEmp.manager} onChange={(e) => setNewEmp({ ...newEmp, manager: e.target.checked })} />
                Manager / Supervisor
              </label>
            </div>

            <div className="flex gap-8 mt-16">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addEmployee}>Create Employee</button>
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminAttendance({ employees }) {
  const allPunches = employees
    .flatMap((e) => (e.punchHistory || []).map((p) => ({ ...p, empName: e.name, empId: e.id, position: e.position, rate: e.hourlyRate })))
    .sort((a, b) => b.date.localeCompare(a.date));

  const downloadCSV = () => {
    const headers = "Employee,ID,Position,Date,Clock In,Clock Out,Hours,Earnings";
    const rows = allPunches.map(
      (r) => `${r.empName},${r.empId},${r.position},${r.date},${r.in},${r.out || ""},${(r.hours || 0).toFixed(2)},${((r.hours || 0) * (r.rate || 0)).toFixed(2)}`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "attendance_report.csv";
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-16">
        <div className="card-title">All Punch Records</div>
        <button className="btn btn-ghost btn-sm" onClick={downloadCSV}><Icon name="download" size={14} />Export CSV</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Date</th><th>Clock In</th><th>Clock Out</th><th>Hours</th><th>Earnings</th></tr></thead>
          <tbody>
            {allPunches.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No records found</td></tr>
            ) : (
              allPunches.map((r, i) => (
                <tr key={`${r.empId}-${r.date}-${i}`}>
                  <td><div style={{ fontWeight: 600 }}>{r.empName}</div><div className="text-sm text-muted">{r.position}</div></td>
                  <td>{r.date}</td>
                  <td style={{ color: "var(--success)" }}>{r.in}</td>
                  <td style={{ color: "var(--accent2)" }}>{r.out || "—"}</td>
                  <td style={{ fontWeight: 700, color: "var(--accent)" }}>{(r.hours || 0).toFixed(2)}</td>
                  <td style={{ color: "var(--success)" }}>{r.rate ? fmtCurrency((r.hours || 0) * r.rate) : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPayroll({ employees }) {
  const totalPayroll = employees.reduce((a, e) => {
    const hrs = (e.punchHistory || []).reduce((s, r) => s + r.hours, 0);
    return a + (e.role === "hourly" ? hrs * (e.hourlyRate || 0) : (e.salary || 0) / 26);
  }, 0);

  const downloadCSV = () => {
    const headers = "Employee,ID,Type,Position,Hours/Period,Gross Pay";
    const rows = employees.map((e) => {
      const hrs = (e.punchHistory || []).reduce((a, r) => a + r.hours, 0);
      const gross = e.role === "hourly" ? hrs * (e.hourlyRate || 0) : (e.salary || 0) / 26;
      return `${e.name},${e.id},${e.role},${e.position},${hrs.toFixed(2)},${gross.toFixed(2)}`;
    });
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "payroll_report.csv";
    a.click();
  };

  return (
    <div>
      <div className="stat-grid mb-24">
        <div className="stat-card"><div className="stat-label">Total Payroll (Period)</div><div className="stat-value green">{fmtCurrency(totalPayroll)}</div></div>
        <div className="stat-card"><div className="stat-label">Active Employees</div><div className="stat-value blue">{employees.filter((e) => e.active).length}</div></div>
        <div className="stat-card"><div className="stat-label">Hourly Staff</div><div className="stat-value orange">{employees.filter((e) => e.role === "hourly").length}</div></div>
        <div className="stat-card"><div className="stat-label">Salaried Staff</div><div className="stat-value">{employees.filter((e) => e.role === "salary").length}</div></div>
      </div>

      <div className="flex justify-between items-center mb-16">
        <div className="card-title">Payroll Summary</div>
        <button className="btn btn-ghost btn-sm" onClick={downloadCSV}><Icon name="download" size={14} />Export CSV</button>
      </div>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Employee</th><th>Type</th><th>Hours / Period</th><th>Rate</th><th>Gross Pay</th><th>Est. Net</th></tr></thead>
          <tbody>
            {employees.map((e) => {
              const hrs = (e.punchHistory || []).reduce((a, r) => a + r.hours, 0);
              const gross = e.role === "hourly" ? hrs * (e.hourlyRate || 0) : (e.salary || 0) / 26;
              const net = gross * (1 - (22 + 6 + 7.65) / 100);
              return (
                <tr key={e.id}>
                  <td><div style={{ fontWeight: 600 }}>{e.name}</div><div className="text-sm text-muted">{e.id}</div></td>
                  <td><span className={`tag ${e.role === "salary" ? "tag-salary" : "tag-hourly"}`}>{e.role}</span></td>
                  <td>{e.role === "hourly" ? `${hrs.toFixed(1)} hrs` : "Salary"}</td>
                  <td>{e.role === "hourly" ? `$${e.hourlyRate}/hr` : `$${(e.salary / 1000).toFixed(0)}k/yr`}</td>
                  <td style={{ color: "var(--accent)", fontWeight: 700 }}>{fmtCurrency(gross)}</td>
                  <td style={{ color: "var(--success)" }}>{fmtCurrency(net)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminDashboard({ employees }) {
  const totalHrs = employees.flatMap((e) => e.punchHistory || []).reduce((a, r) => a + r.hours, 0);
  const totalPayroll = employees.reduce((a, e) => {
    const hrs = (e.punchHistory || []).reduce((s, r) => s + r.hours, 0);
    return a + (e.role === "hourly" ? hrs * (e.hourlyRate || 0) : (e.salary || 0) / 26);
  }, 0);
  const pendingTO = employees.flatMap((e) => e.timeOffRequests || []).filter((r) => r.status === "Pending").length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "Syne", fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Admin Dashboard</div>
        <div className="text-muted">Overview (demo data)</div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total Employees</div><div className="stat-value blue">{employees.length}</div></div>
        <div className="stat-card"><div className="stat-label">Period Payroll</div><div className="stat-value green">{fmtCurrency(totalPayroll)}</div></div>
        <div className="stat-card"><div className="stat-label">Hours Logged</div><div className="stat-value orange">{totalHrs.toFixed(1)}</div></div>
        <div className="stat-card"><div className="stat-label">Pending Time Off</div><div className="stat-value" style={{ color: "var(--warning)" }}>{pendingTO}</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title mb-16">Recent Clock-ins</div>
          {employees.flatMap((e) => (e.punchHistory || []).slice(-1).map((p) => ({ ...p, name: e.name }))).slice(-5).map((p, i) => (
            <div key={`${p.name}-${i}`} className="info-row">
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <span className="text-sm text-muted">{p.date} · {p.in} → {p.out || "—"}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title mb-16">Staff Breakdown</div>
          <div className="info-row"><span className="text-muted">Hourly Employees</span><span style={{ fontWeight: 700 }}>{employees.filter((e) => e.role === "hourly").length}</span></div>
          <div className="info-row"><span className="text-muted">Salaried Employees</span><span style={{ fontWeight: 700 }}>{employees.filter((e) => e.role === "salary").length}</span></div>
          <div className="info-row"><span className="text-muted">Managers/Supervisors</span><span style={{ fontWeight: 700 }}>{employees.filter((e) => e.manager).length}</span></div>
          <div className="info-row"><span className="text-muted">Departments</span><span style={{ fontWeight: 700 }}>{[...new Set(employees.map((e) => e.department))].length}</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── GPS SETTINGS / STATUS ────────────────────────────────────────────────────
function GPSStatus({ office, location }) {
  const dist = useMemo(() => haversineMeters({ lat: office.lat, lng: office.lng }, location), [office.lat, office.lng, location]);
  const inRange = dist != null ? dist <= office.radiusMeters : false;

  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <div className="card-title mb-16">GPS Status</div>

      <div className="info-row">
        <span className="text-muted">Office radius</span>
        <span style={{ fontWeight: 700 }}>{office.radiusMeters} m</span>
      </div>

      <div className="info-row">
        <span className="text-muted">Your location</span>
        <span style={{ fontWeight: 700 }}>
          {location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : "Not shared"}
        </span>
      </div>

      <div className="info-row">
        <span className="text-muted">Distance from office</span>
        <span style={{ fontWeight: 800, color: dist == null ? "var(--text-muted)" : inRange ? "var(--success)" : "var(--danger)" }}>
          {dist == null ? "—" : `${Math.round(dist)} m`}
        </span>
      </div>

      <div className="mt-16">
        {dist == null ? (
          <div className="text-sm text-muted">
            Location permission not granted. Ask admin if your policy requires GPS for punch.
          </div>
        ) : (
          <span className={`badge ${inRange ? "badge-green" : "badge-red"}`}>
            {inRange ? "✅ In Range" : "❌ Out of Range"}
          </span>
        )}
      </div>
    </div>
  );
}

function GPSSettings({ office, setOffice, canEdit }) {
  const [form, setForm] = useState(office);

  useEffect(() => {
    setForm(office);
  }, [office]);

  const save = () => {
    setOffice({
      officeName: form.officeName || "Main Office",
      lat: Number(form.lat),
      lng: Number(form.lng),
      radiusMeters: Number(form.radiusMeters),
    });
  };

  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <div className="card-title mb-16">GPS Settings</div>
      <div className="text-sm text-muted mb-16">
        {canEdit ? "Admin can set the office geofence used for status checks." : "View only — admin can update GPS settings."}
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Office Name</label>
          <input className="form-input" value={form.officeName || ""} onChange={(e) => setForm({ ...form, officeName: e.target.value })} disabled={!canEdit} />
        </div>
        <div className="form-group">
          <label className="form-label">Radius (meters)</label>
          <input className="form-input" type="number" value={form.radiusMeters} onChange={(e) => setForm({ ...form, radiusMeters: e.target.value })} disabled={!canEdit} />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Latitude</label>
          <input className="form-input" type="number" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} disabled={!canEdit} />
        </div>
        <div className="form-group">
          <label className="form-label">Longitude</label>
          <input className="form-input" type="number" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} disabled={!canEdit} />
        </div>
      </div>

      <div className="flex gap-8">
        {canEdit ? (
          <>
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={save}>
              <Icon name="check" size={14} /> Save
            </button>
            <button className="btn btn-ghost" style={{ width: "auto" }} onClick={() => setForm(office)}>
              Reset
            </button>
          </>
        ) : (
          <div className="text-sm text-muted">Only admin can edit GPS settings.</div>
        )}
      </div>
    </div>
  );
}

// ─── PUNCH STATION (unchanged, demo) ──────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div>
      <div style={{
        fontFamily: "Syne", fontSize: 64, fontWeight: 800,
        background: "linear-gradient(135deg, var(--accent), var(--accent3))",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -2
      }}>
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </div>
      <div className="text-muted" style={{ fontSize: 16, marginBottom: 30 }}>
        {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
      </div>
    </div>
  );
}

function PunchStation({ employees, setEmployees, onBack }) {
  const [email, setEmail] = useState("");
  const [emp, setEmp] = useState(null);
  const [error, setError] = useState("");
  const [punched, setPunched] = useState(null);

  const findEmp = () => {
    const found = employees.find((e) => e.email.toLowerCase() === email.toLowerCase() && e.role === "hourly");
    if (!found) {
      setError("Employee not found or not hourly staff.");
      return;
    }
    setError("");
    const todayStr = today();
    const alreadyIn = (found.punchHistory || []).find((p) => p.date === todayStr && !p.out);
    setEmp({ ...found, alreadyIn: !!alreadyIn });
  };

  const punch = (type) => {
    const now = timeNow();
    const todayStr = today();
    let updated;
    if (type === "in") {
      updated = { ...emp, punchHistory: [...(emp.punchHistory || []), { date: todayStr, in: now, out: null, hours: 0 }] };
    } else {
      const idx = (emp.punchHistory || []).findIndex((p) => p.date === todayStr && !p.out);
      const newHistory = [...(emp.punchHistory || [])];
      if (idx >= 0) {
        const inTime = newHistory[idx].in.split(":");
        const outTime = now.split(":");
        const hrs = (parseInt(outTime[0], 10) * 60 + parseInt(outTime[1], 10) - (parseInt(inTime[0], 10) * 60 + parseInt(inTime[1], 10))) / 60;
        newHistory[idx] = { ...newHistory[idx], out: now, hours: Math.max(0, hrs) };
      }
      updated = { ...emp, punchHistory: newHistory };
    }
    setEmployees(employees.map((e) => (e.id === updated.id ? updated : e)));
    setPunched(type);
    window.setTimeout(() => { setEmp(null); setEmail(""); setPunched(null); }, 2500);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--navy)", backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(91,141,239,0.1) 0%, transparent 70%)"
    }}>
      <div style={{
        background: "var(--navy-light)", border: "1px solid var(--border)", borderRadius: 24,
        padding: "60px 50px", width: 480, maxWidth: "95vw", textAlign: "center",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5)"
      }}>
        <div className="flex justify-between items-center mb-16">
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: "var(--text-muted)" }}>WorkForce Pro</div>
          <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ fontSize: 12, width: "auto" }}>← Back</button>
        </div>

        <LiveClock />

        {punched && (
          <div style={{
            background: punched === "in" ? "rgba(0,212,170,0.1)" : "rgba(255,107,74,0.1)",
            border: `1px solid ${punched === "in" ? "rgba(0,212,170,0.3)" : "rgba(255,107,74,0.3)"}`,
            borderRadius: 16, padding: 30, marginTop: 16
          }}>
            <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28, marginBottom: 8 }}>
              {punched === "in" ? "✓ Clocked In!" : "✓ Clocked Out!"}
            </div>
            <div className="text-muted">{emp?.name}</div>
          </div>
        )}

        {!punched && !emp && (
          <div style={{ background: "rgba(91,141,239,0.06)", border: "1px solid rgba(91,141,239,0.15)", borderRadius: 14, padding: 24 }}>
            <div style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 16 }}>Employee Clock Station</div>
            <div className="form-group">
              <label className="form-label">Enter Your Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && findEmp()}
              />
            </div>
            {error && <div className="error-msg">{error}</div>}
            <button className="btn btn-primary" onClick={findEmp}>Find My Record</button>
          </div>
        )}

        {!punched && emp && (
          <>
            <div style={{
              background: emp.alreadyIn ? "rgba(255,107,74,0.08)" : "rgba(0,212,170,0.08)",
              border: `1px solid ${emp.alreadyIn ? "rgba(255,107,74,0.2)" : "rgba(0,212,170,0.2)"}`,
              borderRadius: 12, padding: 16, margin: "24px 0", fontSize: 15
            }}>
              <div style={{ fontWeight: 700 }}>{emp.name}</div>
              <div className="text-sm">{emp.position} · {emp.department}</div>
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>
                Status: {emp.alreadyIn ? "🟡 Currently Clocked In" : "⚪ Not Clocked In"}
              </div>
            </div>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              {!emp.alreadyIn && (
                <button className="btn btn-primary" onClick={() => punch("in")}>CLOCK IN</button>
              )}
              {emp.alreadyIn && (
                <button className="btn btn-danger" onClick={() => punch("out")}>CLOCK OUT</button>
              )}
              <button className="btn btn-ghost" onClick={() => { setEmp(null); setEmail(""); }}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ employees, onLogin, onPunchStation }) {
  const [mode, setMode] = useState("employee"); // employee | admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (mode === "admin") {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        onLogin({ role: "admin" });
      } else {
        setError("Invalid admin credentials.");
      }
    } else {
      const emp = employees.find((e) => e.email.toLowerCase() === email.toLowerCase() && e.password === password && e.active);
      if (emp) onLogin({ role: "employee", empId: emp.id });
      else setError("Invalid email or password.");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <div><div className="login-logo-mark">W</div></div>
          <div className="login-title">WorkForce Pro</div>
          <div className="login-sub">Employee Management System</div>
        </div>

        <div className="login-type-tabs">
          <button className={`login-tab ${mode === "employee" ? "active" : ""}`} onClick={() => { setMode("employee"); setError(""); }}>
            Employee Login
          </button>
          <button className={`login-tab ${mode === "admin" ? "active" : ""}`} onClick={() => { setMode("admin"); setError(""); }}>
            Admin Login
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            type="email"
            placeholder={mode === "admin" ? "admin@company.com" : "your@company.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={handleLogin}>
          {mode === "admin" ? "🛡 Sign In as Admin" : "→ Sign In"}
        </button>

        {mode === "employee" && (
          <button className="btn btn-ghost w-full" onClick={onPunchStation}>
            <Icon name="clock" size={16} /> Hourly Staff — Clock In/Out Station
          </button>
        )}

        <div style={{ marginTop: 20, padding: 12, background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid var(--border)" }}>
          <div className="text-xs text-muted" style={{ marginBottom: 6, fontWeight: 600 }}>DEMO CREDENTIALS</div>
          <div className="text-xs text-muted">Admin: admin@company.com / admin2025</div>
          <div className="text-xs text-muted">Employee: marcus@company.com / pass123</div>
          <div className="text-xs text-muted">Manager: sarah@company.com / pass123</div>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED SHELL ─────────────────────────────────────────────────────────────
function SharedApp({
  session,
  employees,
  setEmployees,
  office,
  setOffice,
  location,
  requestLocation,
  onLogout,
}) {
  const isAdmin = session.role === "admin";
  const canEdit = isAdmin;

  const viewingEmpId = session.viewAsEmpId || session.empId;
  const viewingEmp = useMemo(() => employees.find((e) => e.id === viewingEmpId) || employees[0], [employees, viewingEmpId]);
  const isManager = !!viewingEmp?.manager;

  const [tab, setTab] = useState("home");

  // if switching view-as, reset to home to avoid "tab not valid"
  useEffect(() => {
    setTab("home");
  }, [viewingEmpId]);

  const baseTabs = [
    { id: "home", label: "Home", icon: "home", section: "Employee" },
    { id: "timecard", label: "Time Card", icon: "clock", section: "Employee" },
    { id: "pay", label: "Pay", icon: "dollar", section: "Employee" },
    { id: "timeoff", label: "Time Off", icon: "calendar", section: "Employee" },
    { id: "directdeposit", label: "Direct Deposit", icon: "bank", section: "Employee" },
    { id: "tax", label: "Tax Withholding", icon: "file", section: "Employee" },
    { id: "policies", label: "Policies", icon: "shield", section: "Employee" },
    { id: "learning", label: "Learning", icon: "book", section: "Employee" },
    { id: "gpsstatus", label: "GPS Status", icon: "settings", section: "Employee" },
  ];

  const managerTabs = [
    { id: "teamschedule", label: "Team Schedule", icon: "calendar", section: "Team" },
    { id: "teamtimecard", label: "Team Time Card", icon: "clock", section: "Team" },
    { id: "teamtimeoff", label: "Time Off Approvals", icon: "users", section: "Team" },
  ];

  const adminTabs = [
    { id: "admindashboard", label: "Admin Dashboard", icon: "home", section: "Admin" },
    { id: "employees", label: "Employees", icon: "users", section: "Admin" },
    { id: "attendance", label: "Attendance", icon: "clock", section: "Admin" },
    { id: "payroll", label: "Payroll", icon: "dollar", section: "Admin" },
    { id: "gpssettings", label: "GPS Settings", icon: "settings", section: "Admin" },
  ];

  const tabs = [
    ...baseTabs,
    ...(isManager || isAdmin ? managerTabs : []),
    ...(isAdmin ? adminTabs : []),
  ];

  const grouped = useMemo(() => {
    const map = new Map();
    for (const t of tabs) {
      if (!map.has(t.section)) map.set(t.section, []);
      map.get(t.section).push(t);
    }
    return [...map.entries()];
  }, [tabs]);

  const currentEmpData = useMemo(() => employees.find((e) => e.id === viewingEmp.id) || viewingEmp, [employees, viewingEmp]);

  const updateDirectDeposit = (newDD) => {
    setEmployees((prev) => prev.map((e) => (e.id === viewingEmp.id ? { ...e, directDeposit: newDD } : e)));
  };

  const onViewAs = (empId) => {
    // admin only
    if (!isAdmin) return;
    // store in session via parent setter pattern: we'll pass callback in root below
  };

  const render = () => {
    switch (tab) {
      case "home":
        return <EmpHome emp={currentEmpData} employees={employees} setTab={setTab} />;
      case "timecard":
        return <EmpTimeCard emp={currentEmpData} />;
      case "pay":
        return <EmpPay emp={currentEmpData} />;
      case "timeoff":
        return <EmpTimeOff emp={currentEmpData} employees={employees} setEmployees={setEmployees} canEditAny={isAdmin} />;
      case "directdeposit":
        return <DirectDepositCard emp={currentEmpData} canEdit={canEdit} onSave={updateDirectDeposit} />;
      case "tax":
        return <EmpTax emp={currentEmpData} />;
      case "policies":
        return <EmpPolicies />;
      case "learning":
        return <EmpLearning />;
      case "gpsstatus":
        return (
          <div>
            <div className="flex justify-between items-center mb-16" style={{ flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="card-title">GPS</div>
                <div className="text-sm text-muted">
                  Employees can view status. Admin controls settings.
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={requestLocation} style={{ width: "auto" }}>
                <Icon name="settings" size={14} /> Refresh Location
              </button>
            </div>
            <GPSStatus office={office} location={location} />
          </div>
        );

      // Team/Manager
      case "teamschedule":
        return <TeamSchedule employees={employees} />;
      case "teamtimecard":
        return <TeamTimeCard employees={employees} />;
      case "teamtimeoff":
        return <TeamTimeOffApproval employees={employees} setEmployees={setEmployees} />;

      // Admin-only
      case "admindashboard":
        return <AdminDashboard employees={employees} />;
      case "employees":
        return (
          <AdminEmployeeList
            employees={employees}
            setEmployees={setEmployees}
            onViewAs={(empId) => session.setViewAs(empId)}
          />
        );
      case "attendance":
        return <AdminAttendance employees={employees} />;
      case "payroll":
        return <AdminPayroll employees={employees} />;
      case "gpssettings":
        return <GPSSettings office={office} setOffice={setOffice} canEdit={canEdit} />;

      default:
        return null;
    }
  };

  return (
    <div className="shell">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">W</div>
          <div className="logo-text">WorkForce Pro</div>
        </div>

        <div className="sidebar-nav">
          {grouped.map(([section, items]) => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {items.map((t) => (
                <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                  <Icon name={t.icon} size={18} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-user">
          <div className="user-card">
            <div className="user-avatar">{isAdmin ? "AD" : initials(currentEmpData.name)}</div>
            <div className="user-info">
              <div className="user-name">{isAdmin ? "Administrator" : currentEmpData.name}</div>
              <div className="user-role">
                {isAdmin ? (
                  <span>Admin • Viewing: {currentEmpData.name}</span>
                ) : (
                  <span>{currentEmpData.position}</span>
                )}
              </div>
            </div>
            <button className="btn-icon" onClick={onLogout} title="Logout"><Icon name="logout" size={16} /></button>
          </div>
        </div>
      </nav>

      <main className="main">
        <div className="topbar">
          <div className="topbar-title">{tabs.find((t) => t.id === tab)?.label || "Dashboard"}</div>

          {isAdmin && <span className="badge badge-red">Admin</span>}
          {!isAdmin && currentEmpData.manager && <span className="badge badge-teal">Manager</span>}

          <button className="btn btn-ghost btn-sm" onClick={onLogout} style={{ width: "auto" }}>
            <Icon name="logout" size={14} /> Sign Out
          </button>
        </div>

        <div className="page">{render()}</div>
      </main>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);

  // session:
  // - null
  // - { role: 'employee', empId }
  // - { role: 'admin', viewAsEmpId, setViewAs }
  const [session, setSession] = useState(null);
  const [showPunch, setShowPunch] = useState(false);

  // GPS office settings
  const [office, setOffice] = useState({
    officeName: "Main Office",
    lat: 43.6532,
    lng: -79.3832,
    radiusMeters: 150,
  });

  // GPS live location (local device)
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = styles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      },
      () => {
        setLocation(null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // If admin logged in and has no viewAs selected, pick first employee
  useEffect(() => {
    if (session?.role === "admin") {
      const firstId = employees[0]?.id;
      if (firstId && !session.viewAsEmpId) {
        setSession((s) => ({ ...s, viewAsEmpId: firstId }));
      }
    }
  }, [session?.role, session?.viewAsEmpId, employees]);

  if (showPunch) {
    return <PunchStation employees={employees} setEmployees={setEmployees} onBack={() => setShowPunch(false)} />;
  }

  if (!session) {
    return (
      <Login
        employees={employees}
        onLogin={(s) => {
          if (s.role === "admin") {
            setSession({
              role: "admin",
              viewAsEmpId: employees[0]?.id || null,
              setViewAs: (empId) => setSession((prev) => ({ ...prev, viewAsEmpId: empId })),
            });
          } else {
            setSession({ role: "employee", empId: s.empId });
          }
          // optional: grab location on login
          requestLocation();
        }}
        onPunchStation={() => setShowPunch(true)}
      />
    );
  }

  return (
    <SharedApp
      session={{
        ...session,
        // allow child to set viewAs via function if admin
        setViewAs: (empId) => setSession((prev) => ({ ...prev, viewAsEmpId: empId })),
      }}
      employees={employees}
      setEmployees={setEmployees}
      office={office}
      setOffice={setOffice}
      location={location}
      requestLocation={requestLocation}
      onLogout={() => setSession(null)}
    />
  );
}
