// --- SHUFFLE ---
export function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// --- SPLIT WORD INTO LOGICAL FRAGMENTS ---
export function splitIntoFragments(word) {
  // dzielimy na fragmenty 1–2 literowe, żeby gra była logiczna
  const parts = [];
  let i = 0;

  while (i < word.length) {
    const take = Math.random() > 0.5 ? 2 : 1;
    parts.push(word.slice(i, i + take));
    i += take;
  }
  return parts;
}
