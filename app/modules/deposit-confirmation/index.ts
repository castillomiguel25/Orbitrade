export type ConfirmInput =
  | { txid: string; amount: number }
  | { proof: string }; // imageBase64

export type ConfirmResult = {
  confirmed: boolean;
  amount?: number;
  txid?: string;
  error?: string;
};

export function isValidTxid(txid: string): boolean {
  return /^[a-fA-F0-9]{64}$/.test(txid.trim());
}

// Extracts the largest plausible USD/USDT amount from OCR text.
export function parseOcrAmount(text: string): number | null {
  const normalized = text.replace(/,(?=\d{3})/g, '');
  const matches = normalized.match(/\d+(?:\.\d+)?/g);
  if (!matches) return null;
  const amounts = matches.map(Number).filter(n => n > 0 && n <= 999_999);
  if (amounts.length === 0) return null;
  return Math.max(...amounts);
}

// Returns the first 64-char hex string found in OCR text (lowercased), or null.
export function extractTxidFromText(text: string): string | null {
  const match = text.match(/[a-fA-F0-9]{64}/);
  return match ? match[0].toLowerCase() : null;
}

export async function confirmViaTxid(amount: number, txid: string): Promise<ConfirmResult> {
  const res = await fetch('/api/validate-deposits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expectedAmount: amount, txid }),
  });
  const data = await res.json();
  if (res.ok && data.success) {
    return { confirmed: true, amount: data.amount, txid: data.transaction_id };
  }
  return { confirmed: false, error: data.error || 'Verification failed' };
}

export async function confirmViaProof(imageBase64: string): Promise<{ text: string; amount: number | null; txid: string | null }> {
  const res = await fetch('/api/upload-proof', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });
  const data = await res.json();
  const text: string = data.text || '';
  return {
    text,
    amount: parseOcrAmount(text),
    txid: extractTxidFromText(text),
  };
}

export async function confirmDeposit(input: ConfirmInput): Promise<ConfirmResult> {
  if ('txid' in input) {
    return confirmViaTxid(input.amount, input.txid);
  }
  const { text } = await confirmViaProof(input.proof);
  const amount = parseOcrAmount(text);
  return { confirmed: amount !== null, amount: amount ?? undefined };
}
