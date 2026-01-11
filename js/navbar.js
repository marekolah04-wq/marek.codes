let navbar = document.getElementById("navbar")

window.addEventListener("scroll", () => {
    if(window.scrollY > 50) {
        navbar.classList.add("scrolled")
    } else {
        navbar.classList.remove("scrolled")
    }
})

/* mobile */
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector(".nav-menu");
const body = document.body;

toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
  menu.classList.toggle("active");
  body.classList.toggle("menu-open");
});


document.querySelectorAll(".nav-menu a, #lang-switch").forEach(el => {
  el.addEventListener("click", () => {
    toggle.classList.remove("active");
    menu.classList.remove("active");
    body.classList.remove("menu-open");
  });
});


