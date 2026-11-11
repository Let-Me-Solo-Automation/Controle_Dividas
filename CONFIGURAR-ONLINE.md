# Marks online e Firebase conectado

Site: https://let-me-solo-automation.github.io/Controle_Dividas/
Código: https://github.com/Let-Me-Solo-Automation/Controle_Dividas
Firebase: `marks-79823`, aplicativo `Marks Web`.

Authentication por e-mail/senha, Firestore e domínio autorizado foram configurados pelo proprietário. O site já inclui a configuração pública correta. Não é necessário executar comandos npm ou o configurador para criar outro projeto.

## Compartilhar uma seção

1. Abra o site, entre em **Seções** e escolha um acordo.
2. Toque em **Compartilhar seção** e crie seu acesso de e-mail e senha, ou entre na conta que já criou no Marks.
3. Escolha **Criar link por 30 dias** e envie o link ao destinatário.
4. Registre os pagamentos no Marks: o acompanhamento é atualizado enquanto você estiver conectado e online.
5. Use **Revogar acesso** para encerrar a consulta daquele link.

O destinatário não precisa criar conta. Somente a seção escolhida é publicada. Os demais registros continuam no navegador. A versão HTML offline permite testar a interface; para compartilhar, use o site online.

## Validação de produção

Em 11/11/2026, o teste no site real confirmou criação de acesso, publicação, persistência da sessão após recarregar, consulta sem login, atualização de pagamento e revogação. Os dados financeiros usados foram os de demonstração em um navegador isolado. A conta temporária do teste precisa ser excluída no console Authentication; seu e-mail começa com `marks-validation-` e termina em `@example.invalid`. O link do teste foi revogado.

## Custos e manutenção

Mantenha o projeto no plano **Spark**. A implementação usa Authentication por e-mail/senha e Firestore, sem Cloud Functions ou Cloud Storage. Dentro das cotas gratuitas, não exige faturamento; atingir as cotas pode interromper operações até a renovação.

O tutorial https://let-me-solo-automation.github.io/Controle_Dividas/tutorial-firebase.html permanece disponível como referência, incluindo as regras de acesso. O configurador do Mac é uma alternativa para criar outro ambiente, não uma etapa necessária para o site já conectado.
