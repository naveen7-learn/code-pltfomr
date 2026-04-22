import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

export const EditorPanel = ({ file, theme, onSave }) => {
  const [value, setValue] = useState(file?.content || "");

  useEffect(() => {
    setValue(file?.content || "");
  }, [file]);

  useEffect(() => {
    if (!file) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      if (value !== file.content) {
        onSave({ ...file, content: value });
      }
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [file, onSave, value]);

  if (!file) {
    return (
      <div className="glass-panel flex h-full items-center justify-center rounded-[28px] text-slate-400">
        Select a file to start reviewing code.
      </div>
    );
  }

  return (
    <div className="glass-panel flex h-full flex-col overflow-hidden rounded-[28px]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="font-medium text-white">{file.name}</p>
          <p className="text-xs text-slate-500">{file.path}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => onSave({ ...file, content: value })}
          className="flex items-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100"
        >
          <Save size={14} />
          Save
        </motion.button>
      </div>

      <div className="min-h-[460px] flex-1">
        <Editor
          height="100%"
          value={value}
          defaultLanguage={file.language || "javascript"}
          theme={theme === "dark" ? "vs-dark" : "light"}
          onChange={(nextValue) => setValue(nextValue || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            fontFamily: "JetBrains Mono"
          }}
        />
      </div>
    </div>
  );
};
