export function formatCurrency(value: number, currency = "Birr"): string {
  return `${new Intl.NumberFormat("en-US").format(value)} ${currency}`;
}
