import React, { useMemo, useState, useEffect } from 'react';
import {
  ActiveModuleTab,
  Commitment,
  Customer,
  CustomerVisitRecord,
  DebtCommitment,
  DebtRecord,
  DoctorRecord,
  DoctorVisitLog,
  FinancialTransaction,
  Item,
  Movement,
  Task,
} from '../../types';
import { calculateFinancialSummary } from '../../utils/financial';
import { calculateTaskStats } from '../../utils/tasks';
import { calculateCustomerStats, getTodayArabicDay } from '../../utils/customers';
import { calculateDoctorStats } from '../../utils/doctors';
import { calculateDebtStats } from '../../utils/debts';
import { loadNotes, loadRoutines, loadCustodyIssues, loadLinksRecords } from '../../utils/storage';
import { getCurrentUserProfile, SETTINGS_UPDATED_EVENT } from '../../utils/settingsStorage';
import { formatCurrency } from '../../utils/formatters';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { DashboardCharts } from './DashboardCharts';
import {
  Wallet,
  Package,
  CheckSquare,
  Users,
  Stethoscope,
  Coins,
  BookOpen,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  Flame,
  Globe,
  Kanban,
  Zap,
  ShoppingCart,
  BarChart2,
  Plus,
} from 'lucide-react';

interface Props {
  items: Item[];
  movements: Movement[];
  financialTransactions: FinancialTransaction[];
  tasks: Task[];
  commitments: Commitment[];
  customers?: Customer[];
  visits?: CustomerVisitRecord[];
  doctors?: DoctorRecord[];
  doctorVisits?: DoctorVisitLog[];
  debts?: DebtRecord[];
  debtCommitments?: DebtCommitment[];
  onNavigateTab: (tab: ActiveModuleTab) => void;
}

const LiveClock: React.FC = React.memo(() => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const day = now.toLocaleDateString('ar-YE', { weekday: 'long', day: 'numeric', month: 'long' });
      const time = now.toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      setTimeStr(`${day} • ${time}`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return <span className="font-mono">{timeStr || 'الثلاثاء، 8 سبتمبر • 12:16:26 م'}</span>;
});

