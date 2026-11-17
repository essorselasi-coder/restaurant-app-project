export const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'momo', label: 'Mobile money' },
]

export function getMethodLabel(value) {
  const found = paymentMethods.find((method) => method.value === value)
  return found ? found.label : value
}