import { Link, useLocation, Navigate } from 'react-router-dom';

function formatPrice(n) {
  return `PKR ${Number(n).toLocaleString()}`;
}

export default function OrderConfirmation() {
  const { state } = useLocation();
  if (!state?.order) return <Navigate to="/" replace />;

  const { order, items } = state;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 560, padding: '4rem 0', textAlign: 'center' }}>
        <p className="eyebrow">Confirmed</p>
        <h1 className="display h2 mb-2">Thank you</h1>
        <p className="beige mb-4">
          Your order <strong className="gold">{order.order_number}</strong> has been received.
          {order.payment_method === 'cod' && ' You will pay on delivery.'}
        </p>
        <div
          style={{
            textAlign: 'left',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            padding: '1.5rem',
            borderRadius: 'var(--radius)',
            marginBottom: '2rem',
          }}
        >
          {(items || []).map((i) => (
            <div
              key={i.id || i.product_name}
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
            >
              <span>
                {i.product_name} × {i.quantity}
              </span>
              <span>{formatPrice(i.line_total)}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
            }}
          >
            <span>Total</span>
            <span className="gold">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
        <p className="muted mb-4" style={{ fontSize: '0.9rem' }}>
          A confirmation has been logged. Use your order number and email to track status.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={`/track?order=${order.order_number}`} className="btn btn-outline">
            Track Order
          </Link>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
