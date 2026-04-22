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
    return <div className="card flex h-full items-center justify-center rounded-[28px] text-neutral-400 light-mode:text-slate-500">Select a file to start reviewing code.</div>;
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.22 }} className="card flex h-full flex-col overflow-hidden rounded-[28px]">
      <div className="flex items-center justify-between border-b px-4 py-3 divider">
        <div>
          <p className="font-medium text-neutral-100 light-mode:text-slate-950">{file.name}</p>
          <p className="text-xs text-neutral-500 light-mode:text-slate-500">{file.path}</p>
        </div>
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.94 }} onClick={() => onSave({ ...file, content: value })} className="pill-button rounded-2xl px-3 py-2 text-sm">
          <Save size={14} />
          <span className="ml-2">Save</span>
        </motion.button>
      </div>

      <div className="min-h-[460px] flex-1 overflow-hidden rounded-b-[28px]">
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
            fontFamily: "IBM Plex Mono",
            padding: { top: 18, bottom: 18 }
          }}
        />
      </div>
    </motion.div>
  );
};
