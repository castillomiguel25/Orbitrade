import { useState, useMemo } from 'react';
import { Deposit } from '@/app/types/deposit';
import { useIntl } from 'react-intl';
import { showToast } from '@/app/utils/toast';
import { useProfileStore } from '@/app/store/useProfileStore';

export function useDeposits(user: { id: string; email: string } | null) {
  const intl = useIntl();
  const [rawDeposits, setRawDeposits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchProfile } = useProfileStore();
  const [txidExtractFailCount, setTxidExtractFailCount] = useState(0);
  const [showManualTxidInput, setShowManualTxidInput] = useState(false);

  // Fetch historial de depósitos
  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/deposits');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al obtener los depósitos');
      setRawDeposits(json.deposits || []);
    } catch (error) {
      showToast.error(intl, 'notifications.error.fetchDeposits');
    } finally {
      setLoading(false);
    }
  };

  // Validar depósito enviando TXID directo
  const validateAndInvest = async ({
    montoDeposito,
    txid,
    cerrarModal,
  }: {
    montoDeposito: string;
    txid: string;
    cerrarModal: () => void;
  }) => {
    try {
      const response = await fetch('/api/validate-deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expectedAmount: parseFloat(montoDeposito),
          txid, // ← corregido: enviar TXID de 64 hex
        }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        if (!user) {
          showToast.error(intl, 'notifications.error.notAuthenticated');
          return;
        }
        try {
          const transaccion = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: parseFloat(montoDeposito),
              user_id: user.id,
              email: user.email,
              type: 'deposit',
              name: `Depósito confirmado - ${data.transaction_id || new Date().toISOString()}`,
              transactionid: data.transaction_id || '',
            }),
          });
          const resTx = await transaccion.json();
          if (!transaccion.ok) {
            if (transaccion.status === 409) {
              showToast.error(intl, 'notifications.error.depositAlreadyUsed');
            } else {
              showToast.error(intl, 'notifications.error.savingTransaction');
            }
            return;
          }
        } catch {
          showToast.error(intl, 'notifications.error.savingTransaction');
        }

        cerrarModal();
        await fetchProfile();
      } else {
        showToast.error(intl, 'notifications.error.verifyingTransaction');
      }
    } catch {
      showToast.error(intl, 'notifications.error.verifyingTransaction');
    }
  };

  return {
    fetchDeposits,
    validateAndInvest,
    loading,
    showManualTxidInput,
    setShowManualTxidInput,
  };
}
