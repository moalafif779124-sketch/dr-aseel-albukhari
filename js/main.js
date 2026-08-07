/* ============================================
   Dr. Aseel Al-Bukhari Website — JS v2 (2026-08-07)
   Mobile app UI: drawer, dark mode, bottom nav,
   FAB, body map, booking wizard, micro-interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ==========================================
     Dark Mode (persisted in localStorage)
     ========================================== */
  const rootEl = document.documentElement;
  const savedTheme = localStorage.getItem('draseel-theme');
  if (savedTheme === 'dark') rootEl.setAttribute('data-theme', 'dark');

  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-toggle-icon') : null;
  const themeLabel = themeToggle ? themeToggle.querySelector('.theme-toggle-label') : null;

  function applyThemeUI() {
    if (!themeToggle) return;
    const isDark = rootEl.getAttribute('data-theme') === 'dark';
    if (themeIcon) {
      themeIcon.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
    if (themeLabel) themeLabel.textContent = isDark ? 'الوضع النهاري' : 'الوضع الليلي';
  }
  applyThemeUI();

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const isDark = rootEl.getAttribute('data-theme') === 'dark';
      if (isDark) {
        rootEl.removeAttribute('data-theme');
        localStorage.setItem('draseel-theme', 'light');
      } else {
        rootEl.setAttribute('data-theme', 'dark');
        localStorage.setItem('draseel-theme', 'dark');
      }
      applyThemeUI();
    });
  }

  /* ==========================================
     Mobile Drawer (was: mobile nav)
     ========================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function closeDrawer() {
    if (mobileNav) mobileNav.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
  }

  if (mobileToggle && mobileNav && mobileOverlay) {
    mobileToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileNav.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
    });

    mobileOverlay.addEventListener('click', closeDrawer);

    // Close drawer when tapping a link
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ==========================================
     Header scroll effect
     ========================================== */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ==========================================
     Back to top
     ========================================== */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================
     Scroll fade-in animations
     ========================================== */
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    fadeElements.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    fadeElements.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ==========================================
     Ripple micro-interaction on buttons
     ========================================== */
  document.querySelectorAll('.btn, .bottom-nav .bn-item, .body-part, .time-chip').forEach(function (el) {
    el.addEventListener('pointerdown', function (e) {
      const rect = el.getBoundingClientRect();
      const wave = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 0.8;
      wave.className = 'ripple-wave';
      wave.style.width = wave.style.height = size + 'px';
      wave.style.left = (e.clientX - rect.left - size / 2) + 'px';
      wave.style.top = (e.clientY - rect.top - size / 2) + 'px';
      el.appendChild(wave);
      wave.addEventListener('animationend', function () { wave.remove(); });
    });
  });

  /* ==========================================
     Smooth scroll for anchor links
     ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  /* ==========================================
     Set minimum date for date input
     ========================================== */
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date();
    const iso = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');
    dateInput.setAttribute('min', iso);
  }

  /* ==========================================
     Stats counter animation
     ========================================== */
  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();
    const suffix = el.textContent.replace(/[0-9]/g, '');
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + (end - start) * ease) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  const stats = document.querySelectorAll('.hero-stat strong, .dc-stats strong');
  if (stats.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const num = parseInt(el.textContent.replace(/\D/g, ''), 10);
          if (!isNaN(num)) animateCounter(el, 0, num, 1500);
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (stat) { statsObserver.observe(stat); });
  }

  /* ==========================================
     Services slider
     ========================================== */
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
      sliderDots.querySelectorAll('.slider-dot').forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }
    function startAutoSlide() { autoSlideInterval = setInterval(nextSlide, 4000); }
    function stopAutoSlide() { clearInterval(autoSlideInterval); }

    if (sliderPrev) sliderPrev.addEventListener('click', function () { stopAutoSlide(); prevSlide(); startAutoSlide(); });
    if (sliderNext) sliderNext.addEventListener('click', function () { stopAutoSlide(); nextSlide(); startAutoSlide(); });
    sliderDots.querySelectorAll('.slider-dot').forEach(function (dot) {
      dot.addEventListener('click', function () {
        stopAutoSlide();
        goToSlide(parseInt(this.getAttribute('data-index'), 10));
        startAutoSlide();
      });
    });
    sliderTrack.addEventListener('mouseenter', stopAutoSlide);
    sliderTrack.addEventListener('mouseleave', startAutoSlide);
    // Touch swipe support
    let touchStartX = 0;
    sliderTrack.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    sliderTrack.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { stopAutoSlide(); dx < 0 ? nextSlide() : prevSlide(); startAutoSlide(); }
    }, { passive: true });

    startAutoSlide();
  }

  /* ==========================================
     Floating Action Buttons (WhatsApp + Call)
     ========================================== */
  const fabContainer = document.getElementById('fabContainer');
  const fabMain = document.getElementById('fabMain');
  if (fabContainer && fabMain) {
    fabMain.addEventListener('click', function () {
      fabContainer.classList.toggle('open');
    });
    // Close when tapping outside
    document.addEventListener('click', function (e) {
      if (!fabContainer.contains(e.target)) fabContainer.classList.remove('open');
    });
  }

  /* ==========================================
     Interactive Body Map / Condition Selector
     ========================================== */
  const bodyParts = {
    neck:    { title: 'آلام الرقبة',             text: 'علاج آلام الرقبة الناتجة عن التشنجات العضلية والشد والانزلاق الغضروفي العنقي، مع استرخاء فوري للعضلات.' },
    shoulder:{ title: 'التهاب مفصل الكتف',       text: 'يحسن مدى حركة الكتف ويخفف التيبس والألم المزمن في مفصل الكتف (الكتف المتجمد) عبر جلسات الترددات الراديوية.' },
    back:    { title: 'آلام أسفل الظهر المزمنة', text: 'علاج فعال للآلام المزمنة في أسفل الظهر الناتجة عن التهاب الأعصاب أو الانزلاق الغضروفي الخفيف.' },
    elbow:   { title: 'مرفق التنس (التهاب الأوتار)', text: 'علاج التهابات الأوتار المزمنة في المرفق والمعصم، وتخفيف الالتهاب وتحسين المرونة.' },
    hip:     { title: 'آلام مفصل الورك',         text: 'علاج متخصص لآلام مفصل الورك والورك الرياضي والتهابات المفصل الناتجة عن التآكل.' },
    knee:    { title: 'آلام الركبة والورك',      text: 'علاج متخصص لآلام الركبة الناتجة عن التهاب المفاصل أو التآكل، مع تحسين الحركة وتقليل الألم.' },
    foot:    { title: 'التهاب اللفافة الأخمصية', text: 'علاج ألم الكعب الناتج عن التهاب اللفافة الأخمصية، مع تخفيف الالتهاب وتحسين المرونة.' }
  };

  const hotspots = document.querySelectorAll('.hotspot');
  const bodyPartBtns = document.querySelectorAll('.body-part');
  const bodyDetail = document.getElementById('bodyDetail');

  function selectBodyPart(part) {
    if (!bodyDetail || !bodyParts[part]) return;
    // highlight hotspots with this part
    hotspots.forEach(function (h) {
      h.classList.toggle('active', h.getAttribute('data-part') === part);
    });
    // highlight buttons
    bodyPartBtns.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-part') === part);
    });
    bodyDetail.querySelector('h5').textContent = bodyParts[part].title;
    bodyDetail.querySelector('p').textContent = bodyParts[part].text;
    // subtle entrance animation
    bodyDetail.style.animation = 'none';
    void bodyDetail.offsetWidth;
    bodyDetail.style.animation = 'fadeInUp 0.4s ease';
  }

  hotspots.forEach(function (h) {
    h.addEventListener('click', function () { selectBodyPart(this.getAttribute('data-part')); });
  });
  bodyPartBtns.forEach(function (b) {
    b.addEventListener('click', function () { selectBodyPart(this.getAttribute('data-part')); });
  });
  // open with first part for discoverability
  if (bodyPartBtns.length > 0) selectBodyPart(bodyPartBtns[0].getAttribute('data-part'));

  /* ==========================================
     Booking wizard (contact page)
     ========================================== */
  const wizardForm = document.getElementById('bookingForm');
  const wizardPanels = document.querySelectorAll('.wizard-panel');
  const wizardSteps = document.querySelectorAll('.wizard-progress .wp');
  const wizardNext = document.getElementById('wizardNext');
  const wizardBack = document.getElementById('wizardBack');
  let wizardStep = 0;

  function updateWizard() {
    wizardPanels.forEach(function (p, i) { p.classList.toggle('active', i === wizardStep); });
    wizardSteps.forEach(function (s, i) {
      s.classList.toggle('active', i === wizardStep);
      s.classList.toggle('done', i < wizardStep);
    });
    if (wizardBack) {
      wizardBack.style.visibility = wizardStep === 0 ? 'hidden' : 'visible';
    }
    if (wizardNext) {
      wizardNext.textContent = wizardStep === wizardPanels.length - 1 ? 'مراجعة وتأكيد' : 'التالي';
    }
  }

  if (wizardForm && wizardPanels.length > 0) {
    // time chips
    document.querySelectorAll('.time-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.time-chip').forEach(function (c) { c.classList.remove('selected'); });
        chip.classList.add('selected');
        const timeInput = document.getElementById('preferredTime');
        if (timeInput) timeInput.value = chip.getAttribute('data-time');
      });
    });

    if (wizardNext) {
      wizardNext.addEventListener('click', function () {
        // simple validation per step
        if (wizardStep === 0) {
          const fn = document.getElementById('firstName');
          const ln = document.getElementById('lastName');
          const ph = document.getElementById('phone');
          if (!fn.value.trim() || !ln.value.trim() || !ph.value.trim()) {
            alert('يرجى تعبئة الاسم ورقم الهاتف');
            return;
          }
        }
        if (wizardStep === 1) {
          const sv = document.getElementById('service');
          if (!sv.value) { alert('يرجى اختيار الخدمة المطلوبة'); return; }
        }
        if (wizardStep === 2) {
          const dt = document.getElementById('preferredDate');
          const tm = document.getElementById('preferredTime');
          if (!dt.value) { alert('يرجى اختيار التاريخ'); return; }
          if (!tm.value) { alert('يرجى اختيار الوقت'); return; }
        }
        if (wizardStep < wizardPanels.length - 1) {
          wizardStep++;
          updateWizard();
        } else {
          buildReview();
        }
      });
    }
    if (wizardBack) {
      wizardBack.addEventListener('click', function () {
        if (wizardStep > 0) { wizardStep--; updateWizard(); }
      });
    }

    function buildReview() {
      const f = function (id) { const el = document.getElementById(id); return el ? el.value : ''; };
      const serviceName = (function () {
        const sel = document.getElementById('service');
        if (!sel) return '';
        const opt = sel.options[sel.selectedIndex];
        return opt ? opt.text : '';
      })();
      const timeLabel = (function () {
        const chip = document.querySelector('.time-chip.selected');
        return chip ? chip.textContent.trim() : f('preferredTime');
      })();
      const rev = document.getElementById('wizardReview');
      if (rev) {
        rev.innerHTML =
          '<li><span>الاسم</span><span>' + escapeHtml(f('firstName') + ' ' + f('lastName')) + '</span></li>' +
          '<li><span>رقم الهاتف</span><span dir="ltr">' + escapeHtml(f('phone')) + '</span></li>' +
          '<li><span>الخدمة</span><span>' + escapeHtml(serviceName) + '</span></li>' +
          '<li><span>التاريخ</span><span dir="ltr">' + escapeHtml(f('preferredDate')) + '</span></li>' +
          '<li><span>الوقت</span><span>' + escapeHtml(timeLabel) + '</span></li>' +
          (f('symptoms') ? '<li><span>الأعراض</span><span>' + escapeHtml(f('symptoms')) + '</span></li>' : '');
      }
      wizardStep = wizardPanels.length - 1;
      updateWizard();
      if (wizardNext) wizardNext.style.display = 'none';
      if (wizardBack) wizardBack.style.display = 'none';
      const submitRow = document.getElementById('wizardSubmitRow');
      if (submitRow) submitRow.style.display = 'flex';
    }

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    // Final submit → WhatsApp
    wizardForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const f = function (id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
      const sel = document.getElementById('service');
      const serviceName = sel && sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].text : '';
      const timeChip = document.querySelector('.time-chip.selected');
      const timeLabel = timeChip ? timeChip.textContent.trim() : f('preferredTime');

      const msg = 'حجز موعد - د. أصيل البخاري\n' +
        '👤 الاسم: ' + f('firstName') + ' ' + f('lastName') + '\n' +
        '📱 الهاتف: ' + f('phone') + '\n' +
        '🩺 الخدمة: ' + serviceName + '\n' +
        '📅 التاريخ: ' + f('preferredDate') + '\n' +
        '⏰ الوقت: ' + timeLabel + '\n' +
        (f('symptoms') ? '📝 الأعراض: ' + f('symptoms') + '\n' : '') +
        'شكراً لتواصلكم مع د. أصيل البخاري.';

      const submitBtn = wizardForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="ci-svg" style="font-size:1em"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg></span> جاري فتح واتساب...';
      }

      // Open WhatsApp with prefilled message
      const waUrl = 'https://wa.me/967779088003?text=' + encodeURIComponent(msg);
      window.open(waUrl, '_blank');

      // Show success panel
      setTimeout(function () {
        wizardForm.style.display = 'none';
        const formSuccess = document.getElementById('formSuccess');
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 800);
    });

    updateWizard();
  }

});
