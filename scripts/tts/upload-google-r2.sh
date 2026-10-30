#!/bin/sh
# 把 Premium 語音(scripts/tts/gen-google.mjs 產,repo 外)推上 Cloudflare R2 bucket stayjp-audio → tts-g/<voice>/<hash>.mp3
# 冪等:已傳清單 scripts/out/tts-g/<voice>/uploaded.txt,只傳沒傳過的。wrangler 4 的 r2 object put 一定要 --remote。
# 用法:sh scripts/tts/upload-google-r2.sh leda [併發數,預設 6]
set -u
V="${1:?voice (leda|charon)}"; P="${2:-6}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="${STAYJP_AUDIO_DIR:-$HOME/Documents/GitHub/stay-jp-audio}/tts-g/$V"
ST="$ROOT/scripts/out/tts-g/$V/uploaded.txt"; mkdir -p "$(dirname "$ST")"; touch "$ST"
cd "$ROOT" || exit 1
# 只傳 gen-google.mjs 這輪記在 done.json 的 hash(避免把舊規則產的檔傳上去)
DONE="$ROOT/scripts/out/tts-g/$V/done.json"
TODO="$(mktemp)"; node -e 'const d=require(process.argv[1]);for(const h of Object.keys(d))console.log(h+".mp3")' "$DONE" | grep -vxFf "$ST" > "$TODO"
echo "[$V] to upload: $(wc -l < "$TODO" | tr -d ' ')"
xargs -P "$P" -n 1 sh "$ROOT/scripts/tts/upload-one.sh" "$V" "$DIR" "$ST" < "$TODO"
rm -f "$TODO"
echo "[$V] uploaded total: $(wc -l < "$ST" | tr -d ' ') / $(ls "$DIR" | wc -l | tr -d ' ')"
