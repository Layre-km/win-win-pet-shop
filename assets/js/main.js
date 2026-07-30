const legacyRedirects = {
  "racoes.html": "produtos.html?categoria=alimentacao",
  "acessorios.html": "produtos.html?categoria=acessorios",
  "brinquedos.html": "produtos.html",
  "racao-classic-adult-25kg.html": "produtos/montego-classic-adult.html",
  "racao-classic-adult-40kg.html": "produtos/montego-classic-adult.html",
  "racao-jock-multistage-20kg.html": "produtos/jock-multistage.html",
  "caixa-transportadora-para-pets.html": "produtos/caixa-transporte.html",
  "acaimo-para-caes.html": "produtos/focinheiras-caes.html",
  "coleiras-coloridas-para-pets.html": "produtos/coleiras-sonoras-gatos.html"
};

const currentFile = window.location.pathname.split("/").pop();
if (legacyRedirects[currentFile]) {
  window.location.replace(legacyRedirects[currentFile]);
}

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".main-nav");
  const button = document.querySelector(".menu-button");

  function closeMenu() {
    if (!button || !nav) return;
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("menu-open");
  }

  if (button && nav) {
    button.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(open));
      button.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      document.body.classList.toggle("menu-open", open);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        button.focus();
      }
    });
  }

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach((element) => observer.observe(element));
  } else {
    revealItems.forEach((element) => element.classList.add("revealed"));
  }

  document.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = [
        "Olá, Win Win Pet Shop! 👋",
        `O meu nome é ${data.get("nome") || ""}.`,
        `Procuro: ${data.get("assunto") || "Informações sobre produtos"}.`,
        data.get("mensagem") ? `Mensagem: ${data.get("mensagem")}` : "",
        "",
        "Podem ajudar-me, por favor?"
      ].filter(Boolean);
      const url = `https://wa.me/258856528659?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener");
    });
  });
});
