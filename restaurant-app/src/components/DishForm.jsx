import { useState } from 'react'
import { categories } from '../data/menuItems'

function DishForm({ dish, onSave, onCancel }) {
  const [name, setName] = useState(dish ? dish.name : '')
  const [category, setCategory] = useState(dish ? dish.category : categories[0])
  const [price, setPrice] = useState(dish ? dish.price : '')
  const [description, setDescription] = useState(dish ? dish.description : '')
  const [image, setImage] = useState(dish && dish.image ? dish.image : '')
  const [error, setError] = useState('')
function handleImage(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    setError('Please choose an image file')
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    setError('Image is too big. Choose one under 2MB')
    return
  }
  const reader = new FileReader()
  reader.onload = () => {
    setImage(reader.result)
    setError('')
  }
  reader.readAsDataURL(file)
}
  function handleSubmit(e) {
    e.preventDefault()

    if (!name.trim()) {
      setError('Please enter a dish name')
      return
    }
    if (!price || Number(price) <= 0) {
      setError('Please enter a price greater than 0')
      return
    }

    onSave({
      name: name.trim(),
      category,
      price: Number(price),
      description: description.trim(),
      available: dish ? dish.available : true,
      image,
    })
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <form
        className="modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>{dish ? 'Edit dish' : 'Add new dish'}</h2>

        {error && <p className="form-error">{error}</p>}

        <label htmlFor="dish-name">Name</label>
        <input
          id="dish-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="dish-category">Category</label>
        <select
          id="dish-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="dish-price">Price</label>
        <input
          id="dish-price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label htmlFor="dish-description">Description</label>
        <textarea
          id="dish-description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
<label htmlFor="dish-image">Photo</label>
<input
  id="dish-image"
  type="file"
  accept="image/*"
  onChange={handleImage}
/>
{image && (
  <img
    src={image}
    alt="Dish preview"
    style={{
      width: '100%',
      maxHeight: '160px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginTop: '8px',
    }}
  />
)}
        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {dish ? 'Save changes' : 'Add dish'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DishForm