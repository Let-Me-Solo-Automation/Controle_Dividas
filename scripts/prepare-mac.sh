#!/bin/bash
set -e
NEXO_PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$NEXO_PROJECT"
printf '\nNexo · preparando o ambiente de desenvolvimento\n\n'
NEXO_USE_LOCAL=1
if command -v node >/dev/null 2>&1; then
  if node -e 'const [major,minor]=process.versions.node.split(".").map(Number); process.exit(major>22||(major===22&&minor>=12)?0:1)'; then
    NEXO_USE_LOCAL=0
  fi
fi
if [ "$NEXO_USE_LOCAL" = 1 ]; then
  NEXO_NODE_DIR="$NEXO_PROJECT/.runtime/node"
  if [ ! -x "$NEXO_NODE_DIR/bin/node" ]; then
    case "$(uname -m)" in arm64) NEXO_ARCH=arm64 ;; x86_64) NEXO_ARCH=x64 ;; *) printf 'Arquitetura não suportada. Abra dist/Nexo-Simulador_1.html para validar a prévia.\n'; exit 1 ;; esac
    mkdir -p "$NEXO_PROJECT/.runtime/download" "$NEXO_NODE_DIR"
    NEXO_DOWNLOAD="$NEXO_PROJECT/.runtime/download"
    printf 'Instalando Node.js 24 LTS dentro desta pasta…\n'
    curl --fail --location --proto '=https' --tlsv1.2 'https://nodejs.org/dist/latest-v24.x/SHASUMS256.txt' -o "$NEXO_DOWNLOAD/SHASUMS256.txt"
    NEXO_ARCHIVE="$(awk -v suffix="-darwin-$NEXO_ARCH.tar.gz" 'index($2,suffix) && length($2)-length(suffix)+1==index($2,suffix) {print $2;exit}' "$NEXO_DOWNLOAD/SHASUMS256.txt")"
    if [ -z "$NEXO_ARCHIVE" ]; then printf 'Não foi possível localizar o Node para este Mac.\n'; exit 1; fi
    curl --fail --location --proto '=https' --tlsv1.2 "https://nodejs.org/dist/latest-v24.x/$NEXO_ARCHIVE" -o "$NEXO_DOWNLOAD/$NEXO_ARCHIVE"
    NEXO_EXPECTED="$(awk -v file="$NEXO_ARCHIVE" '$2==file {print $1}' "$NEXO_DOWNLOAD/SHASUMS256.txt")"
    NEXO_ACTUAL="$(shasum -a 256 "$NEXO_DOWNLOAD/$NEXO_ARCHIVE" | awk '{print $1}')"
    if [ "$NEXO_EXPECTED" != "$NEXO_ACTUAL" ]; then printf 'Verificação do download falhou. Nenhum instalador foi executado.\n'; exit 1; fi
    tar -xzf "$NEXO_DOWNLOAD/$NEXO_ARCHIVE" -C "$NEXO_NODE_DIR" --strip-components=1
  fi
  export PATH="$NEXO_NODE_DIR/bin:$PATH"
fi
printf 'Instalando as dependências do projeto…\n'
npm ci --no-audit --no-fund
