import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { GlobalPullRequestsPage } from "./pages/GlobalPullRequestsPage";
import { GlobalReviewsPage } from "./pages/GlobalReviewsPage";
import { InsightsPage } from "./pages/InsightsPage";
import { ProjectPage } from "./pages/ProjectPage";
import { PullRequestPage } from "./pages/PullRequestPage";
import { useAuth } from "./context/AuthContext";
import { pageTransition } from "./animations/pageTransitions";
import { useSocket } from "./hooks/useSocket"; 
import CodeCollabPage from "./pages/CodeCollabPage"; 
import CollabWorkspace from "./pages/CollabWorkspace"; 
import { CollabInviteModal } from "./components/CollabInviteModal"; 
import HandDraw from "./pages/games/HandDraw"; 

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-slate-400">Loading...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;
  return children;
};

const ProtectedLayout = ({ theme, onToggleTheme, notifications, searchableItems, onSearchIndex, onNotify }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket(!!user);
  const [inviteData, setInviteData] = useState({ isOpen: false, inviterName: "", roomId: "", inviterSocketId: "" });

  useEffect(() => {
    // Check if BOTH user and socket are present and connected
    if (user && socket) {
      
      // Function to handle registration
      const handleRegister = () => {
        const uid = String(user._id || user.id).trim();
        socket.emit("register-user", uid);
        console.log("Attempting to register user:", uid);
      };

      // Register immediately if already connected, otherwise wait for connect event
      if (socket.connected) {
        handleRegister();
      } else {
        socket.on("connect", handleRegister);
      }

      // Cleanup old listeners to prevent bugs
      socket.off("receive-invite");
      socket.off("invite-accepted");

      socket.on("receive-invite", ({ roomId, inviterName, inviterSocketId }) => {
        setInviteData({ isOpen: true, inviterName, roomId, inviterSocketId });
      });

      socket.on("invite-accepted", ({ roomId }) => {
        navigate(`/code-collab/${roomId}`);
      });
    }

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("receive-invite");
        socket.off("invite-accepted");
      }
    };
  }, [user, socket, navigate]);

  return (
    <>
      <CollabInviteModal 
        isOpen={inviteData.isOpen}
        inviterName={inviteData.inviterName}
        onAccept={() => {
          socket.emit("accept-invite", { roomId: inviteData.roomId, inviterSocketId: inviteData.inviterSocketId });
          setInviteData(prev => ({ ...prev, isOpen: false }));
          navigate(`/code-collab/${inviteData.roomId}`); 
        }}
        onDecline={() => setInviteData(prev => ({ ...prev, isOpen: false }))}
      />
      <AppShell notifications={notifications} theme={theme} onToggleTheme={onToggleTheme} searchableItems={searchableItems}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage onSearchIndex={onSearchIndex} onNotify={onNotify} />} />
          <Route path="/pull-requests" element={<GlobalPullRequestsPage onSearchIndex={onSearchIndex} />} />
          <Route path="/reviews" element={<GlobalReviewsPage onSearchIndex={onSearchIndex} />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/code-collab" element={<CodeCollabPage socket={socket} />} />
          <Route path="/code-collab/:roomId" element={<CollabWorkspace socket={socket} />} />
          <Route path="/games/gesture-draw" element={<HandDraw />} />
          <Route path="/projects/:projectId" element={<ProjectPage theme={theme} onNotify={onNotify} onSearchIndex={onSearchIndex} />} />
          <Route path="/projects/:projectId/pull-requests/:pullRequestId" element={<PullRequestPage authUser={user} onNotify={onNotify} />} />
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

  const onNotify = useCallback((n) => {
    setNotifications(c => [n, ...c]);
    setTimeout(() => setNotifications(c => c.filter(e => e.id !== n.id)), 4000);
  }, []);

  const onSearchIndex = useCallback((i) => {
    setSearchableItems(c => {
      const merged = [...c, ...i];
      const unique = new Map(merged.map(item => [`${item.type}-${item.id}`, item]));
      return Array.from(unique.values());
    });
  }, []);

  const shellProps = useMemo(() => ({ theme, onToggleTheme: () => setTheme(c => (c === "dark" ? "light" : "dark")), notifications, searchableItems, onSearchIndex, onNotify }), [notifications, searchableItems, theme]);

  return (
    <>
      <div className="app-backdrop" />
      <AnimatePresence mode="wait">
        <motion.div key={user ? "app" : "auth"} {...pageTransition}>
          <Routes>
            <Route path="/auth/:mode" element={<AuthPage />} />
            <Route path="/*" element={<ProtectedRoute><ProtectedLayout {...shellProps} /></ProtectedRoute>} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}