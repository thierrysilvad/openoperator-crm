import { describe, expect, it } from "vitest";
import { normalizeE164 } from "../worker/phone";

describe("normalizeE164", () => {
  it("mantém E.164 internacional válido", () => {
    expect(normalizeE164("+15551234567")).toBe("+15551234567");
    expect(normalizeE164(" +55 (84) 98885-1138 ")).toBe("+5584988851138");
  });

  it("converte celular e fixo brasileiros em formato nacional", () => {
    expect(normalizeE164("(84) 98885-1138")).toBe("+5584988851138");
    expect(normalizeE164("84988851138")).toBe("+5584988851138");
    expect(normalizeE164("5584988851138")).toBe("+5584988851138");
    expect(normalizeE164("084 3221-0000")).toBe("+558432210000");
    expect(normalizeE164("(84) 3221-0000")).toBe("+558432210000");
  });

  it("continua rejeitando entradas inválidas ou ambíguas", () => {
    expect(normalizeE164("555-not-e164")).toBe("");
    expect(normalizeE164("5551234567")).toBe(""); // 10 dígitos puros: ambíguo com EUA
    expect(normalizeE164("0884988851138")).toBe("");
    expect(normalizeE164("(00) 98885-1138")).toBe("");
    expect(normalizeE164("12345")).toBe("");
    expect(normalizeE164(null)).toBe("");
  });
});
