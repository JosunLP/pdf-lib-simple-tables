/**
 * Überprüft, ob ein String gültiges Base64 ist
 * @param str Der zu überprüfende String
 * @returns true wenn der String gültiges Base64 ist, sonst false
 */
export function isValidBase64(str: string): boolean {
  // Entfernen möglicher Base64 Präfixe
  const cleanedStr = str.replace(/^data:[^;]+;base64,/, '');

  // Überprüfung auf gültiges Base64-Format
  try {
    return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(cleanedStr);
  } catch (e) {
    return false;
  }
}
