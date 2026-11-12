# Marks — documentação do projeto, operação e manutenção

Versão da entrega: **2.1.1**. Este documento descreve o que existe no código e como gerar, operar, testar e continuar o projeto. Leia também os documentos de Firebase e os comentários nas funções financeiras antes de alterar regras de saldo.

## 1. Conteúdo da entrega

- `Visualizador.html`: visualizador completo na raiz. Abre localmente; inclui o aplicativo num iframe e controles de tema/cenário/dispositivo.
- `Marks-Android.apk`: pacote Android assinado para instalação direta. Não é uma publicação na Play Store.
- `src/`: fontes React, TypeScript, JavaScript, CSS e imagens.
- `android/`: Activity Java, manifesto, recursos e diretório de assets gerado.
- `scripts/`: build web, preparação dos assets Android, compilação/assinatura Android, empacotamento e verificações dos modelos.
- `firebase/`: regras Firestore para publicação e revogação dos links.
- `tests/`: testes de interface com Playwright e testes das regras Firebase.
- `docs/`: documentação complementar e registro do README anterior.
- `public/firebase-config.json`: configuração pública do projeto Firebase. Não é uma credencial administrativa.
- `dist/`: saída gerada para GitHub Pages, demos, downloads e visualizadores.
- `original/`: material original preservado como referência, não como instruções executáveis.

`node_modules`, Android SDK, caches, relatórios, chaves privadas e pastas de compilação não fazem parte do código público. O ZIP inclui os arquivos necessários para reconstruir os artefatos, mas não as dependências instaladas.

## 2. Linguagens, bibliotecas e ferramentas

- **React 19**: componentes, estado e composição de telas.
- **TypeScript**: componentes novos, modelos e contratos de dados.
- **JavaScript/JSX**: núcleo financeiro recuperado do simulador e utilitários.
- **Tailwind CSS 4 + CSS**: utilitários, tokens de tema, responsividade e materiais de vidro.
- **Motion for React**: pacote `motion`, importado de `motion/react`; animações, feedback de toque e transições. É a biblioteca anteriormente conhecida como Framer Motion.
- **Lucide, React Icons e Hugeicons**: ícones.
- **Firebase Authentication e Cloud Firestore**: identidade anônima e compartilhamento somente de leitura por link revogável.
- **esbuild**: bundle do app e do visualizador.
- **Vite**: servidor de desenvolvimento conforme os scripts do projeto.
- **fflate**: criação do arquivo ZIP de distribuição.
- **Playwright**: testes de navegador.
- **Java e Android WebView**: contêiner nativo, seleção de arquivos, exportação de backup e navegação externa.
- **Android SDK Build Tools 35.0.0**: aapt, D8, zipalign e apksigner.
- **Node.js**: versão 22.12 ou superior. As versões exatas das dependências estão em `package-lock.json`.

A tabela completa das versões declaradas e o inventário dos fontes estão em `docs/INVENTARIO.md`.

## 3. Arquitetura e entradas

`src/app-entry.tsx` carrega o app. `src/legacy/NexoApp.jsx` contém o estado financeiro, validação de backup, navegação, formulários e a integração com componentes novos. Esse arquivo é grande porque preserva a lógica recuperada do HTML original; não é código gerado que deva ser descartado.

`src/components/` reúne os componentes usados na aplicação. `reference/` guarda os componentes de referência adaptados. `nexo-ui.tsx` centraliza preferências de animação, números, progresso, navegação e transições. `PersonalizationStudio.tsx` oferece prévias e configurações; `personalization.js` normaliza e limita os valores persistidos.

`src/features/trash/` implementa retenção e restauração. `src/features/forecast/` calcula a apresentação da previsão de saldo. `src/lib/reserve-model.ts` contém as regras das reservas e dos bancos. `src/sharing/` contém publicação, revogação e visualizador somente de leitura.

`src/simulator-entry.tsx` é uma entrada diferente da aplicação: controla o visualizador, os cenários e a comunicação com o iframe. `src/generated/` é descartável e é recriado pelo build.

`android/app/src/main/java/app/marks/finance/MainActivity.java` abre o app compilado localmente em `https://appassets.androidplatform.net/assets/index.html`. O HTML não depende de baixar o site para abrir. Requisições de rede do Firebase continuam precisando de internet.

## 4. Telas e recursos

### Contas e lançamentos

