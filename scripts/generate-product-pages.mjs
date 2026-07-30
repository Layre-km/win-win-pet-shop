import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
const publicOrigin = "https://win-win-petshop-matola.layre.chatgpt.site";
const outputDir = path.join(root, "produtos");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function loadCatalog(source) {
  const sandbox = {
    window: {},
    document: {
      addEventListener() {},
      querySelector() {
        return null;
      },
      querySelectorAll() {
        return [];
      }
    },
    URLSearchParams
  };
  vm.runInNewContext(source, sandbox);
  return sandbox.window.WinWinCatalog;
}

function absoluteAsset(assetPath) {
  return `${publicOrigin}/${assetPath.replaceAll("\\", "/")}`;
}

function sku(product, variant) {
  return `${product.id}-${variant.label}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function offer(product, variant, index) {
  return {
    "@type": "Offer",
    url: `${publicOrigin}/produtos/${product.id}?opcao=${index + 1}`,
    priceCurrency: "MZN",
    price: variant.price,
    availability:
      variant.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "PetStore",
      name: "Win Win Pet Shop"
    }
  };
}

function productSchema(product, sectionLabel) {
  const common = {
    "@context": "https://schema.org",
    name: product.name,
    description: product.description,
    category: sectionLabel,
    brand: {
      "@type": "Brand",
      name: product.brand
    },
    url: `${publicOrigin}/produtos/${product.id}`
  };
  if (product.image) common.image = [absoluteAsset(product.image)];

  if (product.variants.length === 1) {
    const variant = product.variants[0];
    return {
      ...common,
      "@type": "Product",
      sku: sku(product, variant),
      size: variant.label,
      offers: offer(product, variant, 0)
    };
  }

  return {
    ...common,
    "@type": "ProductGroup",
    productGroupID: product.id,
    variesBy: ["https://schema.org/size"],
    hasVariant: product.variants.map((variant, index) => ({
      "@type": "Product",
      name: `${product.name} — ${variant.label}`,
      sku: sku(product, variant),
      size: variant.label,
      offers: offer(product, variant, index)
    }))
  };
}

function breadcrumbSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: `${publicOrigin}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Produtos",
        item: `${publicOrigin}/produtos.html`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${publicOrigin}/produtos/${product.id}`
      }
    ]
  };
}

function sectionCopy(product) {
  const animalList = product.animals
    .map((animal) => ({ cao: "cães", gato: "gatos", cavalo: "cavalos" })[animal])
    .join(" e ");
  const copies = {
    alimentacao: {
      benefit: `${product.name} integra a nossa selecção de alimentação para ${animalList}. A descrição e os tamanhos desta página correspondem ao produto registado no inventário da loja.`,
      choice: `Escolha o peso adequado à rotina do animal. Para mudanças de alimentação, faça a transição de forma gradual e siga sempre as instruções da embalagem.`,
      care: `Guarde a embalagem num local fresco e seco. A equipa Win Win pode confirmar o lote, a embalagem disponível e ajudar a escolher a opção antes da compra.`
    },
    acessorios: {
      benefit: `${product.name} foi seleccionado para tornar a rotina com ${animalList} mais simples, prática e confortável.`,
      choice: `Confirme o tamanho ou modelo indicado nesta página. Quando o ajuste for importante, envie-nos as medidas do animal pelo WhatsApp.`,
      care: `Verifique o estado do acessório regularmente e utilize-o de acordo com a finalidade indicada pelo fabricante.`
    },
    cuidados: {
      benefit: `${product.name} faz parte da nossa selecção de cuidados para ${animalList}, pensada para apoiar uma rotina de higiene e manutenção responsável.`,
      choice: `Confirme o formato pretendido e leia o rótulo antes da utilização. Em caso de dúvida sobre a aplicação, fale com a nossa equipa.`,
      care: `Siga as instruções, precauções e frequência indicadas na embalagem. Produtos de uso externo devem ser guardados fora do alcance de crianças e animais.`
    },
    equitacao: {
      benefit: `${product.name} integra a selecção Win Win para maneio e equitação, com foco numa utilização prática junto de cavalos e cavaleiros.`,
      choice: `Confirme a medida, compatibilidade e finalidade antes de encomendar. Podemos verificar o modelo disponível por fotografia no WhatsApp.`,
      care: `Inspeccione o equipamento antes de cada utilização e mantenha-o limpo e bem acondicionado para prolongar a sua vida útil.`
    }
  };
  return copies[product.section];
}

function visualMarkup(product) {
  if (product.image) {
    return `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(
      product.imageAlt || product.name
    )}" width="720" height="720">`;
  }
  return `
    <div class="product-page-placeholder product-placeholder--${escapeHtml(
      product.tone || "mint"
    )}" aria-label="Imagem de ${escapeHtml(product.name)} a confirmar">
      <span class="product-placeholder__mark">WW</span>
      <span class="product-placeholder__label">${escapeHtml(
        product.visual || "SELECÇÃO"
      )}</span>
    </div>`;
}

