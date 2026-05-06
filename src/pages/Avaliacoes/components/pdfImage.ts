export function normalizarImagemSrc(src?: string): string | undefined {
  if (!src) return undefined;

  const valor = src.trim();
  return valor.length > 0 ? valor : undefined;
}