#!/bin/bash
set -e
NEXO_PROJECT="$(cd "$(dirname "$0")" && pwd -P)"
source "$NEXO_PROJECT/scripts/prepare-mac.sh"
printf '\nTudo pronto. O simulador será aberto no navegador.\nMantenha esta janela aberta. Para encerrar, pressione Control+C.\n\n'
npm run dev
