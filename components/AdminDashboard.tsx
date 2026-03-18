'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaArrowsRotate, FaChartColumn, FaTrashArrowUp } from 'react-icons/fa6';
import { getStats, restoreParticipant, restoreAllParticipants } from '@/lib/participants-store';
import type { ParticipantDto, StatsDto } from '@/lib/types';

const PAGE_SIZE = 10;

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [excludedParticipants, setExcludedParticipants] = useState<ParticipantDto[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const fetchStats = useCallback(() => {
    try {
      const data = getStats();
      setStats(data.stats);
      setExcludedParticipants(data.excludedParticipants);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'تعذر تحميل البيانات.');
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(excludedParticipants.length / PAGE_SIZE)),
    [excludedParticipants.length],
  );

  const pagedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return excludedParticipants.slice(start, start + PAGE_SIZE);
  }, [excludedParticipants, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const restoreOne = (id: number) => {
    setError('');
    try {
      restoreParticipant(id);
      fetchStats();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'تعذر تنفيذ العملية.');
    }
  };

  const restoreAll = () => {
    setError('');
    try {
      restoreAllParticipants();
      fetchStats();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'تعذر تنفيذ العملية.');
    }
  };

  return (
    <main className="min-h-screen bg-emerald-950 px-4 py-8 text-emerald-50 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-emerald-600/40 bg-emerald-900/50 p-6 shadow-card">
          <h1 className="mb-2 flex items-center gap-3 font-amiri text-4xl text-yellow-300">
            <FaChartColumn />
            لوحة التحكم - بطاعتي أسمو
          </h1>
          <p className="text-emerald-100/80">إدارة الفائزين وإعادة إدراج المشاركين في السحب</p>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-400/40 bg-red-900/30 p-4 text-red-200">{error}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard title="إجمالي المشاركين" value={stats?.totalParticipants ?? 0} />
          <StatCard title="إجمالي الفائزين" value={stats?.totalExcluded ?? 0} />
          <StatCard title="المتبقي pre_k_k3" value={stats?.remainingPreKK3 ?? 0} />
          <StatCard title="المتبقي k4_k7" value={stats?.remainingK4K7 ?? 0} />
        </section>

        <section className="rounded-2xl border border-emerald-600/40 bg-emerald-900/40 p-5 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-yellow-300">سجل الفائزين المستبعدين</h2>
            <button
              type="button"
              onClick={restoreAll}
              disabled={excludedParticipants.length === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-yellow-400/50 bg-yellow-500/20 px-4 py-2 font-bold text-yellow-200 transition hover:bg-yellow-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaArrowsRotate />
              استعادة الجميع
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-emerald-600/35 text-yellow-300">
                  <th className="px-3 py-2 text-right">الاسم</th>
                  <th className="px-3 py-2 text-right">المجموعة</th>
                  <th className="px-3 py-2 text-right">النقاط</th>
                  <th className="px-3 py-2 text-right">الرتبة</th>
                  <th className="px-3 py-2 text-right">الحالة</th>
                  <th className="px-3 py-2 text-right">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {pagedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-emerald-100/75">
                      لا يوجد فائزون مستبعدون حالياً.
                    </td>
                  </tr>
                ) : (
                  pagedData.map((participant) => (
                    <tr key={participant.id} className="border-b border-emerald-700/30">
                      <td className="px-3 py-3">{participant.name}</td>
                      <td className="px-3 py-3">{participant.cohort}</td>
                      <td className="px-3 py-3">{participant.points}</td>
                      <td className="px-3 py-3">{participant.rank}</td>
                      <td className="px-3 py-3">{participant.state}</td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => restoreOne(participant.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-700/30 px-3 py-1.5 text-emerald-100 transition hover:bg-emerald-700/50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <FaTrashArrowUp />
                          استعادة
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-emerald-500/45 bg-emerald-900/50 px-3 py-1.5 disabled:opacity-50"
            >
              السابق
            </button>
            <span className="text-emerald-100/80">
              الصفحة {page} من {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-emerald-500/45 bg-emerald-900/50 px-3 py-1.5 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

type StatCardProps = {
  title: string;
  value: number;
};

function StatCard({ title, value }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-emerald-600/40 bg-emerald-900/45 p-4 shadow-card">
      <p className="text-sm text-emerald-100/75">{title}</p>
      <p className="mt-2 text-3xl font-bold text-yellow-300">{value}</p>
    </article>
  );
}
