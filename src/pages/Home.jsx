import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Watch3D from '../components/Watch3D';
import ProductCard from '../components/ProductCard';
import { useApi } from '../hooks/useApi';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [featured, setFeatured] = useState([]);
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const api = useApi();

  useEffect(() => {
    api.getProducts({ featured: 'true', limit: 4 }).then((d) => setFeatured(d.products || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const reduced = document.documentElement.classList.contains('reduced-motion');
    if (reduced || !heroRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => setScrollProgress(self.progress),
      });

      gsap.fromTo(
        textRef.current?.querySelectorAll('.hero-reveal') || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.3,
        }
      );

      gsap.utils.toArray('.section-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, heroRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" ref={heroRef}>
        <div className="hero__content" ref={textRef}>
          <p className="eyebrow hero-reveal">Est. Collection</p>
          <h1 className="display h1 hero-reveal">
            Time, refined
          </h1>
          <p className="hero__sub beige hero-reveal">
            Stainless steel, genuine leather, and automatic movements — crafted for presence, not spectacle.
          </p>
          <Link to="/shop" className="btn btn-primary hero-reveal">
            Explore Collection
          </Link>
        </div>
        <div className="hero__3d">
          <Watch3D scrollProgress={scrollProgress} />
        </div>
        <div className="hero__scroll-hint muted">Scroll</div>
      </section>

      {/* Featured */}
      <section className="section section-reveal">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Curated</p>
            <h2 className="display h2">Featured Pieces</h2>
          </div>
          <div className="product-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {featured.length === 0 && (
            <p className="text-center muted">Connect Supabase and seed products to see the collection.</p>
          )}
          <div className="text-center mt-4">
            <Link to="/shop" className="btn btn-outline">View All</Link>
          </div>
        </div>
      </section>

      {/* Strap types */}
      <section className="section strap-section section-reveal">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">By Material</p>
            <h2 className="display h2">Shop by Strap</h2>
          </div>
          <div className="strap-grid">
            {[
              { label: 'Steel Chain', q: 'stainless-steel-chain', desc: 'Precision links' },
              { label: 'Genuine Leather', q: 'genuine-leather', desc: 'Warm texture' },
              { label: 'Mesh Bracelet', q: 'mesh', desc: 'Lightweight shine' },
              { label: 'NATO & Field', q: 'nato', desc: 'Ready for motion' },
            ].map((s) => (
              <Link key={s.q} to={`/shop?strap_type=${s.q}`} className="strap-card">
                <span className="display h3">{s.label}</span>
                <span className="muted">{s.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="section story-section section-reveal">
        <div className="container story-grid">
          <div>
            <p className="eyebrow">The Brand</p>
            <h2 className="display h2 mb-2">Quiet confidence</h2>
            <p className="beige">
              Aurelia is built around a simple idea: a watch should feel inevitable on the wrist.
              We select movements, finishes, and proportions that age with dignity — champagne gold
              against charcoal, leather that softens, steel that holds its polish.
            </p>
            <Link to="/about" className="btn btn-ghost mt-3">Our Story</Link>
          </div>
          <div className="story-visual">
            <div className="story-visual__frame" />
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="section craft-section section-reveal">
        <div className="container">
          <div className="section-header">
            <p className="eyebrow">Craft</p>
            <h2 className="display h2">Details that endure</h2>
          </div>
          <div className="craft-grid">
            {[
              { t: 'Cases', d: 'Brushed and polished 316L steel with balanced lug design.' },
              { t: 'Movements', d: 'Reliable quartz and automatic calibers, tested for daily wear.' },
              { t: 'Straps', d: 'Genuine leather and solid-link bracelets, finished by hand.' },
              { t: 'Crystal', d: 'Sapphire or hardened mineral glass with anti-reflective coating where specified.' },
            ].map((c) => (
              <div key={c.t} className="craft-item">
                <h3 className="display h3 gold">{c.t}</h3>
                <p className="muted">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}