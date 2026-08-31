import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Brain, CheckCircle2 } from "lucide-react";

export default function ContradictionDetails({ globalResults }) {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!globalResults || !globalResults.results[id]) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-slate-400">Contradiction not found.</h2>
        <button onClick={() => navigate("/results")} className="mt-4 text-blue-600 hover:underline">Go back to Results</button>
      </div>
    );
  }

  const item = globalResults.results[id];

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate("/results")}
        className="flex items-center gap-2 text-blue-600 font-medium hover:underline mb-6 text-sm"
      >
        <ArrowLeft size={16} /> Back to Results
      </button>

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{item.issue || "Contradiction Detected"}</h1>
          <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${
            item.risk_level === "HIGH" ? "bg-red-600" : item.risk_level === "MEDIUM" ? "bg-orange-500" : "bg-green-500"
          }`}>
            {item.risk_level} RISK
          </span>
        </div>
        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Similarity Score: {item.similarity}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-emerald-800 mb-4">Contract A Clause</h3>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{item.clause1}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-amber-800 mb-4">Contract B Clause</h3>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{item.clause2}</p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 p-8 rounded-xl space-y-8 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
            <Brain size={18} />
            <h3 className="text-sm">AI Legal Analysis</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{item.ai_explanation}</p>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-100 text-sm shrink-0">
            Risk Level 
            <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ml-1 ${
              item.risk_level === "HIGH" ? "bg-red-600" : item.risk_level === "MEDIUM" ? "bg-orange-500" : "bg-green-500"
            }`}>
              {item.risk_level} RISK
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            <span className="font-medium text-slate-800 dark:text-slate-100 mr-2">Reason:</span> {item.ai_reason || "Direct conflict affects obligations."}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3 text-blue-600 font-semibold">
            <CheckCircle2 size={18} />
            <h3 className="text-sm">Recommendation</h3>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{item.ai_recommendation || "Align both contracts to have consistent terms."}</p>
        </div>
      </div>
    </div>
  );
}
