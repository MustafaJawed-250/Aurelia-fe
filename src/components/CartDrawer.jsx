import { Link } from 'react-router-dom';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

function formatPrice(n) {
  return `PKR ${Number(n).toLocaleString()}`;
}

export default function CartDrawer({ open, onClose }) {
  const { items, updateQty, removeItem, subtotal, count } = useCart();
  const shipping = subtotal >= 15000 ? 0 : subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;

  return (
    <>
      <div className={`cart-overlay ${open ? 'cart-overlay--open' : ''}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? 'cart-drawer--open' : ''}`} aria-hidden={!open}>
        <div className="cart-drawer__header">
          <h2 className="display h3">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {count === 0 ? (
          <div className="cart-drawer__empty">
            <p className="muted">Your cart is empty.</p>
            <button className="btn btn-outline mt-2" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div key={item.product_id} className="cart-item">
                  <div className="cart-item__img">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="cart-item__placeholder" />
                    )}
                  </div>
                  <div className="cart-item__info">
                    <Link to={`/product/${item.slug}`} onClick={onClose} className="cart-item__name">
                      {item.name}
                    </Link>
                    <p className="gold">{formatPrice(item.price)}</p>
                    <div className="cart-item__qty">
                      <button
                        onClick={() => updateQty(item.product_id, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.product_id, item.quantity + 1)}
                        aria-label="Increase"
                        disabled={item.quantity >= (item.stock_quantity || 99)}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        className="cart-item__remove"
                        onClick={() => removeItem(item.product_id)}
                        aria-label="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__row">
                <span className="muted">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="cart-drawer__row">
                <span className="muted">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="cart-drawer__row cart-drawer__total">
                <span>Total</span>
                <span className="gold">{formatPrice(total)}</span>
              </div>
              <Link to="/checkout" className="btn btn-primary cart-drawer__checkout" onClick={onClose}>
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
