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
 for name in source.namelist(): output.writestr(name,source.read(name))
 for path in Path('android/build/dex').glob('*.dex'): output.write(path,path.name)
PY
"$MARKS_TOOLS/zipalign" -f -p 4 "$MARKS_BUILD/unsigned.apk" "$MARKS_BUILD/aligned.apk"
"$MARKS_TOOLS/apksigner" sign --ks "$MARKS_KEYSTORE" --ks-pass "file:$MARKS_KEYSTORE_PASSWORD_FILE" --out output/Marks-Android.apk "$MARKS_BUILD/aligned.apk"
"$MARKS_TOOLS/apksigner" verify --verbose output/Marks-Android.apk
