import React, { useState, useEffect } from 'react';
import { DebtRecord } from '../../types';
import {
  Printer,
  X,
  Share2,
  Copy,
  Check,
  Calendar,
  DollarSign,
  FileText,
  User,
  CheckCircle,
} from 'lucide-react';
import QRCode from 'qrcode';
import { formatCurrency } from '../../utils/formatters';

interface DebtVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DebtRecord | null;
  bookTitle?: string;
  onEdit?: (record: DebtRecord) => void;
}

export const DebtVoucherModal: React.FC<DebtVoucherModalProps> = ({
  isOpen,
  onClose,
  record,
  bookTitle = 'دفتر الديون والالتزامات',
  onEdit,
}) => {
  const [printMode, setPrintMode] = useState<'a4' | 'thermal80'>('a4');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!record) return;
    const cur = (record.currency || 'YER').toUpperCase();
    const amount = record.debit > 0 ? record.debit : record.credit;
    const type = record.debit > 0 ? 'مدين (عليه)' : 'دائن (له)';

    const payload = JSON.stringify({
      id: record.id,
      name: record.name,
      type,
      amount,
      currency: cur,
      date: record.date,
      balance: record.balance || 0,
    });

    QRCode.toDataURL(payload, { width: 140, margin: 1 })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code error:', err));
  }, [record]);

  if (!isOpen || !record) return null;

  const cur = (record.currency || 'YER').toUpperCase();
  const isDebit = record.debit > 0;
  const mainAmount = isDebit ? record.debit : record.credit;
  const typeText = isDebit ? 'سند قيد ذمة / مدين (عليه)' : 'سند استحقاق دائن / (له)';

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const text = `*🧾 سند قيد ذمة وائتمان رسمي*
━━━━━━━━━━━━━━━━━━
🆔 *رقم السند:* ${record.id}
👤 *الطرف / الحساب:* ${record.name}
📅 *التاريخ:* ${record.date || '—'}
🏷️ *نوع القيد:* ${typeText}
💵 *المبلغ المقيد:* ${formatCurrency(mainAmount)} ${cur}
${record.balance !== undefined ? `📊 *الرصيد التراكمي للحساب:* ${formatCurrency(record.balance)} ${cur}\n` : ''}${record.dueDate ? `⏰ *تاريخ الاستحقاق المقترح:* ${record.dueDate}\n` : ''}📝 *البيان / الوصف:* ${record.description || record.note || 'لا يوجد'}
━━━━━━━━━━━━━━━━━━
✨ *المنظومة-الإدارية-المتكاملة — إدارة الديون والالتزامات*`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopySummary = () => {
    const summary = `سند قيد ${record.id}: لـ ${record.name} بمبلغ ${formatCurrency(mainAmount)} ${cur} (${typeText}) بتاريخ ${record.date || ''}`;
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
        }
      `}</style>

      <div
        className={`bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all print:border-none print:shadow-none print:rounded-none ${
          printMode === 'thermal80'
            ? 'w-full max-w-[340px] text-[11px]'
            : 'w-full max-w-xl max-h-[92vh] text-xs'
        }`}
      >
        {/* Top Controls */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden flex-wrap gap-2">
          {/* Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-xl border border-slate-300">
            <button
              type="button"
              onClick={() => setPrintMode('a4')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
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
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                printMode === 'thermal80'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              طابعة حرارية (80mm)
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shadow-xs cursor-pointer text-xs"
              title="طباعة السند"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-xs cursor-pointer text-xs"
              title="مشاركة عبر واتساب"
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

        {/* Voucher Content */}
        {printMode === 'a4' ? (
          // ================= A4 VOUCHER =================
          <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      isDebit ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {isDebit ? 'مدين (عليه)' : 'دائن (له)'}
                  </span>
                  <h2 className="text-xl font-black text-slate-900">{typeText}</h2>
                </div>
                <p className="text-slate-500 text-xs mt-1">
                  المنظومة-الإدارية-المتكاملة • {bookTitle}
                </p>
              </div>

              <div className="text-left font-mono">
                <div className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-xl inline-block border border-slate-300">
                  {record.id}
                </div>
              </div>
            </div>

            {/* Amount Box */}
            <div
              className={`p-4 rounded-2xl border text-center space-y-1 ${
                isDebit
                  ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                  : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
              }`}
            >
              <span className="text-xs font-bold text-slate-500 block">المبلغ المقيد بالسند</span>
              <div className="text-2xl sm:text-3xl font-black font-mono">
                {formatCurrency(mainAmount)} <span className="text-base font-bold font-sans">{cur}</span>
              </div>
              {record.balance !== undefined && (
                <div className="text-xs font-mono font-bold text-slate-600 pt-1">
                  الرصيد التراكمي للحساب: <strong className="text-slate-900">{formatCurrency(record.balance)} {cur}</strong>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">اسم الحساب / الطرف:</span>
                <span className="font-bold text-slate-900 text-xs">{record.name}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-bold">التاريخ:</span>
                <span className="font-mono font-bold text-slate-900 text-xs">{record.date || '—'}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block font-bold">العملة:</span>
                <span className="font-bold text-slate-900 text-xs">{cur}</span>
              </div>

              {record.dueDate && (
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">تاريخ الاستحقاق:</span>
                  <span className="font-mono font-bold text-amber-700 text-xs">{record.dueDate}</span>
                </div>
              )}

              {record.icon && (
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">الرمز المرجعي:</span>
                  <span className="font-mono font-bold text-slate-700 text-xs">{record.icon}</span>
                </div>
              )}

              <div>
                <span className="text-[10px] text-slate-400 block font-bold">حالة السند:</span>
                <span className="font-bold text-emerald-700 text-xs">
                  {record.isCompleted ? 'مكتمل / مسدد' : 'نشط وغير مكتمل'}
                </span>
              </div>
            </div>

            {/* Statement and notes */}
            {(record.description || record.note) && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-600 block">البيان والتفاصيل:</span>
                <div className="p-3 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-800 text-xs leading-relaxed">
                  {record.description && <p>{record.description}</p>}
                  {record.note && (
                    <p className="text-amber-800 font-semibold mt-1 text-[11px]">
                      ملاحظة: {record.note}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* QR Code and Signatures */}
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
                  <p className="font-bold text-slate-700">رمز التحقق الرقمي</p>
                  <p>تاريخ الإصدار: {new Date().toLocaleString('ar-YE')}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-center gap-8 text-center text-xs">
                <div className="space-y-6">
                  <span className="font-bold text-slate-700 block">المسؤول المالي</span>
                  <div className="border-b border-dashed border-slate-400 w-28 mx-auto" />
                </div>
                <div className="space-y-6">
                  <span className="font-bold text-slate-700 block">الطرف / العميل</span>
                  <div className="border-b border-dashed border-slate-400 w-28 mx-auto" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ================= THERMAL 80MM =================
          <div className="p-4 space-y-3 font-mono text-[11px] leading-tight text-slate-900 bg-white">
            <div className="text-center space-y-1 border-b border-dashed border-slate-400 pb-3">
              <h2 className="text-sm font-black">المنظومة-الإدارية-المتكاملة</h2>
              <p className="text-[10px] font-sans">سند قيد ذمة - طابعة حرارية</p>
              <div className="text-xs font-black bg-slate-100 py-1 px-2 rounded border border-slate-300 inline-block mt-1">
                {isDebit ? 'سند مدين (عليه)' : 'سند دائن (له)'}
              </div>
            </div>

            <div className="space-y-1 text-[10px] border-b border-dashed border-slate-400 pb-2">
              <div className="flex justify-between">
                <span>رقم السند:</span>
                <span className="font-black">{record.id}</span>
              </div>
              <div className="flex justify-between">
                <span>التاريخ:</span>
                <span>{record.date || '—'}</span>
              </div>
              <div className="flex justify-between font-sans">
                <span>الحساب / الطرف:</span>
                <span className="font-bold">{record.name}</span>
              </div>
            </div>

            {/* Thermal Amount */}
            <div className="text-center py-2 border-b-2 border-dashed border-slate-800">
              <span className="text-[10px] block">المبلغ المقيد:</span>
              <span className="text-base font-black">
                {formatCurrency(mainAmount)} {cur}
              </span>
              {record.balance !== undefined && (
                <span className="text-[10px] text-slate-500 block">
                  الرصيد: {formatCurrency(record.balance)} {cur}
                </span>
              )}
            </div>

            {record.description && (
              <div className="border-b border-dashed border-slate-300 pb-2 text-[9px] font-sans text-slate-700">
                <span>البيان: {record.description}</span>
              </div>
            )}

            {/* QR & Signatures */}
            <div className="pt-2 text-center space-y-2">
              {qrCodeDataUrl && (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-20 h-20 mx-auto border border-slate-300 p-0.5"
                />
              )}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[9px] font-sans">
                <div>
                  <span>توقيع الطرف</span>
                  <div className="border-b border-dashed border-slate-400 mt-4" />
                </div>
                <div>
                  <span>المحاسب المعتمد</span>
                  <div className="border-b border-dashed border-slate-400 mt-4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
