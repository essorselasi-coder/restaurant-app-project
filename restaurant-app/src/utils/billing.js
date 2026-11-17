export const SERVICE_CHARGE_RATE = 0.1

function round(amount) {
  return Math.round(amount * 100) / 100
}

export function calculateBill(subtotal, discountPercent = 0) {
  const discount = round(subtotal * (discountPercent / 100))
  const afterDiscount = subtotal - discount
  const serviceCharge = round(afterDiscount * SERVICE_CHARGE_RATE)
  const total = round(afterDiscount + serviceCharge)

  return { subtotal: round(subtotal), discount, serviceCharge, total }
}