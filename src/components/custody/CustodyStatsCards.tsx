import React from 'react';
import { CustodyKPIs } from '../../types/custodyIssues';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Layers,
  HelpCircle,
  Coins,
} from 'lucide-react';

interface CustodyStatsCardsProps {
  kpis: CustodyKPIs;
  activeStatusFilter?: string;
  onSelectStatusFilter?: (status: string) => void;
  onFilterCorrupted?: () => void;
}

export const CustodyStatsCards: React.FC<CustodyStatsCardsProps> = ({
  kpis,
  activeStatusFilter,
  onSelectStatusFilter,
  onFilterCorrupted,
}) => {
  return (
    <div className="space-y-4">
      {/* Top KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Records */}
        <div
          onClick={() => onSelectStatusFilter && onSelectStatusFilter('all')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeStatusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-slate-400'
              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold opacity-80">إجمالي السجلات</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-black">{kpis.total}</div>
          <div className="mt-1 flex items-center justify-between text-[10px] opacity-75">
            <span>عهد: {kpis.custodyCount}</span>
            <span>إشكاليات: {kpis.issuesCount}</span>
          </div>
        </div>

        {/* Late / Overdue - Critical KPI */}
        <div
          onClick={() => onSelectStatusFilter && onSelectStatusFilter('متأخر')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeStatusFilter === 'متأخر'
              ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300'
              : 'bg-rose-50/80 text-rose-900 border-rose-200 hover:bg-rose-100/60 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold">متأخر (تجاوز الموعد)</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-100">
            {kpis.lateCount}
          </div>
          <div className="mt-1 text-[10px] font-medium text-rose-700/80">
            {kpis.lateCount > 0 ? '⚠️ يتطلب تدخلاً ومتابعة فورية' : 'لا توجد متأخرات حرجة'}
          </div>
        </div>

        {/* Postponed */}
        <div
          onClick={() => onSelectStatusFilter && onSelectStatusFilter('مؤجل')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeStatusFilter === 'مؤجل'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300'
              : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100/60 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold">مؤجل (متوقف مؤقتاً)</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-700">
            {kpis.postponedCount}
          </div>
          <div className="mt-1 text-[10px] text-amber-700/80">
            بانتظار قرار أو تسوية
          </div>
        </div>

        {/* Planned */}
        <div
          onClick={() => onSelectStatusFilter && onSelectStatusFilter('مخطط')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeStatusFilter === 'مخطط'
              ? 'bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-300'
              : 'bg-sky-50/80 text-sky-900 border-sky-200 hover:bg-sky-100/60 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold">مخطط (قيد الإنجاز)</span>
            <Calendar className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-sky-700">
            {kpis.plannedCount}
          </div>
          <div className="mt-1 text-[10px] text-sky-700/80">
            مجدول ومسند للتنفيذ
          </div>
        </div>

        {/* Company Transferred */}
        <div
          onClick={() => onSelectStatusFilter && onSelectStatusFilter('شركة')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeStatusFilter === 'شركة'
              ? 'bg-purple-600 text-white border-purple-700 shadow-md ring-2 ring-purple-300'
              : 'bg-purple-50/80 text-purple-900 border-purple-200 hover:bg-purple-100/60 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold">مرحل للشركة</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-700">
            {kpis.companyCount}
          </div>
          <div className="mt-1 text-[10px] text-purple-700/80">
            مطالبات واعتمادات مركزية
          </div>
        </div>

        {/* Completed */}
        <div
          onClick={() => onSelectStatusFilter && onSelectStatusFilter('مكتمل')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeStatusFilter === 'مكتمل'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
              : 'bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100/60 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold">مكتمل ومُقفل</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">
            {kpis.completedCount}
          </div>
          <div className="mt-1 text-[10px] text-emerald-700/80">
            نسبة الإقفال: {kpis.total > 0 ? Math.round((kpis.completedCount / kpis.total) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Second Row: Unclassified, Corrupted References Alert, and Financial Sums */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Unclassified warning / Target reduction to <10% as per PRD */}
        <div
          onClick={() => onSelectStatusFilter && onSelectStatusFilter('بدون حالة')}
          className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
            activeStatusFilter === 'بدون حالة'
              ? 'bg-slate-800 text-white border-slate-700'
              : 'bg-amber-500/10 border-amber-300 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-black">سجلات بدون حالة تصنيف</div>
              <div className="text-[10px] opacity-80">
                هدف الـ PRD: خفضها إلى أقل من 10%
              </div>
            </div>
          </div>
          <div className="text-xl font-black font-mono">
            {kpis.unclassifiedCount}
          </div>
        </div>

        {/* Corrupted Schedule! References Alert */}
        <div
          onClick={onFilterCorrupted}
          className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
            kpis.corruptedCount > 0
              ? 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className={`w-5 h-5 ${kpis.corruptedCount > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'} shrink-0`} />
            <div>
              <div className="text-xs font-black">مراجع Schedule! التالفة ⚠️</div>
              <div className="text-[10px] opacity-80">
                {kpis.corruptedCount > 0 ? 'انقر لعرضها وتصحيح أوصافها' : 'تم تنظيف كافة المراجع بنجاح'}
              </div>
            </div>
          </div>
          <div className="text-xl font-black font-mono text-rose-700">
            {kpis.corruptedCount}
          </div>
        </div>

        {/* Financial Summary */}
        <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-black text-slate-800">إجمالي المبالغ المرصودة</div>
              <div className="text-[10px] text-slate-500">
                {(kpis.totalAmountUSD || 0) > 0 ? `+ ${(kpis.totalAmountUSD || 0).toLocaleString()} $` : 'مبالغ العهد والتعويضات'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-emerald-700 font-mono">
              {(kpis.totalAmountYEM || 0).toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">ريال يمني</div>
          </div>
        </div>
      </div>
    </div>
  );
};
