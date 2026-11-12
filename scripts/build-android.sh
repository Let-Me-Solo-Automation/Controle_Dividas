#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${MARKS_ANDROID_SDK:?Defina MARKS_ANDROID_SDK para a pasta do Android SDK}"
: "${MARKS_KEYSTORE:?Defina MARKS_KEYSTORE para a chave de assinatura privada}"
: "${MARKS_KEYSTORE_PASSWORD_FILE:?Defina MARKS_KEYSTORE_PASSWORD_FILE para o arquivo privado da senha}"
MARKS_TOOLS="$MARKS_ANDROID_SDK/build-tools/35.0.0"
MARKS_PLATFORM="$MARKS_ANDROID_SDK/platforms/android-35/android.jar"
MARKS_BUILD="android/build"
mkdir -p "$MARKS_BUILD/classes" "$MARKS_BUILD/dex" android/app/src/main/assets output
node scripts/prepare-android.mjs
"$MARKS_TOOLS/aapt" package -f -M android/app/src/main/AndroidManifest.xml -S android/app/src/main/res -A android/app/src/main/assets -I "$MARKS_PLATFORM" -F "$MARKS_BUILD/resources.apk"
java com.sun.tools.javac.Main -source 8 -target 8 -bootclasspath "$MARKS_TOOLS/core-lambda-stubs.jar:$MARKS_PLATFORM" -d "$MARKS_BUILD/classes" android/app/src/main/java/app/marks/finance/MainActivity.java
find "$MARKS_BUILD/classes" -name '*.class' -print0 | xargs -0 "$MARKS_TOOLS/d8" --lib "$MARKS_PLATFORM" --min-api 26 --output "$MARKS_BUILD/dex"
python3 - <<'PY'
from zipfile import ZipFile, ZIP_DEFLATED
from pathlib import Path
with ZipFile('android/build/resources.apk') as source, ZipFile('android/build/unsigned.apk','w',ZIP_DEFLATED) as output:
 for info in source.infolist(): output.writestr(info,source.read(info.filename))
 for path in Path('android/build/dex').glob('*.dex'): output.write(path,path.name)
PY
"$MARKS_TOOLS/zipalign" -f -p 4 "$MARKS_BUILD/unsigned.apk" "$MARKS_BUILD/aligned.apk"
"$MARKS_TOOLS/apksigner" sign --ks "$MARKS_KEYSTORE" --ks-pass "file:$MARKS_KEYSTORE_PASSWORD_FILE" --out output/Marks-Android.apk "$MARKS_BUILD/aligned.apk"
"$MARKS_TOOLS/apksigner" verify --verbose output/Marks-Android.apk

"$MARKS_TOOLS/zipalign" -c 4 output/Marks-Android.apk
python3 - <<'PYCODE'
from zipfile import ZipFile, ZIP_STORED
from pathlib import Path
import struct
apk=Path('output/Marks-Android.apk')
with ZipFile(apk) as archive:
 info=archive.getinfo('resources.arsc')
 assert info.compress_type == ZIP_STORED, 'resources.arsc deve ficar descomprimido (Android 11+)'
 with apk.open('rb') as stream:
  stream.seek(info.header_offset)
  header=stream.read(30)
  name_length, extra_length=struct.unpack_from('<HH',header,26)
  data_offset=info.header_offset+30+name_length+extra_length
 assert data_offset % 4 == 0, 'resources.arsc deve estar alinhado em 4 bytes'
print('Empacotamento validado: resources.arsc sem compressão e alinhado em 4 bytes.')
PYCODE