- Cadastro de bancos/carteiras, descrição, saldo inicial real, cor, ícone e imagem com ajuste de enquadramento.
- Receitas, despesas, transferências e busca por título, categoria e conta.
- Valores em centavos inteiros. Entradas positivas em verde; saídas em vermelho. Transferências representam movimento, sem inflar o total entre contas.
- O extrato renderiza inicialmente 50 registros e permite carregar mais. Os gráficos continuam calculando sobre todos os registros filtrados, não apenas a página visível.
- Comprovantes privados em imagem podem ser anexados depois de registrar o lançamento. O seletor de comprovantes desta versão não implementa anexos PDF.

### Seções e parcelas

- Acordos a pagar, a receber e seções de organização.
- Parcelamento, pagamentos parciais, transporte da diferença e parcelas extras conforme o modelo original.
- A parcela paga pode abrir diretamente os controles de comprovante do lançamento vinculado.
- A exclusão de seção preserva o extrato confirmado e remove os vínculos ativos; a lixeira conserva os vínculos para tentar restaurá-los de forma transacional.
- Uma seção com link ativo precisa ter o acesso revogado antes de ser excluída.

### Metas e reservas

- Objetivo, data, prioridade, situação e aportes/resgates.
- Até quatro metas fixadas no widget inicial; progresso e check calculados pelo valor realmente guardado.
- A conclusão é exibida automaticamente quando o guardado atinge o objetivo.
- A meta futura não compõe patrimônio. Separar dinheiro numa meta/reserva também não cria receita nova.
- Reservas têm histórico de aportes/resgates, notas curtas, objetivo e planejamento mensal.

### Agenda e projeção

- Visões de dia, semana, mês e ano, com compromissos reais cadastrados.
- Feriados nacionais fixos destacados. Pontos facultativos não são tratados como feriado nacional. A lista de datas está no componente e deve ser revista se a legislação mudar.
- A previsão de 30 dias parte do saldo atual e aplica parcelas e recorrências pendentes do período. Não inventa receitas e não desconta metas como se fossem despesas. É uma estimativa, não uma garantia de fluxo futuro.

### Aparência e movimento

- Temas, claro/escuro, estilos de navegação, material de vidro e conjuntos visuais salvos.
- **Vidro neon**: opção de navegação inspirada nos botões enviados, com reflexo e iluminação colorida. Os efeitos são limitados ao menu e respeitam a preferência de movimento reduzido.
- **Aberração cromática removida**: não há controle nem desenho cromático de borda.
- Opacidade do vidro e blur são independentes. Blur `0` significa `blur(0px)`; a saturação do material pode continuar ativa.
- Prévias com cores, textos, gráfico e menu interativo. Salvar mostra carregamento, confirmação e estado salvo.
- Gráficos de área, linha, barras, barras horizontais e rosca. A tabela acessível permite consultar valores precisos.
- Números e gráficos podem animar ao entrar na área visível. Preferências de movimento e de transparência reduzidos têm prioridade.
- CSS `backdrop-filter` aproxima vidro fosco na web. Não é o renderizador nativo de Liquid Glass da Apple.

## 5. Lixeira, desfazer e exclusão definitiva

As exclusões confirmadas pelo diálogo do app arquivam os registros removidos e suas dependências num grupo em `data.trash`. Eles deixam imediatamente de participar de saldos e listas ativas. Os comprovantes de um lançamento excluído permanecem nesse grupo até a limpeza.

Em **Personalização → Lixeira**, escolha um número e a unidade **dias** ou **meses**, depois salve. `0` mantém os itens até a exclusão manual. O prazo começa na data de cada exclusão, não no dia em que a política foi configurada.

A limpeza é feita ao abrir, ao gravar alterações e periodicamente enquanto o app está aberto. **Não existe serviço de limpeza em segundo plano com o app fechado.** Ao reabrir, os itens vencidos são removidos antes de aparecerem. Meses usam o calendário, limitando o dia ao último dia do mês de destino; não são equivalentes fixos a 30 dias.

`Esvaziar lixeira` exige uma segunda confirmação e elimina todo o conteúdo da lixeira, sem apagar os registros ativos. Um prazo recém-salvo pode eliminar imediatamente itens que já excederam o prazo. Backups exportados anteriormente não são alterados pela limpeza.

`Restaurar` recupera o grupo e os vínculos quando ainda forem válidos. A gravação passa novamente pela validação financeira. Se a conta deixou de existir, houver conflito de identificadores ou a restauração reservar dinheiro acima do saldo disponível, a operação falha sem aplicar uma restauração parcial. A conta pode precisar ser restaurada primeiro.

O botão `Desfazer` da notificação permite recuperar a última exclusão enquanto a notificação está visível. A lixeira oferece o mesmo recurso depois.

