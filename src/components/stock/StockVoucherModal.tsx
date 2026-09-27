import React, { useState, useEffect } from 'react';
import { MovementRecord, Item } from '../../types';
import {
  Printer,
  X,
  Share2,
  Copy,
  Check,
  Calendar,
  Package,
  Layers,
  FileText,
  User,
  CheckCircle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { calculateArabicDay, formatNumberLatin } from '../../utils/formatters';

interface StockVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MovementRecord | null;
  products?: Item[];
  onEdit?: (record: MovementRecord) => void;
}

export const StockVoucherModal: React.FC<StockVoucherModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
}) => {
  const [printMode, setPrintMode] = useState<'a4' | 'thermal80'>('a4');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!record) return;
    const payload = JSON.stringify({
      id: record.subId,
      mainId: record.mainId || '',
      type: record.movementType,
      date: record.date,
      beneficiary: record.beneficiary,
      category: record.category,
      itemCount: Object.keys(record.items || {}).length,
      totalUnits: Object.values(record.items || {}).reduce<number>((s, q) => s + (Number(q) || 0), 0),
    });

    QRCode.toDataURL(payload, { width: 140, margin: 1 })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code error:', err));
  }, [record]);

  if (!isOpen || !record) return null;

  const itemsEntries = Object.entries(record.items || {});
  const totalUnits = itemsEntries.reduce((sum, [, q]) => sum + (Number(q) || 0), 0);
  const dayName = calculateArabicDay(record.date);
  const isIncoming = record.movementType === 'توريد';

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const itemsList = itemsEntries
      .map(([name, qty], idx) => `  ${idx + 1}. ${name}: ${qty} حبة`)
      .join('\n');

    const message = `*📦 سند ${isIncoming ? 'توريد مخزني (IN)' : 'صرف مخزني (OUT)'}*
━━━━━━━━━━━━━━━━━━
🆔 *رقم السند:* ${record.subId}
📅 *التاريخ:* ${record.date} (${dayName})
👤 *المستفيد / الجهة:* ${record.beneficiary}
🏷️ *الفئة / القسم:* ${record.category}
📊 *إجمالي الكمية:* ${formatNumberLatin(totalUnits)} وحدة

📋 *قائمة الأصناف المسلمة:*
${itemsList || '  (سند بدون كميات تفصيلية)'}

📝 *البيان:* ${record.description || 'لا يوجد'}
${record.note ? `⚠️ *ملاحظة:* ${record.note}\n` : ''}━━━━━━━━━━━━━━━━━━
✨ *المنظومة-الإدارية-المتكاملة — إدارة المستودعات والمخزون*`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopySummary = () => {
    const summary = `سند مخزني ${record.subId} (${record.movementType}) - ${record.beneficiary} - إجمالي ${totalUnits} وحدة - بتاريخ ${record.date}`;
    navigator.clipboard.writeText(summary);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs print:p-0 print:bg-white overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      dir="rtl"
    >
      <style>{`
        @media print {
          @page {
            size: ${printMode === 'thermal80' ? '80mm auto' : 'A4 portrait'};
            margin: ${printMode === 'thermal80' ? '1.5mm' : '8mm'};
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-none {
            border: none !important;
          }
          .print\\:w-full {
            width: 100% !important;
          }
        }
      `}</style>

      <div
        className={`bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all print:border-none print:shadow-none print:rounded-none ${
          printMode === 'thermal80'
            ? 'w-full max-w-[340px] text-[11px]'
            : 'w-full max-w-2xl max-h-[92vh] text-xs'
        }`}
      >
        {/* Top Control Bar (Screen Only) */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden flex-wrap gap-2">
          {/* Print Mode Selector: A4 vs Thermal 80mm */}
          <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-xl border border-slate-300">
            <button
              type="button"
              onClick={() => setPrintMode('a4')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                printMode === 'a4'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              سند رسمي (A4)
            </button>
            <button
              type="button"
              onClick={() => setPrintMode('thermal80')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                printMode === 'thermal80'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              طابعة حرارية (80mm)
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition shadow-xs cursor-pointer text-xs"
              title="طباعة السند"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-xs cursor-pointer text-xs"
              title="مشاركة الفاتورة عبر واتساب"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </button>

            <button
              type="button"
              onClick={handleCopySummary}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
              title="نسخ ملخص السند"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>

            {onEdit && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer text-xs"
              >
                تعديل
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voucher Body (Printable) */}
        {printMode === 'a4' ? (
          // ================= A4 STANDARD VOUCHER =================
          <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      isIncoming ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isIncoming ? 'توريد مخزني' : 'صرف مخزني'}
                  </span>
                  <h2 className="text-xl font-black text-slate-900">
                    {isIncoming ? 'سند توريد مخزني معتمد' : 'سند صرف مخزني معتمد'}
                  </h2>
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  المنظومة-الإدارية-المتكاملة • قسم إدارة المستودعات وحركات الأصناف
                </p>
              </div>

              <div className="text-left font-mono space-y-1">
                <div className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl inline-block border border-slate-300">
                  {record.subId}
                </div>
                {record.mainId && (
                  <div className="text-[11px] text-slate-400">كود المرجع: {record.mainId}</div>
                )}
              </div>
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">التاريخ:</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{record.date}</span>
                {dayName && <span className="text-[10px] text-slate-500 block font-medium">({dayName})</span>}
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-bold">المستفيد / الجهة:</span>
                <span className="font-bold text-slate-900 text-xs">{record.beneficiary}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-bold">الفئة / القسم:</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-slate-200 mt-0.5">
                  {record.category || 'عام'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-bold">الحالة:</span>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 mt-0.5">
                  {record.status || 'معتمد'}
                </span>
              </div>
            </div>

            {/* Description & Statement */}
            {record.description && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-600 block">البيان والوصف:</span>
                <div className="p-3 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed">
                  {record.description}
                  {record.note && (
                    <div className="text-amber-800 font-semibold mt-1.5 border-t border-slate-200 pt-1 text-[11px]">
                      ملاحظة: {record.note}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Items Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-900 block">
                  الأصناف والكميات المعتمدة ({itemsEntries.length} أصناف):
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  إجمالي الوحدات: <strong className="text-teal-700 font-black">{formatNumberLatin(totalUnits)}</strong>
                </span>
              </div>

              <table className="w-full text-right text-xs border border-slate-300 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                    <th className="py-2.5 px-3 w-12 text-center border-l border-slate-300">#</th>
                    <th className="py-2.5 px-3 border-l border-slate-300">اسم الصنف والمستحضر</th>
                    <th className="py-2.5 px-3 text-left w-32">الكمية المسلمة</th>
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
                    <td colSpan={2} className="py-2.5 px-3 text-left border-l border-slate-300">
                      الإجمالي الكلي للوحدات:
                    </td>
                    <td className="py-2.5 px-3 text-left font-mono text-teal-700 font-black text-sm">
                      {formatNumberLatin(totalUnits)} وحدة
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* QR Code and Official Footer */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {qrCodeDataUrl && (
                  <img
                    src={qrCodeDataUrl}
                    alt="QR Code"
                    className="w-16 h-16 rounded-lg border border-slate-200 p-0.5"
                  />
                )}
                <div className="text-[10px] text-slate-500 space-y-0.5">
                  <p className="font-bold text-slate-700">رمز التحقق الرقمي السريع</p>
                  <p>تاريخ ووقت الطباعة: {new Date().toLocaleString('ar-YE')}</p>
                  <p className="font-mono text-slate-400">Voucher Ref: {record.subId}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-center gap-8 text-center text-xs">
                <div className="space-y-6">
                  <span className="font-bold text-slate-700 block">أمين المخزن</span>
                  <div className="border-b border-dashed border-slate-400 w-28 mx-auto" />
                </div>
                <div className="space-y-6">
                  <span className="font-bold text-slate-700 block">المستلم / المستفيد</span>
                  <div className="border-b border-dashed border-slate-400 w-28 mx-auto" />
                </div>
                <div className="space-y-6">
                  <span className="font-bold text-slate-700 block">اعتماد الإدارة</span>
                  <div className="border-b border-dashed border-slate-400 w-28 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ================= THERMAL 80MM RECEIPT =================
          <div className="p-4 space-y-3 font-mono text-[11px] leading-tight text-slate-900 bg-white">
            <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
              <h2 className="text-sm font-black">المنظومة-الإدارية-المتكاملة</h2>
              <p className="text-[10px] font-sans">سند مستودعي رسمي - طابعة حرارية</p>
              <div className="text-xs font-black bg-slate-100 py-1 px-2 rounded border border-slate-300 inline-block mt-1">
                {isIncoming ? 'سند توريد مخزني (IN)' : 'سند صرف مخزني (OUT)'}
              </div>
            </div>

            <div className="space-y-1 text-[10px] border-b border-dashed border-slate-400 pb-2">
              <div className="flex justify-between">
                <span>رقم السند:</span>
                <span className="font-black">{record.subId}</span>
              </div>
              <div className="flex justify-between">
                <span>التاريخ:</span>
                <span>{record.date}</span>
              </div>
              <div className="flex justify-between font-sans">
                <span>المستفيد:</span>
                <span className="font-bold">{record.beneficiary}</span>
              </div>
              <div className="flex justify-between font-sans">
                <span>الفئة:</span>
                <span>{record.category || 'عام'}</span>
              </div>
            </div>

            {/* Thermal Items List */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between font-bold text-[10px] border-b border-slate-300 pb-1">
                <span>الصنف</span>
                <span>الكمية</span>
              </div>
              {itemsEntries.map(([name, qty], idx) => (
                <div key={name} className="flex justify-between py-0.5 text-[10px]">
                  <span className="truncate max-w-[190px] font-sans">
                    {idx + 1}. {name}
                  </span>
                  <span className="font-black">{qty} حبة</span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-slate-800 pt-2 space-y-1">
              <div className="flex justify-between font-black text-xs">
                <span>إجمالي الوحدات:</span>
                <span>{formatNumberLatin(totalUnits)} وحدة</span>
              </div>
            </div>

            {record.description && (
              <div className="border-t border-dashed border-slate-300 pt-1 text-[9px] font-sans text-slate-600">
                <span>البيان: {record.description}</span>
              </div>
            )}

            {/* Thermal QR and Signatures */}
            <div className="pt-3 border-t border-dashed border-slate-400 text-center space-y-2">
              {qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-20 h-20 mx-auto border border-slate-300 p-0.5"
                />
              )}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[9px] font-sans">
                <div>
                  <span>توقيع المستلم</span>
                  <div className="border-b border-dashed border-slate-400 mt-4" />
                </div>
                <div>
                  <span>أمين المخزن</span>
                  <div className="border-b border-dashed border-slate-400 mt-4" />
                </div>
              </div>
              <p className="text-[8px] text-slate-400 pt-1 font-sans">شكراً لتعاملكم معنا • تم الإصدار إلكترونياً</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
