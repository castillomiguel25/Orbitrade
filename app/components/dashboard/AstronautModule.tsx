import React from 'react';
import { InvestmentPlanType } from '@/app/types/investmentPlan';

interface AstronautModuleProps {
  plan: InvestmentPlanType;
  index: number;
  isActive: boolean;
  onClick: () => void;
  intl: any;
}

export const AstronautModule: React.FC<AstronautModuleProps> = ({
  plan,
  index,
  isActive,
  onClick,
  intl
}) => {
  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 ${
        isActive ? 'scale-105' : 'hover:scale-102'
      }`}
      onClick={onClick}
    >
      {/* Astronaut Module Frame */}
      <div 
        className="relative rounded-2xl border-2 transition-all duration-500 overflow-hidden h-72"
        style={{
          background: isActive ? 
            'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3))' :
            'linear-gradient(135deg, rgba(15, 15, 35, 0.8), rgba(23, 21, 56, 0.8))',
          borderColor: isActive ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
          boxShadow: isActive ? 
            '0 0 30px rgba(139, 92, 246, 0.8)' : 
            '0 0 10px rgba(139, 92, 246, 0.3)'
        }}
      >
        
        {/* Holographic Corners */}
        {isActive && (
          <>
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80 rounded-tl-lg animate-pulse z-10" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80 rounded-tr-lg animate-pulse z-10" />
            <div className="absolute bottom-20 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80 rounded-bl-lg animate-pulse z-10" />
            <div className="absolute bottom-20 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80 rounded-br-lg animate-pulse z-10" />
          </>
        )}
        
        {/* Main Astronaut Image */}
        <div className="relative h-52 overflow-hidden">
          <img 
            src={plan.imagePath} 
            alt={plan.altText}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${
            isActive ? 'bg-red-500/20' : 'bg-transparent'
          } transition-all duration-300`} />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isActive ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-gray-500'
            }`} />
            <span className={`text-xs font-mono font-bold ${
              isActive ? 'text-green-400' : 'text-gray-400'
            }`}>
              {isActive ? intl.formatMessage({ id: 'pages.dashboard.active' }) : intl.formatMessage({ id: 'pages.dashboard.standby' })}
            </span>
          </div>
        </div>
        
        {/* Info Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
          {/* Astronaut Name */}
          <h3 className="text-sm font-bold text-white mb-3 font-mono tracking-wider text-center leading-tight">
            {plan.title.toUpperCase().split(' ').map((word, index) => (
              <div key={index}>{word}</div>
            ))}
          </h3>
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 gap-2">
            <div className="text-center">
              {/* <div className="text-cyan-400 font-mono text-xs tracking-wider">{intl.formatMessage({ id: 'pages.dashboard.fuel' })}</div> */}
              <div className="text-cyan-300 font-bold font-mono text-sm">{plan.monto}</div>
            </div>
          </div>
        </div>
        
        {/* Scanning Effect */}
        {isActive && (
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent rounded-2xl pointer-events-none"
            style={{ animation: 'astronautScan 3s ease-in-out infinite' }}
          />
        )}
      </div>
    </div>
  );
};