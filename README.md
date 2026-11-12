# Marks

Aplicativo pessoal de finanças com contas, lançamentos, acordos parcelados, comprovantes, metas, reserva, entregas, agenda, lixeira e personalização visual.

**Android 2.1.3:** hierarquia e espaçamento revisados, vidro do cabeçalho configurável, blur de revelação mais perceptível e navegação simplificada. Veja [o refinamento de UI e UX](docs/UI-UX-2.1.3.md).

**Desempenho, 2.1.2:** perfil automático de desempenho no Android, mantendo o blur de entrada dos cards e o vidro do menu. Veja [as otimizações](docs/DESEMPENHO-ANDROID-2.1.2.md).

**Correção anterior, 2.1.1:** substitui o APK 2.1.0 e corrige a compressão de recursos que impedia a instalação em Android 11+. Mesma chave de assinatura; código de versão incrementado. Veja [a correção](docs/CORRECAO-APK-2.1.1.md).

O site público foi retirado. O workflow só gera artefatos autenticados quando o repositório está privado. Baixe `Visualizador.html` para abrir a simulação no computador.

**Documentação completa:** [PROJETO-MARKS.md](PROJETO-MARKS.md).

## Abrir e instalar

- **Somente visualização:** baixe `entregas/Marks-Visualizador.zip`, extraia e abra `Visualizador.html` no navegador. No Mac, `Abrir-Visualizador.command` abre no Safari. O GitHub não executa o HTML na página do repositório.
- **Visualizador na raiz:** abra `Visualizador.html`. É um HTML completo gerado pelo build, com cenários de demonstração separados dos dados atuais.
- **Android:** instale `Marks-Android.apk` em Android 8.0 ou superior. O primeiro uso começa vazio. Para trazer dados do navegador, exporte o backup JSON e importe pelo app.
- **Código:** `src/` contém a aplicação web; `android/` contém o contêiner Java/WebView; `firebase/` contém as regras de compartilhamento.

```sh
npm ci
npm run check
npm run build
npm run dev
```

O arquivo HTML é um artefato de visualização. Edite os fontes e gere novamente com `npm run build`.

A assinatura Android usa uma chave privada separada do código público. Preserve a chave e sua senha para instalar atualizações sem trocar a identidade do aplicativo.
