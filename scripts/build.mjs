import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

const pages = [
  "index.html",
  "produtos.html",
  "sobre.html",
  "contactos.html",
  "localizacao.html",
  "faq.html",
  "404.html",
  "robots.txt"
];

await rm(dist, { recursive: true, force: true });
await mkdir(client, { recursive: true });
await mkdir(server, { recursive: true });
await cp(path.join(root, "assets"), path.join(client, "assets"), { recursive: true });
await cp(path.join(root, "public"), client, { recursive: true });

for (const page of pages) {
  await cp(path.join(root, page), path.join(client, page));
}

const worker = `const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const LEGACY_REDIRECTS = {
  "/blog.html": "/index.html",
  "/racoes.html": "/produtos.html?categoria=alimentacao",
  "/acessorios.html": "/produtos.html?categoria=acessorios",
  "/brinquedos.html": "/produtos.html",
  "/racao-classic-adult-25kg.html": "/produtos.html?produto=montego-classic-adult",
  "/racao-classic-adult-40kg.html": "/produtos.html?produto=montego-classic-adult",
  "/racao-jock-multistage-20kg.html": "/produtos.html?produto=jock-multistage",
  "/caixa-transportadora-para-pets.html": "/produtos.html?produto=caixa-transporte",
  "/acaimo-para-caes.html": "/produtos.html?produto=focinheiras-caes",
  "/coleiras-coloridas-para-pets.html": "/produtos.html?produto=coleiras-sonoras-gatos"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    if (!pathname.split("/").pop().includes(".")) pathname += ".html";
    if (LEGACY_REDIRECTS[pathname]) {
      return Response.redirect(new URL(LEGACY_REDIRECTS[pathname], request.url), 301);
    }

    const assetUrl = new URL(pathname, request.url);
    const response = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (response.status !== 404) {
      const headers = new Headers(response.headers);
      const extension = pathname.slice(pathname.lastIndexOf(".")).toLowerCase();
      if (!headers.has("content-type") && MIME[extension]) {
        headers.set("content-type", MIME[extension]);
      }
      headers.set("x-content-type-options", "nosniff");
      headers.set("referrer-policy", "strict-origin-when-cross-origin");
      return new Response(response.body, { status: response.status, headers });
    }

    const fallback = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url), request));
    return new Response(fallback.body, { status: 404, headers: fallback.headers });
  }
};
`;

await writeFile(path.join(server, "index.js"), worker, "utf8");

const hosting = JSON.parse(await readFile(path.join(root, ".openai", "hosting.json"), "utf8"));
await mkdir(path.join(dist, ".openai"), { recursive: true });
await writeFile(
  path.join(dist, ".openai", "hosting.json"),
  `${JSON.stringify(hosting, null, 2)}\n`,
  "utf8"
);

console.log(`Built ${pages.length} public files plus shared assets.`);
