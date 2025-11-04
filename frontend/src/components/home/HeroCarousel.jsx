import React, { useEffect, useState } from 'react';
import './HeroCarousel.css';

const slides = [
  {
    title: 'Your Community, Connected.',
    blurb: 'Find notices, jobs, skills and services in one place.',
    image: '/hero/hero-1.jpg'
  },
  {
    title: 'Built for Low Bandwidth.',
    blurb: 'Fast, cached access. Works offline on mobile.',
    image: '/hero/hero-2.jpg'
  },
  {
    title: 'Local First. Africa Wide.',
    blurb: 'Start in Acornhoek — scale to every town and village.',
    image: '/hero/hero-3.jpg'
  }
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const prev = () => setI((x) => (x - 1 + slides.length) % slides.length);
  const next = () => setI((x) => (x + 1) % slides.length);

  /** Smooth-scroll to the "What's happening" section (ContentGrid anchor) */
  const scrollToWhatsHappening = () => {
    const target = document.getElementById('whats-happening');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasImage = Boolean(slides[i].image);
  const style = hasImage ? { backgroundImage: `url(${slides[i].image})` } : {};

  return (
    <div className={`hero ${hasImage ? 'with-image' : 'with-gradient'}`} style={style}>
      <button className="hero-nav left" onClick={prev} aria-label="Previous">‹</button>

      <div className="hero-inner">
        <div className="hero-title">{slides[i].title}</div>
        <div className="hero-blurb">{slides[i].blurb}</div>
        <button className="btn hero-cta" onClick={scrollToWhatsHappening}>
          Explore Your Community
        </button>
      </div>

      <button className="hero-nav right" onClick={next} aria-label="Next">›</button>

      <div className="hero-dots" role="tablist" aria-label="Slides">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === i ? 'active' : ''}`}
            onClick={() => setI(idx)}
            role="tab"
            aria-selected={idx === i}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
