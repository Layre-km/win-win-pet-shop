# Win Win Pet Shop

Site estático, multipágina e sem dependências para a Win Win Pet Shop, em Maputo, Moçambique.

## Desenvolvimento

Não é necessário PHP, Node.js ou qualquer processo de compilação. Abra `index.html` directamente no navegador ou sirva esta pasta com qualquer servidor estático (por exemplo, o Live Server do VS Code).

Estrutura principal:

- `*.html` — páginas estáticas e semânticas;
- `assets/css/style.css` — estilos responsivos;
- `assets/js/main.js` — menu móvel e animações subtis;
- `assets/images/` — imagem e favicon da marca;
- `sitemap.xml` e `robots.txt` — base de SEO.

## Antes de publicar

- Adicione o endereço completo, horário, telefone e WhatsApp reais em `contactos.php` e `localizacao.php`.
- Confirme que o domínio oficial é `winwinpetshop.co.mz`; se for diferente, faça uma substituição global desse URL nos meta tags e em `sitemap.xml`.
- Ligue o formulário de contacto a Formspree, Netlify Forms ou uma API segura; nesta versão ele é apenas visual.
- Após publicação, submeta o sitemap ao Google Search Console e complete o Perfil de Empresa no Google com dados consistentes.

O site usa metadados, Open Graph, dados estruturados `PetStore`, HTML semântico, URLs canónicos, mapa do site e `robots.txt` como fundação de SEO. Nenhum site pode garantir a primeira posição no Google: relevância local, perfil de empresa, avaliações e conteúdo real também contam.
