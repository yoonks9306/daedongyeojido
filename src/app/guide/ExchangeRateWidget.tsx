'use client';

import { useEffect, useMemo, useState } from 'react';
import styles from './guide.module.css';

type Currency = 'USD' | 'JPY' | 'CNY';

type RatesResponse = {
  base: 'KRW';
  date: string;
  rates: Record<Currency, number>;
};

const CURRENCIES: Currency[] = ['USD', 'JPY', 'CNY'];
const FLAG_BY_CURRENCY: Record<Currency, string> = {
  USD: '🇺🇸',
  JPY: '🇯🇵',
  CNY: '🇨🇳',
};

export default function ExchangeRateWidget() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('1');
  const [data, setData] = useState<RatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRates() {
      try {
        const response = await fetch('/api/v1/exchange-rates', { cache: 'no-store' });
        const payload = (await response.json()) as RatesResponse | { error: string };
        if (!response.ok || 'error' in payload) {
          throw new Error('Failed to load exchange rates.');
        }
        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load exchange rates.');
      } finally {
        setLoading(false);
      }
    }
    void loadRates();
  }, []);

  const converted = useMemo(() => {
    const numeric = Number.parseFloat(amount.replace(/,/g, ''));
    if (!data || !Number.isFinite(numeric)) return null;
    return numeric * data.rates[currency];
  }, [amount, currency, data]);

  if (loading) {
    return <div className={styles.rateWidget}>Loading today&apos;s rates...</div>;
  }

  if (error || !data) {
    return <div className={styles.rateWidgetError}>Rate feed unavailable right now.</div>;
  }

  return (
    <section className={styles.rateWidget}>
      <div className={styles.rateHeader}>
        <h3 className={styles.rateTitle}>Today&apos;s Exchange Snapshot</h3>
        <span className={styles.rateDate}>As of {data.date}</span>
      </div>

      <div className={styles.rateCards}>
        {CURRENCIES.map((code) => (
          <div key={code} className={styles.rateCard}>
            <p className={styles.rateCode}>
              <span className={styles.rateFlag}>{FLAG_BY_CURRENCY[code]}</span>
              <span>{code}</span>
            </p>
            <p className={styles.rateValue}>₩{data.rates[code].toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            <p className={styles.rateHint}>for 1 {code}</p>
          </div>
        ))}
      </div>

      <div className={styles.rateCalculator}>
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className={styles.rateInput}
        />
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as Currency)}
          className={styles.rateSelect}
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {FLAG_BY_CURRENCY[code]} {code}
            </option>
          ))}
        </select>
        <div className={styles.rateResult}>
          {converted === null ? 'Enter amount' : `≈ ₩${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
        </div>
      </div>
    </section>
  );
}
