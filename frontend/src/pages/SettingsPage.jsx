import React, { useState } from "react";
import {
  Bell, ChevronDown, User, Lock, SlidersHorizontal, BrainCircuit, ShieldAlert,
  Tag, BellRing, Database, Plug, ScrollText,
  Sun, Moon, Monitor, Check, Save, CheckCircle2,
  BarChart2, FileOutput, AlertTriangle,
  Shield, Edit2, Trash2, Plus, Info, RefreshCcw, Coins, Scale, Settings as SettingsIcon, Globe, FileText,
  PieChart, Search, Download, ChevronLeft, ChevronRight, Calendar, Users, Zap, LineChart, Filter,
  Eye, EyeOff
} from "lucide-react";
import UserHeader from "../components/UserHeader";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useUser } from "../context/UserContext";

// ── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULT_PROFILE    = { fullName: "", email: "", role: "Legal Team Member", phone: "", company: "", bio: "" };
const DEFAULT_PREFS      = { language: "English", dateFormat: "DD MMM YYYY", timezone: "(GMT+05:30) Asia/Kolkata" };
const DEFAULT_APPEARANCE = { theme: "Light", color: "#3b82f6" };
const DEFAULT_NOTIFS     = { analysisCompleted: true, riskAlerts: true, reportGenerated: true, systemUpdates: true };
const DEFAULT_ANALYSIS   = { similarityThreshold: 0.70, riskSensitivity: "Medium", reportFormat: "PDF" };
const COLORS = ["#3b82f6","#8b5cf6","#22c55e","#f59e0b","#ef4444","#14b8a6"];

const NAV = [
  { group: "ACCOUNT", items: [
    { key: "profile",     label: "Profile",           icon: User },
    { key: "security",    label: "Security",          icon: Lock },
    { key: "preferences", label: "Preferences",       icon: SlidersHorizontal },
  ]},
  { group: "APPLICATION", items: [
    { key: "ai",         label: "AI & Analysis",     icon: BrainCircuit },
    { key: "risk",       label: "Risk Settings",     icon: ShieldAlert },
    { key: "categories", label: "Clause Categories", icon: Tag },
    { key: "notifs",     label: "Notifications",     icon: BellRing },
  ]}
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function Toast({ msg }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-semibold">
      <CheckCircle2 size={16} className="text-green-400" />
      {msg}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-10 rounded-full transition-colors shrink-0 ${checked ? "bg-blue-600" : "bg-slate-200"}`}
      style={{ height: 22 }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] rounded-full bg-white dark:bg-[#1e293b] shadow transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0"}`}
      />
    </button>
  );
}

// ── Section components (each has its own hooks) ───────────────────────────────

