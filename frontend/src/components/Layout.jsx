import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout({ onLogout }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
