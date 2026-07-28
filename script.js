  const html = document.documentElement;
  const btnDark = document.getElementById('btn-dark');
  const btnLight = document.getElementById('btn-light');

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    btnDark.classList.toggle('active', theme === 'dark');
    btnLight.classList.toggle('active', theme === 'light');
    try {
      localStorage.setItem('theme', theme);
    } catch (err) {
      // ignore localStorage errors
    }
  }

  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme || 'light');

  btnDark.addEventListener('click', () => setTheme('dark'));
  btnLight.addEventListener('click', () => setTheme('light'));

  // Detector Results gallery (only slides inside the `.gallery-section`)
  const slides = document.querySelectorAll('.gallery-section .gallery-slide');
  const counter = document.getElementById('gallery-counter');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  let current = 0;

  function showSlide(index) {
    slides[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    counter.textContent = `${current + 1} / ${slides.length}`;
  }
  prevBtn.addEventListener('click', () => showSlide(current - 1));
  nextBtn.addEventListener('click', () => showSlide(current + 1));

  // Lightbox: click an image to view it full-size, navigate with prev/next, dismiss via X, backdrop click, or Escape
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  let lightboxIndex = 1;
  const totalSlides = slides.length;
  let lightboxStandalone = false;

  function updateLightboxImage() {
    const slideImg = document.querySelector(`.gallery-slide[data-index="${lightboxIndex}"] img`);
    if (slideImg) lightboxImg.src = slideImg.src;
  }
  window.openLightbox = function(index) {
    if (index === 'hero') {
      lightboxStandalone = true;
      const heroImg = document.getElementById('hero-placeholder-img');
      if (heroImg) lightboxImg.src = heroImg.src;
      lightboxPrevBtn.style.display = 'none';
      lightboxNextBtn.style.display = 'none';
      lightbox.classList.add('open');
      return;
    }
    lightboxStandalone = false;
    lightboxPrevBtn.style.display = '';
    lightboxNextBtn.style.display = '';
    lightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
  };
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
    lightboxStandalone = false;
    lightboxPrevBtn.style.display = '';
    lightboxNextBtn.style.display = '';
  }
  window.closeLightbox = closeLightbox;
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrevBtn.addEventListener('click', () => {
    if (lightboxStandalone) return;
    lightboxIndex = lightboxIndex - 1 < 1 ? totalSlides : lightboxIndex - 1;
    updateLightboxImage();
  });
  lightboxNextBtn.addEventListener('click', () => {
    if (lightboxStandalone) return;
    lightboxIndex = lightboxIndex + 1 > totalSlides ? 1 : lightboxIndex + 1;
    updateLightboxImage();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') return closeLightbox();
    if (lightboxStandalone) return;
    if (e.key === 'ArrowLeft') lightboxPrevBtn.click();
    if (e.key === 'ArrowRight') lightboxNextBtn.click();
  });

  // Smooth-scroll to #pick-1 without leaving the hash in the URL
  ;(function() {
    const heroCta = document.querySelector('a[href="#top-4"]');
    if (!heroCta) return;
    heroCta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('top-4');
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      let timeoutId;
      let lastPos = window.scrollY;
      let checks = 0;
      function onScroll() {
        if (Math.abs(window.scrollY - lastPos) < 2) {
          clearTimeout(timeoutId);
          cleanup();
          return;
        }
        lastPos = window.scrollY;
        checks++;
        if (checks > 60) {
          clearTimeout(timeoutId);
          cleanup();
        }
      }
      function cleanup() {
        window.removeEventListener('scroll', onScroll);
        try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (err) {}
      }
      window.addEventListener('scroll', onScroll);
      timeoutId = setTimeout(cleanup, 800);
    });
  })();

