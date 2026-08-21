/**
 * Local card art overrides.
 *
 * Drop files in `public/cards/` using the athleteId as the filename:
 *   public/cards/max_verstappen.png
 *   public/cards/lebron-james.jpg
 *   public/cards/shohei-ohtani.webp
 *
 * Overwrite the same filename to swap art — no code changes needed.
 */
export function localCardCandidates(athleteId: string): string[] {
  const id = athleteId.trim()
  if (!id) return []
  return [`/cards/${id}.png`, `/cards/${id}.jpg`, `/cards/${id}.jpeg`, `/cards/${id}.webp`]
}
