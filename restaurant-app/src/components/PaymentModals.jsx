import { useState } from 'react'
import { paymentMethods } from '../data/paymentMethods'
import { calculateBill, SERVICE_CHARGE_RATE } from '../utils/billing'
import { formatPrice } from '../utils/formatPrice'

function PaymentModal({ bill, isAdmin, onConfirm, onCancel }) {
  const [method, setMethod] = useState('cash')
  const [discountPercent, setDiscountPercent] = useState('')
  const [amountReceived, setAmountReceived] = useState('')
  const [error, setError] = useState('')

  const discountValue = Math.min(100, Math.max(0, Number(discountPercent) || 0))
  const appliedDiscount = isAdmin ? discountValue : 0
  const amounts = calculateBill(bill.subtotal, appliedDiscount)

  const received = Number(amountReceived) || 0
  const change = method === 'cash' ? Math.max(0, received - amounts.total) : 0

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (method === 'cash' && Math.round(received * 100) < Math.round(amounts.total * 100)) {
      setError('Amount received is less than the total')
      return
    }

    onConfirm({
      method,
      ...amounts,
      discountPercent: appliedDiscount,
      amountReceived: method === 'cash' ? received : amounts.total,
      change,
    })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form
        className="modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Take payment: Table {bill.tableNumber}</h2>

        {error && <p className="form-error">{error}</p>}

        <div className="bill-lines">
          <div className="bill-line">
            <span>Subtotal</span>
            <span>{formatPrice(amounts.subtotal)}</span>
          </div>
          {appliedDiscount > 0 && (
            <div className="bill-line">
              <span>Discount ({appliedDiscount}%)</span>
              <span>-{formatPrice(amounts.discount)}</span>
            </div>
          )}
          <div className="bill-line">
            <span>Service charge ({Math.round(SERVICE_CHARGE_RATE * 100)}%)</span>
            <span>{formatPrice(amounts.serviceCharge)}</span>
          </div>
          <div className="bill-line bill-total">
            <span>Total</span>
            <span>{formatPrice(amounts.total)}</span>
          </div>
        </div>

        {isAdmin && (
          <>
            <label htmlFor="discount">Discount % (admin only)</label>
            <input
              id="discount"
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
            />
          </>
        )}

        <label htmlFor="method">Payment method</label>
        <select
          id="method"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value)
            setError('')
          }}
        >
          {paymentMethods.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        {method === 'cash' && (
          <>
            <label htmlFor="received">Amount received</label>
            <input
              id="received"
              type="number"
              step="0.01"
              min="0"
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
            />
            <p className="change-line">Change: {formatPrice(change)}</p>
          </>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Confirm payment
          </button>
        </div>
      </form>
    </div>
  )
}

export default PaymentModal