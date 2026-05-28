'use client';

import { useState } from 'react';
import GalaxianGame from '../components/game/GalaxianGame';
import { investmentPlans } from '../constants/investmentPlans';
import { InvestmentPlan } from '../components/InvestmentPlan';
import { CreatureDetail } from '../components/CreatureDetail';
import { InvestmentPlanType } from '../types/investmentPlan';

export default function GalaxianPage() {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlanType | null>(null);

  // Filter Galaxian plans
  const galaxianPlans = investmentPlans.filter(p => 
    ['galaxian', 'galaxian_scout', 'galaxian_fighter', 'galaxian_destroyer'].includes(String(p.id))
  );

  return (
    <div className="min-h-screen bg-black pb-20">
      <div style={{ padding: 12 }}>
        <GalaxianGame />
      </div>
      
      <div id="galaxian-plans" className="container mx-auto px-4 mt-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-mono tracking-widest">
          GALAXIAN FLEET
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galaxianPlans.map(plan => (
            <InvestmentPlan 
              key={plan.id} 
              title={plan.title}
              description={plan.description}
              imagePath={plan.imagePath}
              altText={plan.altText}
              rendimiento={plan.rendimiento}
              monto={plan.monto ?? 0}
              duracionDias={plan.duracionDias}
              titleKey={plan.titleKey}
              descriptionKey={plan.descriptionKey}
              onClick={() => setSelectedPlan(plan)}
            />
          ))}
        </div>
      </div>

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <CreatureDetail
            plan={selectedPlan}
            onClose={() => setSelectedPlan(null)}
          />
        </div>
      )}
    </div>
  );
}
