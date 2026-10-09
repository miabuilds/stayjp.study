#!/bin/bash
# 電子報「一人公司實驗室」上線：先部署後端(4 支 functions)，成功了才把頁面推上 stayjp.study/letters/
# 用法：bash scripts/launch-letters.sh
set -e
cd "$(dirname "$0")/.."

echo "① 部署電子報後端（只動 newsletter 這 4 支，其他 functions 不碰）"
npx firebase deploy --project jpnote-1bdd6 --non-interactive \
  --only functions:newsletterSubscribe,functions:newsletterConfirm,functions:newsletterUnsub,functions:newsletterCron

echo "② 確認訂閱 API 活著"
code=$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' \
  -d '{"email":"not-an-email"}' https://asia-east1-jpnote-1bdd6.cloudfunctions.net/newsletterSubscribe)
[ "$code" = "400" ] || { echo "訂閱 API 回 $code（預期 400），先不推頁面"; exit 1; }
echo "   OK（格式錯的 email 正確被擋）"

echo "③ 把頁面合併到 main 並推上線"
git checkout main
git pull --ff-only
git merge --no-edit newsletter
git push

echo "完成。GitHub Pages 約 1～2 分鐘後生效：https://stayjp.study/letters/"
