'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { 
  FaMoon, 
  FaUser, 
  FaUsers, 
  FaKey, 
  FaTrash, 
  FaUndo, 
  FaFileExport, 
  FaSearch,
  FaChartPie,
  FaMosque,
  FaGift  // <-- Added missing import
} from 'react-icons/fa';
import { formatDate, getProgramNameArabic, getRankingNameArabic } from '@/lib/utils';
import ArabicName from '../components/ArabicName';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState('selected');
  const [program, setProgram] = useState<'Primary_Program' | 'Secondary_Program'>('Primary_Program');
  const [ranking, setRanking] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const [unselectedParticipants, setUnselectedParticipants] = useState<any[]>([]);
  const [currentWinner, setCurrentWinner] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, type: 'admin' }),
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin-auth', 'true');
      } else {
        toast.error('كلمة المرور غير صحيحة');
      }
    } catch (error) {
      toast.error('حدث خطأ أثناء المصادقة');
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('admin-auth') === 'true';
      setIsAuthenticated(isAuth);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, program, ranking, activeTab]);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      // Fetch selected participants
      if (activeTab === 'selected' || activeTab === 'current') {
        const selectedResponse = await fetch(`/api/participants?program=${program}&selected=true${ranking ? `&ranking=${ranking}` : ''}`);
        if (selectedResponse.ok) {
          const data = await selectedResponse.json();
          setSelectedParticipants(data);
          
          // Set current winner to the most recently selected participant
          if (data.length > 0) {
            setCurrentWinner(data[0]);
          } else {
            setCurrentWinner(null);
          }
        }
      }
      
      // Fetch unselected participants
      if (activeTab === 'unselected') {
        // Remove default ranking so that all rows load when ranking is empty
        const unselectedResponse = await fetch(`/api/participants?program=${program}&selected=false${ranking ? `&ranking=${ranking}` : ''}`);
        if (unselectedResponse.ok) {
          const data = await unselectedResponse.json();
          setUnselectedParticipants(data);
        }
      }
      
      // Fetch stats
      if (activeTab === 'stats') {
        const statsResponse = await fetch(`/api/stats?program=${program}`);
        if (statsResponse.ok) {
          const data = await statsResponse.json();
          setStats(data);
        }
      }
    } catch (error) {
      toast.error('حدث خطأ في جلب البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectParticipant = async (id: number) => {
    try {
      const response = await fetch('/api/participants/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ program, id }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`تم اختيار ${data.participant.participant_name} بنجاح`);
        fetchData();
      } else {
        toast.error('حدث خطأ أثناء اختيار المشارك');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال بالخادم');
    }
  };

  const handleUnselectParticipant = async (id: number) => {
    try {
      const response = await fetch('/api/participants/unselect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ program, id }),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success(`تم إلغاء اختيار ${data.participant.participant_name} بنجاح`);
        fetchData();
      } else {
        toast.error('حدث خطأ أثناء إلغاء اختيار المشارك');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال بالخادم');
    }
  };

  const handleResetSelections = async () => {
    if (!confirm('هل أنت متأكد من رغبتك في إعادة تعيين جميع الاختيارات؟')) {
      return;
    }
    
    try {
      const response = await fetch('/api/participants/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ program }),
      });
      
      if (response.ok) {
        toast.success('تم إعادة تعيين جميع الاختيارات بنجاح');
        fetchData();
      } else {
        toast.error('حدث خطأ أثناء إعادة التعيين');
      }
    } catch (error) {
      toast.error('حدث خطأ في الاتصال بالخادم');
    }
  };

  const handleExport = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add header
    csvContent += "الاسم,المجموعة,النقاط,الترتيب,رقم المشارك,تاريخ الاختيار\n";
    
    // Add data rows
    selectedParticipants.forEach(participant => {
      const row = [
        participant.participant_name,
        participant.group_name,
        participant.score,
        getRankingNameArabic(participant.ranking),
        participant.participant_number,
        formatDate(participant.selection_date)
      ].join(",");
      csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `فائزين-${getProgramNameArabic(program)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter participants based on search term
  const filteredSelected = selectedParticipants.filter(p => 
    p.participant_name.includes(searchTerm) || 
    p.group_name.includes(searchTerm) ||
    String(p.participant_number).includes(searchTerm)
  );
  
  const filteredUnselected = unselectedParticipants.filter(p => 
    p.participant_name.includes(searchTerm) || 
    p.group_name.includes(searchTerm) ||
    String(p.participant_number).includes(searchTerm)
  );

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="ramadan-pattern"></div>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-purple-600 flex items-center justify-center">
                <FaMoon className="text-yellow-300 text-6xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
            <p className="text-lg opacity-75">بطاعتي أسمو</p>
          </div>
          
          <div className="ramadan-card p-8">
            <h2 className="text-xl font-bold mb-4 text-center">تسجيل الدخول للمشرف</h2>
            <form onSubmit={handleAuth}>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-2 font-medium">
                  كلمة مرور المشرف
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
            <Link href="/" className="hover:underline">
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-12">
      <div className="ramadan-pattern"></div>
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-2xl font-bold flex items-center">
              <span className="ml-2">لوحة تحكم بطاعتي أسمو</span>
              <FaMoon className="text-yellow-500" />
            </h1>
          </div>
          <div className="flex space-x-4 items-center">
            <Link href="/" className="text-sm hover:underline mr-4">
              العودة للصفحة الرئيسية
            </Link>
            
            <button
              onClick={handleResetSelections}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
              title="إعادة تعيين جميع الاختيارات"
            >
              <FaTrash className="ml-1" />
              <span>إعادة تعيين</span>
            </button>
            
            <button
              onClick={handleExport}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
              title="تصدير القائمة"
              disabled={selectedParticipants.length === 0}
            >
              <FaFileExport className="ml-1" />
              <span>تصدير</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-2">
            <select
              className="ramadan-input ramadan-select"
              value={program}
              onChange={(e) => setProgram(e.target.value as 'Primary_Program' | 'Secondary_Program')}
            >
              <option value="Primary_Program">البرنامج الابتدائي</option>
              <option value="Secondary_Program">البرنامج الإعدادي</option>
            </select>
          </div>
          {activeTab !== 'stats' && (
            <div className="md:col-span-2">
              <select
                className="ramadan-input ramadan-select"
                value={ranking}
                onChange={(e) => setRanking(e.target.value)}
              >
                <option value="">جميع الجوائز</option>
                <option value="First">الجائزة الأولى</option>
                <option value="Second">الجائزة الثانية</option>
                <option value="Third">الجائزة الثالثة</option>
                <option value="Fourth">الجائزة الرابعة</option>
                <option value="Fifth">الجائزة الخامسة</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`py-3 px-4 font-medium ${activeTab === 'current' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('current')}
          >
            <FaUser className="inline ml-1" />
            الفائز الحالي
          </button>
          <button
            className={`py-3 px-4 font-medium ${activeTab === 'selected' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('selected')}
          >
            <FaUsers className="inline ml-1" />
            الفائزون
          </button>
          <button
            className={`py-3 px-4 font-medium ${activeTab === 'unselected' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('unselected')}
          >
            <FaUsers className="inline ml-1" />
            المشاركون المتاحون
          </button>
          <button
            className={`py-3 px-4 font-medium ${activeTab === 'stats' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('stats')}
          >
            <FaChartPie className="inline ml-1" />
            الإحصائيات
          </button>
        </div>
        
        {/* Search Bar (for participant lists) */}
        {(activeTab === 'selected' || activeTab === 'unselected') && (
          <div className="mb-4 relative">
            <input
              type="text"
              className="ramadan-input pl-10"
              placeholder="بحث عن مشارك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          </div>
        )}
        
        {/* Content based on active tab */}
        <div className="ramadan-card p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="rotate-animation inline-block text-3xl mb-4">🔄</div>
              <p>جاري تحميل البيانات...</p>
            </div>
          ) : (
            <>
              {/* Current Winner Tab */}
              {activeTab === 'current' && (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-center">الفائز الحالي</h2>
                  
                  {currentWinner ? (
                    <div className="p-6 bg-gradient-to-r from-green-50 to-purple-50 rounded-xl shadow-lg">
                      <p className="celebration-text mb-4 text-center">
                        <ArabicName name={currentWinner.participant_name} />
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-right">
                        <div>
                          <p className="text-sm text-gray-600">المجموعة:</p>
                          <p className="font-semibold">{currentWinner.group_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">النقاط:</p>
                          <p className="font-semibold">{currentWinner.score}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">رقم المشارك:</p>
                          <p className="font-semibold">{currentWinner.participant_number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">الجائزة:</p>
                          <p className="font-semibold">{getRankingNameArabic(currentWinner.ranking)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">تاريخ الاختيار:</p>
                          <p className="font-semibold">{formatDate(currentWinner.selection_date)}</p>
                        </div>
                        <div>
                          <button
                            onClick={() => handleUnselectParticipant(currentWinner.id)}
                            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
                          >
                            <FaUndo className="ml-1" />
                            <span>إلغاء الاختيار</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p>لم يتم اختيار أي فائز بعد</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Selected Participants Tab */}
              {activeTab === 'selected' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">قائمة الفائزين ({filteredSelected.length})</h2>
                  
                  {filteredSelected.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المجموعة</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النقاط</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الجائزة</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم المشارك</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الاختيار</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredSelected.map((participant) => (
                            <tr key={participant.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <ArabicName name={participant.participant_name} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{participant.group_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{participant.score}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{getRankingNameArabic(participant.ranking)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{participant.participant_number}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{formatDate(participant.selection_date)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleUnselectParticipant(participant.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="إلغاء الاختيار"
                                >
                                  <FaUndo />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p>لا يوجد فائزين حتى الآن</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Unselected Participants Tab */}
              {activeTab === 'unselected' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">قائمة المشاركين المتاحين ({filteredUnselected.length})</h2>
                  
                  {filteredUnselected.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المجموعة</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النقاط</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم المشارك</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUnselected.map((participant) => (
                            <tr key={participant.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <ArabicName name={participant.participant_name} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{participant.group_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{participant.score}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{participant.participant_number}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleSelectParticipant(participant.id)}
                                  className="text-green-600 hover:text-green-900"
                                  title="اختيار كفائز"
                                >
                                  <FaGift />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p>لا يوجد مشاركين متاحين حاليًا</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">إحصائيات المجموعات</h2>
                  
                  {stats.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المجموعة</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">العدد الكلي</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تم اختيارهم</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">النسبة المئوية</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {stats.map((stat, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">{stat.group_name}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{stat.total}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{stat.selected}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className="bg-blue-600 h-2.5 rounded-full" 
                                      style={{ width: `${stat.percentage}%` }}
                                    ></div>
                                  </div>
                                  <span className="mr-2">{stat.percentage}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p>لا توجد إحصائيات متاحة</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
