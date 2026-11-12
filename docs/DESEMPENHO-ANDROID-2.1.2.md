# Desempenho Android 2.1.2

O objetivo é preservar o blur e reduzir o custo de composição no Galaxy A52. Não há medição de FPS no aparelho nesta entrega; a validação física depende da instalação.

## O que mudou

- Perfil Automático seleciona Equilibrado no contêiner Android. No navegador mantém Efeitos completos. A escolha pode ser alterada e salva em Personalização → Perfil de desempenho.
- No perfil Equilibrado, a tela inteira faz transição de opacidade e deslocamento, sem desfocar uma textura do tamanho da página.
- Hero, indicadores, metas e previsão revelam-se com blur de até 4px por card, em cerca de 280ms na intensidade padrão. Ao concluir, o filtro passa a `none`. Os cards fora da tela aguardam a entrada no viewport.
- O menu + e seu painel continuam com backdrop blur ajustável, inclusive zero. Blur de entrada e blur do vidro são efeitos distintos.
- O cabeçalho e cards opacos deixam de aplicar backdrop blur redundante. O fundo do menu de hambúrguer conserva desfoque leve de 1,5px.
- Contadores usam um Intl.NumberFormat compartilhado, evitam escritas repetidas de texto e animam por aproximadamente 320ms. Gráficos e contadores animam uma vez por montagem da tela em vez de reiniciarem em cada oscilação da rolagem.
- O widget de metas evita medições de layout compartilhado no perfil equilibrado; controles e transições continuam funcionais.
- A WebView pausa quando o app vai ao fundo e retoma ao voltar. A aceleração de hardware está explícita no manifesto.

## Atualização

Pacote `app.marks.finance`, versionCode 3, mesma chave de assinatura. Atualize sobre a versão anterior, sem desinstalar. O instalador Mac usa `adb install -r`, verifica o SHA do APK e identifica o Galaxy A52 conectado. Os dados locais permanecem no armazenamento do app.

## Validação

Verificações automatizadas incluem renderização Android equilibrada, blur transitório por card e limpeza ao concluir, vidro do menu preservado, gravação das preferências, exportação Android, controles de metas e filtros financeiros. A assinatura, alinhamento e recursos Android são verificados no build.

Depois de instalar, compare rolagem, abertura do menu e troca de telas com os mesmos dados. Efeitos completos continuam disponíveis para comparação. Não há garantia de 120fps: o resultado depende da WebView, GPU e carga do aparelho.
