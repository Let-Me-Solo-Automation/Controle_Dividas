# Revisão de UI e entregas — 13 de novembro de 2026

## Fluxo das plataformas

Em Entregas, toque na linha ou no ícone da plataforma para abrir a página exclusiva. Selecione uma conta de repasse, o modo de recebimento (por entrega ou após confirmação), a frequência, o ícone e a meta mensal. A seta do cabeçalho retorna primeiro à lista de plataformas.

O cadastro de entrega usa a conta definida na plataforma. Informe estabelecimento, valor e data; endereços e distância são opcionais. O botão compacto de incentivo revela o valor adicional. O incentivo é incluído no total uma única vez. Novas entregas de bicicleta não geram custos; registros antigos mantêm os custos históricos.

Ao receber, abra a plataforma e confirme o valor e a data do repasse. Repasses parciais são aceitos. Receitas pendentes são creditadas na conta nessa confirmação. Receitas já creditadas no cadastro não são creditadas novamente. É possível desfazer a confirmação no histórico. A previsão semanal avança após a confirmação; ela não movimenta dinheiro automaticamente.

A meta mensal considera todas as entregas da plataforma no mês atual. O valor necessário por semana considera o saldo da meta e os dias restantes do mês, em vez de dividir todos os meses por quatro semanas.

## Interface

- Prioridade e situação possuem um único alvo de seleção que cobre também a seta. Concluída usa verde; em andamento, âmbar; pausada, violeta; cancelada, vermelho. A conclusão pelo valor depositado continua automática. Alterar o rótulo não cria depósitos.
- Campos de metas e botões de salvar têm largura limitada. O título dos detalhes mantém sua largura natural; apenas a seta usa formato circular. O salvamento usa confirmação animada.
- O gráfico de entradas permite consulta por toque e alterna dados diários e grupos de até sete dias. As tabelas mostram datas explícitas. Pontos também podem ser consultados por teclado.
- KPIs de receita por km identificam as plataformas e usam somente receitas de entregas com distância informada.
- A agenda tem linhas próprias para título, navegação, mês e modo de visualização. O botão de voltar ocupa seu espaço no cabeçalho fixo, sem posicionamento sobre a marca.
- A lupa contextual abre e recolhe a busca no mesmo botão. As sugestões do extrato aparecem durante a digitação. Campos e resultados da busca usam tons neutros, sem o contorno azul quadrado.
- Os campos de data de cadastros, metas, reserva, filtros e agenda usam o mesmo seletor mensal. O seletor possui navegação, data selecionada, Hoje, fechamento por Escape e toque fora.
- O link de compartilhamento usa confirmação animada de cópia, com fallback para o envio existente.

## Implementação e validação

React 19, TypeScript, Tailwind 4 e Motion permanecem como base. Os componentes de exemplo enviados foram adaptados aos nomes, dados e ações do Marks. Foram aplicadas as orientações do frontend-design e do guia UI/UX anexados, e a revisão react-best-practices.

Validação: verificação TypeScript; modelo financeiro; modelo de reserva; testes de entregas, incentivo e repasse sem duplicidade; interações móveis de busca, gráfico, datas, metas e conta da plataforma; distribuição da agenda e do cabeçalho; regressões de layout em 320 px e catálogo Figma com cada arquivo e ZIP abaixo de 1.000.000 bytes.

A prévia é HTML local com interações. Esta revisão web não está no APK anterior. Não foi publicada uma nova prévia pública nem confirmado upload no Figma. A sessão não oferece um visualizador HTML interativo embutido na conversa.
