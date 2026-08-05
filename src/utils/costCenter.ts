/**
 * Normalizes a cost center name for robust comparison. Trims and collapses
 * whitespace, lowercases, and normalizes Unicode to NFC — so two values that
 * render identically on screen but differ in encoding (accented characters
 * composed vs decomposed) or incidental spacing still compare equal, instead
 * of silently falling through to a different classification.
 */
export function normalizeCostCenterName(name: string | null | undefined): string {
  return (name ?? '')
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}
