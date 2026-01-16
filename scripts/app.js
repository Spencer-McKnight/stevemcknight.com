/**
 * Steve McKnight Website - Shared Application Scripts
 * Consolidated functionality for all pages
 */

(function() {
  'use strict';

  // Cache DOM elements
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

  // Set current year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Navigation scroll effect
  const nav = $('#nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.pageYOffset > 100);
    }, { passive: true });
  }

  // Mobile menu toggle
  const navToggle = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  
  if (navToggle && mobileMenu) {
    const toggleMenu = (open) => {
      const action = open ? 'add' : 'remove';
      navToggle.classList[action]('nav__toggle--active');
      mobileMenu.classList[action]('mobile-menu--open');
      document.body.classList[action]('menu-open');
    };

    navToggle.addEventListener('click', () => {
      toggleMenu(!mobileMenu.classList.contains('mobile-menu--open'));
    });

    // Close on link click
    $$('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  // Intersection Observer for scroll animations
  const animateElements = $$('[data-animate]');
  if (animateElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('animate-in'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => observer.observe(el));
  }

  // Smooth scroll for anchor links
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = $(href);
      if (target) {
        e.preventDefault();
        const navHeight = nav ? nav.offsetHeight : 0;
        const offset = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

})();

