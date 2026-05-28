import { useState, useEffect } from 'react';
import { Retiro, Withdrawal } from '@/app/types/withdrawal';
import { WITHDRAWAL_MIN_AMOUNT, WITHDRAWAL_FEE_PERCENT, WITHDRAWAL_NETWORK } from '@/app/constants/withdrawal';
import { formatWithdrawalDate, calculateFinalWithdrawalAmount } from '@/app/utils/withdrawal';
import { useIntl } from 'react-intl';
import { showToast } from '@/app/utils/toast';
import { useProfileStore } from '@/app/store/useProfileStore';

export function useWithdrawals() {
  const intl = useIntl();
  const { profile, fetchProfile } = useProfileStore();
  const [montoRetiro, setMontoRetiro] = useState('');
  const [claveRetiro, setClaveRetiro] = useState('');
  const [wallet, setWallet] = useState('');
  const [redSeleccionada, setRedSeleccionada] = useState(WITHDRAWAL_NETWORK);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalConfiguracion, setModalConfiguracion] = useState(false);
  const [nuevaClave, setNuevaClave] = useState('');
  const [claveActual, setClaveActual] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [historialRetiros, setHistorialRetiros] = useState<Retiro[]>([]);
  const [currentWeekCount, setCurrentWeekCount] = useState<number>(0);
  const [comisionRetiro, setComisionRetiro] = useState<number>(WITHDRAWAL_FEE_PERCENT);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const balanceDisponible = profile?.trc20balance || 0;
  const balanceDisponibleUSDT = profile?.trc20balance || 0;
  const flujoDisponible = profile?.flujo || 0;
  const SPECIAL_MIN_USERS = new Set([
    'mmilrichs@gmail.com',
  ]);
  const limiteMinimo = SPECIAL_MIN_USERS.has((profile?.email || '').toLowerCase()) ? 10 : WITHDRAWAL_MIN_AMOUNT;
  const withdrawal_key = profile?.withdrawalkey || '';

  const abrirModal = () => {
    setModalAbierto(true);
    setMontoRetiro('');
    setWallet('');
    setRedSeleccionada(WITHDRAWAL_NETWORK);
    setClaveRetiro('');
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const abrirModalConfiguracion = () => {
    setModalConfiguracion(true);
    setNuevaClave('');
    setConfirmarClave('');
  };

  const cerrarModalConfiguracion = () => {
    setModalConfiguracion(false);
  };

  const seleccionarRed = (red: string) => {
    setRedSeleccionada(red);
  };

  const calcularMontoFinal = () => {
    if (!montoRetiro) return '0.00';
    const monto = parseFloat(montoRetiro);
    return calculateFinalWithdrawalAmount(monto, comisionRetiro).toFixed(2);
  };

  const configurarClave = async () => {
    if (nuevaClave !== confirmarClave) {
      showToast.error(intl, 'notifications.error.passwordMismatch');
      return;
    }
    try {
      const res = await fetch('/api/withdrawalkey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevaClave }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast.error(intl, 'notifications.error.updatePassword');
        return;
      }
      showToast.success(intl, 'notifications.success.withdrawalKeyConfigured');
      cerrarModalConfiguracion();
    } catch (error) {
      console.error('Error al actualizar clave:', error);
      showToast.error(intl, 'notifications.error.savingPassword');
    }
  };

  const solicitarRetiro = async () => {
    const monto = parseFloat(montoRetiro);
    if (monto < limiteMinimo) {
      showToast.error(intl, 'notifications.error.minimumWithdrawal', { amount: limiteMinimo });
      return;
    }
    if (monto > balanceDisponibleUSDT) {
      showToast.error(intl, 'notifications.error.insufficientBalance');
      return;
    }
    if (!wallet) {
      showToast.error(intl, 'notifications.error.enterWalletAddress');
      return;
    }
    if (!claveRetiro) {
      showToast.error(intl, 'notifications.error.enterWithdrawalKey');
      return;
    }
    try {
      const response = await fetch('/api/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: monto,
          trc20address: wallet,
          network: redSeleccionada,
          claveRetiro: claveRetiro.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data?.error === 'withdrawals_weekend_blocked') {
          showToast.error(intl, 'notifications.error.withdrawalsWeekendBlocked');
          return;
        }
        showToast.error(intl, 'notifications.error.unexpectedWithdrawal');
        return;
      }
      showToast.success(intl, 'notifications.success.withdrawalRequested', { amount: data.finalamount });
      cerrarModal();

      // Actualizar perfil y lista
      await fetchProfile();
      await fetchWithdrawals();
    } catch (error: any) {
      showToast.error(intl, 'notifications.error.unexpectedWithdrawal');
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch('/api/withdrawals');
      const json = await res.json();
      if (!res.ok || !json.withdrawals) {
        console.error('Error al obtener los retiros:', json.error);
        return;
      }
      const datosFormateados = json.withdrawals.map((r: Withdrawal) => ({
        id: r.id,
        fecha: formatWithdrawalDate(r.timestamp),
        monto: Number(r.finalamount).toFixed(2),
        wallet: r.trc20address,
        red: (r as any).bank_details || WITHDRAWAL_NETWORK,
        estado: r.is_processed ? 'Completado' : 'Procesando',
      }));
      setHistorialRetiros(datosFormateados);

      // Actualizar datos de semana y comisión para el siguiente retiro
      if (typeof json.currentWeekCount === 'number') setCurrentWeekCount(json.currentWeekCount);
      if (typeof json.nextFeePercent === 'number') setComisionRetiro(json.nextFeePercent);
    } catch (error) {
      console.error('Error inesperado al obtener los retiros:', error);
    }
  };

  useEffect(() => {
    // Obtener datos iniciales para mostrar comisión dinámica
    fetchWithdrawals();
  }, []);

  return {
    withdrawal_key,
    montoRetiro,
    setMontoRetiro,
    claveRetiro,
    setClaveRetiro,
    wallet,
    setWallet,
    redSeleccionada,
    setRedSeleccionada,
    modalAbierto,
    setModalAbierto,
    modalConfiguracion,
    setModalConfiguracion,
    claveActual,
    setClaveActual,
    nuevaClave,
    setNuevaClave,
    confirmarClave,
    setConfirmarClave,
    balanceDisponible,
    balanceDisponibleUSDT,
    flujoDisponible,
    historialRetiros,
    abrirModal,
    cerrarModal,
    abrirModalConfiguracion,
    cerrarModalConfiguracion,
    seleccionarRed,
    calcularMontoFinal,
    configurarClave,
    solicitarRetiro,
    limiteMinimo,
    comisionRetiro,
    currentWeekCount,
  };
}
