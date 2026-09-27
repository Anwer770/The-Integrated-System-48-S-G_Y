import React from 'react';
import { CustodyIssueRecord, CustodySection } from '../../types/custodyIssues';
import {
  Edit3,
  Trash2,
  Copy,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Layers,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';

interface CustodyIssuesTableProps {
  records: CustodyIssueRecord[];
  activeSectionTab: 'all' | CustodySection;
  onSelectSectionTab: (tab: 'all' | CustodySection) => void;
  custodyCount: number;
  issuesCount: number;
  totalCount: number;
  onEditRecord: (record: CustodyIssueRecord) => void;
  onDeleteRecord: (id: string) => void;
  onCloneRecord: (record: CustodyIssueRecord) => void;
  onChangeStatus: (id: string, newStatus: string) => void;
  onSortByDate?: () => void;
  sortOrder?: 'asc' | 'desc';
}

export const CustodyIssuesTable: React.FC<CustodyIssuesTableProps> = ({
  records,
  activeSectionTab,
  onSelectSectionTab,
  custodyCount,
  issuesCount,
  totalCount,
  onEditRecord,
  onDeleteRecord,
  onCloneRecord,
  onChangeStatus,
  onSortByDate,
  sortOrder = 'desc',
}) => {
  const getPriorityBadge = (pri: string) => {
    const p = (pri || '').toUpperCase();
    if (p === 'A') {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-rose-100 text-rose-800 font-black text-xs border border-rose-300">
          A
        </span>
      );
    }
    if (p === 'B') {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 text-amber-800 font-black text-xs border border-amber-300">
          B
        </span>
      );
    }
    if (p === 'C') {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-black text-xs border border-sky-300">
          C
        </span>
      );
    }
    if (p === 'D') {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-black text-xs border border-slate-300">
          D
        </span>
      );
    }
    if (p === '√' || p === 'V') {
      return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs border border-emerald-300">
          ✓
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs border border-slate-200">
        {pri || '-'}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').trim();
    switch (s) {
      case 'مكتمل':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            مكتمل
          </span>
        );
      case 'مخطط':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3 h-3" />
            مخطط
          </span>
        );
      case 'مؤجل':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            مؤجل
          </span>
        );
      case 'متأخر':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-3 h-3" />
            متأخر
          </span>
        );
      case 'شركة':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Building2 className="w-3 h-3" />
            شركة
          </span>
        );
      case 'ملغي':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            ملغي
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
            بدون حالة
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Section Tabs Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* All Tab */}
          <button
            onClick={() => onSelectSectionTab('all')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSectionTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>الكل</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                activeSectionTab === 'all' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Custody Tab */}
          <button
            onClick={() => onSelectSectionTab('custody')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSectionTab === 'custody'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>العهد وحسابات</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                activeSectionTab === 'custody' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {custodyCount}
            </span>
          </button>

          {/* Issues Tab */}
          <button
            onClick={() => onSelectSectionTab('issues')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSectionTab === 'issues'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>الاشكاليات المعلقة</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                activeSectionTab === 'issues' ? 'bg-rose-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {issuesCount}
            </span>
          </button>
        </div>

        {/* Date Sort Toggle */}
        {onSortByDate && (
          <button
            onClick={onSortByDate}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>ترتيب التاريخ ({sortOrder === 'desc' ? 'الأحدث' : 'الأقدم'})</span>
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto max-h-[calc(100vh-270px)] min-h-[380px] overflow-y-auto scrollbar-thin">
        <table className="w-full text-right border-collapse text-xs">
          <thead className="sticky top-0 z-20">
            <tr className="bg-slate-100/95 backdrop-blur-xs border-b border-slate-200 text-slate-700 font-bold text-xs shadow-2xs select-none">
              <th className="py-2.5 px-3 w-14 text-center sticky right-0 z-30 bg-slate-100/95 shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)]">المعرف</th>
              <th className="py-2.5 px-2 w-16 text-center">القسم</th>
              <th className="py-2.5 px-2.5 w-24">التاريخ</th>
              <th className="py-2.5 px-2.5 w-36">الاسم / الجهة</th>
              <th className="py-2.5 px-2.5 min-w-[260px]">الوصف التفصيلي</th>
              <th className="py-2.5 px-2 w-24">الفئة</th>
              <th className="py-2.5 px-2 w-16 text-center">الأولوية</th>
              <th className="py-2.5 px-2 w-24 text-center">الحالة</th>
              <th className="py-2.5 px-2.5 w-24">المسؤول</th>
              <th className="py-2.5 px-2.5 w-28 text-left">المبلغ</th>
              <th className="py-2.5 px-3 w-28 text-center sticky left-0 z-30 bg-slate-100/95 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)]">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {records.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400 font-medium">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Layers className="w-8 h-8 text-slate-300" />
                    <span>لا توجد سجلات تطابق الفلترة الحالية</span>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const hasCorrupted = r.isCorruptedReference || (r.desc && r.desc.includes('Schedule!'));

                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50 transition-colors text-[12px] group ${
                      hasCorrupted ? 'bg-rose-50/40' : ''
                    }`}
                  >
                    {/* ID */}
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-600 text-[11px] sticky right-0 z-10 bg-white group-hover:bg-slate-50 shadow-[-3px_0_6px_-2px_rgba(0,0,0,0.06)]">
                      {r.id}
                    </td>

                    {/* Section Badge */}
                    <td className="py-2 px-2 text-center">
                      {r.section === 'custody' ? (
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-black border border-indigo-200">
                          عهدة
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-black border border-rose-200">
                          إشكالية
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-2 px-2.5 font-mono text-slate-600 whitespace-nowrap text-[11px]">
                      {r.date || '-'}
                    </td>

                    {/* Name / Beneficiary */}
                    <td className="py-2 px-2.5 font-bold text-slate-900">
                      <div className="truncate max-w-[140px]" title={r.name}>
                        {r.name || '-'}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-2 px-2.5">
                      <div className="space-y-0.5">
                        <div className="text-slate-800 leading-normal font-medium text-[11px]">
                          {r.desc}
                        </div>

                        {hasCorrupted && (
                          <div className="inline-flex items-center gap-1 text-[10px] bg-rose-100 text-rose-900 px-1.5 py-0.2 rounded font-bold border border-rose-300">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>مرجع تالف من الإكسل — بحاجة لتصحيح الوصف</span>
                          </div>
                        )}

                        {r.notes && (
                          <div className="text-[10px] text-slate-500">
                            <span className="font-bold text-slate-600">ملاحظة: </span>
                            {r.notes}
                          </div>
                        )}

                        {r.link && (
                          <div>
                            <a
                              href={r.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-1"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>فتح الرابط المرفق</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2 px-2">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                        {r.cat || 'أخرى'}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-2 px-2 text-center">
                      {getPriorityBadge(r.pri)}
                    </td>

                    {/* Status with Quick Toggle Dropdown */}
                    <td className="py-2 px-2 text-center">
                      <div className="relative inline-block text-right group/status">
                        <button className="flex items-center gap-0.5 cursor-pointer">
                          {getStatusBadge(r.status)}
                          <ChevronDown className="w-3 h-3 text-slate-400" />
                        </button>
                        <div className="hidden group-hover/status:block group-focus-within/status:block absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 text-[11px] font-bold">
                          {['مخطط', 'مكتمل', 'مؤجل', 'متأخر', 'شركة', 'ملغي', 'بدون حالة'].map((st) => (
                            <button
                              key={st}
                              onClick={() => onChangeStatus(r.id, st)}
                              className={`w-full text-right px-3 py-1.5 hover:bg-slate-50 cursor-pointer ${
                                r.status === st ? 'text-indigo-600 font-black' : 'text-slate-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Responsible */}
                    <td className="py-2 px-2.5 text-slate-800 font-bold">
                      <span className="px-1.5 py-0.5 bg-indigo-50/60 text-indigo-950 rounded text-[11px]">
                        {r.resp || 'غير محدد'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-2 px-2.5 text-left font-mono font-bold whitespace-nowrap">
                      {r.amount && r.amount > 0 ? (
                        <div className="text-emerald-700">
                          {(r.amount || 0).toLocaleString()}
                          <span className="text-[10px] text-slate-500 mr-1">{r.currency || 'ر.ي'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    {/* Row Actions */}
                    <td className="py-2 px-3 text-center whitespace-nowrap sticky left-0 z-10 bg-white group-hover:bg-slate-50 shadow-[3px_0_6px_-2px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditRecord(r)}
                          title="تعديل السجل"
                          className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onCloneRecord(r)}
                          title="استنساخ السجل"
                          className="p-1 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded transition cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(r.id)}
                          title="حذف السجل"
                          className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
