import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { Terminal, Send, Play, MessageSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CollabWorkspace = ({ socket }) => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const [code, setCode] = useState("// Write your C++ code here...\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello World\";\n    return 0;\n}");
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");

  useEffect(() => {
    if (!socket) return;

    // 1. Join the unique room for this session
    socket.emit("join-room", roomId);

    // 2. Listen for code changes from the other person
    socket.on("code-update", (newCode) => setCode(newCode));

    // 3. Listen for new chat messages
    socket.on("receive-chat", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("code-update");
      socket.off("receive-chat");
    };
  }, [socket, roomId]);

  const handleCodeChange = (value) => {
    setCode(value);
    socket.emit("edit-code", { roomId, code: value });
  };

  const sendChat = () => {
    if (!inputMsg.trim()) return;
    const data = { sender: user.name, text: inputMsg, roomId };
    socket.emit("send-chat", data);
    setMessages((prev) => [...prev, { ...data, sender: "You" }]);
    setInputMsg("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0e0e0e] text-white">
      {/* LEFT: EDITOR */}
      <div className="flex-1 flex flex-col border-r border-white/5">
        <div className="h-12 bg-[#1a1a1a] flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Terminal size={16} /> <span>main.cpp</span>
          </div>
          <button className="flex items-center gap-2 bg-accent-500 hover:bg-accent-400 px-4 py-1.5 rounded-lg text-sm font-bold transition-all">
            <Play size={14} /> Run Code
          </button>
        </div>
        <Editor
          height="100%"
          theme="vs-dark"
          defaultLanguage="cpp"
          value={code}
          onChange={handleCodeChange}
          options={{ fontSize: 16, minimap: { enabled: false } }}
        />
      </div>

      {/* RIGHT: CHAT */}
      <div className="w-80 flex flex-col bg-[#111111]">
        <div className="p-4 border-b border-white/5 font-bold flex items-center gap-2">
          <MessageSquare size={18} /> Live Chat
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`p-2 rounded-xl max-w-[80%] ${m.sender === "You" ? "bg-accent-500/20 ml-auto" : "bg-white/5"}`}>
              <p className="text-[10px] text-accent-400 font-bold uppercase">{m.sender}</p>
              <p className="text-sm">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/5 flex gap-2">
          <input 
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent-500"
            placeholder="Type..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
          />
        </div>
      </div>
    </div>
  );
};

export default CollabWorkspace;