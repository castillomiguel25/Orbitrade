"use client";

import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useProfileStore } from '@/app/store/useProfileStore';
import { showToast } from '@/app/utils/toast';
import { computeFeePercent, computeFinalAmount } from '@/app/modules/withdrawals';
import { WITHDRAWAL_NETWORK } from '@/app/constants/withdrawal';

type WithdrawalRecord = {
  id: string;
  timestamp: string;
  amount: number;
  finalamount: number;
  trc20address: string;
  bank_details?: string;
  is_processed: boolean;
};

type WithdrawalData = {
  withdrawals: WithdrawalRecord[];
  currentWeekCount: number;
  nextFeePercent: number;
};

export default function WithdrawalsPage() {
  const intl = useIntl();
  const { profile, fetchProfile } = useProfileStore();

  const [amount, setAmount] = useState('');
  const [wallet, setWallet] = useState('');
  const [network] = useState(WITHDRAWAL_NETWORK);
  const [key, setKey] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [history, setHistory] = useState<WithdrawalRecord[]>([]);
  const [weeklyCount, setWeeklyCount] = useState(0);
  const [nextFeePercent, setNextFeePercent] = useState(10);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
    loadHistory();
  }, [fetchProfile]);

  async function loadHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/withdrawals');
      if (!res.ok) return;
      const data: WithdrawalData = await res.json();
      setHistory(data.withdrawals ?? []);
      setWeeklyCount(data.currentWeekCount ?? 0);
      setNextFeePercent(data.nextFeePercent ?? 10);
    } finally {
      setHistoryLoading(false);
    }
  }

  const available = profile?.trc20balance ?? 0;
  const minAmount = 15;

  const numericAmount = parseFloat(amount) || 0;
  const activeFeePercent = computeFeePercent(weeklyCount, false);
  const { fee, finalAmount } = numericAmount > 0
    ? computeFinalAmount(numericAmount, activeFeePercent)
    : { fee: 0, finalAmount: 0 };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (numericAmount < minAmount) {
      showToast.error(intl, 'notifications.error.minimumWithdrawal', { amount: minAmount });
      return;
    }
    if (numericAmount > available) {
      showToast.error(intl, 'notifications.error.insufficientBalance');
      return;
    }
    if (!wallet.trim()) {
      showToast.error(intl, 'notifications.error.enterWalletAddress');
      return;
    }
    if (!key.trim()) {
      showToast.error(intl, 'notifications.error.enterWithdrawalKey');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericAmount,
          trc20address: wallet.trim(),
          network,
          claveRetiro: key.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data?.error === 'withdrawals_weekend_blocked') {
          showToast.error(intl, 'notifications.error.withdrawalsWeekendBlocked');
        } else if (data?.error === 'invalid_withdrawal_key') {
          showToast.error(intl, 'notifications.error.invalidWithdrawalKey');
        } else {
          showToast.error(intl, 'notifications.error.unexpectedWithdrawal');
        }
        return;
      }

      showToast.success(intl, 'notifications.success.withdrawalRequested', { amount: data.finalamount });
      setAmount('');
      setWallet('');
      setKey('');
      await fetchProfile();
      await loadHistory();
    } catch {
      showToast.error(intl, 'notifications.error.unexpectedWithdrawal');
    } finally {
      setSubmitting(false);
    }
  }

  function formatDate(ts: string) {
    return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const canSubmit =
    numericAmount >= minAmount &&
    numericAmount <= available &&
    wallet.trim() &&
    key.trim() &&
    !submitting;

  return (
    <div className="min-h-screen bg-[#0E1116] text-[#E6E8EC]">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">
            {intl.formatMessage({ id: 'pages.withdrawals.pageTitle' })}
          </h1>
          <p className="text-xs text-[#7C8AA0] mt-0.5">
            {intl.formatMessage({ id: 'pages.withdrawals.pageSubtitle' })}
          </p>
        </div>

        {/* Available balance chip */}
        <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#161A21] border border-[#2A2F3A]">
          <span className="text-xs text-[#7C8AA0] font-medium">
            {intl.formatMessage({ id: 'pages.withdrawals.availableLabel' })}
          </span>
          <span className="ml-auto text-sm font-bold text-[#E6E8EC] font-mono">
            {available.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
          </span>
        </div>

        {/* Weekly fee info */}
        <div className="mb-5 rounded-xl bg-[#161A21] border border-[#2A2F3A] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#7C8AA0]">
              {intl.formatMessage({ id: 'pages.withdrawals.weeklyFeeStructure' })}
            </span>
            <span className="text-sm font-bold text-[#F5A524] font-mono">
              {nextFeePercent}%
            </span>
          </div>
          <p className="text-xs text-[#7C8AA0]">
            {intl.formatMessage({ id: 'pages.withdrawals.feeRates' })}
          </p>
          <p className="text-[11px] text-[#AAB3C2]">
            {intl.formatMessage({ id: 'pages.withdrawals.warning.flowPenalty' }, { count: weeklyCount })}
          </p>
        </div>

        {/* Withdrawal form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-[#7C8AA0] mb-1.5">
              {intl.formatMessage({ id: 'pages.withdrawals.amountLabel' })}
            </label>
            <input
              type="number"
              min={minAmount}
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder={intl.formatMessage({ id: 'pages.withdrawals.amountPlaceholder' })}
              className="w-full bg-[#161A21] border border-[#2A2F3A] rounded-xl px-4 py-3 text-[#E6E8EC] placeholder-[#4A5568] font-mono text-sm focus:outline-none focus:border-[#F5A524] transition-colors"
            />
          </div>

          {/* Fee preview */}
          {numericAmount > 0 && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#161A21] border border-[#2A2F3A] rounded-lg px-3 py-2">
                <div className="text-[10px] text-[#7C8AA0] uppercase tracking-wide mb-0.5">
                  {intl.formatMessage({ id: 'pages.withdrawals.feeLabel' })}
                </div>
                <div className="text-sm font-mono font-bold text-[#F5A524]">{activeFeePercent}%</div>
              </div>
              <div className="bg-[#161A21] border border-[#2A2F3A] rounded-lg px-3 py-2">
                <div className="text-[10px] text-[#7C8AA0] uppercase tracking-wide mb-0.5">
                  {intl.formatMessage({ id: 'pages.withdrawals.feeLabel' })} USDT
                </div>
                <div className="text-sm font-mono font-bold text-[#E6E8EC]">-{fee.toFixed(2)}</div>
              </div>
              <div className="bg-[#161A21] border border-[#2A2F3A] rounded-lg px-3 py-2">
                <div className="text-[10px] text-[#7C8AA0] uppercase tracking-wide mb-0.5">
                  {intl.formatMessage({ id: 'pages.withdrawals.youReceive' })}
                </div>
                <div className="text-sm font-mono font-bold text-[#E6E8EC]">{finalAmount.toFixed(2)}</div>
              </div>
            </div>
          )}

          {/* Fixed network */}
          <div>
            <label className="block text-xs font-medium text-[#7C8AA0] mb-1.5">
              {intl.formatMessage({ id: 'pages.withdrawals.networkLabel' })}
            </label>
            <div className="w-full bg-[#161A21] border border-[#2A2F3A] rounded-xl px-4 py-3 text-[#E6E8EC] font-mono text-sm">
              {network}
            </div>
          </div>

          {/* Wallet address */}
          <div>
            <label className="block text-xs font-medium text-[#7C8AA0] mb-1.5">
              {intl.formatMessage({ id: 'pages.withdrawals.walletLabel' })}
            </label>
            <textarea
              value={wallet}
              onChange={e => setWallet(e.target.value)}
              placeholder={intl.formatMessage({ id: 'pages.withdrawals.walletPlaceholder' })}
              rows={2}
              className="w-full bg-[#161A21] border border-[#2A2F3A] rounded-xl px-4 py-3 text-[#E6E8EC] placeholder-[#4A5568] font-mono text-xs resize-none focus:outline-none focus:border-[#F5A524] transition-colors"
            />
          </div>

          {/* Withdrawal key */}
          <div>
            <label className="block text-xs font-medium text-[#7C8AA0] mb-1.5">
              {intl.formatMessage({ id: 'pages.withdrawals.keyLabel' })}
            </label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder={intl.formatMessage({ id: 'pages.withdrawals.keyPlaceholder' })}
              className="w-full bg-[#161A21] border border-[#2A2F3A] rounded-xl px-4 py-3 text-[#E6E8EC] placeholder-[#4A5568] font-mono text-sm focus:outline-none focus:border-[#F5A524] transition-colors"
            />
          </div>

          {/* Processing time notice */}
          <p className="text-[11px] text-[#7C8AA0] text-center">
            {intl.formatMessage({ id: 'pages.withdrawals.processingTime' })}
          </p>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[#F5A524] text-[#0E1116] hover:bg-[#D48E1A]"
          >
            {submitting ? '…' : intl.formatMessage({ id: 'pages.withdrawals.submitButton' })}
          </button>
        </form>

        {/* History */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-[#E6E8EC] mb-3">
            {intl.formatMessage({ id: 'pages.withdrawals.historyTitle' })}
          </h2>

          {historyLoading ? (
            <div className="text-xs text-[#7C8AA0] text-center py-6">…</div>
          ) : history.length === 0 ? (
            <div className="text-xs text-[#7C8AA0] text-center py-6 bg-[#161A21] rounded-xl border border-[#2A2F3A]">
              {intl.formatMessage({ id: 'pages.withdrawals.historyEmpty' })}
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(w => (
                <div
                  key={w.id}
                  className="flex items-center justify-between px-4 py-3 bg-[#161A21] rounded-xl border border-[#2A2F3A] text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-mono text-[#E6E8EC]">
                      {w.amount.toFixed(2)} USDT
                    </div>
                    <div className="text-[#7C8AA0]">{formatDate(w.timestamp)}</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="font-mono text-[#F5A524]">
                      {intl.formatMessage({ id: 'pages.withdrawals.youReceive' })}: {Number(w.finalamount).toFixed(2)}
                    </div>
                    <div className={`font-medium ${w.is_processed ? 'text-green-400' : 'text-[#7C8AA0]'}`}>
                      {w.is_processed
                        ? intl.formatMessage({ id: 'pages.withdrawals.statusCompleted' })
                        : intl.formatMessage({ id: 'pages.withdrawals.statusProcessing' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
