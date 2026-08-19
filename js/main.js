//lang switch
const langBtn = document.getElementById("lang-switch")
let currentLang = localStorage.getItem("preferredLang") || "cz";

const updateLanguage = () => {
  document.querySelectorAll("[data-cz]").forEach(el => {
    const value = el.dataset[currentLang]
    if (value) el.textContent = value
  });

  document.documentElement.lang =
  currentLang === "cz" ? "cs" : "en";

  document.querySelectorAll("[data-cz-placeholder]").forEach((el) => {
    const value = el.dataset[`${currentLang}Placeholder`];
    if (value) el.setAttribute("placeholder", value);
  });

  document.querySelectorAll("[data-cz-alt]").forEach((el) => {
  const value = el.dataset[`${currentLang}Alt`];

  if (value) {
    el.setAttribute("alt", value);
  }
  });

  document.querySelectorAll("[data-cz-aria]").forEach((el) => {
    const value = el.dataset[`${currentLang}Aria`];

    if (value) {
      el.setAttribute("aria-label", value);
    }
  });

  document.querySelectorAll("[data-cz-title]").forEach((el) => {
    const value = el.dataset[`${currentLang}Title`];

    if (value) {
      el.setAttribute("title", value);
      el.setAttribute("aria-label", value);
    }
  });

  if (langBtn) {
    langBtn.textContent = currentLang === "cz" ? "CZ / EN" : "EN / CZ";
    langBtn.setAttribute(
      "aria-label",
      currentLang === "cz" ? "Přepnout do angličtiny" : "Switch to Czech"
    );
  }

  localStorage.setItem("preferredLang", currentLang)

  document.dispatchEvent(new CustomEvent("languagechange"));
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


// COOKIES + BASIC CONSENT MODE --------------------------------------------

const GA_MEASUREMENT_ID = "G-PQL4NTPRN0";
const COOKIE_CONSENT_KEY = "cookieConsent_v1";

let analyticsLoaded = false;
let analyticsAllowed = false;

const getConsentState = (analyticsStatus) => ({
  analytics_storage: analyticsStatus,
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied"
});

const loadGoogleAnalytics = () => {
  if (analyticsLoaded) return;

  analyticsLoaded = true;
  analyticsAllowed = true;

  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  window.dataLayer = window.dataLayer || [];

  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag(
    "consent",
    "default",
    getConsentState("granted")
  );

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);

  const script = document.createElement("script");

  script.id = "google-analytics-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

  document.head.appendChild(script);
};

const grantAnalytics = () => {
  analyticsAllowed = true;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = false;

  if (!analyticsLoaded) {
    loadGoogleAnalytics();
    return;
  }

  window.gtag?.(
    "consent",
    "update",
    getConsentState("granted")
  );
};

const clearAnalyticsCookies = () => {
  const hostname = window.location.hostname;
  const rootDomain = hostname.split(".").slice(-2).join(".");

  const domains = [
    "",
    hostname,
    `.${hostname}`,
    `.${rootDomain}`
  ];

  document.cookie.split(";").forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();

    if (!/^(_ga|_gid|_gat)/.test(cookieName)) return;

    domains.forEach((domain) => {
      const domainAttribute = domain
        ? `; domain=${domain}`
        : "";

      document.cookie =
        `${cookieName}=; Max-Age=0; path=/${domainAttribute}; SameSite=Lax`;
    });
  });
};

const denyAnalytics = () => {
  if (typeof window.gtag === "function") {
    window.gtag(
      "consent",
      "update",
      getConsentState("denied")
    );
  }

  analyticsAllowed = false;
  window[`ga-disable-${GA_MEASUREMENT_ID}`] = true;

  clearAnalyticsCookies();
};

const trackEvent = (name, params = {}) => {
  if (!analyticsAllowed || typeof window.gtag !== "function") return;

  window.gtag("event", name, params);
};

const getCopyWhere = (element) => {
  if (!element) return "unknown";
  if (element.closest("footer")) return "footer";
  if (element.closest(".privacy-page")) return "privacy";
  if (element.closest("#contact")) return "contact";
  if (element.closest(".project-detail")) return "project";

  return "unknown";
};


/* COOKIE BANNER */

