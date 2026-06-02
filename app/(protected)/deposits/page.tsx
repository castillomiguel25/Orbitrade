"use client";

import { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useUserStore } from '@/app/store/useUserStore';
import { useProfileStore } from '@/app/store/useProfileStore';
import { showToast } from '@/app/utils/toast';
import {
  isValidTxid,
  parseOcrAmount,
  extractTxidFromText,
  confirmViaTxid,
  confirmViaProof,
} from '@/app/modules/deposit-confirmation';

type Transaction = {
  id: string;
  date: string;
  amount: number;
  transactionid: string;
  type: string;
};

type Tab = 'txid' | 'proof';

export default function DepositsPage() {
  const intl = useIntl();
  const { user } = useUserStore();
  const { profile, fetchProfile } = useProfileStore();

  const [tab, setTab] = useState<Tab>('txid');
  const [copied, setCopied] = useState(false);

  // TXID flow state
  const [amount, setAmount] = useState('');
  const [txid, setTxid] = useState('');
  const [txidError, setTxidError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Proof/OCR flow state
  const [proofLoading, setProofLoading] = useState(false);
  const [ocrAmount, setOcrAmount] = useState<number | null>(null);
  const [ocrTxid, setOcrTxid] = useState<string | null>(null);
  const [proofAmount, setProofAmount] = useState('');
  const [proofTxid, setProofTxid] = useState('');
  const [proofError, setProofError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // History
  const [history, setHistory] = useState<Transaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const walletAddress = process.env.NEXT_PUBLIC_WALLET ?? '';

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      if (res.ok) {
        const deposits = (data.transactions as Transaction[]).filter(t => t.type === 'deposit');
        setHistory(deposits);
      }
    } finally {
      setHistoryLoading(false);
    }
  }

  function copyWallet() {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function recordTransaction(confirmedAmount: number, confirmedTxid: string) {
    if (!user) return;
    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: confirmedAmount,
        user_id: user.id,
        email: user.email,
        type: 'deposit',
        name: `Deposit confirmed - ${confirmedTxid}`,
        transactionid: confirmedTxid,
      }),
    });
  }

  async function handleTxidSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTxidError('');

    const parsedAmount = parseFloat(amount);
    if (!isFinite(parsedAmount) || parsedAmount <= 0) {
      setTxidError(intl.formatMessage({ id: 'pages.deposits.invalidAmount' }));
      return;
    }
    if (!isValidTxid(txid)) {
      setTxidError(intl.formatMessage({ id: 'pages.deposits.txidPlaceholder' }));
      return;
    }

    setSubmitting(true);
    try {
      const result = await confirmViaTxid(parsedAmount, txid.trim());
      if (result.confirmed && result.txid) {
        await recordTransaction(result.amount ?? parsedAmount, result.txid);
        await fetchProfile();
        await fetchHistory();
        showToast.success(intl, 'notifications.success.deposit');
        setAmount('');
        setTxid('');
      } else {
        showToast.error(intl, 'notifications.error.verifyingTransaction');
      }
    } catch {
      showToast.error(intl, 'notifications.error.verifyingTransaction');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofError('');
    setOcrAmount(null);
    setOcrTxid(null);
    setProofLoading(true);
    try {
      const base64 = await fileToBase64(file);
      const result = await confirmViaProof(base64);
      setOcrAmount(result.amount);
      setOcrTxid(result.txid);
      if (result.amount !== null) setProofAmount(String(result.amount));
      if (result.txid !== null) setProofTxid(result.txid);
    } catch {
      setProofError(intl.formatMessage({ id: 'pages.deposits.unexpectedError' }));
    } finally {
      setProofLoading(false);
    }
  }

  async function handleProofSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProofError('');

    const parsedAmount = parseFloat(proofAmount);
    if (!isFinite(parsedAmount) || parsedAmount <= 0) {
      setProofError(intl.formatMessage({ id: 'pages.deposits.invalidAmount' }));
      return;
    }
    if (!isValidTxid(proofTxid)) {
      setProofError(intl.formatMessage({ id: 'pages.deposits.txidPlaceholder' }));
      return;
    }

    setSubmitting(true);
    try {
      const result = await confirmViaTxid(parsedAmount, proofTxid.trim());
      if (result.confirmed && result.txid) {
        await recordTransaction(result.amount ?? parsedAmount, result.txid);
        await fetchProfile();
        await fetchHistory();
        showToast.success(intl, 'notifications.success.deposit');
        setProofAmount('');
        setProofTxid('');
        setOcrAmount(null);
        setOcrTxid(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        showToast.error(intl, 'notifications.error.verifyingTransaction');
      }
    } catch {
      showToast.error(intl, 'notifications.error.verifyingTransaction');
    } finally {
      setSubmitting(false);
    }
  }

  const availableBalance = profile?.trc20balance ?? 0;

  return (
    <div className="min-h-screen bg-[#0E1116] text-[#E6E8EC]">
      <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:py-8">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">
                {intl.formatMessage({ id: 'pages.deposits.pageTitle' })}
              </h1>
              <p className="text-xs text-[#7C8AA0] mt-0.5">
                {intl.formatMessage({ id: 'pages.deposits.pageSubtitle' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#7C8AA0] uppercase tracking-widest">
                {intl.formatMessage({ id: 'pages.deposits.available' })}
              </div>
              <div className="text-lg font-bold text-[#F5A524] font-mono">
                ${Number(availableBalance).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Wallet card */}
        <div className="bg-[#161A21] border border-white/10 rounded-xl p-4 mb-4">
          <div className="text-[10px] text-[#7C8AA0] uppercase tracking-widest mb-2">
            {intl.formatMessage({ id: 'pages.deposits.walletTitle' })}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono text-xs text-[#E6E8EC] truncate select-all bg-[#0E1116] rounded-lg px-3 py-2 border border-white/10">
              {walletAddress || '—'}
            </div>
            <button
              type="button"
              onClick={copyWallet}
              className="px-3 py-2 text-xs font-bold bg-[#F5A524] text-[#0E1116] rounded-lg hover:bg-[#F5A524]/90 transition-colors whitespace-nowrap"
            >
              {copied
                ? intl.formatMessage({ id: 'pages.deposits.copied' })
                : intl.formatMessage({ id: 'pages.deposits.copy' })}
            </button>
          </div>
          <div className="flex gap-3 mt-3">
            <div className="flex-1 rounded-lg bg-[#0E1116] border border-white/10 px-3 py-2 text-center">
              <div className="text-[9px] text-[#7C8AA0] uppercase tracking-widest">
                {intl.formatMessage({ id: 'pages.deposits.networkBox' })}
              </div>
              <div className="text-xs font-bold text-[#E6E8EC] mt-0.5">TRC-20</div>
            </div>
            <div className="flex-1 rounded-lg bg-[#0E1116] border border-white/10 px-3 py-2 text-center">
              <div className="text-[9px] text-[#7C8AA0] uppercase tracking-widest">
                {intl.formatMessage({ id: 'pages.deposits.currency' })}
              </div>
              <div className="text-xs font-bold text-[#E6E8EC] mt-0.5">USDT</div>
            </div>
          </div>
        </div>

        {/* Network warning */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-amber-400 leading-relaxed">
            {intl.formatMessage({ id: 'pages.deposits.networkWarning' })}
          </p>
        </div>

        {/* Method tabs */}
        <div className="flex bg-[#161A21] border border-white/10 rounded-xl p-1 mb-4">
          <button
            onClick={() => setTab('txid')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              tab === 'txid'
                ? 'bg-[#F5A524] text-[#0E1116]'
                : 'text-[#7C8AA0] hover:text-[#E6E8EC]'
            }`}
          >
            {intl.formatMessage({ id: 'pages.deposits.tabTxid' })}
          </button>
          {/* <button
            onClick={() => setTab('proof')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
              tab === 'proof'
                ? 'bg-[#F5A524] text-[#0E1116]'
                : 'text-[#7C8AA0] hover:text-[#E6E8EC]'
            }`}
          >
            {intl.formatMessage({ id: 'pages.deposits.tabProof' })}
          </button> */}
        </div>

        {/* TXID method */}
        {tab === 'txid' && (
          <form onSubmit={handleTxidSubmit} className="bg-[#161A21] border border-white/10 rounded-xl p-4 space-y-4">
            <div>
              <label className="block text-[10px] text-[#7C8AA0] uppercase tracking-widest mb-1.5">
                {intl.formatMessage({ id: 'pages.deposits.amount' })} (USDT)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0E1116] border border-white/10 rounded-lg px-4 py-3 text-[#E6E8EC] font-mono text-lg text-center focus:outline-none focus:border-[#F5A524] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#7C8AA0] uppercase tracking-widest mb-1.5">
                {intl.formatMessage({ id: 'pages.deposits.txidLabel' })}
              </label>
              <input
                value={txid}
                onChange={e => setTxid(e.target.value.trim())}
                placeholder={intl.formatMessage({ id: 'pages.deposits.txidPlaceholder' })}
                className="w-full bg-[#0E1116] border border-white/10 rounded-lg px-4 py-3 text-[#E6E8EC] font-mono text-xs focus:outline-none focus:border-[#F5A524] transition-colors placeholder:text-[#7C8AA0]/50"
                required
              />
              <p className="text-[10px] text-[#7C8AA0] mt-1">
                {intl.formatMessage({ id: 'pages.deposits.txidScanHint' })}
              </p>
            </div>
            {txidError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-xs text-red-400 text-center">
                {txidError}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting || !amount || !txid}
              className="w-full py-3 font-bold text-sm bg-[#F5A524] text-[#0E1116] rounded-xl hover:bg-[#F5A524]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting
                ? intl.formatMessage({ id: 'pages.deposits.processing' })
                : intl.formatMessage({ id: 'pages.deposits.validateTxid' })}
            </button>
          </form>
        )}

        {/* Proof/OCR method */}
        {tab === 'proof' && (
          <form onSubmit={handleProofSubmit} className="bg-[#161A21] border border-white/10 rounded-xl p-4 space-y-4">
            {/* File upload */}
            <div>
              {/* <label className="block text-[10px] text-[#7C8AA0] uppercase tracking-widest mb-1.5">
                {intl.formatMessage({ id: 'pages.deposits.tabProof' })}
              </label> */}
              <label className="flex flex-col items-center justify-center gap-2 w-full bg-[#0E1116] border border-dashed border-white/20 rounded-xl px-4 py-6 cursor-pointer hover:border-[#F5A524]/50 transition-colors">
                <span className="text-2xl">📎</span>
                <span className="text-xs font-bold text-[#E6E8EC]">
                  {intl.formatMessage({ id: 'pages.deposits.uploadProof' })}
                </span>
                <span className="text-[10px] text-[#7C8AA0]">
                  {intl.formatMessage({ id: 'pages.deposits.uploadHint' })}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>

            {proofLoading && (
              <div className="text-center text-xs text-[#7C8AA0] animate-pulse py-2">
                {intl.formatMessage({ id: 'pages.deposits.processing' })}…
              </div>
            )}

            {/* OCR results */}
            {(ocrAmount !== null || ocrTxid !== null) && !proofLoading && (
              <div className="rounded-lg bg-[#F5A524]/10 border border-[#F5A524]/30 px-4 py-3 space-y-1">
                {ocrAmount !== null && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#7C8AA0]">
                      {intl.formatMessage({ id: 'pages.deposits.ocrAmount' })}
                    </span>
                    <span className="font-bold text-[#F5A524] font-mono">${ocrAmount.toFixed(2)}</span>
                  </div>
                )}
                {ocrTxid !== null && (
                  <div className="flex justify-between items-center text-xs gap-2">
                    <span className="text-[#7C8AA0] shrink-0">
                      {intl.formatMessage({ id: 'pages.deposits.ocrTxid' })}
                    </span>
                    <span className="font-mono text-[10px] text-[#E6E8EC] truncate">{ocrTxid}</span>
                  </div>
                )}
              </div>
            )}

            {/* Confirmation fields */}
            <div>
              <label className="block text-[10px] text-[#7C8AA0] uppercase tracking-widest mb-1.5">
                {intl.formatMessage({ id: 'pages.deposits.amount' })} (USDT)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={proofAmount}
                onChange={e => setProofAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#0E1116] border border-white/10 rounded-lg px-4 py-3 text-[#E6E8EC] font-mono text-lg text-center focus:outline-none focus:border-[#F5A524] transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#7C8AA0] uppercase tracking-widest mb-1.5">
                {intl.formatMessage({ id: 'pages.deposits.txidLabel' })}
              </label>
              <input
                value={proofTxid}
                onChange={e => setProofTxid(e.target.value.trim())}
                placeholder={intl.formatMessage({ id: 'pages.deposits.txidPlaceholder' })}
                className="w-full bg-[#0E1116] border border-white/10 rounded-lg px-4 py-3 text-[#E6E8EC] font-mono text-xs focus:outline-none focus:border-[#F5A524] transition-colors placeholder:text-[#7C8AA0]/50"
                required
              />
            </div>

            {proofError && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-xs text-red-400 text-center">
                {proofError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !proofAmount || !proofTxid}
              className="w-full py-3 font-bold text-sm bg-[#F5A524] text-[#0E1116] rounded-xl hover:bg-[#F5A524]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting
                ? intl.formatMessage({ id: 'pages.deposits.processing' })
                : intl.formatMessage({ id: 'pages.deposits.confirmWithProof' })}
            </button>
          </form>
        )}

        {/* Deposit history */}
        <div className="mt-6">
          <h2 className="text-[10px] font-bold text-[#7C8AA0] uppercase tracking-widest mb-3">
            {intl.formatMessage({ id: 'pages.deposits.historyTitle' })}
          </h2>
          {historyLoading ? (
            <div className="text-center text-xs text-[#7C8AA0] py-4 animate-pulse">
              {intl.formatMessage({ id: 'pages.deposits.processing' })}…
            </div>
          ) : history.length === 0 ? (
            <div className="bg-[#161A21] border border-white/10 rounded-xl px-4 py-8 text-center">
              <p className="text-xs text-[#7C8AA0]">
                {intl.formatMessage({ id: 'pages.deposits.historyEmpty' })}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map(tx => (
                <div
                  key={tx.id}
                  className="bg-[#161A21] border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#7C8AA0]">
                      {new Date(tx.date).toLocaleDateString()}
                    </div>
                    <div className="font-mono text-[10px] text-[#7C8AA0]/60 truncate mt-0.5">
                      {tx.transactionid || '—'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold font-mono text-sm text-[#E6E8EC]">
                      +${Number(tx.amount).toFixed(2)}
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      {intl.formatMessage({ id: 'pages.deposits.statusConfirmed' })}
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
