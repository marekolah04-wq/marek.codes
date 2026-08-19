function initAnimations() {
  // SCROLL REVEAL
  const revealEls = document.querySelectorAll(".project-card, .service-card, .reveal");

  if (!revealEls.length) return;

  const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAnimations);
} else {
  initAnimations();
}