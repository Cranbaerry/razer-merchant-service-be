export function formatCurrency(amount: number, currency = 'MYR') {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  });
}
