// Normalização de telefone para E.164.
// Aceita E.164 internacional (+...) e, como melhoria, números brasileiros
// em formato nacional: "(84) 98885-1138", "84988851138", "084 3221-0000",
// "5584988851138". Qualquer outra coisa sem "+" continua sendo rejeitada,
// para não confundir números de outros países.

const E164 = /^\+[1-9][0-9]{7,14}$/;

// DDD brasileiro: 2 dígitos, 11-99, sem zero no segundo dígito.
const DDD = "[1-9][1-9]";
// Celular: 9 + 8 dígitos. Fixo: 2-5 + 7 dígitos.
const BR_NATIONAL = new RegExp(`^(${DDD})(9[0-9]{8}|[2-5][0-9]{7})$`);

// `explicit` indica que há um sinal claro de número brasileiro (prefixo 55,
// zero de tronco ou DDD entre parênteses). Fixos de 10 dígitos "puros" são
// ambíguos com números dos EUA e só são aceitos com esse sinal; celulares de
// 11 dígitos (com o 9) não têm essa ambiguidade.
export function normalizeBrazilianPhone(digits: string, explicit = false): string {
  let national = digits;
  if (national.startsWith("55") && (national.length === 12 || national.length === 13)) {
    national = national.slice(2);
    explicit = true;
  } else if (national.startsWith("0") && (national.length === 11 || national.length === 12)) {
    national = national.slice(1); // zero de tronco: 084...
    explicit = true;
  }
  if (national.length === 10 && !explicit) return "";
  return BR_NATIONAL.test(national) ? `+55${national}` : "";
}

export function normalizeE164(value: unknown): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  const normalized = trimmed.replace(/[\s().-]/g, "");
  if (normalized.startsWith("+")) return E164.test(normalized) ? normalized : "";
  const dddInParens = /^\(\d{2}\)/.test(trimmed);
  return /^[0-9]+$/.test(normalized) ? normalizeBrazilianPhone(normalized, dddInParens) : "";
}