A lixeira não equivale a estornar uma parcela. Parcelas e entregas possuem operações específicas de origem. Os registros usados pela integração de compartilhamento não são publicados junto à lixeira.

## 6. Armazenamento e privacidade

O app web direto usa `nexo-v1` no armazenamento local da sua origem. O visualizador usa `nexo-simulator-v1` no host e fornece uma ponte ao iframe. A demonstração de metas e o teste visual usam chaves diferentes. No Android, a origem local HTTPS do WebView mantém um armazenamento próprio do aplicativo.

Dados do navegador não aparecem automaticamente no Android. Use **Exportar backup JSON** e depois **Importar backup**. Confira os valores antes de continuar. O armazenamento local tem a cota do navegador/WebView; muitos comprovantes grandes podem atingir esse limite. A gravação informa falhas em vez de confirmar uma alteração que não foi persistida. O backup é um arquivo legível e pode conter valores financeiros, notas, comprovantes e informações de compartilhamento; armazene-o de forma privada.

`allowBackup=false` está definido no Android. Desinstalar o app ou limpar seus dados remove o armazenamento local. Exportar backup é a forma implementada de preservar os dados fora da instalação.

Chaves administrativas, conta de serviço Firebase e chave privada de assinatura Android não pertencem ao frontend. A configuração pública Firebase é necessária para o cliente e está incluída.

Comprovantes ficam locais e no backup. O compartilhamento de seção usa uma projeção de dados: não é uma sincronização completa das contas pessoais. Consulte `tests/firebase.rules.mjs`, `firebase/firestore.rules` e `src/sharing/model.ts` para os limites exatos.

A identidade anônima do Firebase pertence ao armazenamento daquele dispositivo/navegador. Um backup financeiro não é um backup da sessão de autenticação. Apagar dados ou desinstalar pode fazer perder a capacidade de administrar links daquela identidade. Revogue links antes de descartar a instalação e não trate autenticação anônima como recuperação de conta entre aparelhos.

## 7. Firebase e GitHub Pages

Projeto configurado: `marks-79823`. O arquivo `public/firebase-config.json` fornece os identificadores públicos. São usados Authentication e Firestore; não há requisito de Firebase Storage para os comprovantes locais.

O aplicativo permite identidade anônima para publicar sem pedir e-mail/senha. O projeto Firebase precisa ter esse provedor habilitado, o Firestore criado e as regras publicadas. Veja `TUTORIAL-FIREBASE.md`, `FIREBASE-GRATUITO.md` e `CONFIGURAR-ONLINE.md`.

Os links antigos que usavam o endereço público do GitHub Pages não abrem o visualizador depois da retirada do site. Publicar dados no Firebase não hospeda automaticamente a página de leitura; para voltar a compartilhar links utilizáveis será necessário configurar uma hospedagem permitida pelo proprietário para esse visualizador.

Links não vencem pelo tempo. A revogação atualiza/remove a autorização no servidor. Um novo compartilhamento deve gerar uma autorização nova. Revogar corta consultas futuras ao servidor, mas não apaga capturas de tela nem dados já copiados pelo destinatário.

O site público anterior do GitHub Pages foi retirado a pedido do proprietário. O workflow atual em `.github/workflows/` só compila quando o repositório é privado e guarda artefatos autenticados do Actions; ele não publica `dist/` como site. O Firebase continua sendo o serviço remoto, não o GitHub. O plano gratuito tem cotas; não foi contratado um plano pago e não há garantia de capacidade ilimitada.

A versão Android guardada em `public/Marks-Android.apk` é um artefato assinado preparado separadamente; o nome da pasta public não cria uma publicação online por si só. O build web não recompila Java automaticamente. Para atualizar o APK após mudar o app, siga a seção Android.

## 8. Desenvolvimento e build web

Requisitos: Node 22.12+, npm, acesso à rede para `npm ci` e um navegador recente. No Mac, abra o Terminal na raiz extraída.

```sh
npm ci
npm run check
npm run build
npm run dev
```

`npm ci` usa o lockfile. `npm run build` também prepara os assets locais do contêiner Android, sem exigir o SDK para essa etapa. Ele gera o HTML interno, o visualizador completo, as páginas de compartilhamento/tutorial, as demos isoladas e o ZIP. O build copia o visualizador para `Visualizador.html` na raiz. O conteúdo pode ser grande porque carrega fontes, ícone e JavaScript no mesmo HTML.

`npm run preview` é uma alternativa para servir a saída com Vite. Os scripts `.command` existentes são atalhos para Mac; examine o conteúdo para verificar os pré-requisitos locais.

