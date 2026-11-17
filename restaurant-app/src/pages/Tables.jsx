import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTables } from '../context/TablesContext'
import { statuses } from '../data/tableData'
import '../styles/tables.css'
import '../styles/menu.css'

function Tables() {
  const { user } = useAuth()
  const { tables, setTableStatus, addTable, deleteTable } = useTables()

  const [number, setNumber] = useState('')
  const [seats, setSeats] = useState('')
  const [error, setError] = useState('')

  const isAdmin = user.role === 'admin'

  const sortedTables = [...tables].sort((a, b) => a.number - b.number)

  function countByStatus(status) {
    return tables.filter((table) => table.status === status).length
  }

  function handleAdd(e) {
    e.preventDefault()
    const tableNumber = Number(number)
    const tableSeats = Number(seats)

    if (!tableNumber || tableNumber <= 0 || !tableSeats || tableSeats <= 0) {
      setError('Enter a table number and seats greater than 0')
      return
    }

    if (tables.some((table) => table.number === tableNumber)) {
      setError(`Table ${tableNumber} already exists`)
      return
    }

    addTable(tableNumber, tableSeats)
    setNumber('')
    setSeats('')
    setError('')
  }

  function handleDelete(table) {
    if (table.status === 'occupied') {
      window.alert('This table is occupied. Free it before deleting.')
      return
    }
    if (window.confirm(`Delete Table ${table.number}?`)) {
      deleteTable(table.id)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Tables</h1>
      </div>

      <div className="table-summary">
        {statuses.map((s) => (
          <div key={s.value} className={`summary-box ${s.value}`}>
            <span className="summary-count">{countByStatus(s.value)}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {isAdmin && (
        <form className="add-table-form" onSubmit={handleAdd}>
          <input
            type="number"
            min="1"
            placeholder="Table number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          <input
            type="number"
            min="1"
            placeholder="Seats"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />
          <button type="submit" className="btn-primary">
            + Add table
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
      )}

      {sortedTables.length === 0 && (
        <p className="empty">No tables yet.</p>
      )}

      <div className="tables-grid">
        {sortedTables.map((table) => (
          <div key={table.id} className={`table-card ${table.status}`}>
            <h3>Table {table.number}</h3>
            <p className="table-seats">{table.seats} seats</p>

            <div className="status-buttons">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  className={table.status === s.value ? 'active' : ''}
                  onClick={() => setTableStatus(table.id, s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {isAdmin && (
              <button
                className="delete-table"
                onClick={() => handleDelete(table)}
              >
                Delete table
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tables