import sys, re
ICON = {
 '🔊':'volume','🔈':'volume','🔉':'volume','🎤':'mic','🎙':'mic','🎧':'headphones','🗣':'speak',
 '🚩':'flag','✓':'check','✅':'check','☑':'check','✔':'check','✕':'x','✗':'x','❌':'x','❎':'x','🚫':'x',
 '🎁':'gift','🔒':'lock','🔓':'lock','🔁':'refresh','🔄':'refresh','↻':'refresh','🎯':'target','🔔':'bell',
 '⚠':'warning','📝':'edit','✍':'edit','✏':'edit','📌':'pin','📍':'pin','🗑':'trash','📊':'chart','📈':'chart','📉':'chart',
 '💬':'chat','🗨':'chat','💡':'bulb','🎟':'ticket','🔥':'fire','📖':'book','📕':'book','📗':'book','📘':'book','📙':'book','📚':'book','📔':'book','📓':'book','📃':'book','📄':'book',
 '💼':'briefcase','🙋':'user','🧑':'user','👤':'user','👥':'user','🧍':'user','⚡':'bolt','🌍':'globe','🌏':'globe','🌎':'globe','🌐':'globe',
 '📱':'phone','🧭':'compass','🛠':'tools','🔧':'tools','⚙':'settings','📅':'calendar','🗓':'calendar',
 '⏰':'clock','⏳':'clock','⌛':'clock','⏱':'clock','⏲':'clock','🕐':'clock','⏸':'pause','⏹':'stop','⏺':'stop',
 '🍜':'food','🍽':'food','🍱':'food','🚉':'train','🚃':'train','🚆':'train','🏪':'store','🏬':'store','🏥':'hospital','🛍':'bag','👜':'bag','🎒':'bag',
 '🏠':'home','🏡':'home','👆':'hand','👇':'hand','🐦':'bird','💰':'coin','🪙':'coin','📋':'clipboard','☰':'menu','🔖':'bookmark','⭐':'star',
}
REMOVE = set('🎉✨🙂🙌🙏💪😊🥳🎊👏✊🤝💯🚀🌸🍁💎🏆😄😃🥰😍🤩👍👀🔮🌟💫🎈🧧🫶❤💗💖🆕🈂☁')
ICON.update({'🗂':'clipboard','🗃':'clipboard','📐':'tools','📏':'tools','🔀':'refresh','🔁':'refresh','🧠':'bulb','🔤':'book','🔠':'book','🔡':'book','✉':'mail','📧':'mail','📤':'mail','📥':'mail','📬':'mail','📭':'mail','📨':'mail'})
ICON.update({'🎫':'ticket','🧹':'trash','📮':'mail','💵':'coin','💴':'coin','💶':'coin','💷':'coin','📦':'bag','📣':'bell','📢':'bell'})
ICON.update({'🔍':'search','🔎':'search','☀':'sun','🌞':'sun','🌙':'moon','🌓':'moon','🌗':'moon','🌘':'moon','🌑':'moon','👁':'eye','🙈':'eye','📸':'camera','📷':'camera','🖊':'edit','🖋':'edit','⏻':'power','🖨':'phone'})
RISKY = re.compile(r'\.textContent|\.innerText|\balert\(|\bconfirm\(|\bprompt\(|title\s*=|aria-label|\.speak\(|placeholder\s*=')
def is_comment(s):
    st=s.strip()
    if 'content:' in s and ('"' in s or "'" in s): return True  # CSS content pseudo,勿動
    return st.startswith('//') or s.startswith('/*') or s.startswith('*') or s.startswith('<!--')
def strip_e(ln, e):
    return ln.replace(e+'️ ','').replace(e+' ','').replace(e+'️','').replace(e,'')
def process(fn):
    lines=open(fn,encoding='utf-8').read().split('\n'); ic=rm=rk=0; out=[]
    for ln in lines:
        if is_comment(ln): out.append(ln); continue
        risky = bool(RISKY.search(ln))
        # 裝飾一律移除
        for e in REMOVE:
            if e in ln: rm+=ln.count(e); ln=strip_e(ln,e)
        # 功能:risky 行移除純文字;否則換 icon
        for e,name in ICON.items():
            for v in (e+'️', e):
                if v in ln:
                    if risky: rk+=ln.count(v); ln=strip_e(ln,v)
                    else: ic+=ln.count(v); ln=ln.replace(v,'<i data-ic=%s></i>'%name)
        # 清理移除 emoji 後殘留的空括號對
        for pr in ['（）','「」','【】','〔〕','［］']:
            ln=ln.replace(pr,'')
        out.append(ln)
    open(fn,'w',encoding='utf-8').write('\n'.join(out))
    print(f"  {fn}: icon {ic}, 裝飾移除 {rm}, risky行移除 {rk}")
for f in sys.argv[1:]: process(f)
