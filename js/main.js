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

/* copy mail */
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
      } catch (err) {
        console.warn("Copy failed:", err);
        flash(el, email, email); 
      }
    });
  });
})();


