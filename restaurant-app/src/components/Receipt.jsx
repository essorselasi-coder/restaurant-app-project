import { formatPrice } from "../utils/formatPrice";

export default function Receipt({ order, payment, onClose }) {
  const data = payment || order;
  if (!data) return null;

  const items = data.items || [];
  const when = data.paidAt || data.createdAt;
  const row = {
    display: "flex",
    justifyContent: "space-between",
    margin: "6px 0",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal receipt" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ textAlign: "center", marginBottom: 4 }}>Restaurant App</h2>
        <p style={{ textAlign: "center", marginTop: 0 }}>
          Receipt #{data.number}
        </p>
        <p>
          Table {data.tableNumber}
          {when ? " · " + new Date(when).toLocaleString() : ""}
        </p>
        {data.cashier && <p>Served by: {data.cashier}</p>}

        <hr />
        {items.map((item, index) => (
          <div key={item.id ?? index} style={row}>
            <span>
              {item.name} x{item.quantity || 1}
            </span>
            <span>
              {formatPrice((item.price || 0) * (item.quantity || 1))}
            </span>
          </div>
        ))}
        <hr />

        {data.discountPercent > 0 && (
          <div style={row}>
            <span>Discount</span>
            <span>{data.discountPercent}%</span>
          </div>
        )}
        <div style={{ ...row, fontWeight: "bold" }}>
          <span>Total</span>
          <span>{formatPrice(data.total || 0)}</span>
        </div>
        <div style={row}>
          <span>Paid by</span>
          <span style={{ textTransform: "capitalize" }}>{data.method}</span>
        </div>
        {data.method === "cash" && (
          <>
            <div style={row}>
              <span>Amount received</span>
              <span>{formatPrice(data.amountReceived || 0)}</span>
            </div>
            <div style={row}>
              <span>Change</span>
              <span>{formatPrice(data.change || 0)}</span>
            </div>
          </>
        )}

        <p style={{ textAlign: "center", marginTop: 16 }}>Thank you!</p>
        <div className="modal-actions">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}