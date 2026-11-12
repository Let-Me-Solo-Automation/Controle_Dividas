# Marks — simulador interativo

Reformulação do `Nexo-Simulador_1.html` enviado, com React, Tailwind CSS 4 e Motion (`motion/react`, evolução do Framer Motion). As regras financeiras, valores em centavos, demonstração, backup e validação de dados foram preservados.

## Ativação na sua conta

O site está publicado em https://let-me-solo-automation.github.io/Controle_Dividas/ e conectado ao Firebase `marks-79823`. Authentication e Firestore estão conectados. O fluxo anterior com e-mail/senha foi validado no site real; o compartilhamento sem cadastro usa o método Anônimo, ativado pelo administrador e verificado em 12/11/2026; veja `CONFIGURAR-ONLINE.md`. O repositório usado é `Let-Me-Solo-Automation/Controle_Dividas`.

## Site e compartilhamento gratuito

O projeto está preparado para GitHub Pages + Firebase Spark, sem faturamento. O site e o código ficam no GitHub; somente os acordos escolhidos são enviados ao Firestore. O arquivo `FIREBASE-GRATUITO.md` descreve a ativação pelo `Configurar-Firebase.command` e as cotas gratuitas.

Para compartilhar, abra uma seção no site, escolha **Compartilhar seção**, toque em **Criar link sem vencimento**. O acesso para atualizar e revogar fica salvo neste navegador; limpar seus dados perde esse acesso, e o backup dos acordos não o recupera. Quem já publicava com e-mail/senha pode entrar na conta anterior pela opção recolhida. O destinatário consulta o link sem criar conta. A configuração pública real já está incluída; não execute o configurador para criar outro projeto.

## Interações nas telas reais

Os 19 exemplos enviados estão integrados ou adaptados ao uso diário: filtros no extrato, seções fixáveis, agenda, metas e aportes, histórico, destaques, criação e ajuda. Consulte `COMPONENTES-EM-USO.md` para o mapa completo. A página Referência das interações é documentação secundária.

O menu flutuante move o destaque, recolhe e então abre a opção. O controle único de aparência transforma sol em lua. Os indicadores têm espaço entre si e as linhas das seções têm contorno completo, sem o fundo das ações aparecendo nas bordas.

## Reservas, metas e indicadores

A página inicial usa CarouselNavigator nos KPIs reais, filtro de indicadores, TaskWidget nas metas e seções fixáveis. Os gráficos do fluxo financeiro respeitam o estilo e a animação escolhidos na personalização.

Em Contas e reserva, cadastre bancos com descrição, cor e ícone próprio; registre múltiplos aportes/resgates com data e nota, inclusive criando o banco no mesmo formulário. O histórico é preservado e pode ser filtrado por banco. Objetivo e contribuição mensal são planejamento: não aumentam o patrimônio e não geram movimentos automáticos. Aportes/resgates alocam/liberam dinheiro existente; entradas/saídas reais continuam no extrato.

O AdaptiveSlider ajusta o valor das metas, além do formulário de aporte. Só salvar confirma a mudança. As barras e anéis revelam de zero até o progresso já realizado ao entrar na área visível, respeitando movimento reduzido.

## Apple Liquid Glass

No seletor **Tema do aplicativo**, escolha **Apple Claro**, **Apple Escuro** ou **Apple Sistema**. As mesmas opções aparecem em Menu → Personalização. Sistema acompanha a aparência do aparelho sem reiniciar a tela; a escolha é persistida. O catálogo foi concentrado em Apple Sistema, Apple Claro, Apple Escuro, Obsidiana e Rubi. Preferências antigas migram sem alterar seus registros. Obsidiana tem brilho sutil nos valores; Rubi usa tons bordô.

A implementação web usa superfícies sólidas para saldos/extratos e vidro nos controles, fontes do sistema, cores por aparência e alternativas opacas para reduzir transparência ou aumentar contraste. A moldura do simulador acompanha o tema; o destinatário do link vê a aparência de seu próprio aparelho. A entrada com blur foi preservada. Leia `APPLE-LIQUID-GLASS.md` para as referências Apple, decisões e limites da aproximação em CSS.

## Links sem vencimento

As regras atualizadas foram publicadas e verificadas no Firebase real. Para outro ambiente, siga `CONFIGURAR-ONLINE.md`. Os links novos ficam ativos até Revogar acesso. A tela mostra o endereço, uma prévia dentro do app e a ação discreta de revogação. Compartilhar novamente cria um endereço diferente; o antigo permanece bloqueado, inclusive contra tentativas de atualização por abas antigas.

## Abrir a prévia agora

Abra **`dist/Marks-Simulador.html`** no navegador. É um único HTML com JavaScript, CSS, ícones e fontes incorporados. A navegação e os registros funcionam offline; não precisa instalar nada para validar a interface.

