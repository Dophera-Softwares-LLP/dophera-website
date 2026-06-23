/* ============================================================
   DOPHERA SOFTWARES LLP — Interactions & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Wait for GSAP to be available
  const initGSAP = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initGSAP, 100);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    initAnimations();
  };

  initGSAP();
  initNavbar();
  initMobileMenu();
  initHeroSpotlight();
  initFAQ();
  initCardTilt();
  initMagneticButtons();
  initSmoothScroll();
});


/* -------------------------------------------------------
   GSAP Scroll Animations
   ------------------------------------------------------- */
function initAnimations() {
  // Hero entrance
  const heroReveals = document.querySelectorAll('.hero__content .reveal');
  gsap.set(heroReveals, { opacity: 0, y: 30 });
  gsap.to(heroReveals, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    delay: 0.2,
  });

  // Hero shapes float in
  const shapes = document.querySelectorAll('.hero__shape');
  gsap.set(shapes, { opacity: 0, scale: 0.8 });
  gsap.to(shapes, {
    opacity: (i) => {
      const el = shapes[i];
      const style = window.getComputedStyle(el);
      return parseFloat(style.opacity) || 0.8;
    },
    scale: 1,
    duration: 1,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.5,
  });

  // Floating animation for shapes
  shapes.forEach((shape, i) => {
    const speed = parseFloat(shape.dataset.speed) || 1;
    gsap.to(shape, {
      y: `${8 * speed}`,
      duration: 2.5 + i * 0.3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.2,
    });
  });

  // Scroll reveal for all .reveal elements (except hero ones already animated)
  const scrollReveals = document.querySelectorAll('.reveal:not(.hero__content .reveal)');
  scrollReveals.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Parallax-like effect on sections
  document.querySelectorAll('.section-title').forEach((title) => {
    gsap.to(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5,
      },
      y: -10,
    });
  });
}


/* -------------------------------------------------------
   Navbar
   ------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const currentScroll = window.scrollY;

        if (currentScroll > 10) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* -------------------------------------------------------
   Mobile Menu
   ------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  const links = mobile.querySelectorAll('a');

  toggle.addEventListener('click', () => {
    const isOpen = mobile.classList.contains('open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  links.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  function openMenu() {
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    mobile.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    mobile.classList.remove('open');
    document.body.style.overflow = '';
  }
}


/* -------------------------------------------------------
   Hero Spotlight (Mouse Follow)
   ------------------------------------------------------- */
function initHeroSpotlight() {
  const spotlight = document.getElementById('heroSpotlight');
  const hero = document.getElementById('hero');

  if (!spotlight || !hero) return;

  // Only on non-touch devices
  if (window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlight.style.left = x + 'px';
      spotlight.style.top = y + 'px';
    });
  } else {
    // Place spotlight in center for touch devices
    spotlight.style.left = '50%';
    spotlight.style.top = '40%';
  }
}


/* -------------------------------------------------------
   FAQ Accordion
   ------------------------------------------------------- */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach((item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    const inner = item.querySelector('.faq__answer-inner');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      items.forEach((other) => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq__answer').style.maxHeight = '0';
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });
}


/* -------------------------------------------------------
   3D Card Tilt Effect
   ------------------------------------------------------- */
function initCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
}


/* -------------------------------------------------------
   Magnetic Button Effect
   ------------------------------------------------------- */
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const buttons = document.querySelectorAll('.btn, .navbar__cta');

  buttons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease-out';
    });
  });
}


/* -------------------------------------------------------
   Smooth Scroll
   ------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  });
}
