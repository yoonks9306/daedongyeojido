import { NextResponse } from 'next/server';

const CURRENCIES = ['USD', 'JPY', 'CNY'] as const;

type Currency = (typeof CURRENCIES)[number];

export async function GET() {
  try {
    // Use exchangerate-api.com free endpoint (no key required, updates daily)
    const response = await fetch(
      'https://open.er-api.com/v6/latest/KRW',
      { next: { revalidate: 3600 } }, // cache 1 hour
    );

    if (!response.ok) {
      throw new Error(`Rate provider responded with ${response.status}`);
    }

    const data = (await response.json()) as {
      time_last_update_utc: string;
      rates: Record<string, number>;
    };

    // data.rates gives "1 KRW = X foreign", we want "1 foreign = X KRW"
    const rates = CURRENCIES.reduce<Record<Currency, number>>((acc, currency) => {
      const foreignPerKrw = data.rates[currency];
      if (foreignPerKrw && foreignPerKrw > 0) {
        acc[currency] = Number((1 / foreignPerKrw).toFixed(2));
      }
      return acc;
    }, {} as Record<Currency, number>);

    const dateStr = new Date(data.time_last_update_utc).toISOString().slice(0, 10);

    return NextResponse.json({
      base: 'KRW',
      date: dateStr,
      rates,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
