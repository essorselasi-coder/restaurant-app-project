import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { useTables } from '../context/TablesContext'
import { usePayments } from '../context/PaymentsContext'
import { getMethodLabel } from '../data/paymentMethods'
import { formatDateTime } from '../utils/formatDateTime'
import { formatPrice } from '../utils/formatPrice'
import PaymentModal from '../components/PaymentModals'
import Receipt from '../components/Receipt'
import '../styles/menu.css'
import '../styles/payments.css'

function mergeItems(orders) {
  const merged = {}

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const key = `${item.id}-${item.price}`
      if (merged[key]) {
        merged[key].qty += item.qty
      } else {
        merged[key] = { ...item }
      }
    })
  })

  return Object.values(merged)
}

function Payments() {
  const { user } = useAuth()
  const { orders, markOrdersPaid } = useOrders()
  const { setTableStatus } = useTables()
  const { payments, recordPayment } = usePayments()

  const [selectedBill, setSelectedBill] = useState(null)
  const [receipt, setReceipt] = useState(null)

  const isAdmin = user.role === 'admin'

  // Group all served, unpaid orders by table
  const servedUnpaid = orders.filter(
    (order) => order.status === 'served' && !order.paid
  )

  const grouped = {}
  servedUnpaid.forEach((order) => {
    if (!grouped[order.tableId]) {
      grouped[order.tableId] = {
        tableId: order.tableId,
        tableNumber: order.tableNumber,
        orders: [],
        subtotal: 0,
      }
    }
    grouped[order.tableId].orders.push(order)
    grouped[order.tableId].subtotal += order.total
  })

  const bills = Object.values(grouped)
    .map((bill) => ({
      ...bill,
      pendingCount: orders.filter(
        (order) =>
          order.tableId === bill.tableId &&
          ['new', 'preparing', 'ready'].includes(order.status)
      ).length,
    }))
    .sort((a, b) => a.tableNumber - b.tableNumber)

  const totalCollected = payments.reduce((sum, p) => sum + p.total, 0)

  function handleConfirm(paymentData) {
    const payment = recordPayment({
      ...paymentData,
      tableId: selectedBill.tableId,
      tableNumber: selectedBill.tableNumber,
      orderNumbers: selectedBill.orders.map((order) => order.number),
      items: mergeItems(selectedBill.orders),
      cashier: user.name,
    })

    markOrdersPaid(selectedBill.orders.map((order) => order.id))

    if (selectedBill.pendingCount === 0) {
      setTableStatus(selectedBill.tableId, 'free')
    }

    setSelectedBill(null)
    setReceipt(payment)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Payments</h1>
      </div>

      <h2 className="section-title">Awaiting payment</h2>

      {bills.length === 0 && (
        <p className="empty">No bills waiting. Served orders will show up here.</p>
      )}

      <div className="bills-grid">
        {bills.map((bill) => (
          <div key={bill.tableId} className="bill-card">
            <h3>Table {bill.tableNumber}</h3>
            <p className="bill-meta">
              Orders: {bill.orders.map((order) => `#${order.number}`).join(', ')}
            </p>
            <p className="bill-subtotal">{formatPrice(bill.subtotal)}</p>

            {bill.pendingCount > 0 && (
              <p className="bill-warning">
                {bill.pendingCount} order(s) still in progress. The table stays
                occupied after payment.
              </p>
            )}

            <button className="btn-primary" onClick={() => setSelectedBill(bill)}>
              Take payment
            </button>
          </div>
        ))}
      </div>

      <div className="history-header">
        <h2 className="section-title">Payment history</h2>
        {isAdmin && (
          <p className="total-collected">
            Total collected: <strong>{formatPrice(totalCollected)}</strong>
          </p>
        )}
      </div>

      {payments.length === 0 && <p className="empty">No payments yet.</p>}

      {payments.length > 0 && (
        <div className="history-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Table</th>
                <th>Time</th>
                <th>Method</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>#{payment.number}</td>
                  <td>{payment.tableNumber}</td>
                  <td>{formatDateTime(payment.paidAt)}</td>
                  <td>{getMethodLabel(payment.method)}</td>
                  <td>{formatPrice(payment.total)}</td>
                  <td>
                    <button
                      className="link-button"
                      onClick={() => setReceipt(payment)}
                    >
                      View receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBill && (
        <PaymentModal
          key={selectedBill.tableId}
          bill={selectedBill}
          isAdmin={isAdmin}
          onConfirm={handleConfirm}
          onCancel={() => setSelectedBill(null)}
        />
      )}

      {receipt && <Receipt payment={receipt} onClose={() => setReceipt(null)} />}
    </div>
  )
}

export default Payments