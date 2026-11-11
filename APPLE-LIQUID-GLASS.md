# Tema Apple para o Marks

Status: implementação entregue no código, com **Apple Claro, Apple Escuro e Apple Sistema** no app e no Design Studio. A visualização compartilhada usa a mesma base visual clara/escura, conforme a aparência do visitante. Os 15 estilos atuais continuam disponíveis. Dados financeiros e regras de publicação/revogação não foram alterados pelo tema.

## Como ativar

No Design Studio, escolha **Aparência → Tema do aplicativo → Apple Sistema**, **Apple Claro** ou **Apple Escuro**. Na família Apple, os botões Claro/Escuro/Sistema permitem alternar a aparência diretamente. Dentro do app, abra **Menu → Personalização** e selecione um dos três cartões Apple; use **Salvar** para confirmar a prévia. O menu de perfil também oferece a troca clara/escura dentro da família Apple e a opção Sistema.

A escolha fica em `settings.theme`, com os IDs `apple-light`, `apple-dark` e `apple-system`. Sistema acompanha mudanças do aparelho sem recarregar o aplicativo. Trocar o tema pelo Studio também mantém a sessão do iframe, a tela atual e os registros financeiros.

## O que aproveitar das orientações oficiais

As referências são [Adopting Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass), [HIG — Materials](https://developer.apple.com/design/human-interface-guidelines/materials) e [HIG — Color](https://developer.apple.com/design/human-interface-guidelines/color).

A Apple descreve Liquid Glass como uma camada funcional para controles e navegação, separada do conteúdo. A orientação de Materials é explícita: não usar Liquid Glass na camada de conteúdo. No Marks, o vidro foi aplicado à navegação flutuante, barras e menus; saldos, extratos, gráficos e formulários recebem superfícies estáveis. A identidade Apple vem também da hierarquia, tipografia, espaçamento e consistência entre estados.

O material **regular** é a referência apropriada para controles sobre conteúdo variável, por sua maior proteção à leitura. **Clear** é destinado principalmente a fundos visualmente ricos, como fotos e vídeos, e pode exigir escurecimento do fundo. Não será o padrão do Marks. Cor de destaque identifica ações principais e estados selecionados; não precisa tingir todo o vidro. Separação ao rolar deve preservar a leitura sob barras fixas.

Na web, `backdrop-filter`, preenchimentos translúcidos, bordas e sombras permitem uma aproximação visual. Eles não oferecem o material nativo, sua refração ou a adaptação automática das APIs Apple. Não adotaremos uma dependência de WebGL para tentar reproduzi-lo.

## Base reaproveitada e mudanças entregues

| Arquivo | Mudança |
|---|---|
| [apple-themes.js](src/apple-themes.js) e [domain.js](src/legacy/domain.js) | Paletas Apple compartilhadas; o catálogo exportado reúne os 15 temas existentes e as três escolhas Apple. |
| [NexoApp.jsx](src/legacy/NexoApp.jsx) e [use-system-dark.ts](src/use-system-dark.ts) | App usa o catálogo comum, resolve Sistema com assinatura de `matchMedia`, aplica tokens antes da pintura e mantém a preferência selecionada. |
| [styles.css](src/styles.css) | Escopo Apple para conteúdo sólido, cartão principal sem verde fixo, controles de vidro e alternativas acessíveis. |
| [simulator-entry.tsx](src/simulator-entry.tsx) e [simulator.css](src/simulator.css) | Seletor, atalhos e moldura externa acompanham a aparência Apple; a troca manual usa mensagens para preservar a sessão. |
| [viewer.css](src/sharing/viewer.css) | Paleta Apple neutra e textos com contraste reforçado, seguindo o SO do visitante. |
| [nexo-ui.tsx](src/components/nexo-ui.tsx) | A base existente de redução de movimento e entradas com desfoque foi preservada, sem reescrever suas animações. |

## Aparência e tokens implementados

A família visual é separada da aparência resolvida: Claro e Escuro são variantes da mesma interface; Sistema reage ao aparelho e preserva a escolha. `color-scheme`, `theme-color` e a ponte nativa existente recebem o modo resolvido. No app, `data-theme-choice` mantém a preferência e `data-theme` indica a variante clara/escura efetiva.

App e Studio compartilham a aparência durante a sessão. A página compartilhada segue Sistema, sem publicar preferências do proprietário nem acrescentar campos ao conteúdo financeiro. Ela não oferece um seletor manual nesta entrega. Os temas existentes mantêm suas características; as novas regras visuais ficam limitadas à família Apple.

Estes tokens são um ponto de partida verificado para **superfícies opacas**, não uma reprodução de cores oficiais Apple:

| Token semântico | Claro | Escuro |
|---|---|---|
| Fundo | `#F2F2F7` | `#000000` |
| Superfície | `#FFFFFF` | `#1C1C1E` |
| Texto principal | `#1C1C1E` | `#F5F5F7` |
| Texto secundário | `#54545C` | `#B8B8C0` |
| Ação/destaque | `#0066CC` | `#409CFF` |
| Texto sobre ação preenchida | `#FFFFFF` | `#001D3D` |

Pelo cálculo WCAG em sRGB, o menor contraste do texto principal, secundário e destaque sobre fundo/superfície é, respectivamente, **15,25 / 6,72 / 4,99:1 no claro** e **15,63 / 8,63 / 6,01:1 no escuro**. Texto sobre ação preenchida: **5,57:1** e **5,97:1**. Materiais translúcidos, estados, mensagens de erro, sucesso e gráficos precisam de validação própria sobre seus fundos reais.

A fonte usa `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`, sem baixar ou redistribuir SF Pro. Os números tabulares são preservados, com aumento de rótulos e descrições pequenos nas superfícies Apple.

## Contraste, acessibilidade e movimento

A meta é **4,5:1 para texto normal**, **3:1 para texto grande** e **3:1 para informação visual necessária à identificação de controles e gráficos**. Não depender apenas de cor para comunicar status. Os cálculos das cores declaradas apontam problemas atuais: secundário Porcelana/fundo em aproximadamente **4,39:1**, subtítulo do viewer em **3,29:1** e introdução do Studio em **3,17:1**. São estimativas estáticas, não resultados de uma auditoria completa da interface renderizada.

Desligar vidro ou reduzir transparência agora retira os desfoques dos controles, cabeçalho, perfil e fundos de modal. Contraste aumentado reforça bordas e textos; `forced-colors` recebe superfícies do sistema. Na família Apple, controles do dock e botões de ícone passam a **44 × 44 px CSS**, com rolagem horizontal do painel caso falte espaço. Os atalhos do Studio e atualizar da página compartilhada também têm área mínima de 44 px. O desenho dos ícones continua discreto.

**A entrada com desfoque solicitada foi preservada**, acompanhada de opacidade/deslocamento. Redução de movimento continua apresentando o conteúdo diretamente. Ajustes de duração e escalonamento em aparelhos específicos ficam para medição posterior, sem remover o efeito pedido.

O vidro Apple usa preenchimento de 96% e desfoque restrito a controles, sem animação contínua do raio ou shader. As barras mantêm `scaleX`. Há preenchimento opaco quando `backdrop-filter` não é suportado. A intensidade final deve ser medida em aparelhos reais, inclusive fora do iframe.

## Validação e próximos refinamentos

`npm run check` passou após a implementação. Os critérios para a verificação funcional são: seleção persistida após recarregar; mudança do SO sem perder tela ou registros; seleção manual independente do SO; 18 escolhas válidas no catálogo; ausência de estouro horizontal no celular; contraste dos tokens conforme a tabela.

Antes de declarar conformidade de toda a interface, conferir contraste renderizado de todos os estados, zoom, teclado, áreas seguras e rolagem em Safari móvel e Chromium. Os fluxos de consultar, cadastrar, publicar e revogar precisam permanecer íntegros. Ficam como refinamentos futuros a medição de GPU em aparelhos reais, ajuste fino das entradas com desfoque e um eventual seletor de aparência independente na página compartilhada.

Esta entrega prioriza uma identidade coerente e legível, com o vidro servindo à orientação e aos controles.
