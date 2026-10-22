/**
 * Configuração do estúdio.
 * Para ativar o envio pelo WhatsApp, preencha WHATSAPP_NUMBER com DDI + DDD + número,
 * apenas dígitos. Exemplo: "5511999999999". Deixe vazio enquanto não houver número real.
 */
export const STUDIO_NAME = "Ritual Tattoo Studio";
export const WHATSAPP_NUMBER = "";

export function normalizeWhatsapp(value: string): string {
  return value.replace(/\D/g, "");
}

export function isWhatsappConfigured(number: string = WHATSAPP_NUMBER): boolean {
  const digits = normalizeWhatsapp(number);
  return digits.length >= 10 && digits.length <= 15;
}

export type BookingRequest = {
  nome: string;
  whatsapp: string;
  estilo: string;
  tamanho: string;
  local: string;
  ideia: string;
  preferencia: string;
};

export function buildBookingMessage(r: BookingRequest): string {
  return [
    `Olá, ${STUDIO_NAME}! Gostaria de SOLICITAR um agendamento:`,
    "",
    `Nome: ${r.nome}`,
    `WhatsApp: ${r.whatsapp}`,
    `Estilo: ${r.estilo}`,
    `Tamanho: ${r.tamanho}`,
    `Local do corpo: ${r.local}`,
    `Ideia/referências: ${r.ideia}`,
    `Preferência de data/horário: ${r.preferencia}`,
    "",
    "Aguardo a confirmação do estúdio.",
  ].join("\n");
}

/** Retorna o link wa.me ou null se o número não estiver configurado. */
export function buildWhatsappLink(r: BookingRequest, number: string = WHATSAPP_NUMBER): string | null {
  if (!isWhatsappConfigured(number)) return null;
  return `https://wa.me/${normalizeWhatsapp(number)}?text=${encodeURIComponent(buildBookingMessage(r))}`;
}
