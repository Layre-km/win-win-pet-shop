(function () {
  const WHATSAPP_NUMBER = "258856528659";
  const STOCK_DATE = "19 de Julho de 2026";

  const products = [
    {
      id: "montego-classic-adult",
      name: "Montego Classic Adult",
      brand: "Montego",
      section: "alimentacao",
      animals: ["cao"],
      tags: ["ração", "adulto", "alimento seco", "montego"],
      description: "Alimento seco completo para cães adultos de todas as raças, com fórmula multiproteica para manutenção diária.",
      image: "assets/images/catalog/montego-classic-adult.jpg",
      imageAlt: "Embalagem Montego Classic Adult",
      imageNote: "Imagem da linha; tamanho conforme a opção seleccionada.",
      featured: true,
      variants: [
        { label: "10 kg", price: 1400, stock: 8 },
        { label: "20 kg", price: 2800, stock: 10 },
        { label: "40 kg", price: 5100, stock: 5 }
      ]
    },
    {
      id: "jock-multistage",
      name: "Jock Multistage",
      brand: "Jock",
      section: "alimentacao",
      animals: ["cao"],
      tags: ["ração", "adulto", "activo", "alimento seco", "jock"],
      description: "Alimento seco completo formulado para cães adultos e activos, com 22% de proteína e 9% de gordura.",
      image: "assets/images/catalog/jock-multistage.webp",
      imageAlt: "Embalagem Jock Multistage",
      imageNote: "Imagem da linha; confirme a embalagem de 40 kg no WhatsApp.",
      featured: true,
      variants: [
        { label: "40 kg", price: 4900, stock: 2 }
      ]
    },
    {
      id: "montego-puppy-small-bite",
      name: "Montego Puppy Small Bite",
      brand: "Montego",
      section: "alimentacao",
      animals: ["cao"],
      tags: ["ração", "cachorro", "puppy", "small bite", "montego"],
      description: "Ração para cachorros de porte pequeno a médio, com croquete de tamanho reduzido e nutrição para a fase de crescimento.",
      image: "assets/images/catalog/montego-puppy-small-bite.jpg",
      imageAlt: "Embalagem Montego Puppy Small Bite",
      imageNote: "Imagem da linha; confirme a embalagem de 20 kg no WhatsApp.",
      variants: [
        { label: "20 kg", price: 3750, stock: 2 }
      ]
    },
    {
      id: "epol-high-performance",
      name: "EPOL High Performance Balancer",
      brand: "EPOL",
      section: "alimentacao",
      animals: ["cavalo"],
      tags: ["ração", "cavalo", "balancer", "pellets", "epol"],
      description: "Balancer concentrado de baixa ingestão para cavalos de desporto, reprodução, treino e recuperação.",
      image: "assets/images/catalog/epol-high-performance.jpg",
      imageAlt: "Saco EPOL High Performance Balancer",
      featured: true,
      variants: [
        { label: "22,5 kg", price: 2800, stock: 5 }
      ]
    },
    {
      id: "epol-rider-pellets",
      name: "EPOL Rider Pellets",
      brand: "EPOL",
      section: "alimentacao",
      animals: ["cavalo"],
      tags: ["ração", "cavalo", "pellets", "rider", "epol"],
      description: "Pellets completos para cavalos e póneis em trabalho ligeiro a médio, com fibras, proteína e energia equilibradas.",
      image: "assets/images/catalog/epol-rider-pellets.jpg",
      imageAlt: "Saco EPOL Rider Pellets",
      variants: [
        { label: "40 kg", price: 2200, stock: 7 }
      ]
    },
    {
      id: "caixa-transporte",
      name: "Caixa de transporte para animais",
      brand: "Selecção Win Win",
      section: "acessorios",
      animals: ["cao", "gato"],
      tags: ["transportadora", "viagem", "caixa", "pet"],
      description: "Caixa rígida com ventilação, pega superior e porta frontal, para deslocações mais práticas.",
      image: "assets/images/catalog/caixa-transporte.webp",
      imageAlt: "Caixa de transporte para animais",
      featured: true,
      variants: [
        { label: "S · 48 × 30 × 32 cm", price: 2400, stock: 1 }
      ]
    },
    {
      id: "camas-pets",
      name: "Camas para cães e gatos",
      brand: "Selecção Win Win",
      section: "acessorios",
      animals: ["cao", "gato"],
      tags: ["cama", "descanso", "conforto", "vermelha", "pneu"],
      description: "Opções de descanso para diferentes portes e espaços. Escolha o modelo e confirme a medida pelo WhatsApp.",
      visual: "CONFORTO",
      tone: "peach",
      variants: [
        { label: "Cama vermelha", price: 1600, stock: 1 },
        { label: "Cama tamanho L", price: 1900, stock: 1 },
        { label: "Cama de pneu · cão adulto", price: 6500, stock: 1 }
      ]
    },
    {
      id: "coleiras-sonoras-gatos",
      name: "Coleiras sonoras para gatos",
      brand: "Selecção Win Win",
      section: "acessorios",
      animals: ["gato"],
      tags: ["coleira", "gato", "guizo", "sonora", "colorida"],
      description: "Coleiras leves e ajustáveis com guizo, disponíveis em cores variadas.",
      image: "assets/images/catalog/coleiras-coloridas-gatos.webp",
      imageAlt: "Coleiras coloridas para gatos",
      variants: [
        { label: "Unidade", price: 300, stock: 10 }
      ]
    },
    {
      id: "focinheiras-caes",
      name: "Focinheira ajustável para cães",
      brand: "Selecção Win Win",
      section: "acessorios",
      animals: ["cao"],
      tags: ["focinheira", "açaime", "cão", "passeio", "ajustável"],
      description: "Modelo tipo cesto com tiras ajustáveis. Confirme o tamanho adequado antes de encomendar.",
      image: "assets/images/catalog/focinheira-caes.webp",
      imageAlt: "Focinheira tipo cesto para cães",
      variants: [
        { label: "S", price: 2040, stock: 1 },
        { label: "M", price: 2300, stock: 1 },
        { label: "XL", price: 2500, stock: 1 }
      ]
    },
    {
      id: "corta-unhas",
      name: "Corta-unhas para cães e gatos",
      brand: "Selecção Win Win",
      section: "cuidados",
      animals: ["cao", "gato"],
      tags: ["unhas", "corta-unhas", "grooming", "higiene"],
      description: "Ferramenta de corte para a manutenção regular das unhas do seu pet.",
      visual: "GROOMING",
      tone: "mint",
      variants: [
        { label: "Modelo standard", price: 950, stock: 2 },
        { label: "Modelo azul", price: 1200, stock: 1 }
      ]
    },
    {
      id: "pente-pets",
      name: "Pente para cães e gatos",
      brand: "Selecção Win Win",
      section: "cuidados",
      animals: ["cao", "gato"],
      tags: ["pente", "pêlo", "grooming", "escova"],
      description: "Pente prático para desembaraçar e apoiar a rotina de cuidado do pêlo.",
      visual: "PELAGEM",
      tone: "sky",
      variants: [
        { label: "Unidade", price: 600, stock: 1 }
      ]
    },
    {
      id: "tesoura-pets",
      name: "Tesoura para cães e gatos",
      brand: "Selecção Win Win",
      section: "cuidados",
      animals: ["cao", "gato"],
      tags: ["tesoura", "grooming", "pêlo", "higiene"],
      description: "Tesoura para pequenos cuidados de grooming e acabamento do pêlo.",
      visual: "GROOMING",
      tone: "peach",
      variants: [
        { label: "Unidade", price: 600, stock: 4 }
      ]
    },
    {
      id: "marltons-shampoo",
      name: "Marltons Original Dog Shampoo",
      brand: "Marltons",
      section: "cuidados",
      animals: ["cao"],
      tags: ["shampoo", "champô", "banho", "marltons", "higiene"],
      description: "Champô suave e hidratante para limpeza profunda e cuidado regular da pelagem dos cães.",
      image: "assets/images/catalog/marltons-dog-shampoo.jpg",
      imageAlt: "Marltons Original Dog Shampoo 500 ml",
      variants: [
        { label: "500 ml", price: 700, stock: 2 }
      ]
    },
    {
      id: "shampoo-universal",
      name: "Champô universal",
      brand: "Selecção Win Win",
      section: "cuidados",
      animals: ["cao", "gato"],
      tags: ["shampoo", "champô", "banho", "5 litros", "higiene"],
      description: "Formato económico para banho e cuidados regulares. Confirme a indicação do rótulo antes da utilização.",
      visual: "HIGIENE",
      tone: "sky",
      variants: [
        { label: "5 litros", price: 2500, stock: 2 }
      ]
    },
    {
      id: "bio-kill",
      name: "Bio Kill Classic",
      brand: "Efekto",
      section: "cuidados",
      animals: ["cao", "gato"],
      tags: ["bio kill", "insectos", "ambiente", "controlo"],
      description: "Produto para controlo de insectos em ambientes. Leia o rótulo e mantenha crianças e animais afastados durante a aplicação.",
      image: "assets/images/catalog/bio-kill-375ml.jpg",
      imageAlt: "Bio Kill Classic 375 ml",
      variants: [
        { label: "375 ml", price: 1800, stock: 1 }
      ]
    },
    {
      id: "pulverizador",
      name: "Pulverizador",
      brand: "Selecção Win Win",
      section: "cuidados",
      animals: ["cao", "gato", "cavalo"],
      tags: ["pulverizador", "spray", "cuidados", "limpeza"],
      description: "Pulverizador manual para apoiar rotinas de limpeza e cuidado.",
      visual: "CUIDADOS",
      tone: "mint",
      variants: [
        { label: "Unidade", price: 1200, stock: 2 }
      ]
    },
    {
      id: "prato-duplo-madeira",
      name: "Prato duplo com base de madeira",
      brand: "Selecção Win Win",
      section: "acessorios",
      animals: ["cao", "gato"],
      tags: ["prato", "tigela", "comedouro", "madeira", "duplo"],
      description: "Conjunto de duas tigelas numa base de madeira, para servir comida e água com estabilidade.",
      visual: "REFEIÇÃO",
      tone: "sand",
      variants: [
        { label: "Conjunto", price: 1600, stock: 1 }
      ]
    },
    {
      id: "pratos-caes",
      name: "Pratos para cães",
      brand: "Selecção Win Win",
      section: "acessorios",
      animals: ["cao"],
      tags: ["prato", "tigela", "comedouro", "cão"],
      description: "Pratos resistentes para servir alimento ou água no dia-a-dia.",
      visual: "REFEIÇÃO",
      tone: "sand",
      variants: [
        { label: "Unidade", price: 1800, stock: 5 }
      ]
    },
    {
      id: "recolhedor-fezes",
      name: "Recolhedor de fezes para cães",
      brand: "Selecção Win Win",
      section: "acessorios",
      animals: ["cao"],
      tags: ["recolhedor", "fezes", "passeio", "higiene"],
      description: "Acessório prático para manter os passeios e áreas exteriores mais limpos.",
      visual: "PASSEIO",
      tone: "mint",
      variants: [
        { label: "Unidade", price: 840, stock: 2 }
      ]
    },
    {
      id: "botas-cavaleiro",
      name: "Botas para cavaleiro",
      brand: "Selecção Win Win",
      section: "equitacao",
      animals: ["cavalo"],
      tags: ["botas", "cavaleiro", "equitação", "vestuário"],
      description: "Botas de equitação para apoio, protecção e conforto do cavaleiro.",
      visual: "EQUITAÇÃO",
      tone: "chocolate",
      variants: [
        { label: "Par", price: 6000, stock: 1 }
      ]
    },
    {
      id: "cilha-cavalo",
      name: "Cilha para cavalo",
      brand: "Selecção Win Win",
      section: "equitacao",
      animals: ["cavalo"],
      tags: ["cilha", "sela", "cavalo", "equitação"],
      description: "Cilha para ajudar a manter a sela segura. Confirme a medida pelo WhatsApp.",
      visual: "SELARIA",
      tone: "chocolate",
      variants: [
        { label: "Unidade", price: 2300, stock: 1 }
      ]
    },
    {
      id: "corda-guia-cavalo",
      name: "Corda de guia para cavalo",
      brand: "Selecção Win Win",
      section: "equitacao",
      animals: ["cavalo"],
      tags: ["corda", "guia", "cavalo", "maneio"],
      description: "Corda de guia para o maneio diário e deslocação segura do cavalo.",
      visual: "MANEIO",
      tone: "sand",
      variants: [
        { label: "Unidade", price: 2400, stock: 1 }
      ]
    },
    {
      id: "estribos-cavalo",
      name: "Estribos para cavalo",
      brand: "Selecção Win Win",
      section: "equitacao",
      animals: ["cavalo"],
      tags: ["estribos", "sela", "cavalo", "equitação"],
      description: "Par de estribos para compor o equipamento de sela.",
      visual: "SELARIA",
      tone: "chocolate",
      variants: [
        { label: "Par", price: 4200, stock: 1 }
      ]
    },
    {
      id: "teff-net",
      name: "Teff Net",
      brand: "Selecção Win Win",
      section: "equitacao",
      animals: ["cavalo"],
      tags: ["teff", "rede", "feno", "alimentação", "cavalo"],
      description: "Rede para disponibilizar forragem de forma organizada no estábulo ou durante o transporte.",
      visual: "ESTÁBULO",
      tone: "mint",
      variants: [
        { label: "Unidade", price: 900, stock: 2 }
      ]
    },
    {
      id: "arnica-ice",
      name: "Arnica Ice",
      brand: "Kyron",
      section: "cuidados",
      animals: ["cavalo", "cao"],
      tags: ["arnica", "gel", "músculos", "tendões", "cavalo"],
      description: "Gel refrescante para alívio temporário de músculos e articulações cansados. Utilize conforme o rótulo.",
      image: "assets/images/catalog/arnica-ice.jpg",
      imageAlt: "Arnica Ice cooling gel",
      variants: [
        { label: "Unidade", price: 1200, stock: 1 }
      ]
    },
    {
      id: "leather-cleaner",
      name: "Leather Cleaner",
      brand: "Cuidados de selaria",
      section: "cuidados",
      animals: ["cavalo"],
      tags: ["leather cleaner", "couro", "sela", "limpeza"],
      description: "Produto de limpeza para artigos de couro e equipamento de selaria. Confirme o tamanho e as instruções do rótulo.",
      image: "assets/images/catalog/leather-cleaner.jpg",
      imageAlt: "Produto de limpeza para couro",
      variants: [
        { label: "Unidade", price: 1200, stock: 1 }
      ]
    },
    {
      id: "tar-spray",
      name: "Tar Spray",
      brand: "Cuidados equinos",
      section: "cuidados",
      animals: ["cavalo"],
      tags: ["tar spray", "casco", "cavalo", "spray"],
      description: "Spray de alcatrão para cuidados externos. Leia e siga rigorosamente as indicações do rótulo.",
      visual: "CASCOS",
      tone: "chocolate",
      variants: [
        { label: "250 ml", price: 1800, stock: 1 }
      ]
    }
  ];

  const sectionLabels = {
    alimentacao: "Alimentação",
    acessorios: "Acessórios",
    cuidados: "Cuidados",
    equitacao: "Equitação"
  };

  const animalLabels = {
    cao: "Cães",
    gato: "Gatos",
    cavalo: "Cavalos"
  };

  const formatPrice = (value) =>
    `${new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 0 }).format(value)} MT`;

  function waUrl(product, variant) {
    const message = [
      "Olá, Win Win Pet Shop! 👋",
      `Gostaria de encomendar: ${product.name}`,
      `Opção: ${variant.label}`,
      `Preço por unidade: ${formatPrice(variant.price)}`,
      "",
      "Podem confirmar a disponibilidade, por favor?"
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function visualMarkup(product) {
    if (product.image) {
      return `<img src="${product.image}" alt="${product.imageAlt}" width="640" height="640" loading="lazy">`;
    }
    return `
      <div class="product-placeholder product-placeholder--${product.tone || "mint"}" aria-hidden="true">
        <span class="product-placeholder__mark">WW</span>
        <span class="product-placeholder__label">${product.visual || "SELECÇÃO"}</span>
      </div>`;
  }

  function productCard(product) {
    const firstVariant = product.variants[0];
    const lowestPrice = Math.min(...product.variants.map((variant) => variant.price));
    const variantId = `variant-${product.id}`;
    const animalText = product.animals.map((animal) => animalLabels[animal]).join(" · ");
    const options = product.variants
      .map(
        (variant, index) =>
          `<option value="${index}">${variant.label} · ${formatPrice(variant.price)}</option>`
      )
      .join("");
    const variantControl =
      product.variants.length > 1
        ? `
          <label class="variant-picker" for="${variantId}">
            <span>Escolha a opção</span>
            <select id="${variantId}" data-product-variant>
              ${options}
            </select>
          </label>`
        : `<div class="single-variant">${firstVariant.label}</div>`;

    return `
      <article class="catalog-card" id="${product.id}" data-product-id="${product.id}">
        <div class="catalog-card__visual ${product.image ? "" : "catalog-card__visual--placeholder"}">
          <a class="catalog-card__link" href="produtos/${product.id}.html" aria-label="Ver ${product.name}">
            ${visualMarkup(product)}
          </a>
          <span class="catalog-card__animal">${animalText}</span>
        </div>
        <div class="catalog-card__body">
          ${product.imageNote ? `<small class="catalog-card__image-note">${product.imageNote}</small>` : ""}
          <div class="catalog-card__meta">
            <span>${product.brand}</span>
            <span>${sectionLabels[product.section]}</span>
          </div>
          <h2><a href="produtos/${product.id}.html">${product.name}</a></h2>
          <p>${product.description}</p>
          <span class="catalog-card__options">${
            product.variants.length > 1
              ? `${product.variants.length} opções disponíveis`
              : firstVariant.label
          }</span>
          ${variantControl}
          <div class="catalog-card__buy">
            <div>
              <small data-price-label>Preço por unidade</small>
              <strong data-product-price>${formatPrice(lowestPrice)}</strong>
              <span class="stock-status" data-product-stock>${firstVariant.stock} ${firstVariant.stock === 1 ? "unidade" : "unidades"} no relatório</span>
            </div>
            <div class="catalog-card__actions">
              <button class="button button--basket button--compact" type="button" data-add-to-basket data-product-id="${product.id}" data-variant-index="0">
                Adicionar <span aria-hidden="true">+</span>
              </button>
              <a class="card-order-link" data-product-order href="${waUrl(product, firstVariant)}" target="_blank" rel="noopener">
                Pedir agora <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </article>`;
  }

  function normalize(value) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function setupCardInteractions(container, visibleProducts) {
    container.querySelectorAll("[data-product-id]").forEach((card) => {
      const product = visibleProducts.find((item) => item.id === card.dataset.productId);
      const select = card.querySelector("[data-product-variant]");
      if (!product || !select) return;
      select.addEventListener("change", () => {
        const variant = product.variants[Number(select.value)];
        card.querySelector("[data-product-price]").textContent = formatPrice(variant.price);
        card.querySelector("[data-product-stock]").textContent =
          `${variant.stock} ${variant.stock === 1 ? "unidade" : "unidades"} no relatório`;
        card.querySelector("[data-product-order]").href = waUrl(product, variant);
        const addButton = card.querySelector("[data-add-to-basket]");
        if (addButton) addButton.dataset.variantIndex = select.value;
      });
    });
  }

  function setupCatalog() {
    const grid = document.querySelector("[data-catalog-grid]");
    if (!grid) return;

    const search = document.querySelector("[data-catalog-search]");
    const animal = document.querySelector("[data-animal-filter]");
    const buttons = Array.from(document.querySelectorAll("[data-section-filter]"));
    const layoutButtons = Array.from(document.querySelectorAll("[data-catalog-layout]"));
    const count = document.querySelector("[data-catalog-count]");
    const empty = document.querySelector("[data-catalog-empty]");
    const params = new URLSearchParams(window.location.search);

    let activeSection = params.get("categoria") || "todos";
    const requestedAnimal = params.get("animal");
    const requestedProduct = params.get("produto");
    let mobileLayout = "grid";
    try {
      mobileLayout = localStorage.getItem("winwin-catalog-layout") === "list" ? "list" : "grid";
    } catch {
      mobileLayout = "grid";
    }

    function applyLayout() {
      grid.dataset.mobileLayout = mobileLayout;
      layoutButtons.forEach((button) => {
        const isActive = button.dataset.catalogLayout === mobileLayout;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    }

    if (requestedAnimal && animal) animal.value = requestedAnimal;
    if (requestedProduct && search) {
      const matched = products.find((product) => product.id === requestedProduct);
      if (matched) search.value = matched.name;
    }

    function render() {
      const query = normalize(search?.value || "");
      const animalValue = animal?.value || "todos";
      const visible = products.filter((product) => {
        const haystack = normalize(
          [product.name, product.brand, product.description, ...product.tags].join(" ")
        );
        const matchesSearch = !query || haystack.includes(query);
        const matchesSection = activeSection === "todos" || product.section === activeSection;
        const matchesAnimal = animalValue === "todos" || product.animals.includes(animalValue);
        return matchesSearch && matchesSection && matchesAnimal;
      });

      grid.innerHTML = visible.map(productCard).join("");
      setupCardInteractions(grid, visible);
      if (count) {
        count.textContent = `${visible.length} ${visible.length === 1 ? "produto" : "produtos"}`;
        count.classList.remove("is-updating");
        requestAnimationFrame(() => count.classList.add("is-updating"));
      }
      if (empty) empty.hidden = visible.length !== 0;
      buttons.forEach((button) => {
        const isActive = button.dataset.sectionFilter === activeSection;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    }

    search?.addEventListener("input", render);
    animal?.addEventListener("change", render);
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        activeSection = button.dataset.sectionFilter;
        render();
      });
    });
    layoutButtons.forEach((button) => {
      button.addEventListener("click", () => {
        mobileLayout = button.dataset.catalogLayout;
        try {
          localStorage.setItem("winwin-catalog-layout", mobileLayout);
        } catch {
          // The view still changes when browser storage is unavailable.
        }
        applyLayout();
      });
    });
    document.querySelector("[data-clear-filters]")?.addEventListener("click", () => {
      activeSection = "todos";
      if (search) search.value = "";
      if (animal) animal.value = "todos";
      render();
    });
    applyLayout();
    render();
  }

  function setupFeatured() {
    document.querySelectorAll("[data-featured-products]").forEach((container) => {
      const limit = Number(container.dataset.limit || 4);
      const featured = products.filter((product) => product.featured).slice(0, limit);
      container.innerHTML = featured.map(productCard).join("");
      setupCardInteractions(container, featured);
    });
  }

  window.WinWinCatalog = {
    products,
    formatPrice,
    stockDate: STOCK_DATE,
    waUrl,
    visualMarkup,
    sectionLabels,
    animalLabels
  };
  document.addEventListener("DOMContentLoaded", () => {
    setupCatalog();
    setupFeatured();
  });
})();
