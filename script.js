/* ============================================================
   Blue Mic - Interactions
   ============================================================ */

(function () {
  // Build animated waveform bars
  function buildBars(target, count, opts) {
    if (!target) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const bar = document.createElement('span');
      bar.className = (opts && opts.className) || 'bar';
      const center = count / 2;
      const distance = Math.abs(i - center) / center;
      const base = 1 - distance * 0.55;
      const amp = base * (0.7 + Math.random() * 0.5);
      bar.style.animationDelay = (i * 0.05 + Math.random() * 0.2).toFixed(2) + 's';
      bar.style.animationDuration = (1.2 + Math.random() * 0.9).toFixed(2) + 's';
      const minH = (opts && opts.minH) || 8;
      const maxH = (opts && opts.maxH) || 90;
      bar.style.height = Math.max(minH, Math.round(amp * maxH)) + 'px';
      frag.appendChild(bar);
    }
    target.appendChild(frag);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Hero waveform behind the logo
    const heroWave = document.querySelector('.hero-mark .waveform');
    buildBars(heroWave, 36, { maxH: 60, minH: 6 });

    // iPhone mockup waveform: full-width recording screen, dense bars
    // Modulated envelope (not pure random) so the waveform reads as "speech".
    const wave = document.querySelector('.rec-wave');
    if (wave) {
      const COUNT = 70;
      for (let i = 0; i < COUNT; i++) {
        const bar = document.createElement('span');
        bar.className = 'b';
        // Speech-like envelope: combine a slow oscillation with jitter
        const t = i / COUNT;
        const env = 0.45 + 0.55 * Math.abs(Math.sin(t * Math.PI * 3.2 + 1.1));
        const jitter = 0.6 + Math.random() * 0.7;
        const h = Math.max(3, Math.round(env * jitter * 36));
        bar.style.height = h + 'px';
        bar.style.animationDelay = (i * 0.025 + Math.random() * 0.18).toFixed(2) + 's';
        bar.style.animationDuration = (1.0 + Math.random() * 1.0).toFixed(2) + 's';
        wave.appendChild(bar);
      }
    }

    // Sticky nav scroll state
    const nav = document.querySelector('.nav');
    if (nav) {
      const onScroll = () => {
        if (window.scrollY > 8) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Reveal-on-scroll
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('in');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('in'));
    }

    // FAQ: rotate the + on open
    document.querySelectorAll('details').forEach((d) => {
      const sign = d.querySelector('summary > span:last-child');
      if (!sign) return;
      d.addEventListener('toggle', () => {
        sign.style.transform = d.open ? 'rotate(45deg)' : '';
      });
    });

    // Mobile menu toggle
    const burger = document.querySelector('.nav-burger');
    const menu = document.querySelector('.mobile-menu');
    if (burger && menu) {
      const close = () => {
        burger.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };
      const open = () => {
        burger.setAttribute('aria-expanded', 'true');
        menu.classList.add('open');
        menu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      };
      burger.addEventListener('click', () => {
        const isOpen = burger.getAttribute('aria-expanded') === 'true';
        isOpen ? close() : open();
      });
      // Close when a link is tapped
      menu.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', close);
      });
      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') close();
      });
      // Close if viewport grows back to desktop while open
      window.addEventListener('resize', () => {
        if (window.innerWidth > 760 && menu.classList.contains('open')) close();
      });
    }
  });
})();
