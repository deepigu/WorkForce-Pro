import { useState, useEffect, useRef, useMemo } from "react";

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const Logo = ({ size = 36 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width={size} height={size} style={{flexShrink:0}}>
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor:'#0D1117',stopOpacity:1}}/><stop offset="100%" style={{stopColor:'#161B22',stopOpacity:1}}/></linearGradient>
      <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor:'#00E676',stopOpacity:1}}/><stop offset="100%" style={{stopColor:'#00C853',stopOpacity:1}}/></linearGradient>
      <linearGradient id="greenGrad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor:'#69F0AE',stopOpacity:1}}/><stop offset="100%" style={{stopColor:'#00E676',stopOpacity:1}}/></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <clipPath id="roundedSquare"><rect x="40" y="40" width="320" height="320" rx="72" ry="72"/></clipPath>
    </defs>
    <rect x="40" y="40" width="320" height="320" rx="72" ry="72" fill="url(#bgGrad)"/>
    <g clipPath="url(#roundedSquare)" opacity="0.04">
      <line x1="40" y1="100" x2="360" y2="100" stroke="white" strokeWidth="1"/><line x1="40" y1="160" x2="360" y2="160" stroke="white" strokeWidth="1"/>
      <line x1="40" y1="220" x2="360" y2="220" stroke="white" strokeWidth="1"/><line x1="40" y1="280" x2="360" y2="280" stroke="white" strokeWidth="1"/>
      <line x1="100" y1="40" x2="100" y2="360" stroke="white" strokeWidth="1"/><line x1="160" y1="40" x2="160" y2="360" stroke="white" strokeWidth="1"/>
      <line x1="220" y1="40" x2="220" y2="360" stroke="white" strokeWidth="1"/><line x1="280" y1="40" x2="280" y2="360" stroke="white" strokeWidth="1"/>
    </g>
    <circle cx="200" cy="195" r="100" fill="#00E676" opacity="0.04"/>
    <circle cx="130" cy="148" r="22" fill="url(#greenGrad2)" filter="url(#glow)"/>
    <path d="M88 235 Q88 205 130 205 Q172 205 172 235 L172 248 Q172 252 168 252 L92 252 Q88 252 88 248 Z" fill="url(#greenGrad2)" opacity="0.9"/>
    <circle cx="200" cy="138" r="26" fill="url(#greenGrad)" filter="url(#glow)"/>
    <path d="M154 230 Q154 196 200 196 Q246 196 246 230 L246 248 Q246 254 240 254 L160 254 Q154 254 154 248 Z" fill="url(#greenGrad)"/>
    <circle cx="270" cy="148" r="22" fill="url(#greenGrad2)" filter="url(#glow)"/>
    <path d="M228 235 Q228 205 270 205 Q312 205 312 235 L312 248 Q312 252 308 252 L232 252 Q228 252 228 248 Z" fill="url(#greenGrad2)" opacity="0.9"/>
    <polyline points="88,280 120,280 138,258 155,300 172,265 188,280 212,280 228,258 245,300 262,265 278,280 312,280" fill="none" stroke="url(#greenGrad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" opacity="0.85"/>
    <rect x="140" y="318" width="120" height="4" rx="2" fill="url(#greenGrad)" opacity="0.5"/>
    <rect x="40" y="40" width="320" height="320" rx="72" ry="72" fill="none" stroke="url(#greenGrad)" strokeWidth="1.5" opacity="0.25"/>
  </svg>
);

// ─── MULTI-COMPANY DATA ───────────────────────────────────────────────────────
const COMPANIES = [
  { id: "C001", name: "RetailCo Inc.", plan: "Growth", employees: 12, color: "#00D4AA" },
  { id: "C002", name: "QuickMart LLC", plan: "Starter", employees: 6, color: "#5B8DEF" },
  { id: "C003", name: "WarehousePro", plan: "Enterprise", employees: 34, color: "#FF6B4A" },
];

const SUPER_ADMIN = { email: "superadmin@workforcepro.com", password: "super2025" };

const INITIAL_EMPLOYEES = [
  { id:"E001", companyId:"C001", name:"Marcus Johnson", email:"marcus@company.com", password:"pass123", photo:null,
    role:"hourly", position:"Cashier", department:"Retail", hourlyRate:18, salary:null, manager:false, active:true, startDate:"2023-03-15",
    tax:{filing:"Single",allowances:1,federal:22,state:6}, directDeposit:{bank:"Chase",routing:"021000021",account:"****4521",type:"Checking"},
    timeOff:{vacation:80,sick:40,personal:16}, punchHistory:[{date:"2025-02-20",in:"08:02",out:"16:05",hours:8.05,lat:40.7128,lng:-74.006},{date:"2025-02-21",in:"08:00",out:"16:00",hours:8.0,lat:40.7128,lng:-74.006}],
    timeOffRequests:[{id:"TO001",type:"Vacation",start:"2025-03-10",end:"2025-03-14",status:"Pending",note:"Family trip"}],
    payStatements:[{period:"Feb 1-15, 2025",gross:1440,net:1123,date:"2025-02-20"},{period:"Jan 16-31, 2025",gross:1440,net:1123,date:"2025-02-05"}] },
  { id:"E002", companyId:"C001", name:"Sarah Chen", email:"sarah@company.com", password:"pass123", photo:null,
    role:"salary", position:"Store Manager", department:"Management", hourlyRate:null, salary:75000, manager:true, active:true, startDate:"2021-06-01",
    tax:{filing:"Married",allowances:2,federal:22,state:6}, directDeposit:{bank:"Bank of America",routing:"026009593",account:"****8834",type:"Checking"},
    timeOff:{vacation:120,sick:60,personal:24}, punchHistory:[], timeOffRequests:[],
    payStatements:[{period:"Feb 1-15, 2025",gross:3125,net:2341,date:"2025-02-20"},{period:"Jan 16-31, 2025",gross:3125,net:2341,date:"2025-02-05"}] },
  { id:"E003", companyId:"C001", name:"David Okafor", email:"david@company.com", password:"pass123", photo:null,
    role:"hourly", position:"Warehouse Associate", department:"Operations", hourlyRate:20, salary:null, manager:false, active:true, startDate:"2022-11-20",
    tax:{filing:"Single",allowances:0,federal:22,state:6}, directDeposit:{bank:"Wells Fargo",routing:"121000248",account:"****2209",type:"Savings"},
    timeOff:{vacation:80,sick:40,personal:16}, punchHistory:[{date:"2025-02-20",in:"09:00",out:"17:30",hours:8.5,lat:40.7128,lng:-74.006}],
    timeOffRequests:[], payStatements:[{period:"Feb 1-15, 2025",gross:1600,net:1230,date:"2025-02-20"}] },
];

const ADMIN_CREDENTIALS = { email:"admin@company.com", password:"admin2025", companyId:"C001" };

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size=20, color="currentColor" }) => {
  const icons = {
    clock: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
    dollar: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    calendar: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    users: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    shield: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    logout: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    check: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><polyline points="20,6 9,17 4,12"/></svg>,
    x: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    download: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    plus: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    trash: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    home: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
    file: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
    book: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    settings: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    bell: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    user: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    bank: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12,2 20,7 4,7"/></svg>,
    edit: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    chartbar: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>,
    chat: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    mappin: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    sun: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    camera: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    building: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>,
    pdf: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
    send: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
    star: <svg width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
  };
  return icons[name] || null;
};

