export function normalizeDate(fechaRaw: string): Date | null {
  if (!fechaRaw) return null;
  if (fechaRaw.includes('T') && fechaRaw.endsWith('Z')) {
    return new Date(fechaRaw);
  }
  const fechaISO = fechaRaw.replace(' ', 'T');
  return new Date(fechaISO);
}

export function formatRemainingTime(ms: number) {
  if (ms <= 0) return { horas: '00', minutos: '00', segundos: '00' };
  const segundosTotales = Math.floor(ms / 1000);
  const horas = Math.floor(segundosTotales / 3600);
  const minutos = Math.floor((segundosTotales % 3600) / 60);
  const segundos = segundosTotales % 60;
  return {
    horas: horas.toString().padStart(2, '0'),
    minutos: minutos.toString().padStart(2, '0'),
    segundos: segundos.toString().padStart(2, '0'),
  };
} 