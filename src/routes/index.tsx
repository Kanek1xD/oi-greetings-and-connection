import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bird, Gamepad2, Medal, RotateCcw, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flap! — voe o mais longe que puder" },
      {
        name: "description",
        content:
          "Um jogo mobile de passarinho: toque para voar, desvie dos canos e tente bater o seu recorde.",
      },
    ],
  }),
  component: Index,
});

type Phase = "ready" | "playing" | "gameover";

type Pipe = {
  id: number;
  x: number;
  gapY: number;
  passed: boolean;
};

type GameState = {
  phase: Phase;
  score: number;
  bird: {
    x: number;
    y: number;
    vy: number;
  };
  pipes: Pipe[];
};

const WORLD_WIDTH = 360;
const WORLD_HEIGHT = 640;
const GROUND_Y = 574;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 56;
const PIPE_GAP = 174;
const GRAVITY = 980;
const FLAP_FORCE = -350;
const PIPE_SPEED = 150;

function createInitialGame(): GameState {
  return {
    phase: "ready",
    score: 0,
    bird: {
      x: 82,
      y: 292,
      vy: 0,
    },
    pipes: [
      { id: 1, x: 410, gapY: 304, passed: false },
      { id: 2, x: 630, gapY: 390, passed: false },
    ],
  };
}

function copyGame(game: GameState): GameState {
  return {
    ...game,
    bird: { ...game.bird },
    pipes: game.pipes.map((pipe) => ({ ...pipe })),
  };
}

function randomGap(): number {
  return Math.round(235 + Math.random() * 170);
}

function BirdSprite({ y, vy }: { y: number; vy: number }) {
  const tilt = Math.max(-25, Math.min(90, vy / 8));

  return (
    <div
      className="absolute z-30 h-[4.7%] w-[8.4%]"
      style={{
        left: `${(82 / WORLD_WIDTH) * 100}%`,
        top: `${(y / WORLD_HEIGHT) * 100}%`,
        transform: `rotate(${tilt}deg)`,
        transformOrigin: "center",
      }}
    >
      <div className="relative h-full w-full rounded-[52%] border-2 border-amber-700/50 bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 shadow-[2px_4px_0_rgba(120,53,15,0.25)]">
        <span className="absolute -right-[18%] top-[24%] h-[28%] w-[22%] rounded-full bg-slate-900" />
        <span className="absolute -right-[31%] top-[27%] h-[16%] w-[26%] rounded-r-full bg-orange-500" />
        <span className="absolute -left-[16%] top-[35%] h-[34%] w-[48%] rotate-12 rounded-full bg-amber-100/80" />
      </div>
    </div>
  );
}

function PipePair({ pipe }: { pipe: Pipe }) {
  const topHeight = Math.max(0, pipe.gapY - PIPE_GAP / 2);
  const bottomTop = pipe.gapY + PIPE_GAP / 2;
  const bottomHeight = Math.max(0, GROUND_Y - bottomTop);
  const left = `${(pipe.x / WORLD_WIDTH) * 100}%`;
  const width = `${(PIPE_WIDTH / WORLD_WIDTH) * 100}%`;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      <div
        className="absolute top-0 rounded-b-md border-x-2 border-emerald-800/50 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-[inset_5px_0_rgba(255,255,255,0.14),inset_-5px_0_rgba(6,78,59,0.2)]"
        style={{ left, width, height: `${(topHeight / WORLD_HEIGHT) * 100}%` }}
      >
        <span className="absolute -bottom-1 left-[-10%] h-7 w-[120%] rounded-md border-2 border-emerald-800/50 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-[inset_5px_0_rgba(255,255,255,0.14)]" />
      </div>
      <div
        className="absolute rounded-t-md border-x-2 border-emerald-800/50 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-[inset_5px_0_rgba(255,255,255,0.14),inset_-5px_0_rgba(6,78,59,0.2)]"
        style={{ left, top: `${(bottomTop / WORLD_HEIGHT) * 100}%`, width, height: `${(bottomHeight / WORLD_HEIGHT) * 100}%` }}
      >
        <span className="absolute -top-1 left-[-10%] h-7 w-[120%] rounded-md border-2 border-emerald-800/50 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 shadow-[inset_5px_0_rgba(255,255,255,0.14)]" />
      </div>
    </div>
  );
}

