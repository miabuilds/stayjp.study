#!/bin/sh
# 產生要上線的 dist/：只拿 git 有追蹤的檔案（本機沒進 git 的東西絕不會上線），再排除後端、腳本、文件。
# 部署：sh scripts/build-dist.sh && npx wrangler deploy
set -e
cd "$(dirname "$0")/.."
rm -rf dist && mkdir dist
git ls-files -z \
  | grep -zvE '^(scripts|functions|docs|letters-src|cf|\.github)/' \
  | grep -zvE '(^|/)\.[^/]+$' \
  | grep -zvE '\.md$' \
  | grep -zvE '^(firebase\.json|firestore\.rules|firestore\.indexes\.json|wrangler\.jsonc|package(-lock)?\.json|CNAME)$' \
  | rsync -a --from0 --files-from=- ./ dist/
# 快取行為沿用 GitHub Pages（每檔 10 分鐘）
printf '/*\n  Cache-Control: public, max-age=600\n/*.html\n  Content-Type: text/html; charset=utf-8\n/*.js\n  Content-Type: text/javascript; charset=utf-8\n/*.css\n  Content-Type: text/css; charset=utf-8\n/*.json\n  Content-Type: application/json; charset=utf-8\n' > dist/_headers
echo "dist/：$(find dist -type f | wc -l | tr -d ' ') 個檔案，$(du -sh dist | cut -f1)"
