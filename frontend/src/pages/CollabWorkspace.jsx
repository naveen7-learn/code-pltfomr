import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { Terminal, Send, Play, MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CollabWorkspace = ({ socket }) => {
  const { roomId } = useParams();
  const { user } = useAuth();
  
  // States
  const [code, setCode] = useState("// Write your C++ code here...\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World\" << endl;\n    return 0;\n}");
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [output, setOutput] = useState("");
  const [isCompiling, setIsCompiling] = useState(false);
  
  const lockTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-collab-room", roomId);

    socket.on("code-update", (newCode) => {
      setCode((currentCode) => {
        // FIX: Prevent self-locking if code is identical
        if (newCode === currentCode) return currentCode;
        
        setIsLocked(true);
        if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
        lockTimeoutRef.current = setTimeout(() => setIsLocked(false), 1000);
        return newCode;
      });
    });

    socket.on("receive-chat-message", (data) => {
      const formattedMsg = {
        ...data,
        sender: data.sender === user.name ? "You" : data.sender
      };
      setMessages((prev) => [...prev, formattedMsg]);
    });

    return () => {
      socket.off("code-update");
      socket.off("receive-chat-message");
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
    };
  }, [socket, roomId, user.name]);

  const handleCodeChange = (value) => {
    if (isLocked) return;
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  // 🚀 RUN CODE LOGIC
  const runCode = async () => {
    setIsCompiling(true);
    setOutput("Compiling and Running...");
    
    try {
      const response = await fetch("http://localhost:5000/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "cpp" }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        // Piston API output structure
        setOutput(data.run.output || "Program executed with no output.");
      }
    } catch (err) {
      setOutput("Error: Could not connect to the compiler service. Make sure your backend is running.");
    } finally {
      setIsCompiling(false);
    }
  };

  const sendChat = () => {
    if (!inputMsg.trim()) return;
    socket.emit("send-chat-message", { senderName: user.name, message: inputMsg, roomId });
    setInputMsg("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0e0e0e] text-white overflow-hidden">
      {/* LEFT: EDITOR & TERMINAL SECTION */}
      <div className="flex-1 flex flex-col border-r border-white/5">
        {/* Toolbar */}
        <div className="h-12 bg-[#1a1a1a] flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Terminal size={16} /> 
            <span>main.cpp {isLocked && <span className="ml-2 text-accent-400 animate-pulse text-[10px] uppercase font-bold">(Friend typing...)</span>}</span>
          </div>
          <button 
            onClick={runCode}
            disabled={isCompiling}
            className="flex items-center gap-2 bg-accent-500 hover:bg-accent-400 px-4 py-1.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompiling ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {isCompiling ? "Running..." : "Run Code"}
          </button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="cpp"
            value={code}
            onChange={handleCodeChange}
            options={{ 
              fontSize: 16, 
              minimap: { enabled: false },
              readOnly: isLocked,
              automaticLayout: true,
              scrollBeyondLastLine: false,
              // Keybinding fixes
              letterSpacing: 0,
              stopRenderingLineAfter: -1,
              handleKeyboardLayoutChanges: true
            }}
          />
        </div>

        {/* TERMINAL OUTPUT AREA */}
        <div className="h-56 bg-[#0a0a0a] border-t border-white/10 flex flex-col">
          <div className="px-4 py-2 border-b border-white/5 flex justify-between items-center bg-[#111]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Output Terminal</span>
            <button onClick={() => setOutput("")} className="text-[10px] text-neutral-500 hover:text-white transition-colors">Clear</button>
          </div>
          <div className="flex-1 p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap select-text">
            {output ? (
               <pre className={output.toLowerCase().includes("error") ? "text-red-400" : "text-emerald-400"}>
                 {output}
               </pre>
            ) : (
              <span className="text-neutral-600 italic">No output yet. Write some code and hit "Run".</span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: CHAT SECTION */}
      <div className="w-80 flex flex-col bg-[#111111]">
        <div className="p-4 border-b border-white/5 font-bold flex items-center gap-2">
          <MessageSquare size={18} /> Live Chat
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`p-2 rounded-xl max-w-[80%] ${m.sender === "You" ? "bg-accent-500/20 ml-auto" : "bg-white/5"}`}>
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] text-accent-400 font-bold uppercase">{m.sender}</p>
                <p className="text-[8px] text-neutral-500">{m.time}</p>
              </div>
              <p className="text-sm">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/5 flex gap-2">
          <input 
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent-500"
            placeholder="Type a message..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
          />
          <button onClick={sendChat} className="p-2 bg-accent-500 rounded-lg hover:bg-accent-400">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollabWorkspace;