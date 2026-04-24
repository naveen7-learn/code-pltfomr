import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { Hands } from '@mediapipe/hands';
import * as cam from '@mediapipe/camera_utils';
import { motion } from 'framer-motion';
import { Trash2, Sparkles, Eraser, MousePointer2 } from 'lucide-react';

const HandDraw = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [blocks, setBlocks] = useState([]); 
  const [status, setStatus] = useState("Initializing AI...");

  const onResults = (results) => {
    setStatus("Artist Mode: Active 🎨");
    if (!canvasRef.current || !webcamRef.current) return;

    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    const canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, videoWidth, videoHeight);

    if (results.multiHandLandmarks && results.multiHandedness) {
      results.multiHandLandmarks.forEach((landmarks, index) => {
        const isRightHand = results.multiHandedness[index].label === "Right";
        const indexTip = landmarks[8];
        
        // Coordinates from AI
        const x = indexTip.x * videoWidth;
        const y = indexTip.y * videoHeight;

        if (isRightHand) {
          // 🧱 VOXEL GRID LOGIC
          const gridSize = 25; // Size of each block
          const snappedX = Math.round(x / gridSize) * gridSize;
          const snappedY = Math.round(y / gridSize) * gridSize;

          setBlocks((prev) => {
            const exists = prev.some(b => b.x === snappedX && b.y === snappedY);
            if (exists) return prev;
            // Limit to 600 blocks for performance
            return [...prev.slice(-600), { x: snappedX, y: snappedY, id: Date.now() }];
          });

          // Draw the "Hover" cursor (the hollow block following your finger)
          canvasCtx.strokeStyle = "#40E0D0"; 
          canvasCtx.lineWidth = 2;
          canvasCtx.strokeRect(snappedX - 12, snappedY - 12, 24, 24);
        } else {
          // 🧼 ERASER LOGIC (Left Hand)
          setBlocks((prev) => prev.filter(b => Math.hypot(b.x - x, b.y - y) > 60));
          
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, 60, 0, 2 * Math.PI);
          canvasCtx.strokeStyle = "rgba(255, 77, 77, 0.4)";
          canvasCtx.setLineDash([5, 5]);
          canvasCtx.stroke();
        }
      });
    }

    // 🎨 RENDER THE VOXEL WORLD
    blocks.forEach((block) => {
      const size = 22; // Slightly smaller than grid for gaps

      // 1. Shadow (Bottom/Right)
      canvasCtx.fillStyle = "rgba(0, 0, 0, 0.3)";
      canvasCtx.fillRect(block.x - size/2 + 4, block.y - size/2 + 4, size, size);

      // 2. Main Block Body (Turquoise from your video)
      canvasCtx.fillStyle = "#40E0D0";
      canvasCtx.fillRect(block.x - size/2, block.y - size/2, size, size);

      // 3. Highlight (Top/Left border for 3D look)
      canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      canvasCtx.lineWidth = 1;
      canvasCtx.strokeRect(block.x - size/2, block.y - size/2, size, size);
      
      // 4. Inner Glow
      canvasCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
      canvasCtx.fillRect(block.x - size/2, block.y - size/2, size/2, size/2);
    });

    canvasCtx.restore();
  };

  useEffect(() => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults(onResults);

    if (webcamRef.current) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await hands.send({ image: webcamRef.current.video });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    }
  }, [blocks]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] text-white p-6 font-sans">
      <header className="flex justify-between items-center w-full max-w-5xl mb-8">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black italic tracking-tighter flex items-center gap-3"
          >
            <Sparkles className="text-cyan-400 fill-cyan-400" size={32} />
            VOXEL DRAW
          </motion.h1>
          <p className="text-neutral-500 text-xs font-mono uppercase mt-1">AI Hand-Tracking Engine v2.0 // {status}</p>
        </div>

        <button 
          onClick={() => setBlocks([])}
          className="group flex items-center gap-2 bg-white/5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 px-6 py-3 rounded-2xl border border-white/10 hover:border-red-500/20 transition-all"
        >
          <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-wider">Wipe Canvas</span>
        </button>
      </header>

      <div className="relative rounded-[3rem] overflow-hidden border-[12px] border-white/5 shadow-2xl bg-neutral-950 aspect-video w-full max-w-5xl group">
        <Webcam 
          ref={webcamRef} 
          mirrored={true} 
          className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-opacity group-hover:opacity-30" 
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full z-10 pointer-events-none transform scale-x-[-1]" 
        />
        
        {/* Instruction Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20 pointer-events-none">
          <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            Right Index: Paint
          </div>
          <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest text-red-400">
            Left Palm: Erase
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-neutral-600 text-[10px] font-mono uppercase tracking-[0.2em]">
        Experimental Spatial Interface • Powered by MediaPipe AI
      </div>
    </div>
  );
};

export default HandDraw;