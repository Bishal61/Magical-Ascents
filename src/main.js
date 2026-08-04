gsap.registerPlugin(ScrollTrigger);

// ── Header Sticky Nav ──────────────────────────────────────────────────────

const nav = document.getElementById("main-nav");
const topBar = document.getElementById("top-bar");
const promoBar = document.getElementById("promo-bar");
const stickyLogo = document.getElementById("sticky-logo");

function handleNavSticky() {
  const promoH = promoBar?.offsetHeight || 0;
  const topH = topBar?.offsetHeight || 0;
  const stickyBreakpoint = promoH + topH;
  const scrolled = window.scrollY > stickyBreakpoint;

  nav.classList.toggle("fixed", scrolled);
  nav.classList.toggle("top-0", scrolled);
  nav.classList.toggle("left-0", scrolled);
  nav.classList.toggle("right-0", scrolled);
  nav.classList.toggle("shadow-md", scrolled);
  nav.classList.toggle("z-50", scrolled);

  document.body.style.paddingTop = scrolled ? nav.offsetHeight + "px" : "0";

  if (stickyLogo) {
    stickyLogo.classList.toggle("opacity-100", scrolled);
    stickyLogo.classList.toggle("opacity-0", !scrolled);
    stickyLogo.classList.toggle("pointer-events-auto", scrolled);
    stickyLogo.classList.toggle("pointer-events-none", !scrolled);
  }
}

window.addEventListener("scroll", handleNavSticky, { passive: true });

// ── Promo Bar Dismiss ─────────────────────────────────────────────────────

document.getElementById("promo-close")?.addEventListener("click", () => {
  const bar = document.getElementById("promo-bar");
  bar.style.maxHeight = bar.offsetHeight + "px";
  requestAnimationFrame(() => {
    bar.style.transition = "max-height 0.4s ease, opacity 0.3s ease";
    bar.style.maxHeight = "0";
    bar.style.opacity = "0";
    setTimeout(() => bar.remove(), 450);
  });
});

// ── Mobile Menu Toggle (GSAP animation) ─────────────────────────────────

const menuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
let menuOpen = false;
let menuTween = null;

function animateMobileMenu(open) {
  if (menuTween) menuTween.kill();
  if (open) {
    mobileMenu.style.display = "block";
    menuTween = gsap.to(mobileMenu, {
      maxHeight: 400,
      opacity: 1,
      duration: 0.35,
      ease: "power3.out",
    });
  } else {
    menuTween = gsap.to(mobileMenu, {
      maxHeight: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        mobileMenu.style.display = "";
      },
    });
  }
}

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    menuOpen = !menuOpen;
    animateMobileMenu(menuOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuOpen = false;
      animateMobileMenu(false);
    });
  });
}

// ── Back to Top ──────────────────────────────────────────────────────────

const btt = document.getElementById("back-to-top");
if (btt) {
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        btt.classList.remove("opacity-0", "invisible");
        btt.classList.add("opacity-100", "visible");
      } else {
        btt.classList.add("opacity-0", "invisible");
        btt.classList.remove("opacity-100", "visible");
      }
    },
    { passive: true }
  );
  btt.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

// ── Active Nav Link Highlight ─────────────────────────────────────────────

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveLink() {
  let current = "home";
  sections.forEach((sec) => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 200) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.remove("text-primary");
    link.classList.add("text-slate-700");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("text-primary");
      link.classList.remove("text-slate-700");
    }
  });
}

window.addEventListener("scroll", updateActiveLink, { passive: true });
updateActiveLink();

// ── Swiper Parallax Hero ─────────────────────────────────────────────────

let progressTween = null;
const progressFills = document.querySelectorAll(".hero-progress-fill");

function resetAndStartProgress(realIndex) {
  if (!progressFills.length) return;
  if (progressTween) progressTween.kill();
  
  progressFills.forEach((fill, index) => {
    gsap.killTweensOf(fill);
    if (index < realIndex) {
      gsap.set(fill, { width: "100%" });
    } else if (index === realIndex) {
      gsap.set(fill, { width: "0%" });
      progressTween = gsap.to(fill, {
        width: "100%",
        duration: 6.0,
        ease: "none",
      });
    } else {
      gsap.set(fill, { width: "0%" });
    }
  });
}

