'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaMoon, FaGift, FaKey, FaStar, FaMosque, FaLandmark } from 'react-icons/fa';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import { getProgramNameArabic, getRankingNameArabic } from '@/lib/utils';
import ArabicName from './components/ArabicName';

// Import ReactConfetti component with dynamic import
const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false,
});

export default function Home() {
  // Use mounted state solely for toggling icon visibility
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, type: 'main' }),
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('main-auth', 'true');
      } else {
        toast.error('كلمة المرور غير صحيحة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء المصادقة');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Check for existing session auth on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('main-auth') === 'true';
      setIsAuthenticated(isAuth);
    }
  });

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="ramadan-pattern"></div>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center">
                <FaMoon className="text-yellow-300 text-6xl" style={{ visibility: mounted ? 'visible' : 'hidden' }} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">بطاعتي أسمو</h1>
            <p className="text-lg opacity-75">مسابقة رمضانية للأطفال</p>
          </div>
          
          <div className="ramadan-card p-8">
            <h2 className="text-xl font-bold mb-4 text-center">تسجيل الدخول</h2>
            <form onSubmit={handleAuth}>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 font-medium">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    className="ramadan-input pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <FaKey className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="draw-button w-full"
                disabled={isAuthenticating}
              >
                {isAuthenticating ? 'جاري التحقق...' : 'دخول'}
              </button>
            </form>
          </div>
          
          <div className="text-center mt-4 text-sm opacity-70">
            <Link href="/admin" className="hover:underline">
              لوحة التحكم
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="ramadan-pattern"></div>
      
      {/* Decorative elements using icons; render only on client */}
      {mounted && (
        <>
          <div className="absolute top-12 left-[10%] text-amber-400 opacity-70">
            <FaMosque className="text-5xl lantern lantern-1" />
          </div>
          <div className="absolute top-20 right-[15%] text-amber-500 opacity-70">
            <FaMosque className="text-5xl lantern lantern-2" />
          </div>
          <div className="absolute top-10 left-[30%] text-amber-600 opacity-70">
            <FaMosque className="text-5xl lantern lantern-3" />
          </div>
        </>
      )}
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="ml-2">بطاعتي أسمو</span>
            <FaMoon className="text-yellow-500" style={{ visibility: mounted ? 'visible' : 'hidden' }} />
          </h1>
          <Link href="/admin" className="text-sm hover:underline flex items-center">
            <span className="ml-1">لوحة التحكم</span>
            <FaKey style={{ visibility: mounted ? 'visible' : 'hidden' }} />
          </Link>
        </div>
        
        <div className="ramadan-card max-w-4xl mx-auto p-8">
          <DrawInterface mounted={mounted} />
        </div>
      </div>
    </main>
  );
}

// Update the component to accept the mounted prop
function DrawInterface({ mounted }: { mounted: boolean }) {
  const [program, setProgram] = useState<'Primary_Program' | 'Secondary_Program'>('Primary_Program');
  const [ranking, setRanking] = useState('First');
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleDraw = async () => {
    setIsDrawing(true);
    setWinner(null);
    
    try {
      const response = await fetch('/api/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ program, ranking }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Simulate drawing animation
        setTimeout(() => {
          if (data.success) {
            setWinner(data.winner);
            setShowConfetti(true);
            
            // Hide confetti after 5 seconds
            setTimeout(() => {
              setShowConfetti(false);
            }, 5000);
          } else {
            toast.error(data.message || 'حدث خطأ أثناء السحب');
          }
          setIsDrawing(false);
        }, 2000);
      } else {
        toast.error(data.message || 'حدث خطأ أثناء السحب');
        setIsDrawing(false);
      }
    } catch (error) {
      console.error('Error during draw:', error);
      toast.error('حدث خطأ في الاتصال بالخادم');
      setIsDrawing(false);
    }
  };

  return (
    <div className="text-center">
      {showConfetti && <Confetti />}
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">سحب الجوائز الرمضانية</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="program" className="block mb-2 font-medium text-right">
              البرنامج
            </label>
            <select
              id="program"
              className="ramadan-input ramadan-select"
              value={program}
              onChange={(e) => setProgram(e.target.value as 'Primary_Program' | 'Secondary_Program')}
              disabled={isDrawing}
            >
              <option value="Primary_Program">البرنامج الابتدائي</option>
              <option value="Secondary_Program">البرنامج الإعدادي</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="ranking" className="block mb-2 font-medium text-right">
              الجائزة
            </label>
            <select
              id="ranking"
              className="ramadan-input ramadan-select"
              value={ranking}
              onChange={(e) => setRanking(e.target.value)}
              disabled={isDrawing}
            >
              <option value="First">الجائزة الأولى</option>
              <option value="Second">الجائزة الثانية</option>
              <option value="Third">الجائزة الثالثة</option>
              <option value="Fourth">الجائزة الرابعة</option>
              <option value="Fifth">الجائزة الخامسة</option>
            </select>
          </div>
        </div>
        
        <button
          className="draw-button mx-auto text-2xl px-8 py-4"
          onClick={handleDraw}
          disabled={isDrawing}
        >
          {isDrawing ? (
            <>
              <span className="rotate-animation inline-block">🎲</span>
              <span>جاري السحب...</span>
            </>
          ) : (
            <>
              <FaGift className="mr-2" style={{ visibility: mounted ? 'visible' : 'hidden' }} />
              <span>اختيار الفائز</span>
            </>
          )}
        </button>
      </div>
      
      {winner && (
        <div className="mt-8 appear-animation">
          <div className="p-6 bg-gradient-to-r from-green-50 to-purple-50 rounded-xl shadow-lg">
            <h3 className="text-xl mb-2">مبارك للفائز بالجائزة</h3>
            <p className="celebration-text mb-4">
              <ArabicName name={winner.participant_name} />
            </p>
            <div className="grid grid-cols-2 gap-4 text-right">
              <div>
                <p className="text-sm text-gray-600">المجموعة:</p>
                <p className="font-semibold">{winner.group_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">النقاط:</p>
                <p className="font-semibold">{winner.score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">رقم المشارك:</p>
                <p className="font-semibold">{winner.participant_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الجائزة:</p>
                <p className="font-semibold">{getProgramNameArabic(program)} - {getRankingNameArabic(ranking)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Confetti() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ReactConfetti
      width={windowSize.width}
      height={windowSize.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.1}
      colors={['#4caf50', '#8e24aa', '#ff9800', '#ffeb3b', '#f44336']}
    />
  );
}
