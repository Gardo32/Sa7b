'use client';

import { useEffect, useMemo, useState } from 'react';
import Confetti from 'react-confetti';
import { FaGift, FaMoon, FaStar, FaWandMagicSparkles } from 'react-icons/fa6';
import WinnerCard from '@/components/WinnerCard';
import { drawWinner as pickWinner } from '@/lib/participants-store';
import type { DrawMode, ParticipantDto } from '@/lib/types';

const spinNames = [
  '... جاري السحب ...',
  'نور علي',
  'حيدر محمد',
  'فاطمة حسن',
  'عباس جواد',
  'زهراء كريم',
  'محمد رضا',
  'بتول عباس',
];

const modeOptions: { value: DrawMode; label: string }[] = [
  { value: 'all', label: 'كل المشاركين' },
  { value: 'pre_k_k3', label: 'من التمهيدي إلى K3' },
  { value: 'k4_k7', label: 'من K4 إلى K7' },
];

export default function DrawInterface() {
  const [mode, setMode] = useState<DrawMode>('all');
  const [winner, setWinner] = useState<ParticipantDto | null>(null);
  const [error, setError] = useState<string>('');
  const [rollingName, setRollingName] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (!isDrawing) return;

    let i = 0;
    const interval = setInterval(() => {
      setRollingName(spinNames[i % spinNames.length]);
      i += 1;
    }, 60);

    return () => clearInterval(interval);
  }, [isDrawing]);

  const selectedModeLabel = useMemo(
    () => modeOptions.find((item) => item.value === mode)?.label ?? 'كل المشاركين',
    [mode],
  );

  const handleDraw = () => {
    setError('');
    setWinner(null);
    setShowConfetti(false);
    setIsDrawing(true);

    // Simulate suspense delay, then pick a winner client-side
    setTimeout(() => {
      const result = pickWinner(mode);

      if (!result) {
        setRollingName('');
        setIsDrawing(false);
        setError('لا يوجد مشاركون متبقون في هذه الفئة.');
        return;
      }

      setRollingName('');
      setIsDrawing(false);
      setWinner(result);
      setShowConfetti(true);

      setTimeout(() => setShowConfetti(false), 8000);
    }, 4800);
  };

  return (
    <main className="ramadan-shell relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      {showConfetti ? <Confetti width={size.width} height={size.height} recycle={false} numberOfPieces={800} gravity={0.15} initialVelocityY={20} /> : null}

      <div className="pattern-overlay pointer-events-none absolute inset-0" />

      <section className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl border border-emerald-500/40 bg-emerald-900/35 p-6 shadow-card backdrop-blur-lg md:p-10">
        <h1 className="mb-3 text-center font-amiri text-4xl text-yellow-300 md:text-5xl">سحب بطاعتي أسمو</h1>
        <p className="mb-7 text-center text-sm text-emerald-100/85 md:text-base">
          اختر الفئة ثم ابدأ السحب المباشر في أجواء رمضانية مميزة
        </p>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {modeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              disabled={isDrawing}
              className={`rounded-xl border px-3 py-2 text-sm transition md:text-base ${
                mode === option.value
                  ? 'border-yellow-400 bg-yellow-500/20 text-yellow-300'
                  : 'border-emerald-500/45 bg-emerald-950/50 text-emerald-100 hover:bg-emerald-800/45'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mb-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-center text-sm text-emerald-100/80">
          فئة السحب الحالية: <span className="font-bold text-yellow-300">{selectedModeLabel}</span>
        </div>

        <button
          type="button"
          disabled={isDrawing}
          onClick={handleDraw}
          className="gold-shimmer mx-auto flex w-full max-w-md items-center justify-center gap-3 rounded-2xl border border-yellow-300/70 px-6 py-5 text-2xl font-bold text-emerald-950 shadow-glow transition hover:scale-[1.02] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaGift />
          اسحب الآن
          <FaWandMagicSparkles />
        </button>

        {isDrawing ? (
          <div className="mt-7 rounded-2xl border border-yellow-500/40 bg-black/30 p-6 text-center">
            <p className="mb-2 flex items-center justify-center gap-2 text-yellow-300">
              <FaMoon className="animate-pulse" />
              لحظات حماسية... جارِ اختيار الفائز
            </p>
            <p className="animate-pulse text-3xl font-bold text-emerald-100">{rollingName}</p>
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-xl border border-red-400/35 bg-red-900/30 p-4 text-center text-red-200">{error}</div>
        ) : null}

        {winner ? <WinnerCard winner={winner} onClose={() => setWinner(null)} /> : null}

        {!winner && !error && !isDrawing ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-emerald-100/70">
            <FaStar className="text-yellow-400" />
            السحب يستبعد الفائز مباشرة لمنع تكرار اسمه
          </div>
        ) : null}
      </section>
    </main>
  );
}
