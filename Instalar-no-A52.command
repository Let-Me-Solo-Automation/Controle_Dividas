#!/bin/bash
set -euo pipefail
MARKS_ROOT="$(cd "$(dirname "$0")" && pwd -P)"
MARKS_APK="$MARKS_ROOT/Marks-Android.apk"
MARKS_EXPECTED_SHA="49962201b69f1f50b0a58de1d09a0ee65ede2ceff5afdf871495ce92b02e7e84"
MARKS_ADB=""
MARKS_TARGET=""
MARKS_COUNT=0

fail() { printf '\n%s\n' "$1"; exit 1; }
trap 'printf "\nA instalação não terminou. Copie a mensagem de erro desta janela para o atendimento. Os dados do app não foram apagados por este instalador.\n"' ERR

printf '\nMarks 2.1.2 — instalação no Galaxy A52 pelo Mac\n'
[ -f "$MARKS_APK" ] || fail "Coloque Marks-Android.apk na mesma pasta deste arquivo .command."
MARKS_ACTUAL_SHA="$(shasum -a 256 "$MARKS_APK" | awk '{print $1}')"
[ "$MARKS_ACTUAL_SHA" = "$MARKS_EXPECTED_SHA" ] || fail "O APK está incompleto ou não é o arquivo 2.1.2 desta entrega. Baixe o pacote novamente."

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

MARKS_WIFI_IP="192.168.18.121"
read_port() {
 local MARKS_PROMPT="$1" MARKS_PORT_INPUT
 while true; do
  read -r -p "$MARKS_PROMPT ($MARKS_WIFI_IP:): " MARKS_PORT_INPUT
  if [[ "$MARKS_PORT_INPUT" =~ ^[0-9]{1,5}$ ]] && [ "$((10#$MARKS_PORT_INPUT))" -ge 1 ] && [ "$((10#$MARKS_PORT_INPUT))" -le 65535 ]; then
   MARKS_PORT="$((10#$MARKS_PORT_INPUT))"; return
  fi
  printf 'Digite somente a porta, de 1 a 65535. Exemplo: 42603.\n'
 done
}
printf '\nWi-Fi: celular e Mac devem estar na mesma rede. IP fixo: %s\n' "$MARKS_WIFI_IP"
printf 'No A52, abra Opções do desenvolvedor → Depuração sem fio → Parear dispositivo com código.\n'
read_port 'Porta mostrada na janela de pareamento'
MARKS_PAIR_ADDRESS="$MARKS_WIFI_IP:$MARKS_PORT"
while true; do
 read -r -s -p 'Código de pareamento (6 dígitos): ' MARKS_PAIR_CODE
 printf '\n'
 [[ "$MARKS_PAIR_CODE" =~ ^[0-9]{6}$ ]] && break
 printf 'O código deve conter exatamente seis dígitos.\n'
done
# Send the temporary code through stdin, without exposing it in process arguments.
if ! printf '%s\n' "$MARKS_PAIR_CODE" | "$MARKS_ADB" pair "$MARKS_PAIR_ADDRESS"; then
 unset MARKS_PAIR_CODE
 fail "Não foi possível parear. Abra um novo código no A52 e execute novamente."
fi
unset MARKS_PAIR_CODE
printf '\nVolte à tela principal de Depuração sem fio. Use agora a porta de “Endereço IP e porta”, que pode ser diferente da porta de pareamento.\n'
read_port 'Porta de conexão'
MARKS_ADDRESS="$MARKS_WIFI_IP:$MARKS_PORT"
"$MARKS_ADB" connect "$MARKS_ADDRESS"
# Target only the endpoint explicitly entered, never an unrelated connected phone.
"$MARKS_ADB" -s "$MARKS_ADDRESS" get-state >/dev/null || fail "O A52 ainda não está conectado. Confira a porta de conexão."
MARKS_MODEL="$("$MARKS_ADB" -s "$MARKS_ADDRESS" shell getprop ro.product.model 2>/dev/null | tr -d '\r')"
case "$MARKS_MODEL" in
 SM-A525*|SM-A526*|SM-A528*) MARKS_TARGET="$MARKS_ADDRESS"; MARKS_COUNT=1;;
 *) fail "O endereço informado não identificou um Galaxy A52. Nenhum APK foi instalado.";;
esac
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
