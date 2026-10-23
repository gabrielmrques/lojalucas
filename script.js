/* =========================================================
   NORD COMPANY© — landing interactions
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

// ---------- Clock (São Paulo) ----------
const clock = $(".js-clock");
const tick = () => {
  clock.textContent = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo",
  }).format(new Date());
};
tick();
setInterval(tick, 15000);

// ---------- Fit giant wordmarks to the viewport width ----------
const fitText = () => {
  $$(".js-fit").forEach((el) => {
    el.style.fontSize = "";
    const base = parseFloat(getComputedStyle(el).fontSize);
    const avail = el.clientWidth;
    const range = document.createRange();
    range.selectNodeContents(el);
    const natural = range.getBoundingClientRect().width;
    if (natural > 0) el.style.fontSize = base * (avail / natural) * 0.985 + "px";
  });
  window.ScrollTrigger?.refresh();
};
document.fonts.ready.then(fitText);
let fitRaf;
window.addEventListener("resize", () => { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitText); });

// ---------- Fallback when GSAP is unavailable ----------
if (!window.gsap || !window.ScrollTrigger) {
  $(".loader")?.remove();
  $(".nav").classList.remove("is-hidden");
  document.documentElement.classList.add("no-js-anim");
  $$(".hero__char, .loader__word span, .reveal-line > span").forEach((el) => (el.style.transform = "none"));
  $(".hero__img-wrap").style.clipPath = "none";
  $(".hero__img").style.transform = "none";
  $$(".manifesto__text").forEach((el) => (el.style.opacity = 1));
} else {
  init();
}

function init() {
  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("is-loading");

  // ---------- Smooth scroll ----------
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);

    $$('a[href^="#"]').forEach((a) =>
      a.addEventListener("click", (e) => {
        const target = a.getAttribute("href");
        if (target.length < 2 && target !== "#") return;
        const el = target === "#top" ? 0 : $(target);
        if (el === null) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: 0, duration: 1.6 });
      })
    );
  }

  // ---------- Loader ----------
  const counter = { v: 0 };
  const countEl = $(".loader__count");
  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

  tl.to(".loader__word span", { y: 0, duration: 1.2, stagger: 0.06 }, 0.1)
    .to(counter, {
      v: 100, duration: 1.8, ease: "power2.inOut",
      onUpdate: () => (countEl.textContent = String(Math.round(counter.v)).padStart(3, "0")),
    }, 0)
    .to(".loader__bar i", { scaleX: 1, duration: 1.8, ease: "power2.inOut" }, 0)
    .to(".loader__word span", { y: "-105%", duration: 0.8, stagger: 0.04, ease: "expo.in" }, 1.9)
    .to(".loader", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, 2.35)
    .add(() => {
      $(".loader").remove();
      document.body.classList.remove("is-loading");
      lenis?.start();
    })
    // Hero intro
    .to(".hero__char", { y: 0, duration: 1.4, stagger: 0.07 }, 2.75)
    .to(".hero__img-wrap", { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "expo.inOut" }, 2.6)
    .to(".hero__img", { scale: 1, duration: 2.2 }, 2.7)
    .from(".hero__meta .reveal-line > span", { yPercent: 110, duration: 1, stagger: 0.08 }, 3)
    .from(".hero__meta", { borderTopColor: "rgba(255,255,255,0)", duration: 1 }, 3)
    .from(".hero__tag, .hero__lede, .hero__bottom .btn, .hero__scroll", { y: 24, opacity: 0, duration: 1.1, stagger: 0.08 }, 3.2)
    .add(() => $(".nav").classList.remove("is-hidden"), 3.1);

  if (reduceMotion) tl.progress(1);

  // ---------- Hero scroll parallax ----------
  gsap.to(".hero__media", {
    yPercent: -30, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero__title", {
    yPercent: 18, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  // ---------- Nav state ----------
  const nav = $(".nav");
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle("is-scrolled", y > 40);
      nav.classList.toggle("is-hidden", y > lastY && y > 400);
      lastY = y;
    },
  });

  // ---------- Manifesto: word-by-word ----------
  $$(".js-words").forEach((p) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.append(part);
            else {
              const s = document.createElement("span");
              s.className = "w";
              s.textContent = part;
              frag.append(s);
            }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          n.classList.add("w");
        }
      });
    };
    walk(p);
    gsap.to($$(".w", p), {
      opacity: 1, stagger: 0.1, ease: "none",
      scrollTrigger: { trigger: p, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  });

  // ---------- Counters ----------
  $$(".js-count").forEach((el) => {
    const to = +el.dataset.to;
    const o = { v: 0 };
    gsap.to(o, {
      v: to, duration: 2, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true },
      onUpdate: () => (el.textContent = Math.round(o.v)),
    });
  });

  // ---------- Section titles + lines ----------
  $$(".section-title").forEach((t) => {
    gsap.from(t, {
      yPercent: 40, opacity: 0, duration: 1.4, ease: "expo.out",
      scrollTrigger: { trigger: t, start: "top 88%" },
    });
  });
  $$(".look__title .reveal-line > span").forEach((s, i) => {
    gsap.from(s, {
      yPercent: 110, duration: 1.3, ease: "expo.out", delay: i * 0.08,
      scrollTrigger: { trigger: ".look__title", start: "top 80%" },
    });
  });

  // ---------- Drop: horizontal scroll ----------
  const mm = gsap.matchMedia();
  const track = $(".drop__track");
  const bar = $(".js-drop-bar");
  const idx = $(".js-drop-index");
  const total = $$(".product", track).length;

  const setProgress = (p) => {
    bar.style.transform = `scaleX(${0.16 + p * 0.84})`;
    idx.textContent = String(Math.min(total, Math.floor(p * total) + 1)).padStart(2, "0");
  };

  mm.add("(min-width: 901px)", () => {
    const distance = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -distance(), ease: "none",
      scrollTrigger: {
        trigger: ".drop", start: "top top", end: () => "+=" + distance(),
        pin: ".drop__pin", scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: (self) => setProgress(self.progress),
      },
    });
  });
  mm.add("(max-width: 900px)", () => {
    const onScroll = () => setProgress(track.scrollLeft / (track.scrollWidth - track.clientWidth || 1));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  });

  gsap.from(".product, .drop__end", {
    y: 60, opacity: 0, duration: 1.3, stagger: 0.07, ease: "expo.out",
    scrollTrigger: { trigger: ".drop", start: "top 70%" },
  });

  // ---------- Categories reveal ----------
  gsap.from(".cat", {
    clipPath: "inset(100% 0 0 0)", duration: 1.5, stagger: 0.1, ease: "expo.inOut",
    scrollTrigger: { trigger: ".cats__grid", start: "top 80%" },
  });

  // ---------- Lookbook parallax ----------
  $$(".look__item").forEach((item) => {
    const speed = parseFloat(item.dataset.speed) || 0;
    const img = $("img", item);
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
    });
    mm.add("(min-width: 721px)", () => {
      gsap.to(item, {
        yPercent: speed * -100, ease: "none",
        scrollTrigger: { trigger: ".look", start: "top bottom", end: "bottom top", scrub: true },
      });
    });
    gsap.from($(".look__img", item), {
      clipPath: "inset(0 0 100% 0)", duration: 1.6, ease: "expo.inOut",
      scrollTrigger: { trigger: item, start: "top 85%" },
    });
  });

  // ---------- Perks / quotes ----------
  gsap.from(".perk", {
    y: 40, opacity: 0, duration: 1.1, stagger: 0.08, ease: "expo.out",
    scrollTrigger: { trigger: ".perks", start: "top 85%" },
  });
  gsap.from(".quote", {
    y: 70, opacity: 0, duration: 1.3, stagger: 0.1, ease: "expo.out",
    scrollTrigger: { trigger: ".quotes", start: "top 85%" },
  });

  // ---------- CTA ----------
  gsap.from(".cta__word", {
    yPercent: 105, duration: 1.4, stagger: 0.1, ease: "expo.out",
    scrollTrigger: { trigger: ".cta__title", start: "top 85%" },
  });
  gsap.from(".footer__word", {
    yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out",
    scrollTrigger: { trigger: ".footer__word", start: "top 95%" },
  });

  // ---------- Cursor ----------
  if (!isTouch) {
    const cursor = $(".cursor");
    const label = $(".cursor__label");
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3" });
    window.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));

    $$("[data-cursor]").forEach((el) => {
      el.addEventListener("mouseenter", () => { label.textContent = el.dataset.cursor; cursor.classList.add("is-active"); });
      el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
    });

    // Magnetic buttons
    $$(".magnetic").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      const my = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener("mouseleave", () => { mx(0); my(0); });
    });

    // Subtle hero image tilt
    const media = $(".hero__media");
    const hero = $(".hero");
    hero.addEventListener("mousemove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      gsap.to(".hero__img-wrap", { rotateY: nx * 8, rotateX: ny * -8, x: nx * 20, y: ny * 20, duration: 1.2, ease: "power3.out", transformPerspective: 900 });
    });
    media.style.willChange = "transform";
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
}
