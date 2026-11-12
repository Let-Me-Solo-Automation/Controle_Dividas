#!/bin/bash
set -euo pipefail
MARKS_ROOT="$(cd "$(dirname "$0")" && pwd -P)"
MARKS_APK="$MARKS_ROOT/Marks-Android.apk"
MARKS_EXPECTED_SHA="2fbac96c611a1b9c79394313034ec8528b413d513ffebfc70ff7969f874f8f0d"
MARKS_ADB=""
MARKS_TARGET=""
MARKS_COUNT=0

fail() { printf '\n%s\n' "$1"; exit 1; }
trap 'printf "\nA instalação não terminou. Copie a mensagem de erro desta janela para o atendimento. Os dados do app não foram apagados por este instalador.\n"' ERR

printf '\nMarks 2.2.0 — instalação no Galaxy A52 pelo Mac\n'
[ -f "$MARKS_APK" ] || fail "Coloque Marks-Android.apk na mesma pasta deste arquivo .command."
MARKS_ACTUAL_SHA="$(shasum -a 256 "$MARKS_APK" | awk '{print $1}')"
[ "$MARKS_ACTUAL_SHA" = "$MARKS_EXPECTED_SHA" ] || fail "O APK está incompleto ou não é o arquivo 2.2.0 desta entrega. Baixe o pacote novamente."

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

read_address() {
 local MARKS_PROMPT="$1" MARKS_INPUT MARKS_HOST MARKS_PORT MARKS_OCTET MARKS_VALID
 local -a MARKS_OCTETS
 while true; do
  read -r -p "$MARKS_PROMPT (IP:porta): " MARKS_INPUT
  if [[ "$MARKS_INPUT" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}:[0-9]{1,5}$ ]]; then
   MARKS_HOST="${MARKS_INPUT%:*}"; MARKS_PORT="${MARKS_INPUT##*:}"; MARKS_VALID=1
   IFS=. read -r -a MARKS_OCTETS <<< "$MARKS_HOST"
   for MARKS_OCTET in "${MARKS_OCTETS[@]}"; do
    [ "$((10#$MARKS_OCTET))" -le 255 ] || MARKS_VALID=0
   done
   if [ "$MARKS_VALID" -eq 1 ] && [ "$((10#$MARKS_PORT))" -ge 1 ] && [ "$((10#$MARKS_PORT))" -le 65535 ]; then
    MARKS_ADDRESS="$MARKS_HOST:$((10#$MARKS_PORT))"; return
   fi
  fi
  printf 'Digite o endereço completo, por exemplo 192.168.18.121:42603.\n'
 done
}
# Reuse an authorized A52 connection, including Android mDNS serials.
while IFS= read -r MARKS_SERIAL; do
 [ -n "$MARKS_SERIAL" ] || continue
 MARKS_MODEL="$("$MARKS_ADB" -s "$MARKS_SERIAL" shell getprop ro.product.model 2>/dev/null | tr -d '\r')"
 case "$MARKS_MODEL" in
  SM-A525*|SM-A526*|SM-A528*) MARKS_TARGET="$MARKS_SERIAL"; MARKS_COUNT=$((MARKS_COUNT + 1));;
 esac
done < <("$MARKS_ADB" devices | awk 'NR>1 && $2=="device" {print $1}')
if [ "$MARKS_COUNT" -eq 0 ]; then
 printf '\nWi-Fi: celular e Mac devem estar na mesma rede.\n'
 printf 'No A52, abra Opções do desenvolvedor → Depuração sem fio → Parear dispositivo com código. Mantenha essa janela aberta.\n'
 while true; do
  read_address 'Endereço mostrado na janela de pareamento'
  while true; do
   read -r -s -p 'Código de pareamento (6 dígitos): ' MARKS_PAIR_CODE
   printf '\n'
   [[ "$MARKS_PAIR_CODE" =~ ^[0-9]{6}$ ]] && break
   unset MARKS_PAIR_CODE
   printf 'Digite exatamente os seis dígitos mostrados no celular.\n'
  done
  # Pass the code directly: adb 37 on this Mac failed when reading it interactively.
  if "$MARKS_ADB" pair "$MARKS_ADDRESS" "$MARKS_PAIR_CODE"; then
   unset MARKS_PAIR_CODE
   break
  fi
  unset MARKS_PAIR_CODE
  printf '\nO pareamento falhou. Gere um novo código no celular e informe o novo IP:porta abaixo.\n'
 done
 printf '\nVolte à tela principal de Depuração sem fio. Copie o “Endereço IP e porta” de conexão, que pode ser diferente do pareamento.\n'
 read_address 'Endereço de conexão'
 "$MARKS_ADB" connect "$MARKS_ADDRESS"
 # Target only the endpoint explicitly entered, never an unrelated connected phone.
 "$MARKS_ADB" -s "$MARKS_ADDRESS" get-state >/dev/null || fail "O A52 ainda não está conectado. Confira a porta de conexão."
 MARKS_MODEL="$("$MARKS_ADB" -s "$MARKS_ADDRESS" shell getprop ro.product.model 2>/dev/null | tr -d '\r')"
 case "$MARKS_MODEL" in
  SM-A525*|SM-A526*|SM-A528*) MARKS_TARGET="$MARKS_ADDRESS"; MARKS_COUNT=1;;
  *) fail "O endereço informado não identificou um Galaxy A52. Nenhum APK foi instalado.";;
 esac
elif [ "$MARKS_COUNT" -eq 1 ]; then
 printf '\nA52 já conectado e autorizado no Mac. Pulando pareamento e conexão.\n'
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