function relatedProducts(product, products) {
  const related = products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.section === product.section ||
          candidate.animals.some((animal) => product.animals.includes(animal)))
    )
    .slice(0, 3);

  return related
    .map(
      (candidate) => `
        <a class="related-product" href="produtos/${candidate.id}.html">
          <div class="related-product__visual">
            ${
              candidate.image
                ? `<img src="${escapeHtml(candidate.image)}" alt="" width="260" height="220" loading="lazy">`
                : `<span aria-hidden="true">${escapeHtml(
                    candidate.visual || candidate.name.slice(0, 2).toUpperCase()
                  )}</span>`
            }
          </div>
          <div>
            <small>${escapeHtml(candidate.brand)}</small>
            <h3>${escapeHtml(candidate.name)}</h3>
            <span>Desde ${escapeHtml(
              new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 0 }).format(
                candidate.variants[0].price
              )
            )} MT →</span>
          </div>
        </a>`
    )
    .join("");
}

function renderPage(product, products, catalog) {
  const firstVariant = product.variants[0];
  const sectionLabel = catalog.sectionLabels[product.section];
  const animalText = product.animals
    .map((animal) => catalog.animalLabels[animal])
    .join(" · ");
  const copy = sectionCopy(product);
  const options = product.variants
    .map(
      (variant, index) =>
        `<option value="${index}">${escapeHtml(variant.label)} · ${catalog.formatPrice(
          variant.price
        )}</option>`
    )
    .join("");
  const schemas = [productSchema(product, sectionLabel), breadcrumbSchema(product)];
  const schemaJson = JSON.stringify(schemas).replaceAll("<", "\\u003c");
  const imageMeta = product.image
    ? `<meta property="og:image" content="${absoluteAsset(product.image)}">`
    : `<meta property="og:image" content="${publicOrigin}/og.png">`;

  return `<!doctype html>
<html lang="pt-MZ">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <base href="../">
  <title>${escapeHtml(product.name)} | Win Win Pet Shop Matola</title>
  <meta name="description" content="${escapeHtml(
    `${product.description} Consulte opções, preços e encomende ${product.name} pelo WhatsApp na Win Win Pet Shop em Matola.`
  )}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#082e29">
  <link rel="canonical" href="${publicOrigin}/produtos/${product.id}">
  <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="assets/css/site-v2.css">
  <meta property="og:type" content="product">
  <meta property="og:locale" content="pt_MZ">
  <meta property="og:site_name" content="Win Win Pet Shop">
  <meta property="og:title" content="${escapeHtml(product.name)} | Win Win Pet Shop">
  <meta property="og:description" content="${escapeHtml(product.description)}">
  <meta property="og:url" content="${publicOrigin}/produtos/${product.id}">
  ${imageMeta}
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${schemaJson}</script>
</head>
<body data-page="produtos">
  <a class="skip-link" href="#produto">Saltar para o produto</a>
  <div data-site-header></div>

  <main id="produto">
    <section class="product-hero">
      <div class="wrap">
        <nav class="crumbs crumbs--dark" aria-label="Navegação estrutural">
          <a href="index.html">Início</a><span>/</span>
          <a href="produtos.html">Produtos</a><span>/</span>
          <span>${escapeHtml(product.name)}</span>
        </nav>
        <div class="product-hero__grid" data-product-detail data-product-id="${product.id}">
          <div class="product-hero__image ${product.image ? "" : "product-hero__image--placeholder"}">
            ${visualMarkup(product)}
          </div>
          <div class="product-hero__copy">
            <div class="catalog-card__meta">
              <span>${escapeHtml(product.brand)}</span>
              <span>${escapeHtml(sectionLabel)}</span>
            </div>
            <p class="product-animal">${escapeHtml(animalText)}</p>
            <h1>${escapeHtml(product.name)}</h1>
            <p class="product-lead">${escapeHtml(product.description)}</p>
            <label class="variant-picker product-variant" for="product-variant-${product.id}">
              <span>Escolha a opção</span>
              <select id="product-variant-${product.id}" data-product-page-variant>
                ${options}
              </select>
            </label>
            <div class="product-purchase">
              <div>
                <small>Preço por unidade</small>
                <strong data-product-page-price>${catalog.formatPrice(firstVariant.price)}</strong>
                <span class="stock-status" data-product-page-stock>${firstVariant.stock} ${
                  firstVariant.stock === 1 ? "unidade" : "unidades"
                } no relatório</span>
              </div>
              <div class="product-purchase__actions">
                <button class="button button--basket" type="button" data-add-to-basket data-product-id="${product.id}" data-variant-index="0">Adicionar à cesta +</button>
                <a class="button button--whatsapp" data-product-page-order href="${catalog.waUrl(
                  product,
                  firstVariant
                )}" target="_blank" rel="noopener">Pedir agora ↗</a>
              </div>
            </div>
            <p class="product-confirmation">Stock baseado no relatório de 19 de Julho de 2026. A equipa confirma a disponibilidade actual antes de fechar a encomenda.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--paper">
      <div class="wrap">
        <div class="section-head section-head--single">
          <span class="eyebrow">Informação útil</span>
          <h2>Escolha com confiança.</h2>
        </div>
        <div class="product-facts">
          <article class="fact-card">
            <span>01</span>
            <h3>Sobre este produto</h3>
            <p>${escapeHtml(copy.benefit)}</p>
          </article>
          <article class="fact-card">
            <span>02</span>
            <h3>Como escolher</h3>
            <p>${escapeHtml(copy.choice)}</p>
          </article>
          <article class="fact-card">
            <span>03</span>
            <h3>Utilização responsável</h3>
            <p>${escapeHtml(copy.care)}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <span class="eyebrow">Também pode precisar</span>
            <h2>Produtos relacionados.</h2>
          </div>
          <a class="button button--ghost" href="produtos.html">Ver catálogo completo →</a>
        </div>
        <div class="related-products">${relatedProducts(product, products)}</div>
      </div>
    </section>

    <section class="section section--forest product-order-band">
      <div class="wrap">
        <div>
          <span class="eyebrow eyebrow--light">Atendimento directo</span>
          <h2>Precisa de confirmar o tamanho ou a utilização?</h2>
        </div>
        <a class="button button--sun" href="https://wa.me/258856528659?text=${encodeURIComponent(
          `Olá, Win Win Pet Shop! Gostaria de ajuda com ${product.name}.`
        )}" target="_blank" rel="noopener">Falar com a equipa ↗</a>
      </div>
    </section>
  </main>

  <div data-site-footer></div>
  <script src="assets/js/header.js" defer></script>
  <script src="assets/js/footer.js" defer></script>
  <script src="assets/js/components.js" defer></script>
  <script src="assets/js/catalog.js" defer></script>
  <script src="assets/js/shop.js" defer></script>
  <script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

const catalogSource = await readFile(path.join(root, "assets", "js", "catalog.js"), "utf8");
const catalog = loadCatalog(catalogSource);
const products = catalog.products;

await mkdir(outputDir, { recursive: true });
await Promise.all(
  products.map((product) =>
    writeFile(
      path.join(outputDir, `${product.id}.html`),
      renderPage(product, products, catalog),
      "utf8"
    )
  )
);

const sitemapUrls = [
  "",
  "/produtos.html",
  "/sobre.html",
  "/contactos.html",
  "/localizacao.html",
  "/faq.html",
  ...products.map((product) => `/produtos/${product.id}`)
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (url) => `  <url>
    <loc>${publicOrigin}${url || "/"}</loc>
    <lastmod>2026-07-30</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;
await writeFile(path.join(root, "sitemap.xml"), sitemap, "utf8");

console.log(`Generated ${products.length} product pages and sitemap.xml.`);
