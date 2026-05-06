function initAnimations() {
  // HERO INTRO
  const heroCopyElements = document.querySelectorAll(
    ".hero-copy h1, .hero-copy p, .hero-point, .hero-buttons"
  );

  const heroProjects = document.querySelectorAll(".hero-project");

  heroCopyElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("hero-visible");
    }, 120 + i * 120);
  });

  heroProjects.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("hero-visible");
    }, 450 + i * 140);
  });

  // SCROLL REVEAL
  const revealEls = document.querySelectorAll(".project-card, .service-card, .reveal");

  if (!revealEls.length) return;

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