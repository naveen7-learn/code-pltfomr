import { useEffect } from "react";

export const useKeyboardShortcuts = (handlers) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const commandKey = event.metaKey || event.ctrlKey;

      if (commandKey && key === "k" && handlers.onSearch) {
        event.preventDefault();
        handlers.onSearch();
      }

      if (commandKey && key === "b" && handlers.onToggleSidebar) {
        event.preventDefault();
        handlers.onToggleSidebar();
      }

      if (commandKey && key === "s" && handlers.onSave) {
        event.preventDefault();
        handlers.onSave();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
};
