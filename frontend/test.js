var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/pages/Reports.jsx
var Reports_exports = {};
__export(Reports_exports, {
  default: () => Reports
});
module.exports = __toCommonJS(Reports_exports);
var import_react = __toESM(require("react"), 1);
var import_lucide_react = require("lucide-react");
function Reports() {
  const summaryCards = [
    {
      title: "Total Reports",
      value: "12",
      subtitle: "All time generated reports",
      icon: /* @__PURE__ */ import_react.default.createElement(import_lucide_react.FileText, { size: 24, className: "text-blue-600" }),
      bg: "bg-blue-50"
    },
    {
      title: "Reports Downloaded",
      value: "8",
      subtitle: "Total downloaded reports",
      icon: /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Download, { size: 24, className: "text-emerald-600" }),
      bg: "bg-emerald-50"
    },
    {
      title: "This Month",
      value: "5",
      subtitle: "Reports generated this month",
      icon: /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Calendar, { size: 24, className: "text-orange-500" }),
      bg: "bg-orange-50"
    },
    {
      title: "Storage Used",
      value: "24.6 MB",
      subtitle: "Total report storage",
      icon: /* @__PURE__ */ import_react.default.createElement(import_lucide_react.HardDrive, { size: 24, className: "text-purple-600" }),
      bg: "bg-purple-50"
    }
  ];
  const reportsList = [
    {
      id: 1,
      name: "Legal_Oracle_Report_May25.pdf",
      files: "Vendor_Agreement_A.pdf, Vendor_Agreement_B.pdf",
      contracts: 2,
      contradictions: 5,
      risk: { high: 2, medium: 2, low: 1 },
      date: "25 May 2024",
      time: "10:31 AM"
    },
    {
      id: 2,
      name: "Contract_Analysis_May20.pdf",
      files: "NDA_2024.pdf, Service_Agreement.pdf",
      contracts: 2,
      contradictions: 3,
      risk: { high: 1, medium: 1, low: 1 },
      date: "20 May 2024",
      time: "04:15 PM"
    },
    {
      id: 3,
      name: "Agreement_Review_May15.pdf",
      files: "Partnership_Agreement.pdf, Vendor_Terms.pdf",
      contracts: 2,
      contradictions: 4,
      risk: { high: 1, medium: 2, low: 1 },
      date: "15 May 2024",
      time: "11:20 AM"
    },
    {
      id: 4,
      name: "Liability_Comparison_May10.pdf",
      files: "Liability_Clause_A.pdf, Liability_Clause_B.pdf",
      contracts: 2,
      contradictions: 2,
      risk: { high: 2, medium: 0, low: 0 },
      date: "10 May 2024",
      time: "09:45 AM"
    },
    {
      id: 5,
      name: "Penalty_Terms_Report_May05.pdf",
      files: "Penalty_Clause_A.pdf, Penalty_Clause_B.pdf",
      contracts: 2,
      contradictions: 3,
      risk: { high: 0, medium: 2, low: 1 },
      date: "05 May 2024",
      time: "02:30 PM"
    },
    {
      id: 6,
      name: "Termination_Clauses_May01.pdf",
      files: "Termination_A.pdf, Termination_B.pdf",
      contracts: 2,
      contradictions: 2,
      risk: { high: 1, medium: 0, low: 1 },
      date: "01 May 2024",
      time: "03:10 PM"
    }
  ];
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "p-8 max-w-7xl mx-auto font-sans" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex justify-end mb-8" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "relative p-2 text-slate-400 hover:text-slate-600 transition-colors" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Bell, { size: 20 }), /* @__PURE__ */ import_react.default.createElement("span", { className: "absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" })), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react.default.createElement(
    "img",
    {
      src: "https://i.pravatar.cc/150?img=47",
      alt: "User Avatar",
      className: "w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
    }
  ), /* @__PURE__ */ import_react.default.createElement("div", { className: "text-left" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm font-bold text-slate-800 leading-tight" }, "Kamalika V"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-slate-500" }, "Legal Team"))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("h1", { className: "text-2xl font-bold text-slate-900" }, "Reports"), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-slate-500 text-sm mt-1" }, "View, download and manage all your generated reports.")), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "relative" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" }), /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "text",
      placeholder: "Search reports...",
      className: "pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 shadow-sm"
    }
  )), /* @__PURE__ */ import_react.default.createElement("button", { className: "flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Filter, { size: 16 }), "Filters"), /* @__PURE__ */ import_react.default.createElement("button", { className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Plus, { size: 16 }), "Generate New Report"))), /* @__PURE__ */ import_react.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" }, summaryCards.map((card, idx) => /* @__PURE__ */ import_react.default.createElement("div", { key: idx, className: "bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4" }, /* @__PURE__ */ import_react.default.createElement("div", { className: `w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center shrink-0` }, card.icon), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs font-medium text-slate-500" }, card.title), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-2xl font-bold text-slate-900 mt-0.5" }, card.value), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-[11px] text-slate-400 mt-0.5" }, card.subtitle))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "p-5 border-b border-slate-100" }, /* @__PURE__ */ import_react.default.createElement("h2", { className: "text-lg font-bold text-slate-900" }, "All Reports")), /* @__PURE__ */ import_react.default.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ import_react.default.createElement("table", { className: "w-full text-left border-collapse min-w-[900px]" }, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", { className: "bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider" }, /* @__PURE__ */ import_react.default.createElement("th", { className: "p-5 w-2/5" }, "Report Name"), /* @__PURE__ */ import_react.default.createElement("th", { className: "p-5 text-center" }, "Contracts Analyzed"), /* @__PURE__ */ import_react.default.createElement("th", { className: "p-5 text-center" }, "Contradictions Found"), /* @__PURE__ */ import_react.default.createElement("th", { className: "p-5" }, "Risk Summary"), /* @__PURE__ */ import_react.default.createElement("th", { className: "p-5" }, "Generated On"), /* @__PURE__ */ import_react.default.createElement("th", { className: "p-5 text-center" }, "Actions"))), /* @__PURE__ */ import_react.default.createElement("tbody", { className: "divide-y divide-slate-100 text-sm" }, reportsList.map((report) => /* @__PURE__ */ import_react.default.createElement("tr", { key: report.id, className: "hover:bg-slate-50/50 transition-colors group" }, /* @__PURE__ */ import_react.default.createElement("td", { className: "p-5" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-start gap-3" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "mt-0.5 text-slate-400" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.FileText, { size: 18 })), /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-semibold text-slate-900" }, report.name), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-slate-500 mt-0.5" }, report.files)))), /* @__PURE__ */ import_react.default.createElement("td", { className: "p-5 text-center font-medium text-slate-700" }, report.contracts), /* @__PURE__ */ import_react.default.createElement("td", { className: "p-5 text-center font-medium text-slate-700" }, report.contradictions), /* @__PURE__ */ import_react.default.createElement("td", { className: "p-5" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center gap-1.5 text-xs font-medium" }, /* @__PURE__ */ import_react.default.createElement("span", { className: `${report.risk.high > 0 ? "text-red-600" : "text-slate-400"}` }, report.risk.high, " High"), /* @__PURE__ */ import_react.default.createElement("span", { className: "text-slate-300" }, ","), /* @__PURE__ */ import_react.default.createElement("span", { className: `${report.risk.medium > 0 ? "text-orange-500" : "text-slate-400"}` }, report.risk.medium, " Medium"), /* @__PURE__ */ import_react.default.createElement("span", { className: "text-slate-300" }, ","), /* @__PURE__ */ import_react.default.createElement("span", { className: `${report.risk.low > 0 ? "text-emerald-500" : "text-slate-400"}` }, report.risk.low, " Low"))), /* @__PURE__ */ import_react.default.createElement("td", { className: "p-5" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "font-medium text-slate-800 text-xs" }, report.date), /* @__PURE__ */ import_react.default.createElement("p", { className: "text-xs text-slate-500 mt-0.5" }, report.time)), /* @__PURE__ */ import_react.default.createElement("td", { className: "p-5" }, /* @__PURE__ */ import_react.default.createElement("div", { className: "flex items-center justify-center gap-2" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white shadow-sm", title: "View" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Eye, { size: 15 })), /* @__PURE__ */ import_react.default.createElement("button", { className: "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-colors bg-white shadow-sm", title: "Download" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.FileDown, { size: 15 })), /* @__PURE__ */ import_react.default.createElement("button", { className: "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors bg-white shadow-sm", title: "Delete" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.Trash2, { size: 15 }))))))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "p-5 border-t border-slate-100 flex items-center justify-between" }, /* @__PURE__ */ import_react.default.createElement("p", { className: "text-sm text-slate-500" }, "Showing 1 to 6 of 12 reports"), /* @__PURE__ */ import_react.default.createElement("div", { className: "flex gap-1.5" }, /* @__PURE__ */ import_react.default.createElement("button", { className: "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ChevronLeft, { size: 16 })), /* @__PURE__ */ import_react.default.createElement("button", { className: "w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-medium shadow-sm shadow-blue-200" }, "1"), /* @__PURE__ */ import_react.default.createElement("button", { className: "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-colors bg-white" }, "2"), /* @__PURE__ */ import_react.default.createElement("button", { className: "w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white" }, /* @__PURE__ */ import_react.default.createElement(import_lucide_react.ChevronRight, { size: 16 }))))));
}