Os dados ficam no navegador que abriu o arquivo. Exporte um backup antes de mudar de navegador, mover o arquivo ou limpar dados de navegação. Quando o navegador impedir armazenamento local, a interface informa “Sessão em memória”.

## Instalar a pasta na Mesa do Mac

1. Extraia o ZIP.
2. Execute **`Instalar-na-Mesa.command`**. Ele copia o projeto para `~/Desktop/Marks`, instala as dependências e abre a prévia de desenvolvimento.
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

A entrada principal é **`Marks-Simulador.html`**, na raiz. O nome anterior `Nexo-Simulador_1.html` permanece como compatibilidade. Edite a interface em `src/`; ao salvar, o servidor atualiza a prévia. `src/generated/` é recriada automaticamente e não deve ser editada.

```bash
npm run check  # TypeScript dos componentes novos e dos exemplos
npm run build  # gera dist/Marks-Simulador.html, autossuficiente
npm exec playwright install chromium
npm test       # testes de fluxos financeiros e interface
npm run test:model     # privacidade da projeção e cálculo das parcelas
npm run test:reserve   # saldo real, limites e histórico de aportes/resgates
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
- Personalização: cinco temas, quatro estilos de gráfico, animações de desenho/crescimento/sequência, ritmos de movimento e microinterações combináveis. As prévias são animadas e têm Repetir prévia. Há seis estilos de navegação, combinações nomeadas e Restaurar padrão.
- Laboratório: **Menu → Personalização → Explorar interações**. Os exemplos têm estado demonstrativo próprio; não alteram registros financeiros.
- Modais: entrada e saída com molas, foco contido, fechamento por Esc e retorno do foco.
- Movimento reduzido: a preferência do sistema tem prioridade. O app também oferece controles de movimento.

## Referência de design e limites do protótipo

Foi possível consultar o arquivo Figma fornecido: página **Materials**, material Regular Light (`510:82535`) e **Tab Bars**, barra com três abas (`10508:1091`). Transparência, contornos, espaçamento e seleção foram adaptados ao conteúdo e aos ícones do Marks. É uma interpretação para web, sem afirmar equivalência com a renderização nativa do Liquid Glass.

Os anexos foram tratados como código de referência. O accordion duplicado foi unificado. Corrigimos os fundos inválidos do CarouselNavigator, o ciclo de navegação, rótulos dos novos botões, isolamento de `layoutId`, datas fixas de 2024 no CalendarWidget e o mapa externo da demonstração.

A `ContextualAIBar` funciona como atalhos e busca local na tela inicial; nenhum serviço de IA está conectado. A agenda financeira alterna semana/mês e mostra compromissos reais, sem sincronização com o Google Calendar. O componente de trajeto aparece somente com coleta e destino preenchidos e abre a rota no Google Maps, sem chave de API. Não calcula coordenadas ou distâncias automaticamente.

A arquitetura proposta para compartilhar seções pelo Google Drive está em `GOOGLE-DRIVE.md`. Essa integração ainda não está conectada.

Este projeto valida a interface web. Ele não gera APK. Biometria/bloqueio, vibração e notificações dependem da ponte nativa Android. O compartilhamento usa o Firebase `marks-79823`. Os dados da seção são enviados ao publicar e sincronizados após alterações; dados locais sem compartilhamento não são enviados. O restante do aplicativo continua local.

## Dependências e licenças

As dependências e versões exatas estão em `package-lock.json`. React, Motion, Lucide, React Icons, Hugeicons e react-use-measure seguem suas respectivas licenças, incluídas nos pacotes npm. A compilação mantém os avisos legais dos bundles. Os exemplos e as fontes incorporadas foram fornecidos no material original.

## Downloads pelo site

Use os botões **Baixar projeto** e **Baixar HTML** no cabeçalho, sem depender de artefatos desta conversa. Os endereços públicos são:

- https://let-me-solo-automation.github.io/Controle_Dividas/downloads/Marks-projeto.zip
- https://let-me-solo-automation.github.io/Controle_Dividas/Marks-Simulador.html

A compilação gera o ZIP completo, incluindo o configurador Firebase para Mac, os fontes e o HTML offline. Dados de navegação, backups pessoais, credenciais, node_modules e pastas de execução não entram no pacote. O ícone da marca foi aproximado a partir da imagem fornecida. As chaves de armazenamento anteriores são mantidas para preservar seus registros locais.

## Efeito de revelação e tutorial

A entrada das telas volta a revelar o conteúdo com blur, opacidade e deslocamento suave. Os cartões também revelam ao entrar na área visível. A preferência de movimento reduzido do sistema e os controles de animação do app continuam tendo prioridade.

Tutorial do Firebase, pelo navegador: https://let-me-solo-automation.github.io/Controle_Dividas/tutorial-firebase.html . O guia também fica em TUTORIAL-FIREBASE.md e inclui o conteúdo completo das regras.
