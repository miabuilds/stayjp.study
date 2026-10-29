#!/bin/zsh
# 2026-10-29 綠界定期定額第 3 期起續扣被 idempotency 吃掉 → 部署修正 + 重送當天被吃掉的 3 筆
#
# 用法:cd ~/Documents/GitHub/stay-jp-notes && zsh scripts/fix-ecpay-renew-20261029.sh
#
# 1. 部署 ecpayCallback(functions/src/ecpay-callback.ts 已改用 invoiceKey 判重)
# 2. 把 scripts/out/ecpay-replay-20261029.json 裡 3 筆原始 payload 原封不動 POST 回 callback
#    (CheckMacValue 是綠界算的,原樣重送就會驗過;修好的 callback 會記帳 + 延長 30 天 + 開發票)
# 3. 印帳本跟到期日給你看
set -e
cd "$(dirname "$0")/.."

echo "=== 1/3 部署 ecpayCallback ==="
firebase deploy --only functions:ecpayCallback --project jpnote-1bdd6

echo
echo "=== 2/3 重送 3 筆續扣通知 ==="
URL="https://ecpaycallback-lsd7okt5qa-de.a.run.app"
while IFS= read -r line; do
  [ -z "$line" ] && continue
  uid=$(echo "$line" | node -pe 'JSON.parse(require("fs").readFileSync(0,"utf8")).CustomField1.slice(0,8)')
  form=$(echo "$line" | node -e '
    const b = JSON.parse(require("fs").readFileSync(0, "utf8"));
    process.stdout.write(new URLSearchParams(b).toString());
  ')
  printf "%s → " "$uid"
  curl -s -X POST "$URL" -H "Content-Type: application/x-www-form-urlencoded" --data "$form"
  echo
done < scripts/out/ecpay-replay-20261029.json

echo
echo "=== 3/3 驗證 ==="
node scripts/verify-ecpay-renew-20261029.mjs
