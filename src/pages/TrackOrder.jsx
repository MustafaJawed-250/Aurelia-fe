import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';

function formatPrice(n) {
  return `PKR ${Number(n).toLocaleString()}`;
}

export default function TrackOrder() {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(params.get('order') || '');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const api = useApi();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api.trackOrder(orderNumber.trim(), email.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 480, padding: '3rem 0' }}>
        <p className="eyebrow">Orders</p>
        <h1 className="display h2 mb-4">Track Order</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="on">Order number</label>
            <input id="on" required value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="WR-20241024-00001" />
          </div>
          <div className="form-group">
            <label htmlFor="em">Email used at checkout</label>
            <input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Looking up…' : 'Track'}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <p className="eyebrow">{result.order.order_status}</p>
            <h2 className="display h3">{result.order.order_number}</h2>
            <p className="muted mt-1">
              {new Date(result.order.created_at).toLocaleString()} · {result.order.city}
            </p>
            <p className="gold mt-2">{formatPrice(result.order.total_amount)}</p>
            <ul style={{ marginTop: '1rem' }}>
              {(result.items || []).map((i, idx) => (
                <li key={idx} className="muted" style={{ marginBottom: '0.35rem' }}>
                  {i.product_name} × {i.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
