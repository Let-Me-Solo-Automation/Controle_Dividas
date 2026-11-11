# Validação da entrega

Executada em 11/11/2026, em Linux com Node.js 24 e Chromium/Playwright.

- Build do HTML offline: aprovado.
- TypeScript dos novos componentes e exemplos: aprovado.
- Onze testes de ponta a ponta: aprovados.
- Navegação pelas dez telas existentes: aprovada, sem erros JavaScript.
- Receita de R$ 100,25: saldo passa de R$ 9.411,70 para R$ 9.511,95 e persiste após recarregar.
- Entrega de R$ 25,50 com custo de R$ 3,25: saldo passa para R$ 9.433,95, sem duplicar o custo.
- Pagamento parcial de R$ 50,00: diferença de R$ 70,00 transportada para a próxima parcela e saldo atualizado.
- Quinze temas: renderizados sem erros de execução.
- Dezenove componentes únicos enviados: renderizados no laboratório.
- Busca por teclado, foco do modal, Esc e movimento reduzido: aprovados.
- Visores de 1440×1100, 1280×720 e 390×844: fluxos verificados.
- Inicialização offline: nenhuma requisição HTTP externa.
- Servidor de desenvolvimento Vite: inicialização e navegação verificadas no navegador, sem erros de execução.
- Scripts macOS: sintaxe Bash validada. A execução real no Mac não foi realizada neste ambiente Linux.

Após o ajuste final de encaixe e inicialização, os testes mobile e de pagamento parcial em tela menor foram executados novamente e aprovados.

## Ajustes de navegação e busca

- Botão + de 44 px, translúcido, com bandeja expansível de cinco ícones e fechamento por ação, toque fora ou Esc.
- Navegação ausente em Agenda, Contas, Lançamentos, Recorrências, Personalização e Ajuda.
- Segundo toque no calendário retorna à tela anterior, restaura o detalhe da seção e a posição da rolagem.
- Campo da lupa sem outline, borda ou sombra verdes; foco sutil aplicado ao grupo arredondado.
- Arquitetura de compartilhamento por Drive documentada em GOOGLE-DRIVE.md; nenhuma integração Google ativa.

Os 11 testes foram executados e aprovados após a implementação desses comportamentos. TypeScript e build offline aprovados.

## Firebase e GitHub Pages

- Firestore Rules no emulador: quatro testes aprovados para publicação do proprietário, leitura por link, bloqueio de listagem, bloqueio de outros usuários, prazo e revogação.
- Teste completo em navegador com Auth + Firestore emulados: proprietário cria acesso, publica seção, destinatário consulta, pagamento parcial atualiza o saldo e revogação remove o acesso. Aprovado.
- Projeção da seção testada para excluir contas bancárias, comprovantes, pessoa, anotações privadas e outras seções. Cálculos de parcelas, centavos e fim do mês aprovados.
- Firebase de produção `marks-79823` provisionado pelo proprietário no console e conectado ao site. O configurador foi revisado sintaticamente; suas chamadas administrativas não foram executadas nesta conta.

- GitHub: código enviado ao repositório público Controle_Dividas, preservando o README anterior em original/GitHub-README-original.md. Compilação e publicação no GitHub Actions aprovadas após o proprietário habilitar Pages como GitHub Actions.
- Uma execução do teste mobile expirou durante a execução simultânea com emuladores; a repetição isolada passou. Os outros dez testes de interface passaram nessa execução.

- Persistência de acesso Firebase após recarregar validada no teste de ponta a ponta; a ponte do simulador intercepta somente a chave financeira e preserva o armazenamento do SDK de autenticação.

## Publicação do GitHub Pages

Em 11/11/2026, depois da ativação do Pages pelo proprietário, o workflow 43019912928 concluiu a publicação com sucesso. HTTPS habilitado. O Firebase `marks-79823` foi conectado posteriormente e validado conforme os resultados abaixo.

## Identidade Marks e downloads

Identidade visual renomeada para Marks no simulador, aplicativo e acompanhamento. Ícone aproximado da imagem fornecida, incluindo a versão de ajuda e o favicon. As chaves financeiras e a identificação de autenticação foram preservadas para manter os dados e o acesso existentes.

Os downloads passaram a ser arquivos públicos do GitHub Pages: Marks-projeto.zip e Marks-Simulador.html. O ZIP é gerado pela compilação e inclui o configurador Firebase, sem artefatos efêmeros da conversa.

Na atualização Marks: TypeScript e build aprovados; cinco testes de interface aprovados (dez telas, receita com persistência, mobile, retorno do calendário e busca). O pacote ZIP foi aberto e verificado, incluindo permissões de execução do configurador para Mac e ausência de pastas de dependências e credenciais.

