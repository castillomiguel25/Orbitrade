import { useState, useEffect, useCallback } from 'react';
import { Referral } from '@/app/types/referral';
import { REFERRAL_LEVEL_1_PERCENT, REFERRAL_LEVEL_2_PERCENT, REFERRAL_LEVEL_3_PERCENT } from '@/app/constants/referral';
import { useProfileStore } from '@/app/store/useProfileStore';

export function useReferrals() {
  const { profile } = useProfileStore();
  const [copiado, setCopiado] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [glowEffect, setGlowEffect] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.referralcode) {
      setReferralLink(`${window.location.origin}/enlist?ref=${profile.referralcode}`);
    }
  }, [profile?.referralcode]);

  const fetchReferrals = useCallback(async (attempt = 0) => {
    setLoading(true);
    try {
      const res = await fetch('/api/referrals', {
        credentials: 'include',
        cache: 'no-store',
      });
      const data = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setReferrals(Array.isArray(data?.referrals) ? data.referrals : []);
      setError(null);
    } catch (e: any) {
      const message = e?.message || 'Error al cargar referidos';
      setError(message);

      if (attempt < 3) {
        const delayMs = 600 * (attempt + 1);
        window.setTimeout(() => {
          fetchReferrals(attempt + 1);
        }, delayMs);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReferrals(0);
    const onFocus = () => fetchReferrals(0);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchReferrals]);

  const totalGanado = referrals.reduce((acc, ref) => {
    const num = parseFloat(ref.totalGanado);
    if (isNaN(num)) return acc;
    if (ref.nivel === 1) return acc + num * 0.06;
    if (ref.nivel === 2) return acc + num * 0.03;
    return acc;
  }, 0);

  const copiarEnlace = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
    setGlowEffect(true);
    setTimeout(() => setGlowEffect(false), 1000);
  }, [referralLink]);

  const descargarQR = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'referral_qr.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }, []);

  return {
    copiado,
    referralLink,
    glowEffect,
    referrals,
    error,
    loading,
    refetch: () => fetchReferrals(0),
    copiarEnlace,
    descargarQR,
    totalGanado,
    porcentajeNivel1: REFERRAL_LEVEL_1_PERCENT,
    porcentajeNivel2: REFERRAL_LEVEL_2_PERCENT,
    porcentajeNivel3: REFERRAL_LEVEL_3_PERCENT,
  };
}
