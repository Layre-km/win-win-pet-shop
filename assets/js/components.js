(function () {
  if (!document.querySelector('link[href="assets/css/site-v2.css"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "assets/css/site-v2.css";
    document.head.appendChild(stylesheet);
  }

  const headerTarget = document.querySelector("[data-site-header]");
  const footerTarget = document.querySelector("[data-site-footer]");
  if (headerTarget && window.WinWinHeader) headerTarget.outerHTML = window.WinWinHeader;
  if (footerTarget && window.WinWinFooter) footerTarget.outerHTML = window.WinWinFooter;

  const page = document.body.dataset.page;
  const current = document.querySelector(`[data-nav="${page}"]`);
  if (current) current.setAttribute("aria-current", "page");
})();
