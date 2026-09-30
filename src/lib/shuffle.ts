/**
 * Options are shown in a shuffled order that is fixed per question (seeded by a key such as its
 * ID or prompt), so the position of the right answer carries no pattern. Answers are still
 * recorded as the original option index.
 */
export function optionOrder(key: string, count: number) {
  let h = 2166136261;
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
    const j = (h >>> 0) % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
