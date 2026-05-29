import { describe, it, expect } from 'vitest';
import {
  isValidTxid,
  parseOcrAmount,
  extractTxidFromText,
} from '../app/modules/deposit-confirmation';

describe('isValidTxid', () => {
  it('accepts 64 lowercase hex chars', () => {
    expect(isValidTxid('a'.repeat(64))).toBe(true);
  });

  it('accepts mixed-case hex', () => {
    const txid = 'aBcDeF' + '0'.repeat(58);
    expect(isValidTxid(txid)).toBe(true);
  });

  it('rejects strings shorter than 64 chars', () => {
    expect(isValidTxid('abc123')).toBe(false);
  });

  it('rejects strings longer than 64 chars', () => {
    expect(isValidTxid('a'.repeat(65))).toBe(false);
  });

  it('rejects non-hex characters', () => {
    expect(isValidTxid('g'.repeat(64))).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidTxid('')).toBe(false);
  });

  it('trims leading/trailing whitespace before validating', () => {
    expect(isValidTxid(' ' + 'a'.repeat(64) + ' ')).toBe(true);
  });
});

describe('parseOcrAmount', () => {
  it('extracts a simple integer amount', () => {
    expect(parseOcrAmount('Total: 100 USDT')).toBe(100);
  });

  it('extracts a decimal amount', () => {
    expect(parseOcrAmount('Amount sent: 250.50 USDT')).toBe(250.5);
  });

  it('handles comma-as-thousands separator', () => {
    expect(parseOcrAmount('1,500 USDT sent')).toBe(1500);
  });

  it('picks the largest plausible amount when multiple numbers appear', () => {
    expect(parseOcrAmount('Fee: 1 USDT\nTotal: 500 USDT')).toBe(500);
  });

  it('ignores numbers above 999 999', () => {
    expect(parseOcrAmount('TX: 1234567 ref 200 USDT')).toBe(200);
  });

  it('returns null when no number is found', () => {
    expect(parseOcrAmount('no numbers here')).toBe(null);
  });

  it('returns null for zero-only text', () => {
    expect(parseOcrAmount('0 0.00')).toBe(null);
  });

  it('handles amounts with period-as-decimal', () => {
    expect(parseOcrAmount('Monto: 99.99')).toBe(99.99);
  });
});

describe('extractTxidFromText', () => {
  it('extracts a 64-char hex string embedded in text', () => {
    const txid = 'a1b2c3d4e5f6' + '0'.repeat(52);
    expect(extractTxidFromText(`TXID: ${txid} completed`)).toBe(txid.toLowerCase());
  });

  it('returns null when no valid txid is present', () => {
    expect(extractTxidFromText('Amount: 100 USDT, no txid here')).toBe(null);
  });

  it('returns null for a string with only 63 hex chars', () => {
    expect(extractTxidFromText('a'.repeat(63))).toBe(null);
  });

  it('is case-insensitive and normalises to lowercase', () => {
    const upper = 'ABCDEF' + '0'.repeat(58);
    expect(extractTxidFromText(upper)).toBe(upper.toLowerCase());
  });
});
