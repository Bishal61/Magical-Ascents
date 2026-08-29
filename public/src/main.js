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
    { passive: true },
  );
  btt.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
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
const singleProgress = document.getElementById("hero-single-progress");
const activeNum = document.getElementById("hero-active-num");

function resetAndStartProgress(realIndex) {
  if (activeNum) {
    activeNum.textContent = `0${realIndex + 1}`;
  }
  if (!singleProgress) return;
  if (progressTween) progressTween.kill();

  gsap.killTweensOf(singleProgress);
  gsap.set(singleProgress, { width: "0%" });
  progressTween = gsap.to(singleProgress, {
    width: "100%",
    duration: 6.0,
    ease: "none",
  });
}

function animateSlideContent(slide) {
  if (!slide) return;

  // 1. Ken Burns Effect on Background
  const activeBg = slide.querySelector(".ken-burns-bg");
  if (activeBg) {
    gsap.killTweensOf(activeBg);
    gsap.set(activeBg, { scale: 1.02 });
    gsap.to(activeBg, {
      scale: 1.07,
      duration: 6.5,
      ease: "sine.out",
    });
  }

  // 2. Cinematic Text Reveal Animations (Horizontal Flow)
  const subtitle = slide.querySelector(".hero-subtitle");
  const titleLines = slide.querySelectorAll(".hero-title-line");
  const description = slide.querySelector(".hero-description");
  const buttons = slide.querySelector(".hero-buttons");

  // Reset animations
  gsap.killTweensOf([subtitle, titleLines, description, buttons]);
  gsap.set([subtitle, description, buttons], { opacity: 0, x: 85 });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (subtitle) {
    tl.to(subtitle, { opacity: 1, x: 0, duration: 0.8 });
  }
  tl.fromTo(
    titleLines,
    { opacity: 0, x: 100 },
    { opacity: 1, x: 0, duration: 1.0, stagger: 0.15, ease: "power3.out" },
    subtitle ? "-=0.65" : undefined,
  )
    .to(description, { opacity: 1, x: 0, duration: 0.8 }, "-=0.65")
    .to(buttons, { opacity: 1, x: 0, duration: 0.8 }, "-=0.55");
}

// Initialize Main Swiper
const heroSwiper = new Swiper(".hero-swiper", {
  speed: 900,
  parallax: false,
  loop: true,
  autoplay: { delay: 6000, disableOnInteraction: false },
  grabCursor: true,
  on: {
    init() {
      // Small timeout ensures Swiper has fully painted and slide-active classes are active
      setTimeout(() => {
        const activeSlide =
          this.el.querySelector(".swiper-slide-active") ||
          this.slides[this.activeIndex];
        animateSlideContent(activeSlide);
        resetAndStartProgress(this.realIndex);
      }, 50);
    },
    slideChangeTransitionStart() {
      const activeSlide =
        this.el.querySelector(".swiper-slide-active") ||
        this.slides[this.activeIndex];
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

// ── About (Static layout, animations removed) ────────────────────────────────────────────────────────

// ── Destinations (Static layout, animations removed) ─────────────────────

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

// ── Interactive Stat Counters ───────────────────────────────────────────

const counterElements = document.querySelectorAll(".stat-counter");
if (counterElements.length > 0) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-target")) || 0;
          const decimals = parseInt(el.getAttribute("data-decimals"), 10) || 0;
          const isComma = el.getAttribute("data-format") === "comma";
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOut * target;

            if (decimals > 0) {
              el.textContent = currentVal.toFixed(decimals);
            } else if (isComma) {
              el.textContent = Math.floor(currentVal).toLocaleString();
            } else {
              el.textContent = Math.floor(currentVal);
            }

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              if (decimals > 0) {
                el.textContent = target.toFixed(decimals);
              } else if (isComma) {
                el.textContent = target.toLocaleString();
              } else {
                el.textContent = target;
              }
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.25 },
  );

  counterElements.forEach((el) => counterObserver.observe(el));
}

// ── Google & TripAdvisor Testimonials Section ────────────────────────────

let testimonialSwiper = null;

function initTestimonialSwiper() {
  const swiperEl = document.querySelector(".testimonials-swiper");
  if (!swiperEl) return;

  if (testimonialSwiper) {
    testimonialSwiper.destroy(true, true);
  }

  testimonialSwiper = new Swiper(".testimonials-swiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    speed: 600,
    grabCursor: true,
    autoplay: {
      delay: 5500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: "#testimonials-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: "#testimonials-next",
      prevEl: "#testimonials-prev",
    },
    breakpoints: {
      640: {
        slidesPerView: 1.2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 28,
      },
    },
  });
}

// Filter Tabs Logic
const filterButtons = document.querySelectorAll(".review-filter-btn");
const reviewSlides = document.querySelectorAll(
  ".testimonials-swiper .swiper-slide",
);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    reviewSlides.forEach((slide) => {
      const platform = slide.getAttribute("data-platform");
      const hasPhoto = slide.getAttribute("data-has-photo") === "true";

      let show = false;
      if (filter === "all") {
        show = true;
      } else if (filter === "google" && platform === "google") {
        show = true;
      } else if (filter === "tripadvisor" && platform === "tripadvisor") {
        show = true;
      } else if (filter === "photos" && hasPhoto) {
        show = true;
      }

      if (show) {
        slide.style.display = "";
        slide.classList.remove("hidden");
      } else {
        slide.style.display = "none";
        slide.classList.add("hidden");
      }
    });

    if (testimonialSwiper) {
      testimonialSwiper.update();
      testimonialSwiper.slideTo(0);
    }
  });
});

