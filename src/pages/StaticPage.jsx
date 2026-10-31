import { useParams, Link } from 'react-router-dom';

const CONTENT = {
  about: {
    title: 'About Aurelia',
    body: `Aurelia is a premium watch brand focused on refined stainless steel, genuine leather, and carefully chosen automatic and quartz movements. We design for everyday presence — champagne gold accents, charcoal dials, and proportions that feel inevitable on the wrist.

Our collection spans chronographs, skeleton dials, minimalist pieces, and field-inspired tools. Each model is selected for finish quality, comfort, and longevity rather than seasonal trends.`,
  },
  contact: {
    title: 'Contact',
    body: `For order support, product questions, or partnership inquiries:

Email: support@aurelia.example
Phone: +92 300 000 0000
Hours: Monday–Saturday, 10:00–18:00 PKT

Please include your order number when writing about an existing purchase.`,
  },
  shipping: {
    title: 'Shipping & Delivery',
    body: `We ship nationwide. Standard delivery is typically 3–7 business days depending on your city.

Orders over PKR 15,000 qualify for free shipping. Otherwise a flat fee of PKR 250 applies at checkout (calculated on the server).

Cash on Delivery is available for most destinations. You will receive tracking details once the order is dispatched.`,
  },
  returns: {
    title: 'Returns & Refunds',
    body: `Unworn items in original packaging may be returned within 7 days of delivery, subject to inspection.

To start a return, contact support with your order number. Refunds for eligible returns are processed after we receive the product. Custom or final-sale items may be excluded.

Damaged or incorrect items should be reported within 48 hours of delivery.`,
  },
  privacy: {
    title: 'Privacy Policy',
    body: `We collect only the information needed to fulfill orders: name, email, phone, and shipping address. Payment details for online methods (if enabled) are processed by the payment provider — we do not store card numbers.

Order data is stored securely and is not sold to third parties. You may request access or deletion of your personal data by contacting support.`,
  },
  terms: {
    title: 'Terms & Conditions',
    body: `By placing an order you agree that product availability and pricing are confirmed at checkout by our servers. Images are representative; minor variations in finish can occur.

We reserve the right to cancel orders in cases of pricing errors, fraud suspicion, or stock issues, with full notification to the customer.

These terms are governed by the laws of Pakistan.`,
  },
};

export default function StaticPage() {
  const { page } = useParams();
  // Also support direct routes
  return null;
}

export function About() {
  return <Page {...CONTENT.about} />;
}
export function Contact() {
  return <Page {...CONTENT.contact} />;
}
export function Shipping() {
  return <Page {...CONTENT.shipping} />;
}
export function Returns() {
  return <Page {...CONTENT.returns} />;
}
export function Privacy() {
  return <Page {...CONTENT.privacy} />;
}
export function Terms() {
  return <Page {...CONTENT.terms} />;
}

function Page({ title, body }) {
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 720, padding: '3rem 0 5rem' }}>
        <p className="eyebrow">Aurelia</p>
        <h1 className="display h2 mb-4">{title}</h1>
        {body.split('\n\n').map((para, i) => (
          <p key={i} className="beige" style={{ marginBottom: '1.25rem', lineHeight: 1.8 }}>
            {para}
          </p>
        ))}
        <Link to="/shop" className="btn btn-outline mt-3">Shop Collection</Link>
      </div>
    </div>
  );
}