function animateSlideContent(slide) {
  if (!slide) return;

  // 1. Ken Burns Effect on Background
  const activeBg = slide.querySelector(".ken-burns-bg");
  if (activeBg) {
    gsap.killTweensOf(activeBg);
    gsap.set(activeBg, { scale: 1.05 });
    gsap.to(activeBg, {
      scale: 1.18,
      duration: 6.5,
      ease: "sine.out",
    });
  }

  // 2. Cinematic Text Reveal Animations
  const badge = slide.querySelector(".hero-badge");
  const titleLines = slide.querySelectorAll(".hero-title-line");
  const description = slide.querySelector(".hero-description");
  const buttons = slide.querySelector(".hero-buttons");
  const stats = slide.querySelector(".hero-stats");

  // Reset animations
  gsap.killTweensOf([badge, titleLines, description, buttons, stats]);
  gsap.set([badge, description, buttons, stats], { opacity: 0, y: 30 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.to(badge, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo(titleLines,
      { yPercent: 100, y: 0 },
      { yPercent: 0, y: 0, duration: 0.8, stagger: 0.12, ease: "power4.out" },
      "-=0.4"
    )
    .to(description, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5")
    .to(buttons, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
    .to(stats, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");

  // 3. Stats Counter Animation
  const counters = slide.querySelectorAll(".stat-counter");
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute("data-target")) || 0;
    const countObj = { val: 0 };
    gsap.killTweensOf(countObj);
    gsap.to(countObj, {
      val: target,
      duration: 2.0,
      ease: "power2.out",
      onUpdate: () => {
        counter.textContent = Math.floor(countObj.val).toLocaleString();
      },
    });
  });
}

// Initialize Main Swiper
const heroSwiper = new Swiper(".hero-swiper", {
  speed: 900,
  parallax: true,
  loop: true,
  autoplay: { delay: 6000, disableOnInteraction: false },
  grabCursor: true,
  on: {
    init() {
      // Small timeout ensures Swiper has fully painted and slide-active classes are active
      setTimeout(() => {
        const activeSlide = this.el.querySelector(".swiper-slide-active") || this.slides[this.activeIndex];
        animateSlideContent(activeSlide);
        resetAndStartProgress(this.realIndex);
      }, 50);
    },
    slideChangeTransitionStart() {
      const activeSlide = this.el.querySelector(".swiper-slide-active") || this.slides[this.activeIndex];
      animateSlideContent(activeSlide);
      resetAndStartProgress(this.realIndex);
    },
  },
});

document.getElementById("hero-prev")?.addEventListener("click", () => {
  heroSwiper.slidePrev();
});
document.getElementById("hero-next")?.addEventListener("click", () => {
  heroSwiper.slideNext();
});

// Click handlers for progress tracks to jump between slides
document.querySelectorAll(".hero-progress-track").forEach((track, index) => {
  track.addEventListener("click", () => {
    heroSwiper.slideToLoop(index);
  });
});

// ── Section Headers ──────────────────────────────────────────────────────

document.querySelectorAll(".section-header").forEach((header) => {
  gsap.from(header, {
    scrollTrigger: { trigger: header, start: "top 80%" },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
  });
});

// ── About ────────────────────────────────────────────────────────────────

gsap.from(".about-text-content", {
  scrollTrigger: { trigger: ".about-section", start: "top 65%" },
  x: -60,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
});

gsap.from(".about-img-1", {
  scrollTrigger: { trigger: ".about-section", start: "top 65%" },
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  delay: 0.2,
});

gsap.from(".about-img-2", {
  scrollTrigger: { trigger: ".about-section", start: "top 65%" },
  x: 60,
  y: 40,
  opacity: 0,
  duration: 0.9,
  ease: "power3.out",
  delay: 0.4,
});

gsap.from(".about-stat", {
  scrollTrigger: { trigger: ".about-text-content", start: "top 80%" },
  y: 30,
  opacity: 0,
  duration: 0.5,
  stagger: 0.1,
  ease: "power3.out",
});

// ── Destinations ─────────────────────────────────────────────────────────

gsap.from(".destinations-grid", {
  scrollTrigger: { trigger: ".destinations-section", start: "top 70%" },
  x: 80,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
});

// ── Timeline (Why Us) ────────────────────────────────────────────────────

gsap.to(".timeline-progress", {
  height: "100%",
  ease: "none",
  scrollTrigger: {
    trigger: ".why-us-section",
    start: "top 60%",
    end: "bottom 60%",
    scrub: 1,
  },
});

gsap.from(".timeline-circle", {
  scale: 0,
  opacity: 0,
  duration: 0.5,
  stagger: 0.25,
  ease: "back.out(1.7)",
  scrollTrigger: {
    trigger: ".why-us-section",
    start: "top 60%",
    end: "bottom 60%",
    scrub: 1,
  },
});

document.querySelectorAll(".timeline-item").forEach((item, index) => {
  const card = item.querySelector(".timeline-card");
  const isEven = index % 2 === 0;
  gsap.from(card, {
    x: isEven ? 100 : -100,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: item,
      start: "top 85%",
      end: "top 40%",
      toggleActions: "play none none reverse",
    },
  });
});