## Revelação com blur e tutorial Firebase

O efeito de entrada foi restaurado com blur de 10 px, opacidade e deslocamento; cartões revelam com blur de 7 px ao entrar na área visível. A intensidade configurada é respeitada, assim como movimento reduzido e a desativação de animações. Testes de revelação, estado final nítido, rolagem, preferência reduzida, retorno do calendário e busca aprovados.

Tutorial pelo navegador disponível em tutorial-firebase.html e TUTORIAL-FIREBASE.md. A compilação incorpora as regras reais do Firestore na página, para copiar sem divergência do arquivo fonte, e inclui o tutorial no ZIP.

## Firebase de produção — 11/11/2026

Teste com Chromium no endereço público do GitHub Pages e configuração real `marks-79823`, sem emuladores:

- Criação de acesso por e-mail/senha: aprovada.
- Publicação da seção de demonstração: aprovada.
- Sessão do proprietário preservada após recarregar: aprovada.
- Destinatário sem login visualiza somente a seção escolhida: aprovado.
- Registro de pagamento de R$ 50,00 atualiza o saldo acompanhado de R$ 920,00 para R$ 870,00: aprovado.
- Revogação bloqueia o link e remove os dados da tela do destinatário: aprovada.
- Nenhum erro JavaScript observado durante o fluxo.
- Domínio `let-me-solo-automation.github.io` presente nos autorizados.

A revogação removeu o documento do teste. A limpeza posterior da conta temporária falhou; excluir no console Authentication o usuário com e-mail `marks-validation-…@example.invalid`. Nenhuma senha ou token do teste foi incluído no repositório, no pacote ou nos logs. O plano de faturamento não foi consultado com credenciais administrativas; manter Spark conforme a configuração solicitada ao proprietário.

## Links sem vencimento e prévia no app

Implementação validada em Auth + Firestore emulados, com seis testes de regras e um fluxo completo em Chromium:

- Novos links e publicações atualizadas usam `expiresAt: null`. Links legados permanecem compatíveis até serem atualizados.
- A tela de compartilhamento mostra o endereço e abre a prévia dentro do app sob demanda.
- Revogação é uma ação discreta e remove os dados publicados, mantendo um pequeno marcador de bloqueio. Regras impedem que uma aba antiga ou backup reative o mesmo endereço.
- Compartilhar novamente gera outro token; o link revogado continua bloqueado.
- O destinatário não vê dados em cache sem confirmação do servidor. Ao ficar offline, a tela remove os dados e solicita conexão; ao reconectar, o acesso é revalidado.
- Proprietários diferentes e visitantes não podem modificar ou revogar a publicação; a listagem continua bloqueada.

A ativação em produção desta versão exige publicar as novas regras de `firebase/firestore.rules` no console do projeto `marks-79823`. A configuração pública do SDK não concede permissão administrativa para alterar regras. O tutorial publicado incorpora o arquivo exato e oferece o botão Copiar regras. Esta atualização não foi testada em produção antes dessa publicação pelo proprietário.

## Família Apple e acessibilidade

- TypeScript e compilação aprovados.
- Catálogo único para app e Studio: os 15 estilos originais mais Apple Claro, Escuro e Sistema.
- Dois novos testes aprovados para seguir mudanças do SO sem reiniciar iframe/tela, persistir escolha e preservar seções, lançamentos, contas, entregas e metas; escolha manual permanece independente do SO.
- Teste de cores semânticas aprovou pelo menos 4,5:1 para texto principal/secundário sobre fundo/superfície e texto sobre a ação preenchida em ambas as aparências. Não substitui uma auditoria de todos os fundos e estados renderizados.
- Os 17 testes de interface passaram: 13 na execução completa, três testes de tema na repetição após corrigir a origem herdada de mensagens no iframe srcdoc, e um teste adicional de materiais e acessibilidade.
- A família Apple mantém a revelação com blur e oferece fallback opaco, redução de transparência, contraste aumentado, forced-colors e alvos de toque de 44 px.
- Não foi realizada medição em um Mac/iPhone/Android físico; verificação automatizada usa Chromium em Linux.

A verificação dos materiais também encontrou e corrigiu a ordem dos prefixos CSS: o minificador descartava `backdrop-filter` quando a propriedade prefixada vinha por último. Com a ordem corrigida, o teste confirma vidro ativo normalmente e superfícies opacas ao reduzir transparência, aumentar contraste ou ativar cores forçadas.
