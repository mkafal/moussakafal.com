(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.getElementById("site-header");
  const progress = document.getElementById("page-progress");
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const heroMedia = document.getElementById("hero-media");
  let previousScroll = 0;
  let ticking = false;

  document.getElementById("year").textContent = new Date().getFullYear();

  function updateScrollUI() {
    const y = window.scrollY;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(y / distance, 1) : 0})`;
    header.classList.toggle("is-scrolled", y > 12);
    header.classList.toggle("is-hidden", y > previousScroll && y > 500 && !header.classList.contains("menu-open"));
    previousScroll = y;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  updateScrollUI();

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      menuButton.setAttribute("aria-expanded", "false");
    }));
  }

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });
    reveals.forEach((element) => observer.observe(element));
  }

  document.querySelectorAll(".work-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".work-item");
      const wasOpen = item.classList.contains("is-open");
      document.querySelectorAll(".work-item").forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".work-trigger").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  const copyEmail = document.getElementById("copy-email");
  if (copyEmail) {
    copyEmail.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyEmail.dataset.email);
        const original = copyEmail.innerHTML;
        copyEmail.innerHTML = "Email copied <span>✓</span>";
        window.setTimeout(() => { copyEmail.innerHTML = original; }, 1800);
      } catch (_) {
        window.location.href = `mailto:${copyEmail.dataset.email}`;
      }
    });
  }

  function trackEvent(name, params = {}) {
    if (window.__mkGaLoaded && typeof window.gtag === "function") window.gtag("event", name, params);
  }
  document.querySelectorAll('a[href*="calendly.com"]').forEach((link) => link.addEventListener("click", () => trackEvent("book_call_click", { location: link.closest(".hero") ? "hero" : link.closest("#contact") ? "contact" : "navigation" })));
  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => link.addEventListener("click", () => trackEvent("email_click")));
  document.querySelectorAll('a[href*="linkedin.com"]').forEach((link) => link.addEventListener("click", () => trackEvent("linkedin_click")));
  document.querySelectorAll('a[href*="wa.me"]').forEach((link) => link.addEventListener("click", () => trackEvent("whatsapp_click")));

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    const glow = document.getElementById("cursor-glow");
    let glowX = window.innerWidth / 2;
    let glowY = window.innerHeight / 2;
    let targetX = glowX;
    let targetY = glowY;
    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (heroMedia && window.scrollY < window.innerHeight) {
        const moveX = (event.clientX / window.innerWidth - 0.5) * -12;
        const moveY = (event.clientY / window.innerHeight - 0.5) * -8;
        heroMedia.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
      }
    }, { passive: true });

    function animateGlow() {
      glowX += (targetX - glowX) * 0.1;
      glowY += (targetY - glowY) * 0.1;
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.13;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      element.addEventListener("pointerleave", () => { element.style.transform = ""; });
    });

    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
        const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }

  function initializeNetwork() {
    const canvas = document.getElementById("hero-network");
    if (!canvas || reduceMotion) return;
    const context = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let points = [];
    let pointer = { x: -1000, y: -1000 };

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.max(28, Math.min(70, Math.floor(width / 24)));
      points = Array.from({ length: count }, () => ({
        x: width * (0.46 + Math.random() * 0.58),
        y: height * (0.18 + Math.random() * 0.7),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.2 + 0.35
      }));
    }

    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    });
    canvas.addEventListener("pointerleave", () => { pointer = { x: -1000, y: -1000 }; });
    window.addEventListener("resize", resize);
    resize();

    function frame() {
      context.clearRect(0, 0, width, height);
      points.forEach((point, index) => {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < width * 0.4 || point.x > width * 1.04) point.vx *= -1;
        if (point.y < height * 0.12 || point.y > height * 0.92) point.vy *= -1;
        const pointerDistance = Math.hypot(point.x - pointer.x, point.y - pointer.y);
        if (pointerDistance < 150) {
          point.x += (point.x - pointer.x) * 0.002;
          point.y += (point.y - pointer.y) * 0.002;
        }
        for (let next = index + 1; next < points.length; next += 1) {
          const other = points[next];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 112) {
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(108, 228, 255, ${0.12 * (1 - distance / 112)})`;
            context.lineWidth = 0.65;
            context.stroke();
          }
        }
        context.beginPath();
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fillStyle = index % 9 === 0 ? "rgba(229,167,92,.75)" : "rgba(130,235,255,.72)";
        context.fill();
      });
      requestAnimationFrame(frame);
    }
    frame();
  }
  initializeNetwork();

  const banner = document.getElementById("consent-banner");
  const accept = document.getElementById("consent-accept");
  const decline = document.getElementById("consent-decline");
  const settings = document.getElementById("cookie-settings");

  function loadAnalytics() {
    if (window.__mkGaLoaded) return;
    window.__mkGaLoaded = true;
    const ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + window.MK_GA_ID;
    document.head.appendChild(ga);
    window.gtag("js", new Date());
    window.gtag("config", window.MK_GA_ID, { anonymize_ip: true });
  }

  function setConsent(value) {
    try { localStorage.setItem("mk_consent", value); } catch (_) {}
    banner.classList.remove("is-visible");
    if (value === "granted") loadAnalytics();
  }

  try {
    if (!localStorage.getItem("mk_consent")) window.setTimeout(() => banner.classList.add("is-visible"), 1000);
  } catch (_) {
    window.setTimeout(() => banner.classList.add("is-visible"), 1000);
  }
  accept.addEventListener("click", () => setConsent("granted"));
  decline.addEventListener("click", () => setConsent("denied"));
  settings.addEventListener("click", () => {
    try { localStorage.removeItem("mk_consent"); } catch (_) {}
    banner.classList.add("is-visible");
  });
})();
