# Componentes nas telas reais do Marks

Os 19 exemplos enviados foram usados ou adaptados para ações reais do aplicativo. A página **Referência das interações** continua disponível como documentação visual secundária; os fluxos abaixo funcionam fora dela.

| Exemplo enviado | Uso no produto |
| --- | --- |
| CarouselNavigator | Carrossel de KPIs reais na página inicial: entradas/saídas, acordos e patrimônio/reserva. Setas, indicadores e FilterDisclosure controlam os cartões. Sem avanço automático que interrompa a leitura. |
| ContextualAIBar | Barra de atalhos e busca local na página inicial. Abre lançamentos, agenda, contas e metas; a busca filtra o extrato real. Não há promessa de serviço de IA. |
| ContinuousTabs | Seleção de dia, semana, mês e ano nos dados financeiros. |
| FluidTabs | Filtros Todas, Fixadas e Com link nas seções; a navegação flutuante adapta a mesma seleção contínua para ícones. |
| DiscreteTabs | Na agenda, alterna Dia selecionado e Próximos prazos com rótulo expansível. |
| CreateNewDisclosure | O botão de criação abre a grade de registros reais: lançamento, seção, entrega, meta, conta e recorrência. |
| CommandSearch | Busca global adaptada como CommandPalette: navega, encontra registros e abre ações reais com teclado. |
| FilterDisclosure | Filtro animado do extrato entre receitas, despesas, transferências e todos os movimentos; também filtra os grupos de KPIs na tela inicial. |
| OptionPicker | Seletor de conta do extrato, combinado com o filtro por tipo. Transferências consideram também a conta de destino. |
| PinItemComponent | Organizador na página inicial e em Seções, com fixação persistida; abre o acordo escolhido e permite filtrar as fixadas. |
| InviteDisclosure | Lista os links publicados das seções e abre o gerenciamento real do compartilhamento escolhido. Não inventa destinatários. |
| CalendarWidget | Agenda adaptada para mês/semana com parcelas, recorrências e prazos das metas; navegação por data, Hoje e abertura do compromisso. A faixa Sua semana em movimento marca os agendamentos reais. |
| SlotPicker | Intervalos de datas da agenda, com validação da ordem inicial/final e filtro dos compromissos reais. |
| TaskWidget | Na página inicial e na tela de metas: visão expansível de metas e aportes. A ação de uma meta abre o formulário real de aporte; progresso vem do dinheiro já reservado. |
| AdaptiveSlider | Ajuste do objetivo das metas e planejador de aporte/resgate sincronizados ao campo de valor, em centavos inteiros. O limite usa o saldo livre ou o valor alocado à meta e conta. Só confirmar o formulário altera os registros. |
| ActivitiesCard | Histórico expansível dos últimos movimentos, abrindo o detalhe do lançamento escolhido. |
| SwitchDisclosure | Preferências de modo foco e agenda no painel, respeitando a prévia e os botões Salvar/Cancelar da personalização. |
| ViewOnMap | Expansão de trajeto nos detalhes de entregas, disponível somente com coleta e destino preenchidos. Mostra os endereços reais e abre direções no Google Maps, sem API paga. |
| AccordionApp | Ajuda financeira e privacidade com perguntas expansíveis em português. |

## Ajustes pedidos na interface

A navegação flutuante segue três etapas: o destaque se desloca até o ícone; a bandeja recolhe; a ação abre a tela ou a criação. A sequência aguarda o fim das animações. Escape ou uma interação fora cancela a seleção pendente, e movimento reduzido dispensa os efeitos.

Claro e escuro usam um único botão, no menu do app e no Studio. O sol se transforma em lua com máscara SVG animada. A seleção acompanha a aparência resolvida e persiste; o morph termina antes da troca da paleta, sem fechar o menu. O modo Sistema permanece no seletor de temas.

Os indicadores têm espaçamento real de 12 px. Cada linha com ações de deslizar tem uma borda completa no contêiner; o fundo das ações fica escondido até abrir. A alça usa reticências, sem círculo e sem a seta duplicada.

## Organização do código

- `src/components/nexo-ui.tsx`: navegação sequenciada, morph de aparência e primitivas Motion.
- `src/components/ProductionInteractions.tsx`: composição das interações com dados e callbacks do produto.
- `src/components/reference/`: exemplos originais, adaptados para aceitar valores controlados e ações reais.
- `src/legacy/NexoApp.jsx`: ligação com os registros, filtros, preferências e formulários financeiros existentes.
- `src/components/production-interactions.css` e `src/styles.css`: materiais, espaçamento, bordas e posicionamento responsivo.

As regras de cálculo em centavos, transporte de pagamentos parciais, reservas, metas e projeção privada do compartilhamento continuam na lógica financeira existente.

## Personalização e controles adicionais

- `PersonalizationStudio.tsx`: gráficos e cartões de exemplo animados, replay, combinações de efeitos, seis estilos de navegação, presets nomeados e restauração do padrão. As opções modificam também os componentes do aplicativo, com movimento reduzido prioritário.
- `AnimatedFinanceChart.tsx`: gráfico financeiro real com área, linha ou barras e quatro modos de animação, sem mudar os valores.
- `ReserveWorkspace.tsx` e `lib/reserve-model.ts`: bancos com ícone, histórico de aportes e resgates, metas e planejamento mensal, mantendo o patrimônio real.
- `FinanceCalendar.tsx`: agenda mensal/semanal. `DeliveryRouteMap.tsx`: trajeto condicionado aos dois endereços.
- `nexo-ui.tsx`: barras e anéis de progresso que começam em zero ao entrar na área visível.
- `LiquidDangerButton.tsx`: feedback em vidro vermelho antes da confirmação de exclusão. O botão + usa vidro verde enquanto aberto e material com contraste nas duas aparências.
