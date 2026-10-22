import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Cat, Heart, PawPrint, RefreshCw, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Miau Club — gatinhos em um clique" },
      {
        name: "description",
        content:
          "Um site rápido de gatinhos: galeria instantânea, fatos curiosos e muita fofura em um só lugar.",
      },
      { property: "og:title", content: "Miau Club — gatinhos em um clique" },
      {
        property: "og:description",
        content: "Galeria de gatinhos carregada na hora, com fatos curiosos sobre felinos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Kitty = { id: string; url: string };

const NAV = [
  { href: "#galeria", label: "Galeria" },
  { href: "#fatos", label: "Fatos" },
  { href: "#sobre", label: "Sobre" },
];

const FATOS = [
  {
    emoji: "😴",
    titulo: "Dormem 16h por dia",
    texto:
      "Gatos passam boa parte da vida dormindo. É instinto: poupar energia para as caçadas — mesmo as de brinquedo.",
  },
  {
    emoji: "🎵",
    titulo: "O ronronar cura",
    texto:
      "A vibração entre 25 e 150 Hz está associada a sensação de calma e até a processos de recuperação óssea.",
  },
  {
    emoji: "👑",
    titulo: "Umbigo de rainha",
    texto:
      "Quando um gato " +
      "levanta o rabo bem reto para você, é um cumprimento amigável. Sinal de confiança total.",
  },
  {
    emoji: "🚀",
    titulo: "Salto de 6x o corpo",
    texto:
      "As patas traseiras são verdadeiras molas: um gato adulto salta cerca de seis vezes o próprio comprimento.",
  },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <a href="#topo" className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground">
          <span className="flex size-9 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">
            <Cat className="size-5" />
          </span>
          Miau<span className="text-rose-400">.</span>Club
        </a>

        <nav className="hidden items-center gap-8 sm:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
          <Button asChild size="sm" className="rounded-full bg-rose-500 text-white hover:bg-rose-500/90">
            <a href="#galeria">Ver gatinhos</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-rose-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-32 size-64 rounded-full bg-amber-400/15 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
          <Zap className="size-3.5 text-rose-400" /> carrega em menos de um ronronar
        </span>

        <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-7xl">
          Um site de <span className="text-rose-400">gatinhos</span>,
          <br />
          rápido como um bote.
        </h1>

        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Fotos novas a cada clique, fatos curiosos e nenhuma enrolação. Aperte o botão e receba
          uma dose instantânea de fofura.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="h-12 rounded-full bg-rose-500 px-7 text-white hover:bg-rose-500/90">
            <a href="#galeria">
              <PawPrint className="mr-1" /> Abrir a galeria
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full border-border px-7 hover:bg-accent"
          >
            <a href="#fatos">Fatos curiosos</a>
          </Button>
        </div>

        <dl className="mt-14 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6">
          {[
            { valor: "1", rotulo: "clique para trocar" },
            { valor: "12", rotulo: "fotos por lote" },
            { valor: "∞", rotulo: "quantidade de fofura" },
          ].map((s) => (
            <div key={s.rotulo}>
              <dt className="text-2xl font-bold text-foreground">{s.valor}</dt>
              <dd className="text-xs uppercase tracking-widest text-muted-foreground">{s.rotulo}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Gallery() {
  const [kittens, setKittens] = useState<Kitty[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch("https://api.thecatapi.com/v1/images/search?limit=12&size=med");
      if (!res.ok) throw new Error("Não foi possível buscar as fotos");
      const data = (await res.json()) as Kitty[];
      if (!Array.isArray(data) || data.length === 0) throw new Error("Resposta vazia");
      setKittens(data);
    } catch {
      setFailed(true);
      setKittens([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section id="galeria" className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-rose-400">01 — Galeria</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Gatinhos do momento
            </h2>
          </div>
          <Button
            onClick={() => void load()}
            disabled={loading}
            variant="outline"
            className="rounded-full border-border"
          >
            <RefreshCw className={loading ? "animate-spin" : undefined} />
            {loading ? "Buscando..." : "Outro lote"}
          </Button>
        </div>

        {failed ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-border bg-background px-6 py-16 text-center">
            <Cat className="size-10 text-rose-400" />
            <p className="max-w-md text-muted-foreground">
              As fotos não chegaram agora. Isso costuma ser passageiro — tente novamente para
              carregar um novo lote de gatinhos.
            </p>
            <Button onClick={() => void load()} className="rounded-full bg-rose-500 text-white hover:bg-rose-500/90">
              <RefreshCw /> Tentar de novo
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {loading && kittens.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
                ))
              : kittens.map((k, i) => (
                  <figure
                    key={`${k.id}-${i}`}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-background"
                  >
                    <img
                      src={k.url}
                      alt="Gatinho fofo"
                      loading="lazy"
                      className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/95 to-transparent px-3 pb-3 pt-8 text-xs uppercase tracking-widest text-muted-foreground">
                      <span>Miau #{i + 1}</span>
                      <Heart className="size-4 text-rose-400 opacity-0 transition group-hover:opacity-100" />
                    </figcaption>
                  </figure>
                ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Fatos() {
  return (
    <section id="fatos" className="mx-auto max-w-6xl px-5 py-20">
      <p className="text-xs uppercase tracking-[0.3em] text-rose-400">02 — Fatos</p>
      <h2 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Coisas que todo gatinho sabe
      </h2>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {FATOS.map((f) => (
          <article
            key={f.titulo}
            className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-rose-500/40"
          >
            <span className="text-3xl" aria-hidden>
              {f.emoji}
            </span>
            <h3 className="mt-4 text-xl font-semibold text-foreground">{f.titulo}</h3>
            <p className="mt-2 text-muted-foreground">{f.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Sobre() {
  return (
    <section id="sobre" className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-rose-500/15 text-rose-400">
          <Sparkles className="size-6" />
        </span>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Feito para ser leve
        </h2>
        <p className="mt-4 text-muted-foreground">
          Sem cadastro, sem enrolação. Cada visita carrega um lote novo de fotos e você pode trocar
          quantas vezes quiser. É só fofura, no menor tempo possível.
        </p>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Fatos />
        <Sobre />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row">
          <span className="flex items-center gap-2 font-semibold text-foreground">
            <Cat className="size-4 text-rose-400" /> Miau.Club
          </span>
          <span>© {new Date().getFullYear()} — feito com ronrons</span>
        </div>
      </footer>
    </div>
  );
}
