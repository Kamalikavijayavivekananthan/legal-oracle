import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, FileUp, ListChecks, FileText, 
  Settings, ShieldAlert, LogOut, Search, Bookmark,
  Bot, Scale
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Sidebar({ onLogout }) {
  const { t } = useLanguage();

  const menuItems = [
    { name: t("Dashboard"), path: "/", icon: <LayoutDashboard size={20} /> },
    { name: t("Upload Contracts"), path: "/upload", icon: <FileUp size={20} /> },
    { name: t("Analysis Results"), path: "/results", icon: <ListChecks size={20} /> },
    { name: t("Reports"), path: "/reports", icon: <FileText size={20} /> },
    { name: t("Saved Reports"), path: "/saved", icon: <Bookmark size={20} /> },
    { name: t("Risk Overview"), path: "/risk", icon: <ShieldAlert size={20} /> },
    { name: t("Clause Explorer"), path: "/explorer", icon: <Search size={20} /> },
    { name: t("Settings"), path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#111827] text-white min-h-screen flex flex-col font-sans">
      <div className="p-6 flex items-center gap-3">
        <div className="p-1.5 border-[1.5px] border-white rounded-full flex items-center justify-center shrink-0">
          <Scale size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-wider uppercase leading-tight">Legal Oracle</h1>
          <p className="text-[10px] text-slate-400">AI Contract Analyzer</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 mt-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg mb-1 transition-colors text-sm ${
                isActive ? "bg-blue-600 text-white font-semibold" : "text-slate-400 hover:bg-slate-800 hover:text-white font-medium"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
        
        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-1 transition-colors text-sm text-slate-400 hover:bg-slate-800 hover:text-red-400 font-medium"
        >
          <LogOut size={20} />
          <span>{t("Logout")}</span>
        </button>
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#1f2937] p-5 rounded-xl border border-slate-700/50">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-3">
            <Bot size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-white mb-2 text-sm">{t("AI Legal Assistant")}</h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {t("Ask questions about your contracts and get AI insights.")}
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-bold transition-colors">
            {t("Go to Assistant")}
          </button>
        </div>
      </div>
    </div>
  );
}
