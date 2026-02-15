import { NextResponse } from 'next/server';

const CURRENCIES = ['USD', 'JPY', 'CNY'] as const;

type Currency = (typeof CURRENCIES)[number];

export async function GET() {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=KRW&to=USD,JPY,CNY', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Rate provider responded with ${response.status}`);
    }

    const data = (await response.json()) as {
      date: string;
      rates: Record<Currency, number>;
    };

    const rates = CURRENCIES.reduce<Record<Currency, number>>((acc, currency) => {
      const foreignPerKrw = data.rates[currency];
      acc[currency] = Number((1 / foreignPerKrw).toFixed(4));
      return acc;
    }, {} as Record<Currency, number>);

    return NextResponse.json({
      base: 'KRW',
      date: data.date,
      rates,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
