import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { CustomCursor } from "./components/CustomCursor";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { GlobalPullRequestsPage } from "./pages/GlobalPullRequestsPage";
import { GlobalReviewsPage } from "./pages/GlobalReviewsPage";
import { InsightsPage } from "./pages/InsightsPage";
import { ProjectPage } from "./pages/ProjectPage";
import { PullRequestPage } from "./pages/PullRequestPage";
import { useAuth } from "./context/AuthContext";
import { pageTransition } from "./animations/pageTransitions";

// Components & Hooks
import { useSocket } from "./hooks/useSocket"; 
import CodeCollabPage from "./pages/CodeCollabPage"; 
import CollabWorkspace from "./pages/CollabWorkspace"; // 🆕 New Workspace Page
import { CollabInviteModal } from "./components/CollabInviteModal"; 

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
  const navigate = useNavigate();
  const socket = useSocket(!!user);

  const [inviteData, setInviteData] = useState({ 
    isOpen: false, 
    inviterName: "", 
    roomId: "" 
  });

  useEffect(() => {
    if (user && socket) {
      socket.emit("register-user", user._id);

      socket.on("receive-invite", ({ roomId, inviterName }) => {
        setInviteData({ 
          isOpen: true, 
          inviterName, 
          roomId 
        });
      });
    }

    return () => {
      if (socket) socket.off("receive-invite");
    };
  }, [user, socket]);

  return (
    <>
      <CollabInviteModal 
        isOpen={inviteData.isOpen}
        inviterName={inviteData.inviterName}
        onAccept={() => {
          setInviteData((prev) => ({ ...prev, isOpen: false }));
          navigate(`/code-collab/${inviteData.roomId}`); // 🚀 Teleports you to the code room
        }}
        onDecline={() => setInviteData((prev) => ({ ...prev, isOpen: false }))}
      />

      <AppShell notifications={notifications} theme={theme} onToggleTheme={onToggleTheme} searchableItems={searchableItems}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage onSearchIndex={onSearchIndex} onNotify={onNotify} />} />
          <Route path="/pull-requests" element={<GlobalPullRequestsPage onSearchIndex={onSearchIndex} />} />
          <Route path="/reviews" element={<GlobalReviewsPage onSearchIndex={onSearchIndex} />} />
          <Route path="/insights" element={<InsightsPage />} />
          
          {/* Main Search Page */}
          <Route path="/code-collab" element={<CodeCollabPage socket={socket} />} />
          
          {/* 🆕 THE ACTUAL MULTIPLAYER ROOM */}
          <Route path="/code-collab/:roomId" element={<CollabWorkspace socket={socket} />} />
          
          <Route path="/projects/:projectId" element={<ProjectPage theme={theme} onNotify={onNotify} onSearchIndex={onSearchIndex} />} />
          <Route
            path="/projects/:projectId/pull-requests/:pullRequestId"
            element={<PullRequestPage authUser={user} onNotify={onNotify} />}
          />
        </Routes>
      </AppShell>
    </>
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

  const onNotify = useCallback((notification) => {
    setNotifications((current) => [notification, ...current]);
    setTimeout(() => {
      setNotifications((current) => current.filter((entry) => entry.id !== notification.id));
    }, 4000);
  }, []);

  const onSearchIndex = useCallback((items) => {
    setSearchableItems((current) => {
      const merged = [...current, ...items];
      const unique = new Map(merged.map((item) => [`${item.type}-${item.id}`, item]));
      return Array.from(unique.values());
    });
  }, []);

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