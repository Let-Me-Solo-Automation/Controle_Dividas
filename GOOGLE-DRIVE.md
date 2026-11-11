# Compartilhar uma seção usando Google Drive

O Google Drive pode guardar os dados e controlar quem os lê. A API do Drive não executa o servidor de compartilhamento que já existe no núcleo do Nexo; precisamos criar um provedor de compartilhamento próprio para Drive.

## Fluxo recomendado para o Nexo Android

1. O proprietário toca em **Conectar Google Drive** e autoriza o app pela conta Google.
2. Ao compartilhar uma seção, o Nexo gera um arquivo JSON contendo somente os dados daquele acordo — título, parcelas, pagamentos e saldo. Contas bancárias, outras seções, comprovantes e chaves de acesso ficam de fora.
3. Esse arquivo é criado em uma pasta do Nexo no Drive. Para compartilhar, usamos um arquivo normal do espaço `drive`, não `appDataFolder` (a pasta privada de dados de aplicativo não permite esse compartilhamento).
4. O proprietário informa o e-mail da pessoa e concede acesso de **leitor** ao arquivo usando a API de permissões do Drive.
5. O destinatário abre o acordo no Nexo, entra com a conta Google autorizada e o app consulta o arquivo para renderizar a tela de acompanhamento.
6. Novos pagamentos atualizam esse arquivo quando há conexão. A tela do destinatário mostra a última atualização e permite atualizar manualmente. Revogar o acesso remove a permissão no Drive.

Recomendação para a primeira versão: proprietário edita e destinatário apenas consulta. Isso evita conflitos entre várias pessoas alterando o mesmo arquivo.

A permissão concedida por e-mail pode gerar um convite automático do Google quando esse fluxo for implementado e usado. Nenhum convite, conexão Google, upload ou compartilhamento foi realizado nesta entrega.

## O que precisamos configurar

- Um projeto no Google Cloud, com Drive API habilitada e tela de consentimento OAuth.
- Clientes OAuth apropriados para Android (pacote e certificado de assinatura) e, se houver versão web, para sua origem autorizada.
- Autorização do usuário e escopo mínimo adequado. `drive.file` é a primeira opção a avaliar para arquivos criados ou explicitamente abertos pelo Nexo. O fluxo do destinatário precisa ser validado com arquivos compartilhados e seleção/abertura explícita, sem assumir acesso à conta inteira.
- No Android, autorização pelo SDK oficial e armazenamento protegido das credenciais. Em fluxos OAuth para clientes públicos que usam authorization code, seguir PKCE e as regras do Google para o tipo de cliente. Nunca incorporar chave privada de conta de serviço ou segredo de backend no HTML/APK.
- Tratamento de sessão expirada, acesso revogado, conexão ausente, cotas e gravações pendentes. O Drive fornece armazenamento e permissões; atualização em tempo real e resolução de conflitos precisam de implementação no app.

O proprietário pode usar a própria conta Google. Não é necessário manter uma conta de serviço com acesso a todos os acordos. A configuração e eventual verificação OAuth dependem do público e dos escopos escolhidos.

## E se a pessoa não tiver o Nexo?

Precisamos de uma **página de acompanhamento hospedada**, que abre a seção e autentica o destinatário com Google. O Drive armazena o JSON; a página hospedada fornece a interface. Um link comum do Drive para o JSON não se transforma automaticamente em uma tela do Nexo.

Também existe a possibilidade de tornar o arquivo público para qualquer pessoa com o link, mas isso aumenta a exposição de dados financeiros. Para o caso descrito, o acesso de leitor por e-mail é a opção recomendada.

## O protótipo HTML atual

O arquivo offline continua sem integração Google. OAuth web exige origem configurada; a integração deve ser validada no servidor local de desenvolvimento ou em uma página hospedada, e depois no Android. Ela não deve depender de abrir o HTML por `file://`.

A integração com Drive ainda não foi implementada nem simulada na interface. Esta entrega mantém o compartilhamento existente e documenta a substituição proposta. Não existe conta Google conectada ao projeto.

## Referências oficiais consultadas

- Arquivos e espaços do Drive: https://developers.google.com/workspace/drive/api/guides/about-files
- Compartilhamento e permissões: https://developers.google.com/workspace/drive/api/guides/manage-sharing
- Escopos: https://developers.google.com/workspace/drive/api/guides/api-specific-auth
- Autorização em aplicativos instalados: https://developers.google.com/identity/protocols/oauth2/native-app
