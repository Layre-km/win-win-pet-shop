# Win Win Pet Shop

Catálogo multipágina da Win Win Pet Shop, em Matola, Moçambique. O site apresenta as 34 linhas do relatório de stock de 19 de Julho de 2026 em 27 famílias de produto e encaminha as encomendas para o WhatsApp.

## Desenvolvimento

```powershell
npm.cmd run dev
```

O servidor local fica disponível em `http://127.0.0.1:8080`.

## Validação e build

```powershell
npm.cmd run validate
npm.cmd run build
```

- `assets/js/catalog.js` contém o catálogo agrupado, as opções, os preços por unidade e as quantidades.
- `scripts/validate.mjs` reconcilia famílias, linhas de stock, valor calculado e referências locais.
- `dist/client` contém os ficheiros públicos.
- `dist/server/index.js` é o entrypoint do Worker para alojamento.

O domínio personalizado ainda não foi definido. Quando existir, adicione URLs canónicas e gere um sitemap com esse domínio antes de o submeter ao Google Search Console.
