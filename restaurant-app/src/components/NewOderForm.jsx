import { useState } from 'react'
import { useMenu } from '../context/MenuContext'
import { useTables } from '../context/TablesContext'
import { categories } from '../data/menuItems'
import { formatPrice } from '../utils/formatPrice'

function NewOrderForm({ onSave, onCancel }) {
  const { items } = useMenu()
  const { tables } = useTables()

  const [tableId, setTableId] = useState('')
  const [quantities, setQuantities] = useState({})
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const availableItems = items.filter((item) => item.available)
  const sortedTables = [...tables].sort((a, b) => a.number - b.number)

  function changeQty(id, change) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + change),
    }))
  }

  const selected = availableItems
    .filter((item) => (quantities[item.id] || 0) > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: quantities[item.id],
    }))

  const total = selected.reduce((sum, item) => sum + item.price * item.qty, 0)

  function handleSubmit(e) {
    e.preventDefault()

    if (!tableId) {
      setError('Please choose a table')
      return
    }
    if (selected.length === 0) {
      setError('Add at least one dish')
      return
    }

    const table = tables.find((t) => t.id === Number(tableId))

    onSave({
      tableId: table.id,
      tableNumber: table.number,
      items: selected,
      note: note.trim(),
      total,
    })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form
        className="modal modal-wide"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>New order</h2>

        {error && <p className="form-error">{error}</p>}

        <label htmlFor="order-table">Table</label>
        <select
          id="order-table"
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
        >
          <option value="">Choose a table...</option>
          {sortedTables.map((table) => (
            <option key={table.id} value={table.id}>
              Table {table.number} ({table.seats} seats, {table.status})
            </option>
          ))}
        </select>

        <div className="order-menu">
          {categories.map((category) => {
            const categoryItems = availableItems.filter(
              (item) => item.category === category
            )
            if (categoryItems.length === 0) return null

            return (
              <div key={category}>
                <h4 className="order-category">{category}</h4>
                {categoryItems.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <div>
                      <span>{item.name}</span>
                      <span className="order-item-price">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    <div className="qty-controls">
                      <button type="button" onClick={() => changeQty(item.id, -1)}>
                        -
                      </button>
                      <span>{quantities[item.id] || 0}</span>
                      <button type="button" onClick={() => changeQty(item.id, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <label htmlFor="order-note">Note for the kitchen (optional)</label>
        <textarea
          id="order-note"
          rows="2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <p className="order-total">Total: {formatPrice(total)}</p>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Place order
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewOrderForm