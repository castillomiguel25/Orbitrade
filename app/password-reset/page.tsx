"use client";
import React, { useState } from "react";
import { Button } from "../components/Button";
import { toast } from "sonner";
import { useIntl } from 'react-intl';
import "../styles/dashboard.css";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [glowEffect, setGlowEffect] = useState(false);
  const [scanEffect, setScanEffect] = useState(false);
  const router = useRouter();
  const intl = useIntl();

  React.useEffect(() => {
    // Glow effect interval
    const glowInterval = setInterval(() => {
      setGlowEffect(true);
      setTimeout(() => setGlowEffect(false), 2000);
    }, 6000);

    // Scan effect interval
    const scanInterval = setInterval(() => {
      setScanEffect(true);
      setTimeout(() => setScanEffect(false), 1500);
    }, 8000);

    return () => {
      clearInterval(glowInterval);
      clearInterval(scanInterval);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success(intl.formatMessage({ id: 'passwordReset.emailSent' }));
      setTimeout(() => router.push("/access"), 2000);
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || intl.formatMessage({ id: 'passwordReset.emailError' }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-deep bg-stars-animation bg-cosmic-nebula flex flex-col">
      <main className="flex flex-1 items-center justify-center relative z-10">
        {/* Nebula/energy overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="bg-gradient-to-br from-red-500/10 via-cyan-500/10 to-pink-500/10 w-full h-full blur-3xl animate-pulse" />
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="relative bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 z-10"
          style={{
            clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
            background: "linear-gradient(135deg, rgba(15, 15, 35, 0.95), rgba(30, 27, 75, 0.95), rgba(20, 17, 55, 0.95))",
            boxShadow: glowEffect ? 
              "0 0 80px rgba(124, 58, 237, 0.8), 0 0 160px rgba(59, 130, 246, 0.4), inset 0 0 40px rgba(255, 255, 255, 0.1)" : 
              "0 0 50px rgba(124, 58, 237, 0.6), 0 0 100px rgba(59, 130, 246, 0.3), inset 0 0 25px rgba(255, 255, 255, 0.05)",
            border: "2px solid rgba(124, 58, 237, 0.5)"
          }}
        >
          {/* Esquinas tecnológicas */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/80"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/80"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/80"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/80"></div>

          {/* Líneas de energía */}
          <div 
            className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent"
            style={{
              boxShadow: "0 0 20px 4px rgba(124, 58, 237, 0.6)",
              opacity: glowEffect ? 1 : 0.8
            }}
          />
          <div 
            className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{
              boxShadow: "0 0 20px 4px rgba(6, 182, 212, 0.6)",
              opacity: glowEffect ? 1 : 0.8
            }}
          />

          {/* Scanline effect */}
          {scanEffect && (
            <div 
              className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                animation: 'matrix-scan 1.5s ease-in-out',
                boxShadow: "0 0 20px 5px rgba(6, 182, 212, 0.8)"
              }}
            />
          )}

          {/* Holographic grid overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px),
                linear-gradient(180deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Header */}
          <div className="relative z-10 text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-cyan-600 rounded-xl flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-gradient-to-br from-white to-red-200 rounded-full" />
              </div>
              <h1 className="text-3xl font-bold font-exo2 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-cyan-300 to-pink-300">
                {intl.formatMessage({ id: 'passwordReset.title' }).toUpperCase()}
              </h1>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-pink-600 rounded-xl flex items-center justify-center animate-pulse">
                <div className="w-5 h-5 bg-gradient-to-br from-white to-cyan-200 rounded-full" />
              </div>
            </div>
            <p className="text-cyan-300 font-mono text-sm tracking-wider">
              {intl.formatMessage({ id: 'passwordReset.secureRecoveryProtocol' })}
            </p>
          </div>

          {/* Form Fields */}
          <div className="relative z-10 space-y-6">
            <div>
              <label className="block text-sm font-mono text-cyan-300 mb-2 tracking-wider">
                {intl.formatMessage({ id: 'passwordReset.email' }).toUpperCase()}
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-black/60 backdrop-blur-sm border border-red-500/40 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 font-mono tracking-wider"
                style={{
                  boxShadow: "0 0 10px rgba(124, 58, 237, 0.2)",
                }}
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              variant="cosmic"
              glowing={true}
              className="w-full py-4 font-bold font-exo2 tracking-wider text-lg"
            >
              {isLoading ? 
                intl.formatMessage({ id: 'passwordReset.sending' }).toUpperCase() : 
                intl.formatMessage({ id: 'passwordReset.submit' }).toUpperCase()
              }
            </Button>

            <div className="text-center space-y-3 pt-4 border-t border-red-500/30">
              <Link 
                href="/access" 
                className="inline-block text-cyan-400 hover:text-cyan-300 font-semibold font-mono tracking-wider transition-all duration-300 hover:scale-105"
                style={{
                  textShadow: "0 0 10px rgba(6, 182, 212, 0.5)"
                }}
              >
                {intl.formatMessage({ id: 'passwordReset.backToLogin' }).toUpperCase()}
              </Link>
            </div>
          </div>
        </form>

        <style jsx>{`
          @keyframes nebulaFloat {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(20px, -10px) rotate(1deg); }
            50% { transform: translate(-10px, 20px) rotate(-1deg); }
            75% { transform: translate(10px, 10px) rotate(0.5deg); }
          }
          
          @keyframes matrix-scan {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }
        `}</style>
      </main>
    </div>
  );
} 