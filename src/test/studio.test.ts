import { describe, expect, it } from "vitest";
import { buildWhatsappLink, type BookingRequest } from "@/config/studio";

const req: BookingRequest = {
  nome: "Ana", whatsapp: "11 99999-0000", estilo: "Fine line", tamanho: "Pequena",
  local: "Braço", ideia: "Rosa", preferencia: "Sábado à tarde",
};

describe("WhatsApp link", () => {
  it("returns null when number is not configured", () => {
    expect(buildWhatsappLink(req, "")).toBeNull();
  });
  it("builds wa.me link with digits only when configured", () => {
    const link = buildWhatsappLink(req, "+55 (11) 98888-7777");
    expect(link?.startsWith("https://wa.me/5511988887777?text=")).toBe(true);
    expect(decodeURIComponent(link!.split("text=")[1])).toContain("Nome: Ana");
  });
});
