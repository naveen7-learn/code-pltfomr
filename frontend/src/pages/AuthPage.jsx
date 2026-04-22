import { useState } from "react";
import { motion } from "framer-motion";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "../components/ThemeToggle";
import { TypewriterText } from "../components/TypewriterText";

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
    <div className="grid min-h-screen place-items-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel grid w-full max-w-5xl overflow-hidden rounded-[36px] md:grid-cols-[1.2fr_0.8fr]"
      >
        <div className="grid-bg relative p-8 md:p-12">
          <div className="mb-10 flex justify-end">
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
          </div>
          <p className="text-sm uppercase tracking-[0.34em] text-cyan-200/70">Review Beyond Static Diffs</p>
          <h1 className="mt-6 max-w-lg text-4xl font-semibold leading-tight text-white md:text-6xl">
            Live code review,
            <br />
            built for teams.
          </h1>
          <TypewriterText
            words={[
              "Workspace syncing in real time.",
              "Comments landing exactly on line.",
              "Reviews moving with your team."
            ]}
            className="mt-5 min-h-[40px] text-lg font-medium text-cyan-100 md:text-xl"
          />
          <p className="mt-6 max-w-lg text-lg text-slate-300">
            Ship pull requests with rich diffs, inline discussions, approvals, notifications, and real-time collaboration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-8 md:p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.34em] text-slate-500">{isLogin ? "Welcome back" : "Create account"}</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{isLogin ? "Sign in" : "Start reviewing"}</h2>
          </div>

          {!isLogin && (
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
            />
          )}

          <input
            required
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
          />

          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
          />

          {error && <p className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={submitting}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-300 px-5 py-4 font-semibold text-slate-950"
          >
            {submitting ? "Working..." : isLogin ? "Sign In" : "Create Account"}
          </motion.button>

          <button
            type="button"
            onClick={() => navigate(isLogin ? "/auth/signup" : "/auth/login")}
            className="text-sm text-slate-400 transition hover:text-white"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
