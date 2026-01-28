/**
 * Steve McKnight Website - Shared Application Scripts
 * Consolidated functionality for all pages
 */

import { URLS } from '../lib/constants.js';

(function() {
  'use strict';

  // Cache DOM elements
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

  // Populate book links from constants
  $$('[data-book-link]').forEach(link => {
    const bookKey = link.dataset.bookLink;
    if (URLS.BOOKS[bookKey]) {
      link.href = URLS.BOOKS[bookKey];
    }
  });

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

  // Active navigation state
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav__link, .mobile-menu__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === 'index.html' && href === '#') ||
        (currentPage === 'insights.html' && href === 'insights.html')) {
      link.classList.add(link.classList.contains('nav__link') ? 'nav__link--active' : 'mobile-menu__link--active');
    }
  });

  // Mobile menu toggle
  const navToggle = $('#navToggle');
  const mobileMenu = $('#mobileMenu');
  
  if (navToggle && mobileMenu) {
    const toggleMenu = (open) => {
      const action = open ? 'add' : 'remove';
      navToggle.classList[action]('nav__toggle--active');
      mobileMenu.classList[action]('mobile-menu--open');
      document.body.classList[action]('menu-open');
      navToggle.setAttribute('aria-expanded', open);
    };

    navToggle.addEventListener('click', () => {
      toggleMenu(!mobileMenu.classList.contains('mobile-menu--open'));
    });

    // Close on link click
    $$('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
        toggleMenu(false);
        navToggle.focus();
      }
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

  // Back to top button
  const backToTop = $('#backToTop');
  if (backToTop) {
    let ticking = false;
    
    const updateBackToTop = () => {
      const scrolled = window.pageYOffset > 500;
      backToTop.classList.toggle('back-to-top--visible', scrolled);
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateBackToTop);
        ticking = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Reading progress bar (for insights page)
  const progressBar = $('#readingProgress');
  if (progressBar) {
    let ticking = false;

    const updateProgress = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - winHeight;
      const scrolled = (window.pageYOffset / docHeight) * 100;
      progressBar.style.width = Math.min(scrolled, 100) + '%';
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
  }

  // External link indicator - add visual cue on hover
  $$('a[target="_blank"]').forEach(link => {
    if (!link.querySelector('svg')) {
      link.setAttribute('title', 'Opens in new tab');
    }
  });

})();

