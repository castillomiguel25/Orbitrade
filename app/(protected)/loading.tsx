"use client";
import { useState, useEffect } from 'react';

export default function ProtectedLoading() {
  const [logs, setLogs] = useState<string[]>(["> SYSTEM_INIT"]);

  useEffect(() => {
    const miningLogs = [
      "> CONNECTING_NODE...",
      "> HASH: 0x48A... [OK]",
      "> MINING_BLOCK...",
      "> CALC_NONCE...",
      "> PROOF_VERIFIED",
      "> BLOCK_FOUND!",
      "> SYNCING_LEDGER...",
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => {
        const nextLog = miningLogs[index % miningLogs.length];
        const newLogs = [...prev, nextLog];
        if (newLogs.length > 5) return newLogs.slice(1);
        return newLogs;
      });
      index++;
    }, 800);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#090320] to-[#170b3d] text-white animate-fade-in">
      <div className="relative mb-8">
        {/* Computer Monitor */}
        <div className="w-48 h-36 bg-[#1a1b26] rounded-xl border-4 border-[#2f334d] relative z-10 p-2 shadow-2xl transform transition-transform hover:scale-105 duration-300">
          {/* Screen */}
          <div className="w-full h-full bg-[#0f0f1a] rounded border border-[#00f5ff]/30 overflow-hidden relative flex flex-col p-3 shadow-inner">
            
            {/* Screen Glow */}
            <div className="absolute inset-0 bg-[#00f5ff]/5 pointer-events-none" />
            
            {/* Scanline Animation */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f5ff]/10 to-transparent animate-scan pointer-events-none" 
              style={{ backgroundSize: '100% 200%' }} 
            />

            {/* Terminal Content - Mining Logs */}
            <div className="font-mono text-[10px] text-[#00f5ff] leading-tight opacity-90 mb-2 flex flex-col justify-end h-full pb-4">
              {logs.map((log, i) => (
                <div key={i} className="whitespace-nowrap overflow-hidden">
                  {log}
                </div>
              ))}
              <div className="animate-pulse">_</div>
            </div>

            {/* Loading Graphic */}
            <div className="absolute bottom-2 left-3 right-3 space-y-1">
              <div className="flex justify-between text-[8px] text-[#13f187] font-mono">
                <span>MINING_RATE</span>
                <span>98.4 MH/s</span>
              </div>
              <div className="h-1 w-full bg-[#00f5ff]/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00f5ff] to-[#13f187] animate-progress-loading" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Monitor Stand */}
        <div className="w-12 h-8 bg-[#2f334d] mx-auto -mt-2 relative z-0" />
        <div className="w-24 h-2 bg-[#2f334d] mx-auto rounded-full shadow-lg" />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00f5ff]/20 blur-3xl -z-10 rounded-full animate-pulse" />
      </div>

      <span className="text-xl font-display font-bold tracking-widest text-[#00f5ff] neon-text-shadow animate-pulse">
        MINING_RESOURCES...
      </span>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes progress-loading {
            0% { width: 0%; opacity: 0.5; }
            50% { width: 70%; opacity: 1; }
            100% { width: 100%; opacity: 0.5; }
        }
        .animate-progress-loading {
            animation: progress-loading 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 