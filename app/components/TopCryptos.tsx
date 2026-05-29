"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useIntl } from 'react-intl';

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export function TopCryptos() {
  const intl = useIntl();
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false'
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCryptos(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchCryptos();
    // Refresh every 60 seconds
    const interval = setInterval(fetchCryptos, 60000);
    return () => clearInterval(interval);
  }, []);

  if (error) return null;

  return (
    <section className="mt-12 mb-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-display font-bold tracking-wider">
          <span className="text-white">{intl.formatMessage({ id: 'components.topCryptos.market' })}</span>{' '}
          <span className="text-[#7C8AA0] italic">{intl.formatMessage({ id: 'components.topCryptos.data' })}</span>
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-cyber-cyan/50 to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? [...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-xl bg-white/5 animate-pulse border border-white/5"
              />
            ))
          : cryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="group relative p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 bg-[#0E1116]/60 border border-cyber-cyan/10 hover:border-cyber-cyan/30"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                     style={{
                       background: 'radial-gradient(circle at center, rgba(124, 138, 160, 0.05) 0%, transparent 70%)',
                       boxShadow: '0 0 20px rgba(124, 138, 160, 0.1)'
                     }}
                />

                <div className="relative flex items-center gap-3">
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white truncate pr-2">
                        {crypto.name}
                      </span>
                      <span className={`text-[10px] font-mono ${
                        crypto.price_change_percentage_24h >= 0 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {crypto.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(1)}%
                      </span>
                    </div>
                    <div className="font-mono text-sm text-[#7C8AA0] font-bold">
                      ${crypto.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}