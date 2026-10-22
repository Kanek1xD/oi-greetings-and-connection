import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Menu, ShieldCheck, PenTool, Sparkles, AlertTriangle, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { STUDIO_NAME, buildWhatsappLink, isWhatsappConfigured, type BookingRequest } from "@/config/studio";
import hero from "@/assets/hero.jpg";
import t1 from "@/assets/tattoo-1.jpg";
import t2 from "@/assets/tattoo-2.jpg";
import t3 from "@/assets/tattoo-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ritual Tattoo Studio — Agende sua tatuagem" },
      { name: "description", content: "Tatuagem autoral e personalizada com biossegurança rigorosa. Solicite seu agendamento no Ritual Tattoo Studio." },
      { property: "og:title", content: "Ritual Tattoo Studio — Agende sua tatuagem" },
      { property: "og:description", content: "Arte personalizada, higiene rigorosa. Envie sua ideia e solicite um horário." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  { href: "#portfolio", label: "Portfólio" },
  { href: "#estudio", label: "Estúdio" },
  { href: "#agendar", label: "Agendar" },
];

const ESTILOS = ["Fine line", "Blackwork", "Realismo", "Tradicional / Neo-tradicional", "Lettering", "Aquarela", "Outro / não sei"];
const TAMANHOS = ["Pequena (até 5 cm)", "Média (5–15 cm)", "Grande (15–30 cm)", "Fechamento / projeto grande"];

const schema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(100),
  whatsapp: z.string().trim().refine((v) => { const d = v.replace(/\D/g, ""); return d.length >= 10 && d.length <= 15; }, "WhatsApp inválido (inclua o DDD)"),
  estilo: z.string().min(1, "Escolha um estilo"),
  tamanho: z.string().min(1, "Escolha um tamanho"),
  local: z.string().trim().min(2, "Informe o local do corpo").max(80),
  ideia: z.string().trim().min(5, "Descreva sua ideia").max(1000),
  preferencia: z.string().trim().min(2, "Informe sua preferência").max(150),
});

const selectCls = "flex h-11 w-full rounded-sm border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#topo" className="font-display text-xl uppercase tracking-wider">
          Ritual<span className="text-primary">.</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">{n.label}</a>
          ))}
          <Button asChild size="sm"><a href="#agendar">Agendar</a></Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background">
            <SheetTitle className="font-display text-2xl uppercase">Ritual<span className="text-primary">.</span></SheetTitle>
            <nav className="mt-10 flex flex-col gap-6">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} className="font-display text-3xl uppercase">{n.label}</a>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="topo" className="relative flex min-h-[92vh] items-end overflow-hidden pt-16">
      <img src={hero} alt="Tatuador trabalhando no estúdio" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20">
        <p className="eyebrow">Tatuagem autoral · Arte sob medida</p>
        <h1 className="mt-4 max-w-3xl font-display text-6xl uppercase leading-[0.9] sm:text-8xl">
          Sua pele,<br />nosso <span className="text-primary">ritual</span>.
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted-foreground">
          Projetos únicos, desenhados para você e executados com biossegurança rigorosa.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 px-8 uppercase tracking-widest"><a href="#agendar">Solicitar agendamento</a></Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 uppercase tracking-widest"><a href="#portfolio">Ver portfólio</a></Button>
        </div>
      </div>
    </section>
  );
}

const WORKS = [
  { src: t1, title: "Serpente & Rosas", style: "Fine line" },
  { src: t2, title: "Adaga", style: "Neo-tradicional" },
  { src: t3, title: "Mariposa", style: "Realismo" },
];

