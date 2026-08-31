import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, FileText, ShieldCheck, AlertTriangle, BarChart2, ChevronRight, Calendar, BrainCircuit, Lightbulb, Bell, ChevronDown, DollarSign, Clock, FileWarning, Scale, AlertCircle } from "lucide-react";
import axios from "axios";
import UserHeader from "../components/UserHeader";

export default function ResultsList({ globalResults }) {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [detailedExplanations, setDetailedExplanations] = useState({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  if (!globalResults) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-400">No analysis data found.</h2>
        <p className="text-slate-500 mt-2">Please upload and analyze contracts first.</p>
        <button onClick={() => navigate("/upload")} className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">Go to Upload</button>
      </div>
    );
  }

  const results = globalResults.results || [];
  const selectedItem = results[selectedIndex] || null;

  const totalContracts = globalResults.total_contracts || 0;
  const contradictionsFound = globalResults.contradictions_found || 0;
  const highRiskCount = results.filter(r => r.risk_level === "HIGH").length;
  const mediumRiskCount = results.filter(r => r.risk_level === "MEDIUM").length;
  const lowRiskCount = results.filter(r => r.risk_level === "LOW").length;
  
  // Calculate average similarity
  const avgSimilarity = results.length > 0 
    ? (results.reduce((acc, curr) => acc + parseFloat(curr.similarity), 0) / results.length).toFixed(2)
    : "0.00";

  const kpis = [
    { title: "Total Contracts Analyzed", value: totalContracts, subtitle: "Contracts processed", icon: <FileText size={24} className="text-blue-600" />, bg: "bg-blue-50" },
    { title: "Contradictions Found", value: contradictionsFound, subtitle: "Across all contracts", icon: <ShieldCheck size={24} className="text-green-600" />, bg: "bg-green-50" },
    { title: "High Risk Issues", value: highRiskCount, subtitle: "Require immediate attention", icon: <AlertTriangle size={24} className="text-red-600" />, bg: "bg-red-50" },
    { title: "Average Similarity Score", value: avgSimilarity, subtitle: "High similarity detected", icon: <BarChart2 size={24} className="text-amber-600" />, bg: "bg-amber-50" },
  ];

  const getRiskColor = (risk) => {
    if (risk === "HIGH") return "bg-red-500 text-white";
    if (risk === "MEDIUM") return "bg-orange-500 text-white";
    return "bg-green-500 text-white";
  };

  const getRiskBadge = (risk) => {
    if (risk === "HIGH") return "bg-red-100 text-red-600";
    if (risk === "MEDIUM") return "bg-orange-100 text-orange-600";
    return "bg-green-100 text-green-600";
  };

  const handleDownload = async () => {
    try {
      const response = await axios.post("/api-backend/generate-report", globalResults, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const now = new Date();
      const reportName = `Legal_Oracle_Report_${now.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }).replace(/ /g,'')}.pdf`;
      link.setAttribute('download', reportName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      // Save report metadata to localStorage for Reports page
      const filenames = [...new Set(results.flatMap(r => [r.filename1, r.filename2].filter(Boolean)))].join(', ');
      const newReport = {
        id: Date.now(),
        name: reportName,
        files: filenames || 'Contracts analyzed',
        contracts: totalContracts,
        contradictions: contradictionsFound,
        risk: { high: highRiskCount, medium: mediumRiskCount, low: lowRiskCount },
        date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };
      const existing = JSON.parse(localStorage.getItem('savedReports') || '[]');
      localStorage.setItem('savedReports', JSON.stringify([newReport, ...existing]));

    } catch (error) {
      console.error(error);
      alert("Failed to generate report.");
    }
  };

  const handleGenerateAIExplanation = async (item, index) => {
    setIsGeneratingAI(true);
    setAiError(null);
    try {
      const response = await axios.post("/api-backend/api/analyze/explain-contradiction", {
        clause1: item.clause1,
        clause2: item.clause2,
        filename1: item.filename1,
        filename2: item.filename2,
        issue: item.issue || ""
      });
      setDetailedExplanations(prev => ({
        ...prev,
        [index]: response.data
      }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiError("Failed to generate AI explanation. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-screen font-sans bg-slate-50 dark:bg-slate-950">
      
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
        <span>Dashboard</span>
        <ChevronRight size={14} className="text-slate-400" />
        <span className="text-blue-600 font-bold">Analysis Results</span>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Analysis Results</h1>
          <p className="text-slate-500 font-medium">AI analysis complete. Review contradictions and risks found in your contracts.</p>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#1e293b] border border-blue-200 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm"
          >
            <Download size={18} />
            Download Report
          </button>
          
          <div className="flex items-center gap-5 border-l border-slate-200 dark:border-slate-700 pl-6">
            <UserHeader />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-xl ${kpi.bg}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">{kpi.title}</p>
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 mb-0.5">{kpi.value}</h2>
              <p className="text-[11px] text-slate-400 font-medium">{kpi.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: List */}
        <div className="w-full lg:w-[400px] xl:w-[480px] shrink-0 flex flex-col gap-4">
          
          {/* Tabs and Sort */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-3 mb-2">
            <div className="flex gap-6 text-sm font-bold">
              <button className="text-blue-600 border-b-2 border-blue-600 pb-3 -mb-[14px]">All Results ({results.length})</button>
              <button className="text-slate-400 hover:text-slate-600 dark:text-slate-300 pb-3 -mb-[14px]">High Risk ({highRiskCount})</button>
              <button className="text-slate-400 hover:text-slate-600 dark:text-slate-300 pb-3 -mb-[14px]">Medium Risk ({mediumRiskCount})</button>
              <button className="text-slate-400 hover:text-slate-600 dark:text-slate-300 pb-3 -mb-[14px]">Low Risk ({lowRiskCount})</button>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Sort by:</span>
              <select className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] rounded px-2 py-1 outline-none text-slate-700 dark:text-slate-200">
                <option>Risk Level</option>
              </select>
            </div>
          </div>

          {/* List Items */}
          <div className="flex flex-col gap-3 h-[700px] overflow-y-auto pr-2 pb-10">
            {results.map((item, idx) => {
              const isActive = selectedIndex === idx;
              
              // Determine icon color based on risk
              let IconColor = "text-green-500";
              if (item.risk_level === "HIGH") IconColor = "text-red-500";
              else if (item.risk_level === "MEDIUM") IconColor = "text-orange-500";

              let Icon = AlertTriangle;
              if (item.issue.includes("Payment")) Icon = DollarSign;
              else if (item.issue.includes("Liability")) Icon = ShieldCheck;
              else if (item.issue.includes("Penalty")) Icon = Clock;
              else if (item.issue.includes("Termination")) Icon = FileText;
              else if (item.issue.includes("Governing Law")) Icon = Scale;

              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative p-5 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
                    isActive 
                      ? "bg-white dark:bg-[#1e293b] shadow-md border border-blue-200" 
                      : "bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-800 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {/* Left indicator line for active item */}
                  {isActive && (
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${item.risk_level === "HIGH" ? "bg-red-500" : item.risk_level === "MEDIUM" ? "bg-orange-500" : "bg-green-500"}`} />
                  )}

                  <div className="flex gap-4 items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.risk_level === "HIGH" ? "bg-red-50" : item.risk_level === "MEDIUM" ? "bg-orange-50" : "bg-green-50"}`}>
                      <Icon size={18} className={IconColor} />
                    </div>
                    <div>
                      <h3 className={`font-bold mb-1 ${isActive ? "text-slate-900 dark:text-slate-50" : "text-slate-700 dark:text-slate-200"}`}>
                        {item.issue || "Contradiction Detected"}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 truncate max-w-[200px] lg:max-w-[250px]">
                        <span className="truncate">{item.filename1 || "Contract A"}</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded shrink-0">vs</span>
                        <span className="truncate">{item.filename2 || "Contract B"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase ${getRiskColor(item.risk_level)}`}>
                      {item.risk_level} RISK
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-3">
                      Similarity: {item.similarity}
                      <ChevronRight size={16} className={isActive ? "text-blue-500" : "text-slate-300"} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detail View */}
        <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 h-fit">
          {!selectedItem ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <ShieldCheck size={64} className="text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">No Contradictions Found!</h2>
              <p className="text-slate-500 max-w-md">The AI analyzed the uploaded contracts and did not detect any conflicting clauses or numbers. You can still download the report.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">{selectedItem.issue || "Contradiction Detected"}</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-slate-500">Similarity Score:</span>
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">{selectedItem.similarity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                      <Calendar size={14} />
                      <span>Detected on: {selectedItem.date || "Today, 10:30 AM"}</span>
                    </div>
                  </div>
                </div>
                
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-md uppercase ${getRiskColor(selectedItem.risk_level)}`}>
                  {selectedItem.risk_level} RISK
                </span>
              </div>

              {/* Clause Comparison Boxes */}
              <div className="space-y-4 mb-8">
                <div className="bg-green-50 border border-green-100 p-5 rounded-xl">
                  <h4 className="text-green-700 font-bold mb-3 text-sm">Contract A Clause</h4>
                  <p className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed relative pl-4 border-l-2 border-green-300">
                    <span className="absolute -left-2 top-0 text-green-300 font-serif text-2xl leading-none">"</span>
                    {selectedItem.clause1}
                  </p>
                  <p className="text-xs text-slate-400 mt-3 font-medium">Source: {selectedItem.filename1 || "Vendor_Agreement_A.pdf"} {selectedItem.page1 && `(${selectedItem.page1})`}</p>
                </div>

                <div className="bg-red-50 border border-red-100 p-5 rounded-xl">
                  <h4 className="text-red-700 font-bold mb-3 text-sm">Contract B Clause</h4>
                  <p className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed relative pl-4 border-l-2 border-red-300">
                    <span className="absolute -left-2 top-0 text-red-300 font-serif text-2xl leading-none">"</span>
                    {selectedItem.clause2 || "All invoices submitted by the vendor shall be settled within 60 days from the invoice submission date."}
                  </p>
                  <p className="text-xs text-slate-400 mt-3 font-medium">Source: {selectedItem.filename2 || "Vendor_Agreement_B.pdf"} {selectedItem.page2 && `(${selectedItem.page2})`}</p>
                </div>
              </div>

              {/* Analysis & Recommendation */}
              <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-8">
                {detailedExplanations[selectedIndex] ? (
                  <div className="space-y-6">
                    {/* What Was Found */}
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-xl p-5">
                      <h3 className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold mb-3 text-sm">
                        <BrainCircuit size={16} /> What Was Found?
                      </h3>
                      <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{detailedExplanations[selectedIndex].what_was_found}</p>
                    </div>

                    {/* Contract A & B */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">Contract A</h4>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">"{detailedExplanations[selectedIndex].contract_a.clause}"</p>
                        <p className="text-xs text-slate-500 mt-2">Source: {detailedExplanations[selectedIndex].contract_a.document_name} {detailedExplanations[selectedIndex].contract_a.reference !== "N/A" && `(${detailedExplanations[selectedIndex].contract_a.reference})`}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">Contract B</h4>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">"{detailedExplanations[selectedIndex].contract_b.clause}"</p>
                        <p className="text-xs text-slate-500 mt-2">Source: {detailedExplanations[selectedIndex].contract_b.document_name} {detailedExplanations[selectedIndex].contract_b.reference !== "N/A" && `(${detailedExplanations[selectedIndex].contract_b.reference})`}</p>
                      </div>
                    </div>

                    {/* Why Is This Important & Risk Level */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-5">
                        <h3 className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-3 text-sm">
                          <AlertCircle size={16} /> Why Is This Important?
                        </h3>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{detailedExplanations[selectedIndex].why_it_matters}</p>
                      </div>
                      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex flex-col justify-center">
                        <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2 text-xs uppercase tracking-wider">Risk Level</h3>
                        <div className="flex items-center gap-3 mb-2">
                           <span className={`text-xs font-black px-3 py-1.5 rounded-md uppercase ${getRiskColor(detailedExplanations[selectedIndex].risk_level)}`}>
                             {detailedExplanations[selectedIndex].risk_level} RISK
                           </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">{detailedExplanations[selectedIndex].risk_reason}</p>
                      </div>
                    </div>

                    {/* What Should Be Reviewed */}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-5">
                      <h3 className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-3 text-sm">
                        <Lightbulb size={16} /> What Should Be Reviewed?
                      </h3>
                      <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">{detailedExplanations[selectedIndex].what_should_be_reviewed}</p>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[10px] text-slate-400 text-center italic mt-4">{detailedExplanations[selectedIndex].disclaimer}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <BrainCircuit size={48} className="text-purple-400 mb-4" />
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Explainable AI Analysis</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm text-center max-w-md mb-6">Generate a deep, structured legal analysis of this contradiction using our advanced AI to understand the exact differences, risks, and next steps.</p>
                    {aiError && <p className="text-red-500 text-sm mb-4 font-medium">{aiError}</p>}
                    <button 
                      onClick={() => handleGenerateAIExplanation(selectedItem, selectedIndex)}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {isGeneratingAI ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BrainCircuit size={18} />
                          Generate AI Explanation
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
