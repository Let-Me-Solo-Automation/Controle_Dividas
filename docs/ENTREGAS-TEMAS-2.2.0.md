# Marks 2.2.0 — entregas, imagens, temas e Figma

## Imagens

PNG, JPEG e WebP até 20 MB são decodificados, reduzidos e centralizados em uma imagem quadrada de 256px com proporção preservada e fundo transparente. O app armazena a versão reduzida, não a foto original. Vale para ícone do app, bancos e plataformas. Arquivos inválidos geram uma mensagem. O ícone de fábrica também foi otimizado sem alterar sua composição.

## Entregas e repasses

A tela permite entrar em cada plataforma cadastrada e filtrar seu histórico. Há identificadores visuais locais; iFood e Uber utilizam SVGs do projeto Simple Icons (https://github.com/simple-icons/simple-icons, licença CC0). 99 Food, Keeta e inDrive utilizam os ícones de identidade dos sites 99app.com, keeta-global.com e indrive.com, obtidos pelo serviço de favicons do Google. Qualquer plataforma aceita upload de seu ícone real; nomes desconhecidos usam iniciais como fallback. Não há integração de login, rastreamento ou consulta às APIs dessas empresas.

KPIs: receita bruta, custos, ganho líquido, entregas realizadas, distância informada, receita e líquido por km. Entregas sem distância são aceitas e excluídas dos cálculos por km; a cobertura do cálculo é mostrada. Endereços de coleta e entrega continuam opcionais, com mapa quando ambos estão presentes. O gráfico por dia usa receitas efetivamente cadastradas e identifica o dia de maior receita.

Cada plataforma possui previsão manual, semanal (dia escolhido) ou por intervalo de 1–365 dias desde uma data inicial. É previsão: não há débito, crédito ou recebimento automático. A retirada aparece cinza, com data e comentário. O total produzido permanece intacto. Ao criar uma entrega, escolha Já recebi na conta (compatível com registros antigos) ou A receber na plataforma. No segundo caso, a receita bancária só é criada ao registrar o repasse, na conta selecionada. Valores já recebidos não geram nova entrada. O saldo operacional não é um novo ativo a somar ao patrimônio. Desfazer um repasse remove apenas o lançamento bancário vinculado a ele. Retiradas maiores que o produzido são recusadas; é possível desfazê-las. Excluir entregas já repassadas exige desfazer as retiradas correspondentes para manter a consistência.

## Biblioteca de temas

O glossário fornecido é fonte de referência visual, não uma lista de instruções executáveis. Foram catalogados 91 conceitos, cada um com variante clara/escura. Os conceitos experimentais foram adaptados para preservar leitura e desempenho: não se reproduzem caos, textos ilegíveis, shaders pesados ou vídeos de fundo. Cada proposta combina paleta, material CSS, raio e tipo de gráfico. Há busca por nome, categoria e descrição, favoritos persistentes e mistura aleatória de tema, gráfico e cartão. A biblioteca carrega 12 propostas por vez.

Apple permanece o padrão e suas três definições originais não foram alteradas. Obsidiana e Rubi ganham versão clara. O botão de aparência mantém a família do tema ao alternar claro/escuro. Misturas podem ser salvas nos conjuntos personalizados existentes.

## Exportação para Figma

`Marks-Figma.zip` é uma exportação estática completa do app interativo: `index.html` de 354 bytes, `app.js` e `styles.css` separados. É necessário manter os três arquivos juntos. O HTML pequeno não significa que todo o app pese menos de 1 MB. Os dados de demonstração usam chave isolada `marks-figma-review-v1`. Não exporta dados pessoais.

O projeto completo com fontes React/TypeScript, regras, Android, scripts e documentação continua em `Marks-projeto.zip`. A exportação para Figma Make é código executável, não um arquivo .fig de camadas vetoriais. Importação no Figma não equivale a publicar um site nem comprova a execução remota da prévia.

## Tokens do ChatGPT

A integração não fornece o consumo real desta conversa, saldo de cota semanal ou data de renovação do plano. Conforme a escolha do usuário de mostrar apenas dados reais, não foi criado um painel com contagens estimadas ou inventadas.

Estado do envio ao Figma: arquivo Make criado, mas upload bloqueado pela conexão (CONNECT HTTP 403), antes da importação. A exportação ZIP foi validada localmente; não há prévia importada ou publicada no Figma para confirmar. Use o ZIP para importar/analisar o app. Arquivo reservado: https://www.figma.com/make/YqjLhKztQbxHSQrqE2WfQy .

Validação desta versão: 15 cenários de interface relevantes, modelos financeiros, reserva e repasses; inclui recebimento pendente, repasse parcial e desfazimento, distância opcional, favoritos, imagens grandes e preservação do Apple. Build Android com assinatura e alinhamento verificados. `npm run build` gera também o ZIP para Figma; `node scripts/test-delivery.mjs` verifica as regras de repasse.
