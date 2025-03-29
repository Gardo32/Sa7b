import { FaMoon } from 'react-icons/fa';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="ramadan-pattern"></div>
      <FaMoon className="text-yellow-500 text-5xl rotate-animation mb-4" />
      <h2 className="text-xl font-bold">جاري التحميل...</h2>
      <p className="mt-2 text-gray-600">يتم تجهيز المحتوى، يرجى الانتظار</p>
    </div>
  );
}
