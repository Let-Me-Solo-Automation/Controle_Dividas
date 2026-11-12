# Validação da entrega 2.1.0

Verificações executadas nesta entrega:

- `npm run check`: aprovado.
- `npm run test:model`: aprovado; centavos, projeção pública/privacidade, pagamentos parciais e agenda de fim de mês.
- `npm run test:reserve`: aprovado; migração, aportes/resgates, notas, saldos e planos.
- `npm test`: **42 testes aprovados**, incluindo configuração do vidro, metas, estilos, lixeira/restauração, parcelas/comprovantes, cenários isolados, telas pequenas, teclado, acessibilidade e assets do contêiner Android.
- `scripts/build-android.sh`: APK compilado e alinhado. Assinaturas APK v2 e v3 verificadas pelo Android SDK.
- `aapt dump badging`: pacote `app.marks.finance`, versão `2.1.0`, código `1`, Android mínimo API 26, alvo API 35, permissão de internet.
- `node scripts/verify-delivery.mjs`: HTML autônomo, fontes/documentação obrigatórios, APK atual e ausência de keystore/senha no ZIP público.

O teste dos assets Android abre o HTML embarcado no navegador e simula a ponte de exportação. Ele não substitui testes instrumentados nem valida um seletor de arquivos real do Android. Não houve aparelho Android físico ou emulador Android nesta execução. Firebase de produção e os emuladores de regras não foram exercitados novamente nesta entrega; o código de regras permanece no projeto para sua suíte própria.

O prazo da lixeira é avaliado ao abrir e durante o uso. Não existe tarefa Android de limpeza com o processo encerrado. Os dados de demonstração usam armazenamento separado.

Hashes dos artefatos estão em `BUILD-INFO.json`. Preserve a chave privada de assinatura entregue separadamente para continuar atualizando a mesma instalação.
