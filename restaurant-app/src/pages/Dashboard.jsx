import { useOrders } from "../context/OrdersContext";
import { useTables } from "../context/TablesContext";
import { usePayments } from "../context/PaymentsContext";
import { formatPrice } from "../utils/formatPrice";

function isToday(dateValue) {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  if (isNaN(date)) return false;
  return date.toDateString() === new Date().toDateString();
}

const cardStyle = {
  background: "#fff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
};

const labelStyle = { margin: 0, opacity: 0.7, fontSize: "14px" };
const valueStyle = { margin: "8px 0 0", fontSize: "28px", fontWeight: "bold" };

function StatCard({ label, value }) {
  return (
    <div style={cardStyle}>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

function Dashboard() {
  const { orders } = useOrders();
  const { tables } = useTables();
  const { payments } = usePayments();

  const todaysPayments = payments.filter((p) =>
    isToday(p.paidAt || p.createdAt)
  );
  const todaysSales = todaysPayments.reduce((sum, p) => sum + (p.total || 0), 0);
  const allTimeSales = payments.reduce((sum, p) => sum + (p.total || 0), 0);

  const activeOrders = orders.filter((o) =>
    ["new", "pending", "preparing", "ready"].includes(o.status)
  ).length;
  const awaitingPayment = orders.filter(
    (o) => o.status === "served" && !o.paid
  ).length;

  const occupiedTables = tables.filter((t) => t.status === "occupied").length;
  const freeTables = tables.length - occupiedTables;

  const counts = {};
  orders
    .filter((o) => o.status !== "cancelled")
    .forEach((order) => {
      (order.items || []).forEach((item) => {
        counts[item.name] = (counts[item.name] || 0) + (item.quantity || 1);
      });
    });
  const topDishes = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <StatCard label="Today's sales" value={formatPrice(todaysSales)} />
        <StatCard label="Payments today" value={todaysPayments.length} />
        <StatCard label="Active orders" value={activeOrders} />
        <StatCard label="Awaiting payment" value={awaitingPayment} />
        <StatCard label="Free tables" value={freeTables} />
        <StatCard label="Occupied tables" value={occupiedTables} />
        <StatCard label="Total collected" value={formatPrice(allTimeSales)} />
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>Top selling dishes</h2>
        {topDishes.length === 0 && <p>No sales yet.</p>}
        {topDishes.map(([name, quantity], index) => (
          <div
            key={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderTop: index === 0 ? "none" : "1px solid #eee",
            }}
          >
            <span>
              {index + 1}. {name}
            </span>
            <strong>{quantity} sold</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;