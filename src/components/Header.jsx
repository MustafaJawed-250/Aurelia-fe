import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header({ onCartOpen }) {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner container-wide">
        <button
          className="header__menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <Link to="/" className="header__logo display">
          Aurelia
        </Link>

        <div className="header__actions">
          <Link to="/track" className="header__link">
            Track Order
          </Link>
          <button className="header__cart" onClick={onCartOpen} aria-label="Open cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && <span className="header__cart-count">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}