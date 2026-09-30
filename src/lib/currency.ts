/**
 * Certificate prices are stored per currency (see certificate_prices). The learner's currency
 * is a best guess from their time zone and language, and they can always switch.
 */
export function guessCurrency(): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (zone === "Africa/Lagos") return "NGN";
    if (typeof navigator !== "undefined" && navigator.languages?.some((l) => /-NG$/i.test(l))) return "NGN";
  } catch {
    // fall through
  }
  return "USD";
}

const LOCALE: Record<string, string> = { NGN: "en-NG", USD: "en-US", GBP: "en-GB", EUR: "en-IE" };

/** ₦3,000 · $7 · $7.50 */
export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(LOCALE[currency] ?? undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}
