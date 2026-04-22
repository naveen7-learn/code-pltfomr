import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { listItemIn, riseIn, staggerContainer } from "../animations/pageTransitions";

const navItems = ["Product", "Reviews", "Security", "Pricing"];

const authHighlights = [
  {
    title: "Faster review loops",
    body: "Keep pull requests focused, assign ownership clearly, and reduce decision drag across teams.",
    icon: Layers3
  },
  {
    title: "Built for trusted collaboration",
    body: "Comments, approvals, and file context stay structured so teams can move with confidence.",
    icon: ShieldCheck
  }
];

const authMetrics = [
  { label: "Merged this week", value: "128" },
  { label: "Review turnaround", value: "2.4h" },
  { label: "Teams onboarded", value: "42" }
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

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Authentication failed");
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
    <div className="min-h-screen px-3 py-3 md:px-4">
      <div className="premium-shell relative min-h-[calc(100vh-1.5rem)] overflow-hidden rounded-[32px] border border-white/6 bg-neutral-950/72 shadow-panel backdrop-blur-xl light-mode:border-slate-300/60 light-mode:bg-white/65">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(92,124,255,0.18),transparent_30%)] light-mode:bg-[radial-gradient(circle_at_top,rgba(92,124,255,0.10),transparent_34%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="floating-orb absolute left-[36%] top-[14%] h-3 w-3 rounded-full bg-accent-400/80 shadow-[0_0_24px_rgba(92,124,255,0.45)]"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.8, delay: 0.16 }}
          className="absolute left-[4%] top-[32%] hidden h-px w-28 bg-gradient-to-r from-transparent via-white/14 to-transparent lg:block"
        />

        <header className="relative z-10 border-b border-white/6 light-mode:border-slate-300/60">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-8">
            <motion.div {...riseIn} className="flex items-center gap-8">
              <button onClick={() => navigate("/auth/login")} className="flex items-center gap-3 text-left">
                <div className="floating-orb flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 via-accent-500 to-cyan-400 shadow-[0_12px_32px_rgba(92,124,255,0.35)]">
                  <span className="font-display text-sm font-bold text-white">CR</span>
                </div>
                <div>
                  <p className="surface-label">Code review platform</p>
                  <p className="text-sm font-semibold text-neutral-100 light-mode:text-slate-900">Code Review Studio</p>
                </div>
              </button>

              <nav className="hidden items-center gap-6 md:flex">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.26, delay: 0.06 * index + 0.08 }}
                    className="text-sm text-neutral-400 hover:text-neutral-100 light-mode:text-slate-500 light-mode:hover:text-slate-900"
                  >
                    {item}
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            <motion.div {...riseIn} transition={{ ...riseIn.transition, delay: 0.1 }} className="flex items-center gap-2">
              <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
              <button
                onClick={() => navigate(isLogin ? "/auth/signup" : "/auth/login")}
                className="ghost-button hidden rounded-full px-4 md:inline-flex"
              >
                {isLogin ? "Create account" : "Sign in"}
              </button>
            </motion.div>
          </div>
        </header>

        <main className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-[1440px] gap-10 px-5 py-8 md:px-8 lg:grid-cols-[1.1fr_480px] lg:items-center">
          <motion.section variants={staggerContainer} initial="initial" animate="animate" className="space-y-10">
            <motion.div {...riseIn}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.34, delay: 0.06 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-neutral-300 light-mode:border-slate-300/70 light-mode:bg-white/70 light-mode:text-slate-600"
              >
                <Sparkles size={14} className="text-accent-300 light-mode:text-accent-500" />
                Premium collaboration for modern engineering teams
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.48, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl pt-2 font-display text-5xl font-semibold tracking-[-0.04em] text-neutral-100 light-mode:text-slate-950 md:text-6xl"
              >
                Code review that feels as intentional as the product you are shipping.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.18 }}
                className="max-w-2xl pt-6 text-lg leading-8 text-neutral-400 light-mode:text-slate-600"
              >
                Bring structure to reviews, momentum to collaboration, and premium clarity to every decision across your engineering workflow.
              </motion.p>
            </motion.div>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 md:grid-cols-2">
              {authHighlights.map(({ title, body, icon: Icon }, index) => (
                <motion.div
                  key={title}
                  {...listItemIn}
                  transition={{ ...listItemIn.transition, delay: 0.08 * index + 0.1 }}
                  whileHover={{ y: -3, scale: 1.008 }}
                  className="card p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/[0.05] light-mode:bg-accent-50 floating-orb">
                    <Icon size={18} className="text-accent-300 light-mode:text-accent-600" />
                  </div>
                  <h2 className="pt-5 text-lg font-semibold text-neutral-100 light-mode:text-slate-900">{title}</h2>
                  <p className="pt-2 text-sm leading-6 text-neutral-400 light-mode:text-slate-600">{body}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4 rounded-[28px] border border-white/8 bg-white/[0.03] p-5 light-mode:border-slate-300/70 light-mode:bg-white/72 md:grid-cols-3">
              {authMetrics.map((metric, index) => (
                <motion.div key={metric.label} {...listItemIn} transition={{ ...listItemIn.transition, delay: 0.05 * index + 0.14 }}>
                  <p className="surface-label">{metric.label}</p>
                  <p className="pt-3 font-display text-3xl font-semibold text-neutral-100 light-mode:text-slate-900">{metric.value}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 24, y: 8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.52, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2 }}
            className="card relative overflow-hidden p-6 md:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-300/40 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">{isLogin ? "Welcome back" : "Start collaborating"}</p>
                <h2 className="pt-2 font-display text-3xl font-semibold text-neutral-100 light-mode:text-slate-950">
                  {isLogin ? "Sign in to your workspace" : "Create your account"}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="pt-8">
              <div className="space-y-4">
                {!isLogin && (
                  <motion.div {...listItemIn} transition={{ ...listItemIn.transition, delay: 0.2 }}>
                    <label className="mb-2 block text-sm font-medium text-neutral-300 light-mode:text-slate-700">Full name</label>
                    <input
                      required
                      placeholder="Ada Lovelace"
                      value={form.name}
                      onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                      className="input-field"
                    />
                  </motion.div>
                )}

                <motion.div {...listItemIn} transition={{ ...listItemIn.transition, delay: isLogin ? 0.2 : 0.24 }}>
                  <label className="mb-2 block text-sm font-medium text-neutral-300 light-mode:text-slate-700">Work email</label>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="input-field"
                  />
                </motion.div>

                <motion.div {...listItemIn} transition={{ ...listItemIn.transition, delay: isLogin ? 0.24 : 0.28 }}>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-300 light-mode:text-slate-700">Password</label>
                    {isLogin && <button type="button" className="text-xs text-accent-300 hover:text-accent-200 light-mode:text-accent-600 light-mode:hover:text-accent-700">Forgot password?</button>}
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="input-field"
                  />
                </motion.div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 light-mode:text-red-700"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ y: -1, scale: 1.005 }}
                whileTap={{ scale: 0.99 }}
                disabled={submitting}
                className="pill-button mt-6 w-full rounded-2xl py-3 text-base disabled:opacity-50"
              >
                <span>{submitting ? "Working..." : isLogin ? "Sign in" : "Create account"}</span>
                {!submitting && <ArrowRight size={16} className="ml-2" />}
              </motion.button>

              <motion.div {...listItemIn} transition={{ ...listItemIn.transition, delay: 0.32 }} className="mt-6 flex items-center justify-between gap-4 border-t pt-5 divider">
                <p className="text-sm text-neutral-500 light-mode:text-slate-500">
                  {isLogin ? "Need an account?" : "Already have access?"}
                </p>
                <button
                  type="button"
                  onClick={() => navigate(isLogin ? "/auth/signup" : "/auth/login")}
                  className="inline-flex items-center gap-2 text-sm font-medium text-neutral-200 hover:text-white light-mode:text-slate-900"
                >
                  {isLogin ? "Create one" : "Sign in instead"}
                  <ChevronRight size={15} />
                </button>
              </motion.div>
            </form>
          </motion.section>
        </main>
      </div>
    </div>
  );
};
