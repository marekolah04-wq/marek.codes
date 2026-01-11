function initAnimations() {
  // HERO SECTION -------------------------------------------------
  const heroElements = document.querySelectorAll(".hero-content > *");

  heroElements.forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(30px)";

    setTimeout(() => {
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, i * 200);
  });

  /* projects */
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
