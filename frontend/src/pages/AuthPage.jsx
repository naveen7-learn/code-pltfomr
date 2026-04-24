import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Layers3, ShieldCheck, Sparkles, Plus, Code2, Cpu, Globe, Zap, Box, Anchor, Terminal } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { listItemIn, riseIn, staggerContainer } from "../animations/pageTransitions";

// 🆕 EXPANDED TOOLS FOR INFINITE LOOP
const tools = [
  { name: "Vercel", icon: Globe },
  { name: "Gemini", icon: Sparkles },
  { name: "OpenAI", icon: Cpu },
  { name: "VS Code", icon: Code2 },
  { name: "Cursor", icon: Anchor },
  { name: "Clerk", icon: ShieldCheck },
  { name: "Supabase", icon: Box },
  { name: "Render", icon: Zap },
  { name: "Linear", icon: Terminal },
];

export const AuthPage = () => {
  const navigate = useNavigate();
  const { mode } = useParams();
  const isLogin = mode !== "signup";
  const { user, login, signup } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem("codeflow_theme") || "dark");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fullText = "We catch bugs before they become features.";
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, 25);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [displayText]);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isLogin) await login({ email: form.email, password: form.password });
      else await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("codeflow_theme", nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    document.body.classList.toggle("light-mode", nextTheme === "light");
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent-500/30 overflow-x-hidden">
      {/* 🚀 TOP NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl px-6 py-4 md:px-8">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center font-bold text-black shadow-lg">CR</div>
              <span className="font-display text-lg font-bold tracking-tight italic">Code Review Studio</span>
            </div>
            <div className="hidden gap-6 text-sm font-medium text-neutral-500 md:flex">
              {["Product", "Reviews", "Security", "Pricing"].map(item => (
                <button key={item} className="hover:text-white transition-colors">{item}</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            <button onClick={() => navigate("/auth/login")} className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">Log in</button>
            <button onClick={() => navigate("/auth/signup")} className="rounded-full bg-white px-5 py-1.5 text-sm font-bold text-black transition-all hover:bg-neutral-200 active:scale-95">Sign up</button>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <main className="mx-auto grid max-w-[1440px] gap-12 px-6 pt-32 lg:grid-cols-[1fr_440px] lg:items-start lg:pt-48 pb-20">
        <div className="space-y-10">
          <motion.div {...riseIn} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-accent-300">
            <Sparkles size={14} /> Premium collaboration for engineering teams
          </motion.div>
          <div className="min-h-[160px]">
            <h1 className="font-display text-6xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              {displayText}
              <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className={`inline-block ml-2 h-14 w-1.5 bg-accent-400 align-middle ${isComplete ? 'hidden' : ''}`} />
            </h1>
          </div>
          <p className="max-w-xl text-xl leading-relaxed text-neutral-500">
            Bring structure to reviews, momentum to collaboration, and premium clarity to every decision.
          </p>
        </div>

        {/* AUTH CARD */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-[2.5rem] border border-white/10 bg-neutral-900/40 p-8 shadow-2xl backdrop-blur-3xl md:p-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />
          <h2 className="text-3xl font-bold mb-8 tracking-tight">{isLogin ? "Sign in" : "Create account"}</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <input required placeholder="Full Name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 focus:border-accent-500 focus:outline-none transition-colors" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            )}
            <input required type="email" placeholder="Work Email" className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 focus:border-accent-500 focus:outline-none transition-colors" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input required type="password" placeholder="Password" className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 focus:border-accent-500 focus:outline-none transition-colors" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <button disabled={submitting} className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-600 py-4 font-bold text-white transition-all hover:bg-accent-500 active:scale-95 disabled:opacity-50">
              {submitting ? "Processing..." : isLogin ? "Sign in" : "Get Started"}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>
        </motion.div>
      </main>

      {/* 🚀 DYNAMIC LOGO MARQUEE (Moving Left to Right) */}
      <section className="border-y border-white/5 py-12 bg-black overflow-hidden">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-600 mb-8">Integrated with your favorite stack</p>
        
        <div className="relative flex w-full">
          <motion.div 
            className="flex flex-none gap-20 items-center px-10"
            animate={{ x: ["-100%", "0%"] }} // Left to Right
            transition={{ 
              ease: "linear", 
              duration: 35, // Adjust speed here
              repeat: Infinity 
            }}
          >
            {/* Double the array to create the infinite loop effect */}
            {[...tools, ...tools].map((tool, idx) => (
              <div key={idx} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 cursor-default shrink-0">
                <tool.icon size={22} className="text-neutral-300" />
                <span className="text-lg font-display font-black tracking-tight uppercase">{tool.name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🚀 PLATFORM PREVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-32 space-y-32">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div whileHover={{ y: -10 }} className="rounded-3xl border border-white/10 bg-neutral-900/50 p-2 shadow-2xl overflow-hidden group relative">
             <div className="bg-black rounded-2xl p-6 h-64 flex flex-col justify-between">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                </div>
                <div className="space-y-3">
                   <div className="h-2 w-2/3 bg-white/10 rounded-full" />
                   <div className="h-2 w-full bg-white/5 rounded-full" />
                   <div className="h-2 w-1/3 bg-white/5 rounded-full" />
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                   <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded-lg bg-accent-500/20" />
                      <div className="h-2 w-24 bg-white/10 rounded-full" />
                   </div>
                   <div className="h-6 w-12 bg-emerald-500/20 rounded-full" />
                </div>
             </div>
          </motion.div>
          <div>
            <h2 className="text-4xl font-bold tracking-tight italic">AI-Native Command Center</h2>
            <p className="mt-6 text-lg text-neutral-500 leading-relaxed">
              Track project health, PR velocity, and team momentum in a single, high-performance dashboard.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-bold tracking-tight italic">Multiplayer Studio</h2>
            <p className="mt-6 text-lg text-neutral-500 leading-relaxed">
              Real-time collaboration that feels like pair programming. Instant feedback with zero decision drag.
            </p>
          </div>
          <div className="order-1 lg:order-2 rounded-3xl border border-white/10 bg-neutral-900/80 p-8 font-mono text-sm shadow-2xl relative overflow-hidden group">
             <div className="text-emerald-400 mb-1">+ const studio = await initWorkspace();</div>
             <div className="text-emerald-400 mb-1">+ studio.on('review', (bug) =&gt; catchBug(bug));</div>
             <div className="text-neutral-500 my-4 tracking-tighter">// Catching bugs before they become features...</div>
             <div className="text-blue-400">workspace.sync(&#123; mode: 'REALTIME' &#125;);</div>
             
             <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute bottom-6 right-8 bg-accent-600 px-3 py-1 rounded-full text-[10px] font-bold">You are active</motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-16 text-center text-neutral-600 text-[10px] font-bold uppercase tracking-[0.5em]">
        © 2026 Code Review Studio • Intentional Engineering
      </footer>
    </div>
  );
};