import React from 'react';
import { CustodyIssueRecord, CustodyKPIs } from '../../types/custodyIssues';
import { Printer, ArrowRight, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface CustodyPrintReportProps {
  records: CustodyIssueRecord[];
  kpis: CustodyKPIs;
  onBack: () => void;
  filterSummary?: string;
}

export const CustodyPrintReport: React.FC<CustodyPrintReportProps> = ({
  records,
  kpis,
  onBack,
  filterSummary = 'جميع السجلات',
}) => {
  const handlePrint = () => {
    window.print();
  };

  const custodyRows = records.filter((r) => r.section === 'custody');
  const issuesRows = records.filter((r) => r.section === 'issues');

  return (
    <div className="bg-white min-h-screen p-6 sm:p-10 text-slate-900 font-sans print:p-0">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-6 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-bold flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للدفتر</span>
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900">معاينة تقرير الطباعة</h1>
            <p className="text-xs text-slate-500">
              تقرير رسمي جاهز للمراجعة، التصدير والاجتماعات الإدارية
            </p>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black shadow-md flex items-center gap-2 transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة التقرير الآن</span>
        </button>
      </div>

      {/* Official Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
        <div>
          <div className="text-xl font-black tracking-tight text-slate-900">
            تقرير دفتر العهد والاشكاليات المعلقة والحسابات
          </div>
          <div className="text-xs font-bold text-slate-600 mt-1">
            المنظومة الإدارية والمحاسبية وإدارة المعرفة المتكاملة
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            نطاق التقرير: {filterSummary} • عدد السجلات المعروضة: {records.length}
          </div>
        </div>

        <div className="text-left text-xs space-y-1">
          <div>
            <span className="font-bold text-slate-600">تاريخ الطباعة: </span>
            <span className="font-mono">{new Date().toLocaleDateString('ar-YE', { dateStyle: 'long' })}</span>
          </div>
          <div>
            <span className="font-bold text-slate-600">إجمالي المبالغ: </span>
            <span className="font-bold text-emerald-700 font-mono">
              {(kpis.totalAmountYEM || 0).toLocaleString()} ر.ي
            </span>
          </div>
        </div>
      </div>

      {/* Summary KPI Highlights */}
      <div className="grid grid-cols-5 gap-3 mb-6 text-center text-xs">
        <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
          <div className="text-[10px] text-slate-500 font-bold">إجمالي السجلات</div>
          <div className="text-base font-black text-slate-900">{kpis.total}</div>
        </div>
        <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
          <div className="text-[10px] text-slate-500 font-bold">العهد وحسابات</div>
          <div className="text-base font-black text-indigo-800">{kpis.custodyCount}</div>
        </div>
        <div className="p-3 border border-slate-300 rounded-lg bg-slate-50">
          <div className="text-[10px] text-slate-500 font-bold">الاشكاليات المعلقة</div>
          <div className="text-base font-black text-rose-800">{kpis.issuesCount}</div>
        </div>
        <div className="p-3 border border-rose-300 rounded-lg bg-rose-50">
          <div className="text-[10px] text-rose-700 font-bold">المتأخر والمعلق</div>
          <div className="text-base font-black text-rose-900">{kpis.lateCount + kpis.postponedCount}</div>
        </div>
        <div className="p-3 border border-emerald-300 rounded-lg bg-emerald-50">
          <div className="text-[10px] text-emerald-700 font-bold">المكتمل والمرحل</div>
          <div className="text-base font-black text-emerald-900">{kpis.completedCount + kpis.companyCount}</div>
        </div>
      </div>

      {/* 1. Custody & Accounts Table */}
      {custodyRows.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-700" />
            <h2 className="text-sm font-black text-slate-900">
              أولاً: سجلات العهد والحسابات ودفاتر السندات ({custodyRows.length})
            </h2>
          </div>
          <table className="w-full text-right border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                <th className="p-2 border-l border-slate-300 w-12 text-center">#</th>
                <th className="p-2 border-l border-slate-300 w-24">التاريخ</th>
                <th className="p-2 border-l border-slate-300 w-36">الاسم/الجهة</th>
                <th className="p-2 border-l border-slate-300">الوصف التفصيلي</th>
                <th className="p-2 border-l border-slate-300 w-24">الفئة</th>
                <th className="p-2 border-l border-slate-300 w-16 text-center">الأولوية</th>
                <th className="p-2 border-l border-slate-300 w-20 text-center">الحالة</th>
                <th className="p-2 border-l border-slate-300 w-24">المسؤول</th>
                <th className="p-2 w-28 text-left">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              {custodyRows.map((r, idx) => (
                <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-2 border-l border-slate-200 text-center font-mono font-bold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="p-2 border-l border-slate-200 font-mono whitespace-nowrap">
                    {r.date || '-'}
                  </td>
                  <td className="p-2 border-l border-slate-200 font-bold text-slate-900">
                    {r.name || '-'}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-slate-700 leading-relaxed">
                    {r.desc}
                    {r.notes && <div className="text-[10px] text-slate-500 mt-0.5">ملاحظة: {r.notes}</div>}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-slate-600">
                    {r.cat}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-center font-bold">
                    {r.pri}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-center font-bold">
                    {r.status}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-slate-800">
                    {r.resp}
                  </td>
                  <td className="p-2 text-left font-mono font-bold">
                    {r.amount ? `${(r.amount || 0).toLocaleString()} ${r.currency || 'ر.ي'}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. Pending Issues Table */}
      {issuesRows.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileSpreadsheet className="w-4 h-4 text-rose-700" />
            <h2 className="text-sm font-black text-slate-900">
              ثانياً: سجلات الاشكاليات المعلقة والتسويات والمرتجعات ({issuesRows.length})
            </h2>
          </div>
          <table className="w-full text-right border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                <th className="p-2 border-l border-slate-300 w-12 text-center">#</th>
                <th className="p-2 border-l border-slate-300 w-24">التاريخ</th>
                <th className="p-2 border-l border-slate-300 w-36">الصيدلية/العميل</th>
                <th className="p-2 border-l border-slate-300">طبيعة الإشكالية والوصف</th>
                <th className="p-2 border-l border-slate-300 w-24">الفئة</th>
                <th className="p-2 border-l border-slate-300 w-16 text-center">الأولوية</th>
                <th className="p-2 border-l border-slate-300 w-20 text-center">الحالة</th>
                <th className="p-2 border-l border-slate-300 w-24">المسؤول</th>
                <th className="p-2 w-28 text-left">المبلغ المطلوب</th>
              </tr>
            </thead>
            <tbody>
              {issuesRows.map((r, idx) => (
                <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-2 border-l border-slate-200 text-center font-mono font-bold text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="p-2 border-l border-slate-200 font-mono whitespace-nowrap">
                    {r.date || '-'}
                  </td>
                  <td className="p-2 border-l border-slate-200 font-bold text-slate-900">
                    {r.name || '-'}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-slate-700 leading-relaxed">
                    {r.desc}
                    {r.notes && <div className="text-[10px] text-slate-500 mt-0.5">ملاحظة: {r.notes}</div>}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-slate-600">
                    {r.cat}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-center font-bold">
                    {r.pri}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-center font-bold">
                    {r.status}
                  </td>
                  <td className="p-2 border-l border-slate-200 text-slate-800">
                    {r.resp}
                  </td>
                  <td className="p-2 text-left font-mono font-bold">
                    {r.amount ? `${(r.amount || 0).toLocaleString()} ${r.currency || 'ر.ي'}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Official Signatures Box as in PRD */}
      <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
        <div className="space-y-6">
          <div className="font-bold text-slate-700">أمين العهدة والمتابعة</div>
          <div className="border-b border-dashed border-slate-400 w-32 mx-auto"></div>
          <div className="text-[10px] text-slate-400">التوقيع والتاريخ</div>
        </div>

        <div className="space-y-6">
          <div className="font-bold text-slate-700">مسؤول التحصيل (صدام)</div>
          <div className="border-b border-dashed border-slate-400 w-32 mx-auto"></div>
          <div className="text-[10px] text-slate-400">التوقيع والتاريخ</div>
        </div>

        <div className="space-y-6">
          <div className="font-bold text-slate-700">اعتماد الإدارة العامة</div>
          <div className="border-b border-dashed border-slate-400 w-32 mx-auto"></div>
          <div className="text-[10px] text-slate-400">الختم والتوقيع</div>
        </div>
      </div>
    </div>
  );
};
