import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useMenu } from '../context/MenuContext'
import { categories } from '../data/menuItems'
import { formatPrice } from '../utils/formatPrice'
import DishForm from '../components/DishForm'
import '../styles/menu.css'

function Menu() {
  const { user } = useAuth()
  const { items , addItem, updateItem, deleteItem, toggleAvailable } = useMenu()

  const [filter, setFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [editingDish, setEditingDish] = useState(null)

  const isAdmin = user.role === 'admin'

  const visibleItems =
    filter === 'All' ? items : items.filter((item) => item.category === filter)

  function openAdd() {
    setEditingDish(null)
    setFormOpen(true)
  }

  function openEdit(dish) {
    setEditingDish(dish)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditingDish(null)
  }

  function handleSave(data) {
    if (editingDish) {
      updateItem(editingDish.id, data)
    } else {
      addItem(data)
    }
    closeForm()
  }

  function handleDelete(dish) {
    if (window.confirm(`Delete "${dish.name}" from the menu?`)) {
      deleteItem(dish.id)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Menu</h1>
        {isAdmin && (
          <button className="btn-primary" onClick={openAdd}>
            + Add dish
          </button>
        )}
      </div>

      <div className="filters">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            className={filter === c ? 'filter active' : 'filter'}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {visibleItems.length === 0 && (
        <p className="empty">No dishes in this category yet.</p>
      )}

      <div className="menu-grid">
        {visibleItems.map((dish) => (
          <div
            key={dish.id}
            className={dish.available ? 'dish-card' : 'dish-card unavailable'}
          >
            <div className="dish-top">
              <h3>{dish.name}</h3>
              <span className="dish-price">{formatPrice(dish.price)}</span>
            </div>

            <span className="dish-category">{dish.category}</span>
            <p className="dish-description">{dish.description}</p>

            {!dish.available && (
              <p className="sold-out">Currently unavailable</p>
            )}

            {isAdmin && (
              <div className="dish-actions">
                <button onClick={() => toggleAvailable(dish.id)}>
                  {dish.available ? 'Mark unavailable' : 'Mark available'}
                </button>
                <button onClick={() => openEdit(dish)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(dish)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {formOpen && (
        <DishForm
          key={editingDish ? editingDish.id : 'new'}
          dish={editingDish}
          onSave={handleSave}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}

export default Menu