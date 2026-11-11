# Concluir a ativação na sua conta

O código está em https://github.com/Let-Me-Solo-Automation/Controle_Dividas . A compilação no GitHub Actions já passou. A ativação do Pages ainda depende de um ajuste da conta: a integração retornou HTTP 403 ao tentar habilitá-lo por API.

## 1. Ativar o GitHub Pages

Abra https://github.com/Let-Me-Solo-Automation/Controle_Dividas/settings/pages . Em **Build and deployment → Source**, escolha **GitHub Actions**.

Depois, abra a aba **Actions**, escolha **Publicar Nexo no GitHub Pages** e use **Run workflow**. Também é possível pedir nesta conversa para executar novamente, depois de salvar o Source.

Após a publicação, o endereço esperado é https://let-me-solo-automation.github.io/Controle_Dividas/ . Esse endereço só deve ser tratado como ativo após a conclusão do deploy.

## 2. Autorizar o Firebase

Extraia o projeto e execute **Configurar-Firebase.command** no Mac. O configurador instala o ambiente necessário, abre o login Google e prepara um projeto novo sem faturamento.

Ao finalizar, copie nesta conversa somente o JSON público impresso no Terminal, ou o conteúdo de `output/firebase-config-publico.json`. A conexão com o site será publicada a partir dele. Não envie senha, token de login ou chave de conta de serviço.

Até isso ser feito, o compartilhamento informa que o Firebase não foi ativado. O simulador continua funcionando com seus dados locais.

## Custos

Não usamos plano Blaze, cartão ou conta de faturamento. O banco usa o plano gratuito Spark, dentro das cotas do Firebase. Ao atingir cotas, o serviço pode interromper novas operações até a renovação; o configurador não habilita cobrança automática.
