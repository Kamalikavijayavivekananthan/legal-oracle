import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Shield,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart2,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import UserHeader from "../components/UserHeader";

// ─── helpers ────────────────────────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
  "Payment Terms":      ["payment", "invoice", "settle", "30 day", "60 day"],
  "Liability & Indemnity": ["liability", "indemnity", "damages", "indemnif"],
  "Termination":        ["terminat"],
  "Penalties":          ["penalty", "penalt", "fine"],
  "Confidentiality":    ["confidential", "nda", "non-disclosure"],
  "Governing Law":      ["governing law", "jurisdiction", "arbitration"],
};

function classifyIssue(issue, clause1 = "", clause2 = "") {
  const text = (issue + " " + clause1 + " " + clause2).toLowerCase();
  for (const [cat, kws] of Object.entries(CATEGORY_KEYWORDS)) {
    if (kws.some((k) => text.includes(k))) return cat;
  }
  return "Other Clauses";
}

const RISK_COLORS = {
  HIGH:   { bg: "bg-red-50",    text: "text-red-600",    badge: "bg-red-500",    border: "border-red-200",    bar: "#ef4444" },
  MEDIUM: { bg: "bg-orange-50", text: "text-orange-500", badge: "bg-orange-500", border: "border-orange-200", bar: "#f97316" },
  LOW:    { bg: "bg-green-50",  text: "text-green-600",  badge: "bg-green-500",  border: "border-green-200",  bar: "#22c55e" },
};

