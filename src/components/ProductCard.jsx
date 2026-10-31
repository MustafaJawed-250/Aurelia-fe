import { Link } from 'react-router-dom';

function formatPrice(n) {
  return `PKR ${Number(n).toLocaleString()}`;
}

export default function ProductCard({ product }) {
  const img = product.image_urls?.[0];
  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <div className="product-card__image">
        {img ? (
          <img src={img} alt={product.name} loading="lazy" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--bg-elevated)' }} />
        )}
        {product.is_featured && (
          <span className="badge" style={{ position: 'absolute', top: 12, left: 12 }}>
            Featured
          </span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__meta">
          {product.strap_type?.replace(/-/g, ' ')} · {product.category}
        </p>
        <p className="product-card__price">
          {formatPrice(product.price)}
          {product.compare_at_price > product.price && (
            <span className="product-card__compare">{formatPrice(product.compare_at_price)}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
