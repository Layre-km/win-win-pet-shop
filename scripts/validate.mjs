import { access, readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import "./generate-product-pages.mjs";

const root = process.cwd();
const pages = [
  "index.html",
  "produtos.html",
  "sobre.html",
  "contactos.html",
  "localizacao.html",
  "faq.html"
];
const issues = [];

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

for (const page of pages) {
  const source = await readFile(path.join(root, page), "utf8");
  const references = [...source.matchAll(/\b(?:href|src)="([^"]+)"/g)].map((match) => match[1]);

  for (const reference of references) {
    if (
      reference.startsWith("#") ||
      reference.startsWith("/") ||
      /^(?:https?:|mailto:|tel:|data:)/i.test(reference)
    ) {
      continue;
    }

    const clean = reference.split(/[?#]/)[0];
    if (!clean) continue;
    if (!(await exists(path.join(root, clean)))) {
      issues.push(`${page}: missing local asset or page "${clean}"`);
    }
  }

  if (!source.includes('lang="pt-MZ"')) issues.push(`${page}: missing pt-MZ language`);
  if (!source.includes('name="description"')) issues.push(`${page}: missing meta description`);
  if (!source.includes('content="/og.png"')) issues.push(`${page}: missing social image`);
}

const catalogSource = await readFile(path.join(root, "assets", "js", "catalog.js"), "utf8");
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
vm.runInNewContext(catalogSource, sandbox);

const products = sandbox.window.WinWinCatalog?.products ?? [];
const variants = products.flatMap((product) =>
  product.variants.map((variant) => ({ ...variant, product: product.name }))
);
const ids = products.map((product) => product.id);
const inventoryValue = variants.reduce((sum, variant) => sum + variant.price * variant.stock, 0);

if (products.length !== 27) issues.push(`expected 27 product families, found ${products.length}`);
if (variants.length !== 34) issues.push(`expected 34 stock lines, found ${variants.length}`);
if (inventoryValue !== 183520) {
  issues.push(`expected inventory selling value 183520 MT, found ${inventoryValue} MT`);
}
if (new Set(ids).size !== ids.length) issues.push("catalog contains duplicate product IDs");

for (const variant of variants) {
  if (!(variant.price > 0)) issues.push(`${variant.product}: invalid selling price`);
  if (!Number.isInteger(variant.stock) || variant.stock < 0) {
    issues.push(`${variant.product}: invalid stock quantity`);
  }
}

for (const product of products) {
  if (product.image && !(await exists(path.join(root, product.image)))) {
    issues.push(`${product.name}: missing image "${product.image}"`);
  }

  const productPagePath = path.join(root, "produtos", `${product.id}.html`);
  if (!(await exists(productPagePath))) {
    issues.push(`${product.name}: missing dedicated product page`);
    continue;
  }

  const productPage = await readFile(productPagePath, "utf8");
  if (!productPage.includes(`<link rel="canonical" href="https://win-win-petshop-matola.layre.chatgpt.site/produtos/${product.id}">`)) {
    issues.push(`${product.name}: missing or incorrect canonical URL`);
  }
  if (!productPage.includes('data-product-detail')) {
    issues.push(`${product.name}: missing interactive product detail`);
  }
  if (!productPage.includes('data-add-to-basket')) {
    issues.push(`${product.name}: missing basket action`);
  }

  const schemaBlocks = [...productPage.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!schemaBlocks.length) {
    issues.push(`${product.name}: missing structured data`);
  } else {
    try {
      const parsed = JSON.parse(schemaBlocks[0][1]);
      const types = (Array.isArray(parsed) ? parsed : [parsed]).map((item) => item["@type"]);
      if (!types.includes("Product") && !types.includes("ProductGroup")) {
        issues.push(`${product.name}: structured data lacks Product or ProductGroup`);
      }
      if (!types.includes("BreadcrumbList")) {
        issues.push(`${product.name}: structured data lacks BreadcrumbList`);
      }
    } catch {
      issues.push(`${product.name}: invalid JSON-LD`);
    }
  }
}

if (!(await exists(path.join(root, "public", "og.png")))) {
  issues.push("missing public/og.png");
}

if (!(await exists(path.join(root, "assets", "js", "shop.js")))) {
  issues.push("missing shared basket and quick-view script");
}

const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
for (const product of products) {
  if (!sitemap.includes(`/produtos/${product.id}</loc>`)) {
    issues.push(`${product.name}: missing from sitemap`);
  }
}

const locationPage = await readFile(path.join(root, "localizacao.html"), "utf8");
for (const requiredLocationValue of [
  "Win Win Pet Shop",
  "-26.005223536704786",
  "32.41639891609725",
  '"opens": "09:00"',
  '"closes": "19:00"',
  '"opens": "08:00"',
  '"closes": "13:00"',
  "maps.google.com/maps"
]) {
  if (!locationPage.includes(requiredLocationValue)) {
    issues.push(`location page missing "${requiredLocationValue}"`);
  }
}

if (issues.length) {
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${pages.length} core pages, ${products.length} product families, ${variants.length} stock lines and ${inventoryValue} MT.`
  );
}
