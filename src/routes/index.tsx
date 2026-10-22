import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bitcoin,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Copy,
  Eye,
  EyeOff,
  Gem,
  LayoutDashboard,
  LineChart,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'NexoCrypto — sua carteira de criptoativos' },
      {
        name: 'description',
        content:
          'Dashboard NexoCrypto para acompanhar carteira, mercado e operações de criptoativos.',
      },
    ],
  }),
  component: Index,
});

type Asset = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  holdings: number;
  icon: LucideIcon;
  iconClass: string;
  spark: number[];
};

const formatCurrency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2,
});

const formatNumber = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
});

const marketAssets: Asset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 343220.45,
    change: 4.82,
    holdings: 5420.18,
    icon: Bitcoin,
    iconClass: 'bg-orange-500/15 text-orange-400',
    spark: [30, 42, 35, 50, 45, 62, 57, 73, 68, 86],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 18456.2,
    change: 2.36,
    holdings: 3180.44,
    icon: Gem,
    iconClass: 'bg-indigo-500/15 text-indigo-300',
    spark: [45, 38, 52, 47, 60, 55, 64, 58, 76, 71],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 864.73,
    change: -1.18,
    holdings: 1964.58,
    icon: BarChart3,
    iconClass: 'bg-cyan-500/15 text-cyan-300',
    spark: [68, 75, 60, 64, 51, 58, 42, 48, 37, 43],
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    price: 5.02,
    change: 0.08,
    holdings: 1918.42,
    icon: CircleDollarSign,
    iconClass: 'bg-emerald-500/15 text-emerald-300',
    spark: [47, 49, 48, 50, 49, 51, 50, 52, 51, 52],
  },
];

const navItems = [
  { label: 'Visão geral', icon: LayoutDashboard },
  { label: 'Carteira', icon: WalletCards },
  { label: 'Mercado', icon: LineChart },
  { label: 'Futuros', icon: BarChart3 },
  { label: 'Configurações', icon: Settings2 },
];

function Sparkline({ points, positive = true }: { points: number[]; positive?: boolean }) {
  return (
    <div className='flex h-10 items-end gap-1'>
      {points.map((point, index) => (
        <span
          key={`${point}-${index}`}
          className={`w-1.5 rounded-t-sm ${positive ? 'bg-emerald-400' : 'bg-rose-400'}`}
          style={{ height: `${point}%`, opacity: 0.35 + index / 20 }}
        />
      ))}
    </div>
  );
}

function AssetIcon({ asset, size = 'size-10' }: { asset: Asset; size?: string }) {
  const Icon = asset.icon;

  return (
    <div className={`flex ${size} shrink-0 items-center justify-center rounded-xl ${asset.iconClass}`}>
      <Icon className='size-5' />
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  iconClass: string;
}) {
  return (
    <Card className='border-white/[0.08] bg-white/[0.035] shadow-none'>
      <CardContent className='p-5'>
        <div className='flex items-start justify-between'>
          <div>
            <p className='text-sm text-slate-400'>{label}</p>
            <p className='mt-2 text-2xl font-bold tracking-tight text-white'>{value}</p>
          </div>
          <div className={`flex size-10 items-center justify-center rounded-xl ${iconClass}`}>
            <Icon className='size-5' />
          </div>
        </div>
        <div className='mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-300'>
          <TrendingUp className='size-3.5' />
          {change}
          <span className='font-normal text-slate-500'>nos últimos 30 dias</span>
        </div>
      </CardContent>
    </Card>
  );
}

type UserRole = 'admin' | 'cliente';

type DemoSession = {
  role: UserRole;
  email: string;
};

const demoAccess: Record<UserRole, { email: string; password: string }> = {
  admin: {
    email: 'admin@nexocrypto.com',
    password: 'admin123',
  },
  cliente: {
    email: 'cliente@nexocrypto.com',
    password: 'cliente123',
  },
};