export const UnifiedDashboard: React.FC<Props> = ({
  items,
  movements,
  financialTransactions,
  tasks = [],
  commitments = [],
  customers = [],
  visits = [],
  doctors = [],
  doctorVisits = [],
  debts = [],
  debtCommitments = [],
  onNavigateTab,
}) => {
  // Financial metrics
  const finSummary = useMemo(() => calculateFinancialSummary(financialTransactions), [financialTransactions]);

  // Task metrics
  const taskStats = useMemo(() => calculateTaskStats(tasks || [], commitments || []), [tasks, commitments]);

  // Customer & Visits metrics
  const customerStats = useMemo(() => calculateCustomerStats(customers, visits), [customers, visits]);
  const doctorStats = useMemo(() => calculateDoctorStats(doctors, doctorVisits), [doctors, doctorVisits]);
  const debtStats = useMemo(() => calculateDebtStats(debts, debtCommitments), [debts, debtCommitments]);
  const todayArabic = getTodayArabicDay();

  // Stock metrics
  const stockStats = useMemo(() => {
    let totalItems = items.length;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalQty = 0;

    items.forEach((it) => {
      totalQty += it.currentStock;
      if (it.currentStock <= 0) outOfStockCount++;
      else if (it.currentStock <= it.minLimit) lowStockCount++;
    });

    return {
      totalItems,
      totalQty,
      lowStockCount,
      outOfStockCount,
      movementsCount: movements.length,
    };
  }, [items, movements]);

  // Recent combined operations
  const recentMovements = useMemo(() => movements.slice(0, 4), [movements]);
  const recentFinancial = useMemo(() => financialTransactions.slice(0, 4), [financialTransactions]);
  const urgentTasks = useMemo(() => (tasks || []).filter((t) => t && t.pri === 'A' && t.status !== 'تم الانجاز').slice(0, 4), [tasks]);
  const todayCustomerVisits = useMemo(
    () => (customers || []).filter((c) => c && c.route === todayArabic).slice(0, 3),
    [customers, todayArabic]
  );
  const todayDoctorVisits = useMemo(
    () => (doctors || []).filter((d) => d && d.route === todayArabic).slice(0, 3),
    [doctors, todayArabic]
  );

  const [userProfile, setUserProfile] = useState(() => getCurrentUserProfile());

  useEffect(() => {
    const handleSettingsUpdate = () => {
      setUserProfile(getCurrentUserProfile());
    };
    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdate);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top View Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            لوحة التحكم
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1.5">
            <span>أهلاً بك، {userProfile.name} 👋</span>
            <span>—</span>
            <LiveClock />
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('financial')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d6854] hover:bg-[#095041] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>طلب جديد</span>
        </button>
      </div>

      {/* 4 Nova ERP Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up">
        {/* Card 1: إيرادات هذا الشهر */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              إيرادات هذا الشهر
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#e6f7f0] dark:bg-emerald-950/50 text-[#10b981] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              <AnimatedCounter value={25915} formatter={(v) => (v || 0).toLocaleString('ar-YE')} />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#e6f8f0] dark:bg-emerald-950/60 text-[#059669] dark:text-emerald-300 text-[11px] font-bold">
                <span>▲</span>
                <span>664% مقابل الشهر السابق</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: طلبات هذا الشهر */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              طلبات هذا الشهر
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] dark:bg-sky-950/50 text-[#0ea5e9] flex items-center justify-center shrink-0">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              <AnimatedCounter value={4} />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              من إجمالي 15 طلباً
            </div>
          </div>
        </div>

        {/* Card 3: متوسط قيمة الطلب */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              متوسط قيمة الطلب
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#fef3c7] dark:bg-amber-950/50 text-[#d97706] flex items-center justify-center shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              <AnimatedCounter value={6479} formatter={(v) => (v || 0).toLocaleString('ar-YE')} />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              بالعملة: ر.س
            </div>
          </div>
        </div>

        {/* Card 4: تنبيهات المخزون */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              تنبيهات المخزون
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#ffe4e6] dark:bg-rose-950/50 text-[#e11d48] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              <AnimatedCounter value={4} />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              منتجات وصلت حد الطلب
            </div>
          </div>
        </div>
      </div>

      {/* 2 Charts matching screenshot: Donut chart and Revenue curve */}
      <DashboardCharts
        financialTransactions={financialTransactions}
        items={items}
        tasks={tasks}
        customers={customers}
        doctors={doctors}
      />
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/70 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-lg border border-teal-500/20 relative overflow-hidden animate-fade-in-up stagger-1">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 backdrop-blur-md text-xs font-bold text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>المنظومة المحاسبية والإدارية وشبكة العملاء وزيارات الأطباء المتكاملة</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            نظام الإدارة الشاملة للمؤسسة والأنشطة التجارية والطبية
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
            الربط المتكامل بين السجل المالي اليومي، دفتر صرف وتوريد الأصناف والمخزون، دفتر المهام والأعمال والخطط، دفتر إدارة شبكة العملاء، ودفتر خطط وزيارات الأطباء الميدانية.
          </p>

          {/* Key Quick Counters Pill Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2 text-xs">
              <span className="text-slate-300 font-medium">صافي السيولة:</span>
              <span className="font-mono font-bold text-teal-300">
                <AnimatedCounter value={finSummary.netBalance} formatter={formatCurrency} /> ريال
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2 text-xs">
              <span className="text-slate-300 font-medium">إنجاز المهام:</span>
              <span className="font-mono font-bold text-teal-300">
                <AnimatedCounter value={taskStats.completionRate} />%
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2 text-xs">
              <span className="text-slate-300 font-medium">شبكة العملاء:</span>
              <span className="font-mono font-bold text-amber-300">
                <AnimatedCounter value={customers.length} /> عميل
              </span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex items-center gap-2 text-xs">
              <span className="text-slate-300 font-medium">شبكة الأطباء:</span>
              <span className="font-mono font-bold text-sky-300">
                <AnimatedCounter value={doctors.length} /> طبيب
              </span>
            </div>
          </div>
        </div>

        <div className="absolute left-6 bottom-6 opacity-10 hidden lg:block text-teal-400">
          <Building2 className="w-48 h-48" />
        </div>
      </div>

      {/* Main Module Hub Cards (Ordered 2 to 12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 animate-fade-in-up stagger-2">
        {/* Module 2: Financial Ledger (ادارة السجل اليومي) */}
        <div
          onClick={() => onNavigateTab('financial')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-teal-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50">
                  2
                </span>
                <div className="p-2 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full font-mono border border-teal-200/50 dark:border-teal-800/50">
                <AnimatedCounter value={financialTransactions.length} /> حركة
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                ادارة السجل اليومي
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                سندات القبض والصرف، المقبوضات والمدفوعات والصناديق والتدفقات
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">صافي السيولة:</span>
              <span className="text-xs font-black font-mono text-teal-600 dark:text-teal-400">
                <AnimatedCounter value={finSummary.netBalance} formatter={formatCurrency} />
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
            <span>فتح السجل اليومي</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 3: Debts & Commitments (ادارة الديون والالتزامات) */}
        <div
          onClick={() => onNavigateTab('debts')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-amber-200/60 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-amber-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50">
                  3
                </span>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full font-mono border border-amber-200/50 dark:border-amber-800/50">
                <AnimatedCounter value={debts.length + debtCommitments.length} /> سجل
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                ادارة الديون والالتزامات
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                دفاتر أنور، زها، علي القات وسجل الأقساط والاستحقاقات
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">المتبقي:</span>
              <span className="text-xs font-black font-mono text-rose-600 dark:text-rose-400">
                <AnimatedCounter value={debtStats.totalCommitmentsRemaining} formatter={formatCurrency} />
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
            <span>فتح الديون والالتزامات</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 4: Stock Ledger (ادارة صرف وتوريد) */}
        <div
          onClick={() => onNavigateTab('stock')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50">
                  4
                </span>
                <div className="p-2 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full font-mono border border-sky-200/50 dark:border-sky-800/50">
                <AnimatedCounter value={items.length} /> صنف
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                ادارة صرف وتوريد
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                حركة المخزون، فواتير التوريد والصرف وتنبيهات النواقص
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">الأصناف الحرجة:</span>
              <span className={`text-xs font-bold ${stockStats.lowStockCount + stockStats.outOfStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {stockStats.lowStockCount + stockStats.outOfStockCount} صنف
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-400">
            <span>فتح الصرف والتوريد</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Unified Module: Work OS, Projects & Tasks (منظومة إدارة العمل والمشاريع والمهام) */}
        <div
          onClick={() => onNavigateTab('workos')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-teal-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-teal-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between md:col-span-2 lg:col-span-2"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50">
                  5
                </span>
                <div className="p-2 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 rounded-xl group-hover:bg-teal-700 group-hover:text-white transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full font-mono border border-teal-200/50 dark:border-teal-800/50">
                  Work OS • الموحد
                </span>
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full font-mono border border-rose-200/50 dark:border-rose-800/50">
                  <AnimatedCounter value={taskStats.completionRate} />% إنجاز
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                  منظومة إدارة العمل والمشاريع والمهام (Work OS)
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  مدمج بالكامل
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                نظام تشغيلي متكامل يدمج إدارة المشاريع، لوحات كانبان التفاعلية، مخططات Gantt، مصفوفة المهام، والروتين اليومي في بيئة واحدة
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">إجمالي المهام:</span>
                <span className="text-xs font-black font-mono text-slate-900 dark:text-slate-100">
                  <AnimatedCounter value={taskStats.totalTasks} /> مهمة
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">منظومة المشاريع:</span>
                <span className="text-xs font-black font-mono text-purple-700 dark:text-purple-300">
                  Kanban & Gantt
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">الالتزامات المعلقة:</span>
                <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">
                  <AnimatedCounter value={taskStats.outstandingCommitmentsAmount} formatter={formatCurrency} />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-teal-800 dark:text-teal-400">
            <span>دخول منظومة العمل والمشاريع الموحدة</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 7: Customers & Visits (ادارة العملاء وزيارات) */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-teal-200/60 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-teal-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50">
                  7
                </span>
                <div className="p-2 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full font-mono border border-teal-200/50 dark:border-teal-800/50">
                <AnimatedCounter value={customers.length} /> عميل
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                ادارة العملاء وزيارات
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                شبكة العملاء، مسارات الزيارات والأرصدة والمديونيات
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">المديونيات:</span>
              <span className="text-xs font-black font-mono text-rose-600 dark:text-rose-400">
                <AnimatedCounter value={customerStats.totalDebtYER} formatter={formatCurrency} />
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-teal-700 dark:text-teal-400">
            <span>فتح العملاء والزيارات</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 8: Doctor Visits (ادارة الاطباء وزيارات) */}
        <div
          onClick={() => onNavigateTab('doctors')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-sky-200/60 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200/50 dark:border-sky-800/50">
                  8
                </span>
                <div className="p-2 bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 rounded-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                  <Stethoscope className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full font-mono border border-sky-200/50 dark:border-sky-800/50">
                <AnimatedCounter value={doctors.length} /> طبيب
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                ادارة الاطباء وزيارات
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                دليل الأطباء والعيادات، المسارات الميدانية وتقارير الزيارات
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">مسار اليوم ({todayArabic}):</span>
              <span className="text-xs font-black font-mono text-sky-600 dark:text-sky-400">
                <AnimatedCounter value={doctorStats.todayDoctorsCount} /> طبيب
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-400">
            <span>فتح الاطباء والزيارات</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 9: Routines & Habits (ادارة الروتين والعادات) */}
        <div
          onClick={() => onNavigateTab('routines')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-amber-200/60 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-amber-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50">
                  9
                </span>
                <div className="p-2 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full font-mono border border-amber-200/50 dark:border-amber-800/50">
                <AnimatedCounter value={loadRoutines().length} /> روتين
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                ادارة الروتين والعادات
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                جدول الأنشطة المتكررة، جلسات التركيز الموقوتة، وسلاسل الإنجاز
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">الحالة:</span>
              <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">
                مؤقتات وجدولة نشطة
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
            <span>فتح الروتين والعادات</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 10: Knowledge & Notes (ادارة الملاحظات) */}
        <div
          onClick={() => onNavigateTab('knowledge')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-purple-200/60 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-purple-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/50">
                  10
                </span>
                <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full font-mono border border-purple-200/50 dark:border-purple-800/50">
                <AnimatedCounter value={((loadNotes() || []).filter((n) => n && !n.isDeleted)).length} /> ملاحظة
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                ادارة الملاحظات
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                توثيق المعرفة، التدوين الفوري، ومحاضر الاجتماعات والمسودات
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">الحالة:</span>
              <span className="text-xs font-black text-purple-600 dark:text-purple-400">
                ملاحظات نشطة
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400">
            <span>فتح الملاحظات</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 11: Custody & Issues (ادارة العهد والاشكاليات) */}
        <div
          onClick={() => onNavigateTab('custody')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-rose-200/60 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-rose-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50">
                  11
                </span>
                <div className="p-2 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full font-mono border border-rose-200/50 dark:border-rose-800/50">
                <AnimatedCounter value={loadCustodyIssues().length} /> سجل
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                ادارة العهد والاشكاليات
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                العهد المالية، حسابات (له/عليه)، وإقفال إشكاليات المرتجعات وفروقات الجرد
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">حالة العهد:</span>
              <span className="text-xs font-black font-mono text-rose-600 dark:text-rose-400">
                متابعة وإقفال فوري
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
            <span>فتح العهد والاشكاليات</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Module 12: Smart Links Library (مكتبة الروابط) */}
        <div
          onClick={() => onNavigateTab('links')}
          className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-4.5 rounded-2xl border border-violet-200/60 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-violet-500/80 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 flex items-center justify-center text-[10px] font-mono font-bold rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50">
                  12
                </span>
                <div className="p-2 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 rounded-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                  <Globe className="w-4 h-4" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-full font-mono border border-violet-200/50 dark:border-violet-800/50">
                <AnimatedCounter value={loadLinksRecords().length} /> رابط
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                مكتبة الروابط
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                فهرس أدوات الذكاء الاصطناعي، الأوفيس والإكسل، محركات البحث، والمصادر
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">حالة الفهرس:</span>
              <span className="text-xs font-black font-mono text-violet-600 dark:text-violet-400">
                روابط موثقة
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center justify-between text-xs font-bold text-violet-700 dark:text-violet-400">
            <span>فتح مكتبة الروابط</span>
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Comprehensive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up stagger-3">
        {/* Total Financial Receipts */}
        <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 shrink-0 border border-teal-200/40 dark:border-teal-800/40">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 block">إجمالي المقبوضات المالية</span>
            <span className="text-xl font-black font-mono text-teal-600 dark:text-teal-400">
              <AnimatedCounter value={finSummary.totalIncome} formatter={formatCurrency} /> ريال
            </span>
          </div>
        </div>

        {/* Total Financial Expenses */}
        <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0 border border-rose-200/40 dark:border-rose-800/40">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 block">إجمالي المصروفات المالية</span>
            <span className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">
              <AnimatedCounter value={finSummary.totalExpense} formatter={formatCurrency} /> ريال
            </span>
          </div>
        </div>

        {/* Customer Network Debt */}
        <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0 border border-amber-200/40 dark:border-amber-800/40">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 block">مديونيات العملاء المستحقة</span>
            <span className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">
              <AnimatedCounter value={customerStats.totalDebtYER} formatter={formatCurrency} /> ريال
            </span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0 border border-purple-200/40 dark:border-purple-800/40">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-400 block">المهام المنجزة</span>
            <span className="text-xl font-black font-mono text-purple-600 dark:text-purple-400">
              <AnimatedCounter value={taskStats.completed} /> / {taskStats.total}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Live Preview Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up stagger-4">
        {/* Latest Financial Operations */}
        <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">أحدث القيود المالية</h3>
            </div>
            <button
              onClick={() => onNavigateTab('financial')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              عرض الكل
            </button>
          </div>

          <div className="space-y-2.5">
            {recentFinancial.map((txn) => {
              const isIncome = txn.movement === 'ايرادات' || txn.movement === 'الصندوق' || txn.movement === 'حساب له';
              return (
                <div
                  key={txn.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-xl ${isIncome ? 'bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300' : 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300'}`}>
                      {isIncome ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{txn.accountName || txn.id}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{txn.movement} • {txn.restriction} • {txn.day} {txn.date}</span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className={`font-mono font-black text-sm block ${isIncome ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {formatCurrency(txn.amountYER)} YER
                    </span>
                    {(txn.amountSAR > 0 || txn.amountUSD > 0) && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {txn.amountSAR > 0 ? `${formatCurrency(txn.amountSAR)} SAR ` : ''}
                        {txn.amountUSD > 0 ? `$${formatCurrency(txn.amountUSD)} USD` : ''}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Visits for Today */}
        <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">عملاء مسار اليوم ({todayArabic})</h3>
            </div>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
            >
              فتح جدول الزيارات
            </button>
          </div>

          <div className="space-y-2.5">
            {todayCustomerVisits.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">لا يوجد عملاء مجدولون لهذا اليوم.</p>
            ) : (
              todayCustomerVisits.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{c.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 font-bold">
                        {c.source}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {c.region} • المندوب: {c.responsible}
                    </span>
                  </div>
                  <div className="text-left">
                    <span
                      className={`font-mono font-bold text-xs ${
                        (c.balanceYER || 0) < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-teal-700 dark:text-teal-400'
                      }`}
                    >
                      {(c.balanceYER || 0).toLocaleString()} ريال
                    </span>
                    <span className="block text-[10px] text-slate-400">{c.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Doctor Visits for Today */}
        <div className="bg-white/95 dark:bg-slate-900/85 backdrop-blur-xs p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">أطباء مسار اليوم ({todayArabic})</h3>
            </div>
            <button
              onClick={() => onNavigateTab('doctors')}
              className="text-xs font-bold text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
            >
              فتح خطة الأطباء
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {todayDoctorVisits.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6 md:col-span-2">لا يوجد أطباء مجدولون لهذا اليوم.</p>
            ) : (
              todayDoctorVisits.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{d.name}</span>
                      {d.specialty && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 font-bold">
                          {d.specialty}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {d.clinicName ? `${d.clinicName} • ` : ''}{d.region} • المندوب: {d.responsible}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
                      {d.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">أهمية {d.significance}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
