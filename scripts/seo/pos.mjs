// 词性 zh 代号 → slug/英文/中文标签。仅数据中真实出现的 6 类(名/動/い形/な形/副/他)。
export const POS_MAP = {
  '名':   { slug:'noun', en:'Nouns', zh:'名詞' },
  '動':   { slug:'verb', en:'Verbs', zh:'動詞' },
  'い形': { slug:'i-adjective', en:'I-adjectives', zh:'い形容詞' },
  'な形': { slug:'na-adjective', en:'Na-adjectives', zh:'な形容詞' },
  '副':   { slug:'adverb', en:'Adverbs', zh:'副詞' },
  '他':   { slug:'other', en:'Other Words', zh:'其他詞' },
};
export function posSlug(c) { return POS_MAP[c] || null; }
