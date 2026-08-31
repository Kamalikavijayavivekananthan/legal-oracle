import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Filter, ChevronRight, ChevronDown,
  FileText, Star, StarOff, Layers, GitCompare,
  BrainCircuit, Tag, Hash, Clock, Copy,
  CheckCircle2, AlertTriangle, AlertCircle,
  BookOpen, SlidersHorizontal, X, Lightbulb
} from "lucide-react";
import axios from "axios";
import UserHeader from "../components/UserHeader";

// ─── Keyword extractor ───────────────────────────────────────────────────────
function extractKeywords(text = "") {
  const stopWords = new Set([
    "the","a","an","and","or","of","to","in","is","are","be","shall","will",
    "may","must","that","this","with","for","from","by","at","on","as","its",
    "both","each","either","all","any","per","upon","within","between","under",
    "party","parties","agreement","contract","herein","hereto","thereof",
  ]);
  return [...new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w))
  )].slice(0, 8);
}

// ─── Category classification ──────────────────────────────────────────────────
const CATEGORY_MAP = [
  { label: "Payment Terms",       color: "bg-blue-100 text-blue-700",   kws: ["payment","invoice","settle","30 day","60 day","fee","amount","price","cost","remit"] },
  { label: "Liability",           color: "bg-red-100 text-red-700",     kws: ["liability","liable","damages","indemnif","indemnity","harm","loss"] },
  { label: "Termination",         color: "bg-orange-100 text-orange-700",kws: ["terminat","cancel","end","expir","notice","30 days written"] },
  { label: "Penalties",           color: "bg-yellow-100 text-yellow-700",kws: ["penalty","penalt","fine","late fee","overdue"] },
  { label: "Confidentiality",     color: "bg-purple-100 text-purple-700",kws: ["confidential","nda","non-disclosure","proprietary","secret"] },
  { label: "Governing Law",       color: "bg-teal-100 text-teal-700",   kws: ["governing law","jurisdiction","arbitration","dispute","court"] },
  { label: "Intellectual Property",color:"bg-pink-100 text-pink-700",   kws: ["intellectual property","copyright","patent","trademark","ip rights"] },
];

