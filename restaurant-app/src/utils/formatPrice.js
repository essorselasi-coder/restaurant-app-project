const CURRENCY = '$'

export function formatPrice(amount) {
  return `${CURRENCY}${Number(amount).toFixed(2)}`
}