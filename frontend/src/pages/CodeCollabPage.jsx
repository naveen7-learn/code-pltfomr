import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Code2, Users, Loader2, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; 
import { useAuth } from "../context/AuthContext";

const CodeCollabPage = ({ socket }) => { 
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState("idle"); // idle, inviting, waiting
  const { user } = useAuth();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const phrases = ["Search for a friend...", "Type User ID...", "Invite to debug..."];

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setPhraseIndex((p) => (p + 1) % phrases.length);
      } else {
        setText(currentPhrase.substring(0, text.length + (isDeleting ? -1 : 1)));
      }
    }, typeSpeed);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

  // Inviter waits for acceptance
  useEffect(() => {
    if (socket) {
      socket.on("invite-accepted", ({ roomId }) => {
        navigate(`/code-collab/${roomId}`);
      });
    }
    return () => socket?.off("invite-accepted");
  }, [socket, navigate]);

  const handleInvite = () => {
    const targetId = searchInput.trim();
    
    // 1. Check if socket actually exists
    if (!socket || !socket.connected) {
      alert("Socket not connected. Please refresh the page.");
      return;
    }

    if (!targetId || status !== "idle") return;

    setStatus("inviting");
    const newRoomId = uuidv4();

    console.log("Attempting to emit send-invite to:", targetId);

    // 2. Add a safety timeout (If server doesn't respond in 5s, stop roaming)
    const timeout = setTimeout(() => {
      if (status === "inviting") {
        setStatus("idle");
        alert("Request timed out. Server didn't respond.");
      }
    }, 5000);

    // 3. Emit the event
    socket.emit("send-invite", {
      targetUserId: targetId,
      roomId: newRoomId,
      inviterName: user?.name || "A friend",
    }, (response) => {
      // Clear the safety timeout since we got an answer
      clearTimeout(timeout);

      if (response && response.status === "success") {
        setStatus("waiting");
      } else {
        alert(response?.message || "An unknown error occurred");
        setStatus("idle");
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[80vh] px-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-400/20 to-cyan-400/20 flex items-center justify-center border border-accent-400/30">
            <Users className="w-8 h-8 text-accent-400" />
          </div>
        </div>
        <h1 className="text-4xl font-display font-bold text-white mb-3">Multiplayer Code</h1>
        <p className="text-neutral-400 text-lg max-w-md mx-auto">
          {status === "waiting" ? "Invite delivered! Stay here until they accept." : "Invite a teammate to code in real-time."}
        </p>
      </motion.div>

      <motion.div className="w-full max-w-xl relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className={`h-6 w-6 transition-colors ${status === "waiting" ? "text-green-400" : "text-neutral-500"}`} />
        </div>
        <input 
          type="text"
          disabled={status !== "idle"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={status === "waiting" ? "Waiting for guest..." : `${text}|`}
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-32 text-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-accent-400/50 shadow-lg disabled:opacity-50"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button 
            onClick={handleInvite}
            disabled={status !== "idle"}
            className="bg-accent-500 hover:bg-accent-400 text-white min-w-[100px] py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
          >
            {status === "inviting" && <Loader2 className="w-4 h-4 animate-spin" />}
            {status === "waiting" && <CheckCircle2 className="w-4 h-4" />}
            {status === "idle" ? "Invite" : status === "inviting" ? "Sending" : "Sent"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeCollabPage;