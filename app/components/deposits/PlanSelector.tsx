import { useIntl } from 'react-intl';
import Image from 'next/image';
import { InvestmentPlanType } from '@/app/types/investmentPlan';
import { useProfileStore } from '@/app/store/useProfileStore';
import { showToast } from '@/app/utils/toast';

interface PlanSelectorProps {
  investmentPlans: InvestmentPlanType[];
  planSeleccionado: string;
  seleccionarPlan: (id: string) => void;
}

export function PlanSelector({ investmentPlans, planSeleccionado, seleccionarPlan }: PlanSelectorProps) {
  const intl = useIntl();
  const { profile } = useProfileStore();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-mono tracking-wider">
            MINING MODULE SELECTION
          </h3>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
        </div>
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />
      </div>

      {/* Mining Modules Grid - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
        {investmentPlans.map((plan) => {
          const isSelected = planSeleccionado === plan.id;
          const rankMap: Record<string, number> = {
            'plan-17': 6,
            'plan-20': 6,
            'plan-23': 1,
            'zyx-drone': 1,
            'vortex-hunter': 2,
            'nebula-sentinel': 3,
            'plasma-wraith': 4,
            'crimson-overlord': 5,
          };
          const requiredRank = rankMap[String(plan.id || '').toLowerCase()] || 1;
          const userRank = profile?.rango ?? 1;
          const isUnlocked = userRank >= requiredRank;
          const minYield = plan.minPrice ? (plan.minPrice * plan.rendimiento / 100).toFixed(2) : null;
          const maxYield = plan.maxPrice ? (plan.maxPrice * plan.rendimiento / 100).toFixed(2) : null;
          const dailyYield = ((plan.monto || 0) * plan.rendimiento / 100).toFixed(2);
          
          return (
            <div
              key={plan.id}
              className={`relative ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'} group transition-all duration-500 transform ${isUnlocked ? 'hover:scale-[1.02]' : ''} ${
                isSelected ? 'scale-[1.02]' : ''
              }`}
              onClick={() => {
                if (isUnlocked) {
                  seleccionarPlan(plan.id);
                } else {
                  showToast.info(intl, 'notifications.info.planLockedRankRequired', { requiredRank });
                }
              }}
            >
              {/* Locked Overlay */}
              {!isUnlocked && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px] rounded-2xl border border-red-500/30">
                  <div className="relative w-24 h-24 animate-[pulse_3s_ease-in-out_infinite] drop-shadow-[0_0_25px_rgba(239,68,68,0.6)]">
                    <div className="absolute inset-0 animate-[bounce_3s_infinite]">
                      <Image
                        src="/block.png"
                        alt="Locked"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="mt-4 px-3 py-1 bg-black/60 rounded-full border border-red-500/40 backdrop-blur-md">
                    <span className="text-[10px] font-mono font-bold text-red-400 tracking-widest uppercase">
                      LOCKED • RANK {requiredRank}
                    </span>
                  </div>
                </div>
              )}

              {/* Quantum Energy Field */}
              <div className={`absolute -inset-2 rounded-2xl blur-lg transition-all duration-500 ${
                isSelected 
                  ? 'bg-gradient-to-r from-green-500/40 to-cyan-500/40 animate-pulse' 
                  : 'bg-gradient-to-r from-green-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100'
              }`} />
              
              {/* Module Card */}
              <div className={`relative rounded-2xl backdrop-blur-sm border transition-all duration-500 overflow-hidden ${!isUnlocked ? 'opacity-40 grayscale' : ''} ${
                isSelected 
                  ? 'border-green-500/60 shadow-2xl shadow-green-500/30' 
                  : 'border-slate-700/50 hover:border-green-500/30'
              }`}>
                
                {/* Status Indicators */}
                {isSelected && (
                  <>
                    {/* Holographic Corners */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80 rounded-tl-lg animate-pulse" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80 rounded-tr-lg animate-pulse" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80 rounded-bl-lg animate-pulse" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80 rounded-br-lg animate-pulse" />
                  </>
                )}

                {/* Card Content */}
                <div className="p-4">
                  {/* Module Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-br from-green-500 to-cyan-500 animate-pulse' 
                        : 'bg-gradient-to-br from-slate-700 to-slate-600'
                    }`}>
                      <span className="text-lg">🚀</span>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-bold font-mono tracking-wider transition-all duration-300 ${
                        isSelected 
                          ? 'text-green-300 text-base' 
                          : 'text-white text-sm'
                      }`}>
                        {intl.formatMessage({ id: plan.titleKey, defaultMessage: plan.title })}
                      </h4>
                      <div className="text-slate-400 font-mono text-xs">
                        ID: {plan.id.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Module Stats - Compact 2x2 Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* Efficiency */}
                    <div className={`text-center p-2 rounded-lg border transition-all duration-300 ${
                      isSelected 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-slate-800/50 border-slate-600/30'
                    }`}>
                      <div className="text-green-400 font-mono text-xs tracking-widest mb-1">
                        RATE
                      </div>
                      <div className={`font-bold font-mono transition-all duration-300 ${
                        isSelected ? 'text-green-300 text-sm' : 'text-green-400 text-xs'
                      }`}>
                        {plan.rendimiento}
                      </div>
                    </div>

                    {/* Fuel Cost */}
                    <div className={`text-center p-2 rounded-lg border transition-all duration-300 ${
                      isSelected 
                        ? 'bg-cyan-500/10 border-cyan-500/30' 
                        : 'bg-slate-800/50 border-slate-600/30'
                    }`}>
                      <div className="text-cyan-400 font-mono text-xs tracking-widest mb-1">
                        FUEL
                      </div>
                      <div className={`font-bold font-mono transition-all duration-300 ${
                        isSelected ? 'text-cyan-300 text-sm' : 'text-cyan-400 text-xs'
                      }`}>
                        {plan.minPrice ? `${plan.minPrice} - ${plan.maxPrice}` : plan.monto}
                      </div>
                    </div>
                  </div>

                  {/* Daily Yield */}
                  <div className={`text-center p-2 rounded-lg border transition-all duration-300 ${
                    isSelected 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-slate-800/50 border-slate-600/30'
                  }`}>
                    <div className="text-red-400 font-mono text-xs tracking-widest mb-1">
                      DAILY YIELD
                    </div>
                    <div className={`font-bold font-mono transition-all duration-300 ${
                      isSelected ? 'text-red-300 text-sm' : 'text-red-400 text-xs'
                    }`}>
                      {plan.minPrice ? `${minYield} - ${maxYield}` : dailyYield} USDT
                    </div>
                  </div>

                  {/* Activation Status */}
                  <div className="mt-3 text-center">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all duration-300 ${
                      isSelected 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                    }`}>
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isSelected ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
                      }`} />
                      <span>{isSelected ? 'SELECTED' : 'STANDBY'}</span>
                    </div>
                  </div>
                </div>

                {/* Scanning Effect */}
                {isSelected && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent rounded-2xl pointer-events-none"
                    style={{
                      animation: 'quantumScanline 3s ease-in-out infinite'
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection Summary */}
      {planSeleccionado && (
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-2xl blur-lg animate-pulse" />
          <div className="relative rounded-2xl backdrop-blur-sm p-4 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-300 font-mono text-sm tracking-wider font-bold">
                  MODULE SELECTED
                </span>
              </div>
              <div className="text-green-400 font-mono text-sm">
                {investmentPlans.find(p => p.id === planSeleccionado)?.id.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes quantumScanline {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100%) skewX(-15deg); opacity: 0; }
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 197, 94, 0.5) rgba(15, 23, 42, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(34, 197, 94, 0.5);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 197, 94, 0.7);
        }
      `}</style>
    </div>
  );
} 
