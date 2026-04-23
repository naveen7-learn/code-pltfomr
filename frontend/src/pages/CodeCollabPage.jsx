import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Code2, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; 
import { useAuth } from "../context/AuthContext";

const CodeCollabPage = ({ socket }) => { // 👈 Accepting socket from App.jsx
  const [searchInput, setSearchInput] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const phrases = ["Search for a friend...", "Type @username...", "Invite to collab..."];
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 40 : 80;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setText(currentPhrase.substring(0, text.length + (isDeleting ? -1 : 1)));
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  // 🚀 THE INVITE TRIGGER
  const handleInvite = () => {
    if (!searchInput) return alert("Bro, enter a User ID first!");
    if (!socket) return alert("Socket not connected yet, wait a sec...");

    const newRoomId = uuidv4();

    console.log("🚀 Sending invite to:", searchInput);

    // This fires the event to the backend index.js
    socket.emit("send-invite", {
      targetUserId: searchInput,
      roomId: newRoomId,
      inviterName: user?.name || "A friend",
    });

    // Move you into the room immediately
    navigate(`/code-collab/${newRoomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[80vh] px-6">
      
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400/20 to-cyan-400/20 flex items-center justify-center border border-accent-400/30">
            <Users className="w-8 h-8 text-accent-400" />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-3">Multiplayer Code Session</h1>
        <p className="text-neutral-400 text-lg max-w-md mx-auto">
          Invite a teammate to review code, debug, and build together in real-time.
        </p>
      </motion.div>

      {/* The Big Typewriter Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xl relative group"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-neutral-500 group-focus-within:text-accent-400 transition-colors" />
        </div>
        <input 
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)} // 👈 Binding the input
          placeholder={`${text}|`}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-accent-400/50 focus:bg-white/[0.05] transition-all shadow-lg"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button 
            onClick={handleInvite} // 👈 Hooking up the function
            className="bg-accent-500 hover:bg-accent-400 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all border border-white/5 shadow-lg active:scale-95"
          >
            Invite
          </button>
        </div>
      </motion.div>

      {/* Quick Actions / Recent */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex items-center gap-4 text-sm text-neutral-500"
      >
        <Code2 size={16} />
        <span>Or generate a shareable session link</span>
        <button className="text-accent-400 hover:text-accent-300 font-medium">Copy Link</button>
      </motion.div>

    </div>
  );
};

export default CodeCollabPage;