function Portfolio() {
  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-5 py-24">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">01 — Portfólio</p>
          <h2 className="mt-3 font-display text-5xl uppercase sm:text-6xl">Trabalhos <span className="font-serif normal-case italic text-primary">recentes</span></h2>
        </div>
        <p className="max-w-sm text-muted-foreground">Cada peça nasce de uma conversa. Nada de flash repetido — o desenho é seu.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {WORKS.map((w, i) => (
          <figure key={w.title} className={`group overflow-hidden ${i === 1 ? "lg:mt-12" : ""}`}>
            <div className="overflow-hidden">
              <img src={w.src} alt={`Tatuagem ${w.title} em estilo ${w.style}`} loading="lazy" width={800} height={1008} className="aspect-[4/5] w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
              <span className="font-display text-xl uppercase">{w.title}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{w.style}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

const PILLARS = [
  { icon: PenTool, title: "Arte personalizada", text: "Desenho exclusivo criado a partir da sua história, referências e anatomia." },
  { icon: ShieldCheck, title: "Higiene rigorosa", text: "Agulhas e materiais descartáveis, superfícies protegidas e esterilização em autoclave." },
  { icon: Sparkles, title: "Cuidado no pós", text: "Orientação completa de cicatrização e acompanhamento depois da sessão." },
];

function Studio() {
  return (
    <section id="estudio" className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 lg:grid-cols-2">
        <div>
          <p className="eyebrow">02 — O estúdio</p>
          <h2 className="mt-3 font-display text-5xl uppercase leading-none sm:text-6xl">Arte com <span className="text-primary">respeito</span> ao seu corpo.</h2>
          <p className="mt-6 max-w-md text-muted-foreground">
            O {STUDIO_NAME} é um espaço intimista, pensado para que você se sinta seguro do primeiro rascunho à última linha.
          </p>
        </div>
        <div className="divide-y divide-border">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-5 py-6 first:pt-0">
              <Icon className="mt-1 size-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-display text-2xl uppercase">{title}</h3>
                <p className="mt-1 text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const EMPTY: BookingRequest = { nome: "", whatsapp: "", estilo: "", tamanho: "", local: "", ideia: "", preferencia: "" };

function Booking() {
  const [data, setData] = useState<BookingRequest>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingRequest, string>>>({});
  const configured = isWhatsappConfigured();

  const set = (k: keyof BookingRequest) => (e: { target: { value: string } }) => setData((d) => ({ ...d, [k]: e.target.value }));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: typeof errors = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof BookingRequest] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    const link = buildWhatsappLink(parsed.data);
    if (!link) {
      toast.error("WhatsApp do estúdio ainda não configurado", { description: "Sua solicitação não pôde ser enviada. Tente novamente mais tarde." });
      return;
    }
    window.open(link, "_blank", "noopener,noreferrer");
    toast.success("Abrindo o WhatsApp", { description: "Envie a mensagem para concluir sua solicitação." });
  }

  const field = (k: keyof BookingRequest, label: string, el: React.ReactNode) => (
    <div className="space-y-2">
      <Label htmlFor={k} className="text-xs uppercase tracking-widest">{label}</Label>
      {el}
      {errors[k] && <p className="text-sm text-destructive">{errors[k]}</p>}
    </div>
  );

  return (
    <section id="agendar" className="mx-auto max-w-6xl px-5 py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow">03 — Agendamento</p>
          <h2 className="mt-3 font-display text-5xl uppercase leading-none sm:text-6xl">Solicite seu <span className="font-serif normal-case italic text-primary">horário</span></h2>
          <p className="mt-6 text-muted-foreground">
            Preencha o formulário e envie pelo WhatsApp. <strong className="text-foreground">Isto é uma solicitação</strong> — o horário
            não fica reservado automaticamente. O estúdio analisa sua ideia e responde para confirmar data, valor e detalhes.
          </p>
          {!configured && (
            <div role="alert" className="mt-8 flex gap-3 border border-primary/50 bg-primary/10 p-4 text-sm">
              <AlertTriangle className="size-5 shrink-0 text-primary" />
              <p>O WhatsApp do estúdio ainda não foi configurado. O envio de solicitações estará disponível em breve.</p>
            </div>
          )}
        </div>
        <form onSubmit={onSubmit} noValidate className="grid gap-5 border border-border bg-card p-6 sm:grid-cols-2 sm:p-8">
          {field("nome", "Nome", <Input id="nome" value={data.nome} onChange={set("nome")} maxLength={100} className="h-11" />)}
          {field("whatsapp", "WhatsApp", <Input id="whatsapp" type="tel" inputMode="tel" placeholder="(11) 90000-0000" value={data.whatsapp} onChange={set("whatsapp")} maxLength={20} className="h-11" />)}
          {field("estilo", "Estilo", (
            <select id="estilo" value={data.estilo} onChange={set("estilo")} className={selectCls}>
              <option value="">Selecione</option>
              {ESTILOS.map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          {field("tamanho", "Tamanho", (
            <select id="tamanho" value={data.tamanho} onChange={set("tamanho")} className={selectCls}>
              <option value="">Selecione</option>
              {TAMANHOS.map((s) => <option key={s}>{s}</option>)}
            </select>
          ))}
          <div className="sm:col-span-2">{field("local", "Local do corpo", <Input id="local" placeholder="Ex.: antebraço direito" value={data.local} onChange={set("local")} maxLength={80} className="h-11" />)}</div>
          <div className="sm:col-span-2">{field("ideia", "Ideia / referências", <Textarea id="ideia" rows={4} placeholder="Descreva a ideia e cole links de referências" value={data.ideia} onChange={set("ideia")} maxLength={1000} />)}</div>
          <div className="sm:col-span-2">{field("preferencia", "Preferência de data / horário", <Input id="preferencia" placeholder="Ex.: sábados à tarde, a partir de novembro" value={data.preferencia} onChange={set("preferencia")} maxLength={150} className="h-11" />)}</div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg" className="h-12 w-full uppercase tracking-widest">
              <MessageCircle /> Enviar solicitação pelo WhatsApp
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Sujeito à confirmação do estúdio.</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Portfolio />
        <Studio />
        <Booking />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
          <span className="font-display text-lg uppercase text-foreground">Ritual<span className="text-primary">.</span> Tattoo Studio</span>
          <span>© {new Date().getFullYear()} {STUDIO_NAME}</span>
        </div>
      </footer>
    </div>
  );
}
