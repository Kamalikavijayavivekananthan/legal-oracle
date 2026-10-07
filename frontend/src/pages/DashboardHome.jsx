import React, { useState, useEffect } from "react";
import { 
  FileText, ShieldCheck, AlertTriangle, BarChart2, 
  ChevronRight, Calendar, UploadCloud, CheckCircle2, FileDown 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import { useUser } from "../context/UserContext";
import { getUserData } from "../utils/userStorage";

export default function DashboardHome({ globalResults }) {
  const navigate = useNavigate();
  const { userKey } = useUser();
  const [savedReports, setSavedReports] = useState([]);

  // Load saved reports from user-scoped storage and listen to updates
  useEffect(() => {
    const loadReports = () => {
      if (!userKey) {
        setSavedReports([]);
        return;
      }
      const stored = getUserData(userKey, "saved_reports", []);
      setSavedReports(stored || []);
    };

    loadReports();

    const handleCustomEvent = (e) => {
      if (e.detail?.userKey === userKey && e.detail?.itemKey === "saved_reports") {
        setSavedReports(e.detail.value || []);
      }
    };

    window.addEventListener("storage", loadReports);
    window.addEventListener("legaloracle_user_data_changed", handleCustomEvent);
    return () => {
      window.removeEventListener("storage", loadReports);
      window.removeEventListener("legaloracle_user_data_changed", handleCustomEvent);
    };
  }, [userKey]);

  // Compute stats from active analysis results
  const results = globalResults?.results || [];
  
  // Total contracts analyzed
  const globalContracts = globalResults?.total_contracts || 0;
  const reportsContracts = savedReports.reduce((acc, r) => acc + (Number(r.contracts) || 0), 0);
  const totalContracts = globalContracts > 0 ? globalContracts : reportsContracts;

  // Total contradictions found
  const globalContradictions = globalResults?.contradictions_found || 0;
  const reportsContradictions = savedReports.reduce((acc, r) => acc + (Number(r.contradictions) || 0), 0);
  const contradictionsFound = globalContradictions > 0 ? globalContradictions : reportsContradictions;

  // Risk counts
  const resultsHigh = results.filter(r => r.risk_level === "HIGH").length;
  const resultsMed  = results.filter(r => r.risk_level === "MEDIUM").length;
  const resultsLow  = results.filter(r => r.risk_level === "LOW").length;

  const reportsHigh = savedReports.reduce((acc, r) => acc + (Number(r.risk?.high) || 0), 0);
  const reportsMed  = savedReports.reduce((acc, r) => acc + (Number(r.risk?.medium) || 0), 0);
  const reportsLow  = savedReports.reduce((acc, r) => acc + (Number(r.risk?.low) || 0), 0);

  const highRiskCount   = results.length > 0 ? resultsHigh : reportsHigh;
  const mediumRiskCount = results.length > 0 ? resultsMed  : reportsMed;
  const lowRiskCount    = results.length > 0 ? resultsLow  : reportsLow;

  // Reports generated count
  const reportsGenerated = savedReports.length > 0 ? savedReports.length : (globalResults ? 1 : 0);

  const kpis = [
    { title: "Contracts Analyzed", value: totalContracts, subtitle: "Total uploaded contracts", icon: <FileText size={24} className="text-blue-600" />, bg: "bg-blue-50" },
    { title: "Contradictions Found", value: contradictionsFound, subtitle: "Across all contracts", icon: <ShieldCheck size={24} className="text-green-600" />, bg: "bg-green-50" },
    { title: "High Risk Issues", value: highRiskCount, subtitle: "Require immediate attention", icon: <AlertTriangle size={24} className="text-red-600" />, bg: "bg-red-50" },
    { title: "Reports Generated", value: reportsGenerated, subtitle: "Downloadable reports", icon: <BarChart2 size={24} className="text-amber-600" />, bg: "bg-amber-50" },
  ];

  const pieData = [
    { name: "High Risk", value: highRiskCount, color: "#ef4444" },
    { name: "Medium Risk", value: mediumRiskCount, color: "#f59e0b" },
    { name: "Low Risk", value: lowRiskCount, color: "#22c55e" },
  ].filter(d => d.value > 0);

  // Dynamic recent activities
  let activities = [];
  if (globalResults) {
    activities.push(
      { title: "Contracts Uploaded", desc: `${totalContracts} files uploaded for analysis`, time: "Just now", icon: <UploadCloud size={16} className="text-white" />, color: "bg-blue-600" },
      { title: "Analysis Completed", desc: `${contradictionsFound} contradictions detected successfully`, time: "Just now", icon: <CheckCircle2 size={16} className="text-white" />, color: "bg-green-500" }
    );
  }
  if (savedReports.length > 0) {
    savedReports.slice(0, 3).forEach((r) => {
      activities.push({
        title: `Report Generated`,
        desc: `${r.name} (${r.contradictions} contradictions)`,
        time: `${r.date} ${r.time || ''}`.trim(),
        icon: <FileDown size={16} className="text-white" />,
        color: "bg-indigo-500"
      });
    });
  }

  const getRiskColor = (risk) => {
    if (risk === "HIGH") return "bg-red-100 text-red-600";
    if (risk === "MEDIUM") return "bg-orange-100 text-orange-600";
    return "bg-green-100 text-green-600";
  };

  return (
    <div className="p-10 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-500">AI-Powered Contract Analysis & Contradiction Detection</p>
        </div>
        <div className="flex items-center gap-4">
          <UserHeader />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start gap-4">
            <div className={`p-4 rounded-lg ${kpi.bg}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{kpi.title}</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">{kpi.value}</h2>
              <p className="text-xs text-slate-400">{kpi.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Analysis / Reports */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {results.length > 0 ? "Recent Analysis Results" : "Recent Reports & Analysis"}
            </h3>
            {results.length > 0 ? (
              <button onClick={() => navigate("/results")} className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All Results <ChevronRight size={16} />
              </button>
            ) : savedReports.length > 0 ? (
              <button onClick={() => navigate("/reports")} className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All Reports <ChevronRight size={16} />
              </button>
            ) : null}
          </div>

          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {results.length > 0 ? (
              results.slice(0, 5).map((item, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 truncate" title={item.issue}>{item.issue || "Contradiction Detected"}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>{item.filename1 || "Contract A"} vs {item.filename2 || "Contract B"}</span>
                    </div>
                  </div>
                  
                  <div className="w-32">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getRiskColor(item.risk_level)}`}>
                      {item.risk_level} RISK
                    </span>
                    <p className="text-xs font-medium text-slate-500 mt-2">Similarity: {item.similarity}</p>
                  </div>

                  <div className="w-28 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={14} /> Today
                    </div>
                  </div>

                  <div>
                    <button onClick={() => navigate(`/results/${idx}`)} className="px-4 py-2 border border-blue-200 text-blue-600 font-medium text-xs rounded-lg hover:bg-blue-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : savedReports.length > 0 ? (
              savedReports.slice(0, 5).map((rep) => (
                <div key={rep.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1 truncate">{rep.name}</h4>
                    <p className="text-xs text-slate-500 truncate max-w-sm">{rep.files}</p>
                  </div>
                  
                  <div className="w-32">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      {rep.risk?.high > 0 && <span className="text-red-500">{rep.risk.high} High</span>}
                      {rep.risk?.medium > 0 && <span className="text-orange-500">{rep.risk.medium} Med</span>}
                      {rep.risk?.low > 0 && <span className="text-emerald-500">{rep.risk.low} Low</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{rep.contradictions} Contradictions</p>
                  </div>

                  <div className="w-28 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} /> {rep.date}
                    </div>
                  </div>

                  <div>
                    <button onClick={() => navigate("/reports")} className="px-4 py-2 border border-blue-200 text-blue-600 font-medium text-xs rounded-lg hover:bg-blue-50 transition-colors">
                      View Report
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                No contracts analyzed yet. Go to <button onClick={() => navigate("/upload")} className="text-blue-600 hover:underline">Upload Contracts</button> to get started.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Risk Distribution & Activity */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Risk Distribution</h3>
            {pieData.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No data to display</p>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 mb-3 last:mb-0 text-sm font-medium text-slate-700 dark:text-slate-200">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name} ({item.value})
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-800 dark:text-slate-100">
                    Total Issues: {contradictionsFound}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Recent Activity</h3>
            {activities.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No activity yet</p>
            ) : (
              <div className="space-y-6">
                {activities.map((act, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {idx !== activities.length - 1 && (
                      <div className="absolute top-8 left-4 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-800" />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${act.color}`}>
                      {act.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{act.title}</h4>
                        <span className="text-[11px] font-medium text-slate-400">{act.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{act.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
