(function () {
  const headerTarget = document.querySelector('[data-site-header]');
  const footerTarget = document.querySelector('[data-site-footer]');
  if (headerTarget && window.WinWinHeader) headerTarget.outerHTML = window.WinWinHeader;
  if (footerTarget && window.WinWinFooter) footerTarget.outerHTML = window.WinWinFooter;

  const page = document.body.dataset.page;
  const current = document.querySelector(`[data-nav="${page}"]`);
  if (current) current.setAttribute('aria-current', 'page');
})();
