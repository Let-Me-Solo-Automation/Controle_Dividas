# Marks — ativar o Firebase pelo navegador

O projeto atual é `marks-79823`; não crie outro projeto para usar o site já conectado. Para habilitar o compartilhamento sem cadastro, abra https://console.firebase.google.com/project/marks-79823/authentication/providers e escolha **Authentication → Método de login → Adicionar novo provedor → Anônimo → Ativar → Salvar**. Preserve E-mail/senha para contas antigas e mantenha desativada a limpeza automática de usuários anônimos, se oferecida. O SDK público não pode habilitar provedores; essa etapa exige o administrador.

Tutorial completo para configurar outro ambiente, com botão para copiar as regras: https://let-me-solo-automation.github.io/Controle_Dividas/tutorial-firebase.html

1. Abra https://console.firebase.google.com/ e crie um projeto chamado Marks. Deixe Analytics e Gemini desativados se não precisar deles. Mantenha o plano Spark, sem cartão.
2. Em Build → Authentication → Sign-in method, habilite **Anônimo / Anonymous** e salve. Mantenha E-mail/senha habilitado se houver contas anteriores.
3. Em Build → Firestore Database, crie um banco Standard, padrão `(default)`, em São Paulo (`southamerica-east1`), no modo de produção.
4. Abra Firestore → Regras. Substitua o texto pelo conteúdo completo de `firebase/firestore.rules` deste projeto e publique. Não use regras que liberam toda a base.
5. Abra Configurações do projeto → Geral → Seus aplicativos → ícone Web `</>`. Registre Marks Web, sem ativar Hosting. Escolha Config e copie o objeto público `firebaseConfig` do seu projeto. Não precisa executar npm: o SDK já está no aplicativo.
6. Em Authentication → Settings → Authorized domains, adicione `let-me-solo-automation.github.io`, sem protocolo nem caminho, preservando os domínios existentes.
7. Cole o `firebaseConfig` nesta conversa. A configuração pública será publicada no site e validada. Não envie senha, token ou chave privada de conta de serviço.

Após a conexão, abra o Marks online → Seções → seu acordo → compartilhar, toque em **Criar link sem vencimento**. Não há formulário de cadastro. Um acesso anônimo é salvo neste navegador, apenas ao publicar ou revogar; abrir a tela ou um link recebido não cria usuário. Use o mesmo navegador para gerenciar os links. Limpar seus dados perde esse acesso; o backup dos acordos não o recupera. Links antigos continuam ligados à conta original, disponível na opção **Já publicava com e-mail e senha?**.

O Marks não usa Cloud Functions, Cloud Storage, SMS ou plano Blaze. Há cotas gratuitas; mantenha o Spark sem faturamento. A configuração real já está publicada para `marks-79823`; habilitar Anônimo e publicar as regras atuais são ações administrativas separadas.

O caminho automático pelo Mac, usando Configurar-Firebase.command, continua disponível como alternativa em FIREBASE-GRATUITO.md.
