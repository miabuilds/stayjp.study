// 印出 Firebase/GCP 的 access token(給 publish-content-sharded.mjs / export-content-static-rest.mjs 的 FIRE_TOKEN 用)。
// 認證來源同 fire-admin.mjs(firebase login 的 refresh token + scripts/.fireauth.json)。用法:FIRE_TOKEN=$(node scripts/lib/fire-token.mjs)
import { admin } from './fire-admin.mjs';
const t = await admin.app().options.credential.getAccessToken();
process.stdout.write(t.access_token);
process.exit(0);
