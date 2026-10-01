import { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, User, Eye, EyeOff, Building2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [company, setCompany]   = useState("");
  const [experience, setExperience] = useState("");
  const [email, setEmail]       = useState("kamalikavijay2803@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState("");
  const [showForm, setShowForm]   = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  useEffect(() => {
    setShowForm(true);
  }, []);

  const handleToggleMode = (mode) => {
    setIsRegister(mode);
    setError("");
    if (mode) {
      // Switching to register -> clear prefilled demo values
      if (password === "••••••••••••") setPassword("");
      setConfirmPassword("");
    } else {
      // Switching to login
      if (!password) setPassword("••••••••••••");
      if (!email) setEmail("kamalikavijay2803@gmail.com");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError(isRegister ? "Please enter your full name." : "Please enter your username.");
      return;
    }

    if (isRegister) {
      if (!company.trim()) {
        setError("Please enter your company name.");
        return;
      }
      if (!experience.trim()) {
        setError("Please select your experience level.");
        return;
      }
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match. Please verify your confirm password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login({
        name: username,
        fullName: username,
        email: email,
        company: isRegister ? company : "",
        experience: isRegister ? experience : "",
        role: "Legal Team Member",
      });
      onLogin();
      navigate("/");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center relative overflow-hidden font-sans p-4 sm:p-6 select-none">
      {/* Dynamic Animated Ambient Glow Elements */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full bg-blue-600/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[140px] pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[35%] h-[35%] rounded-full bg-blue-900/15 blur-[120px] pointer-events-none" />

      {/* Main Card Container */}
      <div 
        className={`relative z-10 w-full max-w-5xl flex flex-col lg:flex-row rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-950/40 bg-[#0B1220]/80 backdrop-blur-2xl border border-slate-800/80 transition-all duration-700 transform ${
          showForm ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        
        {/* Left Side: Branding & Highlights */}
        <div className="hidden lg:flex w-[48%] p-12 flex-col justify-between bg-gradient-to-b from-[#0e172a]/90 via-[#0B1220]/90 to-[#070d1a]/95 border-r border-slate-800/60 relative">
          <div>
            {/* Logo + Brand Name */}
            <div className="flex items-center gap-3.5 mb-12">
              <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-slate-700/60 shadow-lg flex items-center justify-center p-1.5">
                <img 
                  src="/logo.png" 
                  alt="Legal Oracle Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" 
                />
              </div>
              <h1 className="text-xl font-extrabold tracking-wider text-blue-400">
                LEGAL ORACLE
              </h1>
            </div>
            
            {/* Title & Description */}
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-5 tracking-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Legal Review.
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8 font-normal">
              Experience the next generation of contract analysis. Uncover hidden risks, detect contradictions, and accelerate due diligence with unparalleled AI precision.
            </p>
          </div>
          
          {/* Feature Badges */}
          <div className="space-y-3.5 pt-4">
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111c33]/70 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="p-1.5 bg-emerald-500/15 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="text-emerald-400" size={18} />
              </div>
              <span className="text-slate-200 text-sm font-medium">Automated Contradiction Detection</span>
            </div>
            <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-[#111c33]/70 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="p-1.5 bg-emerald-500/15 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="text-emerald-400" size={18} />
              </div>
              <span className="text-slate-200 text-sm font-medium">Context-Aware AI Intelligence</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form (Login / Register) */}
        <div className="w-full lg:w-[52%] p-8 sm:p-12 flex flex-col justify-center bg-[#0B1220]/90">
          <div className="w-full max-w-md mx-auto">
            
            {/* Header Text */}
            <div className="text-center mb-7">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                {isRegister ? "Create an Account" : "Welcome Back"}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">
                {isRegister ? "Start analyzing your contracts with AI." : "Secure access to your intelligent dashboard."}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username / Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 ml-0.5">
                  {isRegister ? "Full Name" : "Username"}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <User size={17} />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#080e1a]/90 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-slate-700 shadow-inner"
                    placeholder="Name"
                  />
                </div>
              </div>

              {/* Company & Experience (Shown only in Register mode) */}
              {isRegister && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 ml-0.5">Company Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Building2 size={17} />
                      </div>
                      <input 
                        type="text" 
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-[#080e1a]/90 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-slate-700 shadow-inner"
                        placeholder="e.g. Legal Corp / Law Firm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-300 ml-0.5">Years of Experience</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Briefcase size={17} />
                      </div>
                      <select 
                        required
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-[#080e1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-8 text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-slate-700 shadow-inner appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-slate-900 text-slate-500">Select your experience</option>
                        <option value="0-1 year (Entry Level)" className="bg-slate-900 text-slate-100">0 - 1 Year (Entry Level / Trainee)</option>
                        <option value="1-3 years (Junior)" className="bg-slate-900 text-slate-100">1 - 3 Years (Junior Associate)</option>
                        <option value="3-5 years (Mid-Level)" className="bg-slate-900 text-slate-100">3 - 5 Years (Mid-Level Counsel)</option>
                        <option value="5-10 years (Senior)" className="bg-slate-900 text-slate-100">5 - 10 Years (Senior Legal Counsel)</option>
                        <option value="10+ years (Lead / Partner)" className="bg-slate-900 text-slate-100">10+ Years (Lead / Partner / Director)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 ml-0.5">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Mail size={17} />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#080e1a]/90 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-slate-700 shadow-inner"
                    placeholder="kamalikavijay2803@gmail.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-0.5">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  {!isRegister && (
                    <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative group flex items-center">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                    <Lock size={17} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#080e1a]/90 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all hover:border-slate-700 shadow-inner"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Shown only in Register mode) */}
              {isRegister && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 ml-0.5">Confirm Password</label>
                  <div className="relative group flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <Lock size={17} />
                    </div>
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full bg-[#080e1a]/90 border rounded-xl py-2.5 pl-10 pr-10 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 transition-all shadow-inner ${
                        confirmPassword && confirmPassword !== password
                          ? "border-red-500/70 focus:border-red-500 focus:ring-red-500/50"
                          : confirmPassword && confirmPassword === password
                          ? "border-emerald-500/70 focus:border-emerald-500 focus:ring-emerald-500/50"
                          : "border-slate-800 focus:border-blue-500 focus:ring-blue-500 hover:border-slate-700"
                      }`}
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none cursor-pointer"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-xs text-red-400 ml-1">Passwords do not match</p>
                  )}
                </div>
              )}

              {/* Keep me signed in (Login mode) */}
              {!isRegister && (
                <div className="flex items-center pt-1">
                  <input 
                    id="remember-me" 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500/50 focus:ring-offset-slate-950 cursor-pointer" 
                  />
                  <label htmlFor="remember-me" className="ml-2.5 block text-xs text-slate-400 cursor-pointer select-none">
                    Keep me signed in
                  </label>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-2.5 text-red-400 text-xs">
                  <AlertCircle size={15} className="shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none mt-4 cursor-pointer text-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isRegister ? "Register" : "Sign In"}</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* Demo Hint */}
              <p className="text-center text-[11px] text-slate-500 pt-1">
                {isRegister
                  ? "Fill in your details to create your legal oracle account"
                  : "Use any username, email, and password (min 6 chars) to sign in"}
              </p>
            </form>

            {/* Switch Mode Toggle */}
            <div className="mt-5 text-center">
              <p className="text-xs text-slate-400">
                {isRegister ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleToggleMode(false)}
                      className="font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer ml-1"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleToggleMode(true)}
                      className="font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer ml-1"
                    >
                      Register
                    </button>
                  </>
                )}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
