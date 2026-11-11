# Marks: GitHub Pages + Firebase, sem faturamento

O site e o código usam um repositório público no GitHub Pages. Os acordos compartilhados ficam no Firestore, protegidos por regras; não são gravados no repositório. O proprietário entra por e-mail e senha do Firebase Authentication, sem compartilhar as credenciais com o destinatário.

## Tutorial pelo navegador

Para configurar pelo console do Firebase, sem Terminal nem instalação, siga `TUTORIAL-FIREBASE.md` ou abra https://let-me-solo-automation.github.io/Controle_Dividas/tutorial-firebase.html . Esse guia inclui as regras prontas para copiar.

## Ambiente atual

O site está conectado ao projeto `marks-79823`. O proprietário ativou Authentication, Firestore, regras e domínio autorizado pelo console. O teste no site real aprovou publicação, atualização e revogação. Para usar, abra uma seção no site e escolha Compartilhar seção. Não execute o configurador para criar outro projeto.

## Alternativa: criar outro ambiente pelo configurador do Mac

1. Extraia o ZIP.
2. Execute `Configurar-Firebase.command`. Ele prepara o Node e as dependências automaticamente. Autorize o login Google no navegador que será aberto.
3. O configurador cria um projeto dedicado, confirma que ele não tem faturamento, cria um Firestore Standard em São Paulo, habilita acesso por e-mail/senha, publica as regras e gera a configuração pública.
4. Envie nesta conversa somente o JSON público impresso no final, também salvo em `output/firebase-config-publico.json`. Ele será usado para conectar o site publicado. Não envie senhas, tokens de login nem chaves de conta de serviço.

A criação real do projeto exige que você aceite os termos da sua conta Google/Firebase. Restrições da conta, cotas de criação e políticas da organização podem exigir ação no console. O configurador salva o ID do projeto para continuar no mesmo projeto se precisar executá-lo novamente. Nenhuma etapa vincula cartão ou conta de faturamento.

## Usar o compartilhamento

- Abra a versão online do Marks, entre em uma seção e toque no botão de acompanhamento.
- Crie seu acesso gratuito com e-mail e senha. Use o mesmo acesso em outro navegador/aparelho para gerenciar seus links. Esse acesso é separado da conta Google usada para configurar o projeto.
- Publique a seção e copie o link. Quem tiver o link consulta apenas esse acordo, sem alterar dados.
- Novos pagamentos sincronizam quando o Marks está aberto, há internet e o proprietário continua conectado. Alterações offline ficam pendentes para a próxima conexão.
- O destinatário acompanha atualizações enquanto a página está visível. A assinatura é suspensa com a aba oculta para economizar leituras.
- Revogue o link para interromper novas consultas. Links novos não vencem: continuam ativos até você revogar. A revogação remove os dados publicados e mantém somente o identificador bloqueado, para uma aba antiga não reativar o link. Compartilhar novamente cria outro endereço.

Não publicamos contas bancárias, comprovantes, anotações privadas nem dados de outras seções. O link é uma credencial de leitura: pode ser encaminhado. Revogar não apaga cópias ou capturas já feitas pelo destinatário.

## O que é gratuito

- **GitHub Pages em repositório público**, com publicação pelo GitHub Actions.
- **Firebase Spark**, sem cartão ou vínculo de faturamento.
- Firebase Authentication por e-mail/senha e um banco Firestore Standard dentro das cotas gratuitas.
- Sem Cloud Functions, Cloud Storage, SMS, extensões pagas, PITR, backups gerenciados, TTL automático ou plano Blaze.

Na documentação consultada, a cota gratuita do Firestore inclui 1 GiB armazenado, 50 mil leituras/dia, 20 mil gravações/dia, 20 mil exclusões/dia e 10 GiB de saída/mês. Há também limites próprios de autenticação, hospedagem e Actions. O serviço pode ficar indisponível ao atingir limites. Não prometemos uso ilimitado. **Mantenha o projeto no Spark e não vincule faturamento** para impedir cobranças automáticas de excedentes.

A configuração pública do Firebase pode estar no site/repositório; a segurança depende das regras de acesso e da autenticação, não de esconder a apiKey do SDK web. As credenciais administrativas do configurador ficam apenas no armazenamento do Firebase CLI no Mac.

## Limites desta entrega

O Firebase de produção `marks-79823` já está conectado e foi validado no site real. O configurador administrativo do Mac foi revisado, mas não foi utilizado para provisionar esse projeto: o proprietário fez a configuração pelo console.

A implementação é web. O APK Android e o armazenamento nativo de credenciais precisam ser implementados na etapa do aplicativo.

## Referências oficiais

- https://firebase.google.com/pricing
- https://firebase.google.com/docs/firestore/quotas
- https://firebase.google.com/docs/auth/web/password-auth
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages
