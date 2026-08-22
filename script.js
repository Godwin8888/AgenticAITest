'use strict';

/**
 * FORM_ENDPOINT: where the enquiry form POSTs its JSON payload.
 * Swap this placeholder for a real endpoint, e.g.:
 *   - Formspree:  'https://formspree.io/f/{your_form_id}'
 *   - Getform:    'https://getform.io/f/{your_form_id}'
 *   - Custom API: 'https://api.yourdomain.com/enquiries'
 */
const FORM_ENDPOINT = 'https://example.com/api/enquiry';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================
   Mobile nav toggle
   ============================================ */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu whenever a nav link is clicked
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close the mobile menu on outside click
  document.addEventListener('click', (event) => {
    if (!menu.classList.contains('open')) return;
    if (menu.contains(event.target) || toggle.contains(event.target)) return;
    closeMenu();
  });
}

/* ============================================
   Fade-in-on-scroll via IntersectionObserver
   ============================================ */
function initFadeInObserver() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  if (prefersReducedMotion) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ============================================
   Testimonial carousel (mobile swipeable track)
   ============================================ */
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (!track || !dotsWrap || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.children);
  let activeIndex = 0;
  let syncFromScroll = true;

  // Build one dot button per slide
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.setAttribute('aria-selected', String(i === activeIndex));
    });
  }

  function goToSlide(index) {
    activeIndex = Math.max(0, Math.min(index, slides.length - 1));
    syncFromScroll = false;
    slides[activeIndex].scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      inline: 'start',
      block: 'nearest',
    });
    updateDots();
    window.setTimeout(() => { syncFromScroll = true; }, 400);
  }

  prevBtn.addEventListener('click', () => goToSlide(activeIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(activeIndex + 1));

  // Keep the active dot in sync when the user swipes manually
  let scrollTimer = null;
  track.addEventListener('scroll', () => {
    if (!syncFromScroll) return;
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const trackRect = track.getBoundingClientRect();
      let closestIndex = 0;
      let closestDistance = Infinity;
      slides.forEach((slide, i) => {
        const distance = Math.abs(slide.getBoundingClientRect().left - trackRect.left);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      activeIndex = closestIndex;
      updateDots();
    }, 100);
  });
}

/* ============================================
   Enquiry form: validation + JSON submission
   ============================================ */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;

function initEnquiryForm() {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');
  const formSuccess = document.getElementById('formSuccess');
  const resetFormBtn = document.getElementById('resetFormBtn');

  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    phone: form.elements.phone,
    company: form.elements.company,
    service: form.elements.service,
    message: form.elements.message,
  };

  const rules = {
    name: (value) => (value.trim() ? '' : 'Please enter your full name.'),
    email: (value) => {
      if (!value.trim()) return 'Please enter your email address.';
      if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    },
    phone: (value) => {
      if (!value.trim()) return 'Please enter a phone number.';
      if (!PHONE_REGEX.test(value.trim())) return 'Please enter a valid phone number.';
      return '';
    },
    company: () => '',
    service: (value) => (value ? '' : 'Please select a service.'),
    message: (value) => (value.trim() ? '' : 'Please add a short message.'),
  };

  // Validates a single field, updates its error text and aria-invalid state, returns pass/fail
  function validateField(name) {
    const field = fields[name];
    const errorEl = document.getElementById(`${name}-error`);
    const message = rules[name](field.value);

    if (message) {
      field.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
    } else {
      field.removeAttribute('aria-invalid');
      errorEl.textContent = '';
    }
    return !message;
  }

  Object.keys(fields).forEach((name) => {
    fields[name].addEventListener('blur', () => validateField(name));
  });

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.classList.toggle('is-loading', isSubmitting);
  }

  function setStatus(message, state) {
    formStatus.textContent = message;
    if (state) {
      formStatus.setAttribute('data-state', state);
    } else {
      formStatus.removeAttribute('data-state');
    }
  }

  function showSuccess() {
    form.hidden = true;
    formSuccess.hidden = false;
    formSuccess.focus();
  }

  resetFormBtn.addEventListener('click', () => {
    form.reset();
    Object.keys(fields).forEach((name) => {
      fields[name].removeAttribute('aria-invalid');
      document.getElementById(`${name}-error`).textContent = '';
    });
    setStatus('', null);
    formSuccess.hidden = true;
    form.hidden = false;
    fields.name.focus();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', null);

    // Honeypot: bots tend to fill hidden fields; silently "succeed" without a real submit
    if (form.elements.website.value) {
      showSuccess();
      return;
    }

    const validations = Object.keys(rules).map((name) => validateField(name));
    const isValid = validations.every(Boolean);
    if (!isValid) {
      const firstInvalidName = Object.keys(fields).find(
        (name) => fields[name].hasAttribute('aria-invalid')
      );
      if (firstInvalidName) fields[firstInvalidName].focus();
      setStatus('Please fix the errors above and try again.', 'error');
      return;
    }

    const payload = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      phone: fields.phone.value.trim(),
      company: fields.company.value.trim(),
      service: fields.service.value,
      message: fields.message.value.trim(),
    };

    setSubmitting(true);

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showSuccess();
      } else {
        setStatus(`Something went wrong on our end (error ${response.status}). Please try again shortly.`, 'error');
      }
    } catch (err) {
      setStatus('Network error — please check your connection and try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  });
}

/* ============================================
   Footer year
   ============================================ */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initFadeInObserver();
  initTestimonialCarousel();
  initEnquiryForm();
  setFooterYear();
});