// ─── THEME STYLES ─────────────────────────────────────────────────────────────
const getStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --navy: ${dark ? '#0A0F1E' : '#F0F4F8'};
    --navy-mid: ${dark ? '#111827' : '#FFFFFF'};
    --navy-light: ${dark ? '#1C2740' : '#FFFFFF'};
    --navy-card: ${dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF'};
    --accent: #00D4AA; --accent2: #FF6B4A; --accent3: #5B8DEF;
    --text: ${dark ? '#F0F4FF' : '#0A0F1E'};
    --text-muted: ${dark ? '#7A8BA6' : '#6B7280'};
    --border: ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)'};
    --card: ${dark ? 'rgba(255,255,255,0.04)' : '#FFFFFF'};
    --card-hover: ${dark ? 'rgba(255,255,255,0.07)' : '#F9FAFB'};
    --success: #10B981; --warning: #F59E0B; --danger: #EF4444;
    --radius: 14px; --radius-sm: 8px;
    --shadow: ${dark ? 'none' : '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'};
  }
  body { font-family: 'DM Sans', sans-serif; background: var(--navy); color: var(--text); min-height: 100vh; transition: background 0.3s, color 0.3s; }
  .login-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--navy); background-image:radial-gradient(ellipse at 20% 50%, rgba(0,212,170,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(91,141,239,0.06) 0%, transparent 50%); }
  .login-card { background:var(--navy-light); border:1px solid var(--border); border-radius:20px; padding:48px 40px; width:440px; max-width:95vw; box-shadow:0 40px 80px rgba(0,0,0,0.3); }
  .login-logo { text-align:center; margin-bottom:32px; }
  .login-logo-mark { display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px; }
  .login-title { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; letter-spacing:-0.5px; }
  .login-sub { color:var(--text-muted); font-size:14px; margin-top:4px; }
  .login-type-tabs { display:flex; gap:8px; margin-bottom:28px; background:var(--navy); border-radius:var(--radius-sm); padding:4px; }
  .login-tab { flex:1; padding:10px; border:none; border-radius:6px; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; cursor:pointer; transition:all 0.2s; background:transparent; color:var(--text-muted); }
  .login-tab.active { background:var(--accent); color:#0A0F1E; font-weight:600; }
  .form-group { margin-bottom:18px; }
  .form-label { font-size:13px; color:var(--text-muted); margin-bottom:8px; display:block; font-weight:500; }
  .form-input { width:100%; background:var(--navy); border:1px solid var(--border); border-radius:var(--radius-sm); padding:12px 16px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:15px; transition:border-color 0.2s; outline:none; }
  .form-input:focus { border-color:var(--accent); }
  .btn { padding:12px 24px; border:none; border-radius:var(--radius-sm); font-family:'DM Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:8px; }
  .btn-primary { background:var(--accent); color:#0A0F1E; width:100%; justify-content:center; }
  .btn-primary:hover { background:#00bfa0; transform:translateY(-1px); }
  .btn-danger { background:rgba(239,68,68,0.12); color:var(--danger); border:1px solid rgba(239,68,68,0.2); }
  .btn-ghost { background:var(--card); color:var(--text); border:1px solid var(--border); }
  .btn-ghost:hover { background:var(--card-hover); }
  .btn-accent3 { background:rgba(91,141,239,0.15); color:var(--accent3); border:1px solid rgba(91,141,239,0.2); }
  .btn-sm { padding:8px 16px; font-size:13px; }
  .btn-icon { padding:8px; border-radius:8px; background:var(--card); border:1px solid var(--border); color:var(--text-muted); cursor:pointer; transition:all 0.2s; }
  .btn-icon:hover { color:var(--text); background:var(--card-hover); }
  .error-msg { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.2); color:var(--danger); padding:10px 14px; border-radius:var(--radius-sm); font-size:13px; margin-bottom:16px; }
  .success-msg { background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); color:var(--success); padding:10px 14px; border-radius:var(--radius-sm); font-size:13px; margin-bottom:16px; }
  .punch-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--navy); }
  .punch-card { background:var(--navy-light); border:1px solid var(--border); border-radius:24px; padding:50px 44px; width:480px; max-width:95vw; text-align:center; box-shadow:0 40px 80px rgba(0,0,0,0.5); }
  .punch-clock { font-family:'Syne',sans-serif; font-size:64px; font-weight:800; background:linear-gradient(135deg,var(--accent),var(--accent3)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:-2px; }
  .punch-date { color:var(--text-muted); font-size:16px; margin-bottom:32px; }
  .punch-status { background:rgba(0,212,170,0.08); border:1px solid rgba(0,212,170,0.2); border-radius:12px; padding:16px; margin:20px 0; }
  .punch-status.out { background:rgba(255,107,74,0.08); border-color:rgba(255,107,74,0.2); }
  .punch-btn { width:100%; padding:20px; font-size:20px; font-weight:700; border-radius:16px; border:none; cursor:pointer; transition:all 0.2s; font-family:'Syne',sans-serif; }
  .punch-btn.in { background:linear-gradient(135deg,var(--accent),#00B892); color:#0A0F1E; }
  .punch-btn.out { background:linear-gradient(135deg,var(--accent2),#e55039); color:white; }
  .punch-btn:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,0,0,0.3); }
  .shell { display:flex; min-height:100vh; }
  .sidebar { width:240px; min-height:100vh; background:var(--navy-mid); border-right:1px solid var(--border); display:flex; flex-direction:column; position:fixed; left:0; top:0; z-index:100; box-shadow:var(--shadow); }
  .sidebar-logo { padding:20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:12px; }
  .logo-text { font-family:'Syne',sans-serif; font-weight:700; font-size:15px; }
  .sidebar-nav { flex:1; padding:12px; overflow-y:auto; }
  .nav-section-label { font-size:10px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; padding:12px 8px 6px; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; cursor:pointer; color:var(--text-muted); font-size:14px; font-weight:500; transition:all 0.15s; margin-bottom:2px; border:none; background:none; width:100%; text-align:left; }
  .nav-item:hover { color:var(--text); background:var(--card); }
  .nav-item.active { color:var(--accent); background:rgba(0,212,170,0.08); }
  .sidebar-user { padding:12px; border-top:1px solid var(--border); }
  .user-card { display:flex; align-items:center; gap:10px; padding:10px; border-radius:10px; background:var(--card); border:1px solid var(--border); }
  .user-avatar { width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg,var(--accent2),var(--accent)); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; color:white; flex-shrink:0; overflow:hidden; }
  .user-info { flex:1; min-width:0; }
  .user-name { font-size:13px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .user-role { font-size:11px; color:var(--text-muted); }
  .main { margin-left:240px; flex:1; }
  .topbar { height:60px; border-bottom:1px solid var(--border); display:flex; align-items:center; padding:0 28px; gap:12px; background:var(--navy-mid); position:sticky; top:0; z-index:50; box-shadow:var(--shadow); }
  .topbar-title { font-family:'Syne',sans-serif; font-weight:700; font-size:18px; flex:1; }
  .page { padding:28px; max-width:1200px; }
  .card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:24px; transition:border-color 0.2s; box-shadow:var(--shadow); }
  .card:hover { border-color:rgba(0,212,170,0.2); }
  .card-title { font-family:'Syne',sans-serif; font-weight:700; font-size:16px; margin-bottom:4px; }
  .card-sub { color:var(--text-muted); font-size:13px; }
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; margin-bottom:24px; }
  .stat-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow); }
  .stat-label { font-size:12px; color:var(--text-muted); margin-bottom:8px; font-weight:500; text-transform:uppercase; letter-spacing:0.5px; }
  .stat-value { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; }
  .stat-value.green { color:var(--accent); } .stat-value.orange { color:var(--accent2); } .stat-value.blue { color:var(--accent3); }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
  .grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; }
  .table-wrap { overflow-x:auto; border-radius:var(--radius); border:1px solid var(--border); }
  table { width:100%; border-collapse:collapse; }
  th { background:var(--navy-mid); padding:12px 16px; font-size:12px; font-weight:600; color:var(--text-muted); text-align:left; text-transform:uppercase; letter-spacing:0.5px; }
  td { padding:14px 16px; font-size:14px; border-top:1px solid var(--border); }
  tr:hover td { background:var(--card-hover); }
  .badge { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .badge-green { background:rgba(16,185,129,0.12); color:var(--success); }
  .badge-orange { background:rgba(245,158,11,0.12); color:var(--warning); }
  .badge-red { background:rgba(239,68,68,0.12); color:var(--danger); }
  .badge-blue { background:rgba(91,141,239,0.12); color:var(--accent3); }
  .badge-teal { background:rgba(0,212,170,0.12); color:var(--accent); }
  .flex { display:flex; } .items-center { align-items:center; } .justify-between { justify-content:space-between; }
  .gap-8 { gap:8px; } .gap-12 { gap:12px; } .gap-16 { gap:16px; }
  .mb-8 { margin-bottom:8px; } .mb-12 { margin-bottom:12px; } .mb-16 { margin-bottom:16px; } .mb-24 { margin-bottom:24px; }
  .mt-8 { margin-top:8px; } .mt-16 { margin-top:16px; }
  .text-muted { color:var(--text-muted); } .text-sm { font-size:13px; } .text-xs { font-size:11px; }
  .font-bold { font-weight:700; } .w-full { width:100%; }
  .select-input { background:var(--navy); border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px 14px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:14px; outline:none; width:100%; }
  .tag { display:inline-flex; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:600; }
  .tag-salary { background:rgba(91,141,239,0.15); color:var(--accent3); } .tag-hourly { background:rgba(0,212,170,0.12); color:var(--accent); }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:200; backdrop-filter:blur(4px); }
  .modal { background:var(--navy-light); border:1px solid var(--border); border-radius:20px; padding:32px; width:500px; max-width:95vw; max-height:85vh; overflow-y:auto; box-shadow:0 40px 80px rgba(0,0,0,0.6); }
  .modal-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; margin-bottom:24px; }
  .info-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); }
  .info-row:last-child { border-bottom:none; }
  .info-label { font-size:13px; color:var(--text-muted); } .info-value { font-size:14px; font-weight:500; }
  .punch-history-item { display:flex; justify-content:space-between; align-items:center; padding:14px; border-radius:10px; background:var(--card); border:1px solid var(--border); margin-bottom:8px; }
  .action-row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .progress-bar { height:6px; background:var(--border); border-radius:3px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:3px; background:linear-gradient(90deg,var(--accent),var(--accent3)); }
  /* NOTIFICATION */
  .notif-panel { position:fixed; top:60px; right:16px; width:340px; background:var(--navy-light); border:1px solid var(--border); border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.4); z-index:150; overflow:hidden; }
  .notif-item { padding:14px 16px; border-bottom:1px solid var(--border); cursor:pointer; transition:background 0.15s; display:flex; gap:12px; align-items:flex-start; }
  .notif-item:hover { background:var(--card-hover); }
  .notif-item.unread { background:rgba(0,212,170,0.04); }
  .notif-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); flex-shrink:0; margin-top:5px; }
  /* CHAT */
  .chat-container { display:flex; height:calc(100vh - 148px); gap:0; border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; }
  .chat-sidebar { width:260px; border-right:1px solid var(--border); display:flex; flex-direction:column; background:var(--navy-mid); }
  .chat-list { flex:1; overflow-y:auto; }
  .chat-list-item { padding:14px 16px; border-bottom:1px solid var(--border); cursor:pointer; transition:background 0.15s; display:flex; align-items:center; gap:12px; }
  .chat-list-item:hover,.chat-list-item.active { background:rgba(0,212,170,0.06); }
  .chat-main { flex:1; display:flex; flex-direction:column; }
  .chat-header { padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:12px; background:var(--navy-mid); }
  .chat-messages { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:12px; }
  .chat-bubble { max-width:70%; padding:10px 14px; border-radius:14px; font-size:14px; line-height:1.5; }
  .chat-bubble.mine { background:var(--accent); color:#0A0F1E; align-self:flex-end; border-bottom-right-radius:4px; }
  .chat-bubble.theirs { background:var(--card); border:1px solid var(--border); align-self:flex-start; border-bottom-left-radius:4px; }
  .chat-input-row { padding:16px 20px; border-top:1px solid var(--border); display:flex; gap:10px; background:var(--navy-mid); }
  /* PROFILE PHOTO */
  .photo-upload { width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg,var(--accent2),var(--accent)); display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; overflow:hidden; border:3px solid var(--border); transition:all 0.2s; flex-shrink:0; }
  .photo-upload:hover { border-color:var(--accent); }
  .photo-upload img { width:100%; height:100%; object-fit:cover; }
  .photo-overlay { position:absolute; inset:0; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.2s; }
  .photo-upload:hover .photo-overlay { opacity:1; }
  /* THEME TOGGLE */
  .theme-toggle { display:flex; align-items:center; gap:8px; padding:6px 12px; border-radius:20px; background:var(--card); border:1px solid var(--border); cursor:pointer; font-size:13px; font-weight:500; color:var(--text-muted); transition:all 0.2s; }
  .theme-toggle:hover { border-color:var(--accent); color:var(--text); }
  /* SUPER ADMIN */
  .company-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:20px; transition:all 0.2s; cursor:pointer; }
  .company-card:hover { border-color:var(--accent); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,212,170,0.1); }
  .plan-badge { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; }
  .plan-starter { background:rgba(91,141,239,0.12); color:var(--accent3); }
  .plan-growth { background:rgba(0,212,170,0.12); color:var(--accent); }
  .plan-enterprise { background:rgba(255,107,74,0.12); color:var(--accent2); }
  @media (max-width:768px) {
    .sidebar { width:64px; }
    .sidebar .logo-text,.sidebar .nav-item span,.sidebar .user-info,.nav-section-label { display:none; }
    .sidebar .nav-item { justify-content:center; padding:12px; }
    .main { margin-left:64px; }
    .grid-2,.grid-3 { grid-template-columns:1fr; }
    .stat-grid { grid-template-columns:1fr 1fr; }
  }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = n => n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtCurrency = n => `$${fmt(n)}`;
const today = () => new Date().toISOString().slice(0,10);
const timeNow = () => new Date().toLocaleTimeString('en-US',{hour12:false,hour:'2-digit',minute:'2-digit'});
const initials = name => name.split(' ').map(n=>n[0]).join('').toUpperCase();

