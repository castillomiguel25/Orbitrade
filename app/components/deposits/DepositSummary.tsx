import { useIntl } from 'react-intl';
import { PixelIcon } from '@/app/components/PixelIcon';

interface DepositSummaryProps {
  montoDeposito: string;
}

export function DepositSummary({ montoDeposito, }: DepositSummaryProps) {
  const intl = useIntl();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400 font-mono tracking-wider">
            {intl.formatMessage({ id: 'components.depositSummary.quantumValidationTerminal' })}
          </h3>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
        </div>
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-60" />
      </div>
      <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-center">
        <div className="text-blue-400 font-mono text-xs tracking-widest mb-1">{intl.formatMessage({ id: 'components.depositSummary.amountDeposited' })}</div>
        <div className="text-blue-300 font-mono text-lg font-bold">{montoDeposito} USDT</div>
      </div>
      <div className="relative">
        <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg animate-pulse" />
      </div>
    </div>
  );
} 