function LoginScreen({ onLogin }: { onLogin: (role: UserRole, email: string) => void }) {
  const [role, setRole] = useState<UserRole>('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const credentials = demoAccess[role];

    if (email.trim().toLowerCase() !== credentials.email || password !== credentials.password) {
      setError('Confira o perfil, e-mail e senha informados.');
      return;
    }

    onLogin(role, credentials.email);
  }

  const accessHint = role === 'admin'
    ? 'admin@nexocrypto.com / admin123'
    : 'cliente@nexocrypto.com / cliente123';

  return (
    <main className='flex min-h-screen items-center justify-center bg-[#08100f] px-4 py-10 text-slate-100'>
      <div className='pointer-events-none fixed inset-0 overflow-hidden'>
        <div className='absolute left-1/2 top-0 size-[32rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl' />
        <div className='absolute bottom-0 right-0 size-72 rounded-full bg-cyan-400/5 blur-3xl' />
      </div>

      <Card className='relative w-full max-w-md border-white/[0.1] bg-[#0d1715]/95 shadow-2xl shadow-emerald-950/30'>
        <CardContent className='p-6 sm:p-8'>
          <div className='mb-8 text-center'>
            <div className='mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.25)]'>
              <Zap className='size-7 fill-current' />
            </div>
            <p className='mt-5 text-2xl font-black tracking-tight text-white'>Nexo<span className='text-emerald-400'>Crypto</span></p>
            <p className='mt-2 text-sm text-slate-500'>Entre para acompanhar sua carteira</p>
          </div>

          <div className='mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-white/[0.04] p-1.5'>
            <button
              type='button'
              onClick={() => {
                setRole('cliente');
                setError('');
              }}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${role === 'cliente' ? 'bg-emerald-400 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              <UserRound className='size-4' /> Cliente
            </button>
            <button
              type='button'
              onClick={() => {
                setRole('admin');
                setError('');
              }}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${role === 'admin' ? 'bg-emerald-400 text-slate-950' : 'text-slate-500 hover:text-white'}`}
            >
              <ShieldCheck className='size-4' /> ADM
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label htmlFor='login-email' className='mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>E-mail</label>
              <div className='flex items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.025] px-3'>
                <Mail className='size-4 text-slate-500' />
                <input
                  id='login-email'
                  type='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder='voce@exemplo.com'
                  autoComplete='email'
                  className='h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-700'
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor='login-password' className='mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'>Senha</label>
              <div className='flex items-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.025] px-3'>
                <LockKeyhole className='size-4 text-slate-500' />
                <input
                  id='login-password'
                  type='password'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder='Digite sua senha'
                  autoComplete='current-password'
                  className='h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-700'
                  required
                />
              </div>
            </div>

            {error && (
              <p className='rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-200'>{error}</p>
            )}

            <Button type='submit' className='h-12 w-full bg-emerald-400 font-bold text-slate-950 hover:bg-emerald-300'>
              Entrar como {role === 'admin' ? 'ADM' : 'cliente'}
              <LogIn className='size-4' />
            </Button>
          </form>

          <div className='mt-6 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 text-center'>
            <p className='text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600'>Acesso de demonstração</p>
            <p className='mt-2 text-xs text-slate-400'>{accessHint}</p>
          </div>

          <p className='mt-6 text-center text-[11px] leading-5 text-slate-600'>Esta versão usa uma sessão local para demonstração. Conecte um provedor de autenticação para contas reais.</p>
        </CardContent>
      </Card>
    </main>
  );
}

function Index() {
  const [activeNav, setActiveNav] = useState('Visão geral');
  const [showBalance, setShowBalance] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [orderType, setOrderType] = useState<'Comprar' | 'Vender'>('Comprar');
  const [orderAmount, setOrderAmount] = useState('');
  const [notice, setNotice] = useState('');
  const [session, setSession] = useState<DemoSession | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const savedSession = window.localStorage.getItem('nexocrypto-session');

    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession) as DemoSession;
        if (parsedSession.role === 'admin' || parsedSession.role === 'cliente') {
          setSession(parsedSession);
        }
      } catch {
        window.localStorage.removeItem('nexocrypto-session');
      }
    }

    setSessionReady(true);
  }, []);

  const selectedAsset = useMemo(
    () => marketAssets.find((asset) => asset.symbol === selectedSymbol) ?? marketAssets[0],
    [selectedSymbol],
  );

  const portfolioValue = marketAssets.reduce((total, asset) => total + asset.holdings, 0);
  const visibleBalance = showBalance ? formatCurrency.format(portfolioValue) : '••••••••';
  const displayName = session?.role === 'admin' ? 'Admin Nexo' : 'Marina Silva';

  function handleLogin(role: UserRole, email: string) {
    const nextSession = { role, email };
    setSession(nextSession);
    window.localStorage.setItem('nexocrypto-session', JSON.stringify(nextSession));
  }

  function handleLogout() {
    setSession(null);
    window.localStorage.removeItem('nexocrypto-session');
  }

  function handleTrade(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(orderAmount.replace(',', '.'));

    if (!amount || amount <= 0) {
      setNotice('Informe um valor válido para continuar.');
      return;
    }

    setNotice(`${orderType} de ${formatCurrency.format(amount)} em ${selectedAsset.symbol} simulada com sucesso.`);
    setOrderAmount('');
  }

  function handleNav(label: string) {
    setActiveNav(label);
    if (label !== 'Visão geral') {
      setNotice(`${label} está disponível nesta demonstração do NexoCrypto.`);
    }
  }

  if (!sessionReady) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#08100f] text-slate-100'>
        <div className='text-center'>
          <div className='mx-auto size-8 animate-pulse rounded-full bg-emerald-400' />
          <p className='mt-4 text-sm text-slate-500'>Carregando seu acesso...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className='min-h-screen bg-[#08100f] text-slate-100'>
      <div className='flex min-h-screen'>
        <aside className='hidden w-64 shrink-0 flex-col border-r border-white/[0.07] bg-[#0b1513] lg:flex'>
          <div className='flex h-20 items-center border-b border-white/[0.07] px-6'>
            <div className='flex items-center gap-3'>
              <div className='flex size-9 items-center justify-center rounded-xl bg-emerald-400 text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.2)]'>
                <Zap className='size-5 fill-current' />
              </div>
              <div>
                <p className='text-lg font-black tracking-tight text-white'>Nexo<span className='text-emerald-400'>Crypto</span></p>
                <p className='text-[9px] font-bold uppercase tracking-[0.24em] text-slate-500'>Digital assets</p>
              </div>
            </div>
          </div>

          <div className='flex-1 px-4 py-7'>
            <p className='mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600'>Menu principal</p>
            <nav className='space-y-1'>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.label;

                return (
                  <button
                    key={item.label}
                    type='button'
                    onClick={() => handleNav(item.label)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-emerald-400/10 text-emerald-300 shadow-[inset_3px_0_0_#34d399]'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <Icon className='size-[18px]' />
                    {item.label}
                    {item.label === 'Mercado' && <span className='ml-auto size-1.5 rounded-full bg-emerald-400' />}
                  </button>
                );
              })}
            </nav>

            <div className='mt-10 rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-400/10 to-transparent p-4'>
              <div className='flex size-9 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300'>
                <ShieldCheck className='size-5' />
              </div>
              <p className='mt-4 text-sm font-semibold text-white'>Sua segurança importa</p>
              <p className='mt-1 text-xs leading-5 text-slate-500'>Ative a autenticação em duas etapas para proteger sua conta.</p>
              <button type='button' className='mt-3 flex cursor-pointer items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200'>
                Ver configurações <ChevronRight className='size-3.5' />
              </button>
            </div>
          </div>

          <div className='border-t border-white/[0.07] p-4'>
            <button type='button' onClick={handleLogout} title='Sair da conta' className='flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.04]'>
              <div className='flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-cyan-500 text-sm font-bold text-slate-950'>{session.role === 'admin' ? 'AD' : 'MS'}</div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-semibold text-white'>{displayName}</p>
                <p className='truncate text-xs text-slate-500'>{session.role === 'admin' ? 'Administrador' : 'Cliente Premium'}</p>
              </div>
              <LogOut className='size-4 text-slate-500' />
            </button>
          </div>
        </aside>

        <div className='min-w-0 flex-1'>
          <header className='sticky top-0 z-20 border-b border-white/[0.07] bg-[#08100f]/90 backdrop-blur-xl'>
            <div className='flex h-20 items-center justify-between gap-4 px-5 sm:px-8 xl:px-10'>
              <div className='flex items-center gap-3'>
                <button type='button' className='flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 text-slate-300 lg:hidden'>
                  <Menu className='size-5' />
                </button>
                <div className='lg:hidden'>
                  <p className='text-lg font-black tracking-tight text-white'>Nexo<span className='text-emerald-400'>Crypto</span></p>
                </div>
                <div className='hidden items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-slate-500 md:flex md:w-64'>
                  <Search className='size-4' />
                  <span>Buscar ativo, recurso...</span>
                  <span className='ml-auto rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-600'>⌘ K</span>
                </div>
              </div>

              <div className='flex items-center gap-2 sm:gap-3'>
                <div className='hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-2 text-xs font-medium text-emerald-300 sm:flex'>
                  <span className='size-2 animate-pulse rounded-full bg-emerald-400' /> Mercado aberto
                </div>
                <div className='hidden items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/5 px-3 py-2 text-xs font-medium text-violet-300 md:flex'>
                  {session.role === 'admin' ? <ShieldCheck className='size-3.5' /> : <UserRound className='size-3.5' />}
                  {session.role === 'admin' ? 'Acesso ADM' : 'Conta cliente'}
                </div>
                <button type='button' className='relative flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.05] hover:text-white'>
                  <Bell className='size-[18px]' />
                  <span className='absolute right-2 top-2 size-1.5 rounded-full bg-emerald-400' />
                </button>
                <div className='flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-cyan-500 text-sm font-bold text-slate-950'>MS</div>
              </div>
            </div>
            <div className='flex gap-1 overflow-x-auto border-t border-white/[0.05] px-5 py-2 lg:hidden'>
              {navItems.slice(0, 4).map((item) => (
                <button
                  key={item.label}
                  type='button'
                  onClick={() => handleNav(item.label)}
                  className={`shrink-0 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold ${activeNav === item.label ? 'bg-emerald-400/10 text-emerald-300' : 'text-slate-500'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <main className='mx-auto max-w-[1500px] px-5 py-8 sm:px-8 xl:px-10'>
            <div className='mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
              <div>
                <div className='mb-2 flex items-center gap-2 text-sm text-slate-500'>
                  <span>Dashboard</span>
                  <ChevronRight className='size-3.5' />
                  <span className='text-emerald-300'>{activeNav}</span>
                </div>
                <h1 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>Olá, {displayName} <span className='inline-block'>👋</span></h1>
                <p className='mt-2 text-sm text-slate-500'>Acompanhe seus ativos e encontre novas oportunidades.</p>
              </div>
              <div className='flex gap-2'>
                <Button variant='outline' className='border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.07] hover:text-white'>
                  <RefreshCw className='size-4' /> Atualizar
                </Button>
                <Button className='bg-emerald-400 font-bold text-slate-950 hover:bg-emerald-300'>
                  <Plus className='size-4' /> Adicionar fundos
                </Button>
              </div>
            </div>

            {notice && (
              <div className='mb-6 flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200'>
                <span>{notice}</span>
                <button type='button' onClick={() => setNotice('')} className='cursor-pointer text-emerald-300 hover:text-white'>×</button>
              </div>
            )}

            <section className='grid gap-5 xl:grid-cols-[1.45fr_1fr_1fr]'>
              <Card className='relative overflow-hidden border-emerald-400/20 bg-gradient-to-br from-emerald-500/20 via-[#10241f] to-[#0d1715] shadow-none'>
                <div className='pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-emerald-400/10 blur-3xl' />
                <CardContent className='relative p-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <div className='flex items-center gap-2 text-sm text-emerald-100/70'>
                        Saldo total <button type='button' onClick={() => setShowBalance((value) => !value)} className='cursor-pointer text-emerald-200 hover:text-white'>{showBalance ? <Eye className='size-4' /> : <EyeOff className='size-4' />}</button>
                      </div>
                      <p className='mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl'>{visibleBalance}</p>
                      <div className='mt-3 flex items-center gap-2 text-sm'>
                        <span className='flex items-center gap-1 font-semibold text-emerald-300'><TrendingUp className='size-3.5' /> +8,42%</span>
                        <span className='text-emerald-100/45'>este mês</span>
                      </div>
                    </div>
                    <div className='flex size-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300'>
                      <WalletCards className='size-5' />
                    </div>
                  </div>
                  <div className='mt-8 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-emerald-100/60'>
                    <span className='size-1.5 rounded-full bg-emerald-400' /> Atualizado agora
                    <span className='ml-auto flex items-center gap-1 text-emerald-200/60'><Copy className='size-3' /> 0x83...A91F</span>
                  </div>
                </CardContent>
              </Card>
              <MetricCard label='Lucro não realizado' value={formatCurrency.format(1248.72)} change='+12,64%' icon={TrendingUp} iconClass='bg-emerald-400/10 text-emerald-300' />
              <MetricCard label='Rendimento estimado' value={formatCurrency.format(486.2)} change='+6,18%' icon={Sparkles} iconClass='bg-violet-400/10 text-violet-300' />
            </section>

            <section className='mt-7 grid gap-6 xl:grid-cols-[1.6fr_1fr]'>
              <Card className='border-white/[0.08] bg-white/[0.035] shadow-none'>
                <CardHeader className='flex-row items-center justify-between space-y-0 p-6 pb-3'>
                  <div>
                    <CardTitle className='text-base text-white'>Distribuição do portfólio</CardTitle>
                    <p className='mt-1 text-xs text-slate-500'>Seus ativos por valor atual</p>
                  </div>
                  <button type='button' className='flex cursor-pointer items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white'>Últimos 30 dias <ChevronDown className='size-3.5' /></button>
                </CardHeader>
                <CardContent className='grid items-center gap-8 p-6 pt-4 md:grid-cols-[220px_1fr]'>
                  <div className='relative mx-auto flex size-48 items-center justify-center rounded-full' style={{ background: 'conic-gradient(#f97316 0 43%, #818cf8 43% 68%, #22d3ee 68% 84%, #34d399 84% 100%)' }}>
                    <div className='flex size-32 flex-col items-center justify-center rounded-full bg-[#101b18]'>
                      <span className='text-xs text-slate-500'>Total</span>
                      <span className='mt-1 text-lg font-bold text-white'>{formatCurrency.format(portfolioValue)}</span>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    {marketAssets.map((asset, index) => {
                      const percentage = [43, 25, 16, 16][index];
                      return (
                        <div key={asset.symbol} className='flex items-center gap-3'>
                          <AssetIcon asset={asset} size='size-8' />
                          <div className='min-w-0 flex-1'>
                            <div className='flex items-center justify-between gap-3 text-sm'>
                              <span className='font-semibold text-white'>{asset.symbol}</span>
                              <span className='text-slate-400'>{percentage}%</span>
                            </div>
                            <div className='mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]'>
                              <div className={`h-full rounded-full ${index === 0 ? 'bg-orange-400' : index === 1 ? 'bg-indigo-400' : index === 2 ? 'bg-cyan-400' : 'bg-emerald-400'}`} style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className='border-white/[0.08] bg-white/[0.035] shadow-none'>
                <CardHeader className='flex-row items-center justify-between space-y-0 p-6 pb-3'>
                  <div>
                    <CardTitle className='text-base text-white'>Comprar e vender</CardTitle>
                    <p className='mt-1 text-xs text-slate-500'>Operação rápida</p>
                  </div>
                  <Badge className='border-emerald-400/20 bg-emerald-400/10 text-[10px] text-emerald-300'>Simulação</Badge>
                </CardHeader>
                <CardContent className='p-6 pt-3'>
                  <div className='mb-5 grid grid-cols-2 rounded-xl bg-white/[0.04] p-1'>
                    {(['Comprar', 'Vender'] as const).map((type) => (
                      <button key={type} type='button' onClick={() => setOrderType(type)} className={`cursor-pointer rounded-lg py-2 text-sm font-semibold transition ${orderType === type ? 'bg-emerald-400 text-slate-950' : 'text-slate-500 hover:text-white'}`}>{type}</button>
                    ))}
                  </div>
                  <button type='button' onClick={() => setSelectedSymbol(selectedAsset.symbol === 'BTC' ? 'ETH' : 'BTC')} className='flex w-full cursor-pointer items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 text-left transition hover:border-emerald-400/30'>
                    <AssetIcon asset={selectedAsset} size='size-9' />
                    <div className='flex-1'>
                      <p className='text-sm font-semibold text-white'>{selectedAsset.name}</p>
                      <p className='text-xs text-slate-500'>{selectedAsset.symbol}/BRL</p>
                    </div>
                    <ChevronDown className='size-4 text-slate-500' />
                  </button>
                  <form onSubmit={handleTrade} className='mt-4'>
                    <div className='rounded-xl border border-white/[0.08] bg-white/[0.025] p-3'>
                      <div className='flex items-center justify-between text-xs text-slate-500'><span>Valor em BRL</span><span>Disponível: {formatCurrency.format(2450.8)}</span></div>
                      <div className='mt-2 flex items-center gap-2'>
                        <span className='text-xl font-bold text-slate-400'>R$</span>
                        <input value={orderAmount} onChange={(event) => setOrderAmount(event.target.value)} inputMode='decimal' placeholder='0,00' className='w-full bg-transparent text-2xl font-bold text-white outline-none placeholder:text-slate-700' />
                      </div>
                    </div>
                    <Button type='submit' className={`mt-4 h-11 w-full font-bold ${orderType === 'Comprar' ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' : 'bg-rose-400 text-slate-950 hover:bg-rose-300'}`}>
                      {orderType} {selectedAsset.symbol}
                      <ArrowUpRight className='size-4' />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>

            <section className='mt-7 grid gap-6 xl:grid-cols-[1.6fr_1fr]'>
              <Card className='border-white/[0.08] bg-white/[0.035] shadow-none'>
                <CardHeader className='flex-row items-center justify-between space-y-0 p-6 pb-4'>
                  <div>
                    <CardTitle className='text-base text-white'>Mercado em destaque</CardTitle>
                    <p className='mt-1 text-xs text-slate-500'>Acompanhe os ativos mais importantes</p>
                  </div>
                  <button type='button' onClick={() => handleNav('Mercado')} className='flex cursor-pointer items-center gap-1 text-xs font-bold text-emerald-300 hover:text-emerald-200'>Ver mercado <ArrowUpRight className='size-3.5' /></button>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='hidden grid-cols-[1.5fr_1fr_0.8fr_0.9fr_70px] gap-4 border-y border-white/[0.06] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600 sm:grid'>
                    <span>Ativo</span><span>Preço</span><span>24h</span><span>Gráfico</span><span />
                  </div>
                  <div className='divide-y divide-white/[0.05]'>
                    {marketAssets.map((asset) => (
                      <button key={asset.symbol} type='button' onClick={() => setSelectedSymbol(asset.symbol)} className={`grid w-full cursor-pointer items-center gap-4 px-6 py-4 text-left transition sm:grid-cols-[1.5fr_1fr_0.8fr_0.9fr_70px] ${selectedSymbol === asset.symbol ? 'bg-emerald-400/[0.04]' : 'hover:bg-white/[0.025]'}`}>
                        <div className='flex items-center gap-3'>
                          <AssetIcon asset={asset} size='size-9' />
                          <div><p className='text-sm font-bold text-white'>{asset.symbol}</p><p className='text-xs text-slate-500'>{asset.name}</p></div>
                        </div>
                        <div className='text-sm font-semibold text-slate-200'>{formatCurrency.format(asset.price)}</div>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${asset.change >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{asset.change >= 0 ? <TrendingUp className='size-3.5' /> : <TrendingDown className='size-3.5' />}{asset.change >= 0 ? '+' : ''}{formatNumber.format(asset.change)}%</div>
                        <div className='hidden sm:block'><Sparkline points={asset.spark} positive={asset.change >= 0} /></div>
                        <MoreHorizontal className='hidden size-4 justify-self-end text-slate-500 sm:block' />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className='border-white/[0.08] bg-white/[0.035] shadow-none'>
                <CardHeader className='flex-row items-center justify-between space-y-0 p-6 pb-4'>
                  <div><CardTitle className='text-base text-white'>Atividade recente</CardTitle><p className='mt-1 text-xs text-slate-500'>Suas últimas movimentações</p></div>
                  <button type='button' className='cursor-pointer text-xs font-bold text-emerald-300 hover:text-emerald-200'>Ver tudo</button>
                </CardHeader>
                <CardContent className='space-y-5 p-6 pt-2'>
                  <div className='flex items-center gap-3'><div className='flex size-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300'><ArrowDownToLine className='size-4' /></div><div className='min-w-0 flex-1'><p className='text-sm font-semibold text-white'>Depósito recebido</p><p className='text-xs text-slate-500'>Hoje, 10:42</p></div><div className='text-right'><p className='text-sm font-semibold text-emerald-300'>+ R$ 850,00</p><p className='text-xs text-slate-600'>BRL</p></div></div>
                  <div className='flex items-center gap-3'><div className='flex size-9 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300'><Bitcoin className='size-4' /></div><div className='min-w-0 flex-1'><p className='text-sm font-semibold text-white'>Compra de BTC</p><p className='text-xs text-slate-500'>Ontem, 16:28</p></div><div className='text-right'><p className='text-sm font-semibold text-white'>- R$ 420,00</p><p className='text-xs text-slate-600'>0,0012 BTC</p></div></div>
                  <div className='flex items-center gap-3'><div className='flex size-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300'><ArrowUpFromLine className='size-4' /></div><div className='min-w-0 flex-1'><p className='text-sm font-semibold text-white'>Retirada enviada</p><p className='text-xs text-slate-500'>12 jun, 09:15</p></div><div className='text-right'><p className='text-sm font-semibold text-white'>- R$ 120,00</p><p className='text-xs text-slate-600'>Concluída</p></div></div>
                  <div className='flex items-center gap-3'><div className='flex size-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300'><Clock3 className='size-4' /></div><div className='min-w-0 flex-1'><p className='text-sm font-semibold text-white'>Rendimento creditado</p><p className='text-xs text-slate-500'>10 jun, 08:00</p></div><div className='text-right'><p className='text-sm font-semibold text-emerald-300'>+ R$ 36,42</p><p className='text-xs text-slate-600'>USDT</p></div></div>
                </CardContent>
              </Card>
            </section>

            <section className='mt-7 grid gap-4 sm:grid-cols-3'>
              <button type='button' className='group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-left transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.04]'><div className='flex size-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300'><ArrowDownToLine className='size-5' /></div><div className='flex-1'><p className='text-sm font-bold text-white'>Depositar</p><p className='mt-1 text-xs text-slate-500'>Adicione saldo à carteira</p></div><ChevronRight className='size-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300' /></button>
              <button type='button' className='group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-left transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.04]'><div className='flex size-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300'><ArrowUpFromLine className='size-5' /></div><div className='flex-1'><p className='text-sm font-bold text-white'>Retirar</p><p className='mt-1 text-xs text-slate-500'>Envie para sua conta</p></div><ChevronRight className='size-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300' /></button>
              <button type='button' className='group flex cursor-pointer items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-left transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.04]'><div className='flex size-10 items-center justify-center rounded-xl bg-orange-400/10 text-orange-300'><Sparkles className='size-5' /></div><div className='flex-1'><p className='text-sm font-bold text-white'>Ganhe até 12%</p><p className='mt-1 text-xs text-slate-500'>Veja nossas oportunidades</p></div><ChevronRight className='size-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-emerald-300' /></button>
            </section>

            <footer className='mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-slate-600 sm:flex-row'>
              <p>© 2024 NexoCrypto. Invista com clareza.</p>
              <div className='flex items-center gap-4'><span className='flex items-center gap-1.5'><ShieldCheck className='size-3.5 text-emerald-400' /> Ambiente seguro</span><span>Termos</span><span>Privacidade</span></div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
