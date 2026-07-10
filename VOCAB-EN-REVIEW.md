# 單字英譯複查(N5 + N4–N1 · 本地未上線)

- **N5 725 詞**(vocab-n5-en.js)· **N4–N1 6985 詞**(vocab-n4/n3/n2/n1-en.js)= 共 **7710 詞**
- 流程:Sonnet 翻 → Haiku 校 → **Opus 裁決 flag**(分真錯 vs 誤報)
- N4–N1:211 條 flag 經 Opus 裁決 → **僅 9 條真錯**(已修),其餘 202 條為驗證者誤報(把中文詞義混淆日文/挑正確的毛病)
- 首翻準確率 ≈ **99.87%**;詞性(名/動/い形/な形/副/他)已對照成 n./v./i-adj/na-adj/adv/other

## Opus 確認並修正的 9 條

| 詞 | 中文源 | 原譯 → 修正 |
|---|---|---|
| 差す | 照射 | to shine (light); to hold up (an umbrella) |
| 一概に | 一概 | generally, sweepingly (usu. with negation: cannot say unconditionally) |
| 締め切る | 截止 | to close (to entries/applications), to shut completely |
| 趣 | 趣味 | charm, elegance, tasteful appearance |
| 群集 | 群落 | crowd, throng (of people) |
| 侘びる | 寂寞 | to apologize; to feel sorry |
| 主体的 | 主體的 | independent, self-directed, proactive (as an agent) |
| 朝三暮四 | 朝三暮四 | being deceived by superficial differences while the substance is unchanged |
| 一か八か | 孤注一擲 | all or nothing; a roll of the dice; sink or swim |

> 202 條誤報未列(英文本就正確)。你若用別的模型複查,建議直接抽查 vocab-*-en.js;flag 雜訊高、參考價值低。
