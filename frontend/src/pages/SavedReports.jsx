import React, { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Download,
  Calendar,
  HardDrive,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Bookmark,
  BookmarkCheck,
  BookmarkX,
  Star,
} from "lucide-react";
import UserHeader from "../components/UserHeader";

const ITEMS_PER_PAGE = 6;

export default function SavedReports() {
  const [pinned, setPinned] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Load pinned reports from localStorage
  useEffect(() => {
    const load = () => {
      const stored = JSON.parse(localStorage.getItem("pinnedReports") || "[]");
      setPinned(stored);
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  // Remove from saved
  const handleUnpin = (id) => {
    const updated = pinned.filter((r) => r.id !== id);
    setPinned(updated);
    localStorage.setItem("pinnedReports", JSON.stringify(updated));
  };

  // Filtered list
  const filtered = pinned.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.files.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  // Stats
  const totalDownloads = pinned.length;
  const totalSizeMB = (pinned.length * 3.8).toFixed(1);
  const thisMonth = pinned.filter((r) => {
    try {
      const [day, mon, year] = r.date.split(" ");
      const d = new Date(`${mon} ${day} ${year}`);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } catch { return false; }
  }).length;

  const summaryCards = [
    {
      title: "Total Saved Reports",
      value: pinned.length,
      subtitle: "All time saved reports",
      icon: <FileText size={24} className="text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Total Downloads",
      value: totalDownloads,
      subtitle: "Downloads from saved reports",
      icon: <Download size={24} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Total Size",
      value: `${totalSizeMB} MB`,
      subtitle: "Total storage used",
      icon: <HardDrive size={24} className="text-orange-500" />,
      bg: "bg-orange-50",
    },
    {
      title: "Last 30 Days",
      value: thisMonth,
      subtitle: "Reports saved this month",
      icon: <Calendar size={24} className="text-purple-600" />,
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">

      {/* Top Header */}
      <div className="flex justify-end mb-8">
        <UserHeader />
      </div>

      {/* Page Title & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Saved Reports</h1>
          <p className="text-slate-500 text-sm mt-1">
            View, manage and download your previously saved analysis reports.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search saved reports..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1e293b] p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">{card.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Reports Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <BookmarkCheck size={20} className="text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">All Reports ({pinned.length})</h2>
        </div>

        {pinned.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
              <Bookmark size={32} className="text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">No Saved Reports Yet</h3>
            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
              Go to <strong>Reports</strong> page and click the{" "}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded text-amber-500 text-xs font-medium">
                <Bookmark size={11} /> Save
              </span>{" "}
              icon on any report to add it here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search size={32} className="text-slate-300 mb-3" />
            <p className="text-slate-500 text-sm">No saved reports match your search.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="p-5 w-2/5">Report Name</th>
                    <th className="p-5 text-center">Contracts Analyzed</th>
                    <th className="p-5 text-center">Contradictions Found</th>
                    <th className="p-5">Risk Summary</th>
                    <th className="p-5">Saved On</th>
                    <th className="p-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginated.map((report) => (
                    <tr key={report.id} className="hover:bg-amber-50/30 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 text-amber-400">
                            <Star size={16} fill="currentColor" />
                          </div>
                          <div className="mt-0.5 text-slate-400">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-50">{report.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-xs">{report.files}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 text-center font-medium text-slate-700 dark:text-slate-200">{report.contracts}</td>
                      <td className="p-5 text-center font-medium text-slate-700 dark:text-slate-200">{report.contradictions}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          <span className={`${report.risk?.high > 0 ? "text-red-600" : "text-slate-400"}`}>
                            {report.risk?.high ?? 0} High
                          </span>
                          <span className="text-slate-300">,</span>
                          <span className={`${report.risk?.medium > 0 ? "text-orange-500" : "text-slate-400"}`}>
                            {report.risk?.medium ?? 0} Medium
                          </span>
                          <span className="text-slate-300">,</span>
                          <span className={`${report.risk?.low > 0 ? "text-emerald-500" : "text-slate-400"}`}>
                            {report.risk?.low ?? 0} Low
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <p className="font-medium text-slate-800 dark:text-slate-100 text-xs">{report.date}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{report.time}</p>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white dark:bg-[#1e293b] shadow-sm"
                            title="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white dark:bg-[#1e293b] shadow-sm"
                            title="Download"
                          >
                            <FileDown size={15} />
                          </button>
                          <button
                            onClick={() => handleUnpin(report.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors bg-white dark:bg-[#1e293b] shadow-sm"
                            title="Remove from Saved"
                          >
                            <BookmarkX size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} reports
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:bg-slate-950 transition-colors bg-white dark:bg-[#1e293b] disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium text-sm transition-colors ${
                      page === safeCurrentPage
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                        : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-950 bg-white dark:bg-[#1e293b]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:bg-slate-950 transition-colors bg-white dark:bg-[#1e293b] disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
