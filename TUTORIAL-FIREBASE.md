# Marks — ativar o Firebase pelo navegador

Tutorial completo, com botão para copiar as regras: https://let-me-solo-automation.github.io/Controle_Dividas/tutorial-firebase.html

1. Abra https://console.firebase.google.com/ e crie um projeto chamado Marks. Deixe Analytics e Gemini desativados se não precisar deles. Mantenha o plano Spark, sem cartão.
2. Em Build → Authentication → Sign-in method, habilite E-mail/senha e salve.
3. Em Build → Firestore Database, crie um banco Standard, padrão `(default)`, em São Paulo (`southamerica-east1`), no modo de produção.
4. Abra Firestore → Regras. Substitua o texto pelo conteúdo completo de `firebase/firestore.rules` deste projeto e publique. Não use regras que liberam toda a base.
5. Abra Configurações do projeto → Geral → Seus aplicativos → ícone Web `</>`. Registre Marks Web, sem ativar Hosting. Escolha Config e copie o objeto público `firebaseConfig` do seu projeto. Não precisa executar npm: o SDK já está no aplicativo.
6. Em Authentication → Settings → Authorized domains, adicione `let-me-solo-automation.github.io`, sem protocolo nem caminho, preservando os domínios existentes.
7. Cole o `firebaseConfig` nesta conversa. A configuração pública será publicada no site e validada. Não envie senha, token ou chave privada de conta de serviço.

Após a conexão, abra o Marks online → Seções → seu acordo → compartilhar, crie seu acesso por e-mail e senha e gere o link de leitura. Esse acesso é separado do login Google que administra seu Firebase.

O Marks não usa Cloud Functions, Cloud Storage, SMS ou plano Blaze. Há cotas gratuitas; mantenha o Spark sem faturamento. O compartilhamento continua pendente até a configuração real ser publicada.

O caminho automático pelo Mac, usando Configurar-Firebase.command, continua disponível como alternativa em FIREBASE-GRATUITO.md.
