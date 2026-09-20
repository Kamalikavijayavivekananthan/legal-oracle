import { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, FileText, ShieldAlert } from "lucide-react";
import { useUser } from "../context/UserContext";

/**
 * Shared top-right profile header used across all pages.
 * Automatically shows the logged-in user's name and avatar initial.
 */
export default function UserHeader() {
  const { user } = useUser();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  const displayName = user?.fullName || user?.name || "User";
  const role        = user?.role || "Legal Team Member";
  const initial     = displayName ? displayName.charAt(0).toUpperCase() : "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* Notification Bell */}
      <div className="relative" ref={notifRef}>
        <button 
          onClick={() => setShowNotifs(!showNotifs)}
          className="relative p-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-colors bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800" />
        </button>

        {/* Dropdown Menu */}
        {showNotifs && (
          <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden transform origin-top-right transition-all">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Notifications</h3>
              <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">Mark all read</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Welcome to Legal Oracle!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your intelligent dashboard is ready.</p>
                  <p className="text-[10px] text-slate-400 mt-1">Just now</p>
                </div>
              </div>
              <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center shrink-0">
                  <ShieldAlert size={14} className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">System Update</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">AI models have been updated for better contradiction detection.</p>
                  <p className="text-[10px] text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-center border-t border-slate-100 dark:border-slate-700">
              <button className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">View all notifications</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0 select-none shadow-sm">
          {initial}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{displayName}</p>
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">{role}</p>
        </div>
        <ChevronDown size={14} className="text-slate-400 ml-1 hidden sm:block" />
      </div>
    </div>
  );
}
