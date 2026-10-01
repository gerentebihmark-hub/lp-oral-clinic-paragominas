const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  mobileNav.hidden = isOpen;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.querySelectorAll('[data-wa]').forEach(link => {
  link.href = `https://wa.me/5591993014679?text=${encodeURIComponent(link.dataset.wa)}`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});
function setupLeadForm(formId, prefix) {
const leadForm = document.getElementById(formId);
leadForm.addEventListener('submit', event => {
  event.preventDefault();
  const nameInput = document.getElementById(prefix + '-name');
  const phoneInput = document.getElementById(prefix + '-phone');
  const interest = document.getElementById(prefix + '-interest').value;
  const error = document.getElementById(prefix + '-error');
  const name = nameInput.value.trim();
  const phone = phoneInput.value.replace(/\D/g, '');
  nameInput.classList.toggle('invalid', name.length < 2);
  phoneInput.classList.toggle('invalid', phone.length < 10 || phone.length > 11);
  if (name.length < 2) {
    error.textContent = 'Informe seu nome para continuar.';
    nameInput.focus();
    return;
  }
  if (phone.length < 10 || phone.length > 11) {
    error.textContent = 'Informe um WhatsApp com DDD válido.';
    phoneInput.focus();
    return;
  }
  error.textContent = '';
  const message = 'Olá! Meu nome é ' + name + ' e meu WhatsApp é ' + phoneInput.value.trim() + '. Quero agendar uma avaliação na Oral Clinic Paragominas para: ' + interest + '.';
  const link = document.createElement('a');
  link.href = 'https://wa.me/5591993014679?text=' + encodeURIComponent(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
});
leadForm.querySelectorAll('input').forEach(input => input.addEventListener('input', () => {
  input.classList.remove('invalid');
  document.getElementById(prefix + '-error').textContent = '';
}));
}
setupLeadForm('lead-form', 'lead');
setupLeadForm('footer-lead-form', 'footer-lead');
document.querySelectorAll('[data-dialog]').forEach(button => {
  button.addEventListener('click', () => document.getElementById(button.dataset.dialog).showModal());
});
document.querySelectorAll('.legal-modal').forEach(dialog => {
  dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
});

// Motion is progressive: content stays visible if scripts or observers are unavailable.
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionQuery.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const revealItems = document.querySelectorAll(
    '.clinic-photo, .clinic-copy, .section-heading, .treatment-card, .payment-number, .payment-layout > div:last-child, .team-copy, .team-layout > img, .faq-layout > h2, .faq-list, .reviews-layout > *, .location-heading, .location-photo, .location-map, .contact-actions, .final-cta-copy, .final-cta .lead-form'
  );
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 24px 0px' });
  revealItems.forEach(item => {
    item.classList.add('motion-reveal');
    revealObserver.observe(item);
  });
  // Anchor navigation can jump past several sections in one frame.
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    requestAnimationFrame(() => revealItems.forEach(item => {
      if (item.getBoundingClientRect().top < window.innerHeight) item.classList.add('is-visible');
    }));
  }));
}
