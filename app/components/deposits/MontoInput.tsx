import React from 'react';

interface MontoInputProps {
  montoDeposito: string;
  setMontoDeposito: (monto: string) => void;
}

export function MontoInput({ montoDeposito, setMontoDeposito }: MontoInputProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 font-mono tracking-wider mb-2">
          INGRESA EL MONTO A DEPOSITAR
        </h3>
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60 mb-4"></div>
      </div>
      <input
        type="number"
        min="1"
        step="any"
        value={montoDeposito}
        onChange={e => setMontoDeposito(e.target.value)}
        placeholder="Monto a depositar (USDT)"
        className="w-full bg-slate-800/50 border border-green-500/30 rounded-xl p-3 text-green-100 font-mono text-lg text-center"
        required
      />
    </div>
  );
} 