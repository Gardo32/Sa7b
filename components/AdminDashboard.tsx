'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaArrowsRotate,
  FaChartColumn,
  FaChartPie,
  FaGear,
  FaKey,
  FaMagnifyingGlass,
  FaShield,
  FaTrophy,
  FaUsers,
  FaTrashArrowUp,
  FaEye,
  FaEyeSlash,
  FaCircleCheck,
  FaCircleXmark,
  FaFilter,
  FaRotateLeft,
} from 'react-icons/fa6';
import {
  getStats,
  loadParticipants,
  restoreParticipant,
  restoreAllParticipants,
} from '@/lib/participants-store';
import type { ParticipantDto, StatsDto } from '@/lib/types';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'admin123';
const SESSION_KEY = 'sa7b_admin_session';

type Tab = 'stats' | 'participants' | 'winners' | 'controls';

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onLogin();
    } else {
      setError('كلمة المرور غير صحيحة');
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
  };

  return (
    <main className="min-h-screen bg-emerald-950 flex items-center justify-center px-4">
      <div
        className={`w-full max-w-sm rounded-3xl border border-emerald-600/40 bg-emerald-900/50 p-8 shadow-card backdrop-blur-lg transition-all ${shake ? 'animate-[shake_0.5s_ease]' : ''}`}
        style={shake ? { animation: 'shake 0.5s ease' } : {}}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-400/40">
            <FaShield className="text-3xl text-yellow-400" />
          </div>
          <h1 className="font-amiri text-3xl text-yellow-300">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-emerald-100/60">بطاعتي أسمو</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <FaKey className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400/70" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="w-full rounded-xl border border-emerald-500/40 bg-emerald-950/60 py-3 pr-11 pl-11 text-emerald-50 placeholder-emerald-400/40 outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/40 transition"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/70 hover:text-emerald-300"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-red-400">
              <FaCircleXmark />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="gold-shimmer w-full rounded-xl py-3 font-bold text-emerald-950 shadow-glow transition hover:scale-[1.02] active:scale-[0.99]"
          >
            دخول
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-4px); }
          90%       { transform: translateX(4px); }
        }
      `}</style>
    </main>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ title, value, sub }: { title: string; value: number; sub?: string }) {
  return (
    <article className="rounded-2xl border border-emerald-600/40 bg-emerald-900/45 p-5 shadow-card">
      <p className="text-sm text-emerald-100/70">{title}</p>
      <p className="mt-2 text-4xl font-bold text-yellow-300">{value}</p>
      {sub && <p className="mt-1 text-xs text-emerald-400/70">{sub}</p>}
    </article>
  );
}

// ─── Bar Visual ──────────────────────────────────────────────────────────────

function ProgressBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-emerald-100/80">{label}</span>
        <span className="text-yellow-300 font-bold">{value} / {max} ({pct}%)</span>
      </div>
      <div className="h-3 w-full rounded-full bg-emerald-950/60 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Stats Tab ───────────────────────────────────────────────────────────────

function StatsTab({ stats, allParticipants }: { stats: StatsDto; allParticipants: ParticipantDto[] }) {
  const totalPreKK3 = allParticipants.filter((p) => p.cohort === 'pre_k_k3').length;
  const totalK4K7 = allParticipants.filter((p) => p.cohort === 'k4_k7').length;
  const excludedPreKK3 = allParticipants.filter((p) => p.cohort === 'pre_k_k3' && p.excluded_all === 1).length;
  const excludedK4K7 = allParticipants.filter((p) => p.cohort === 'k4_k7' && p.excluded_all === 1).length;

  const drawPct = stats.totalParticipants > 0
    ? Math.round((stats.totalExcluded / stats.totalParticipants) * 100)
    : 0;

  // Points distribution
  const buckets = [
    { label: '100 نقطة', count: allParticipants.filter((p) => p.points === 100).length },
    { label: '95 نقطة', count: allParticipants.filter((p) => p.points === 95).length },
    { label: '90 نقطة', count: allParticipants.filter((p) => p.points === 90).length },
    { label: '80 نقطة', count: allParticipants.filter((p) => p.points === 80).length },
    { label: '75 نقطة', count: allParticipants.filter((p) => p.points === 75).length },
  ].filter((b) => b.count > 0);

  const maxBucket = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="إجمالي المشاركين" value={stats.totalParticipants} />
        <StatCard title="إجمالي الفائزين" value={stats.totalExcluded} sub={`${drawPct}% من الكل`} />
        <StatCard title="متبقي (تمهيدي–K3)" value={stats.remainingPreKK3} sub={`من أصل ${totalPreKK3}`} />
        <StatCard title="متبقي (K4–K7)" value={stats.remainingK4K7} sub={`من أصل ${totalK4K7}`} />
      </div>

      {/* Progress Bars */}
      <section className="rounded-2xl border border-emerald-600/40 bg-emerald-900/40 p-5 shadow-card space-y-4">
        <h2 className="text-lg font-bold text-yellow-300 mb-4">تقدم السحب لكل فئة</h2>
        <ProgressBar
          label="التمهيدي إلى K3"
          value={excludedPreKK3}
          max={totalPreKK3}
          color="bg-gradient-to-r from-yellow-500 to-yellow-400"
        />
        <ProgressBar
          label="K4 إلى K7"
          value={excludedK4K7}
          max={totalK4K7}
          color="bg-gradient-to-r from-emerald-500 to-emerald-400"
        />
        <ProgressBar
          label="الإجمالي"
          value={stats.totalExcluded}
          max={stats.totalParticipants}
          color="bg-gradient-to-r from-yellow-500 via-emerald-400 to-emerald-500"
        />
      </section>

      {/* Points Distribution */}
      <section className="rounded-2xl border border-emerald-600/40 bg-emerald-900/40 p-5 shadow-card">
        <h2 className="text-lg font-bold text-yellow-300 mb-5">توزيع النقاط</h2>
        <div className="space-y-3">
          {buckets.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-sm text-emerald-100/80">{b.label}</span>
              <div className="flex-1 h-7 rounded-lg bg-emerald-950/50 overflow-hidden">
                <div
                  className="h-full rounded-lg bg-gradient-to-r from-yellow-500/80 to-yellow-400/80 flex items-center justify-end pr-2 transition-all duration-700"
                  style={{ width: `${Math.round((b.count / maxBucket) * 100)}%` }}
                >
                  <span className="text-xs font-bold text-emerald-950">{b.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Participants Tab ─────────────────────────────────────────────────────────

function ParticipantsTab({ allParticipants }: { allParticipants: ParticipantDto[] }) {
  const [search, setSearch] = useState('');
  const [cohortFilter, setCohortFilter] = useState<'all' | 'pre_k_k3' | 'k4_k7'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'excluded'>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const filtered = useMemo(() => {
    return allParticipants.filter((p) => {
      const matchSearch = p.name.includes(search) || String(p.id).includes(search);
      const matchCohort = cohortFilter === 'all' || p.cohort === cohortFilter;
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'excluded'
          ? p.excluded_all === 1
          : p.excluded_all === 0;
      return matchSearch && matchCohort && matchStatus;
    });
  }, [allParticipants, search, cohortFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filters change
  useEffect(() => setPage(1), [search, cohortFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <FaMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الرقم..."
            className="w-full rounded-xl border border-emerald-500/40 bg-emerald-950/60 py-2.5 pr-9 pl-3 text-emerald-50 placeholder-emerald-400/40 outline-none focus:border-yellow-400/60 transition text-sm"
          />
        </div>
        <select
          value={cohortFilter}
          onChange={(e) => setCohortFilter(e.target.value as typeof cohortFilter)}
          className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-3 py-2.5 text-sm text-emerald-100 outline-none focus:border-yellow-400/60"
        >
          <option value="all">كل الفئات</option>
          <option value="pre_k_k3">تمهيدي – K3</option>
          <option value="k4_k7">K4 – K7</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-3 py-2.5 text-sm text-emerald-100 outline-none focus:border-yellow-400/60"
        >
          <option value="all">كل الحالات</option>
          <option value="available">متاح</option>
          <option value="excluded">فائز</option>
        </select>
        <span className="flex items-center rounded-xl border border-emerald-600/30 bg-emerald-900/40 px-3 py-2 text-sm text-emerald-300">
          <FaFilter className="ml-1" />
          {filtered.length} نتيجة
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-emerald-600/40 bg-emerald-900/40 shadow-card">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-emerald-600/35 text-yellow-300 text-right">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">الفئة</th>
              <th className="px-4 py-3">النقاط</th>
              <th className="px-4 py-3">الرتبة</th>
              <th className="px-4 py-3">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-emerald-100/50">
                  لا توجد نتائج تطابق البحث
                </td>
              </tr>
            ) : (
              paged.map((p) => (
                <tr key={p.id} className={`border-b border-emerald-700/25 transition hover:bg-emerald-800/20 ${p.excluded_all === 1 ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3 text-emerald-400/70">{p.id}</td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                      p.cohort === 'pre_k_k3'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {p.cohort === 'pre_k_k3' ? 'تمهيدي–K3' : 'K4–K7'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-yellow-200">{p.points}</td>
                  <td className="px-4 py-3 text-emerald-100/80">{p.rank}</td>
                  <td className="px-4 py-3">
                    {p.excluded_all === 1 ? (
                      <span className="flex items-center gap-1.5 text-red-400 text-xs">
                        <FaCircleXmark /> فائز
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                        <FaCircleCheck /> متاح
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          className="rounded-lg border border-emerald-500/45 bg-emerald-900/50 px-4 py-2 disabled:opacity-40 hover:bg-emerald-800/50 transition"
        >السابق</button>
        <span className="text-emerald-100/70">صفحة {page} من {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          className="rounded-lg border border-emerald-500/45 bg-emerald-900/50 px-4 py-2 disabled:opacity-40 hover:bg-emerald-800/50 transition"
        >التالي</button>
      </div>
    </div>
  );
}

// ─── Winners Tab ──────────────────────────────────────────────────────────────

function WinnersTab({
  excludedParticipants,
  onRestore,
}: {
  excludedParticipants: ParticipantDto[];
  onRestore: (id: number) => void;
}) {
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.max(1, Math.ceil(excludedParticipants.length / PAGE_SIZE));
  const paged = excludedParticipants.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-emerald-100/70">
        <FaTrophy className="text-yellow-400" />
        <span>إجمالي الفائزين المستبعدين: <strong className="text-yellow-300">{excludedParticipants.length}</strong></span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-emerald-600/40 bg-emerald-900/40 shadow-card">
        <table className="w-full min-w-[660px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-emerald-600/35 text-yellow-300 text-right">
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">الفئة</th>
              <th className="px-4 py-3">النقاط</th>
              <th className="px-4 py-3">الرتبة</th>
              <th className="px-4 py-3">وقت السحب</th>
              <th className="px-4 py-3">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-emerald-100/50">
                  لا يوجد فائزون مستبعدون حالياً
                </td>
              </tr>
            ) : (
              paged.map((p, idx) => (
                <tr key={p.id} className="border-b border-emerald-700/25 hover:bg-emerald-800/20 transition">
                  <td className="px-4 py-3">
                    <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/20 text-xs font-bold text-yellow-300">
                      {(page - 1) * PAGE_SIZE + idx + 1}
                    </span>
                    {p.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${
                      p.cohort === 'pre_k_k3'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {p.cohort === 'pre_k_k3' ? 'تمهيدي–K3' : 'K4–K7'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-yellow-200">{p.points}</td>
                  <td className="px-4 py-3 text-emerald-100/80">{p.rank}</td>
                  <td className="px-4 py-3 text-emerald-400/70 text-xs">
                    {p.excluded_at ? new Date(p.excluded_at).toLocaleString('ar-IQ') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onRestore(p.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-700/30 px-3 py-1.5 text-xs text-emerald-100 transition hover:bg-emerald-600/40"
                    >
                      <FaTrashArrowUp /> استعادة
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-lg border border-emerald-500/45 bg-emerald-900/50 px-4 py-2 disabled:opacity-40 hover:bg-emerald-800/50 transition">السابق</button>
        <span className="text-emerald-100/70">صفحة {page} من {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-lg border border-emerald-500/45 bg-emerald-900/50 px-4 py-2 disabled:opacity-40 hover:bg-emerald-800/50 transition">التالي</button>
      </div>
    </div>
  );
}

// ─── Controls Tab ─────────────────────────────────────────────────────────────

function ControlsTab({ onRestoreAll, onLogout }: { onRestoreAll: () => void; onLogout: () => void }) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-4 max-w-lg">
      <section className="rounded-2xl border border-emerald-600/40 bg-emerald-900/40 p-6 shadow-card space-y-4">
        <h2 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
          <FaGear /> إعدادات السحب
        </h2>

        <div className="rounded-xl border border-red-500/30 bg-red-900/20 p-4 space-y-3">
          <p className="text-sm text-red-200">
            ⚠️ إعادة تعيين جميع الفائزين ستجعل كل المشاركين متاحين مجدداً للسحب.
          </p>
          {!confirmed ? (
            <button
              onClick={() => setConfirmed(true)}
              className="w-full rounded-xl border border-red-400/40 bg-red-700/30 px-4 py-2.5 text-sm font-bold text-red-200 transition hover:bg-red-700/50"
            >
              استعادة جميع المشاركين
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { onRestoreAll(); setConfirmed(false); }}
                className="flex-1 rounded-xl border border-red-400/60 bg-red-700/50 px-4 py-2.5 text-sm font-bold text-red-100 transition hover:bg-red-600/60"
              >
                <FaArrowsRotate className="inline ml-1" /> تأكيد الاستعادة
              </button>
              <button
                onClick={() => setConfirmed(false)}
                className="rounded-xl border border-emerald-500/40 bg-emerald-900/50 px-4 py-2.5 text-sm text-emerald-300 transition hover:bg-emerald-800/50"
              >
                إلغاء
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-600/40 bg-emerald-900/40 p-6 shadow-card">
        <h2 className="text-lg font-bold text-yellow-300 flex items-center gap-2 mb-4">
          <FaShield /> الجلسة
        </h2>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-4 py-2.5 text-sm text-emerald-100 transition hover:bg-emerald-800/50"
        >
          <FaRotateLeft /> تسجيل الخروج
        </button>
      </section>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'stats', label: 'الإحصائيات', icon: <FaChartColumn /> },
  { id: 'participants', label: 'المشاركون', icon: <FaUsers /> },
  { id: 'winners', label: 'الفائزون', icon: <FaTrophy /> },
  { id: 'controls', label: 'الإعدادات', icon: <FaGear /> },
];

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [tab, setTab] = useState<Tab>('stats');
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [allParticipants, setAllParticipants] = useState<ParticipantDto[]>([]);
  const [excludedParticipants, setExcludedParticipants] = useState<ParticipantDto[]>([]);

  // Check existing session
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1') {
      setAuthenticated(true);
    }
  }, []);

  const refreshData = useCallback(() => {
    const data = getStats();
    setStats(data.stats);
    setExcludedParticipants(data.excludedParticipants);
    setAllParticipants(loadParticipants());
  }, []);

  useEffect(() => {
    if (authenticated) refreshData();
  }, [authenticated, refreshData]);

  const handleRestore = (id: number) => {
    restoreParticipant(id);
    refreshData();
  };

  const handleRestoreAll = () => {
    restoreAllParticipants();
    refreshData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <main className="min-h-screen bg-emerald-950 px-4 py-8 text-emerald-50 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-600/40 bg-emerald-900/50 p-6 shadow-card">
          <div>
            <h1 className="flex items-center gap-3 font-amiri text-3xl text-yellow-300">
              <FaChartPie /> لوحة التحكم — بطاعتي أسمو
            </h1>
            <p className="mt-1 text-sm text-emerald-100/60">إدارة السحب والمشاركين</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-emerald-400/60 hover:text-emerald-300 transition flex items-center gap-1"
          >
            <FaRotateLeft /> خروج
          </button>
        </header>

        {/* Tab Nav */}
        <nav className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                tab === t.id
                  ? 'border-yellow-400/70 bg-yellow-500/20 text-yellow-300'
                  : 'border-emerald-600/35 bg-emerald-900/40 text-emerald-100/80 hover:bg-emerald-800/40'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        {tab === 'stats' && stats && (
          <StatsTab stats={stats} allParticipants={allParticipants} />
        )}
        {tab === 'participants' && (
          <ParticipantsTab allParticipants={allParticipants} />
        )}
        {tab === 'winners' && (
          <WinnersTab excludedParticipants={excludedParticipants} onRestore={handleRestore} />
        )}
        {tab === 'controls' && (
          <ControlsTab onRestoreAll={handleRestoreAll} onLogout={handleLogout} />
        )}
      </div>
    </main>
  );
}
