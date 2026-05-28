'use client';
import { useState, useEffect, useRef } from "react";

interface CosmicParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  pulse: number;
}

interface StellarField {
  x: number;
  y: number;
  brightness: number;
  twinkle: number;
  size: number;
}

interface CosmicBackgroundProps {
  children: React.ReactNode;
  className?: string;
  scrollable?: boolean;
}

export function CosmicBackground({ children, className = "", scrollable = false }: CosmicBackgroundProps) {
  const [cosmicParticles, setCosmicParticles] = useState<CosmicParticle[]>([]);
  const [stellarField, setStellarField] = useState<StellarField[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Advanced Cosmic Particle System (now with agricultural theme)
  useEffect(() => {
    const createCosmicField = () => {
      const particles: CosmicParticle[] = [];
      const colors = ['#22c55e', '#eab308', '#f97316', '#84cc16', '#10b981', '#f59e0b']; // Green, yellow, orange colors
      
      for (let i = 0; i < 20; i++) {
        particles.push({
          id: Math.random(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          life: Math.random() * 5 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1,
          pulse: Math.random() * 2
        });
      }
      setCosmicParticles(particles);

      // Create stellar field with higher density for a more visible sky
      const stars: StellarField[] = [];
      for (let i = 0; i < 300; i++) {
        stars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          brightness: Math.random() * 0.85 + 0.15,
          twinkle: Math.random() * 3000 + 1000,
          size: Math.random() * 2.5 + 0.6
        });
      }
      setStellarField(stars);
    };

    createCosmicField();
    const interval = setInterval(createCosmicField, 10000);
    return () => clearInterval(interval);
  }, []);

  // Animate Particles
  useEffect(() => {
    const animateParticles = () => {
      setCosmicParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 0.01,
          pulse: particle.pulse + 0.05
        })).filter(particle => particle.life > 0)
      );
    };

    const interval = setInterval(animateParticles, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`text-white relative min-h-[100svh] min-w-full ${scrollable ? 'overflow-auto' : 'overflow-hidden'} ${className}`}
    >
      {/* Advanced Deep Space Background */}
      <div className="fixed inset-0 z-0">
        {/* Base Space Gradient */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 0%, rgba(236, 72, 153, 0.35), transparent),
              radial-gradient(ellipse 60% 50% at 80% 100%, rgba(6, 182, 212, 0.22), transparent),
              radial-gradient(ellipse 100% 80% at 40% 50%, rgba(236, 72, 153, 0.25), transparent),
              linear-gradient(135deg,
                #020008 0%,
                #0a0624 10%,
                #1a0b3d 25%,
                #31115d 45%,
                #1e1065 65%,
                #12064b 85%,
                #020008 100%
              )
            `,
            animation: 'cosmicShift 40s ease-in-out infinite'
          }}
        />
        
        {/* Stellar Field */}
        {stellarField.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.brightness,
              boxShadow: `0 0 ${4 + star.brightness * 4}px rgba(255, 255, 255, ${star.brightness})`,
              animation: `stellarPulse ${star.twinkle}ms ease-in-out infinite alternate`
            }}
          />
        ))}
        
        {/* Cosmic Particles */}
        {cosmicParticles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: (particle.life / 5) * (0.5 + Math.sin(particle.pulse) * 0.5),
              boxShadow: `0 0 ${particle.size * 8}px ${particle.color}`,
              animation: `cosmicFloat ${3 + particle.pulse}s ease-in-out infinite`
            }}
          />
        ))}
        
        {/* Quantum Energy Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <defs>
            <linearGradient id="quantumFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
              <stop offset="50%" stopColor="rgba(236, 72, 153, 0.85)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.85)" />
            </linearGradient>
          </defs>
          
          <path 
            d="M0,300 Q400,150 800,300 T1600,300" 
            stroke="url(#quantumFlow)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
          />
          <path 
            d="M0,700 Q500,500 1000,700 T2000,700" 
            stroke="url(#quantumFlow)" 
            strokeWidth="1.5" 
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Advanced CSS Animations */}
      <style jsx>{`
        @keyframes cosmicShift {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.05) rotate(1deg); }
        }
        
        @keyframes stellarPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        
        @keyframes cosmicFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
