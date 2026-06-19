/* ============================================
   Dr. Aseel Al-Bukhari Website
   JavaScript Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile Menu ---- */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (mobileToggle && mobileNav && mobileOverlay) {
    mobileToggle.addEventListener('click', function () {
      mobileNav.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    mobileOverlay.addEventListener('click', function () {
      mobileNav.classList.remove('active');
      mobileOverlay.classList.remove('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  /* ---- Header Scroll Effect ---- */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* ---- Back to Top Button ---- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Scroll Animations (Fade In) ---- */
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  /* ---- Booking Form Handling ---- */
  const bookingForm = document.getElementById('bookingForm');
  const formSuccess = document.getElementById('formSuccess');

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Simulate form submission
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
      submitBtn.disabled = true;

      setTimeout(function () {
        bookingForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 1500);
    });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---- Set Minimum Date for Date Input ---- */
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* ---- Active Nav Link on Scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', function () {
      let current = '';
      sections.forEach(function (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });
  }

  /* ---- Stats Counter Animation ---- */
  const stats = document.querySelectorAll('.hero-stat strong');
  if (stats.length > 0) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          const num = parseInt(text.replace(/\D/g, ''));
          if (!isNaN(num)) {
            animateCounter(el, 0, num, 1500);
          }
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    stats.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    const suffix = el.textContent.replace(/[0-9]/g, '');

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(start + (end - start) * ease);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  /* ---- Services Slider ---- */
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderDots = document.getElementById('sliderDots');
  const sliderPrev = document.getElementById('sliderPrev');
  const sliderNext = document.getElementById('sliderNext');

  if (sliderTrack && sliderDots) {
    let currentSlide = 0;
    const totalSlides = sliderTrack.children.length;
    let autoSlideInterval;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentSlide = index;
      sliderTrack.style.transform = 'translateX(' + (index * 100) + '%)';
      
      // Update dots
      const dots = sliderDots.querySelectorAll('.slider-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4000);
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Click handlers
    if (sliderPrev) sliderPrev.addEventListener('click', () => { stopAutoSlide(); prevSlide(); startAutoSlide(); });
    if (sliderNext) sliderNext.addEventListener('click', () => { stopAutoSlide(); nextSlide(); startAutoSlide(); });

    // Dot clicks
    const dots = sliderDots.querySelectorAll('.slider-dot');
    dots.forEach((dot) => {
      dot.addEventListener('click', function () {
        stopAutoSlide();
        goToSlide(parseInt(this.getAttribute('data-index')));
        startAutoSlide();
      });
    });

    // Pause on hover
    sliderTrack.addEventListener('mouseenter', stopAutoSlide);
    sliderTrack.addEventListener('mouseleave', startAutoSlide);

    // Start auto slide
    startAutoSlide();
  }

});
