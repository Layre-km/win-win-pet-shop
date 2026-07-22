document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.brand').forEach((brand) => {
    brand.setAttribute('aria-label', 'Win Win Pet Shop');
    brand.innerHTML = '<img class="brand-logo" src="assets/images/logo-win-win-petshop.png" alt="Win Win Petshop">';
  });
  const nav = document.querySelector('.main-nav');
  let button = document.querySelector('.menu-button');
  if (nav && !button) {
    nav.id ||= 'main-menu';
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'menu-button';
    button.setAttribute('aria-label', 'Abrir menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', nav.id);
    button.innerHTML = '<span></span><span></span><span></span>';
    nav.before(button);
  }
  if (button && nav) {
    button.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
  }
  document.querySelectorAll('[data-reveal]').forEach((element) => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }, { threshold: 0.14 });
    observer.observe(element);
  });
});
