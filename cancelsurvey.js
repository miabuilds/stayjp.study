// 取消問卷(2026-11-19 Mia)。取消續訂後下次開網頁/App 問一次原因(答或略過都不再問)。
// 觸發:後端在「用戶自己取消」時寫 users/{uid}.subscription.cancelAskAt(revenuecat-webhook.ts、cancel-subscription.ts);
// auth-header.js 讀到就載入這支並呼叫 CancelSurvey.maybe(sub, user)。回答寫進 feedback 集合(後台回饋看得到)。
// 不能只看 willRenew=false(ATM/超商、兌換碼、贈送本來就是 false)。不放 emoji、不用原生 alert。
(function () {
  const TX = {
    "zh-TW": { t: "可以告訴我們取消的原因嗎？", d: "一分鐘就好，只會拿來改進產品（不影響退款或扣款）。", dTrial: "可以告訴我們取消免費試用的原因嗎？一分鐘就好。",
      o: { price: "價格太高", trial_only: "只是想試用看看・不想被自動扣款", level: "內容不適合我的程度", no_time: "沒時間用", feature: "沒有我想要的功能", bug: "有問題或不好用", other_app: "改用別的 App", forgot: "漏按同意・其實沒有要取消", other: "其他" },
      ph: "願意的話多說一點（選填）", send: "送出", skip: "略過", thanks: "謝謝你，我們會參考。" },
    "zh-CN": { t: "可以告诉我们取消的原因吗？", d: "一分钟就好，只会用来改进产品（不影响退款或扣款）。", dTrial: "可以告诉我们取消免费试用的原因吗？一分钟就好。",
      o: { price: "价格太高", trial_only: "只是想试用看看・不想被自动扣款", level: "内容不适合我的水平", no_time: "没时间用", feature: "没有我想要的功能", bug: "有问题或不好用", other_app: "改用别的 App", forgot: "漏点同意・其实没有要取消", other: "其他" },
      ph: "愿意的话多说一点（选填）", send: "提交", skip: "跳过", thanks: "谢谢你，我们会参考。" },
    en: { t: "Why did you cancel?", d: "Takes one minute. We only use this to improve the app (it doesn't affect refunds or billing).", dTrial: "Why did you cancel your free trial? Takes one minute.",
      o: { price: "Too expensive", trial_only: "Just trying it out / didn't want to be charged automatically", level: "Content doesn't match my level", no_time: "No time to use it", feature: "Missing a feature I need", bug: "Bugs or hard to use", other_app: "Using another app", forgot: "I missed the consent step / didn't mean to cancel", other: "Other" },
      ph: "Tell us more (optional)", send: "Send", skip: "Skip", thanks: "Thank you. This helps a lot." },
    ko: { t: "해지하신 이유를 알려 주세요", d: "1분이면 끝나요. 서비스 개선에만 사용합니다(환불·재결제와는 무관합니다).", dTrial: "무료 체험을 해지하신 이유를 알려 주세요. 1분이면 끝나요.",
      o: { price: "가격이 비싸요", trial_only: "그냥 체험만 해 봤어요 · 자동 결제가 싫었어요", level: "내용이 제 수준에 안 맞아요", no_time: "쓸 시간이 없어요", feature: "원하는 기능이 없어요", bug: "오류가 있거나 쓰기 불편해요", other_app: "다른 앱을 써요", forgot: "동의 버튼을 못 눌렀어요 · 해지할 생각은 없었어요", other: "기타" },
      ph: "자세히 알려 주시면 큰 도움이 돼요(선택)", send: "보내기", skip: "건너뛰기", thanks: "감사합니다. 참고할게요." },
    vi: { t: "Vì sao bạn hủy gói?", d: "Chỉ mất 1 phút. Chúng tôi chỉ dùng để cải thiện ứng dụng (không ảnh hưởng đến hoàn tiền hay thanh toán).", dTrial: "Vì sao bạn hủy dùng thử miễn phí? Chỉ mất 1 phút.",
      o: { price: "Giá cao", trial_only: "Chỉ dùng thử / không muốn bị tự động trừ tiền", level: "Nội dung không hợp trình độ của tôi", no_time: "Không có thời gian dùng", feature: "Thiếu tính năng tôi cần", bug: "Có lỗi hoặc khó dùng", other_app: "Dùng ứng dụng khác", forgot: "Tôi quên bấm đồng ý / không định hủy", other: "Khác" },
      ph: "Chia sẻ thêm (không bắt buộc)", send: "Gửi", skip: "Bỏ qua", thanks: "Cảm ơn bạn. Chúng tôi sẽ tham khảo." },
    id: { t: "Kenapa kamu berhenti berlangganan?", d: "Cuma 1 menit. Hanya dipakai untuk memperbaiki aplikasi (tidak memengaruhi refund atau tagihan).", dTrial: "Kenapa kamu membatalkan uji coba gratis? Cuma 1 menit.",
      o: { price: "Harganya mahal", trial_only: "Cuma coba-coba / tidak mau ditagih otomatis", level: "Materinya tidak sesuai level saya", no_time: "Tidak ada waktu", feature: "Fitur yang saya butuhkan belum ada", bug: "Ada bug atau sulit dipakai", other_app: "Pakai aplikasi lain", forgot: "Lupa menekan tombol setuju / tidak berniat batal", other: "Lainnya" },
      ph: "Ceritakan lebih lanjut (opsional)", send: "Kirim", skip: "Lewati", thanks: "Terima kasih. Ini sangat membantu." },
    th: { t: "ทำไมคุณถึงยกเลิก?", d: "ใช้เวลาแค่ 1 นาที เราใช้เพื่อปรับปรุงแอปเท่านั้น (ไม่มีผลต่อการคืนเงินหรือการเรียกเก็บเงิน)", dTrial: "ทำไมคุณถึงยกเลิกการทดลองใช้ฟรี? ใช้เวลาแค่ 1 นาที",
      o: { price: "ราคาแพง", trial_only: "แค่ลองใช้ดู / ไม่อยากถูกตัดเงินอัตโนมัติ", level: "เนื้อหาไม่ตรงกับระดับของฉัน", no_time: "ไม่มีเวลาใช้", feature: "ไม่มีฟีเจอร์ที่ต้องการ", bug: "มีบั๊กหรือใช้ยาก", other_app: "ใช้แอปอื่น", forgot: "ลืมกดยินยอม / ไม่ได้ตั้งใจยกเลิก", other: "อื่น ๆ" },
      ph: "เล่าเพิ่มเติมได้ (ไม่บังคับ)", send: "ส่ง", skip: "ข้าม", thanks: "ขอบคุณ ข้อมูลนี้ช่วยเราได้มาก" },
  };
  const ORDER = ["price", "trial_only", "level", "no_time", "feature", "bug", "other_app", "forgot", "other"];
  const lang = () => { try { return localStorage.getItem("ui_lang") || "zh-TW"; } catch (e) { return "zh-TW"; } };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let shown = false;
  function css() {
    if (document.getElementById("cs-css")) return;
    const st = document.createElement("style"); st.id = "cs-css";
    st.textContent = `
.cs-bg{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;padding:16px;padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}
@media(min-width:560px){.cs-bg{align-items:center}}
.cs-box{width:100%;max-width:440px;max-height:92vh;overflow:auto;background:var(--bg2,#fff);color:var(--tx,#1c1c1e);border:1px solid var(--bd,#e5decf);border-radius:18px;padding:22px 20px 18px;box-shadow:0 12px 40px rgba(0,0,0,.25)}
.cs-box h3{margin:0 0 8px;font-size:18px;line-height:1.4}
.cs-box p{margin:0 0 12px;font-size:13.5px;line-height:1.6;color:var(--tx2,#6a6a6a)}
.cs-opts{display:flex;flex-direction:column;gap:6px;margin-bottom:12px}
.cs-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:9px 14px;border:1px solid var(--bd,#e5decf);border-radius:12px;background:var(--bg,#faf8f3);color:var(--tx,#1c1c1e);font:inherit;font-size:14.5px;line-height:1.4;cursor:pointer}
.cs-opt::before{content:"";flex:none;width:16px;height:16px;border-radius:50%;border:1.5px solid var(--tx3,#a9a9a9);box-sizing:border-box}
.cs-opt.on{border-color:var(--ac,#b8362a)}
.cs-opt.on::before{border:5px solid var(--ac,#b8362a)}
.cs-note{width:100%;box-sizing:border-box;min-height:52px;margin-bottom:14px;padding:10px 12px;border:1px solid var(--bd,#e5decf);border-radius:12px;background:var(--bg,#faf8f3);color:var(--tx,#1c1c1e);font:inherit;font-size:14px;resize:vertical}
.cs-acts{display:flex;gap:10px}
.cs-acts button{flex:1;padding:12px;border-radius:12px;font:inherit;font-size:15px;font-weight:600;cursor:pointer}
.cs-skip{border:1px solid var(--bd,#e5decf);background:transparent;color:var(--tx2,#6a6a6a)}
.cs-send{border:1px solid var(--ac,#b8362a);background:var(--ac,#b8362a);color:#fff}
.cs-send:disabled{opacity:.4;cursor:default}`;
    document.head.appendChild(st);
  }
  const key = (sub, user) => "cs_asked_" + user.uid + "_" + sub.cancelAskAt;
  function open(sub, user) {
    const L = TX[lang()] || TX.en; let pick = "";
    css();
    const bg = document.createElement("div"); bg.className = "cs-bg"; bg.id = "csBg";
    bg.innerHTML = `<div class="cs-box" role="dialog" aria-modal="true">
      <h3>${esc(L.t)}</h3><p>${esc(sub.cancelAskTrial ? L.dTrial : L.d)}</p>
      <div class="cs-opts">${ORDER.map((k) => `<button type="button" class="cs-opt" data-k="${k}">${esc(L.o[k])}</button>`).join("")}</div>
      <textarea class="cs-note" id="csNote" maxlength="1000" placeholder="${esc(L.ph)}"></textarea>
      <div class="cs-acts"><button type="button" class="cs-skip" id="csSkip">${esc(L.skip)}</button><button type="button" class="cs-send" id="csSend" disabled>${esc(L.send)}</button></div>
    </div>`;
    document.body.appendChild(bg);
    const done = () => { try { localStorage.setItem(key(sub, user), "1"); } catch (e) {} bg.remove(); };
    bg.querySelectorAll(".cs-opt").forEach((b) => b.addEventListener("click", () => {
      pick = b.dataset.k; bg.querySelectorAll(".cs-opt").forEach((x) => x.classList.toggle("on", x === b)); bg.querySelector("#csSend").disabled = false;
    }));
    bg.querySelector("#csSkip").addEventListener("click", done);
    bg.querySelector("#csSend").addEventListener("click", () => {
      if (!pick) return;
      const note = String(bg.querySelector("#csNote").value || "").trim().slice(0, 1000);
      const native = window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp;
      const msg = "[取消問卷] 原因:" + pick + (note ? "｜" + note : "") + "｜" + (sub.plan || "") + (sub.cancelAskTrial ? "(試用中取消)" : "") + "｜" + (sub.cancelAskWhy || "") + "｜" + (native ? "app" : "web") + "｜" + lang();
      try {
        firebase.firestore().collection("feedback").add({ type: "other", message: msg, uid: user.uid, email: user.email || null,
          ua: String(navigator.userAgent || "").slice(0, 300), createdAt: firebase.firestore.FieldValue.serverTimestamp() }).catch(function () {});
      } catch (e) {}
      done();
      try { if (window.showToast) showToast(L.thanks); } catch (e) {}
    });
  }
  // 條件:後端標了「自己取消」、45 天內、還沒續回來(willRenew 仍為 false)、不是買斷、這台裝置沒問過。
  function due(sub, user) {
    if (!sub || !user || !sub.cancelAskAt || sub.willRenew !== false || sub.plan === "lifetime") return false;
    if (Date.now() - Number(sub.cancelAskAt) > 45 * 86400e3) return false;
    try { if (localStorage.getItem(key(sub, user)) === "1") return false; } catch (e) {}
    return true;
  }
  // 付費牆/其他視窗開著時不打斷:每 5 秒看一次,最多等 10 分鐘,這次沒跳下次開再問。
  function maybe(sub, user) {
    if (shown || !due(sub, user)) return;
    shown = true; let tries = 0;
    const tick = () => {
      const busy = document.querySelector(".cs-bg, .modal.show, .modal-bg.show, .pw-bg.show, .sheet.show, .appui-bg");
      if (!busy && document.visibilityState === "visible") return open(sub, user);
      if (++tries < 120) setTimeout(tick, 5000);
    };
    setTimeout(tick, 2500);
  }
  window.CancelSurvey = { maybe: maybe, due: due, _open: open };
})();
