#!/bin/bash
set -e
NEXO_PROJECT="$(cd "$(dirname "$0")" && pwd -P)"
source "$NEXO_PROJECT/scripts/prepare-mac.sh"
node scripts/setup-firebase.mjs
read -r -p 'Pressione Enter para fechar.' NEXO_CONTINUE
