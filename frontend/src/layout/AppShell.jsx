import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { NotificationCenter } from "../components/NotificationCenter";
import { CommandPalette } from "../components/CommandPalette";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

export const AppShell = ({ children, notifications, theme, onToggleTheme, searchableItems = [] }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");

  useKeyboardShortcuts({
    onSearch: () => setPaletteOpen(true),
    onToggleSidebar: () => setCollapsed((current) => !current)
  });

  const results = useMemo(() => {
    if (!query.trim()) {
      return searchableItems.slice(0, 6);
    }

    return searchableItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 10);
  }, [query, searchableItems]);

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 p-4 md:grid-cols-[auto_1fr]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />
      <div className="space-y-4">
        <Topbar
          onSearch={() => setPaletteOpen(true)}
          notifications={notifications}
          theme={theme}
          onToggleTheme={onToggleTheme}
        />
        <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      </div>

      <CommandPalette
        open={paletteOpen}
        query={query}
        onQueryChange={setQuery}
        results={results}
        onClose={() => setPaletteOpen(false)}
        onSelect={(item) => {
          navigate(item.to);
          setPaletteOpen(false);
        }}
      />
      <NotificationCenter notifications={notifications} />
    </div>
  );
};
