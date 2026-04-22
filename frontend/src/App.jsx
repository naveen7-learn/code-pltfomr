import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { CustomCursor } from "./components/CustomCursor";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectPage } from "./pages/ProjectPage";
import { PullRequestPage } from "./pages/PullRequestPage";
import { useAuth } from "./context/AuthContext";
import { pageTransition } from "./animations/pageTransitions";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-slate-400">Loading workspace...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

const ProtectedLayout = ({ theme, onToggleTheme, notifications, searchableItems, onSearchIndex, onNotify }) => {
  const { user } = useAuth();

  return (
    <AppShell notifications={notifications} theme={theme} onToggleTheme={onToggleTheme} searchableItems={searchableItems}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage onSearchIndex={onSearchIndex} onNotify={onNotify} />} />
        <Route path="/projects/:projectId" element={<ProjectPage theme={theme} onNotify={onNotify} onSearchIndex={onSearchIndex} />} />
        <Route
          path="/projects/:projectId/pull-requests/:pullRequestId"
          element={<PullRequestPage authUser={user} onNotify={onNotify} />}
        />
      </Routes>
    </AppShell>
  );
};

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("codeflow_theme") || "dark");
  const [notifications, setNotifications] = useState([]);
  const [searchableItems, setSearchableItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem("codeflow_theme", theme);
    document.documentElement.style.colorScheme = theme;
    document.body.classList.toggle("light-mode", theme === "light");
  }, [theme]);

  const onNotify = (notification) => {
    setNotifications((current) => [notification, ...current]);
    setTimeout(() => {
      setNotifications((current) => current.filter((entry) => entry.id !== notification.id));
    }, 4000);
  };

  const onSearchIndex = (items) => {
    setSearchableItems((current) => {
      const merged = [...current, ...items];
      const unique = new Map(merged.map((item) => [`${item.type}-${item.id}`, item]));
      return Array.from(unique.values());
    });
  };

  const shellProps = useMemo(
    () => ({
      theme,
      onToggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
      notifications,
      searchableItems,
      onSearchIndex,
      onNotify
    }),
    [notifications, searchableItems, theme]
  );

  return (
    <>
      <div className="app-backdrop" />
      <CustomCursor />
      <AnimatePresence mode="wait">
        <motion.div key={user ? "app" : "auth"} {...pageTransition}>
          <Routes>
            <Route path="/auth/:mode" element={<AuthPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <ProtectedLayout {...shellProps} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