function ProfileSection({ profile, appearance, save }) {
  const { user, updateUser } = useUser();
  const [draft, setDraft] = useState(() => ({
    fullName: profile?.fullName || user?.fullName || user?.name || "",
    email: profile?.email || user?.email || "",
    role: profile?.role || user?.role || "Legal Team Member",
    phone: profile?.phone || user?.phone || "",
    company: profile?.company || user?.company || "",
    bio: profile?.bio || user?.bio || "",
  }));
  const { setTheme } = useTheme();
  const { t } = useLanguage();

  const handleSave = () => {
    save("settings_profile", draft, "Profile saved successfully!");
    if (updateUser) {
      updateUser({
        name: draft.fullName,
        fullName: draft.fullName,
        email: draft.email,
        role: draft.role,
        phone: draft.phone,
        company: draft.company,
        bio: draft.bio,
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-5">{t("Profile Information")}</h2>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-black shrink-0">
            {draft.fullName ? draft.fullName.charAt(0).toUpperCase() : <User size={28} />}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{draft.fullName || t("Your Name")}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{draft.role}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{draft.email || "your@email.com"}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: t("Full Name"),    key: "fullName", type: "text",  placeholder: "Enter your full name" },
            { label: t("Email Address"),key: "email",    type: "email", placeholder: "your@email.com" },
            { label: t("Phone Number"), key: "phone",    type: "tel",   placeholder: "+91 98765 43210" },
            { label: t("Company"),      key: "company",  type: "text",  placeholder: "Your company name" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">{f.label}</label>
              <input
                type={f.type}
                value={draft[f.key]}
                onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-300"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Role</label>
            <select
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100"
            >
              {["Legal Team Member","Legal Counsel","Contract Manager","Compliance Officer","Admin","Other"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Bio</label>
            <textarea
              rows={3}
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
              placeholder="Brief description about yourself..."
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder-slate-300 resize-none"
            />
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </div>

      {/* Appearance */}
      <div className="w-full lg:w-72 flex flex-col gap-4">
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">Appearance</h2>
          <p className="text-xs font-semibold text-slate-400 mb-2">Theme</p>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[{ label:"Light", icon:<Sun size={18}/> }, { label:"Dark", icon:<Moon size={18}/> }, { label:"System", icon:<Monitor size={18}/> }].map((t) => (
              <button
                key={t.label}
                onClick={() => {
                  save("settings_appearance", { ...appearance, theme: t.label }, "Theme updated!");
                  setTheme(t.label);
                }}
                className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-lg border text-xs font-semibold transition-colors ${
                  appearance.theme === t.label ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300"
                }`}
              >
                {t.icon}{t.label}
                {appearance.theme === t.label && <Check size={12} className="text-blue-500" />}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-slate-400 mb-2">Primary Color</p>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => save("settings_appearance", { ...appearance, color: c }, "Color updated!")}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: c }}
              >
                {appearance.color === c && <Check size={14} className="text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Lock size={14} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-700">Your data is secure</p>
            <p className="text-[11px] text-blue-500 mt-0.5">All data is encrypted and stored securely.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecuritySection({ showToast }) {
  const [sec, setSec] = useState({ current: "", newPw: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });

  const toggleShow = (key) => {
    setShowPw((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fields = [
    { label: "Current Password", key: "current" },
    { label: "New Password", key: "newPw" },
    { label: "Confirm Password", key: "confirm" },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 max-w-xl">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-5">Change Password</h2>
      {fields.map((f) => (
        <div key={f.key} className="mb-4">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">{f.label}</label>
          <div className="relative flex items-center">
            <input
              type={showPw[f.key] ? "text" : "password"}
              value={sec[f.key]}
              onChange={(e) => setSec({ ...sec, [f.key]: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 pr-10 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-colors"
            />
            <button
              type="button"
              onClick={() => toggleShow(f.key)}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
              title={showPw[f.key] ? "Hide password" : "Show password"}
            >
              {showPw[f.key] ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          if (!sec.current || !sec.newPw || !sec.confirm) {
            showToast("Please fill in all password fields!");
            return;
          }
          if (sec.newPw !== sec.confirm) {
            showToast("Passwords do not match!");
            return;
          }
          showToast("Password updated successfully!");
          setSec({ current: "", newPw: "", confirm: "" });
        }}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors mt-2"
      >
        <Lock size={15} /> Update Password
      </button>
    </div>
  );
}

function PreferencesSection({ prefs, save }) {
  const [draft, setDraft] = useState({ ...prefs });
  const { t, setLanguage } = useLanguage();
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 max-w-2xl">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-5">{t("Language & Region")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1.5">{t("Language")}</label>
          <select value={draft.language} onChange={(e) => {
              const newLang = e.target.value;
              setDraft({ ...draft, language: newLang });
              setLanguage(newLang);
            }}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-[#1e293b]">
            {["English","Tamil","Hindi","French","German","Spanish"].map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1.5">Date Format</label>
          <select value={draft.dateFormat} onChange={(e) => setDraft({ ...draft, dateFormat: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-[#1e293b]">
            {["DD MMM YYYY","MM/DD/YYYY","YYYY-MM-DD","DD/MM/YYYY"].map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-slate-500 block mb-1.5">Time Zone</label>
          <select value={draft.timezone} onChange={(e) => setDraft({ ...draft, timezone: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-[#1e293b]">
            {["(GMT+05:30) Asia/Kolkata","(GMT+00:00) UTC","(GMT-05:00) US Eastern","(GMT+01:00) Europe/London","(GMT+08:00) Asia/Singapore"].map((tz) => <option key={tz}>{tz}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => save("settings_prefs", draft, "Preferences saved!")}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
        <Save size={15} /> Save Preferences
      </button>
    </div>
  );
}

function AISection({ analysis, save }) {
  const [draft, setDraft] = useState({ ...analysis });
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 max-w-2xl">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-5">Default Analysis Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-1">
            <BarChart2 size={13} className="text-blue-500" /> Similarity Threshold
            <span className="text-[10px] text-slate-400 font-normal">— Minimum score to consider clauses similar</span>
          </label>
          <div className="flex items-center gap-4 mt-2">
            <input type="range" min="0.5" max="1" step="0.01"
              value={draft.similarityThreshold}
              onChange={(e) => setDraft({ ...draft, similarityThreshold: parseFloat(e.target.value) })}
              className="flex-1 accent-blue-600" />
            <span className="w-14 text-center text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1">
              {draft.similarityThreshold.toFixed(2)}
            </span>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-2">
            <AlertTriangle size={13} className="text-orange-500" /> Risk Sensitivity
          </label>
          <select value={draft.riskSensitivity} onChange={(e) => setDraft({ ...draft, riskSensitivity: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-[#1e293b]">
            {["Low","Medium","High","Very High"].map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 mb-2">
            <FileOutput size={13} className="text-purple-500" /> Default Report Format
          </label>
          <select value={draft.reportFormat} onChange={(e) => setDraft({ ...draft, reportFormat: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white dark:bg-[#1e293b]">
            {["PDF","DOCX","XLSX","HTML"].map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <button onClick={() => save("settings_analysis", draft, "Analysis settings saved!")}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
          <Save size={15} /> Save Analysis Settings
        </button>
      </div>
    </div>
  );
}

function NotifsSection({ notifs, save }) {
  const [draft, setDraft] = useState({ ...notifs });
  const { t } = useLanguage();
  const items = [
    { key: "analysisCompleted", label: t("Analysis Completed"),  sub: t("Receive email when analysis is completed") },
    { key: "riskAlerts",        label: t("Risk Alerts"),         sub: t("Receive email for high risk issues") },
    { key: "reportGenerated",   label: t("Report Generated"),    sub: t("Receive email when reports are generated") },
    { key: "systemUpdates",     label: t("System Updates"),      sub: t("Important updates and announcements") },
  ];
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 max-w-xl">
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-5">{t("Email Notifications")}</h2>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </div>
            <Toggle checked={draft[item.key]} onChange={(v) => setDraft({ ...draft, [item.key]: v })} />
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button onClick={() => save("settings_notifs", draft, t("Notification preferences saved!"))}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
          <Save size={15} /> {t("Save Notifications")}
        </button>
      </div>
    </div>
  );
}

function PlaceholderSection({ section }) {
  const labels = { data:"Data & Storage", integrations:"Integrations", audit:"Audit Logs" };
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-10 flex flex-col items-center justify-center min-h-[300px] text-center">
      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
        <SlidersHorizontal size={26} className="text-slate-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">{labels[section] || "Settings"}</h2>
      <p className="text-slate-400 text-sm">This section is coming soon.</p>
    </div>
  );
}

function ClauseCategoriesSection() {
  const categories = [
    { id: 1, name: "Payment Terms", desc: "Clauses related to payment schedule, methods, and conditions.", type: "System", count: 156, status: "Active", icon: <FileText size={16} className="text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-900/40" },
    { id: 2, name: "Liability & Indemnity", desc: "Clauses defining liability, indemnification and limitations.", type: "System", count: 142, status: "Active", icon: <ShieldAlert size={16} className="text-green-600 dark:text-green-400" />, bg: "bg-green-100 dark:bg-green-900/40" },
    { id: 3, name: "Term & Termination", desc: "Clauses related to contract duration, termination and renewal.", type: "System", count: 128, status: "Active", icon: <Calendar size={16} className="text-orange-600 dark:text-orange-400" />, bg: "bg-orange-100 dark:bg-orange-900/40" },
    { id: 4, name: "Confidentiality", desc: "Clauses related to confidentiality and data protection.", type: "System", count: 112, status: "Active", icon: <Lock size={16} className="text-purple-600 dark:text-purple-400" />, bg: "bg-purple-100 dark:bg-purple-900/40" },
    { id: 5, name: "Governing Law", desc: "Clauses specifying governing law and jurisdiction.", type: "System", count: 87, status: "Active", icon: <Scale size={16} className="text-red-600 dark:text-red-400" />, bg: "bg-red-100 dark:bg-red-900/40" },
    { id: 6, name: "Dispute Resolution", desc: "Clauses related to dispute resolution and arbitration.", type: "System", count: 76, status: "Active", icon: <Users size={16} className="text-teal-600 dark:text-teal-400" />, bg: "bg-teal-100 dark:bg-teal-900/40" },
    { id: 7, name: "Force Majeure", desc: "Clauses covering force majeure and unforeseen events.", type: "Custom", count: 45, status: "Active", icon: <Zap size={16} className="text-yellow-600 dark:text-yellow-400" />, bg: "bg-yellow-100 dark:bg-yellow-900/40" },
    { id: 8, name: "Service Obligations", desc: "Clauses defining service level and obligations.", type: "Custom", count: 38, status: "Active", icon: <LineChart size={16} className="text-blue-600 dark:text-blue-400" />, bg: "bg-blue-100 dark:bg-blue-900/40" },
  ];

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 w-full max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag className="text-slate-700 dark:text-slate-200" size={24} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Clause Categories</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage clause categories used to classify and organize clauses across all your contracts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm whitespace-nowrap">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center gap-4 bg-white dark:bg-[#1e293b]">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">14</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Total Categories</p>
            <p className="text-xs text-slate-400 mt-0.5">Active</p>
          </div>
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center gap-4 bg-white dark:bg-[#1e293b]">
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">10</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">System Categories</p>
            <p className="text-xs text-slate-400 mt-0.5">Default</p>
          </div>
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center gap-4 bg-white dark:bg-[#1e293b]">
          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Tag size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">4</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Custom Categories</p>
            <p className="text-xs text-slate-400 mt-0.5">Added by you</p>
          </div>
        </div>
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex items-center gap-4 bg-white dark:bg-[#1e293b]">
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <PieChart size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900 dark:text-white leading-tight">98%</p>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">Clauses Categorized</p>
            <p className="text-xs text-slate-400 mt-0.5">Across all contracts</p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative shrink-0">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Filter size={14} className="text-slate-400" />
            </div>
            <select className="pl-8 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg appearance-none bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer">
              <option>All Categories</option>
              <option>System Categories</option>
              <option>Custom Categories</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 dark:border-slate-700">
              <th className="px-4 py-3">Category Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-center">Clause Count</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg}`}>
                      {c.icon}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-normal">
                  <span className="text-slate-500 dark:text-slate-400 text-xs max-w-xs block leading-relaxed">{c.desc}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${c.type === 'System' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                    {c.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-center font-medium text-slate-700 dark:text-slate-300">
                  {c.count}
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs font-bold text-green-600 dark:text-green-500">{c.status}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-700 rounded-md mr-2 bg-white dark:bg-[#1e293b]"><Edit2 size={14} /></button>
                  <button className="p-2 text-slate-400 hover:text-red-600 transition-colors border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-[#1e293b]"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4 mt-2">
        <p className="text-xs text-slate-500 font-medium">Showing 1 to 8 of 14 categories</p>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-slate-400 hover:text-slate-700 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-[#1e293b]"><ChevronLeft size={16} /></button>
          <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white bg-blue-600 rounded-md shadow-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">2</button>
          <button className="p-1.5 text-slate-400 hover:text-slate-700 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-[#1e293b]"><ChevronRight size={16} /></button>
        </div>
      </div>

    </div>
  );
}

function RiskSettingsSection({ showToast }) {
  // Use a local state for the entire page to allow "Reset to Defaults" and "Save Changes"
  const [draft, setDraft] = useState({
    levels: [
      { id: 1, level: "Critical", score: "80 - 100", color: "#ef4444", desc: "Very high impact risk requiring immediate action." },
      { id: 2, level: "High", score: "60 - 79", color: "#f97316", desc: "High impact risk that should be addressed." },
      { id: 3, level: "Medium", score: "30 - 59", color: "#eab308", desc: "Moderate risk that should be reviewed." },
      { id: 4, level: "Low", score: "10 - 29", color: "#22c55e", desc: "Low impact risk with minimal concern." },
      { id: 5, level: "Info", score: "0 - 9", color: "#3b82f6", desc: "Informational item for awareness." },
    ],
    weights: [
      { id: 1, factor: "Financial Impact", weight: 30, icon: <Coins size={14} className="text-blue-500" /> },
      { id: 2, factor: "Legal & Compliance", weight: 25, icon: <Scale size={14} className="text-blue-500" /> },
      { id: 3, factor: "Operational Impact", weight: 20, icon: <SettingsIcon size={14} className="text-blue-500" /> },
      { id: 4, factor: "Reputation Impact", weight: 15, icon: <Globe size={14} className="text-blue-500" /> },
      { id: 5, factor: "Contract Specificity", weight: 10, icon: <FileText size={14} className="text-blue-500" /> },
    ],
    sensitivity: "Balanced",
    autoClassify: true,
    riskScoring: true,
    riskExplanations: true,
    confidenceThreshold: 70,
    alerts: {
      critical: true,
      high: true,
      medium: false,
      low: false
    },
    alertFrequency: "Instant"
  });

  const totalWeight = draft.weights.reduce((acc, curr) => acc + curr.weight, 0);

  const resetToDefaults = () => {
    showToast("Reset to defaults");
  };

  const saveChanges = () => {
    showToast("Risk settings saved!");
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="text-slate-700 dark:text-slate-200" size={24} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Risk Settings</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure how risks are detected, scored and displayed in your analysis.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Col: Risk Level Config */}
        <div className="xl:col-span-2 border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-[#1e293b]">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Risk Level Configuration</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Define risk levels, score ranges, colors and descriptions.</p>
          
          <table className="w-full text-left text-xs mb-4">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700 uppercase tracking-wider">
                <th className="pb-2 font-semibold">Level</th>
                <th className="pb-2 font-semibold">Score Range</th>
                <th className="pb-2 font-semibold text-center">Color</th>
                <th className="pb-2 font-semibold">Description</th>
                <th className="pb-2 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {draft.levels.map(l => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: l.color}}></span>
                    {l.level}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{l.score}</td>
                  <td className="py-3 text-center">
                    <div className="w-5 h-5 rounded mx-auto" style={{backgroundColor: l.color}}></div>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-400 pr-4">{l.desc}</td>
                  <td className="py-3 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-700 rounded mr-1"><Edit2 size={12} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors border border-slate-200 dark:border-slate-700 rounded"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800/50">
            <Plus size={14} /> Add Risk Level
          </button>
        </div>

        {/* Right Col: Scoring Weights */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-[#1e293b] flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Scoring Weights</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Set importance weightage for different risk factors.</p>
          
          <div className="flex text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3 px-1">
            <span className="flex-1">Risk Factor</span>
            <span>Weight (%)</span>
          </div>
          
          <div className="flex-1 space-y-3">
            {draft.weights.map(w => (
              <div key={w.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center border border-blue-100 dark:border-blue-800/50">
                    {w.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{w.factor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <input type="number" className="w-14 px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded text-center bg-white dark:bg-[#1e293b] focus:outline-blue-500 text-slate-700 dark:text-slate-200" value={w.weight} onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    const newW = draft.weights.map(wi => wi.id === w.id ? {...wi, weight: val} : wi);
                    setDraft({...draft, weights: newW});
                  }} />
                  <div className="flex flex-col">
                    <button className="text-slate-400 hover:text-slate-600"><ChevronDown size={10} className="rotate-180" /></button>
                    <button className="text-slate-400 hover:text-slate-600"><ChevronDown size={10} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <span className={`text-xs font-bold ${totalWeight === 100 ? 'text-blue-600' : 'text-red-500'}`}>Total Weight: {totalWeight}%</span>
          </div>
        </div>

        {/* Bottom Left: Risk Detection Sensitivity */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-[#1e293b]">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Risk Detection Sensitivity</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Adjust how sensitive the system is when detecting risks.</p>
          
          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">Detection Sensitivity Level</label>
          <div className="relative mb-6">
            <select className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 appearance-none bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-200 focus:outline-blue-500 font-semibold" value={draft.sensitivity} onChange={(e) => setDraft({...draft, sensitivity: e.target.value})}>
              <option value="Low">Low (Fewer alerts)</option>
              <option value="Balanced">Balanced (Recommended)</option>
              <option value="High">High (More alerts)</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
          </div>

          <div className="px-2 mb-6">
            <input type="range" min="1" max="3" step="1" value={draft.sensitivity === "Low" ? 1 : draft.sensitivity === "Balanced" ? 2 : 3} onChange={(e) => {
              const val = e.target.value;
              setDraft({...draft, sensitivity: val === "1" ? "Low" : val === "2" ? "Balanced" : "High"});
            }} className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
            <div className="flex justify-between mt-2 text-[10px] font-semibold text-slate-400">
              <span className="text-center w-16 -ml-4 leading-tight">Low<br/><span className="font-normal text-[9px]">(Fewer alerts)</span></span>
              <span className="text-center w-24 text-slate-800 dark:text-slate-200 leading-tight">Balanced<br/><span className="font-normal text-[9px]">(Recommended)</span></span>
              <span className="text-center w-16 -mr-4 leading-tight">High<br/><span className="font-normal text-[9px]">(More alerts)</span></span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3 border border-blue-100 dark:border-blue-900/50">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed font-medium">Balanced mode provides optimal results with a good balance between detection accuracy and alert frequency.</p>
          </div>
        </div>

        {/* Bottom Middle: Auto Risk Classification */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-[#1e293b]">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Auto Risk Classification</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Configure automatic risk classification settings.</p>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <Toggle checked={draft.autoClassify} onChange={(v) => setDraft({...draft, autoClassify: v})} />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable Auto Classification</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Automatically classify risks based on AI analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Toggle checked={draft.riskScoring} onChange={(v) => setDraft({...draft, riskScoring: v})} />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable Risk Scoring</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Automatically calculate risk scores</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Toggle checked={draft.riskExplanations} onChange={(v) => setDraft({...draft, riskExplanations: v})} />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable Risk Explanations</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Generate AI explanations for detected risks</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">Minimum Confidence Threshold <Info size={12} className="text-slate-400" /></span>
            <div className="flex items-center gap-2">
              <input type="number" className="w-12 px-2 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded text-center bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-200" value={draft.confidenceThreshold} onChange={(e) => setDraft({...draft, confidenceThreshold: parseInt(e.target.value)||0})} />
              <span className="text-xs font-semibold text-slate-500">%</span>
            </div>
          </div>
        </div>

        {/* Bottom Right: Alerts & Notifications */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-white dark:bg-[#1e293b]">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">Risk Alerts & Notifications</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Configure alert rules for different risk levels.</p>
          
          <div className="space-y-3 mb-5">
            {[
              { id: 'critical', label: "Critical Risk Alerts", desc: "Notify when critical risks are detected", checked: draft.alerts.critical },
              { id: 'high', label: "High Risk Alerts", desc: "Notify when high risks are detected", checked: draft.alerts.high },
              { id: 'medium', label: "Medium Risk Alerts", desc: "Notify when medium risks are detected", checked: draft.alerts.medium },
              { id: 'low', label: "Low Risk Alerts", desc: "Notify when low risks are detected", checked: draft.alerts.low },
            ].map(a => (
              <label key={a.id} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 border-slate-300 rounded text-blue-600 focus:ring-blue-500" checked={a.checked} onChange={(e) => setDraft({...draft, alerts: {...draft.alerts, [a.id]: e.target.checked}})} />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{a.label}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{a.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Alert Frequency</label>
            <div className="relative">
              <select className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 appearance-none bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-200 focus:outline-blue-500 font-semibold" value={draft.alertFrequency} onChange={(e) => setDraft({...draft, alertFrequency: e.target.value})}>
                <option value="Instant">Instant</option>
                <option value="Daily">Daily Digest</option>
                <option value="Weekly">Weekly Digest</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      {/* Action Bar */}
      <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
        <button onClick={resetToDefaults} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <RefreshCcw size={14} /> Reset to Defaults
        </button>
        <button onClick={saveChanges} className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
          <Save size={14} /> Save Changes
        </button>
      </div>

    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState("profile");
  const [toast, setToast] = useState("");

  const [profile,    setProfile]    = useState(() => {
    const saved = JSON.parse(localStorage.getItem("settings_profile") || "null");
    if (saved && (saved.fullName || saved.email)) return saved;
    if (user) {
      return {
        fullName: user.fullName || user.name || "",
        email: user.email || "",
        role: user.role || "Legal Team Member",
        phone: user.phone || "",
        company: user.company || "",
        bio: user.bio || "",
      };
    }
    return DEFAULT_PROFILE;
  });
  const [prefs,      setPrefs]      = useState(() => JSON.parse(localStorage.getItem("settings_prefs")      || "null") || DEFAULT_PREFS);
  const [appearance, setAppearance] = useState(() => JSON.parse(localStorage.getItem("settings_appearance") || "null") || DEFAULT_APPEARANCE);
  const [notifs,     setNotifs]     = useState(() => JSON.parse(localStorage.getItem("settings_notifs")     || "null") || DEFAULT_NOTIFS);
  const [analysis,   setAnalysis]   = useState(() => JSON.parse(localStorage.getItem("settings_analysis")   || "null") || DEFAULT_ANALYSIS);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const save = (key, value, msg) => {
    const setterMap = {
      settings_profile:    setProfile,
      settings_prefs:      setPrefs,
      settings_appearance: setAppearance,
      settings_notifs:     setNotifs,
      settings_analysis:   setAnalysis,
    };
    setterMap[key]?.(value);
    localStorage.setItem(key, JSON.stringify(value));
    showToast(msg);
  };

  const renderSection = () => {
    if (activeSection === "profile")     return <ProfileSection     profile={profile} appearance={appearance} save={save} />;
    if (activeSection === "security")    return <SecuritySection    showToast={showToast} />;
    if (activeSection === "preferences") return <PreferencesSection prefs={prefs} save={save} />;
    if (activeSection === "ai")          return <AISection          analysis={analysis} save={save} />;
    if (activeSection === "notifs")      return <NotifsSection      notifs={notifs} save={save} />;
    if (activeSection === "risk")        return <RiskSettingsSection showToast={showToast} />;
    if (activeSection === "categories")  return <ClauseCategoriesSection />;
    return <PlaceholderSection section={activeSection} />;
  };

  const { t } = useLanguage();

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans min-h-screen bg-slate-50 dark:bg-[#0f172a]">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{t("Settings")}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t("Manage your account, preferences and application settings.")}</p>
        </div>
        <UserHeader />
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Left nav */}
        <div className="w-full md:w-56 shrink-0">
          {NAV.map((group) => (
            <div key={group.group} className="mb-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">{group.group}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-slate-500 hover:bg-white dark:bg-[#1e293b] hover:text-slate-800 dark:text-slate-100 hover:shadow-sm"
                    }`}
                  >
                    <Icon size={15} className={isActive ? "text-blue-600" : "text-slate-400"} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {renderSection()}
        </div>
      </div>

      {toast && <Toast msg={toast} />}
    </div>
  );
}