A raiz contém wrappers históricos `Nexo-Simulador_1.html` e `Marks-Simulador.html`. O arquivo autônomo solicitado para abrir diretamente é **Visualizador.html**; o arquivo de mesmo nome em `dist/` é gerado a partir dos fontes.

Não edite `src/generated`, `dist`, o APK nem o HTML empacotado para uma correção permanente. Edite `src`, gere novamente e repita os testes afetados.

## 9. Compilar e instalar Android

Identidade do pacote: `app.marks.finance`. Versão inicial desta embalagem: `versionCode=2`, `versionName=2.1.1`. Plataforma de compilação e alvo: API 35. Versão mínima: API 26, Android 8.0.

Requisitos: JDK 21 (ou um JDK compatível com o compilador Java 8 usado), Android SDK com `platforms;android-35` e `build-tools;35.0.0`, Python 3 e Node/npm. Aceite as licenças do SDK na sua máquina.

Exemplo de instalação das partes do SDK, depois de instalar as Android Command Line Tools:

```sh
sdkmanager 'platforms;android-35' 'build-tools;35.0.0'
sdkmanager --licenses
```

Esta embalagem usa diretamente aapt, o compilador Java, D8, zipalign e apksigner; **não exige Gradle**. O código Java está na estrutura convencional `android/app/src/main`. Não é um projeto com sincronização Gradle/Android Studio já configurada.

Guarde o keystore e a senha entregues separadamente. Não os coloque em `public`, `src` ou no Git. Para criar uma identidade diferente de desenvolvimento, gere seu próprio keystore com `keytool`; isso produz outro assinante e não substitui uma instalação existente assinada com a chave desta entrega.

Na raiz do projeto:

```sh
npm ci
npm run build
export MARKS_ANDROID_SDK='/caminho/para/Android/sdk'
export MARKS_KEYSTORE='/caminho/privado/marks-local.jks'
export MARKS_KEYSTORE_PASSWORD_FILE='/caminho/privado/password.txt'
bash scripts/build-android.sh
```

O script prepara `android/app/src/main/assets/index.html`, compila Java para bytecode compatível, gera `classes.dex`, monta o pacote, alinha e assina. Saída: `output/Marks-Android.apk`. O script verifica a assinatura ao terminar. Os hashes do APK e do HTML embarcado estão em `docs/BUILD-INFO.json`.

Para instalar por cabo com as Platform Tools opcionais:

```sh
adb install -r output/Marks-Android.apk
```

Ou copie o APK para o telefone, abra-o e autorize a instalação por aquela fonte quando o Android solicitar. Essa autorização é uma ação do aparelho, não uma configuração que o site possa mudar.

Para publicar uma atualização compatível, preserve `package` e o keystore, incremente `android:versionCode` no manifesto e atualize `versionName`. Gere o APK novamente. Não desinstale a versão anterior para atualizar se quiser preservar os dados locais.

Após gerar um novo APK para distribuição:

```sh
cp output/Marks-Android.apk public/Marks-Android.apk
npm run build
```

Isso atualiza o arquivo de instalação distribuído pelo site e pelo ZIP. Alterações no APK precisam ser revisadas como qualquer outro artefato. A chave privada continua fora do projeto público.

### Integração Android implementada

- WebView local HTTPS com DOM Storage e JavaScript.
- Sem acesso geral a arquivos `file://`; conteúdo local é servido pelo interceptador apenas sob `/assets/`.
- Sites externos abrem no navegador/aplicativo externo.
- Seletor de arquivos para importar backup e anexar comprovantes.
- Exportação de backup JSON com o seletor de destino do Android; usa a ponte específica `MarksFiles`, sem expor o objeto de integração nativa antigo.
- Botão Voltar tenta fechar o diálogo ou voltar uma tela antes de sair.
- Insets de barras do sistema e teclado redimensionável.
- Permissão declarada: internet. Não solicita acesso geral ao armazenamento.

### Limites desta entrega Android

O APK foi compilado e sua assinatura foi verificada por ferramentas do Android SDK. A validação funcional principal ocorre nos testes web. **Não houve execução em aparelho Android físico nesta entrega.** A aparência pode variar conforme a versão do Android System WebView, GPU, acessibilidade e teclado. Antes de uso definitivo, teste importação/exportação, anexos, rolagem, modo escuro e compartilhamento no seu aparelho.

O Android não recebe o painel de simulação: abre o app real vazio. Nome/ícone configurados dentro do app alteram a interface web, não a identidade do launcher Android. Notificações agendadas, biometria, sincronização automática integral entre aparelhos e serviço de limpeza com o aplicativo fechado não foram implementados neste contêiner.

