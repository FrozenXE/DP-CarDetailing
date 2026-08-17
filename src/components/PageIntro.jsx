import { useEffect } from "react";

export default function PageIntro({ onComplete }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onComplete();
    }
  }, [onComplete]);

  return (
    <div
      className="page-intro"
      role="status"
      aria-label="Loading ApexStudio"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onComplete();
      }}
    >
      <div className="page-intro__glow" aria-hidden="true" />
      <div className="page-intro__content">
        <span className="page-intro__eyebrow">PREMIUM DETAILING STUDIO</span>
        <span className="page-intro__wordmark"><span>Apex</span><strong>Studio</strong></span>
        <span className="page-intro__line" aria-hidden="true" />
      </div>
    </div>
  );
}
