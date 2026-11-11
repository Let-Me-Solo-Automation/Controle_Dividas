# Nexo — simulador interativo

Reformulação do `Nexo-Simulador_1.html` enviado, com React, Tailwind CSS 4 e Motion (`motion/react`, evolução do Framer Motion). As regras financeiras, valores em centavos, demonstração, backup e validação de dados foram preservados.

## Site e compartilhamento gratuito

O projeto está preparado para GitHub Pages + Firebase Spark, sem faturamento. O site e o código ficam no GitHub; somente os acordos escolhidos são enviados ao Firestore. O arquivo `FIREBASE-GRATUITO.md` descreve a ativação pelo `Configurar-Firebase.command` e as cotas gratuitas.

A conexão Firebase depende da autorização Google do proprietário e da publicação da configuração pública real. Até essa etapa, o app informa que o compartilhamento ainda não foi ativado.

## Abrir a prévia agora

Abra **`dist/Nexo-Simulador_1.html`** no navegador. É um único HTML com JavaScript, CSS, ícones e fontes incorporados. A navegação e os registros funcionam offline; não precisa instalar nada para validar a interface.

Os dados ficam no navegador que abriu o arquivo. Exporte um backup antes de mudar de navegador, mover o arquivo ou limpar dados de navegação. Quando o navegador impedir armazenamento local, a interface informa “Sessão em memória”.

## Instalar a pasta na Mesa do Mac

1. Extraia o ZIP.
2. Execute **`Instalar-na-Mesa.command`**. Ele copia o projeto para `~/Desktop/Nexo-Simulador`, instala as dependências e abre a prévia de desenvolvimento.
3. Em próximos acessos, execute `Iniciar.command` nessa pasta.

O instalador preserva pastas já existentes, criando uma pasta com data e hora. Se não houver uma versão compatível do Node, baixa o **Node.js 24 LTS oficial para Intel ou Apple Silicon**, confere SHA-256 e o instala dentro de `.runtime/` no próprio projeto. Não usa `sudo`, não exige Homebrew nem altera a instalação global do Node.

Se o macOS pedir autorização para abrir um arquivo `.command` baixado, use o Terminal na pasta extraída:

```bash
bash Instalar-na-Mesa.command
```

Esta entrega foi instalada e testada em Linux/Chromium. O script de macOS foi revisado e validado sintaticamente; sua execução no Mac depende do acesso à internet e das permissões locais.

## Editar e gerar o HTML

```bash
npm ci
npm run dev
```

A entrada continua sendo **`Nexo-Simulador_1.html`**, na raiz. Edite a interface em `src/`; ao salvar, o servidor atualiza a prévia. `src/generated/` é recriada automaticamente e não deve ser editada.

```bash
npm run check  # TypeScript dos componentes novos e dos exemplos
npm run build  # gera dist/Nexo-Simulador_1.html, autossuficiente
npm exec playwright install chromium
npm test       # testes de fluxos financeiros e interface
npm run test:model     # privacidade da projeção e cálculo das parcelas
npm run test:firebase  # regras e fluxo completo em emuladores (requer Java 21+)
```

O servidor de desenvolvimento atende somente em `127.0.0.1`. Para interrompê-lo, pressione Control+C no Terminal.

## Onde está cada parte

| Arquivo/pasta | Uso |
| --- | --- |
| `Nexo-Simulador_1.html` | Entrada HTML de desenvolvimento |
| `original/Nexo-Simulador_1.original.html` | Cópia intacta do arquivo recebido |
| `src/simulator-entry.tsx` | Moldura, temas, visores e controles de validação |
| `src/components/nexo-ui.tsx` | Navegação, abas, busca, modais, valores e controles com Motion |
| `src/components/reference/` | Os 13 exemplos únicos dos anexos, em TSX editável |
| `src/components/ComponentGallery.tsx` | Laboratório com os 19 componentes únicos enviados |
| `src/styles.css` | Tailwind, tokens e apresentação do app |
| `src/simulator.css` | Apresentação da área de validação |
| `src/legacy/NexoApp.jsx` | Lógica do aplicativo recuperada do HTML, conectada aos novos componentes |
| `src/legacy/domain.js` | Validação, temas e dados demonstrativos do simulador |
| `scripts/build.mjs` | HTML offline, index.html e página de acompanhamento |
| `src/sharing/` | Publicação no Firebase, projeção privada e acompanhamento |
| `firebase/firestore.rules` | Regras de leitura, propriedade, revogação e prazo |
| `scripts/setup-firebase.mjs` | Criação e configuração do projeto Spark no Mac |
| `.github/workflows/pages.yml` | Compilação e publicação automática no GitHub Pages |
| `tests/simulator.spec.ts` | Testes de navegação, centavos, persistência, temas e responsividade |

## O que validar

- Menu minimalista: o botão + translúcido expande uma bandeja com ícones para Início, Seções, Entregas, Metas e criação de registros. A bandeja se recolhe após uma ação e o menu some nas telas auxiliares.
- Calendário: tocar novamente no ícone retorna à tela anterior, incluindo o detalhe da seção e a posição da rolagem.
- Busca: lupa ou ⌘K/Ctrl+K dentro do app, com navegação por setas, Enter e Esc; foco suave no grupo, sem contorno verde no campo de texto.
- Personalização: 15 temas, preferências visuais e intensidade do desfoque. As preferências têm prévia e botão Salvar.
- Laboratório: **Menu → Personalização → Testar todos os componentes**. Os exemplos têm estado demonstrativo próprio; não alteram registros financeiros.
- Modais: entrada e saída com molas, foco contido, fechamento por Esc e retorno do foco.
- Movimento reduzido: a preferência do sistema tem prioridade. O app também oferece controles de movimento.

## Referência de design e limites do protótipo

Foi possível consultar o arquivo Figma fornecido: página **Materials**, material Regular Light (`510:82535`) e **Tab Bars**, barra com três abas (`10508:1091`). Transparência, contornos, espaçamento e seleção foram adaptados ao conteúdo e aos ícones do Nexo. É uma interpretação para web, sem afirmar equivalência com a renderização nativa do Liquid Glass.

Os anexos foram tratados como código de referência. O accordion duplicado foi unificado. Corrigimos os fundos inválidos do CarouselNavigator, o ciclo de navegação, rótulos dos novos botões, isolamento de `layoutId`, datas fixas de 2024 no CalendarWidget e o mapa externo da demonstração.

A `ContextualAIBar` está disponível no laboratório como barra de busca demonstrativa; nenhum serviço de IA está conectado. O mapa é ilustrativo e offline. Agenda, acordos, contas, entregas e metas usam o núcleo existente; os cartões extras permanecem no laboratório para validação antes da integração específica no Android.

A arquitetura proposta para compartilhar seções pelo Google Drive está em `GOOGLE-DRIVE.md`. Essa integração ainda não está conectada.

Este projeto valida a interface web. Ele não gera APK. Biometria/bloqueio, vibração e notificações dependem da ponte nativa Android. O compartilhamento usa o Firebase, após ativação. Os dados da seção são enviados ao publicar e sincronizados após alterações; dados locais sem compartilhamento não são enviados. O restante do aplicativo continua local.

## Dependências e licenças

As dependências e versões exatas estão em `package-lock.json`. React, Motion, Lucide, React Icons, Hugeicons e react-use-measure seguem suas respectivas licenças, incluídas nos pacotes npm. A compilação mantém os avisos legais dos bundles. Os exemplos e as fontes incorporadas foram fornecidos no material original.
