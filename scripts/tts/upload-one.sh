#!/bin/sh
# upload-google-r2.sh 的單檔工作程式(xargs -I 的替換字串有 255 bytes 上限,指令塞不進去才拆出來)
# 用法:sh upload-one.sh <voice> <dir> <uploaded.txt> <file.mp3>
V="$1"; DIR="$2"; ST="$3"; F="$4"
npx --no-install wrangler r2 object put "stayjp-audio/tts-g/$V/$F" --file "$DIR/$F" --content-type audio/mpeg --cache-control "public, max-age=31536000, immutable" --remote >/dev/null 2>&1 && echo "$F" >> "$ST"
