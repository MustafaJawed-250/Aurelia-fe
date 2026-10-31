import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useApi } from '../hooks/useApi';
import './Shop.css';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'chronograph', label: 'Chronograph' },
  { value: 'automatic', label: 'Automatic' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'skeleton', label: 'Skeleton' },
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
  { value: 'unisex', label: 'Unisex' },
];

const STRAPS = [
  { value: '', label: 'All straps' },
  { value: 'stainless-steel-chain', label: 'Steel chain' },
  { value: 'genuine-leather', label: 'Leather' },
  { value: 'mesh', label: 'Mesh' },
  { value: 'nato', label: 'NATO' },
  { value: 'bracelet', label: 'Bracelet' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const api = useApi();

  const filters = {
    category: params.get('category') || '',
    strap_type: params.get('strap_type') || '',
    search: params.get('search') || '',
    sort: params.get('sort') || 'newest',
    page: params.get('page') || '1',
  };

  useEffect(() => {
    setLoading(true);
    api
      .getProducts({
        category: filters.category || undefined,
        strap_type: filters.strap_type || undefined,
        search: filters.search || undefined,
        sort: filters.sort,
        page: filters.page,
        limit: 12,
      })
      .then(setData)
      .catch(() => setData({ products: [], pagination: {} }))
      .finally(() => setLoading(false));
  }, [params.toString()]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setParams(next);
  };

  return (
    <div className="page shop-page">
      <div className="container">
        <div className="shop-header">
          <div>
            <p className="eyebrow">Collection</p>
            <h1 className="display h2">Shop Watches</h1>
          </div>
          <div className="shop-controls">
            <input
              type="search"
              placeholder="Search..."
              defaultValue={filters.search}
              onKeyDown={(e) => {
                if (e.key === 'Enter') update('search', e.target.value);
              }}
              className="shop-search"
            />
            <select value={filters.sort} onChange={(e) => update('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Featured</option>
            </select>
          </div>
        </div>

        <div className="shop-filters">
          <div className="filter-group">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                className={`filter-chip ${filters.category === c.value ? 'active' : ''}`}
                onClick={() => update('category', c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="filter-group">
            {STRAPS.map((s) => (
              <button
                key={s.value}
                className={`filter-chip ${filters.strap_type === s.value ? 'active' : ''}`}
                onClick={() => update('strap_type', s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : data.products?.length ? (
          <>
            <div className="product-grid">
              {data.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {data.pagination?.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-outline"
                  disabled={Number(filters.page) <= 1}
                  onClick={() => update('page', String(Number(filters.page) - 1))}
                >
                  Previous
                </button>
                <span className="muted">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </span>
                <button
                  className="btn btn-outline"
                  disabled={Number(filters.page) >= data.pagination.totalPages}
                  onClick={() => update('page', String(Number(filters.page) + 1))}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <p>No watches match your filters.</p>
            <button className="btn btn-outline mt-2" onClick={() => setParams({})}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
