import React, { useEffect, useState } from 'react';
import './HeroCarousel.css';

const slides = [
  {
    title: 'Your Community, Connected.',
    blurb: 'Find notices, jobs, skills and services in one place.',
  },
  {
    title: 'Built for Low Bandwidth.',
    blurb: 'Fast, cached access. Works offline on mobile.',
  },
  {
    title: 'Local First. Africa Wide.',
    blurb: 'Start in Acornhoek — scale to every town and village.',
  }
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setI((p) => (p + 1) % slides.length);

  return (
    <div className="hero">
      <button className="hero-nav left" onClick={prev} aria-label="Previous">‹</button>
      <div className="hero-inner">
        <div className="hero-title">{slides[i].title}</div>
        <div className="hero-blurb">{slides[i].blurb}</div>
        <button className="btn hero-cta">Explore Your Community</button>
      </div>
      <button className="hero-nav right" onClick={next} aria-label="Next">›</button>
      <div className="hero-dots">
        {slides.map((_, idx) => (
          <span key={idx} className={`dot ${idx===i?'active':''}`} onClick={()=>setI(idx)} />
        ))}
      </div>
    </div>
  );
}
