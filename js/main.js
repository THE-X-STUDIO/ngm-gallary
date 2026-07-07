/* ===================== LENIS SMOOTH SCROLL ===================== */

let lenis = null;

try {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  function raf(time) {
    if (lenis) lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
} catch (e) {
  console.warn('Lenis failed to initialize, using native scroll:', e);
}

/* ===================== GSAP SETUP ===================== */

gsap.registerPlugin(ScrollTrigger);

gsap.ticker.lagSmoothing(0);

/* ===================== CUSTOM CURSOR ===================== */

const cursor = document.querySelector('.cursor');

if (cursor) {
  document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.15,
      ease: 'power2.out',
    });
  });

  document.querySelectorAll('a, .btn, .artist-list-item, .masonry-item').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

/* ===================== NAV SCROLL EFFECT ===================== */

window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }
});

/* ===================== PAGE TRANSITIONS ===================== */

const transition = document.querySelector('.page-transition');

function animatePageOut(href) {
  if (!transition) {
    window.location.href = href;
    return;
  }

  sessionStorage.setItem('pageTransition', 'true');

  const tl = gsap.timeline({
    onComplete: () => {
      window.location.href = href;
    },
  });

  tl.set(transition, { pointerEvents: 'all' })
    .to(transition, {
      scaleY: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      transformOrigin: 'bottom',
    });
}

function animatePageIn() {
  if (!transition) return;

  const shouldAnimateIn = sessionStorage.getItem('pageTransition') === 'true';
  sessionStorage.removeItem('pageTransition');

  if (!shouldAnimateIn && !document.documentElement.classList.contains('pt-active')) {
    gsap.set(transition, { scaleY: 0, pointerEvents: 'none' });
    return;
  }

  gsap.set(transition, { scaleY: 1, pointerEvents: 'all', transformOrigin: 'top' });

  gsap.to(transition, {
    scaleY: 0,
    duration: 0.6,
    ease: 'power2.inOut',
    transformOrigin: 'top',
    onComplete: () => {
      gsap.set(transition, { pointerEvents: 'none' });
      document.documentElement.classList.remove('pt-active');
    },
  });
}

document.querySelectorAll('a[data-link]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    animatePageOut(href);
  });
});

// Incoming page reveal animation
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', animatePageIn);
} else {
  animatePageIn();
}

/* ===================== HERO ANIMATIONS ===================== */

window.addEventListener('load', () => {
  const heroTl = gsap.timeline();

  heroTl
    .to('.hero-img', {
      scale: 1,
      duration: 2.2,
      ease: 'power4.out',
    })
    .from(
      '.reveal-text',
      {
        y: 200,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: 'power4.out',
      },
      '-=1.5'
    )
    .from(
      '.hero-footer',
      {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      },
      '-=0.8'
    );
});

/* ===================== PRELOADER ===================== */

const preloader = document.querySelector('.preloader');
const preloaderBar = document.querySelector('.preloader-bar');

if (preloader && preloaderBar) {
  const progressTl = gsap.to(preloaderBar, {
    width: '100%',
    duration: 2,
    ease: 'power2.inOut',
  });

  window.addEventListener('load', () => {
    progressTl.kill();
    gsap.set(preloaderBar, { width: '100%' });

    gsap.to(preloader, {
      opacity: 0,
      visibility: 'hidden',
      duration: 0.6,
      delay: 0.2,
      ease: 'power3.out',
      onComplete: () => {
        preloader.style.display = 'none';
      },
    });
  });
}

/* ===================== MOBILE MENU ===================== */

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');

    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');

    if (!isOpen) {
      gsap.fromTo(
        mobileLinks,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power3.out',
          delay: 0.1,
        }
      );
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// Close mobile menu on resize above breakpoint
window.addEventListener('resize', () => {
  if (window.innerWidth > 1000 && mobileMenu) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  }
});

/* ===================== SCROLL REVEALS ===================== */

// Reveal up (opacity + translate)
gsap.utils.toArray('.reveal-up').forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none reverse',
    },
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
  });
});

// Reveal from left
gsap.utils.toArray('.reveal-left').forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    x: -80,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
  });
});

// Reveal from right
gsap.utils.toArray('.reveal-right').forEach((el) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    x: 80,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
  });
});

/* ===================== IMAGE PARALLAX ===================== */

gsap.utils.toArray('.parallax-img').forEach((img) => {
  gsap.to(img, {
    scrollTrigger: {
      trigger: img.parentElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
    y: -40,
    scale: 1.1,
  });
});

/* ===================== ARTWORK ROW HOVER EFFECT ===================== */

gsap.utils.toArray('.artwork-img img').forEach((img) => {
  img.parentElement.addEventListener('mouseenter', () => {
    gsap.to(img, { scale: 1.06, duration: 0.8, ease: 'power3.out' });
  });
  img.parentElement.addEventListener('mouseleave', () => {
    gsap.to(img, { scale: 1, duration: 0.8, ease: 'power3.out' });
  });
});

/* ===================== ARTIST LIST HOVER IMAGE ===================== */

const hoverImg = document.querySelector('.artist-hover-img');

if (hoverImg) {
  const items = document.querySelectorAll('.artist-list-item');

  items.forEach((item) => {
    const imgSrc = item.dataset.img;

    item.addEventListener('mouseenter', (e) => {
      if (imgSrc) {
        hoverImg.src = imgSrc;
        hoverImg.classList.add('visible');
      }
    });

    item.addEventListener('mousemove', (e) => {
      const x = e.clientX + 20;
      const y = e.clientY - 180;
      gsap.to(hoverImg, {
        x: x,
        y: y,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    item.addEventListener('mouseleave', () => {
      hoverImg.classList.remove('visible');
    });
  });
}

/* ===================== MASONRY ITEM REVEAL ===================== */

gsap.utils.toArray('.masonry-item').forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: {
      trigger: item,
      start: 'top 85%',
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    delay: i * 0.1,
    ease: 'power3.out',
  });
});

console.log('%cNGMA — National Gallery of Modern Art', 'font-family: Playfair Display; font-size: 24px; color: #e8e4dd;');
console.log('%cDesigned with care.', 'font-size: 12px; color: #888;');
