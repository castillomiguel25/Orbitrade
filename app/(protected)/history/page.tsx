"use client";

import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

type Transaction = {
  id: string;
  date: string;
  name: string;
  amount: number;
  type: string;
  transactionid: string;
};

type Movement = {
  id: string;
  created_at: string;
  type: string;
  amount: number;
  previous_balance: number;
  new_balance: number;
  note?: string | null;
};

type HistoryEntry = {
  id: string;
  timestamp: string;
  source: 'transaction' | 'movement';
  type: string;
  amount: number;
  txid?: string;
  name?: string;
  note?: string;
  newBalance?: number;
};

type Filter = 'all' | 'deposit' | 'withdrawal' | 'other';

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  deposit:    { bg: 'rgba(245,165,36,0.12)',  text: '#F5A524', border: 'rgba(245,165,36,0.3)' },
  withdrawal: { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  withdraw:   { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  invest:     { bg: 'rgba(124,138,160,0.12)', text: '#7C8AA0', border: 'rgba(124,138,160,0.3)' },
  earning:    { bg: 'rgba(34,197,94,0.12)',   text: '#22c55e', border: 'rgba(34,197,94,0.3)' },
  conversion: { bg: 'rgba(124,138,160,0.12)', text: '#7C8AA0', border: 'rgba(124,138,160,0.3)' },
  adjustment: { bg: 'rgba(124,138,160,0.12)', text: '#7C8AA0', border: 'rgba(124,138,160,0.3)' },
};

function typeColor(type: string) {
  return TYPE_COLORS[type] ?? TYPE_COLORS.adjustment;
}

export default function HistoryPage() {
  const intl = useIntl();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/transactions').then(r => r.json()).catch(() => ({ transactions: [] })),
      fetch('/api/balance-movements').then(r => r.json()).catch(() => ({ movements: [] })),
    ]).then(([txData, movData]) => {
      const txEntries: HistoryEntry[] = (txData.transactions ?? []).map((t: Transaction) => ({
        id: `tx-${t.id}`,
        timestamp: t.date,
        source: 'transaction' as const,
        type: t.type,
        amount: t.amount,
        txid: t.transactionid,
        name: t.name,
      }));
      const movEntries: HistoryEntry[] = (movData.movements ?? []).map((m: Movement) => ({
        id: `mv-${m.id}`,
        timestamp: m.created_at,
        source: 'movement' as const,
        type: m.type,
        amount: m.amount,
        note: m.note ?? undefined,
        newBalance: m.new_balance,
      }));
      const merged = [...txEntries, ...movEntries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setEntries(merged);
    }).finally(() => setLoading(false));
  }, []);

  function typeLabel(type: string): string {
    const map: Record<string, string> = {
      deposit:    intl.formatMessage({ id: 'pages.history.typeDeposit' }),
      withdrawal: intl.formatMessage({ id: 'pages.history.typeWithdrawal' }),
      withdraw:   intl.formatMessage({ id: 'pages.history.typeWithdrawal' }),
      invest:     intl.formatMessage({ id: 'pages.history.typeInvest' }),
      earning:    intl.formatMessage({ id: 'pages.history.typeEarning' }),
      conversion: intl.formatMessage({ id: 'pages.history.typeConversion' }),
      adjustment: intl.formatMessage({ id: 'pages.history.typeAdjustment' }),
    };
    return map[type] ?? type;
  }

  const filtered = entries.filter(e => {
    if (filter === 'all') return true;
    if (filter === 'deposit') return e.type === 'deposit';
    if (filter === 'withdrawal') return e.type === 'withdrawal' || e.type === 'withdraw';
    if (filter === 'other') return !['deposit', 'withdrawal', 'withdraw'].includes(e.type);
    return true;
  });

  const FILTERS: { key: Filter; labelId: string }[] = [
    { key: 'all',        labelId: 'pages.history.filterAll' },
    { key: 'deposit',    labelId: 'pages.history.filterDeposits' },
    { key: 'withdrawal', labelId: 'pages.history.filterWithdrawals' },
    { key: 'other',      labelId: 'pages.history.filterOther' },
  ];

  return (
    <div className="min-h-screen bg-[#0E1116] text-[#E6E8EC]">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:py-8 space-y-5">

        <div>
          <h1 className="text-xl font-bold text-[#E6E8EC] tracking-tight">
            {intl.formatMessage({ id: 'pages.history.pageTitle' })}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#7C8AA0' }}>
            {intl.formatMessage({ id: 'pages.history.subtitle' })}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: filter === f.key ? '#F5A524' : '#161A21',
                color: filter === f.key ? '#0E1116' : '#7C8AA0',
                border: `1px solid ${filter === f.key ? '#F5A524' : '#2A2F3A'}`,
              }}
            >
              {intl.formatMessage({ id: f.labelId })}
            </button>
          ))}
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: '#161A21', border: '1px solid #2A2F3A' }}>
          {loading ? (
            <div className="py-12 text-center text-sm" style={{ color: '#7C8AA0' }}>
              {intl.formatMessage({ id: 'pages.history.loading' })}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm" style={{ color: '#7C8AA0' }}>
              {intl.formatMessage({ id: 'pages.history.empty' })}
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#2A2F3A' }}>
              {filtered.map(entry => {
                const colors = typeColor(entry.type);
                const date = new Date(entry.timestamp);
                return (
                  <div key={entry.id} className="px-4 py-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-medium shrink-0"
                          style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                        >
                          {typeLabel(entry.type)}
                        </span>
                        {entry.name && (
                          <span className="text-xs truncate" style={{ color: '#7C8AA0' }}>{entry.name}</span>
                        )}
                      </div>
                      <span
                        className="text-sm font-bold tabular-nums shrink-0"
                        style={{ color: entry.amount >= 0 ? '#22c55e' : '#ef4444' }}
                      >
                        {entry.amount >= 0 ? '+' : ''}{entry.amount.toFixed(2)} USDT
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs" style={{ color: '#7C8AA0' }}>
                      <span>{date.toLocaleString()}</span>
                      {entry.source === 'movement' && entry.newBalance !== undefined && (
                        <span>
                          {intl.formatMessage({ id: 'pages.history.colBalance' })}: {entry.newBalance.toFixed(2)} USDT
                        </span>
                      )}
                    </div>

                    {entry.txid && (
                      <div className="text-xs font-mono truncate" style={{ color: '#7C8AA0' }}>
                        {intl.formatMessage({ id: 'pages.history.colTxid' })}: {entry.txid}
                      </div>
                    )}
                    {entry.note && (
                      <div className="text-xs" style={{ color: '#7C8AA0' }}>{entry.note}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