## 10. Testes e cenários

```sh
npm run check
npm run test:model
npm run test:reserve
npm test
npm run test:firebase
```

`npm test` usa Playwright e exige os navegadores instalados. Se necessário: `npx playwright install chromium`. `test:firebase` exige Java e os emuladores instalados pela Firebase CLI. Ele usa um projeto de emulação, não deve ser confundido com testes que escrevem no projeto de produção.

Os testes cobrem centavos, projeção de dados públicos, pagamentos parciais, fim de mês, reservas, UI, navegação, blur, configuração do vidro, restauração, estilos de gráficos, compartilhamento e segurança das regras conforme cada arquivo. As listas de testes são código vivo; um resultado de uma execução anterior não prova que uma versão nova passou.

No visualizador, o seletor **Cenário** alterna entre dados atuais, metas de exemplo e muitos dados. Os arquivos `Marks-Metas-Demo.html` e `Marks-Teste-Visual.html` usam chaves independentes de armazenamento. O cenário de carga inclui mais de 400 lançamentos, 27 metas, acordos, textos longos e datas variadas. São dados sintéticos, não resultados bancários reais.

Os gráficos e saldos devem ser conferidos também com zero registros, valores altos, receitas/despesas sem ocorrências e telas pequenas. A bateria de dados demonstra volume e layout; não substitui uma medição de frames, memória ou bateria em aparelho real.

## 11. Regras financeiras que devem ser preservadas

1. Valores monetários são centavos inteiros seguros, não números de reais em ponto flutuante.
2. Saldo real parte do saldo inicial e dos lançamentos. Transferência sai da origem e entra no destino sem criar patrimônio novo.
3. Metas futuras não são ativos. Aporte é alocação de saldo existente; resgate desfaz alocação.
4. A conta não pode manter reservas e metas acima do saldo real.
5. Parcela paga e lançamento gerado precisam manter o mesmo vínculo; desfazer deve acontecer pela origem.
6. Importação e restauração precisam passar pela validação completa antes de gravar.
7. Lixeira e cenários de demonstração não participam dos cálculos de registros ativos.
8. Os gráficos calculam a partir dos dados filtrados completos, independentemente da paginação visual.
9. Nunca inclua comprovantes, notas privadas ou dados de contas indevidos na projeção pública de compartilhamento.
10. A revogação de acesso deve depender de regras no servidor, não apenas de esconder o link na interface.

## 12. Manutenção, otimização e evolução

Nesta entrega, o extrato carrega registros em lotes, comprovantes abertos usam decodificação assíncrona, a lixeira restaura grupos transacionalmente, e a previsão usa somente compromissos cadastrados. Novos efeitos visuais ficam restritos a componentes, sem aplicar os seletores globais do exemplo enviado ao `body` da aplicação.

Evite filtros de blur grandes em várias camadas animadas ao mesmo tempo. O material de vidro é aplicado ao menu e o efeito de entrada é curto. Em dispositivos mais lentos, prefira movimento discreto e menor blur. Transform/opacity são priorizados, mas transições de layout e blur têm custo de renderização: não existe garantia de 120 fps por configuração CSS.

Para próximas etapas, priorize testes em Android real, divisão gradual de `NexoApp.jsx` por domínio, recuperação de identidade para compartilhar entre dispositivos, backups com criptografia opcional e métricas reais de desempenho. Refatorações financeiras devem ser pequenas e acompanhadas por testes de saldo e de migração.

## 13. Publicação, arquivos e assinatura

O site e o código público podem incluir o APK assinado. **O keystore e sua senha não podem estar no ZIP público.** O arquivo privado de assinatura fornecido separadamente deve ser guardado pelo proprietário. Quem tem a chave e a senha consegue assinar atualizações com a mesma identidade.

`npm run build` recria `dist/downloads/Marks-projeto.zip`. O empacotador não inclui `node_modules`, `.git`, caches, pastas de build nem arquivos de assinatura. Confira `scripts/package.mjs` ao acrescentar novos diretórios.

A documentação anterior foi preservada em `docs/README-anterior.md` para rastreabilidade. Se houver divergência com instruções antigas, use este documento e os comandos/scripts atuais, verificando o comportamento no código e nos testes.

## 14. Correção do APK 2.1.1

Veja `docs/CORRECAO-APK-2.1.1.md`: a assinatura válida não bastava para identificar a compressão indevida de resources.arsc. O build agora preserva a forma ZIP_STORED e verifica o alinhamento em 4 bytes. O código de versão foi incrementado mantendo a mesma chave. A instalação em um aparelho físico continua pendente.