function GameBoard({ game, onAction }: { game: GameState; onAction: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Área do jogo. Toque para fazer o passarinho voar"
      onPointerDown={(event) => {
        event.preventDefault();
        onAction();
      }}
      onKeyDown={(event) => {
        if (event.code === "Space" || event.code === "ArrowUp" || event.code === "Enter") {
          event.preventDefault();
          onAction();
        }
      }}
      className="relative mx-auto w-full max-w-[390px] touch-none select-none overflow-hidden rounded-[2rem] border-[5px] border-slate-900 bg-sky-300 shadow-[0_24px_70px_rgba(15,23,42,0.45)] outline-none ring-offset-4 focus-visible:ring-2 focus-visible:ring-yellow-300"
      style={{ aspectRatio: `${WORLD_WIDTH}/${WORLD_HEIGHT}` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-cyan-300" />
      <div className="absolute left-[8%] top-[14%] h-5 w-[25%] rounded-full bg-white/55 blur-[1px] before:absolute before:-left-[18%] before:-top-3 before:h-7 before:w-[52%] before:rounded-full before:bg-white/55 after:absolute after:-right-[17%] after:-top-2 after:h-6 after:w-[44%] after:rounded-full after:bg-white/55" />
      <div className="absolute right-[8%] top-[31%] h-4 w-[20%] rounded-full bg-white/45 before:absolute before:-left-[25%] before:-top-3 before:h-6 before:w-[48%] before:rounded-full before:bg-white/45 after:absolute after:-right-[15%] after:-top-2 after:h-5 after:w-[42%] after:rounded-full after:bg-white/45" />
      <div className="absolute bottom-[9%] left-[-8%] h-[17%] w-[65%] rounded-[50%] bg-emerald-500/80" />
      <div className="absolute bottom-[8%] right-[-12%] h-[20%] w-[72%] rounded-[50%] bg-emerald-600/85" />
      <div className="absolute bottom-0 z-40 h-[10.4%] w-full border-t-4 border-lime-600/60 bg-lime-400 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.18)_0px,rgba(255,255,255,0.18)_8px,transparent_8px,transparent_18px)]" />
      <div className="absolute bottom-0 z-50 h-[4.8%] w-full bg-gradient-to-b from-amber-500 to-orange-700" />

      {game.pipes.map((pipe) => (
        <PipePair key={pipe.id} pipe={pipe} />
      ))}
      <BirdSprite y={game.bird.y} vy={game.bird.vy} />

      <div className="absolute left-0 right-0 top-[5%] z-50 flex justify-center">
        <span className="text-5xl font-black tracking-tight text-white drop-shadow-[0_4px_0_rgba(15,23,42,0.35)] sm:text-6xl">
          {game.score}
        </span>
      </div>

      {game.phase === "ready" && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-slate-900/10 px-6 text-center">
          <div className="rounded-3xl border border-white/35 bg-slate-950/75 px-7 py-6 shadow-2xl backdrop-blur-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-yellow-300 text-slate-900 shadow-lg">
              <Bird className="size-8" />
            </div>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">Toque para voar</h2>
            <p className="mt-2 text-sm text-slate-200">Passe pelos canos e não encoste no chão.</p>
          </div>
        </div>
      )}

      {game.phase === "gameover" && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-slate-950/45 px-6 text-center backdrop-blur-[2px]">
          <div className="w-full max-w-[250px] rounded-3xl border border-white/20 bg-slate-950/90 p-6 shadow-2xl">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-orange-400 text-slate-950">
              <Bird className="size-6" />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">Fim de jogo</p>
            <p className="mt-1 text-5xl font-black text-white">{game.score}</p>
            <p className="mt-1 text-sm text-slate-300">pontos conquistados</p>
            <Button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onAction();
              }}
              className="mt-5 h-11 w-full rounded-xl bg-yellow-300 font-black text-slate-950 hover:bg-yellow-200"
            >
              <RotateCcw className="size-4" /> Jogar novamente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Index() {
  const gameRef = useRef<GameState>(createInitialGame());
  const [game, setGame] = useState<GameState>(() => copyGame(gameRef.current));
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      const savedBest = Number(window.localStorage.getItem("flap-best") ?? 0);
      setBest(Number.isFinite(savedBest) ? savedBest : 0);
    } catch {
      setBest(0);
    }
  }, []);

  const beginGame = useCallback(() => {
    const next = createInitialGame();
    next.phase = "playing";
    next.bird.vy = FLAP_FORCE;
    gameRef.current = next;
    setGame(copyGame(next));
  }, []);

  const handleAction = useCallback(() => {
    const current = gameRef.current;

    if (current.phase === "gameover") {
      beginGame();
      return;
    }

    if (current.phase === "ready") {
      current.phase = "playing";
    }

    current.bird.vy = FLAP_FORCE;
    setGame(copyGame(current));
  }, [beginGame]);

  useEffect(() => {
    let animationFrame = 0;
    let previousTime = performance.now();

    const tick = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.034);
      previousTime = time;
      const current = gameRef.current;

      if (current.phase === "playing") {
        current.bird.vy += GRAVITY * delta;
        current.bird.y += current.bird.vy * delta;

        current.pipes.forEach((pipe) => {
          pipe.x -= PIPE_SPEED * delta;

          if (!pipe.passed && pipe.x + PIPE_WIDTH < current.bird.x) {
            pipe.passed = true;
            current.score += 1;
          }
        });

        current.pipes = current.pipes.filter((pipe) => pipe.x > -PIPE_WIDTH - 12);
        const lastPipe = current.pipes[current.pipes.length - 1];
        if (!lastPipe || lastPipe.x < WORLD_WIDTH - 170) {
          current.pipes.push({
            id: Date.now(),
            x: lastPipe ? lastPipe.x + 220 : WORLD_WIDTH + 50,
            gapY: randomGap(),
            passed: false,
          });
        }

        const birdLeft = current.bird.x;
        const birdRight = birdLeft + BIRD_SIZE;
        const birdTop = current.bird.y;
        const birdBottom = birdTop + BIRD_SIZE;
        const hitGround = birdTop < -8 || birdBottom > GROUND_Y;
        const hitPipe = current.pipes.some((pipe) => {
          const overlapsX = pipe.x < birdRight && pipe.x + PIPE_WIDTH > birdLeft;
          const gapTop = pipe.gapY - PIPE_GAP / 2;
          const gapBottom = pipe.gapY + PIPE_GAP / 2;
          return overlapsX && (birdTop < gapTop || birdBottom > gapBottom);
        });

        if (hitGround || hitPipe) {
          current.phase = "gameover";
          setBest((previousBest) => {
            const nextBest = Math.max(previousBest, current.score);
            try {
              window.localStorage.setItem("flap-best", String(nextBest));
            } catch {
              // O recorde continua funcionando durante a sessão mesmo sem armazenamento local.
            }
            return nextBest;
          });
        }

        setGame(copyGame(current));
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        handleAction();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleAction]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 rotate-[-6deg] items-center justify-center rounded-xl border-2 border-slate-900 bg-yellow-300 text-slate-950 shadow-[3px_3px_0_#0f172a]">
              <Bird className="size-6" />
            </div>
            <span className="text-2xl font-black tracking-[-0.08em] text-yellow-300">FLAP!</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Trophy className="size-4 text-yellow-300" />
            <span>Recorde: {best}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_430px] lg:items-center lg:gap-16 lg:py-20">
        <section className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-yellow-300">
            <Gamepad2 className="size-4" /> Jogo rápido para celular
          </div>
          <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-7xl">
            Voe alto.
            <br />
            <span className="text-yellow-300">Não caia.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-400 sm:text-lg">
            Um toque mantém o passarinho no ar. Desvie dos canos, conquiste pontos e tente superar o seu melhor voo.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={handleAction}
              className="h-12 rounded-xl bg-yellow-300 px-6 font-black text-slate-950 shadow-[0_8px_0_rgb(161,98,7)] transition hover:bg-yellow-200 active:translate-y-1 active:shadow-[0_4px_0_rgb(161,98,7)]"
            >
              <Bird className="size-5" /> {game.phase === "playing" ? "Bater asas" : "Começar a jogar"}
            </Button>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 px-4 text-sm text-slate-400">
              <span className="hidden size-2 rounded-full bg-emerald-400 sm:block" />
              Toque ou pressione espaço
            </div>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Medal className="size-5 text-yellow-300" />
              <p className="mt-3 text-2xl font-black text-white">{game.score}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Voo atual</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Trophy className="size-5 text-yellow-300" />
              <p className="mt-3 text-2xl font-black text-white">{best}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Melhor voo</p>
            </div>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-[390px] lg:justify-self-end">
          <div className="absolute -inset-8 -z-10 rounded-full bg-yellow-300/10 blur-3xl" />
          <GameBoard game={game} onAction={handleAction} />
          <p className="mt-5 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Toque na tela para bater as asas
          </p>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-slate-600 sm:px-8">
        Cada voo é uma nova chance de chegar mais longe.
      </footer>
    </div>
  );
}
