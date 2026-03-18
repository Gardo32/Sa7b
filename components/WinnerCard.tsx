import { FaStarAndCrescent, FaXmark } from 'react-icons/fa6';
import type { ParticipantDto } from '@/lib/types';
import GiftBox from './GiftBox';

type WinnerCardProps = {
  winner: ParticipantDto;
  onClose?: () => void;
};

export default function WinnerCard({ winner, onClose }: WinnerCardProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-2 sm:px-4 backdrop-blur-md animate-in fade-in duration-500">
      <section className="relative w-[76vw] md:w-[72vw] max-w-[960px] h-[68vh] md:h-[64vh] max-h-[640px] overflow-visible flex flex-col items-center justify-center zoom-in-50 animate-in duration-700">
        {/* Gift Box Animation */}
        <div className="absolute top-[-100px] z-20 flex justify-center">
          <GiftBox isOpen={true} />
        </div>

        {/* Winner Details Card */}
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[3rem] border-4 border-yellow-400/50 bg-gradient-to-br from-emerald-900/95 via-emerald-800/90 to-emerald-950/95 p-10 shadow-card">
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-20 rounded-full bg-black/20 p-4 text-2xl text-emerald-100 transition hover:bg-black/40 hover:text-white"
            >
              <FaXmark />
            </button>
          )}

          <div className="pointer-events-none absolute inset-0 animate-pulseGlow rounded-[3rem]" />

          <div className="relative z-10 flex w-full h-full flex-col items-center justify-center space-y-8 md:space-y-12 py-8">
            <h2 className="flex items-center justify-center gap-4 text-center font-amiri text-4xl text-yellow-300 md:text-6xl lg:text-7xl">
              <FaStarAndCrescent className="text-yellow-400 shrink-0" />
              الفائز المحظوظ
              <FaStarAndCrescent className="text-yellow-400 shrink-0" />
            </h2>

            <div className="w-full flex-1 flex items-center justify-center rounded-3xl border-2 border-yellow-500/30 bg-black/25 p-6 md:p-12 text-center shadow-inner overflow-hidden">
              <p className="font-amiri text-[10vw] sm:text-[8vw] md:text-[6.5vw] lg:text-[5.5vw] xl:text-[5vw] leading-tight text-yellow-200 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">
                {winner.name}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
