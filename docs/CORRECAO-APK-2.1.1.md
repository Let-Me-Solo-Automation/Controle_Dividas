# Correção de instalação Android — 2.1.1

O APK 2.1.0 tinha um erro de empacotamento: a remontagem do ZIP comprimiu `resources.arsc`, embora o aapt tivesse produzido esse arquivo sem compressão. Android 11 e versões posteriores rejeitam essa condição em aplicativos com alvo API 30 ou superior. A verificação anterior de assinatura passou, mas não identificava esse requisito de recursos.

Na versão 2.1.1:

- A remontagem preserva a compressão original de cada entrada do aapt.
- `resources.arsc` permanece em ZIP_STORED e alinhado em 4 bytes.
- O script verifica explicitamente essas duas condições depois de assinar.
- O pacote continua sendo `app.marks.finance`, com a mesma assinatura.
- `versionCode` subiu de 1 para 2, e `versionName` passou para 2.1.1.
- A versão mínima continua Android 8.0 (API 26). Galaxy A52, lançado com Android 11, é compatível com esse requisito. A depuração USB não impede a instalação normal.

O APK foi reconstruído, verificado pelo apksigner e pelo zipalign e teve seu manifesto inspecionado. Não houve instalação em aparelho físico nesta execução.

Se o instalador continuar recusando o arquivo, use o arquivo 2.1.1 atual. Com Android Platform Tools no computador e o aparelho autorizado via USB, `adb install -r Marks-Android.apk` mostra o código técnico de erro. Não é necessário desinstalar uma versão existente para tentar a atualização assinada com a mesma chave; desinstalar pode apagar os dados locais.

## Privacidade do repositório

O site público do GitHub Pages foi retirado. O workflow atual só compila artefatos quando `repository.private` for verdadeiro e não publica sites. Enquanto o repositório estiver público, a assinatura privada não será enviada.

O HTML do simulador deve ser baixado de `Visualizador.html` e aberto localmente. O GitHub mostra o código do HTML no navegador; use Download raw file para baixar. O arquivo ZIP completo também contém o visualizador na raiz.
