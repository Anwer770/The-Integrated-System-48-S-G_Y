import React from 'react';
import { MovementRecord } from '../types';
import {
  X,
  Printer,
  Package,
  Calendar,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  CheckCircle,
} from 'lucide-react';
import {
  calculateArabicDay,
  formatNumberLatin,
  getCategoryBadgeStyle,
  getMovementTypeStyle,
  getStatusStyle,
} from '../utils/formatters';

interface MovementDetailsModalProps {
  record: MovementRecord | null;
  onClose: () => void;
  onEdit: (record: MovementRecord) => void;
}

export const MovementDetailsModal: React.FC<MovementDetailsModalProps> = ({
  record,
  onClose,
  onEdit,
}) => {
  if (!record) return null;

  const moveStyle = getMovementTypeStyle(record.movementType);
  const itemsEntries = Object.entries(record.items || {});
  const totalUnits = itemsEntries.reduce((sum, [, q]) => sum + (Number(q) || 0), 0);
  const dayName = calculateArabicDay(record.date);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Controls Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 print:hidden">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة السند</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(record);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              تعديل الحركة
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Voucher Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-xs" id="printable-voucher">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {record.movementType === 'توريد' ? 'سند توريد مخزني (IN)' : 'سند صرف مخزني (OUT)'}
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">دفتر صرف وتوريد الأصناف - مستحضرات التجميل والعناية</p>
            </div>

            <div className="text-left font-mono space-y-0.5">
              <div className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg inline-block border border-slate-300">
                {record.subId}
              </div>
              {record.mainId && (
                <div className="text-[10px] text-slate-400">Main: {record.mainId}</div>
              )}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">التاريخ:</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{record.date}</span>
              {dayName && <span className="text-[10px] text-slate-500 block">({dayName})</span>}
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">المستفيد / الجهة:</span>
              <span className="font-bold text-slate-900 text-xs">{record.beneficiary}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">الفئة:</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border mt-0.5 ${getCategoryBadgeStyle(record.category)}`}>
                {record.category}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">الحالة:</span>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border mt-0.5 ${getStatusStyle(record.status)}`}>
                {record.status}
              </span>
            </div>
          </div>

          {/* Description & Notes */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-600 block">البيان والوصف:</span>
            <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed">
              {record.description || 'لا يوجد وصف مدون'}
              {record.note && (
                <div className="text-amber-800 font-semibold mt-1 border-t border-slate-100 pt-1 text-[11px]">
                  ملاحظة: {record.note}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-900 block">
              الأصناف والكميات المعتمدة ({itemsEntries.length} أصناف):
            </span>

            <table className="w-full text-right text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                  <th className="py-2 px-3 w-12 text-center border-l border-slate-300">#</th>
                  <th className="py-2 px-3 border-l border-slate-300">اسم الصنف والمستحضر</th>
                  <th className="py-2 px-3 text-left w-32">الكمية المسلمة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {itemsEntries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-500 bg-slate-50 font-medium">
                      سند تاريخي مسجل بدون كميات رقمية بالملف الأصلي
                    </td>
                  </tr>
                ) : (
                  itemsEntries.map(([name, qty], idx) => (
                    <tr key={name} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center font-mono border-l border-slate-200 text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 border-l border-slate-200">
                        {name}
                      </td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-slate-900">
                        {formatNumberLatin(Number(qty))} حبة
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={2} className="py-2 px-3 text-left border-l border-slate-300">
                    الإجمالي الكلي للوحدات:
                  </td>
                  <td className="py-2 px-3 text-left font-mono text-blue-700 font-black">
                    {formatNumberLatin(totalUnits)} وحدة
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Official Signatures Grid */}
          <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs">
            <div className="space-y-8">
              <span className="font-bold text-slate-700 block">أمين المخزن</span>
              <div className="border-b border-dashed border-slate-400 w-32 mx-auto" />
            </div>
            <div className="space-y-8">
              <span className="font-bold text-slate-700 block">المستلم / المستفيد</span>
              <div className="border-b border-dashed border-slate-400 w-32 mx-auto" />
            </div>
            <div className="space-y-8">
              <span className="font-bold text-slate-700 block">اعتماد الإدارة</span>
              <div className="border-b border-dashed border-slate-400 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
