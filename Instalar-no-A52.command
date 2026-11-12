#!/bin/bash
set -euo pipefail
MARKS_ROOT="$(cd "$(dirname "$0")" && pwd -P)"
MARKS_APK="$MARKS_ROOT/Marks-Android.apk"
MARKS_EXPECTED_SHA="e19c96a8caa2ecdac553b78f982a3314e16ed54f259fd0f18204829585c55085"
MARKS_ADB=""
MARKS_TARGET=""
MARKS_COUNT=0

fail() { printf '\n%s\n' "$1"; exit 1; }
trap 'printf "\nA instalação não terminou. Copie a mensagem de erro desta janela para o atendimento. Os dados do app não foram apagados por este instalador.\n"' ERR

printf '\nMarks 2.1.1 — instalação no Galaxy A52 pelo Mac\n'
[ -f "$MARKS_APK" ] || fail "Coloque Marks-Android.apk na mesma pasta deste arquivo .command."
MARKS_ACTUAL_SHA="$(shasum -a 256 "$MARKS_APK" | awk '{print $1}')"
[ "$MARKS_ACTUAL_SHA" = "$MARKS_EXPECTED_SHA" ] || fail "O APK está incompleto ou não é o arquivo 2.1.1 desta entrega. Baixe o pacote novamente."

if command -v adb >/dev/null 2>&1; then MARKS_ADB="$(command -v adb)"; fi
if [ -z "$MARKS_ADB" ]; then
 for MARKS_CANDIDATE in "$HOME/Library/Android/sdk/platform-tools/adb" /opt/homebrew/bin/adb /usr/local/bin/adb "$MARKS_ROOT/platform-tools/adb"; do
  if [ -x "$MARKS_CANDIDATE" ]; then MARKS_ADB="$MARKS_CANDIDATE"; break; fi
 done
fi
if [ -z "$MARKS_ADB" ]; then
 printf '\nADB não encontrado. Baixando as Platform Tools oficiais do Android para esta pasta…\n'
 curl --fail --location --retry 2 'https://dl.google.com/android/repository/platform-tools-latest-darwin.zip' -o "$MARKS_ROOT/platform-tools.zip"
 unzip -oq "$MARKS_ROOT/platform-tools.zip" -d "$MARKS_ROOT"
 MARKS_ADB="$MARKS_ROOT/platform-tools/adb"
fi
[ -x "$MARKS_ADB" ] || fail "Não foi possível localizar o ADB executável."
"$MARKS_ADB" start-server

find_a52() {
 MARKS_TARGET=""; MARKS_COUNT=0
 while IFS= read -r MARKS_SERIAL; do
  [ -n "$MARKS_SERIAL" ] || continue
  MARKS_MODEL="$("$MARKS_ADB" -s "$MARKS_SERIAL" shell getprop ro.product.model 2>/dev/null | tr -d '\r')"
  case "$MARKS_MODEL" in
   SM-A525*|SM-A526*|SM-A528*) MARKS_TARGET="$MARKS_SERIAL"; MARKS_COUNT=$((MARKS_COUNT + 1));;
  esac
 done < <("$MARKS_ADB" devices | awk 'NR>1 && $2=="device" {print $1}')
}
find_a52
if [ "$MARKS_COUNT" -eq 0 ]; then
 printf '\nNenhum Galaxy A52 autorizado foi encontrado no ADB deste usuário do Mac.\n'
 MARKS_ADDRESS="${1:-}"
 if [ -z "$MARKS_ADDRESS" ]; then read -r -p 'Digite o IP:porta mostrado em Depuração sem fio no A52: ' MARKS_ADDRESS; fi
 [[ "$MARKS_ADDRESS" =~ ^[0-9.]+:[0-9]+$ ]] || fail "Endereço inválido. Use IP:porta, por exemplo 192.168.1.10:40000."
 "$MARKS_ADB" connect "$MARKS_ADDRESS" || true
 find_a52
fi
[ "$MARKS_COUNT" -ne 0 ] || fail "O A52 ainda não está conectado/autorizado neste ADB. Confira o pareamento sem fio e mantenha o celular desbloqueado."
[ "$MARKS_COUNT" -eq 1 ] || fail "Há mais de um A52 conectado. Desconecte os outros aparelhos e execute novamente."
MARKS_MODEL="$("$MARKS_ADB" -s "$MARKS_TARGET" shell getprop ro.product.model | tr -d '\r')"
MARKS_ANDROID="$("$MARKS_ADB" -s "$MARKS_TARGET" shell getprop ro.build.version.release | tr -d '\r')"
printf '\nAparelho: %s · Android %s\n' "$MARKS_MODEL" "$MARKS_ANDROID"
printf 'Instalando a atualização, sem desinstalar nem limpar os dados…\n\n'
"$MARKS_ADB" -s "$MARKS_TARGET" install -r "$MARKS_APK"
"$MARKS_ADB" -s "$MARKS_TARGET" shell am start -n app.marks.finance/.MainActivity
printf '\nMarks instalado e aberto no A52. Você pode fechar esta janela.\n'
read -r -p 'Pressione Enter para fechar…' MARKS_DONE
