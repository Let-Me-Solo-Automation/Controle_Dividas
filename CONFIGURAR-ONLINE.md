# Marks online e Firebase conectado

Site: https://let-me-solo-automation.github.io/Controle_Dividas/
Código: https://github.com/Let-Me-Solo-Automation/Controle_Dividas
Firebase: `marks-79823`, aplicativo `Marks Web`.

O site já inclui a configuração pública correta; Firestore, Authentication e domínio autorizado foram configurados pelo proprietário. O método **Anônimo** foi ativado pelo proprietário e confirmado em 12/11/2026. A etapa abaixo serve como referência para outro ambiente. Não é necessário criar outro projeto.

## Ativação administrativa do compartilhamento sem cadastro

Abra https://console.firebase.google.com/project/marks-79823/authentication/providers com a conta que administra `marks-79823`. Em **Authentication → Método de login / Sign-in method**, escolha **Adicionar novo provedor → Anônimo / Anonymous → Ativar → Salvar**. Preserve E-mail/senha para os proprietários de links antigos. Se o projeto oferecer limpeza automática de usuários anônimos, mantenha-a desativada para preservar o acesso de revogação. Depois, recarregue o Marks e tente criar o link.

Esse ajuste exige acesso administrativo. A configuração pública do SDK não permite habilitar provedores; nenhuma senha, chave privada ou conta de serviço deve ser enviada para o aplicativo.

## Compartilhar uma seção

1. Abra o site, entre em **Seções** e escolha um acordo.
2. Toque em **Compartilhar seção**. Não é preciso informar e-mail ou senha.
3. Escolha **Criar link sem vencimento** e envie o link ao destinatário.
4. Registre os pagamentos no Marks: o acompanhamento é atualizado enquanto você estiver conectado e online.
5. Use **Revogar acesso** para encerrar a consulta daquele link.

O acesso do proprietário é criado silenciosamente apenas ao publicar ou revogar e persiste neste navegador. Use o mesmo navegador para atualizar e revogar; limpar os dados dele perde esse acesso, e o backup dos acordos não o recupera. Links antigos publicados com e-mail/senha continuam ligados à conta original: use **Já publicava com e-mail e senha?** antes de tentar gerenciá-los. Trocar para outra conta substitui o acesso local e pode perder o controle dos links anônimos atuais.

O destinatário não precisa criar conta; abrir o link não cria usuário anônimo. Somente a seção escolhida é publicada. Os demais registros continuam no navegador. A versão HTML offline permite testar a interface; para compartilhar, use o site online.

## Validação

O fluxo sem cadastro é validado com os emuladores locais de Authentication e Firestore (`npm run test:firebase`): publicação sem formulário, persistência após recarregar, atualização, consulta sem autenticar o destinatário, revogação e novo endereço. As regras continuam exigindo o UID proprietário para gravar e preservam o bloqueio definitivo dos links revogados. Em 12/11/2026, após o proprietário publicar as regras, as APIs reais de Authentication/Firestore confirmaram login anônimo, publicação sem vencimento e leitura sem login, revogação e bloqueio do link antigo, inclusive contra reativação. As contas temporárias foram removidas; o teste deixou apenas o marcador de revogação, sem dados financeiros. O fluxo completo da interface foi testado separadamente com emuladores.

No fluxo anterior com e-mail/senha, em 11/11/2026, o teste no site real confirmou criação de acesso, publicação, persistência da sessão após recarregar, consulta sem login, atualização de pagamento e revogação. Os dados financeiros usados foram os de demonstração em um navegador isolado. A conta temporária do teste precisa ser excluída no console Authentication; seu e-mail começa com `marks-validation-` e termina em `@example.invalid`. O link do teste foi revogado.

## Custos e manutenção

Mantenha o projeto no plano **Spark**. A implementação usa Authentication anônimo (e acesso legado por e-mail/senha) e Firestore, sem Cloud Functions ou Cloud Storage. Dentro das cotas gratuitas, não exige faturamento; atingir as cotas pode interromper operações até a renovação.

O tutorial https://let-me-solo-automation.github.io/Controle_Dividas/tutorial-firebase.html permanece disponível como referência, incluindo as regras de acesso. O configurador do Mac é uma alternativa para criar outro ambiente, não uma etapa necessária para o site já conectado.

## Atualização para links sem vencimento

As regras atuais de `firebase/firestore.rules` foram publicadas pelo proprietário e verificadas em 12/11/2026. Para outro ambiente, publique esse arquivo em Criação/Build → Firestore Database → Regras. O botão Copiar regras em https://let-me-solo-automation.github.io/Controle_Dividas/tutorial-firebase.html#regras contém a versão atualizada. Essa mudança exige acesso administrativo ao console do proprietário; o site não pode alterar regras usando a configuração pública do SDK.

Depois de publicar, recarregue o Marks. Para links anteriores, use Atualizar publicação: o mesmo endereço passa a não vencer. O aplicativo identifica links antigos até a atualização concluir. Visualizar link abre uma prévia dentro do app; Revogar acesso bloqueia o endereço definitivamente. Um novo compartilhamento usa um novo link. O acompanhamento consulta o servidor e não mostra cópias locais sem confirmar o acesso.
