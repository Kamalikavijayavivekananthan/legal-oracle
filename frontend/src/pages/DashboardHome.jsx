import { 
  FileText, ShieldCheck, AlertTriangle, BarChart2, 
  ChevronRight, Calendar, UploadCloud, CheckCircle2, FileDown 
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import UserHeader from "../components/UserHeader";

export default function DashboardHome({ globalResults }) {
  const navigate = useNavigate();

  // Compute dynamic stats
  const results = globalResults?.results || [];
  
  const totalContracts = globalResults?.total_contracts || 0;
  const contradictionsFound = globalResults?.contradictions_found || 0;
  const highRiskCount = results.filter(r => r.risk_level === "HIGH").length;
  const mediumRiskCount = results.filter(r => r.risk_level === "MEDIUM").length;
  const lowRiskCount = results.filter(r => r.risk_level === "LOW").length;

  const kpis = [
    { title: "Contracts Analyzed", value: totalContracts, subtitle: "Total uploaded contracts", icon: <FileText size={24} className="text-blue-600" />, bg: "bg-blue-50" },
    { title: "Contradictions Found", value: contradictionsFound, subtitle: "Across all contracts", icon: <ShieldCheck size={24} className="text-green-600" />, bg: "bg-green-50" },
    { title: "High Risk Issues", value: highRiskCount, subtitle: "Require immediate attention", icon: <AlertTriangle size={24} className="text-red-600" />, bg: "bg-red-50" },
    { title: "Reports Generated", value: globalResults ? 1 : 0, subtitle: "Downloadable reports", icon: <BarChart2 size={24} className="text-amber-600" />, bg: "bg-amber-50" },
  ];

  const pieData = [
    { name: "High Risk", value: highRiskCount, color: "#ef4444" },
    { name: "Medium Risk", value: mediumRiskCount, color: "#f59e0b" },
    { name: "Low Risk", value: lowRiskCount, color: "#22c55e" },
  ].filter(d => d.value > 0);

  // Use dummy activity for now but conditionally show based on if we have results
  const activities = globalResults ? [
    { title: "Contracts Uploaded", desc: `${totalContracts} files uploaded for analysis`, time: "Just now", icon: <UploadCloud size={16} className="text-white" />, color: "bg-blue-600" },
    { title: "Analysis Completed", desc: "Contradictions detected successfully", time: "Just now", icon: <CheckCircle2 size={16} className="text-white" />, color: "bg-green-500" },
  ] : [];

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

      <div className="grid grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Analysis Results</h3>
            {results.length > 0 && (
              <button onClick={() => navigate("/results")} className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                View All Results <ChevronRight size={16} />
              </button>
            )}
          </div>
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 overflow-hidden">
            {results.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No contracts analyzed yet. Go to <button onClick={() => navigate("/upload")} className="text-blue-600 hover:underline">Upload Contracts</button> to get started.
              </div>
            ) : (
              results.slice(0, 5).map((item, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:bg-slate-950 transition-colors">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-2 truncate" title={item.issue}>{item.issue || "Contradiction Detected"}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>Compared Clauses</span>
                    </div>
                  </div>
                  
                  <div className="w-32">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getRiskColor(item.risk_level)}`}>
                      {item.risk_level} RISK
                    </span>
                    <p className="text-xs font-medium text-slate-500 mt-3">Similarity: {item.similarity}</p>
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
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Risk Distribution</h3>
            {results.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No data to display</p>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData.length > 0 ? pieData : [{name: "None", value: 1, color: "#cbd5e1"}]} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                        {pieData.length > 0 ? pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        )) : <Cell fill="#cbd5e1" />}
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
