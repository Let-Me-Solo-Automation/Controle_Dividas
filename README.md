# Marks

Aplicativo pessoal de finanças com contas, lançamentos, acordos parcelados, comprovantes, metas, reserva, entregas, agenda, lixeira e personalização visual.

**Documentação completa:** [PROJETO-MARKS.md](PROJETO-MARKS.md).

## Abrir e instalar

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
