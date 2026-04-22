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
    <div className="flex min-h-screen overflow-hidden px-3 py-3 md:px-4">
      <div className="premium-shell flex min-h-[calc(100vh-1.5rem)] w-full overflow-hidden rounded-[32px] border border-white/5 bg-neutral-950/70 shadow-panel backdrop-blur-xl">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((current) => !current)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            onSearch={() => setPaletteOpen(true)}
            notifications={notifications}
            theme={theme}
            onToggleTheme={onToggleTheme}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1440px] p-4 md:p-6">{children}</div>
          </main>
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
    </div>
  );
};
