// app-update.js — App(WebView)內的新版本提醒。每次商店發新版,改 app-version.json 的版號(ios/android)即可,不用重 build。
// 比對原生注入的 STAYJP_NATIVE.appVersion;有新版 → 底部橫幅「有新版本 1.0.8 → 前往更新」,可按「稍後」(同一版只提醒一次/天)。
// min:低於此版本的視為過舊,橫幅不給「稍後」(硬提醒)。商店連結會被原生攔截用外部 App Store / Play 開。
(function () {
  try {
    var N = window.STAYJP_NATIVE; if (!N || !N.isNativeApp || !N.appVersion) return;
    var plat = N.platform === 'android' ? 'android' : 'ios';
    var cmp = function (a, b) { var x = String(a).split('.').map(Number), y = String(b).split('.').map(Number); for (var i = 0; i < 3; i++) { var d = (x[i] || 0) - (y[i] || 0); if (d) return d; } return 0; };
    fetch('app-version.json?ts=' + Math.floor(Date.now() / 3600000)).then(function (r) { return r.json(); }).then(function (v) {
      var latest = v && v[plat]; if (!latest || cmp(latest, N.appVersion) <= 0) return;
      var hard = v.min && cmp(N.appVersion, v.min) < 0;
      var key = 'app_update_dismiss_' + latest;
      if (!hard) { try { var t = +localStorage.getItem(key) || 0; if (Date.now() - t < 86400000) return; } catch (e) {} }
      var en = false; try { en = (window.I18n && I18n.getLang && I18n.getLang() === 'en') || localStorage.getItem('ui_lang') === 'en'; } catch (e) {}
      var url = plat === 'android' ? 'https://play.google.com/store/apps/details?id=com.stayjp.app' : 'https://apps.apple.com/app/id6778227353';
      var b = document.createElement('div'); b.id = 'appUpdateBar';
      b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(72px + env(safe-area-inset-bottom));z-index:9500;background:#1E1C1B;color:#FAF9F6;border-radius:14px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.3);display:flex;gap:10px;align-items:center;font-size:13.5px;line-height:1.4';
      var txt = en ? ('Version ' + latest + ' is available' + (v.note ? ' — ' + v.note : '')) : ('有新版本 ' + latest + (v.note ? '：' + v.note : ''));
      b.innerHTML = '<div style="flex:1">' + txt.replace(/</g, '&lt;') + '</div>'
        + '<a href="' + url + '" style="flex:0 0 auto;background:#E0563F;color:#fff;text-decoration:none;font-weight:800;padding:8px 14px;border-radius:999px;white-space:nowrap">' + (en ? 'Update' : '前往更新') + '</a>'
        + (hard ? '' : '<button aria-label="close" style="flex:0 0 auto;background:none;border:0;color:#CFC9C2;font-size:16px;padding:0 4px;cursor:pointer">✕</button>');
      var x = b.querySelector('button'); if (x) x.onclick = function () { try { localStorage.setItem(key, String(Date.now())); } catch (e) {} b.remove(); };
      document.body.appendChild(b);
    }).catch(function () {});
  } catch (e) {}
})();
