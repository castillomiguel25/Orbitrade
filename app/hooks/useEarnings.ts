import { useState, useEffect, useCallback } from 'react';
import { EarningsHistory, ActivePlan } from '@/app/types/earnings';
import { normalizeDate, formatRemainingTime } from '@/app/utils/earnings';
import { useUserStore } from '@/app/store/useUserStore';
import { useProfileStore } from '@/app/store/useProfileStore';

const INTERVALO_RECLAMO_MS = 24 * 60 * 60 * 1000;

export function useEarnings() {
  const { user } = useUserStore();
  const { profile, fetchProfile } = useProfileStore();

  const [tiempoRestante, setTiempoRestante] = useState<number>(0);
  const [puedeReclamar, setPuedeReclamar] = useState<boolean>(false);
  const [animacionActiva, setAnimacionActiva] = useState<boolean>(false);
  const [gananciaActual, setGananciaActual] = useState<string>('0.00');
  const [rotacionCristal, setRotacionCristal] = useState<number>(0);
  const [velocidadRotacion, setVelocidadRotacion] = useState<number>(1);
  const [acumuladorClicks, setAcumuladorClicks] = useState<number>(0);
  const [mostrarFelicitacion, setMostrarFelicitacion] = useState<boolean>(false);
  const [totalRetirado, setTotalRetirado] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [totalGanado, setTotalGanado] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [ultimoReclamo, setUltimoReclamo] = useState<string | null>(null);
  const [tiempoRestanteHumano, setTiempoRestanteHumano] = useState('');
  const [historialGanancias, setHistorialGanancias] = useState<EarningsHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const planActivo: ActivePlan = profile && profile.plan_1 ? {
    nombre: profile.plan_1,
    rendimiento: profile.dailyearnings ? `${profile.dailyearnings}%` : '2.5%',
    imagen: '/plans/nucleo-omega.gif',
  } : {
    nombre: 'Lunar Purr',
    rendimiento: '2.5%',
    imagen: '/plans/nucleo-omega.gif',
  };

  const claimEarnings = useCallback(async () => {
    if (!puedeReclamar || !user?.id) return;
    setLoading(true);
    try {
      const response = await fetch('/api/claim-earnings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await response.json();
      if (response.ok) {
        setGananciaActual(data.total_earned);
        setPuedeReclamar(false);
        setMostrarFelicitacion(true);
        setTimeout(() => setMostrarFelicitacion(false), 3000);
        
        // Actualizar el perfil después de reclamar exitosamente
        await fetchProfile();
        
        // Actualizar el historial de ganancias y totalGanado
        const historialResponse = await fetch('/api/historial-ganancias');
        if (historialResponse.ok) {
          const historialData = await historialResponse.json();
          setHistorialGanancias(historialData.historial);
          if (Array.isArray(historialData.historial)) {
            const suma = historialData.historial.reduce((acc: number, item: any) => acc + (parseFloat(item.ganancia) || 0), 0);
            setTotalGanado(suma);
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [puedeReclamar, user?.id, fetchProfile]);

  useEffect(() => {
    claimEarnings();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch('/api/historial-ganancias');
        if (!response.ok) throw new Error('Error al obtener el historial de ganancias');
        const data = await response.json();
        setHistorialGanancias(data.historial);
        if (Array.isArray(data.historial)) {
          const suma = data.historial.reduce((acc: number, item: any) => acc + (parseFloat(item.ganancia) || 0), 0);
          setTotalGanado(suma);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchHistorial();
  }, []);

  const fetchLastClaimed = useCallback(async (userId: string) => {
    try {
      const res = await fetch('/api/last-claimed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    async function cargarUltimoReclamo() {
      if (!user?.id) return;
      const result = await fetchLastClaimed(user.id);
      if (result) {
        setUltimoReclamo(result.last_claimed);
        setTiempoRestanteHumano(result.time_remaining_human);
      }
    }
    cargarUltimoReclamo();
  }, [fetchLastClaimed, user?.id]);

  useEffect(() => {
    if (!ultimoReclamo) return;
    const calcularTiempo = () => {
      const ahora = Date.now();
      const ultimoReclamoDate = normalizeDate(ultimoReclamo);
      const tiempoUltimoReclamo = ultimoReclamoDate ? ultimoReclamoDate.getTime() : NaN;
      if (isNaN(tiempoUltimoReclamo)) return;
      const tiempoPasado = ahora - tiempoUltimoReclamo;
      const tiempoRest = INTERVALO_RECLAMO_MS - tiempoPasado;
      if (tiempoRest <= 0) {
        setTiempoRestante(0);
        setPuedeReclamar(true);
      } else {
        setTiempoRestante(tiempoRest);
        setPuedeReclamar(false);
      }
    };
    calcularTiempo();
    const intervalo = setInterval(calcularTiempo, 1000);
    return () => clearInterval(intervalo);
  }, [ultimoReclamo]);

  const tiempo = formatRemainingTime(tiempoRestante);

  useEffect(() => {
    if (profile) {
      setTotalBalance(profile.trc20balance || 0);
      setTotalRetirado(profile.withdrawals_amount || 0);
    }
  }, [profile]);

  useEffect(() => {
    if (velocidadRotacion === 0) return;
    const animacion = setInterval(() => {
      setRotacionCristal(prev => (prev + velocidadRotacion) % 360);
    }, 50);
    return () => clearInterval(animacion);
  }, [velocidadRotacion]);

  return {
    tiempoRestante,
    puedeReclamar,
    animacionActiva,
    claimEarnings,
    rotacionCristal,
    velocidadRotacion,
    setVelocidadRotacion,
    acumuladorClicks,
    setAcumuladorClicks,
    mostrarFelicitacion,
    gananciaActual,
    tiempo,
    tiempoRestanteHumano,
    planActivo,
    historialGanancias,
    totalGanado,
    totalRetirado,
    totalBalance,
    loading,
    error,
  };
} 