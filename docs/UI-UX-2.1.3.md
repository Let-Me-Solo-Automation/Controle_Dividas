# Refinamento de UI e UX — Marks 2.1.3

## Referência consultada no Figma

Arquivo comunitário iOS and iPadOS 27, página Materials, quadro Regular (Default) - Dark:
https://www.figma.com/design/KC4WzWSfvI61wjI6R1YYn0/iOS-and-iPadOS-27--Community-?node-id=224-56305

A integração Figma retornou o contexto do componente e sua imagem. Foram usados como referência os níveis de texto primário/secundário, a superfície translúcida com contraste e a divisória fina. O arquivo de referência não foi alterado. O app mantém seus próprios componentes, tokens, ícones e gráficos; nenhum wallpaper da referência é incorporado.

## Hierarquia e layout

- Módulos independentes na tela inicial têm divisória e espaçamento de 26–28px, em vez de encostarem visualmente. Dentro de cada grupo, os espaços são menores.
- Indicadores e progresso das metas são regiões distintas. As demais metas detalhadas continuam acessíveis no módulo Metas e na tela dedicada.
- Textos de interface descrevem as funções. Personalização, Metas, Seções e Reserva de emergência substituem títulos ambíguos.
- A personalização visual aparece antes da manutenção da lixeira nas configurações.
- Campos, nomes longos e valores respeitam a largura disponível. Em telas até 360px, indicadores passam a uma coluna. A data ocupa uma linha própria em telas pequenas para manter o ano legível.
- Saldos atuais e reserva usam verde e sinal positivo; valores negativos usam vermelho e sinal negativo. Metas futuras não são somadas ao patrimônio.

## Vidro e movimento

Personalização tem uma nova seção **Vidro da faixa superior** com prévia rolável que usa os mesmos valores do cabeçalho real:

- Blur de 0 a 28px, independente do menu flutuante.
- Opacidade de 35 a 95%, independente do blur.
- Interruptor para o blur do cabeçalho e botão Salvar cabeçalho com confirmação animada.
- Em zero, o blur é efetivamente zero; o tom translúcido continua controlado pela opacidade.
- Preferências e conjuntos personalizados incluem esses ajustes. Redução de transparência, alto contraste e cores forçadas mantêm alternativas opacas.

A revelação ao rolar dura 0,9 segundo por padrão. A opacidade aparece antes de o blur terminar, para tornar a passagem visível. O controle **Tempo do blur ao revelar** permite 0,5 a 1,6 segundo; o ritmo geral também influencia a duração. O filtro é removido após o término. O perfil Android equilibrado mantém blur curto em área (4px por card), sem voltar a desfocar a página inteira. Não há promessa de FPS em hardware não medido.

## Navegação e limpeza

O avatar K que duplicava o acesso às configurações foi removido. Personalização continua no menu de hambúrguer. O bloqueio do aparelho foi removido do menu, das configurações, do catálogo e das chamadas de ponte nativa; a chave antiga é descartada ao normalizar preferências. O olho para proteger valores e os controles de acesso aos links compartilhados continuam funcionando.

## Instalação

APK 2.1.3, versionCode 4, pacote e assinatura preservados. O instalador Mac reconhece um A52 conectado e autorizado antes de pedir pareamento. Caso precise parear, solicita IP:porta completo e código e usa o comando que funcionou neste Mac, passando o código diretamente ao ADB. O código temporário não é salvo no pacote ou nos logs do instalador.

## Validação

Há testes de persistência do vidro do cabeçalho e independência em relação ao menu, blur zero real, revelação ainda perceptível após 350ms no perfil Android, remoção do filtro no fim, acesso às configurações sem K/bloqueio, layout de 320px, temas e acessibilidade. A suíte completa também cobre lançamentos, parcelas, anexos, metas, reserva, navegação, personalização e lixeira. O teste físico de fluidez e da instalação por Wi-Fi depende do celular conectado ao Mac do usuário.

Resultado desta entrega: 50 cenários distintos de interface validados, além dos testes de regras financeiras e de reserva. Uma asserção antiga que esperava `blur(0px)` foi atualizada para `none`, pois o novo comportamento libera o filtro ao concluir. Os testes finais cobrem a revelação prolongada e a limpeza da camada, redução de movimento, divisórias, largura de 320px e sinais/cores dos saldos.
