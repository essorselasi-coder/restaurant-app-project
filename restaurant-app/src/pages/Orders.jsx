import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useOrders } from '../context/OrdersContext'
import { useTables } from '../context/TablesContext'
import { formatPrice } from '../utils/formatPrice'
import NewOrderForm from '../components/NewOderForm'
import '../styles/menu.css'
import '../styles/orders.css'

const filters = [
  { value: 'active', label: 'Active' },
  { value: 'served', label: 'Served' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'all', label: 'All' },
]

const statusLabels = {
  new: 'New',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  cancelled: 'Cancelled',
}

function getActions(order, role) {
  const actions = []
  const isKitchen = role === 'kitchen' || role === 'admin'
  const isFloor = role === 'waiter' || role === 'admin'

  if (isKitchen && order.status === 'new') {
    actions.push({ label: 'Start preparing', status: 'preparing' })
  }
  if (isKitchen && order.status === 'preparing') {
    actions.push({ label: 'Mark ready', status: 'ready' })
  }
  if (isFloor && order.status === 'ready') {
    actions.push({ label: 'Mark served', status: 'served' })
  }
  if (isFloor && order.status === 'new') {
    actions.push({ label: 'Cancel', status: 'cancelled', danger: true })
  }

  return actions
}

function Orders() {
  const { user } = useAuth()
  const { orders, placeOrder, updateOrderStatus } = useOrders()
  const { setTableStatus } = useTables()
 

  const [filter, setFilter] = useState('active')
  const [formOpen, setFormOpen] = useState(false)

  const canCreate = user.role === 'waiter' || user.role === 'admin'

  const visibleOrders = orders.filter((order) => {
    if (filter === 'all') return true
    if (filter === 'active') {
    return ['new', 'pending', 'preparing', 'ready'].includes(order.status)
    }
    return order.status === filter
  })

  function handleSave(data) {
    placeOrder({ ...data, waiter: user.name })
    setTableStatus(data.tableId, 'occupied')
    setFormOpen(false)
  }
    function handleStatusChange(order, newStatus) {
    updateOrderStatus(order.id, newStatus)

    if (newStatus === 'cancelled') {
      const tableStillBusy = orders.some(
        (o) =>
          o.id !== order.id &&
          o.tableId === order.tableId &&
          !o.paid &&
          o.status !== 'cancelled'
      )

      if (!tableStillBusy) {
        setTableStatus(order.tableId, 'free')
      }
    }
    }

  function formatTime(isoString) {
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        {canCreate && (
          <button className="btn-primary" onClick={() => setFormOpen(true)}>
            + New order
          </button>
        )}
      </div>

      <div className="filters">
        {filters.map((f) => (
          <button
            key={f.value}
            className={filter === f.value ? 'filter active' : 'filter'}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 && (
        <p className="empty">No orders here yet.</p>
      )}

      <div className="orders-grid">
        {visibleOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order.number}</h3>
                <p className="order-meta">
                  Table {order.tableNumber} · {order.waiter} ·{' '}
                  {formatTime(order.createdAt)}
                </p>
              </div>
              <span className={`status-badge ${order.status}`}>
                {statusLabels[order.status]}
              </span>
            </div>

            <ul className="order-items">
              {order.items.map((item) => (
                <li key={item.id}>
                  <span>
                    {item.qty} × {item.name}
                  </span>
                  <span>{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>

            {order.note && <p className="order-note">Note: {order.note}</p>}

            <p className="order-card-total">
              Total: {formatPrice(order.total)}
            </p>

            <div className="order-actions">
              {getActions(order, user.role).map((action) => (
                <button
                  key={action.status}
                  className={action.danger ? 'danger' : ''}
                  onClick={() => handleStatusChange(order, action.status)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {formOpen && (
        <NewOrderForm onSave={handleSave} onCancel={() => setFormOpen(false)} />
      )}
    </div>
  )
}

export default Orders