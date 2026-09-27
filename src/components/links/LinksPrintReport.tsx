import React from 'react';
import { LinkRecord, LinksKPIs } from '../../types/linksLibrary';
import { Printer, ArrowRight, Globe } from 'lucide-react';

interface LinksPrintReportProps {
  links: LinkRecord[];
  kpis: LinksKPIs;
  onBack: () => void;
}

export const LinksPrintReport: React.FC<LinksPrintReportProps> = ({
  links,
  kpis,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 my-4 shadow-sm print:m-0 print:p-0 print:border-none print:shadow-none">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-6 print:hidden">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى المكتبة</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            عدد الروابط المشمولة في التقرير: {links.length}
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير / تصدير PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Document Header */}
      <div className="text-center pb-6 border-b-2 border-slate-800">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 text-purple-800 rounded-2xl mb-3 print:border print:border-purple-300">
          <Globe className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-black text-slate-900">
          تقرير الفهرس الشامل لمكتبة الروابط والأدوات الرقمية
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          تاريخ الاستخراج: {new Date().toLocaleDateString('ar-SA')} - المنظومة الموحدة الشاملة
        </p>
      </div>

      {/* KPI Summary Block */}
      <div className="grid grid-cols-4 gap-3 my-6 text-center">
        <div className="p-3 border border-slate-200 rounded-xl bg-slate-50">
          <span className="block text-[11px] text-slate-500 font-bold">إجمالي الروابط</span>
          <span className="text-lg font-black text-slate-900 font-mono">{kpis.total}</span>
        </div>
        <div className="p-3 border border-purple-200 rounded-xl bg-purple-50/50">
          <span className="block text-[11px] text-purple-700 font-bold">أدوات الذكاء الاصطناعي</span>
          <span className="text-lg font-black text-purple-900 font-mono">{kpis.aiCount}</span>
        </div>
        <div className="p-3 border border-emerald-200 rounded-xl bg-emerald-50/50">
          <span className="block text-[11px] text-emerald-700 font-bold">الأوفيس والجداول</span>
          <span className="text-lg font-black text-emerald-900 font-mono">{kpis.officeCount}</span>
        </div>
        <div className="p-3 border border-amber-200 rounded-xl bg-amber-50/50">
          <span className="block text-[11px] text-amber-700 font-bold">الروابط المفضلة</span>
          <span className="text-lg font-black text-amber-900 font-mono">{kpis.favoritesCount}</span>
        </div>
      </div>

      {/* Links Detailed Table */}
      <table className="w-full text-right border-collapse text-xs mt-4">
        <thead>
          <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-700 font-bold">
            <th className="py-2.5 px-3 w-10 text-center">#</th>
            <th className="py-2.5 px-3">اسم الموقع / الأداة</th>
            <th className="py-2.5 px-3">الرابط URL</th>
            <th className="py-2.5 px-3">التصنيف والفئة</th>
            <th className="py-2.5 px-3 text-center w-20">الأهمية</th>
            <th className="py-2.5 px-3">الوصف والملاحظات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {links.map((link, idx) => (
            <tr key={link.id} className="break-inside-avoid">
              <td className="py-2 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
              <td className="py-2 px-3 font-bold text-slate-900">{link.siteName}</td>
              <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dir-ltr text-right max-w-xs truncate">
                {link.url}
              </td>
              <td className="py-2 px-3 text-[11px]">
                <span className="font-bold text-purple-800">{link.classification}</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="text-slate-600">{link.category}</span>
              </td>
              <td className="py-2 px-3 text-center font-black">
                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                  {link.importance}
                </span>
              </td>
              <td className="py-2 px-3 text-slate-600 text-[11px] leading-snug">
                {link.desc}
                {link.notes && <span className="block text-slate-400 text-[10px] mt-0.5">({link.notes})</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Signatures */}
      <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-600">
        <div>
          <span className="block font-bold mb-8">إعداد وتوثيق مسؤول النظام</span>
          <span>....................................</span>
        </div>
        <div>
          <span className="block font-bold mb-8">اعتماد الإدارة العامة</span>
          <span>....................................</span>
        </div>
      </div>
    </div>
  );
};