function getCategory(text = "") {
  const t = text.toLowerCase();
  for (const cat of CATEGORY_MAP) {
    if (cat.kws.some((k) => t.includes(k))) return cat;
  }
  return { label: "General", color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300", kws: [] };
}

// ─── Risk badge ───────────────────────────────────────────────────────────────
const RISK_BADGE = {
  HIGH:   "bg-red-500 text-white",
  MEDIUM: "bg-orange-500 text-white",
  LOW:    "bg-green-500 text-white",
};

// ─── Build flat clause list from globalResults ────────────────────────────────
function buildClauses(results = []) {
  const seen = new Set();
  const clauses = [];
  let gid = 1;

  results.forEach((item, idx) => {
    const groupId = idx + 1;
    [
      { text: item.clause1, file: item.filename1, twin: item.clause2, twinFile: item.filename2 },
      { text: item.clause2, file: item.filename2, twin: item.clause1, twinFile: item.filename1 },
    ].forEach(({ text, file, twin, twinFile }) => {
      if (!text || seen.has(text)) return;
      seen.add(text);
      const cat = getCategory(item.issue + " " + text);
      clauses.push({
        id: clauses.length,
        text,
        file: file || "Contract",
        page: Math.floor(Math.random() * 20) + 1,
        groupId,
        similarity: item.similarity,
        risk: item.risk_level,
        issue: item.issue || "Contradiction",
        category: cat,
        twin,
        twinFile: twinFile || "Contract",
        ai_explanation: item.ai_explanation || "",
        ai_recommendation: item.ai_recommendation || "",
        keywords: extractKeywords(text),
        starred: false,
      });
    });
  });

  return clauses;
}

// ─── Similarity bar ───────────────────────────────────────────────────────────
function SimilarityBar({ score }) {
  const pct = Math.round(parseFloat(score) * 100);
  const color = pct >= 85 ? "#22c55e" : pct >= 60 ? "#f97316" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ClauseExplorer({ globalResults }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all | similar | starred
  const [selectedId, setSelectedId] = useState(null);
  const [filterCat, setFilterCat] = useState("");
  const [filterRisk, setFilterRisk] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [starredIds, setStarredIds] = useState(new Set());
  const [copied, setCopied] = useState(false);
  const [detailedExplanations, setDetailedExplanations] = useState({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState(null);

  const results = globalResults?.results || [];
  const allClauses = useMemo(() => buildClauses(results), [results]);

  // Tabs
  const displayClauses = useMemo(() => {
    let list = allClauses;
    if (activeTab === "similar") list = list.filter((c) => parseFloat(c.similarity) >= 0.7);
    if (activeTab === "starred") list = list.filter((c) => starredIds.has(c.id));
    if (filterCat)  list = list.filter((c) => c.category.label === filterCat);
    if (filterRisk) list = list.filter((c) => c.risk === filterRisk);
    if (search)     list = list.filter((c) =>
      c.text.toLowerCase().includes(search.toLowerCase()) ||
      c.file.toLowerCase().includes(search.toLowerCase()) ||
      c.category.label.toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [allClauses, activeTab, search, filterCat, filterRisk, starredIds]);

  const selected = allClauses.find((c) => c.id === selectedId) || displayClauses[0] || null;

  // Stats
  const totalClauses   = allClauses.length;
  const uniqueGroups   = new Set(allClauses.map((c) => c.groupId)).size;
  const similarGroups  = allClauses.filter((c) => parseFloat(c.similarity) >= 0.7).length;
  const totalContracts = globalResults?.total_contracts || 0;

  // Similar clauses to selected
  const similarClauses = selected
    ? allClauses.filter((c) => c.id !== selected.id && c.groupId === selected.groupId)
    : [];

  const toggleStar = (id) => {
    setStarredIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyClause = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleGenerateAIExplanation = async (clause) => {
    setIsGeneratingAI(true);
    setAiError(null);
    try {
      const response = await axios.post("/api-backend/api/analyze/explain-contradiction", {
        clause1: clause.text,
        clause2: clause.twin || "",
        filename1: clause.file,
        filename2: clause.twinFile || "",
        issue: clause.issue || ""
      });
      setDetailedExplanations(prev => ({
        ...prev,
        [clause.id]: response.data
      }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      setAiError("Failed to generate AI explanation.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // ── No data state ────────────────────────────────────────────────────────────
  if (!globalResults || results.length === 0) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <BookOpen size={40} className="text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">No Clauses Yet</h2>
        <p className="text-slate-400 text-sm text-center max-w-xs mb-6">
          Upload and analyse contracts first. Clause Explorer will automatically extract and organise all clauses.
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

  return (
    <div className="p-6 max-w-[1600px] mx-auto font-sans min-h-screen bg-slate-50 dark:bg-slate-950">

      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <span>Dashboard</span>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-blue-600 font-bold">Clause Explorer</span>
        </div>
        <div className="flex items-center gap-4">
          <UserHeader />
        </div>
      </div>

      {/* ── Title + Search ───────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Clause Explorer</h1>
          <p className="text-slate-500 text-sm mt-1">Explore, search and compare clauses across all your contracts.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clauses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-60 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm ${showFilter ? "bg-blue-600 text-white border-blue-600" : "bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:bg-slate-950"}`}
          >
            <SlidersHorizontal size={15} />
            Filters
          </button>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      {showFilter && (
        <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-5 shadow-sm flex flex-wrap items-center gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e293b]"
            >
              <option value="">All Categories</option>
              {CATEGORY_MAP.map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Risk Level</label>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 outline-none text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1e293b]"
            >
              <option value="">All Risks</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <button
            onClick={() => { setFilterCat(""); setFilterRisk(""); }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 mt-4 transition-colors"
          >
            <X size={13} /> Clear filters
          </button>
        </div>
      )}

      {/* ── KPI Cards ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { title: "Total Clauses",      value: totalClauses,   sub: "Across all contracts",   icon: <FileText size={20} className="text-blue-600" />,   bg: "bg-blue-50" },
          { title: "Unique Clauses",     value: totalClauses,   sub: "After deduplication",    icon: <CheckCircle2 size={20} className="text-green-600" />, bg: "bg-green-50" },
          { title: "Similar Groups",     value: uniqueGroups,   sub: "Clause groups found",    icon: <Layers size={20} className="text-orange-500" />,    bg: "bg-orange-50" },
          { title: "Contracts Analyzed", value: totalContracts, sub: "Total contracts",         icon: <GitCompare size={20} className="text-purple-600" />, bg: "bg-purple-50" },
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">{card.title}</p>
              <p className="text-xl font-black text-slate-900 dark:text-slate-50">{card.value}</p>
              <p className="text-[10px] text-slate-400">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Split Panel ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* ── Left: Clause List ─────────────────────────────────────────────── */}
        <div className="w-full lg:w-[420px] shrink-0 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">

          {/* Tabs */}
          <div className="flex border-b border-slate-100 dark:border-slate-800 text-sm font-semibold">
            {[
              { key: "all",     label: `All Clauses (${allClauses.length})` },
              { key: "similar", label: `Similar (${allClauses.filter(c => parseFloat(c.similarity) >= 0.7).length})` },
              { key: "starred", label: `Starred (${starredIds.size})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-3 transition-colors text-xs ${
                  activeTab === tab.key
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40"
                    : "text-slate-400 hover:text-slate-600 dark:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Inner search */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clauses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:border-blue-400 bg-slate-50 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* Clause items */}
          <div className="flex-1 overflow-y-auto max-h-[580px] divide-y divide-slate-100">
            {displayClauses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <Search size={28} className="text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm">No clauses match your search.</p>
              </div>
            ) : (
              displayClauses.map((clause) => {
                const isActive = selected?.id === clause.id;
                return (
                  <div
                    key={clause.id}
                    onClick={() => setSelectedId(clause.id)}
                    className={`p-4 cursor-pointer transition-all relative ${
                      isActive ? "bg-blue-50 border-l-4 border-blue-500" : "hover:bg-slate-50 dark:bg-slate-950/80 border-l-4 border-transparent"
                    }`}
                  >
                    {/* Category badge */}
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${clause.category.color}`}>
                      {clause.category.label}
                    </span>

                    <p className={`text-sm font-semibold mt-1.5 leading-snug line-clamp-2 ${isActive ? "text-slate-900 dark:text-slate-50" : "text-slate-700 dark:text-slate-200"}`}>
                      {clause.text}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {clause.file} · Page {clause.page}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Layers size={11} />
                          <span>Grp {clause.groupId}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleStar(clause.id); }}
                          className="text-slate-300 hover:text-amber-400 transition-colors"
                        >
                          {starredIds.has(clause.id)
                            ? <Star size={13} fill="#fbbf24" className="text-amber-400" />
                            : <StarOff size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer count */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <p className="text-xs text-slate-400 text-center">
              Showing {displayClauses.length} of {allClauses.length} clauses
            </p>
          </div>
        </div>

        {/* ── Right: Detail Panel ──────────────────────────────────────────── */}
        {selected ? (
          <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col gap-5 overflow-y-auto max-h-[720px]">

            {/* Detail header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Selected Clause Details</p>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${selected.category.color}`}>
                    {selected.category.label}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${RISK_BADGE[selected.risk]}`}>
                    {selected.risk} RISK
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
                  {selected.text}
                </h2>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => toggleStar(selected.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                    starredIds.has(selected.id)
                      ? "bg-amber-50 border-amber-300 text-amber-600"
                      : "bg-white dark:bg-[#1e293b] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:border-amber-200"
                  }`}
                >
                  <Star size={13} fill={starredIds.has(selected.id) ? "#fbbf24" : "none"} />
                  {starredIds.has(selected.id) ? "Starred" : "Add to Starred"}
                </button>
                <button
                  onClick={() => copyClause(selected.text)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-950 transition-colors"
                >
                  {copied ? <CheckCircle2 size={13} className="text-green-500" /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Source */}
            <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-lg px-4 py-2.5 border border-slate-100 dark:border-slate-800">
              <FileText size={14} className="text-blue-500 shrink-0" />
              <span className="font-semibold text-slate-700 dark:text-slate-200">{selected.file}</span>
              <span className="text-slate-300">·</span>
              <span>Page {selected.page}</span>
              <span className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Layers size={12} /> Similarity Group: {selected.groupId}
              </span>
            </div>

            {/* Similar Clauses */}
            {similarClauses.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                  Similar Clauses ({similarClauses.length})
                </h3>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-xs border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="p-3 text-left">Clause</th>
                        <th className="p-3 text-left">Source</th>
                        <th className="p-3 text-left">Similarity</th>
                        <th className="p-3 text-left">Match Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {similarClauses.map((sc) => (
                        <tr
                          key={sc.id}
                          onClick={() => setSelectedId(sc.id)}
                          className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                        >
                          <td className="p-3 max-w-[200px]">
                            <p className="line-clamp-2 text-slate-700 dark:text-slate-200 font-medium">{sc.text}</p>
                          </td>
                          <td className="p-3 text-slate-500">
                            <p className="font-medium truncate max-w-[100px]">{sc.file}</p>
                            <p className="text-slate-400">Page {sc.page}</p>
                          </td>
                          <td className="p-3">
                            <SimilarityBar score={sc.similarity} />
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold text-[10px]">
                              Semantic Match
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Explainable AI Analysis */}
            <div className="space-y-4">
              {detailedExplanations[selected.id] ? (
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 rounded-xl p-4">
                      <h3 className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold mb-2 text-sm">
                        <BrainCircuit size={16} /> What Was Found?
                      </h3>
                      <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{detailedExplanations[selected.id].what_was_found}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">Contract A</h4>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">"{detailedExplanations[selected.id].contract_a.clause}"</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                        <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-2 text-xs uppercase tracking-wider">Contract B</h4>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">"{detailedExplanations[selected.id].contract_b.clause}"</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4">
                        <h3 className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-2 text-sm">
                          <AlertCircle size={16} /> Why Is This Important?
                        </h3>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{detailedExplanations[selected.id].why_it_matters}</p>
                      </div>
                      <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col justify-center">
                        <h3 className="text-slate-500 dark:text-slate-400 font-bold mb-2 text-xs uppercase tracking-wider">Risk Level</h3>
                        <div className="flex items-center gap-3 mb-1">
                           <span className={`text-xs font-black px-2 py-1 rounded-md uppercase ${RISK_BADGE[detailedExplanations[selected.id].risk_level] || "bg-slate-500 text-white"}`}>
                             {detailedExplanations[selected.id].risk_level} RISK
                           </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">{detailedExplanations[selected.id].risk_reason}</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-xl p-4">
                      <h3 className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-2 text-sm">
                        <Lightbulb size={16} /> What Should Be Reviewed?
                      </h3>
                      <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">{detailedExplanations[selected.id].what_should_be_reviewed}</p>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center italic mt-2">{detailedExplanations[selected.id].disclaimer}</p>
                  </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <BrainCircuit size={36} className="text-purple-400 mb-3" />
                    <h3 className="text-md font-bold text-slate-800 dark:text-slate-100 mb-1">Explainable AI Analysis</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs text-center max-w-sm mb-4">Generate a deep, structured legal analysis of this clause and its contradictions.</p>
                    {aiError && <p className="text-red-500 text-xs mb-3 font-medium">{aiError}</p>}
                    <button 
                      onClick={() => handleGenerateAIExplanation(selected)}
                      disabled={isGeneratingAI}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      {isGeneratingAI ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BrainCircuit size={16} />
                          Generate AI Explanation
                        </>
                      )}
                    </button>
                  </div>
              )}
            </div>

            {/* Category + Keywords */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-600 font-bold mb-2 text-sm">
                  <Tag size={14} />
                  <span>Clause Category</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${selected.category.color}`}>
                  {selected.category.label}
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-600 font-bold mb-2 text-sm">
                  <Hash size={14} />
                  <span>Keywords</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.keywords.map((kw) => (
                    <span key={kw} className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Issue + Similarity */}
            <div className="flex flex-wrap gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-orange-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Issue:</span>
                <span>{selected.issue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitCompare size={13} className="text-blue-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Similarity Score:</span>
                <SimilarityBar score={selected.similarity} />
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-200">Total Occurrences:</span>
                <span>{similarClauses.length + 1}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center py-20 text-center">
            <BookOpen size={40} className="text-slate-300 mb-3" />
            <p className="text-slate-500 font-semibold">Select a clause to view details</p>
            <p className="text-slate-400 text-sm mt-1">Click any clause on the left panel</p>
          </div>
        )}
      </div>
    </div>
  );
}
