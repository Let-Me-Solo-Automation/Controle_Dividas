#!/bin/bash
set -euo pipefail
MARKS_PREVIEW_ROOT="$(cd "$(dirname "$0")" && pwd -P)"
MARKS_PREVIEW_HTML="$MARKS_PREVIEW_ROOT/Visualizador.html"
if [ ! -f "$MARKS_PREVIEW_HTML" ]; then
 printf 'Extraia o ZIP inteiro e mantenha este arquivo ao lado de Visualizador.html.\n'
 exit 1
fi
/usr/bin/open -a Safari "$MARKS_PREVIEW_HTML"
