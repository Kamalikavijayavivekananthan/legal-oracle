import { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [showForm, setShowForm]   = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();



  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Save user info to context + localStorage
      login({
        name:  username,
        email: email,
        role:  "Legal Team",
      });
      onLogin();
      navigate("/");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Dynamic Animated Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/30 blur-[150px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />

      {/* Main Container */}
      <div className={`relative z-10 w-full max-w-5xl flex rounded-[2rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] shadow-blue-900/20 bg-[#0B1120]/70 backdrop-blur-2xl border border-white/10 transition-all duration-1000 transform ${showForm ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        
        {/* Left Side: Branding & Features */}
        <div className="hidden lg:flex w-[55%] p-14 flex-col justify-between bg-gradient-to-br from-blue-950/50 via-slate-900/50 to-slate-950/80 border-r border-white/5 relative overflow-hidden group">
          {/* Subtle overlay hover effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/0 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-16 h-16 rounded-2xl bg-white/5 p-2 border border-white/10 shadow-xl backdrop-blur-md flex items-center justify-center">
                <img src="/logo.png" alt="Legal Oracle Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 drop-shadow-sm">
                LEGAL ORACLE
              </h1>
            </div>
            
            <h2 className="text-5xl font-bold text-white leading-[1.15] mb-6 drop-shadow-md">
              Elevate Your <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Legal Review.</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md font-light mb-8">
              Experience the next generation of contract analysis. Uncover hidden risks, detect contradictions, and accelerate due diligence with unparalleled AI precision.
            </p>
          </div>
          
          <div className="space-y-5 relative z-10">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default shadow-sm">
              <div className="p-2 bg-green-500/20 rounded-full border border-green-500/30">
                <CheckCircle2 className="text-green-400" size={24} />
              </div>
              <span className="text-slate-200 font-medium tracking-wide">Automated Contradiction Detection</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default shadow-sm">
              <div className="p-2 bg-green-500/20 rounded-full border border-green-500/30">
                <CheckCircle2 className="text-green-400" size={24} />
              </div>
              <span className="text-slate-200 font-medium tracking-wide">Context-Aware AI Intelligence</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-[45%] p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
              <p className="text-slate-400">Secure access to your intelligent dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300 ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400 text-slate-500">
                    <User size={20} />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0B1120]/50 border border-slate-700/80 rounded-xl py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600 shadow-inner"
                    placeholder="Name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400 text-slate-500">
                    <Mail size={20} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0B1120]/50 border border-slate-700/80 rounded-xl py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600 shadow-inner"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-sm font-semibold text-slate-300">Password</label>
                  <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-400 text-slate-500">
                    <Lock size={20} />
                  </div>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0B1120]/50 border border-slate-700/80 rounded-xl py-3.5 pl-12 pr-4 text-slate-100 placeholder-slate-500/80 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600 shadow-inner"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-slate-950 cursor-pointer" />
                <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-slate-400 cursor-pointer select-none">
                  Keep me signed in
                </label>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  <AlertCircle size={16} className="shrink-0" />
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-lg">Sign In</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Demo hint */}
              <p className="text-center text-xs text-slate-500 mt-1">
                Use any username, email, and password (min 6 chars) to sign in
              </p>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500">
                New to Legal Oracle? <a href="#" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">Request Access</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
