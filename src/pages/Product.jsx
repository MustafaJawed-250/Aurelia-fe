import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './Product.css';

function formatPrice(n) {
  return `PKR ${Number(n).toLocaleString()}`;
}

export default function Product() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const api = useApi();
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    setQty(1);
    setActiveImg(0);
    api
      .getProduct(slug)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page loading-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!data?.product) {
    return (
      <div className="page empty-state">
        <p>Product not found.</p>
        <Link to="/shop" className="btn btn-outline mt-2">Back to Shop</Link>
      </div>
    );
  }

  const { product, related } = data;
  const images = product.image_urls?.length ? product.image_urls : [null];
  const inStock = product.stock_quantity > 0;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="page product-page">
      <div className="container product-layout">
        <div className="product-gallery">
          <div className="product-gallery__main">
            {images[activeImg] ? (
              <img src={images[activeImg]} alt={product.name} />
            ) : (
              <div className="product-gallery__placeholder" />
            )}
          </div>
          {images.length > 1 && (
            <div className="product-gallery__thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={i === activeImg ? 'active' : ''}
                  onClick={() => setActiveImg(i)}
                >
                  {src ? <img src={src} alt="" /> : <div className="thumb-ph" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <p className="eyebrow">{product.category?.replace(/-/g, ' ')}</p>
          <h1 className="display h2">{product.name}</h1>
          <p className="product-info__price gold">
            {formatPrice(product.price)}
            {product.compare_at_price > product.price && (
              <span className="product-card__compare">{formatPrice(product.compare_at_price)}</span>
            )}
          </p>
          <p className="product-info__stock">
            {inStock ? (
              <span className="gold">In stock ({product.stock_quantity})</span>
            ) : (
              <span style={{ color: 'var(--danger)' }}>Out of stock</span>
            )}
          </p>
          <p className="product-info__desc beige">{product.description}</p>

          <div className="product-meta-list">
            <div><span className="muted">Strap</span> {product.strap_type?.replace(/-/g, ' ')}</div>
            <div><span className="muted">Material</span> {product.material || '—'}</div>
            <div><span className="muted">Color</span> {product.color || '—'}</div>
            <div><span className="muted">SKU</span> {product.sku || '—'}</div>
          </div>

          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="product-specs">
              <h3 className="eyebrow">Specifications</h3>
              <dl>
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k.replace(/_/g, ' ')}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {inStock && (
            <div className="product-actions">
              <div className="qty-selector">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock_quantity, q + 1))}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <button className="btn btn-primary" onClick={handleAdd}>
                {added ? 'Added' : 'Add to Cart'}
              </button>
              <Link to="/checkout" className="btn btn-outline" onClick={() => addItem(product, qty)}>
                Buy Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {related?.length > 0 && (
        <div className="container section">
          <h2 className="display h3 mb-4">You may also like</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