// ─── LIVE CLOCK ───────────────────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(()=>{const t=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(t);},[]);
  return (
    <div>
      <div className="punch-clock">{time.toLocaleTimeString('en-US',{hour12:false})}</div>
      <div className="punch-date">{time.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</div>
    </div>
  );
}

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ emp, size=36 }) {
  if (emp?.photo) return <img src={emp.photo} alt={emp.name} style={{width:size,height:size,borderRadius:'50%',objectFit:'cover',flexShrink:0}}/>;
  return (
    <div style={{width:size,height:size,borderRadius:size>40?'50%':10,background:'linear-gradient(135deg,var(--accent2),var(--accent))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:size*0.35,color:'white',flexShrink:0}}>
      {initials(emp?.name||'?')}
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationBell({ notifications, setNotifications }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n=>!n.read).length;
  const markAll = () => setNotifications(notifications.map(n=>({...n,read:true})));
  return (
    <div style={{position:'relative'}}>
      <button className="btn-icon" onClick={()=>setOpen(!open)} style={{position:'relative'}}>
        <Icon name="bell" size={18}/>
        {unread>0 && <span style={{position:'absolute',top:4,right:4,width:8,height:8,borderRadius:'50%',background:'var(--accent2)',border:'2px solid var(--navy-mid)'}}/>}
      </button>
      {open && (
        <div className="notif-panel">
          <div style={{padding:'14px 16px',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontWeight:700,fontSize:15}}>Notifications</span>
            <button className="btn-ghost btn-sm" style={{padding:'4px 10px',fontSize:12}} onClick={markAll}>Mark all read</button>
          </div>
          <div style={{maxHeight:360,overflowY:'auto'}}>
            {notifications.length===0 ? <div style={{padding:32,textAlign:'center',color:'var(--text-muted)',fontSize:14}}>No notifications</div> :
              notifications.map((n,i)=>(
                <div key={i} className={`notif-item ${n.read?'':'unread'}`} onClick={()=>setNotifications(notifications.map((x,j)=>j===i?{...x,read:true}:x))}>
                  {!n.read && <div className="notif-dot"/>}
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{n.title}</div>
                    <div style={{fontSize:12,color:'var(--text-muted)'}}>{n.body}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4}}>{n.time}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function Chat({ currentEmp, employees }) {
  const others = employees.filter(e=>e.id!==currentEmp.id);
  const [selected, setSelected] = useState(others[0]||null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const chatKey = (a,b) => [a,b].sort().join('_');
  const key = selected ? chatKey(currentEmp.id, selected.id) : null;
  const msgs = useMemo(() => key ? (messages[key]||[]) : [], [key, messages]);

  const send = () => {
    if (!input.trim()||!selected) return;
    const msg = { from:currentEmp.id, text:input.trim(), time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) };
    setMessages(prev=>({...prev,[key]:[...(prev[key]||[]),msg]}));
    setInput('');
    // Simulate reply after 1.5s
    setTimeout(()=>{
      const replies = ["Got it, thanks!","Sure thing!","I'll check on that.","Sounds good!","On it!","Thanks for the heads up."];
      const reply = { from:selected.id, text:replies[Math.floor(Math.random()*replies.length)], time:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) };
      setMessages(prev=>({...prev,[key]:[...(prev[key]||[]),reply]}));
    },1500);
  };

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:'smooth'}); },[msgs]);

  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <div style={{padding:'16px',borderBottom:'1px solid var(--border)',fontFamily:'Syne',fontWeight:700,fontSize:15}}>Messages</div>
        <div className="chat-list">
          {others.map(e=>{
            const k = chatKey(currentEmp.id,e.id);
            const lastMsg = (messages[k]||[]).slice(-1)[0];
            return (
              <div key={e.id} className={`chat-list-item ${selected?.id===e.id?'active':''}`} onClick={()=>setSelected(e)}>
                <Avatar emp={e} size={38}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:13}}>{e.name}</div>
                  <div style={{fontSize:11,color:'var(--text-muted)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lastMsg?lastMsg.text:e.position}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chat-main">
        {selected ? <>
          <div className="chat-header">
            <Avatar emp={selected} size={36}/>
            <div><div style={{fontWeight:600}}>{selected.name}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{selected.position}</div></div>
          </div>
          <div className="chat-messages">
            {msgs.length===0 && <div style={{textAlign:'center',color:'var(--text-muted)',fontSize:13,margin:'auto'}}>Start a conversation with {selected.name}!</div>}
            {msgs.map((m,i)=>(
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:m.from===currentEmp.id?'flex-end':'flex-start'}}>
                <div className={`chat-bubble ${m.from===currentEmp.id?'mine':'theirs'}`}>{m.text}</div>
                <div style={{fontSize:10,color:'var(--text-muted)',marginTop:3,paddingLeft:4,paddingRight:4}}>{m.time}</div>
              </div>
            ))}
            <div ref={bottomRef}/>
          </div>
          <div className="chat-input-row">
            <input className="form-input" style={{flex:1}} placeholder={`Message ${selected.name}...`} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/>
            <button className="btn btn-primary" style={{width:'auto',padding:'10px 18px'}} onClick={send}><Icon name="send" size={16}/></button>
          </div>
        </> : <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-muted)'}}>Select a conversation</div>}
      </div>
    </div>
  );
}

// ─── GPS CLOCK IN ─────────────────────────────────────────────────────────────
function GPSPunchStation({ employees, setEmployees, onBack, addNotification }) {
  const [email, setEmail] = useState('');
  const [emp, setEmp] = useState(null);
  const [error, setError] = useState('');
  const [punched, setPunched] = useState(null);
  const [locStatus, setLocStatus] = useState('');
  const [coords, setCoords] = useState(null);

  const getLocation = () => new Promise((resolve,reject)=>{
    if (!navigator.geolocation) { resolve({lat:0,lng:0,accuracy:'N/A'}); return; }
    setLocStatus('📍 Getting your location...');
    navigator.geolocation.getCurrentPosition(
      pos => { setLocStatus('✅ Location confirmed'); resolve({lat:pos.coords.latitude,lng:pos.coords.longitude,accuracy:pos.coords.accuracy.toFixed(0)+'m'}); },
      () => { setLocStatus('⚠️ Location unavailable (using manual)'); resolve({lat:0,lng:0,accuracy:'N/A'}); },
      {timeout:8000}
    );
  });

  const findEmp = async () => {
    const found = employees.find(e=>e.email.toLowerCase()===email.toLowerCase()&&e.role==='hourly');
    if (!found) { setError('Employee not found or not hourly staff.'); return; }
    setError('');
    const loc = await getLocation();
    setCoords(loc);
    const alreadyIn = found.punchHistory.find(p=>p.date===today()&&!p.out);
    setEmp({...found, alreadyIn:!!alreadyIn});
  };

  const punch = (type) => {
    const now = timeNow(); const todayStr = today(); let updated;
    if (type==='in') {
      updated = {...emp, punchHistory:[...emp.punchHistory,{date:todayStr,in:now,out:null,hours:0,lat:coords?.lat||0,lng:coords?.lng||0}]};
      addNotification({title:'Employee Clocked In',body:`${emp.name} clocked in at ${now}`,time:'Just now'});
    } else {
      const idx = emp.punchHistory.findIndex(p=>p.date===todayStr&&!p.out);
      const newHistory=[...emp.punchHistory];
      if(idx>=0){const inT=newHistory[idx].in.split(':');const outT=now.split(':');const hrs=(parseInt(outT[0])*60+parseInt(outT[1])-(parseInt(inT[0])*60+parseInt(inT[1])))/60;newHistory[idx]={...newHistory[idx],out:now,hours:Math.max(0,hrs),lat:coords?.lat||0,lng:coords?.lng||0};}
      updated={...emp,punchHistory:newHistory};
      addNotification({title:'Employee Clocked Out',body:`${emp.name} clocked out at ${now}`,time:'Just now'});
    }
    setEmployees(employees.map(e=>e.id===updated.id?updated:e));
    setPunched(type);
    setTimeout(()=>{setEmp(null);setEmail('');setPunched(null);setCoords(null);setLocStatus('');},3000);
  };

  return (
    <div className="punch-screen">
      <div className="punch-card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div className="flex items-center gap-8"><Logo size={28}/><span style={{fontFamily:'Syne',fontWeight:700,fontSize:14,color:'var(--text-muted)'}}>WorkForce Pro</span></div>
          <button className="btn btn-ghost btn-sm" onClick={onBack}>← Back</button>
        </div>
        <LiveClock/>
        {punched && (
          <div style={{background:punched==='in'?'rgba(0,212,170,0.1)':'rgba(255,107,74,0.1)',border:`1px solid ${punched==='in'?'rgba(0,212,170,0.3)':'rgba(255,107,74,0.3)'}`,borderRadius:16,padding:28,marginTop:12}}>
            <div style={{fontFamily:'Syne',fontWeight:800,fontSize:26,marginBottom:6}}>{punched==='in'?'✓ Clocked In!':'✓ Clocked Out!'}</div>
            <div className="text-muted">{emp?.name}</div>
            {coords?.lat!==0 && <div style={{fontSize:12,color:'var(--text-muted)',marginTop:8}}>📍 Location recorded · Accuracy: {coords?.accuracy}</div>}
          </div>
        )}
        {!punched && !emp && (
          <div style={{background:'rgba(91,141,239,0.06)',border:'1px solid rgba(91,141,239,0.15)',borderRadius:14,padding:24,marginTop:16}}>
            <div style={{fontFamily:'Syne',fontWeight:700,marginBottom:16,display:'flex',alignItems:'center',gap:8}}><Icon name="mappin" color="var(--accent)" size={18}/> GPS Clock Station</div>
            <div className="form-group"><label className="form-label">Enter Your Email</label>
              <input className="form-input" type="email" placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&findEmp()}/>
            </div>
            {locStatus && <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:12,padding:'8px 12px',background:'var(--card)',borderRadius:8}}>{locStatus}</div>}
            {error && <div className="error-msg">{error}</div>}
            <button className="btn btn-primary w-full" onClick={findEmp}><Icon name="mappin" size={16}/>Verify Location & Continue</button>
          </div>
        )}
        {!punched && emp && (
          <>
            <div className={`punch-status ${emp.alreadyIn?'out':''}`}>
              <div style={{fontWeight:700}}>{emp.name}</div>
              <div style={{fontSize:13}}>{emp.position} · {emp.department}</div>
              {coords?.lat!==0 && <div style={{fontSize:12,color:'var(--text-muted)',marginTop:6}}>📍 Lat: {coords?.lat?.toFixed(4)}, Lng: {coords?.lng?.toFixed(4)}</div>}
              <div style={{marginTop:8,fontSize:13,color:'var(--text-muted)'}}>Status: {emp.alreadyIn?'🟡 Currently Clocked In':'⚪ Not Clocked In'}</div>
            </div>
            <div style={{display:'grid',gap:12,marginTop:16}}>
              {!emp.alreadyIn && <button className="punch-btn in" onClick={()=>punch('in')}>CLOCK IN</button>}
              {emp.alreadyIn && <button className="punch-btn out" onClick={()=>punch('out')}>CLOCK OUT</button>}
              <button className="btn btn-ghost" onClick={()=>{setEmp(null);setEmail('');setCoords(null);setLocStatus('');}}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ emp, employees, setEmployees }) {
  const fileRef = useRef(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name:emp.name, email:emp.email, position:emp.position, department:emp.department });

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setEmployees(employees.map(x=>x.id===emp.id?{...x,photo:ev.target.result}:x)); };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    setEmployees(employees.map(x=>x.id===emp.id?{...x,...form}:x));
    setSaved(true); setTimeout(()=>setSaved(false),3000);
  };

  const currentEmp = employees.find(e=>e.id===emp.id)||emp;

  return (
    <div style={{maxWidth:560}}>
      <div className="card">
        <div style={{display:'flex',alignItems:'center',gap:20,marginBottom:28}}>
          <div className="photo-upload" onClick={()=>fileRef.current?.click()}>
            {currentEmp.photo ? <img src={currentEmp.photo} alt="profile"/> : <div style={{fontWeight:800,fontSize:24,color:'white'}}>{initials(currentEmp.name)}</div>}
            <div className="photo-overlay"><Icon name="camera" color="white" size={20}/></div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={handlePhoto}/>
          <div>
            <div style={{fontFamily:'Syne',fontWeight:800,fontSize:20}}>{currentEmp.name}</div>
            <div style={{color:'var(--text-muted)',fontSize:14}}>{currentEmp.position} · {currentEmp.department}</div>
            <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>ID: {currentEmp.id} · Since {currentEmp.startDate}</div>
            <button className="btn-ghost btn-sm" style={{marginTop:8,fontSize:12,padding:'4px 10px'}} onClick={()=>fileRef.current?.click()}>
              <Icon name="camera" size={12}/> Change Photo
            </button>
          </div>
        </div>
        {saved && <div className="success-msg">✓ Profile updated!</div>}
        <div className="grid-2" style={{gap:12}}>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Position</label><input className="form-input" value={form.position} onChange={e=>setForm({...form,position:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></div>
        </div>
        <button className="btn btn-primary" style={{marginTop:8}} onClick={saveProfile}>Save Profile</button>
      </div>
    </div>
  );
}

// ─── PAYROLL PDF ──────────────────────────────────────────────────────────────
function PayrollPDF({ emp }) {
  const stmt = emp.payStatements[0];

  const generatePDF = () => {
    if (!stmt) return;
    const gross = stmt.gross;
    const federal = gross * 0.22;
    const state = gross * 0.06;
    const net = stmt.net;

    const html = `<!DOCTYPE html><html>
<head><meta charset="UTF-8"/><style>
  body{font-family:Arial,sans-serif;padding:40px;color:#111;max-width:600px;margin:0 auto;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #00D4AA;padding-bottom:20px;margin-bottom:24px;}
  .logo{font-size:22px;font-weight:900;color:#0A0F1E;letter-spacing:-0.5px;}
  .logo span{color:#00D4AA;}
  .title{font-size:18px;font-weight:700;margin-bottom:16px;color:#0A0F1E;}
  .row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;font-size:14px;}
  .row.total{font-weight:700;font-size:16px;border-top:2px solid #00D4AA;border-bottom:none;margin-top:8px;padding-top:14px;color:#00C853;}
  .section{margin-bottom:24px;}
  .section-title{font-size:12px;font-weight:700;text-transform:uppercase;color:#7A8BA6;letter-spacing:1px;margin-bottom:10px;}
  .emp-box{background:#F0F9F6;border:1px solid #00D4AA;border-radius:10px;padding:16px;margin-bottom:24px;}
  .footer{margin-top:32px;font-size:11px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:16px;}
  .badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;background:#E0FFF5;color:#00A37A;}
</style></head>
<body>
  <div class="header">
    <div><div class="logo">WorkForce<span>Pro</span></div><div style="font-size:12px;color:#7A8BA6;margin-top:4px;">Employee Pay Statement</div></div>
    <div style="text-align:right;font-size:12px;color:#7A8BA6;"><div>Pay Date: ${stmt.date}</div><div>Period: ${stmt.period}</div></div>
  </div>
  <div class="emp-box">
    <div style="font-weight:700;font-size:16px;margin-bottom:4px;">${emp.name} <span class="badge">${emp.role}</span></div>
    <div style="font-size:13px;color:#444;">${emp.position} · ${emp.department}</div>
    <div style="font-size:12px;color:#777;margin-top:2px;">Employee ID: ${emp.id} · ${emp.email}</div>
  </div>
  <div class="section">
    <div class="section-title">Earnings</div>
    <div class="row"><span>Gross Pay</span><span style="color:#00A37A;font-weight:600;">$${fmt(gross)}</span></div>
  </div>
  <div class="section">
    <div class="section-title">Deductions</div>
    <div class="row"><span>Federal Income Tax (22%)</span><span style="color:#EF4444;">-$${fmt(federal)}</span></div>
    <div class="row"><span>State Income Tax (6%)</span><span style="color:#EF4444;">-$${fmt(state)}</span></div>
    <div class="row"><span>FICA - Social Security (6.2%)</span><span style="color:#EF4444;">-$${fmt(gross*0.062)}</span></div>
    <div class="row"><span>FICA - Medicare (1.45%)</span><span style="color:#EF4444;">-$${fmt(gross*0.0145)}</span></div>
    <div class="row total"><span>Net Pay</span><span>$${fmt(net)}</span></div>
  </div>
  <div class="section">
    <div class="section-title">Payment Info</div>
    <div class="row"><span>Payment Method</span><span>Direct Deposit</span></div>
    <div class="row"><span>Bank</span><span>${emp.directDeposit?.bank||'N/A'}</span></div>
    <div class="row"><span>Account</span><span>${emp.directDeposit?.account||'N/A'}</span></div>
  </div>
  <div class="footer">This is an official pay statement generated by WorkForce Pro · workforcepro.app<br/>For questions contact HR or your administrator.</div>
</body></html>`;

    const w = window.open('','_blank','width=700,height=900');
    w.document.write(html);
    w.document.close();
    setTimeout(()=>w.print(),500);
  };

  return (
    <div style={{maxWidth:480}}>
      <div className="card">
        <div className="flex items-center gap-12 mb-24">
          <div style={{width:44,height:44,background:'rgba(255,107,74,0.12)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Icon name="pdf" color="var(--accent2)" size={22}/>
          </div>
          <div><div className="card-title">Payroll PDF Generator</div><div className="card-sub">Download official pay stubs</div></div>
        </div>
        {emp.payStatements.length===0 ? <div className="text-muted text-sm">No pay statements available yet.</div> :
          emp.payStatements.map((s,i)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px',background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,marginBottom:10}}>
              <div>
                <div style={{fontWeight:600}}>{s.period}</div>
                <div style={{fontSize:12,color:'var(--text-muted)'}}>Net: <span style={{color:'var(--accent)',fontWeight:700}}>{fmtCurrency(s.net)}</span> · Gross: {fmtCurrency(s.gross)}</div>
              </div>
              <button className="btn btn-sm btn-ghost" onClick={generatePDF} style={{gap:6}}>
                <Icon name="download" size={14}/>PDF
              </button>
            </div>
          ))
        }
        <div style={{marginTop:16,padding:14,background:'rgba(255,107,74,0.05)',border:'1px solid rgba(255,107,74,0.15)',borderRadius:10}}>
          <div style={{fontSize:12,color:'var(--text-muted)'}}>💡 PDF opens in a new tab — use your browser's print dialog to save as PDF or print directly.</div>
        </div>
      </div>
    </div>
  );
}

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
function ChangePassword({ emp, employees, setEmployees, isAdmin, adminPassword, setAdminPassword }) {
  const [form, setForm] = useState({current:'',newPass:'',confirm:''});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = () => {
    setError('');
    if (!form.current||!form.newPass||!form.confirm) { setError('All fields are required.'); return; }
    if (form.newPass.length<6) { setError('New password must be at least 6 characters.'); return; }
    if (form.newPass!==form.confirm) { setError('New passwords do not match.'); return; }
    if (isAdmin) {
      if (form.current!==adminPassword) { setError('Current password is incorrect.'); return; }
      setAdminPassword(form.newPass);
    } else {
      if (form.current!==emp.password) { setError('Current password is incorrect.'); return; }
      setEmployees(employees.map(e=>e.id===emp.id?{...e,password:form.newPass}:e));
    }
    setSuccess(true); setForm({current:'',newPass:'',confirm:''});
    setTimeout(()=>setSuccess(false),4000);
  };

  const s = (p) => {
    if (!p) return {label:'',color:'',width:'0%'};
    if (p.length<6) return {label:'Too Short',color:'var(--danger)',width:'20%'};
    if (p.length<8) return {label:'Weak',color:'var(--accent2)',width:'40%'};
    if (!/[A-Z]/.test(p)||!/[0-9]/.test(p)) return {label:'Fair',color:'var(--warning)',width:'65%'};
    return {label:'Strong',color:'var(--success)',width:'100%'};
  };
  const str = s(form.newPass);

  return (
    <div style={{maxWidth:460}}>
      <div className="card">
        <div className="flex items-center gap-12 mb-24">
          <div style={{width:44,height:44,background:'rgba(91,141,239,0.12)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="shield" color="var(--accent3)" size={22}/></div>
          <div><div className="card-title">Change Password</div><div className="card-sub">{isAdmin?'Admin account':emp?.name}</div></div>
        </div>
        {success && <div className="success-msg">✓ Password changed successfully!</div>}
        {error && <div className="error-msg">{error}</div>}
        <div className="form-group"><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="Current password" value={form.current} onChange={e=>setForm({...form,current:e.target.value})}/></div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input className="form-input" type="password" placeholder="Min 6 characters" value={form.newPass} onChange={e=>setForm({...form,newPass:e.target.value})}/>
          {form.newPass && <div style={{marginTop:8}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span className="text-xs text-muted">Strength</span><span className="text-xs" style={{color:str.color,fontWeight:600}}>{str.label}</span></div><div className="progress-bar"><div style={{height:'100%',borderRadius:3,background:str.color,width:str.width,transition:'all 0.3s'}}/></div></div>}
        </div>
        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input className="form-input" type="password" placeholder="Re-enter new password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})}/>
          {form.confirm&&form.newPass && <div style={{marginTop:6,fontSize:12,color:form.confirm===form.newPass?'var(--success)':'var(--danger)'}}>{form.confirm===form.newPass?'✓ Match':'✗ No match'}</div>}
        </div>
        <button className="btn btn-primary" style={{marginTop:8}} onClick={handleChange}><Icon name="shield" size={16}/>Update Password</button>
      </div>
    </div>
  );
}

// ─── EMP TIME CARD ────────────────────────────────────────────────────────────
function EmpTimeCard({ emp, employees, setEmployees }) {
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const history = emp.punchHistory||[];
  const totalHours = history.reduce((a,r)=>a+(r.hours||0),0);

  const saveEdit = () => {
    const inT=editForm.in.split(':'),outT=editForm.out.split(':');
    const hrs=Math.max(0,(parseInt(outT[0])*60+parseInt(outT[1])-(parseInt(inT[0])*60+parseInt(inT[1])))/60);
    setEmployees(employees.map(e=>e.id===emp.id?{...e,punchHistory:e.punchHistory.map((r,i)=>i===editing?{...editForm,hours:hrs}:r)}:e));
    setEditing(null);
  };

  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">This Period</div><div className="stat-value green">{totalHours.toFixed(1)} hrs</div></div>
        <div className="stat-card"><div className="stat-label">Pending Pay</div><div className="stat-value orange">{fmtCurrency(totalHours*(emp.hourlyRate||0))}</div></div>
        <div className="stat-card"><div className="stat-label">Rate</div><div className="stat-value blue">{emp.hourlyRate?`$${emp.hourlyRate}/hr`:'Salary'}</div></div>
      </div>
      <div className="card">
        <div className="card-title mb-16">Time Card History</div>
        {history.length===0?<div className="text-muted text-sm" style={{textAlign:'center',padding:30}}>No records yet</div>:
          history.map((r,i)=>(
            <div key={i} className="punch-history-item">
              {editing===i?(
                <div style={{flex:1,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,alignItems:'center'}}>
                  <input type="date" className="form-input" style={{padding:'6px 10px',fontSize:13}} value={editForm.date} onChange={e=>setEditForm({...editForm,date:e.target.value})}/>
                  <input type="time" className="form-input" style={{padding:'6px 10px',fontSize:13}} value={editForm.in} onChange={e=>setEditForm({...editForm,in:e.target.value})}/>
                  <input type="time" className="form-input" style={{padding:'6px 10px',fontSize:13}} value={editForm.out} onChange={e=>setEditForm({...editForm,out:e.target.value})}/>
                  <button className="btn btn-primary btn-sm" style={{gridColumn:'span 2'}} onClick={saveEdit}>Save</button>
                  <button className="btn btn-ghost btn-sm" onClick={()=>setEditing(null)}>Cancel</button>
                </div>
              ):(
                <>
                  <div>
                    <div style={{fontWeight:600}}>{r.date}</div>
                    <div className="text-sm text-muted">{r.in} → {r.out||'Active'}</div>
                    {r.lat!==0&&r.lat&&<div style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>📍 {r.lat?.toFixed(4)}, {r.lng?.toFixed(4)}</div>}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontWeight:700,color:'var(--accent)'}}>{(r.hours||0).toFixed(2)} hrs</div>
                      <div className="text-sm text-muted">{fmtCurrency((r.hours||0)*(emp.hourlyRate||0))}</div>
                    </div>
                    <button className="btn-icon" onClick={()=>{setEditing(i);setEditForm({...r});}}><Icon name="edit" size={14}/></button>
                    <button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>setEmployees(employees.map(e=>e.id===emp.id?{...e,punchHistory:e.punchHistory.filter((_,j)=>j!==i)}:e))}><Icon name="trash" size={14}/></button>
                  </div>
                </>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── EMP PAY ──────────────────────────────────────────────────────────────────
function EmpPay({ emp, employees, setEmployees }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newStmt, setNewStmt] = useState({period:'',gross:'',net:'',date:today()});
  const [saved, setSaved] = useState(false);
  const addStatement = () => {
    if (!newStmt.period||!newStmt.gross) return;
    setEmployees(employees.map(e=>e.id===emp.id?{...e,payStatements:[{period:newStmt.period,gross:parseFloat(newStmt.gross),net:parseFloat(newStmt.net||0),date:newStmt.date},...e.payStatements]}:e));
    setShowAdd(false); setSaved(true); setTimeout(()=>setSaved(false),3000);
    setNewStmt({period:'',gross:'',net:'',date:today()});
  };
  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">YTD Gross</div><div className="stat-value green">{fmtCurrency(emp.payStatements.reduce((a,p)=>a+p.gross,0))}</div></div>
        <div className="stat-card"><div className="stat-label">YTD Net</div><div className="stat-value orange">{fmtCurrency(emp.payStatements.reduce((a,p)=>a+p.net,0))}</div></div>
        <div className="stat-card"><div className="stat-label">Pay Type</div><div className="stat-value blue" style={{fontSize:20}}>{emp.role==='salary'?'Salary':'Hourly'}</div></div>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-16">
          <div className="card-title">Pay Statements</div>
          <button className="btn btn-ghost btn-sm" onClick={()=>setShowAdd(!showAdd)}><Icon name="plus" size={14}/>Add</button>
        </div>
        {saved&&<div className="success-msg">✓ Statement added!</div>}
        {showAdd&&(
          <div style={{background:'rgba(0,212,170,0.04)',border:'1px solid rgba(0,212,170,0.15)',borderRadius:12,padding:16,marginBottom:20}}>
            <div className="grid-2" style={{gap:12,marginBottom:12}}>
              <div><label className="form-label">Period</label><input className="form-input" placeholder="e.g. Mar 1-15, 2025" value={newStmt.period} onChange={e=>setNewStmt({...newStmt,period:e.target.value})}/></div>
              <div><label className="form-label">Pay Date</label><input type="date" className="form-input" value={newStmt.date} onChange={e=>setNewStmt({...newStmt,date:e.target.value})}/></div>
              <div><label className="form-label">Gross Pay ($)</label><input type="number" className="form-input" value={newStmt.gross} onChange={e=>setNewStmt({...newStmt,gross:e.target.value})}/></div>
              <div><label className="form-label">Net Pay ($)</label><input type="number" className="form-input" value={newStmt.net} onChange={e=>setNewStmt({...newStmt,net:e.target.value})}/></div>
            </div>
            <div className="flex gap-8"><button className="btn btn-primary" style={{width:'auto'}} onClick={addStatement}>Save</button><button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button></div>
          </div>
        )}
        {emp.payStatements[0]&&(
          <div style={{marginBottom:20}}>
            <div className="card-sub mb-12">Latest — {emp.payStatements[0].period}</div>
            <div className="info-row"><span className="info-label">Gross</span><span style={{color:'var(--accent)',fontWeight:600}}>{fmtCurrency(emp.payStatements[0].gross)}</span></div>
            <div className="info-row"><span className="info-label">Federal (22%)</span><span className="text-muted">-{fmtCurrency(emp.payStatements[0].gross*0.22)}</span></div>
            <div className="info-row"><span className="info-label">State (6%)</span><span className="text-muted">-{fmtCurrency(emp.payStatements[0].gross*0.06)}</span></div>
            <div className="info-row"><span className="info-label">FICA (7.65%)</span><span className="text-muted">-{fmtCurrency(emp.payStatements[0].gross*0.0765)}</span></div>
            <div className="info-row"><span className="info-label" style={{fontWeight:700}}>Net Pay</span><span style={{color:'var(--accent2)',fontWeight:700,fontSize:18}}>{fmtCurrency(emp.payStatements[0].net)}</span></div>
          </div>
        )}
        <div className="table-wrap"><table><thead><tr><th>Period</th><th>Gross</th><th>Net</th><th>Date</th></tr></thead>
          <tbody>{emp.payStatements.map((s,i)=><tr key={i}><td>{s.period}</td><td style={{color:'var(--accent)'}}>{fmtCurrency(s.gross)}</td><td style={{color:'var(--success)'}}>{fmtCurrency(s.net)}</td><td className="text-muted">{s.date}</td></tr>)}</tbody>
        </table></div>
      </div>
    </div>
  );
}

// ─── EMP TIME OFF ─────────────────────────────────────────────────────────────
function EmpTimeOff({ emp, employees, setEmployees }) {
  const [form, setForm] = useState({type:'Vacation',start:'',end:'',note:''});
  const [submitted, setSubmitted] = useState(false);
  const submit = () => {
    if (!form.start||!form.end) return;
    setEmployees(employees.map(e=>e.id===emp.id?{...e,timeOffRequests:[...e.timeOffRequests,{id:`TO${Date.now()}`,...form,status:'Pending'}]}:e));
    setSubmitted(true); setTimeout(()=>setSubmitted(false),3000);
    setForm({type:'Vacation',start:'',end:'',note:''});
  };
  const to = emp.timeOff;
  return (
    <div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Vacation Hrs</div><div className="stat-value green">{to.vacation}</div></div>
        <div className="stat-card"><div className="stat-label">Sick Hrs</div><div className="stat-value orange">{to.sick}</div></div>
        <div className="stat-card"><div className="stat-label">Personal Hrs</div><div className="stat-value blue">{to.personal}</div></div>
      </div>
      <div className="grid-2" style={{gap:20}}>
        <div className="card">
          <div className="card-title mb-16">Request Time Off</div>
          {submitted&&<div className="success-msg">✓ Request submitted!</div>}
          <div className="form-group"><label className="form-label">Type</label><select className="select-input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Vacation</option><option>Sick</option><option>Personal</option><option>Bereavement</option><option>Other</option></select></div>
          <div className="form-group"><label className="form-label">Start Date</label><input type="date" className="form-input" value={form.start} onChange={e=>setForm({...form,start:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">End Date</label><input type="date" className="form-input" value={form.end} onChange={e=>setForm({...form,end:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Note</label><input className="form-input" placeholder="Optional..." value={form.note} onChange={e=>setForm({...form,note:e.target.value})}/></div>
          <button className="btn btn-primary" onClick={submit}>Submit Request</button>
        </div>
        <div className="card">
          <div className="card-title mb-16">My Requests</div>
          {emp.timeOffRequests.length===0?<div className="text-muted text-sm">No requests yet</div>:
            emp.timeOffRequests.map((r,i)=>(
              <div key={i} style={{padding:12,background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,marginBottom:8}}>
                <div className="flex justify-between items-center mb-8"><span style={{fontWeight:600}}>{r.type}</span><span className={`badge ${r.status==='Approved'?'badge-green':r.status==='Denied'?'badge-red':'badge-orange'}`}>{r.status}</span></div>
                <div className="text-sm text-muted">{r.start} → {r.end}</div>
                {r.note&&<div className="text-sm text-muted mt-8">{r.note}</div>}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ─── EMP DIRECT DEPOSIT ───────────────────────────────────────────────────────
function EmpDirectDeposit({ emp, employees, setEmployees }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({...emp.directDeposit});
  const [saved, setSaved] = useState(false);
  const save = () => { setEmployees(employees.map(e=>e.id===emp.id?{...e,directDeposit:form}:e)); setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),3000); };
  return (
    <div className="card" style={{maxWidth:480}}>
      <div className="flex items-center gap-12 mb-24"><div style={{width:44,height:44,background:'rgba(91,141,239,0.12)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="bank" color="var(--accent3)" size={22}/></div><div><div className="card-title">Direct Deposit</div><div className="card-sub">Payment account</div></div></div>
      {saved&&<div className="success-msg">✓ Updated!</div>}
      {editing?(
        <div>
          <div className="form-group"><label className="form-label">Bank</label><input className="form-input" value={form.bank} onChange={e=>setForm({...form,bank:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Account Type</label><select className="select-input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Checking</option><option>Savings</option></select></div>
          <div className="form-group"><label className="form-label">Routing</label><input className="form-input" value={form.routing} onChange={e=>setForm({...form,routing:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Account #</label><input className="form-input" value={form.account} onChange={e=>setForm({...form,account:e.target.value})}/></div>
          <div className="flex gap-8"><button className="btn btn-primary" style={{width:'auto'}} onClick={save}>Save</button><button className="btn btn-ghost" onClick={()=>setEditing(false)}>Cancel</button></div>
        </div>
      ):(
        <div>
          <div className="info-row"><span className="info-label">Bank</span><span className="info-value">{emp.directDeposit.bank||'Not set'}</span></div>
          <div className="info-row"><span className="info-label">Type</span><span className="info-value">{emp.directDeposit.type}</span></div>
          <div className="info-row"><span className="info-label">Account</span><span className="info-value">{emp.directDeposit.account}</span></div>
          <div className="info-row"><span className="info-label">Routing</span><span className="info-value">{emp.directDeposit.routing}</span></div>
          <div className="mt-16"><button className="btn btn-ghost btn-sm" onClick={()=>setEditing(true)}><Icon name="edit" size={14}/>Update</button></div>
        </div>
      )}
    </div>
  );
}

// ─── EMP TAX ──────────────────────────────────────────────────────────────────
function EmpTax({ emp, employees, setEmployees }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({...emp.tax});
  const [saved, setSaved] = useState(false);
  const save = () => { setEmployees(employees.map(e=>e.id===emp.id?{...e,tax:{...form,federal:parseFloat(form.federal),state:parseFloat(form.state),allowances:parseInt(form.allowances)}}:e)); setEditing(false); setSaved(true); setTimeout(()=>setSaved(false),3000); };
  return (
    <div className="card" style={{maxWidth:480}}>
      <div className="flex justify-between items-center mb-24"><div className="card-title">Tax Withholding</div><button className="btn btn-ghost btn-sm" onClick={()=>setEditing(!editing)}><Icon name="edit" size={14}/>{editing?'Cancel':'Edit'}</button></div>
      {saved&&<div className="success-msg">✓ Updated!</div>}
      {editing?(
        <div>
          <div className="form-group"><label className="form-label">Filing Status</label><select className="select-input" value={form.filing} onChange={e=>setForm({...form,filing:e.target.value})}><option>Single</option><option>Married</option><option>Head of Household</option></select></div>
          <div className="form-group"><label className="form-label">Allowances</label><input type="number" className="form-input" value={form.allowances} onChange={e=>setForm({...form,allowances:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">Federal Rate (%)</label><input type="number" className="form-input" value={form.federal} onChange={e=>setForm({...form,federal:e.target.value})}/></div>
          <div className="form-group"><label className="form-label">State Rate (%)</label><input type="number" className="form-input" value={form.state} onChange={e=>setForm({...form,state:e.target.value})}/></div>
          <button className="btn btn-primary" style={{width:'auto'}} onClick={save}>Save</button>
        </div>
      ):(
        <div>
          <div className="info-row"><span className="info-label">Filing Status</span><span className="info-value">{emp.tax.filing}</span></div>
          <div className="info-row"><span className="info-label">Allowances</span><span className="info-value">{emp.tax.allowances}</span></div>
          <div className="info-row"><span className="info-label">Federal</span><span className="info-value">{emp.tax.federal}%</span></div>
          <div className="info-row"><span className="info-label">State</span><span className="info-value">{emp.tax.state}%</span></div>
          <div className="info-row"><span className="info-label">FICA</span><span className="info-value">7.65%</span></div>
          <div style={{marginTop:16,background:'rgba(0,212,170,0.06)',border:'1px solid rgba(0,212,170,0.15)',borderRadius:10,padding:16}}>
            <div className="text-sm text-muted mb-8">Total Withholding</div>
            <div style={{fontFamily:'Syne',fontWeight:800,fontSize:32,color:'var(--accent)'}}>{(emp.tax.federal+emp.tax.state+7.65).toFixed(2)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── POLICIES & LEARNING ──────────────────────────────────────────────────────
function EmpPolicies() {
  const policies=[{title:"Employee Code of Conduct",updated:"Jan 2025",pages:12},{title:"Attendance & Punctuality",updated:"Jan 2025",pages:4},{title:"Anti-Harassment Policy",updated:"Mar 2024",pages:8},{title:"PTO & Time Off Policy",updated:"Jan 2025",pages:6},{title:"Remote Work Policy",updated:"Jun 2024",pages:5},{title:"Benefits Summary Guide",updated:"Jan 2025",pages:20}];
  return (<div><div className="card-title mb-16">Company Policies</div><div style={{display:'grid',gap:12}}>{policies.map((p,i)=><div key={i} className="card flex justify-between items-center" style={{padding:'16px 20px'}}><div className="flex items-center gap-12"><Icon name="file" color="var(--accent3)" size={20}/><div><div style={{fontWeight:600}}>{p.title}</div><div className="text-sm text-muted">Updated {p.updated} · {p.pages} pages</div></div></div><button className="btn btn-ghost btn-sm flex items-center gap-8"><Icon name="download" size={14}/>Download</button></div>)}</div></div>);
}

function EmpLearning() {
  const [courses,setCourses]=useState([{title:"Workplace Safety",progress:100,category:"Required",due:null},{title:"Customer Service Excellence",progress:65,category:"Development",due:"2025-03-31"},{title:"Anti-Harassment Training",progress:100,category:"Required",due:null},{title:"Leadership Essentials",progress:20,category:"Development",due:"2025-04-15"},{title:"Data Privacy & Security",progress:0,category:"Required",due:"2025-03-15"}]);
  return (<div><div className="card-title mb-16">Learning & Development</div><div style={{display:'grid',gap:12}}>{courses.map((c,i)=><div key={i} className="card"><div className="flex justify-between items-center mb-8"><div style={{fontWeight:600}}>{c.title}</div><div className="flex gap-8 items-center"><span className={`badge ${c.category==='Required'?'badge-red':'badge-blue'}`}>{c.category}</span>{c.progress===100&&<span className="badge badge-green">✓</span>}</div></div>{c.due&&<div className="text-sm text-muted mb-8">Due: {c.due}</div>}<div className="progress-bar mb-8"><div className="progress-fill" style={{width:`${c.progress}%`}}/></div><div className="flex items-center gap-12"><span className="text-sm text-muted">{c.progress}%</span><input type="range" min="0" max="100" value={c.progress} onChange={e=>{const u=[...courses];u[i]={...u[i],progress:parseInt(e.target.value)};setCourses(u);}} style={{flex:1,accentColor:'var(--accent)'}}/></div></div>)}</div></div>);
}

// ─── MANAGER TABS ─────────────────────────────────────────────────────────────
function MgrTeamSchedule({ employees }) {
  const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const shiftOptions=['8:00 AM - 4:00 PM','4:00 PM - 12:00 AM','12:00 AM - 8:00 AM','10:00 AM - 6:00 PM','OFF'];
  const team=employees.filter(e=>e.active&&e.role==='hourly');
  const [schedule,setSchedule]=useState(()=>{const s={};team.forEach(e=>{s[e.id]=days.map((_,j)=>j>=5?'OFF':shiftOptions[0]);});return s;});
  return (
    <div>
      <div className="flex justify-between items-center mb-16"><div className="card-title">Team Schedule</div><span className="badge badge-teal">Click shifts to edit</span></div>
      <div className="table-wrap"><table><thead><tr><th>Employee</th>{days.map(d=><th key={d}>{d}</th>)}</tr></thead>
        <tbody>{team.map((e,i)=><tr key={i}><td><div style={{fontWeight:600}}>{e.name}</div><div className="text-sm text-muted">{e.position}</div></td>{days.map((d,j)=><td key={d} style={{padding:8}}><select value={schedule[e.id]?.[j]||'OFF'} onChange={ev=>{const s={...schedule};if(!s[e.id])s[e.id]=[];s[e.id][j]=ev.target.value;setSchedule(s);}} style={{background:'var(--navy)',border:'1px solid var(--border)',color:schedule[e.id]?.[j]==='OFF'?'var(--text-muted)':'var(--accent)',borderRadius:6,padding:'4px 6px',fontSize:11,width:'100%',outline:'none'}}>{shiftOptions.map(s=><option key={s}>{s}</option>)}</select></td>)}</tr>)}</tbody>
      </table></div>
    </div>
  );
}

function MgrTeamTimeCard({ employees }) {
  const team=employees.filter(e=>e.active);
  return (
    <div>
      <div className="card-title mb-16">Team Time Cards</div>
      <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Type</th><th>Hours</th><th>Est. Pay</th><th>Status</th></tr></thead>
        <tbody>{team.map((e,i)=>{const hrs=e.punchHistory.reduce((a,r)=>a+(r.hours||0),0);const pay=e.role==='hourly'?hrs*(e.hourlyRate||0):(e.salary||0)/26;return(<tr key={i}><td><div style={{fontWeight:600}}>{e.name}</div></td><td><span className={`tag ${e.role==='salary'?'tag-salary':'tag-hourly'}`}>{e.role}</span></td><td style={{color:'var(--accent)',fontWeight:700}}>{hrs.toFixed(1)}</td><td style={{color:'var(--success)'}}>{fmtCurrency(pay)}</td><td><span className="badge badge-green">On Track</span></td></tr>);})}</tbody>
      </table></div>
    </div>
  );
}

function MgrTimeOffApproval({ employees, setEmployees, addNotification }) {
  const all=employees.flatMap(e=>e.timeOffRequests.map(r=>({...r,empId:e.id,empName:e.name})));
  const pending=all.filter(r=>r.status==='Pending');
  const updateStatus=(empId,reqId,status)=>{
    setEmployees(employees.map(e=>e.id!==empId?e:{...e,timeOffRequests:e.timeOffRequests.map(r=>r.id!==reqId?r:{...r,status})}));
    addNotification({title:`Time Off ${status}`,body:`Request for ${employees.find(e=>e.id===empId)?.name} was ${status.toLowerCase()}`,time:'Just now'});
  };
  return (
    <div>
      <div className="card-title mb-16">Team Time Off Requests</div>
      {pending.length===0&&<div className="card text-muted text-sm mb-12" style={{textAlign:'center',padding:24}}>No pending requests ✓</div>}
      {pending.map((r,i)=><div key={i} className="card mb-12"><div className="flex justify-between items-center"><div><div style={{fontWeight:700}}>{r.empName}</div><div style={{fontWeight:500,marginTop:4}}>{r.type} — {r.start} to {r.end}</div>{r.note&&<div className="text-sm text-muted mt-8">{r.note}</div>}</div><div className="flex gap-8"><button className="btn btn-sm btn-accent3" onClick={()=>updateStatus(r.empId,r.id,'Approved')}><Icon name="check" size={14}/>Approve</button><button className="btn btn-sm btn-danger" onClick={()=>updateStatus(r.empId,r.id,'Denied')}><Icon name="x" size={14}/>Deny</button></div></div></div>)}
      {all.filter(r=>r.status!=='Pending').map((r,i)=><div key={i} className="card mb-8" style={{opacity:0.6}}><div className="flex justify-between items-center"><div><div style={{fontWeight:600}}>{r.empName}</div><div className="text-sm text-muted">{r.type} · {r.start} → {r.end}</div></div><span className={`badge ${r.status==='Approved'?'badge-green':'badge-red'}`}>{r.status}</span></div></div>)}
    </div>
  );
}

// ─── EMPLOYEE APP ─────────────────────────────────────────────────────────────
function EmployeeApp({ emp, employees, setEmployees, onLogout, darkMode, setDarkMode, notifications, setNotifications, addNotification }) {
  const [tab, setTab] = useState('home');
  const currentEmp = employees.find(e=>e.id===emp.id)||emp;

  const tabs = [
    {id:'home',label:'Home',icon:'home',always:true},
    {id:'profile',label:'My Profile',icon:'user',always:true},
    {id:'timecard',label:'Time Card',icon:'clock',always:true},
    {id:'pay',label:'Pay',icon:'dollar',always:true},
    {id:'paystub',label:'Pay Stubs PDF',icon:'pdf',always:true},
    {id:'timeoff',label:'Time Off',icon:'calendar',always:true},
    {id:'directdeposit',label:'Direct Deposit',icon:'bank',always:true},
    {id:'tax',label:'Tax Withholding',icon:'file',always:true},
    {id:'chat',label:'Messages',icon:'chat',always:true},
    {id:'policies',label:'Policies',icon:'shield',always:true},
    {id:'learning',label:'Learning',icon:'book',always:true},
    {id:'changepassword',label:'Change Password',icon:'settings',always:true},
    ...(emp.manager?[
      {id:'teamschedule',label:'Team Schedule',icon:'calendar'},
      {id:'teamtimecard',label:'Team Time Card',icon:'clock'},
      {id:'teamtimeoff',label:'Team Time Off',icon:'users'},
    ]:[]),
  ];

  const renderContent = () => {
    switch(tab) {
      case 'home': return (
        <div>
          <div style={{marginBottom:28}}>
            <div style={{fontFamily:'Syne',fontSize:26,fontWeight:800,marginBottom:4}}>Welcome back, {currentEmp.name.split(' ')[0]} 👋</div>
            <div className="text-muted">{currentEmp.position} · {currentEmp.department} · ID: {currentEmp.id}</div>
          </div>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-label">Hours This Period</div><div className="stat-value green">{currentEmp.punchHistory.reduce((a,r)=>a+(r.hours||0),0).toFixed(1)}</div></div>
            <div className="stat-card"><div className="stat-label">Vacation Days Left</div><div className="stat-value blue">{Math.floor(currentEmp.timeOff.vacation/8)}</div></div>
            <div className="stat-card"><div className="stat-label">Pending Requests</div><div className="stat-value orange">{currentEmp.timeOffRequests.filter(r=>r.status==='Pending').length}</div></div>
            <div className="stat-card"><div className="stat-label">Last Net Pay</div><div className="stat-value green">{currentEmp.payStatements[0]?fmtCurrency(currentEmp.payStatements[0].net):'-'}</div></div>
          </div>
          <div className="grid-2">
            <div className="card"><div className="card-title mb-8">Employment Info</div>
              <div className="info-row"><span className="info-label">Start Date</span><span className="info-value">{emp.startDate}</span></div>
              <div className="info-row"><span className="info-label">Department</span><span className="info-value">{emp.department}</span></div>
              <div className="info-row"><span className="info-label">Position</span><span className="info-value">{emp.position}</span></div>
              <div className="info-row"><span className="info-label">Pay Type</span><span className="info-value"><span className={`tag ${emp.role==='salary'?'tag-salary':'tag-hourly'}`}>{emp.role}</span></span></div>
            </div>
            <div className="card"><div className="card-title mb-8">Quick Actions</div>
              {['timecard','pay','timeoff','chat'].map(t=>(
                <button key={t} onClick={()=>setTab(t)} className="w-full btn btn-ghost mb-8" style={{justifyContent:'flex-start'}}>
                  <Icon name={tabs.find(x=>x.id===t)?.icon||'home'} size={16}/>{tabs.find(x=>x.id===t)?.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
      case 'profile': return <ProfilePage emp={currentEmp} employees={employees} setEmployees={setEmployees}/>;
      case 'timecard': return <EmpTimeCard emp={currentEmp} employees={employees} setEmployees={setEmployees}/>;
      case 'pay': return <EmpPay emp={currentEmp} employees={employees} setEmployees={setEmployees}/>;
      case 'paystub': return <PayrollPDF emp={currentEmp}/>;
      case 'timeoff': return <EmpTimeOff emp={currentEmp} employees={employees} setEmployees={setEmployees}/>;
      case 'directdeposit': return <EmpDirectDeposit emp={currentEmp} employees={employees} setEmployees={setEmployees}/>;
      case 'tax': return <EmpTax emp={currentEmp} employees={employees} setEmployees={setEmployees}/>;
      case 'chat': return <Chat currentEmp={currentEmp} employees={employees}/>;
      case 'policies': return <EmpPolicies/>;
      case 'learning': return <EmpLearning/>;
      case 'changepassword': return <ChangePassword emp={currentEmp} employees={employees} setEmployees={setEmployees} isAdmin={false}/>;
      case 'teamschedule': return <MgrTeamSchedule employees={employees.filter(e=>e.companyId===emp.companyId)}/>;
      case 'teamtimecard': return <MgrTeamTimeCard employees={employees.filter(e=>e.companyId===emp.companyId)}/>;
      case 'teamtimeoff': return <MgrTimeOffApproval employees={employees.filter(e=>e.companyId===emp.companyId)} setEmployees={setEmployees} addNotification={addNotification}/>;
      default: return null;
    }
  };

  return (
    <div className="shell">
      <nav className="sidebar">
        <div className="sidebar-logo"><Logo size={32}/><div className="logo-text">WorkForce Pro</div></div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Employee</div>
          {tabs.filter(t=>t.always).map(t=>(
            <button key={t.id} className={`nav-item ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}>
              <Icon name={t.icon} size={18}/><span>{t.label}</span>
            </button>
          ))}
          {emp.manager&&<><div className="nav-section-label">Manager</div>{tabs.filter(t=>!t.always).map(t=><button key={t.id} className={`nav-item ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}><Icon name={t.icon} size={18}/><span>{t.label}</span></button>)}</>}
        </div>
        <div className="sidebar-user">
          <div className="user-card">
            <div className="user-avatar"><Avatar emp={currentEmp} size={32}/></div>
            <div className="user-info"><div className="user-name">{currentEmp.name}</div><div className="user-role">{currentEmp.position}</div></div>
            <button className="btn-icon" onClick={onLogout}><Icon name="logout" size={16}/></button>
          </div>
        </div>
      </nav>
      <main className="main">
        <div className="topbar">
          <div className="topbar-title">{tabs.find(t=>t.id===tab)?.label||'Dashboard'}</div>
          {emp.manager&&<span className="badge badge-teal">Manager</span>}
          <button className="theme-toggle" onClick={()=>setDarkMode(!darkMode)}><Icon name={darkMode?'sun':'moon'} size={14}/>{darkMode?'Light':'Dark'}</button>
          <NotificationBell notifications={notifications} setNotifications={setNotifications}/>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icon name="logout" size={14}/>Sign Out</button>
        </div>
        <div className="page">{renderContent()}</div>
      </main>
    </div>
  );
}

// ─── ADMIN VIEWS ──────────────────────────────────────────────────────────────
function AdminEmployeeList({ employees, setEmployees, companyId }) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newEmp, setNewEmp] = useState({name:'',email:'',password:'',role:'hourly',position:'',department:'',hourlyRate:18,salary:75000,manager:false});
  const filtered = employees.filter(e=>e.companyId===companyId&&(e.name.toLowerCase().includes(search.toLowerCase())||e.email.toLowerCase().includes(search.toLowerCase())));

  const addEmployee = () => {
    if (!newEmp.name||!newEmp.email||!newEmp.password) return;
    const emp={...newEmp,id:`E${String(employees.length+1).padStart(3,'0')}`,companyId,active:true,startDate:today(),photo:null,
      hourlyRate:newEmp.role==='hourly'?parseFloat(newEmp.hourlyRate):null,salary:newEmp.role==='salary'?parseFloat(newEmp.salary):null,
      tax:{filing:'Single',allowances:1,federal:22,state:6},directDeposit:{bank:'',routing:'',account:'',type:'Checking'},
      timeOff:{vacation:80,sick:40,personal:16},punchHistory:[],timeOffRequests:[],payStatements:[]};
    setEmployees([...employees,emp]); setShowAdd(false);
    setNewEmp({name:'',email:'',password:'',role:'hourly',position:'',department:'',hourlyRate:18,salary:75000,manager:false});
  };

  return (
    <div>
      <div className="action-row">
        <input type="text" className="form-input" style={{maxWidth:280}} placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}><Icon name="plus" size={16}/>Add Employee</button>
      </div>
      <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Role</th><th>Department</th><th>Pay</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((e,i)=>(
          <tr key={i}>
            {editingId===e.id?(
              <td colSpan={6}><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,padding:'8px 0'}}>
                <input className="form-input" style={{padding:'6px 10px'}} value={editForm.name} onChange={ev=>setEditForm({...editForm,name:ev.target.value})}/>
                <input className="form-input" style={{padding:'6px 10px'}} value={editForm.email} onChange={ev=>setEditForm({...editForm,email:ev.target.value})}/>
                <input className="form-input" style={{padding:'6px 10px'}} value={editForm.position} onChange={ev=>setEditForm({...editForm,position:ev.target.value})}/>
                <input className="form-input" style={{padding:'6px 10px'}} value={editForm.department} onChange={ev=>setEditForm({...editForm,department:ev.target.value})}/>
                <select className="select-input" style={{padding:'6px 10px'}} value={editForm.role} onChange={ev=>setEditForm({...editForm,role:ev.target.value})}><option value="hourly">Hourly</option><option value="salary">Salary</option></select>
                {editForm.role==='hourly'&&<input type="number" className="form-input" style={{padding:'6px 10px'}} value={editForm.hourlyRate||''} onChange={ev=>setEditForm({...editForm,hourlyRate:ev.target.value})}/>}
                {editForm.role==='salary'&&<input type="number" className="form-input" style={{padding:'6px 10px'}} value={editForm.salary||''} onChange={ev=>setEditForm({...editForm,salary:ev.target.value})}/>}
                <label style={{display:'flex',alignItems:'center',gap:6,fontSize:13}}><input type="checkbox" checked={editForm.manager} onChange={ev=>setEditForm({...editForm,manager:ev.target.checked})}/>Manager</label>
                <div className="flex gap-8"><button className="btn btn-primary btn-sm" onClick={()=>{setEmployees(employees.map(x=>x.id!==editingId?x:{...x,...editForm,hourlyRate:editForm.role==='hourly'?parseFloat(editForm.hourlyRate):null,salary:editForm.role==='salary'?parseFloat(editForm.salary):null}));setEditingId(null);}}>Save</button><button className="btn btn-ghost btn-sm" onClick={()=>setEditingId(null)}>Cancel</button></div>
              </div></td>
            ):(
              <>
                <td><div className="flex items-center gap-12"><Avatar emp={e} size={36}/><div><div style={{fontWeight:600}}>{e.name}</div><div className="text-sm text-muted">{e.email} · {e.id}</div></div></div></td>
                <td><span className={`tag ${e.role==='salary'?'tag-salary':'tag-hourly'}`}>{e.role}</span>{e.manager&&<span className="badge badge-teal" style={{marginLeft:6,fontSize:10}}>MGR</span>}</td>
                <td>{e.department}</td>
                <td style={{color:'var(--accent)'}}>{e.role==='hourly'?`$${e.hourlyRate}/hr`:`$${((e.salary||0)/1000).toFixed(0)}k/yr`}</td>
                <td><span className="badge badge-green">Active</span></td>
                <td><div className="flex gap-8"><button className="btn-icon" onClick={()=>{setEditingId(e.id);setEditForm({...e});}}><Icon name="edit" size={15}/></button><button className="btn-icon" style={{color:'var(--danger)'}} onClick={()=>{if(window.confirm('Remove employee?'))setEmployees(employees.filter(x=>x.id!==e.id));}}><Icon name="trash" size={15}/></button></div></td>
              </>
            )}
          </tr>
        ))}</tbody>
      </table></div>
      {showAdd&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div className="modal">
            <div className="modal-title">Add New Employee</div>
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="John Smith" value={newEmp.name} onChange={e=>setNewEmp({...newEmp,name:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={newEmp.email} onChange={e=>setNewEmp({...newEmp,email:e.target.value})}/></div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={newEmp.password} onChange={e=>setNewEmp({...newEmp,password:e.target.value})}/></div>
            <div className="grid-2" style={{gap:12}}>
              <div className="form-group"><label className="form-label">Position</label><input className="form-input" value={newEmp.position} onChange={e=>setNewEmp({...newEmp,position:e.target.value})}/></div>
              <div className="form-group"><label className="form-label">Department</label><input className="form-input" value={newEmp.department} onChange={e=>setNewEmp({...newEmp,department:e.target.value})}/></div>
            </div>
            <div className="form-group"><label className="form-label">Pay Type</label><select className="select-input" value={newEmp.role} onChange={e=>setNewEmp({...newEmp,role:e.target.value})}><option value="hourly">Hourly</option><option value="salary">Salary</option></select></div>
            {newEmp.role==='hourly'&&<div className="form-group"><label className="form-label">Hourly Rate ($)</label><input className="form-input" type="number" value={newEmp.hourlyRate} onChange={e=>setNewEmp({...newEmp,hourlyRate:e.target.value})}/></div>}
            {newEmp.role==='salary'&&<div className="form-group"><label className="form-label">Annual Salary ($)</label><input className="form-input" type="number" value={newEmp.salary} onChange={e=>setNewEmp({...newEmp,salary:e.target.value})}/></div>}
            <div className="form-group"><label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'var(--text-muted)'}}><input type="checkbox" checked={newEmp.manager} onChange={e=>setNewEmp({...newEmp,manager:e.target.checked})}/>Manager / Supervisor</label></div>
            <div className="flex gap-8 mt-16"><button className="btn btn-primary flex-1" onClick={addEmployee}>Create Employee</button><button className="btn btn-ghost" onClick={()=>setShowAdd(false)}>Cancel</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ employees, companyId }) {
  const co = employees.filter(e=>e.companyId===companyId);
  const totalHrs=co.flatMap(e=>e.punchHistory).reduce((a,r)=>a+(r.hours||0),0);
  const totalPayroll=co.reduce((a,e)=>{const hrs=e.punchHistory.reduce((s,r)=>s+(r.hours||0),0);return a+(e.role==='hourly'?hrs*(e.hourlyRate||0):(e.salary||0)/26);},0);
  const pendingTO=co.flatMap(e=>e.timeOffRequests).filter(r=>r.status==='Pending').length;
  return (
    <div>
      <div style={{marginBottom:28}}><div style={{fontFamily:'Syne',fontSize:26,fontWeight:800,marginBottom:4}}>Admin Dashboard</div><div className="text-muted">Real-time overview · {new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div></div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Employees</div><div className="stat-value blue">{co.length}</div></div>
        <div className="stat-card"><div className="stat-label">Period Payroll</div><div className="stat-value green">{fmtCurrency(totalPayroll)}</div></div>
        <div className="stat-card"><div className="stat-label">Hours Logged</div><div className="stat-value orange">{totalHrs.toFixed(1)}</div></div>
        <div className="stat-card"><div className="stat-label">Pending Time Off</div><div className="stat-value" style={{color:'var(--warning)'}}>{pendingTO}</div></div>
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-title mb-16">Recent Clock-ins</div>
          {co.flatMap(e=>e.punchHistory.slice(-1).map(p=>({...p,name:e.name}))).slice(-5).length===0?<div className="text-muted text-sm">No activity yet</div>:
            co.flatMap(e=>e.punchHistory.slice(-1).map(p=>({...p,name:e.name}))).slice(-5).map((p,i)=>(
              <div key={i} className="info-row"><span style={{fontWeight:500}}>{p.name}</span><span className="text-sm text-muted">{p.date} · {p.in}→{p.out||'Active'}{p.lat&&p.lat!==0?` 📍`:''}</span></div>
            ))
          }
        </div>
        <div className="card"><div className="card-title mb-16">Staff Breakdown</div>
          <div className="info-row"><span className="info-label">Hourly</span><span className="info-value">{co.filter(e=>e.role==='hourly').length}</span></div>
          <div className="info-row"><span className="info-label">Salaried</span><span className="info-value">{co.filter(e=>e.role==='salary').length}</span></div>
          <div className="info-row"><span className="info-label">Managers</span><span className="info-value">{co.filter(e=>e.manager).length}</span></div>
          <div className="info-row"><span className="info-label">Departments</span><span className="info-value">{[...new Set(co.map(e=>e.department))].length}</span></div>
        </div>
      </div>
    </div>
  );
}

function AdminAttendance({ employees, companyId }) {
  const punches=employees.filter(e=>e.companyId===companyId).flatMap(e=>e.punchHistory.map(p=>({...p,empName:e.name,empId:e.id,position:e.position,rate:e.hourlyRate}))).sort((a,b)=>b.date.localeCompare(a.date));
  const downloadCSV=()=>{const h='Employee,ID,Position,Date,In,Out,Hours,Earnings,Lat,Lng';const r=punches.map(p=>`${p.empName},${p.empId},${p.position},${p.date},${p.in},${p.out||''},${(p.hours||0).toFixed(2)},${((p.hours||0)*(p.rate||0)).toFixed(2)},${p.lat||''},${p.lng||''}`);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([[h,...r].join('\n')],{type:'text/csv'}));a.download='attendance.csv';a.click();};
  return (
    <div>
      <div className="action-row"><div className="card-title">Attendance Records</div><button className="btn btn-ghost btn-sm" onClick={downloadCSV}><Icon name="download" size={14}/>Export CSV</button></div>
      <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Date</th><th>In</th><th>Out</th><th>Hours</th><th>Earnings</th><th>Location</th></tr></thead>
        <tbody>{punches.length===0?<tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>No records</td></tr>:
          punches.map((r,i)=><tr key={i}><td><div style={{fontWeight:600}}>{r.empName}</div></td><td>{r.date}</td><td style={{color:'var(--success)'}}>{r.in}</td><td style={{color:'var(--accent2)'}}>{r.out||<span className="badge badge-orange">Active</span>}</td><td style={{fontWeight:700,color:'var(--accent)'}}>{(r.hours||0).toFixed(2)}</td><td style={{color:'var(--success)'}}>{r.rate?fmtCurrency((r.hours||0)*r.rate):'—'}</td><td style={{fontSize:12,color:'var(--text-muted)'}}>{r.lat&&r.lat!==0?`📍 ${r.lat?.toFixed(3)}, ${r.lng?.toFixed(3)}`:'—'}</td></tr>)
        }</tbody>
      </table></div>
    </div>
  );
}

function AdminPayroll({ employees, companyId }) {
  const co=employees.filter(e=>e.companyId===companyId);
  const totalPayroll=co.reduce((a,e)=>{const hrs=e.punchHistory.reduce((s,r)=>s+(r.hours||0),0);return a+(e.role==='hourly'?hrs*(e.hourlyRate||0):(e.salary||0)/26);},0);
  const downloadCSV=()=>{const h='Employee,Type,Hours,Rate,Gross,Net';const r=co.map(e=>{const hrs=e.punchHistory.reduce((a,r)=>a+(r.hours||0),0);const gross=e.role==='hourly'?hrs*(e.hourlyRate||0):(e.salary||0)/26;const net=gross*(1-(22+6+7.65)/100);return`${e.name},${e.role},${hrs.toFixed(2)},${e.role==='hourly'?e.hourlyRate:e.salary},${gross.toFixed(2)},${net.toFixed(2)}`;});const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([[h,...r].join('\n')],{type:'text/csv'}));a.download='payroll.csv';a.click();};
  return (
    <div>
      <div className="stat-grid mb-24">
        <div className="stat-card"><div className="stat-label">Total Payroll</div><div className="stat-value green">{fmtCurrency(totalPayroll)}</div></div>
        <div className="stat-card"><div className="stat-label">Active Staff</div><div className="stat-value blue">{co.filter(e=>e.active).length}</div></div>
        <div className="stat-card"><div className="stat-label">Hourly</div><div className="stat-value orange">{co.filter(e=>e.role==='hourly').length}</div></div>
        <div className="stat-card"><div className="stat-label">Salaried</div><div className="stat-value">{co.filter(e=>e.role==='salary').length}</div></div>
      </div>
      <div className="action-row"><div className="card-title">Payroll Summary</div><button className="btn btn-ghost btn-sm" onClick={downloadCSV}><Icon name="download" size={14}/>Export CSV</button></div>
      <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Type</th><th>Hours</th><th>Rate</th><th>Gross</th><th>Est. Net</th></tr></thead>
        <tbody>{co.map((e,i)=>{const hrs=e.punchHistory.reduce((a,r)=>a+(r.hours||0),0);const gross=e.role==='hourly'?hrs*(e.hourlyRate||0):(e.salary||0)/26;const net=gross*(1-(22+6+7.65)/100);return(<tr key={i}><td><div className="flex items-center gap-12"><Avatar emp={e} size={28}/><div style={{fontWeight:600}}>{e.name}</div></div></td><td><span className={`tag ${e.role==='salary'?'tag-salary':'tag-hourly'}`}>{e.role}</span></td><td>{e.role==='hourly'?`${hrs.toFixed(1)} hrs`:'Salary'}</td><td>{e.role==='hourly'?`$${e.hourlyRate}/hr`:`$${((e.salary||0)/1000).toFixed(0)}k`}</td><td style={{color:'var(--accent)',fontWeight:700}}>{fmtCurrency(gross)}</td><td style={{color:'var(--success)'}}>{fmtCurrency(net)}</td></tr>);})}</tbody>
      </table></div>
    </div>
  );
}

// ─── ADMIN APP ────────────────────────────────────────────────────────────────
function AdminApp({ employees, setEmployees, onLogout, darkMode, setDarkMode, notifications, setNotifications, adminPassword, setAdminPassword, companyId }) {
  const [tab, setTab] = useState('dashboard');
  const adminTabs=[{id:'dashboard',label:'Dashboard',icon:'home'},{id:'employees',label:'Employees',icon:'users'},{id:'attendance',label:'Attendance',icon:'clock'},{id:'payroll',label:'Payroll',icon:'dollar'},{id:'changepassword',label:'Change Password',icon:'settings'}];
  const renderContent = () => {
    switch(tab) {
      case 'dashboard': return <AdminDashboard employees={employees} companyId={companyId}/>;
      case 'employees': return <AdminEmployeeList employees={employees} setEmployees={setEmployees} companyId={companyId}/>;
      case 'attendance': return <AdminAttendance employees={employees} companyId={companyId}/>;
      case 'payroll': return <AdminPayroll employees={employees} companyId={companyId}/>;
      case 'changepassword': return <ChangePassword isAdmin={true} adminPassword={adminPassword} setAdminPassword={setAdminPassword}/>;
      default: return null;
    }
  };
  return (
    <div className="shell">
      <nav className="sidebar">
        <div className="sidebar-logo"><Logo size={32}/><div className="logo-text">WorkForce Pro</div></div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Admin Panel</div>
          {adminTabs.map(t=><button key={t.id} className={`nav-item ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}><Icon name={t.icon} size={18}/><span>{t.label}</span></button>)}
        </div>
        <div className="sidebar-user">
          <div className="user-card">
            <Logo size={32}/>
            <div className="user-info"><div className="user-name">Administrator</div><div className="user-role">Super Admin</div></div>
            <button className="btn-icon" onClick={onLogout}><Icon name="logout" size={16}/></button>
          </div>
        </div>
      </nav>
      <main className="main">
        <div className="topbar">
          <div className="topbar-title">{adminTabs.find(t=>t.id===tab)?.label}</div>
          <span className="badge badge-red">Admin</span>
          <button className="theme-toggle" onClick={()=>setDarkMode(!darkMode)}><Icon name={darkMode?'sun':'moon'} size={14}/>{darkMode?'Light':'Dark'}</button>
          <NotificationBell notifications={notifications} setNotifications={setNotifications}/>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icon name="logout" size={14}/>Sign Out</button>
        </div>
        <div className="page">{renderContent()}</div>
      </main>
    </div>
  );
}

// ─── SUPER ADMIN (Multi-Company Dashboard) ────────────────────────────────────
function SuperAdminApp({ employees, onLogout, darkMode, setDarkMode }) {
  const [tab, setTab] = useState('companies');
  const totalRevenue = COMPANIES.reduce((a,c)=>a+(c.plan==='Enterprise'?199:c.plan==='Growth'?79:29),0);

  return (
    <div className="shell">
      <nav className="sidebar">
        <div className="sidebar-logo"><Logo size={32}/><div className="logo-text">WFP Platform</div></div>
        <div className="sidebar-nav">
          <div className="nav-section-label">Platform Admin</div>
          {[{id:'companies',label:'Companies',icon:'building'},{id:'revenue',label:'Revenue',icon:'dollar'},{id:'allusers',label:'All Users',icon:'users'}].map(t=>(
            <button key={t.id} className={`nav-item ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)}><Icon name={t.icon} size={18}/><span>{t.label}</span></button>
          ))}
        </div>
        <div className="sidebar-user">
          <div className="user-card">
            <Logo size={28}/>
            <div className="user-info"><div className="user-name">Super Admin</div><div className="user-role">Platform Owner</div></div>
            <button className="btn-icon" onClick={onLogout}><Icon name="logout" size={16}/></button>
          </div>
        </div>
      </nav>
      <main className="main">
        <div className="topbar">
          <div className="topbar-title">Platform Dashboard</div>
          <span className="badge badge-orange" style={{background:'rgba(255,107,74,0.15)'}}>⭐ Super Admin</span>
          <button className="theme-toggle" onClick={()=>setDarkMode(!darkMode)}><Icon name={darkMode?'sun':'moon'} size={14}/>{darkMode?'Light':'Dark'}</button>
          <button className="btn btn-ghost btn-sm" onClick={onLogout}><Icon name="logout" size={14}/>Sign Out</button>
        </div>
        <div className="page">
          {tab==='companies' && (
            <div>
              <div style={{marginBottom:28}}><div style={{fontFamily:'Syne',fontSize:26,fontWeight:800,marginBottom:4}}>All Companies</div><div className="text-muted">Manage all businesses using WorkForce Pro</div></div>
              <div className="stat-grid mb-24">
                <div className="stat-card"><div className="stat-label">Total Companies</div><div className="stat-value blue">{COMPANIES.length}</div></div>
                <div className="stat-card"><div className="stat-label">Monthly Revenue</div><div className="stat-value green">${totalRevenue}/mo</div></div>
                <div className="stat-card"><div className="stat-label">Total Employees</div><div className="stat-value orange">{COMPANIES.reduce((a,c)=>a+c.employees,0)}</div></div>
                <div className="stat-card"><div className="stat-label">Annual Revenue</div><div className="stat-value" style={{color:'var(--accent2)',fontSize:22}}>${(totalRevenue*12).toLocaleString()}/yr</div></div>
              </div>
              <div className="grid-3">
                {COMPANIES.map((c,i)=>(
                  <div key={i} className="company-card">
                    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                      <div style={{width:44,height:44,borderRadius:12,background:c.color,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:18,color:'white'}}>{c.name[0]}</div>
                      <div><div style={{fontWeight:700,fontSize:15}}>{c.name}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>ID: {c.id}</div></div>
                    </div>
                    <div className="info-row"><span className="info-label">Plan</span><span className={`plan-badge plan-${c.plan.toLowerCase()}`}>{c.plan}</span></div>
                    <div className="info-row"><span className="info-label">Employees</span><span className="info-value">{c.employees}</span></div>
                    <div className="info-row"><span className="info-label">Monthly</span><span className="info-value" style={{color:'var(--accent)',fontWeight:700}}>${c.plan==='Enterprise'?199:c.plan==='Growth'?79:29}/mo</span></div>
                    <div style={{marginTop:14}}><span className="badge badge-green">● Active</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab==='revenue' && (
            <div>
              <div style={{marginBottom:28}}><div style={{fontFamily:'Syne',fontSize:26,fontWeight:800,marginBottom:4}}>Revenue Overview</div></div>
              <div className="stat-grid mb-24">
                <div className="stat-card"><div className="stat-label">MRR</div><div className="stat-value green">${totalRevenue}</div></div>
                <div className="stat-card"><div className="stat-label">ARR</div><div className="stat-value blue">${(totalRevenue*12).toLocaleString()}</div></div>
                <div className="stat-card"><div className="stat-label">Starter Plans</div><div className="stat-value">{COMPANIES.filter(c=>c.plan==='Starter').length}</div></div>
                <div className="stat-card"><div className="stat-label">Enterprise Plans</div><div className="stat-value orange">{COMPANIES.filter(c=>c.plan==='Enterprise').length}</div></div>
              </div>
              <div className="card">
                <div className="card-title mb-16">Revenue by Company</div>
                {COMPANIES.map((c,i)=>{
                  const rev=c.plan==='Enterprise'?199:c.plan==='Growth'?79:29;
                  const pct=(rev/totalRevenue)*100;
                  return (
                    <div key={i} style={{marginBottom:16}}>
                      <div className="flex justify-between items-center mb-8"><span style={{fontWeight:600}}>{c.name}</span><span style={{color:'var(--accent)',fontWeight:700}}>${rev}/mo</span></div>
                      <div className="progress-bar"><div style={{height:'100%',borderRadius:3,background:c.color,width:`${pct}%`}}/></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {tab==='allusers' && (
            <div>
              <div style={{marginBottom:28}}><div style={{fontFamily:'Syne',fontSize:26,fontWeight:800,marginBottom:4}}>All Users</div><div className="text-muted">Across all companies</div></div>
              <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Company</th><th>Role</th><th>Position</th><th>Status</th></tr></thead>
                <tbody>{employees.map((e,i)=>{const co=COMPANIES.find(c=>c.id===e.companyId);return(<tr key={i}><td><div className="flex items-center gap-12"><Avatar emp={e} size={28}/><div><div style={{fontWeight:600}}>{e.name}</div><div className="text-sm text-muted">{e.email}</div></div></div></td><td><span style={{fontSize:13,fontWeight:500}}>{co?.name||'—'}</span></td><td><span className={`tag ${e.role==='salary'?'tag-salary':'tag-hourly'}`}>{e.role}</span></td><td>{e.position}</td><td><span className="badge badge-green">Active</span></td></tr>);})}
                </tbody>
              </table></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ employees, onLogin, onPunchStation, adminPassword, darkMode, setDarkMode }) {
  const [mode, setMode] = useState('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (email===SUPER_ADMIN.email&&password===SUPER_ADMIN.password) { onLogin({type:'superadmin'}); return; }
    if (mode==='admin') {
      if (email===ADMIN_CREDENTIALS.email&&password===adminPassword) onLogin({type:'admin',companyId:ADMIN_CREDENTIALS.companyId});
      else setError('Invalid admin credentials.');
    } else {
      const emp=employees.find(e=>e.email.toLowerCase()===email.toLowerCase()&&e.password===password&&e.active);
      if (emp) onLogin({type:'employee',emp});
      else setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div style={{position:'absolute',top:20,right:20}}>
          <button className="theme-toggle" onClick={()=>setDarkMode(!darkMode)}><Icon name={darkMode?'sun':'moon'} size={14}/>{darkMode?'Light':'Dark'}</button>
        </div>
        <div className="login-logo">
          <div className="login-logo-mark"><Logo size={60}/></div>
          <div className="login-title">WorkForce Pro</div>
          <div className="login-sub">Employee Management System</div>
        </div>
        <div className="login-type-tabs">
          <button className={`login-tab ${mode==='employee'?'active':''}`} onClick={()=>{setMode('employee');setError('');}}>Employee</button>
          <button className={`login-tab ${mode==='admin'?'active':''}`} onClick={()=>{setMode('admin');setError('');}}>Admin</button>
        </div>
        {error&&<div className="error-msg">{error}</div>}
        <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder={mode==='admin'?'admin@company.com':'your@company.com'} value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
        <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
        <button className="btn btn-primary" style={{marginBottom:12}} onClick={handleLogin}>{mode==='admin'?'🛡 Sign In as Admin':'→ Sign In'}</button>
        {mode==='employee'&&<button className="btn btn-ghost w-full" onClick={onPunchStation}><Icon name="mappin" size={16}/>GPS Clock In Station</button>}
        <div style={{marginTop:20,padding:12,background:'rgba(255,255,255,0.03)',borderRadius:10,border:'1px solid var(--border)'}}>
          <div className="text-xs text-muted" style={{marginBottom:6,fontWeight:600}}>DEMO CREDENTIALS</div>
          <div className="text-xs text-muted">Admin: admin@company.com / admin2025</div>
          <div className="text-xs text-muted">Employee: marcus@company.com / pass123</div>
          <div className="text-xs text-muted">Manager: sarah@company.com / pass123</div>
          <div className="text-xs text-muted" style={{marginTop:4,color:'var(--accent2)'}}>⭐ Super Admin: superadmin@workforcepro.com / super2025</div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [session, setSession] = useState(null);
  const [showPunch, setShowPunch] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [adminPassword, setAdminPassword] = useState(ADMIN_CREDENTIALS.password);
  const [notifications, setNotifications] = useState([
    {title:'Welcome to WorkForce Pro v2!',body:'Dark mode, GPS clock-in, chat & more are now live.',time:'Just now',read:false},
    {title:'Time Off Request',body:'Marcus Johnson submitted a vacation request.',time:'2 hours ago',read:false},
    {title:'New Employee Added',body:'David Okafor joined the Warehouse team.',time:'Yesterday',read:true},
  ]);

  const addNotification = (notif) => setNotifications(prev=>[{...notif,read:false},...prev]);

  useEffect(()=>{
    const style=document.createElement('style');
    style.id='wfp-styles';
    style.textContent=getStyles(darkMode);
    const existing=document.getElementById('wfp-styles');
    if(existing) existing.remove();
    document.head.appendChild(style);
    return()=>document.getElementById('wfp-styles')?.remove();
  },[darkMode]);

  if(showPunch) return <GPSPunchStation employees={employees} setEmployees={setEmployees} onBack={()=>setShowPunch(false)} addNotification={addNotification}/>;
  if(!session) return <Login employees={employees} onLogin={setSession} onPunchStation={()=>setShowPunch(true)} adminPassword={adminPassword} darkMode={darkMode} setDarkMode={setDarkMode}/>;
  if(session.type==='superadmin') return <SuperAdminApp employees={employees} onLogout={()=>setSession(null)} darkMode={darkMode} setDarkMode={setDarkMode}/>;
  if(session.type==='admin') return <AdminApp employees={employees} setEmployees={setEmployees} onLogout={()=>setSession(null)} darkMode={darkMode} setDarkMode={setDarkMode} notifications={notifications} setNotifications={setNotifications} adminPassword={adminPassword} setAdminPassword={setAdminPassword} companyId={session.companyId}/>;
  return <EmployeeApp emp={session.emp} employees={employees} setEmployees={setEmployees} onLogout={()=>setSession(null)} darkMode={darkMode} setDarkMode={setDarkMode} notifications={notifications} setNotifications={setNotifications} addNotification={addNotification}/>;
}
