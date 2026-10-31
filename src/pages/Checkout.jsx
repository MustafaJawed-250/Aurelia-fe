import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useApi } from '../hooks/useApi';
import './Checkout.css';

function formatPrice(n) {
  return `PKR ${Number(n).toLocaleString()}`;
}

function uuid() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const api = useApi();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    city: '',
    postal_code: '',
    country: 'Pakistan',
    payment_method: 'cod',
  });

  const shipping = subtotal >= 15000 ? 0 : subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.createOrder({
        ...form,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        idempotency_key: uuid(),
      });
      clearCart();
      navigate('/order-confirmation', {
        state: { order: result.order, items: result.items },
        replace: true,
      });
    } catch (err) {
      setError(err.message || 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="page empty-state">
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn btn-outline mt-2">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page checkout-page">
      <div className="container checkout-layout">
        <form className="checkout-form" onSubmit={onSubmit}>
          <h1 className="display h2 mb-4">Checkout</h1>
          {error && <div className="checkout-error">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customer_name">Full name</label>
              <input id="customer_name" name="customer_name" required value={form.customer_name} onChange={onChange} />
            </div>
            <div className="form-group">
              <label htmlFor="customer_email">Email</label>
              <input id="customer_email" name="customer_email" type="email" required value={form.customer_email} onChange={onChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="customer_phone">Phone</label>
            <input id="customer_phone" name="customer_phone" value={form.customer_phone} onChange={onChange} />
          </div>
          <div className="form-group">
            <label htmlFor="shipping_address">Shipping address</label>
            <textarea id="shipping_address" name="shipping_address" rows={3} required value={form.shipping_address} onChange={onChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input id="city" name="city" required value={form.city} onChange={onChange} />
            </div>
            <div className="form-group">
              <label htmlFor="postal_code">Postal code</label>
              <input id="postal_code" name="postal_code" value={form.postal_code} onChange={onChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input id="country" name="country" required value={form.country} onChange={onChange} />
          </div>

          <fieldset className="payment-methods">
            <legend className="eyebrow">Payment</legend>
            <label className="payment-option">
              <input
                type="radio"
                name="payment_method"
                value="cod"
                checked={form.payment_method === 'cod'}
                onChange={onChange}
              />
              <span>Cash on Delivery</span>
            </label>
          </fieldset>

          <button type="submit" className="btn btn-primary checkout-submit" disabled={loading}>
            {loading ? 'Placing order…' : `Place Order — ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2 className="display h3 mb-2">Order summary</h2>
          {items.map((i) => (
            <div key={i.product_id} className="summary-line">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>{formatPrice(i.price * i.quantity)}</span>
            </div>
          ))}
          <div className="summary-line muted">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-line muted">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          <div className="summary-line summary-total">
            <span>Total</span>
            <span className="gold">{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
