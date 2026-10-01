const root = document.documentElement;
const year = document.getElementById("year");
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.getElementById("primary-nav");

if (year) year.textContent = new Date().getFullYear();

/* ── Theme Toggle ── */
function setTheme(theme, save = true) {
  if (theme === "dark") root.dataset.theme = "dark";
  else root.removeAttribute("data-theme");

  const nextTheme = theme === "dark" ? "light" : "dark";
  if (themeButton) {
    themeButton.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeButton.title = `Switch to ${nextTheme} theme`;
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === "dark" ? "#18221c" : "#f6f5ef";

  if (save) {
    try { localStorage.setItem("portfolio-theme", theme); } catch (_) { }
  }
}

try {
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme, false);
} catch (_) { }

themeButton?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

/* ── Mobile Menu ── */
function closeMenu() {
  if (!menuButton || !nav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("is-open");
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  nav?.classList.toggle("is-open", !isOpen);
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

/* ── Scroll Progress Bar ── */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.prepend(progressBar);

function updateProgress() {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

/* ── Active Nav Highlighting ── */
const navLinks = document.querySelectorAll(".nav a, .wordmark");
const sections = document.querySelectorAll("section[id]");

function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  let currentId = "";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("is-active");
    const href = link.getAttribute("href");
    if (href === `#${currentId}`) {
      link.classList.add("is-active");
    }
  });
}

/* ── Parallax on Hero Visual ── */
const heroVisual = document.querySelector(".hero-visual");
const floatNotes = document.querySelectorAll(".float-note");
const profileCard = document.querySelector(".profile-card");

function updateParallax() {
  if (!heroVisual) return;
  const rect = heroVisual.getBoundingClientRect();
  const windowH = window.innerHeight;

  if (rect.bottom < 0 || rect.top > windowH) return;

  const progress = (windowH - rect.top) / (windowH + rect.height);
  const offset = (progress - 0.5) * 40;

  if (profileCard) {
    profileCard.style.transform = `rotate(2deg) translateY(${-offset * 0.5}px)`;
  }

  floatNotes.forEach((note, i) => {
    const dir = i % 2 === 0 ? 1 : -1;
    const noteRotate = note.classList.contains("note-code") ? -4 : 4;
    note.style.transform = `rotate(${noteRotate}deg) translateY(${-offset * dir * 0.7}px)`;
  });
}

/* ── Typing Effect ── */
function typeEffect(element, text, speed = 55) {
  return new Promise((resolve) => {
    element.textContent = "";
    element.style.borderRight = "2px solid var(--green)";
    let i = 0;
    const timer = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setTimeout(() => {
          element.style.borderRight = "none";
          resolve();
        }, 600);
      }
    }, speed);
  });
}

/* ── Animated Counters ── */
function animateCounter(element, target, duration = 1800) {
  const isDecimal = String(target).includes(".");
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;

    if (isDecimal) {
      element.textContent = current.toFixed(2);
    } else {
      element.textContent = Math.round(current);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ── Staggered Reveal with IntersectionObserver ── */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initReveals() {
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children if they have data-stagger
        const staggerChildren = entry.target.querySelectorAll("[data-stagger]");
        if (staggerChildren.length > 0) {
          staggerChildren.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
            child.classList.add("is-visible");
          });
        }
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealItems.forEach((item) => observer.observe(item));
}

/* ── Counter Observer ── */
function initCounters() {
  const counterElements = document.querySelectorAll("[data-counter]");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    return; // Keep static values
  }

  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        animateCounter(el, target);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach((el) => counterObserver.observe(el));
}

/* ── Hero Typing Animation on Load ── */
function initHeroTyping() {
  const heroSubtitle = document.querySelector(".hero-intro");
  if (!heroSubtitle || reducedMotion) return;

  const typingTarget = document.querySelector("[data-typing]");
  if (!typingTarget) return;

  const originalText = typingTarget.dataset.typing;
  typeEffect(typingTarget, originalText, 40);
}

/* ── Magnetic Button Effect ── */
function initMagneticButtons() {
  const buttons = document.querySelectorAll(".button-primary, .contact-link");

  buttons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ── Tilt Effect on Cards ── */
function initCardTilt() {
  const cards = document.querySelectorAll(".skill-card, .project-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (reducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-5px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ── Smooth Cursor Glow ── */
function initCursorGlow() {
  if (reducedMotion || window.innerWidth < 768) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

/* ── Scroll listener (throttled) ── */
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      updateActiveNav();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ── Init Everything ── */
document.addEventListener("DOMContentLoaded", () => {
  updateProgress();
  initReveals();
  initCounters();
  initMagneticButtons();
  initCardTilt();
  initCursorGlow();

  // Delay typing effect slightly for dramatic entrance
  setTimeout(initHeroTyping, 800);
});
