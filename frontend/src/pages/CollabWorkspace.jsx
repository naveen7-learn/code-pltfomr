import React, { useState, useEffect, useRef } from "react";
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
  
  // 🔒 NEW: Lock state to prevent simultaneous typing
  const [isLocked, setIsLocked] = useState(false);
  const lockTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // 1. Join the unique room for this session
    socket.emit("join-collab-room", roomId);

    // 2. Listen for code changes from the other person
    socket.on("code-update", (newCode) => {
      // 🔥 LOCK LOGIC: Lock editor when remote update arrives
      setIsLocked(true);
      setCode(newCode);

      // Clear existing timeout and set a new one to unlock
      if (lockTimeoutRef.current) clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = setTimeout(() => {
        setIsLocked(false);
      }, 1000); // Unlocks after 1 second of no updates
    });

    // 3. Listen for new chat messages (WhatsApp Style)
    socket.on("receive-chat-message", (data) => {
      // Check if it's from "Me" or "Friend" based on the name
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

  // 🚀 FIXED: Code changes only send if NOT locked
  const handleCodeChange = (value) => {
    if (isLocked) return; // Block typing if friend is currently sending code

    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  // 🚀 FIXED: Chat sends to server (server will broadcast back to everyone)
  const sendChat = () => {
    if (!inputMsg.trim()) return;
    
    socket.emit("send-chat-message", { 
      senderName: user.name, 
      message: inputMsg, 
      roomId 
    });
    
    setInputMsg("");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0e0e0e] text-white">
      {/* LEFT: EDITOR */}
      <div className="flex-1 flex flex-col border-r border-white/5">
        <div className="h-12 bg-[#1a1a1a] flex items-center justify-between px-4 border-b border-white/5">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Terminal size={16} /> 
            <span>main.cpp {isLocked && <span className="ml-2 text-accent-400 animate-pulse text-[10px] uppercase font-bold">(Friend is typing...)</span>}</span>
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
          options={{ 
            fontSize: 16, 
            minimap: { enabled: false },
            readOnly: isLocked // 🔒 Visually locks the cursor
          }}
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
            placeholder={isLocked ? "Friend is typing code..." : "Type a message..."}
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
          />
          <button 
            onClick={sendChat}
            className="p-2 bg-accent-500 rounded-lg hover:bg-accent-400 transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollabWorkspace;