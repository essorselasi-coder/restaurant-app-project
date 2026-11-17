export default function Receipt({ order, payment, onClose }) {
  const items = order?.items || [];
  const total =
    order?.total ??
    items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 1), 0);

  return (
    <div className="receipt">
      <h3>Receipt</h3>
      {order?.id && <p>Order #{order.id}</p>}

      <ul>
        {items.map((item, index) => (
          <li key={item.id ?? index}>
            {item.name} x{item.quantity || 1} - $
            {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
          </li>
        ))}
      </ul>

      <p>
        <strong>Total: ${Number(total).toFixed(2)}</strong>
      </p>
      {payment?.method && <p>Paid by: {payment.method}</p>}

      {onClose && <button onClick={onClose}>Close</button>}
    </div>
  );
}