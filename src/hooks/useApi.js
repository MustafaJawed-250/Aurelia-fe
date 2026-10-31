const API = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.details = data.details;
    throw err;
  }
  return data;
}

export function useApi() {
  return {
    getProducts: (params = {}) => {
      const qs = new URLSearchParams(
        Object.entries(params).filter(([, v]) => v != null && v !== '')
      ).toString();
      return request(`/products${qs ? `?${qs}` : ''}`);
    },
    getProduct: (slugOrId) => request(`/products/${slugOrId}`),
    createOrder: (body) =>
      request('/orders', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    trackOrder: (orderNumber, email) =>
      request(`/orders/${encodeURIComponent(orderNumber)}?email=${encodeURIComponent(email)}`),
  };
}
