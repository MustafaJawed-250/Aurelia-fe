import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="display footer__logo">Aurelia</span>
          <p className="muted">
            Crafted timepieces for those who value restraint, precision, and lasting design.
          </p>
        </div>
        <div>
          <h4 className="footer__title">Shop</h4>
          <ul>
            <li><Link to="/shop">All Watches</Link></li>
            <li><Link to="/shop?category=chronograph">Chronograph</Link></li>
            <li><Link to="/shop?strap_type=genuine-leather">Leather</Link></li>
            <li><Link to="/shop?strap_type=stainless-steel-chain">Steel</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer__title">Help</h4>
          <ul>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/returns">Returns</Link></li>
            <li><Link to="/track">Track Order</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="footer__title">Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom container">
        <span className="muted">© {new Date().getFullYear()} Aurelia. All rights reserved.</span>
      </div>
    </footer>
  );
}
