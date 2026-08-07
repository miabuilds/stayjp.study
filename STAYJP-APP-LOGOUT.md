# StayJP App 指令：修「過幾天就被自動登出」

> 貼給 **StayJP iOS App(Capacitor)專案** 的 Claude Code 執行。此問題不在網站 repo,在 App 專案。

## 症狀
使用者在 App 內登入後,**過幾天(約 7 天)就被自動登出**,要重新登入。

## 根因(幾乎可確定)
App 是 Capacitor 包 WebView,登入狀態(Firebase Auth)存在 **WKWebView 的 IndexedDB / localStorage**。
iOS 的 **ITP(Intelligent Tracking Prevention)會在網站資料約 7 天無互動後清除**,連帶把 Firebase 的 refresh token 清掉 → 下次開啟 App 就變未登入。
（純網頁版不受影響,因為使用者常回訪;App 內 WebView 更容易被 ITP 清。）

## 正解:登入狀態存到「原生層」,開 App 時還原
不要只靠 WebView 儲存。把認證狀態放到原生(Keychain / Capacitor Preferences),ITP 清不到;
每次開 App 時若 WebView 沒登入,就用原生保存的憑證重新登入 WebView。

本專案**已經有一支 Cloud Function `mintCustomToken`**(用有效 idToken 換 custom token,做 native→WebView SSO),善用它:

### 建議做法 A(用現有 mintCustomToken + 原生 Firebase Auth,最穩)
1. 裝原生 Firebase 認證外掛:`@capacitor-firebase/authentication`(iOS 用 Keychain 持久化,不怕 ITP)。
2. 登入流程改成:**先用原生外掛登入**(Google/Apple)→ 原生取得 Firebase user → 拿 idToken。
3. 用該 idToken 呼叫 `mintCustomToken` → 得 custom token → 在 WebView 內 `signInWithCustomToken(customToken)` 開通網頁側登入。
4. **App 每次啟動(resume)時**:檢查原生是否已登入(`FirebaseAuthentication.getCurrentUser()`);
   有的話就重跑步驟 3 把 WebView 重新登入(即使 WebView 已被 ITP 清也會補回)。
5. 這樣真正的登入狀態存在原生 Keychain,7 天 ITP 清 WebView 也不會被登出。

### 建議做法 B(較輕,若不想大改登入 UI)
1. 登入成功後,把可再登入的憑證(例如 refresh 用的 custom token 或 provider credential)存進
   **Capacitor Preferences / SecureStorage(原生)**,不要只留在 WebView。
2. App 啟動時偵測 WebView `auth.currentUser` 為空 → 從原生取回憑證 → `signInWithCustomToken` 還原。
3. 注意 custom token 有效期短(1 小時),需要能「隨時重新產生」的來源(所以做法 A 的原生 Firebase user 較可靠)。

## 驗證
- 登入後,用 Xcode 或設定把 App 的 WebsiteData 清掉(模擬 ITP 7 天清除)→ 重開 App → **應自動維持登入**,不需重登。
- 或實機掛著 7+ 天後開 App 確認不再被登出。

## 注意
- Firebase 專案:`jpnote-1bdd6`;region `asia-east1`;已存在函式 `mintCustomToken`。
- 別把 API key / service account 放進前端;原生外掛用 GoogleService-Info.plist 設定。
- 改動登入流程屬敏感,務必在測試機驗證(登入/登出/重裝/切帳號)後才發版。
