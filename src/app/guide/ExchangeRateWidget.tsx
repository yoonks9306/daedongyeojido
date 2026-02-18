'use client';

import { useEffect, useMemo, useState } from 'react';

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

const inputClass = 'border border-border rounded-sm bg-background text-foreground font-sans py-2 px-2.5';

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
    return <div className="border border-border rounded-sm bg-card dark:bg-surface p-4 mb-6">Loading today&apos;s rates...</div>;
  }

  if (error || !data) {
    return <div className="border border-primary/45 rounded-sm bg-primary/10 text-primary p-3 mb-6">Rate feed unavailable right now.</div>;
  }

  return (
    <section className="border border-border rounded-sm bg-card dark:bg-surface p-4 mb-6">
      <div className="flex justify-between items-center gap-2 mb-3">
        <h3 className="m-0 text-lg border-none">{`Today's Exchange Snapshot`}</h3>
        <span className="text-xs text-muted-foreground">As of {data.date}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 max-[860px]:grid-cols-1">
        {CURRENCIES.map((code) => (
          <div key={code} className="border border-border rounded-sm p-3 bg-background">
            <p className="m-0 mb-1 text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="text-base">{FLAG_BY_CURRENCY[code]}</span>
              <span>{code}</span>
            </p>
            <p className="m-0 font-semibold text-base">₩{data.rates[code].toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            <p className="mt-1 mb-0 text-xs text-muted-foreground">for 1 {code}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[120px_100px_1fr] gap-2 max-[860px]:grid-cols-1">
        <input
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className={inputClass}
        />
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as Currency)}
          className={inputClass}
        >
          {CURRENCIES.map((code) => (
            <option key={code} value={code}>
              {FLAG_BY_CURRENCY[code]} {code}
            </option>
          ))}
        </select>
        <div className="border border-border rounded-sm bg-background text-foreground py-2 px-2.5 flex items-center">
          {converted === null ? 'Enter amount' : `≈ ₩${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
        </div>
      </div>
    </section>
  );
}
