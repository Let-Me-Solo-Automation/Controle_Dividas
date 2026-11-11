#!/bin/bash
set -e
NEXO_SOURCE="$(cd "$(dirname "$0")" && pwd -P)"
NEXO_DEST="$HOME/Desktop/Nexo-Simulador"
if [ "$NEXO_SOURCE" != "$NEXO_DEST" ]; then
  if [ -e "$NEXO_DEST" ]; then NEXO_DEST="$HOME/Desktop/Nexo-Simulador-$(date +%Y%m%d-%H%M%S)"; fi
  mkdir -p "$HOME/Desktop"
  ditto "$NEXO_SOURCE" "$NEXO_DEST"
fi
chmod +x "$NEXO_DEST/Iniciar.command"
exec "$NEXO_DEST/Iniciar.command"
