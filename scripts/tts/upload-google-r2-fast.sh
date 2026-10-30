#!/bin/sh
# Premium 語音上傳 R2(快版):直接打 Cloudflare REST API(PUT /r2/buckets/.../objects/<key>),用 wrangler 已登入的 OAuth token
# (~/.wrangler/config/default.toml),不用每個檔案起一次 wrangler(那樣一檔 4~14 秒,這樣一檔 <2 秒且可開 16 併發)。
# token 約一小時到期:每批開始前檢查 expiration_time,剩不到 10 分鐘就跑 wrangler whoami 讓它刷新。
# 冪等:已傳清單 scripts/out/tts-g/<voice>/uploaded.txt。用法:sh scripts/tts/upload-google-r2-fast.sh leda [併發,預設 16]
set -u
V="${1:?voice (leda|charon)}"; P="${2:-16}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="${STAYJP_AUDIO_DIR:-$HOME/Documents/GitHub/stay-jp-audio}/tts-g/$V"
ST="$ROOT/scripts/out/tts-g/$V/uploaded.txt"; mkdir -p "$(dirname "$ST")"; touch "$ST"
CFG="$HOME/.wrangler/config/default.toml"
ACCT="cbd5f1853670279112bc9aae44c4c4a4"; BUCKET="stayjp-audio"
cd "$ROOT" || exit 1
refresh_if_needed() {
  exp="$(grep -o 'expiration_time = "[^"]*"' "$CFG" | cut -d'"' -f2)"
  now="$(date -u +%s)"; expts="$(python3 -c "import datetime,sys;print(int(datetime.datetime.strptime(sys.argv[1][:19],'%Y-%m-%dT%H:%M:%S').replace(tzinfo=datetime.timezone.utc).timestamp()))" "$exp" 2>/dev/null || echo 0)"
  if [ "$((expts - now))" -lt 600 ]; then npx --no-install wrangler whoami >/dev/null 2>&1; fi
}
TODO="$(mktemp)"; node -e 'const d=require(process.argv[1]);for(const h of Object.keys(d))console.log(h+".mp3")' "$ROOT/scripts/out/tts-g/$V/done.json" | grep -vxFf "$ST" > "$TODO"
echo "[$V] to upload: $(wc -l < "$TODO" | tr -d ' ')"
split -l 400 "$TODO" "$TODO.part."
for part in "$TODO".part.*; do
  refresh_if_needed
  TOK="$(grep -o 'oauth_token = "[^"]*"' "$CFG" | cut -d'"' -f2)"
  export TOK DIR ST V ACCT BUCKET
  xargs -P "$P" -n 1 sh -c 'f="$1"; code="$(curl -s -o /dev/null -w "%{http_code}" --max-time 60 --connect-timeout 15 --retry 4 --retry-delay 8 --retry-all-errors -X PUT "https://api.cloudflare.com/client/v4/accounts/$ACCT/r2/buckets/$BUCKET/objects/tts-g%2F$V%2F$f" -H "Authorization: Bearer $TOK" -H "Content-Type: audio/mpeg" -H "Cache-Control: public, max-age=31536000, immutable" --data-binary "@$DIR/$f")"; [ "$code" = "200" ] && echo "$f" >> "$ST" || echo "FAIL $f $code" >&2' _ < "$part"
  echo "[$V] uploaded so far: $(wc -l < "$ST" | tr -d ' ')"
done
rm -f "$TODO" "$TODO".part.*
echo "[$V] uploaded total: $(wc -l < "$ST" | tr -d ' ') / $(ls "$DIR" | wc -l | tr -d ' ')"
