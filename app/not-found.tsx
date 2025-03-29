import Image from 'next/image';
import Link from 'next/link';
import { FaMoon } from 'react-icons/fa';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="ramadan-pattern"></div>
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <FaMoon className="text-yellow-500 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl mb-6">الصفحة غير موجودة</p>
          <p className="mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
          <Link 
            href="/" 
            className="draw-button inline-flex items-center justify-center"
          >
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
        <div className="text-sm opacity-70 mt-8">
          بطاعتي أسمو - مسابقة رمضانية للأطفال
        </div>
      </div>
    </main>
  );
}
