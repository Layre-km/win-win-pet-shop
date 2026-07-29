import { access, readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

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
}

if (!(await exists(path.join(root, "public", "og.png")))) {
  issues.push("missing public/og.png");
}

if (issues.length) {
  console.error(issues.map((issue) => `- ${issue}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${pages.length} core pages, ${products.length} product families, ${variants.length} stock lines and ${inventoryValue} MT.`
  );
}