// Helpful Thumbs Up Interaction
document.querySelectorAll(".helpful-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const countSpan = this.querySelector(".helpful-count");
    if (!countSpan) return;

    let currentCount = parseInt(countSpan.textContent, 10) || 0;
    const isVoted = this.classList.contains("voted");

    if (isVoted) {
      this.classList.remove("voted");
      countSpan.textContent = currentCount - 1;
    } else {
      this.classList.add("voted");
      countSpan.textContent = currentCount + 1;

      // Small bounce micro-animation
      gsap.fromTo(
        this,
        { scale: 0.9 },
        { scale: 1, duration: 0.3, ease: "back.out(2)" },
      );
    }
  });
});

// Photo Lightbox Modal
const lightboxModal = document.getElementById("review-lightbox-modal");
const lightboxImg = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox(imgSrc, caption) {
  if (!lightboxModal || !lightboxImg) return;
  lightboxImg.src = imgSrc;
  if (lightboxCaption) lightboxCaption.textContent = caption || "Trekker Photo";
  lightboxModal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove("active");
  document.body.style.overflow = "";
}

document.querySelectorAll(".review-photo-thumb").forEach((thumb) => {
  thumb.addEventListener("click", function () {
    const img = this.querySelector("img");
    const caption = this.getAttribute("data-caption") || img?.alt;
    if (img) openLightbox(img.src, caption);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}
if (lightboxModal) {
  lightboxModal.addEventListener("click", (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightboxModal?.classList.contains("active")) {
    closeLightbox();
  }
});

// Read More Toggle for Long Reviews (Enlarges card on demand)
document.querySelectorAll(".read-more-btn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const card = this.closest(".google-review-card, .tripadvisor-review-card");
    if (!card) return;

    const shortText = card.querySelector(".short-text");
    const fullText = card.querySelector(".full-text");

    if (shortText && fullText) {
      const isExpanded = !fullText.classList.contains("hidden");
      if (isExpanded) {
        fullText.classList.add("hidden");
        shortText.classList.remove("hidden");
        this.textContent = "Read more";
      } else {
        fullText.classList.remove("hidden");
        shortText.classList.add("hidden");
        this.textContent = "Show less";
      }

      if (testimonialSwiper) {
        testimonialSwiper.update();
      }
    }
  });
});

// ── 3-Card Packages Swiper ───────────────────────────────────────────
let featuredPackagesSwiper = null;

function initFeaturedPackagesSwiper() {
  const swiperEl = document.querySelector(".featured-packages-swiper");
  if (!swiperEl) return;

  if (featuredPackagesSwiper) {
    featuredPackagesSwiper.destroy(true, true);
  }

  featuredPackagesSwiper = new Swiper(".featured-packages-swiper", {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 3800,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".featured-packages-pagination",
      clickable: true,
    },
    spaceBetween: 20,
    speed: 600,
    grabCursor: true,
    navigation: {
      nextEl: "#packages-next-btn",
      prevEl: "#packages-prev-btn",
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 22,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
}

// Initialize on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initTestimonialSwiper();
    initFeaturedPackagesSwiper();
  });
} else {
  initTestimonialSwiper();
  initFeaturedPackagesSwiper();
}

// ── Search Modal Controller ──────────────────────────────────────────────
const searchBtn = document.getElementById("nav-search-btn");
const searchModal = document.getElementById("search-modal");
const searchCloseBtn = document.getElementById("search-modal-close");
const searchCloseBg = document.getElementById("search-modal-close-bg");
const searchInput = document.getElementById("search-modal-input");

function openSearch() {
  if (!searchModal) return;
  searchModal.classList.remove("hidden");
  requestAnimationFrame(() => {
    searchModal.classList.remove("opacity-0", "pointer-events-none");
    const content = searchModal.querySelector(".search-content");
    if (content) {
      content.classList.remove("scale-95", "opacity-0");
      content.classList.add("scale-100", "opacity-100");
    }
    if (searchInput) searchInput.focus();
  });
}

function closeSearch() {
  if (!searchModal) return;
  const content = searchModal.querySelector(".search-content");
  if (content) {
    content.classList.remove("scale-100", "opacity-100");
    content.classList.add("scale-95", "opacity-0");
  }
  searchModal.classList.add("opacity-0", "pointer-events-none");
  setTimeout(() => {
    searchModal.classList.add("hidden");
  }, 300);
}

searchBtn?.addEventListener("click", openSearch);
searchCloseBtn?.addEventListener("click", closeSearch);
searchCloseBg?.addEventListener("click", closeSearch);
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    searchModal &&
    !searchModal.classList.contains("hidden")
  ) {
    closeSearch();
  }
});