// Simple SVG donut chart
function DonutChart({ high, medium, low, total }) {
  const r = 70, cx = 90, cy = 90, strokeW = 22;
  const circ = 2 * Math.PI * r;
  const highPct   = total ? high   / total : 0;
  const medPct    = total ? medium / total : 0;
  const lowPct    = total ? low    / total : 0;
  const highDash  = circ * highPct;
  const medDash   = circ * medPct;
  const lowDash   = circ * lowPct;
  // offsets
  const highOffset  = 0;
  const medOffset   = -(circ * highPct);
  const lowOffset   = -(circ * (highPct + medPct));

  if (total === 0) {
    return (
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth={strokeW} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fill="#94a3b8" fontWeight="600">No data</text>
      </svg>
    );
  }

  return (
    <svg width="180" height="180" viewBox="0 0 180 180">
      {/* Low */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22c55e" strokeWidth={strokeW}
        strokeDasharray={`${lowDash} ${circ - lowDash}`}
        strokeDashoffset={lowOffset}
        transform="rotate(-90 90 90)" />
      {/* Medium */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f97316" strokeWidth={strokeW}
        strokeDasharray={`${medDash} ${circ - medDash}`}
        strokeDashoffset={medOffset}
        transform="rotate(-90 90 90)" />
      {/* High */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth={strokeW}
        strokeDasharray={`${highDash} ${circ - highDash}`}
        strokeDashoffset={highOffset}
        transform="rotate(-90 90 90)" />
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="26" fill="#0f172a" fontWeight="800">{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="600">Total Risks</text>
    </svg>
  );
}

// Horizontal bar for category chart
function CategoryBar({ label, count, total, color }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium w-36 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-slate-500 font-semibold w-16 text-right">
        {count} ({pct}%)
      </span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function RiskOverview({ globalResults }) {
  const navigate = useNavigate();
  const results = useMemo(() => globalResults?.results || [], [globalResults]);

  const highRisk   = results.filter((r) => r.risk_level === "HIGH");
  const mediumRisk = results.filter((r) => r.risk_level === "MEDIUM");
  const lowRisk    = results.filter((r) => r.risk_level === "LOW");
  const total      = results.length;

  // Category breakdown
  const categoryMap = useMemo(() => {
    const map = {};
    results.forEach((r) => {
      const cat = classifyIssue(r.issue || "", r.clause1, r.clause2);
      map[cat] = (map[cat] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, count]) => ({ label, count }));
  }, [results]);

  // Recent activity — last 6 items
  const recentActivity = useMemo(() =>
    [...results].slice(0, 6).map((r, i) => ({
      risk: r.risk_level,
      file: r.filename1 || "Contract",
      issue: r.issue || "Contradiction detected",
      time: i === 0 ? "Just now" : `${i * 15} min ago`,
    })),
    [results]
  );

  // No data state
  if (!globalResults || results.length === 0) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert size={40} className="text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">No Risk Data Yet</h2>
        <p className="text-slate-400 text-sm text-center max-w-xs mb-6">
          Upload and analyse contracts first. Risk overview will be populated automatically from your analysis results.
        </p>
        <button
          onClick={() => navigate("/upload")}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
        >
          Upload Contracts
        </button>
      </div>
    );
  }

  const categoryBarColors = ["#ef4444", "#f97316", "#f59e0b", "#22c55e", "#3b82f6", "#8b5cf6", "#94a3b8"];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span>Dashboard</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-blue-600 font-bold">Risk Overview</span>
        </div>
        {/* Profile */}
        <div className="flex items-center gap-4">
          <UserHeader />
        </div>
      </div>

      <div className="flex justify-between items-start mb-8 mt-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Risk Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track and analyse risks across all your contract analyses.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-lg shadow-sm">
          <Activity size={14} className="text-blue-500" />
          <span className="font-medium">Based on {globalResults.total_contracts} contract(s) · {total} issue(s) found</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        {[
          { label: "High Risk Issues",   value: highRisk.length,   icon: <AlertTriangle size={22} />, color: "text-red-600",    bg: "bg-red-50",    trend: "up" },
          { label: "Medium Risk Issues", value: mediumRisk.length, icon: <AlertCircle size={22} />,   color: "text-orange-500", bg: "bg-orange-50", trend: "flat" },
          { label: "Low Risk Issues",    value: lowRisk.length,    icon: <Shield size={22} />,        color: "text-green-600",  bg: "bg-green-50",  trend: "down" },
          { label: "Total Risks Found",  value: total,             icon: <BarChart2 size={22} />,     color: "text-blue-600",   bg: "bg-blue-50",   trend: "up" },
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{card.label}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-slate-50 leading-none mt-0.5">{card.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {card.trend === "up"   && <TrendingUp size={12} className="text-red-500" />}
                {card.trend === "down" && <TrendingDown size={12} className="text-green-500" />}
                {card.trend === "flat" && <Minus size={12} className="text-slate-400" />}
                <span className="text-[11px] text-slate-400">from current analysis</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* Donut */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-4">Risk Distribution</h2>
          <div className="flex flex-col items-center gap-5">
            <DonutChart high={highRisk.length} medium={mediumRisk.length} low={lowRisk.length} total={total} />
            <div className="flex flex-col gap-2 w-full">
              {[
                { label: "High Risk",   count: highRisk.length,   color: "#ef4444" },
                { label: "Medium Risk", count: mediumRisk.length, color: "#f97316" },
                { label: "Low Risk",    count: lowRisk.length,    color: "#22c55e" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600 dark:text-slate-300 font-medium">{item.label}</span>
                  </div>
                  <span className="text-slate-800 dark:text-slate-100 font-bold">
                    {item.count}{" "}
                    <span className="text-slate-400 font-normal text-xs">
                      ({total ? Math.round((item.count / total) * 100) : 0}%)
                    </span>
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-slate-50">
                <span>Total</span>
                <span>{total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Risk by Category */}
        <div className="md:col-span-2 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-5">Risk by Category</h2>
          {categoryMap.length === 0 ? (
            <p className="text-slate-400 text-sm">No category data available.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {categoryMap.map((item, i) => (
                <CategoryBar
                  key={item.label}
                  label={item.label}
                  count={item.count}
                  total={total}
                  color={categoryBarColors[i % categoryBarColors.length]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Top High Risk Issues Table */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">Top High Risk Issues</h2>
          </div>
          {highRisk.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <CheckCircle2 size={32} className="text-green-400 mb-2" />
              <p className="text-slate-500 text-sm font-medium">No high risk issues detected!</p>
              <p className="text-slate-400 text-xs mt-1">All contradictions are medium or low risk.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <th className="p-4">Issue</th>
                      <th className="p-4 text-center">Contracts</th>
                      <th className="p-4 text-center">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {highRisk.slice(0, 5).map((item, i) => (
                      <tr key={i} className="hover:bg-red-50/30 transition-colors">
                        <td className="p-4">
                          <div className="flex items-start gap-2">
                            <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                                {item.issue || "Contradiction Detected"}
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                                {item.filename1} vs {item.filename2}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center text-sm font-medium text-slate-700 dark:text-slate-200">2</td>
                        <td className="p-4 text-center">
                          <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-red-500 text-white uppercase">
                            HIGH
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {highRisk.length > 5 && (
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
                  <button
                    onClick={() => navigate("/results")}
                    className="text-sm font-semibold text-red-500 hover:text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    View All {highRisk.length} High Risk Issues
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Recent Risk Activity */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-50">Recent Risk Activity</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                <ShieldCheck size={32} className="text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm">No activity yet.</p>
              </div>
            ) : (
              recentActivity.map((act, i) => {
                const Icon = act.risk === "HIGH" ? AlertTriangle : act.risk === "MEDIUM" ? AlertCircle : CheckCircle2;
                const color = act.risk === "HIGH" ? "text-red-500 bg-red-50" : act.risk === "MEDIUM" ? "text-orange-500 bg-orange-50" : "text-green-500 bg-green-50";
                return (
                  <div key={i} className="flex items-start gap-3 p-4 hover:bg-slate-50 dark:bg-slate-950/50 transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug truncate">
                        {act.risk} risk issue detected in "{act.file}"
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{act.issue}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium shrink-0 mt-0.5">{act.time}</span>
                  </div>
                );
              })
            )}
          </div>
          {results.length > 6 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => navigate("/results")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 px-4 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                View All Activity
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
