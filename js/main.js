//lang switch
const langBtn = document.getElementById("lang-switch")
let currentLang = localStorage.getItem("preferredLang") || "cz";

const updateLanguage = () => {
  document.querySelectorAll("[data-cz]").forEach(el => {
    const value = el.dataset[currentLang]
    if (value) el.textContent = value
  });

  document.querySelectorAll("[data-cz-placeholder]").forEach((el) => {
    const value = el.dataset[`${currentLang}Placeholder`];
    if (value) el.setAttribute("placeholder", value);
  });
  
  localStorage.setItem("preferredLang", currentLang)
};

updateLanguage();

if (langBtn) {
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "cz" ? "en" : "cz"
    updateLanguage()

    const toggle = document.querySelector(".nav-toggle")
    const menu = document.querySelector(".nav-menu")

    if (toggle && menu && menu.classList.contains("active")) {
      toggle.classList.remove("active")
      menu.classList.remove("active")
      document.body.classList.remove("menu-open")
    }
  });
}


//COOKIES ------------------------------------------------------------------
const trackEvent = (name, params = {}) => {
  if (typeof gtag !== "function") return;
  gtag("event", name, params);
};

const updateConsent = (status) => {
  if (typeof gtag !== "function") return;

  const value = status === "granted" ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value
  });
};

const getCopyWhere = (el) => {
  if (!el) return "unknown";
  if (el.closest("footer")) return "footer";
  if (el.closest(".thanks-page")) return "thanks";
  if (el.closest("#contact")) return "contact";
  if (el.closest(".project-detail")) return "project";
  return "unknown";
};

/* BANNER */
(function cookieConsentInit() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  const acceptBtn = banner.querySelector("[data-cookie-accept]");
  const rejectBtn = banner.querySelector("[data-cookie-reject]");
  const settingsBtn = document.querySelector("[data-cookie-settings]");

  const hide = () => { banner.style.display = "none"; };
  const show = () => { banner.style.display = ""; };

  const setChoice = (value) => {
    localStorage.setItem("cookieConsent_v1", value);
    updateConsent(value);
    hide();
    trackEvent("cookie_consent", { value });
  };

  if (acceptBtn) acceptBtn.addEventListener("click", () => setChoice("granted"));
  if (rejectBtn) rejectBtn.addEventListener("click", () => setChoice("denied"));

  // cookies footer
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      localStorage.removeItem("cookieConsent_v1");
      updateConsent("denied");
      show();
      trackEvent("cookie_settings_open");
    });
  }

  // initial state
  const stored = localStorage.getItem("cookieConsent_v1");
  if (stored === "granted" || stored === "denied") {
    updateConsent(stored);
    hide();
  } else {
    show();
  }
})();

//------------------------------------------------


//copy mail
(function copyEmailInit() {
  const nodes = document.querySelectorAll("[data-copy-email]");
  if (!nodes.length) return;

  const fallbackCopy = (text) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  };

  const flash = (el, czText, enText) => {
    const original = el.textContent;
    const isEn = (typeof currentLang !== "undefined" && currentLang === "en");
    el.textContent = isEn ? enText : czText;
    el.classList.add("copied");

    setTimeout(() => {
      el.textContent = original;
      el.classList.remove("copied");
    }, 1200);
  };

  nodes.forEach((el) => {
    el.addEventListener("click", async () => {
      const email = el.getAttribute("data-copy-email");
      if (!email) return;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          fallbackCopy(email);
        }
        flash(el, "Zkopírováno", "Copied");
        trackEvent("copy_email", { where: getCopyWhere(el) });
      } catch (err) {
        console.warn("Copy failed:", err);
        flash(el, email, email);
      }
    });
  });
})();




// PRICING 
document.addEventListener("DOMContentLoaded", () => {
  const packageInput = document.getElementById("selected-package");
  const messageField = document.querySelector('textarea[name="message"]');

  document.querySelectorAll("[data-package]").forEach(btn => {
    btn.addEventListener("click", () => {
      const chosen = btn.dataset.package;

      sessionStorage.setItem("selectedPackage", chosen);
      trackEvent("pricing_cta_click", { package: chosen });

      if (packageInput) packageInput.value = chosen;

      if (messageField && !/^(Balíček|Package):/m.test(messageField.value)) {
        const label = currentLang === "en" ? "Package" : "Balíček";
        messageField.value = `${label}: ${chosen}\n` + messageField.value;
      }
    });
  });
});


/* form */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form[name="contact"]');
  if (!form) return;

  form.addEventListener("submit", () => {
    sessionStorage.setItem("leadPending", "1");
  });
});


//thanks event

(function leadTrackingInit() {
  if (!window.location.pathname.toLowerCase().includes("thanks.html")) return;

  const pending = sessionStorage.getItem("leadPending");
  if (!pending) return;

  const selectedPackage = sessionStorage.getItem("selectedPackage") || "";
  trackEvent("generate_lead", { method: "netlify_form", package: selectedPackage });

  sessionStorage.removeItem("leadPending");
})();



/* CAROUSEL */
const projectsCarousel = document.querySelector("[data-projects-carousel]");

if (projectsCarousel) {
  const track = projectsCarousel.querySelector("[data-project-track]");
  const cards = Array.from(projectsCarousel.querySelectorAll(".project-card"));
  const prevButton = projectsCarousel.querySelector("[data-project-prev]");
  const nextButton = projectsCarousel.querySelector("[data-project-next]");
  const dots = Array.from(projectsCarousel.querySelectorAll("[data-project-dot]"));

  let activeIndex = 0;

  const updateActiveUI = () => {
    cards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });
  };

  const goToProject = (index) => {
    if (!track || !cards.length) return;

    if (index < 0) {
      activeIndex = cards.length - 1;
    } else if (index >= cards.length) {
      activeIndex = 0;
    } else {
      activeIndex = index;
    }

    cards[activeIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });

    updateActiveUI();
  };

  prevButton?.addEventListener("click", () => {
    goToProject(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    goToProject(activeIndex + 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToProject(index);
    });
  });

  track?.addEventListener("scroll", () => {
    const trackCenter = track.scrollLeft + track.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(trackCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    activeIndex = closestIndex;
    updateActiveUI();
  });

  updateActiveUI();
}