(function () {
  const catalog = window.WinWinCatalog;
  if (!catalog) return;

  const STORAGE_KEY = "winwin-basket-v1";
  const WHATSAPP_NUMBER = "258856528659";
  const { products, formatPrice, waUrl, visualMarkup, sectionLabels, animalLabels } = catalog;
  let basket = loadBasket();
  let lastFocused = null;

  function loadBasket() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveBasket() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
  }

  function productById(id) {
    return products.find((product) => product.id === id);
  }

  function basketCount() {
    return basket.reduce((sum, item) => sum + item.quantity, 0);
  }

  function itemKey(productId, variantIndex) {
    return `${productId}:${variantIndex}`;
  }

  function announce(message) {
    const toast = document.querySelector("[data-shop-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function injectShopUI() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
        <button class="basket-fab" type="button" data-basket-toggle aria-label="Abrir cesta de encomenda">
          <span class="basket-fab__icon" aria-hidden="true">+</span>
          <span class="basket-fab__label">Minha cesta</span>
          <span class="basket-fab__count" data-basket-count>0</span>
        </button>

        <dialog class="shop-dialog quick-view" data-quick-dialog aria-label="Detalhes rápidos do produto"></dialog>
        <dialog class="shop-dialog basket-drawer" data-basket-dialog aria-labelledby="basket-title"></dialog>
        <div class="shop-toast" data-shop-toast role="status" aria-live="polite"></div>
      `
    );
  }

  function openDialog(dialog) {
    if (!dialog) return;
    document.querySelectorAll(".shop-dialog[open]").forEach((open) => {
      if (open !== dialog) open.close();
    });
    lastFocused = document.activeElement;
    dialog.showModal();
    document.body.classList.add("dialog-open");
    dialog.querySelector("[data-dialog-close]")?.focus();
  }

  function closeDialog(dialog) {
    if (!dialog?.open) return;
    dialog.close();
    document.body.classList.remove("dialog-open");
    lastFocused?.focus?.();
  }

  function quickView(productId) {
    const product = productById(productId);
    const dialog = document.querySelector("[data-quick-dialog]");
    if (!product || !dialog) return;

    const firstVariant = product.variants[0];
    const animalText = product.animals.map((animal) => animalLabels[animal]).join(" · ");
    const options = product.variants
      .map(
        (variant, index) =>
          `<option value="${index}">${variant.label} · ${formatPrice(variant.price)}</option>`
      )
      .join("");

    dialog.innerHTML = `
      <button class="dialog-close" type="button" data-dialog-close aria-label="Fechar detalhes">×</button>
      <div class="quick-view__grid" data-product-id="${product.id}">
        <div class="quick-view__visual ${product.image ? "" : "quick-view__visual--placeholder"}">
          ${visualMarkup(product)}
        </div>
        <div class="quick-view__body">
          <div class="catalog-card__meta">
            <span>${product.brand}</span>
            <span>${sectionLabels[product.section]}</span>
          </div>
          <p class="quick-view__animal">${animalText}</p>
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <label class="variant-picker" for="quick-variant-${product.id}">
            <span>Escolha a opção</span>
            <select id="quick-variant-${product.id}" data-quick-variant>
              ${options}
            </select>
          </label>
          <div class="quick-view__price">
            <div>
              <small>Preço por unidade</small>
              <strong data-quick-price>${formatPrice(firstVariant.price)}</strong>
              <span class="stock-status" data-quick-stock>${firstVariant.stock} ${firstVariant.stock === 1 ? "unidade" : "unidades"} no relatório</span>
            </div>
          </div>
          <div class="quick-view__actions">
            <button class="button button--basket" type="button" data-add-to-basket data-product-id="${product.id}" data-variant-index="0">Adicionar à cesta +</button>
            <a class="button button--whatsapp" data-quick-order href="${waUrl(product, firstVariant)}" target="_blank" rel="noopener">Pedir agora ↗</a>
          </div>
          <a class="quick-view__details" href="produtos/${product.id}.html">Ver página completa do produto →</a>
        </div>
      </div>`;

    openDialog(dialog);
  }

  function renderBasket() {
    const dialog = document.querySelector("[data-basket-dialog]");
    const count = basketCount();
    document.querySelectorAll("[data-basket-count]").forEach((element) => {
      element.textContent = String(count);
      element.closest(".basket-fab")?.classList.toggle("has-items", count > 0);
    });

    if (!dialog) return;
    const validItems = basket
      .map((item) => {
        const product = productById(item.productId);
        const variant = product?.variants[item.variantIndex];
        return product && variant ? { ...item, product, variant } : null;
      })
      .filter(Boolean);
    const total = validItems.reduce(
      (sum, item) => sum + item.variant.price * item.quantity,
      0
    );

    dialog.innerHTML = `
      <div class="basket-drawer__head">
        <div>
          <span class="eyebrow">Encomenda</span>
          <h2 id="basket-title">A sua cesta</h2>
        </div>
        <button class="dialog-close dialog-close--inline" type="button" data-dialog-close aria-label="Fechar cesta">×</button>
      </div>
      ${
        validItems.length
          ? `
            <div class="basket-items">
              ${validItems
                .map(
                  ({ product, variant, variantIndex, quantity }) => `
                    <article class="basket-item" data-basket-key="${itemKey(product.id, variantIndex)}">
                      <div class="basket-item__visual">
                        ${
                          product.image
                            ? `<img src="${product.image}" alt="" width="80" height="80">`
                            : `<span aria-hidden="true">${product.name.slice(0, 2).toUpperCase()}</span>`
                        }
                      </div>
                      <div class="basket-item__copy">
                        <strong>${product.name}</strong>
                        <span>${variant.label} · ${formatPrice(variant.price)}</span>
                        <button type="button" data-remove-item>Remover</button>
                      </div>
                      <div class="quantity-control" aria-label="Quantidade de ${product.name}">
                        <button type="button" data-quantity="-1" aria-label="Diminuir quantidade">−</button>
                        <span>${quantity}</span>
                        <button type="button" data-quantity="1" aria-label="Aumentar quantidade">+</button>
                      </div>
                    </article>`
                )
                .join("")}
            </div>
            <div class="basket-summary">
              <div><span>Total estimado</span><strong>${formatPrice(total)}</strong></div>
              <p>A disponibilidade e o valor final são confirmados pela equipa.</p>
              <a class="button button--whatsapp" data-basket-order href="${basketWhatsAppUrl(validItems, total)}" target="_blank" rel="noopener">Enviar encomenda no WhatsApp ↗</a>
              <button class="basket-clear" type="button" data-clear-basket>Limpar cesta</button>
            </div>`
          : `
            <div class="basket-empty">
              <span class="basket-empty__mark" aria-hidden="true">WW</span>
              <h3>A sua cesta está vazia.</h3>
              <p>Adicione os produtos e tamanhos de que precisa. Depois envie tudo numa única mensagem.</p>
              <button class="button button--sun" type="button" data-dialog-close>Continuar a escolher</button>
            </div>`
      }`;
  }

  function basketWhatsAppUrl(items, total) {
    const lines = [
      "Olá, Win Win Pet Shop! 👋",
      "Gostaria de encomendar:",
      "",
      ...items.map(
        ({ product, variant, quantity }) =>
          `• ${quantity} × ${product.name} — ${variant.label} (${formatPrice(
            variant.price * quantity
          )})`
      ),
      "",
      `Total estimado: ${formatPrice(total)}`,
      "",
      "Podem confirmar a disponibilidade e o valor final, por favor?"
    ];
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  function addToBasket(productId, variantIndex) {
    const product = productById(productId);
    const variant = product?.variants[variantIndex];
    if (!product || !variant) return;

    const existing = basket.find(
      (item) => item.productId === productId && item.variantIndex === variantIndex
    );
    if (existing) {
      if (existing.quantity >= variant.stock) {
        announce(`Já adicionou a quantidade disponível de ${product.name}.`);
        return;
      }
      existing.quantity += 1;
    } else {
      basket.push({ productId, variantIndex, quantity: 1 });
    }
    saveBasket();
    renderBasket();
    announce(`${product.name} adicionado à cesta.`);
  }

  function changeQuantity(key, delta) {
    const item = basket.find((entry) => itemKey(entry.productId, entry.variantIndex) === key);
    if (!item) return;
    const variant = productById(item.productId)?.variants[item.variantIndex];
    if (delta > 0 && variant && item.quantity >= variant.stock) {
      announce("A quantidade disponível já está na cesta.");
      return;
    }
    item.quantity += delta;
    if (item.quantity <= 0) {
      basket = basket.filter(
        (entry) => itemKey(entry.productId, entry.variantIndex) !== key
      );
    }
    saveBasket();
    renderBasket();
  }

  function setupProductPage() {
    const page = document.querySelector("[data-product-detail]");
    if (!page) return;
    const product = productById(page.dataset.productId);
    const select = page.querySelector("[data-product-page-variant]");
    if (!product || !select) return;
    const requestedOption = Number(new URLSearchParams(window.location.search).get("opcao"));
    if (
      Number.isInteger(requestedOption) &&
      requestedOption >= 1 &&
      requestedOption <= product.variants.length
    ) {
      select.value = String(requestedOption - 1);
    }

    const update = () => {
      const index = Number(select.value);
      const variant = product.variants[index];
      page.querySelector("[data-product-page-price]").textContent = formatPrice(variant.price);
      page.querySelector("[data-product-page-stock]").textContent =
        `${variant.stock} ${variant.stock === 1 ? "unidade" : "unidades"} no relatório`;
      page.querySelector("[data-product-page-order]").href = waUrl(product, variant);
      page.querySelector("[data-add-to-basket]").dataset.variantIndex = String(index);
    };
    select.addEventListener("change", update);
    update();
  }

  injectShopUI();

  document.addEventListener("click", (event) => {
    const quickTrigger = event.target.closest("[data-quick-view]");
    if (quickTrigger) {
      quickView(quickTrigger.dataset.quickView);
      return;
    }

    const addButton = event.target.closest("[data-add-to-basket]");
    if (addButton) {
      addToBasket(addButton.dataset.productId, Number(addButton.dataset.variantIndex || 0));
      return;
    }

    const basketToggle = event.target.closest("[data-basket-toggle]");
    if (basketToggle) {
      renderBasket();
      openDialog(document.querySelector("[data-basket-dialog]"));
      return;
    }

    const closeButton = event.target.closest("[data-dialog-close]");
    if (closeButton) {
      closeDialog(closeButton.closest("dialog"));
      return;
    }

    const quantityButton = event.target.closest("[data-quantity]");
    if (quantityButton) {
      const row = quantityButton.closest("[data-basket-key]");
      changeQuantity(row?.dataset.basketKey, Number(quantityButton.dataset.quantity));
      return;
    }

    const removeButton = event.target.closest("[data-remove-item]");
    if (removeButton) {
      const row = removeButton.closest("[data-basket-key]");
      basket = basket.filter(
        (item) => itemKey(item.productId, item.variantIndex) !== row?.dataset.basketKey
      );
      saveBasket();
      renderBasket();
      return;
    }

    if (event.target.closest("[data-clear-basket]")) {
      basket = [];
      saveBasket();
      renderBasket();
    }
  });

  document.addEventListener("change", (event) => {
    const select = event.target.closest("[data-quick-variant]");
    if (!select) return;
    const panel = select.closest("[data-product-id]");
    const product = productById(panel?.dataset.productId);
    const index = Number(select.value);
    const variant = product?.variants[index];
    if (!product || !variant) return;
    panel.querySelector("[data-quick-price]").textContent = formatPrice(variant.price);
    panel.querySelector("[data-quick-stock]").textContent =
      `${variant.stock} ${variant.stock === 1 ? "unidade" : "unidades"} no relatório`;
    panel.querySelector("[data-quick-order]").href = waUrl(product, variant);
    panel.querySelector("[data-add-to-basket]").dataset.variantIndex = String(index);
  });

  document.addEventListener("click", (event) => {
    if (event.target.matches(".shop-dialog")) closeDialog(event.target);
  });

  document.querySelectorAll(".shop-dialog").forEach((dialog) => {
    dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
  });

  renderBasket();
  setupProductPage();
})();
