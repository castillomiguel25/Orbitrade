'use client';

import React, { useEffect, useState } from 'react';
import '@/app/styles/dashboard.css';
import { useIntl } from 'react-intl';
import { PixelIcon } from '@/app/components/PixelIcon';

type Transaction = {
  id: string;
  date: string;
  name: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | string;
  transactionid: string;
};

export default function TransactionsPage() {
  const intl = useIntl();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/transactions', { method: 'GET' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al obtener transacciones');
        setTransactions(json.transactions || []);
      } catch (e) {
        // Podrías mostrar un toast si quieres, siguiendo patrón del proyecto
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const renderType = (t: string) => {
    if (t === 'deposit') return intl.formatMessage({ id: 'components.transactionsTable.type.deposit' });
    if (t === 'withdrawal') return intl.formatMessage({ id: 'components.transactionsTable.type.withdrawal' });
    return t;
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Fondo cósmico */}
      <div className="absolute inset-0 bg-black-900">
        <div className="absolute inset-0 bg-gradient-to-br from-black-900 via-cyan-900/10 to-black-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(6,182,212,0.08),transparent_50%)]"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-md md:max-w-2xl lg:max-w-6xl mx-auto px-4 py-8 pb-32 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <PixelIcon name="archive" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono tracking-wider">
              {intl.formatMessage({ id: 'pages.transactions.title' })}
            </h1>
          </div>
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 mb-3"></div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
          <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 min-h-[420px] flex flex-col">
            {/* Header tabla */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-cyan-400 text-lg">📋</span>
                <span className="text-cyan-300 font-mono text-lg tracking-wider">
                  {intl.formatMessage({ id: 'components.transactionsTable.archiveTitle' })}
                </span>
              </div>
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60"></div>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-cyan-300 font-mono text-sm">{intl.formatMessage({ id: 'loading.text' })}</div>
              </div>
            ) : transactions.length > 0 ? (
              <div className="flex-1 space-y-4 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-auto max-h-[320px]">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-slate-900/90">
                      <tr className="border-b border-slate-700/50">
                        <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.transactionsTable.date' })}</th>
                        <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.transactionsTable.name' })}</th>
                        <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.transactionsTable.amount' })}</th>
                        <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.transactionsTable.type' })}</th>
                        <th className="text-left py-2 px-2 text-slate-400 font-mono text-xs tracking-widest">{intl.formatMessage({ id: 'components.transactionsTable.txid' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.slice(0, 20).map((tx, index) => (
                        <tr key={tx.id} className={`border-b border-slate-700/30 hover:bg-slate-700/20 transition-all duration-300 ${index % 2 === 0 ? 'bg-slate-800/20' : ''}`}>
                          <td className="py-3 px-2 text-slate-300 font-mono text-xs">{(tx.date || '').split('T')[0]}</td>
                          <td className="py-3 px-2 text-slate-300 font-mono text-xs">{tx.name}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              <span className="text-blue-300 font-mono text-xs font-bold">{tx.amount}</span>
                              <span className="text-slate-400 font-mono text-xs">USDT</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full border font-mono text-xs bg-slate-500/20 text-slate-300 border-slate-500/40">
                              {renderType(tx.type)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-300 font-mono text-xs">{tx.transactionid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3 overflow-auto max-h-[320px]">
                  {transactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 font-mono text-xs">{(tx.date || '').split('T')[0]}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full border font-mono text-xs bg-slate-500/20 text-slate-300 border-slate-500/40">
                          {renderType(tx.type)}
                        </span>
                      </div>
                      <div className="text-slate-300 font-mono text-xs mb-1">{tx.name}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">{intl.formatMessage({ id: 'components.transactionsTable.amount' })}</div>
                          <div className="flex items-center gap-1">
                            <span className="text-blue-300 font-mono text-xs font-bold">{tx.amount}</span>
                            <span className="text-slate-400 font-mono text-xs">USDT</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 font-mono text-xs mb-1">{intl.formatMessage({ id: 'components.transactionsTable.txid' })}</div>
                          <div className="text-slate-300 font-mono text-[10px] break-all">{tx.transactionid}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <div className="text-center p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-green-400 font-mono text-xs tracking-widest mb-1">{intl.formatMessage({ id: 'components.transactionsTable.total' })}</div>
                    <div className="text-green-300 font-mono text-lg font-bold">{transactions.length}</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="text-blue-400 font-mono text-xs tracking-widest mb-1">{intl.formatMessage({ id: 'components.transactionsTable.type.deposit' })}</div>
                    <div className="text-blue-300 font-mono text-lg font-bold">{transactions.filter(t => t.type === 'deposit').length}</div>
                  </div>
                  <div className="text-center p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <div className="text-orange-400 font-mono text-xs tracking-widest mb-1">{intl.formatMessage({ id: 'components.transactionsTable.type.withdrawal' })}</div>
                    <div className="text-orange-300 font-mono text-lg font-bold">{transactions.filter(t => t.type === 'withdrawal').length}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center text-center py-8">
                <div className="relative inline-block mb-4 mx-auto">
                  <div className="absolute -inset-3 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-full blur-xl"></div>
                  <div className="relative w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center">
                    <PixelIcon name="archive" className="text-slate-400 w-8 h-8" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-slate-300 font-mono text-lg font-bold tracking-wider">{intl.formatMessage({ id: 'components.transactionsTable.noTransactionsFound' })}</h3>
                    <p className="text-slate-400 font-mono text-sm">{intl.formatMessage({ id: 'components.transactionsTable.archiveEmpty' })}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}