(function cookieConsentInit() {
  const storedChoice = localStorage.getItem(
    COOKIE_CONSENT_KEY
  );

  /*
   * Uložená volba se použije na každé stránce,
   * i když na ní není vložený cookie banner.
   */
  if (storedChoice === "granted") {
    grantAnalytics();
  } else if (storedChoice === "denied") {
    denyAnalytics();
  }

  const banner = document.getElementById("cookie-banner");

  if (!banner) return;

  const acceptButton = banner.querySelector(
    "[data-cookie-accept]"
  );

  const rejectButton = banner.querySelector(
    "[data-cookie-reject]"
  );

  const hideBanner = () => {
    banner.style.display = "none";
  };

  const showBanner = () => {
    banner.style.display = "";
  };

  const saveChoice = (choice) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);

    if (choice === "granted") {
      grantAnalytics();

      trackEvent("cookie_consent", {
        value: "granted"
      });
    } else {
      denyAnalytics();
    }

    hideBanner();
  };

  acceptButton?.addEventListener("click", () => {
    saveChoice("granted");
  });

  rejectButton?.addEventListener("click", () => {
    saveChoice("denied");
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const settingsButton = event.target.closest(
      "[data-cookie-settings]"
    );

    if (!settingsButton) return;

    showBanner();
    acceptButton?.focus();
  });

  if (
    storedChoice === "granted" ||
    storedChoice === "denied"
  ) {
    hideBanner();
  } else {
    showBanner();
  }
})();


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

const contactEmailButton = document.querySelector(
  "#contact .contact-email-button"
);

const contactEmailCard = contactEmailButton?.closest(".contact-method");

if (contactEmailButton && contactEmailCard) {
  contactEmailCard.addEventListener("click", (event) => {
    if (contactEmailButton.contains(event.target)) return;

    contactEmailButton.click();
  });
}




// PRICING
document.addEventListener("DOMContentLoaded", () => {
  const packageInput = document.getElementById("selected-package");
  const messageField = document.querySelector('textarea[name="message"]');

  document.querySelectorAll("[data-package]").forEach(btn => {
    btn.addEventListener("click", () => {
    const packageId = btn.dataset.package;

    const packageName = currentLang === "en"
      ? btn.dataset.packageEn
      : btn.dataset.packageCz;

    sessionStorage.setItem("selectedPackage", packageName);
    trackEvent("pricing_cta_click", { package: packageId });

    if (packageInput) packageInput.value = packageName;

    if (messageField && !/^(Balíček|Package):/m.test(messageField.value)) {
      const label = currentLang === "en" ? "Package" : "Balíček";
      messageField.value = `${label}: ${packageName}\n${messageField.value}`;
    }
  });
  });
});


/* CONTACT FORM */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form[name="contact"]');

  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const statusMessage = form.querySelector("[data-form-status]");

  if (!submitButton || !statusMessage) return;

  let submitState = "idle";
  let resetButtonTimer;

  const getLanguage = () => currentLang === "en" ? "en" : "cz";

  const getText = (element, suffix = "") => {
    const key = `${getLanguage()}${suffix}`;
    return element.dataset[key] || "";
  };

  const setButtonState = (state) => {
    submitState = state;

    submitButton.classList.toggle("is-sent", state === "sent");
    submitButton.disabled = state !== "idle";

    if (state === "loading") {
      submitButton.textContent = getText(submitButton, "Loading");
      return;
    }

    if (state === "sent") {
      submitButton.textContent = getText(submitButton, "Sent");
      return;
    }

    submitButton.textContent = getText(submitButton);
  };

  const showStatus = (type) => {
    const suffix = type === "success" ? "Success" : "Error";

    statusMessage.textContent = getText(statusMessage, suffix);
    statusMessage.classList.remove("is-success", "is-error");
    statusMessage.classList.add(
      type === "success" ? "is-success" : "is-error"
    );
    statusMessage.hidden = false;
  };

  const clearStatus = () => {
    statusMessage.hidden = true;
    statusMessage.textContent = "";
    statusMessage.classList.remove("is-success", "is-error");
  };

  const updateFormLanguage = () => {
    setButtonState(submitState);

    if (!statusMessage.hidden) {
      const type = statusMessage.classList.contains("is-error")
        ? "error"
        : "success";

      showStatus(type);
    }
  };

  document.addEventListener("languagechange", updateFormLanguage);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    clearTimeout(resetButtonTimer);
    clearStatus();
    setButtonState("loading");
    form.setAttribute("aria-busy", "true");

    const packageInput = form.querySelector('[name="package"]');
    const selectedPackage = packageInput?.value || "";

    try {
      const formData = new FormData(form);

      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(formData).toString()
      });

      if (!response.ok) {
        throw new Error(`Form submission failed: ${response.status}`);
      }

      form.reset();
      sessionStorage.removeItem("selectedPackage");

      setButtonState("sent");
      showStatus("success");

      trackEvent("generate_lead", {
        method: "netlify_form",
        package: selectedPackage
      });

      resetButtonTimer = setTimeout(() => {
        setButtonState("idle");
      }, 4000);

    } catch (error) {
      console.error("Contact form submission failed:", error);

      setButtonState("idle");
      showStatus("error");

    } finally {
      form.removeAttribute("aria-busy");
    }
  });
});




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
    const isActive = dotIndex === activeIndex;

    dot.classList.toggle("active", isActive);
    dot.setAttribute("aria-pressed", String(isActive));
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
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth",
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