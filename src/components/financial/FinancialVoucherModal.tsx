import React, { useState, useEffect, useRef } from 'react';
import { FinancialTransaction } from '../../types';
import { formatCurrency, formatArabicDate } from '../../utils/formatters';
import {
  Printer,
  X,
  FileText,
  Calendar,
  User,
  Tag,
  CreditCard,
  Building,
  CheckCircle2,
  Receipt,
  Smartphone,
  Copy,
  Check,
} from 'lucide-react';
import { getMovementBadgeStyle, getImportanceBadgeStyle } from '../../data/defaultFinancial';
import QRCode from 'qrcode';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  transaction: FinancialTransaction | null;
}

export const FinancialVoucherModal: React.FC<Props> = ({ isOpen, onClose, transaction }) => {
  const [printMode, setPrintMode] = useState<'standard' | 'thermal80'>('standard');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!transaction) return;
    const payload = JSON.stringify({
      id: transaction.id,
      ref: transaction.number,
      type: transaction.restriction,
      account: transaction.accountName,
      yer: transaction.amountYER,
      sar: transaction.amountSAR,
      usd: transaction.amountUSD,
      date: transaction.date,
    });
    QRCode.toDataURL(payload, { width: 130, margin: 1 })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error(err));
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const movBadge = getMovementBadgeStyle(transaction.movement);
  const impBadge = getImportanceBadgeStyle(transaction.importance);

  const handleSendWhatsApp = () => {
    const text = `*🧾 إشعار سند مالي معتمد*
━━━━━━━━━━━━━━━━━━
🆔 *رقم السند:* ${transaction.id} (مرجع: ${transaction.number})
📅 *التاريخ:* ${transaction.day} ${transaction.date}
🏷️ *البيان والقيد:* ${transaction.restriction} (${transaction.movement})
🏢 *الحساب:* ${transaction.accountName} • ${transaction.categoryAccount}
📝 *البيان التفصيلي:* ${transaction.statement || 'لا يوجد'}

💵 *المبالغ:*
• ر.ي: ${formatCurrency(transaction.amountYER)}
• ر.س: ${formatCurrency(transaction.amountSAR)}
• USD: ${formatCurrency(transaction.amountUSD)}

━━━━━━━━━━━━━━━━━━
✨ *المنظومة-الإدارية-المتكاملة — إدارة الحسابات المالية*`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    const text = `سند مالي: ${transaction.id} | ${transaction.restriction} | الحساب: ${transaction.accountName} | المبلغ: ${formatCurrency(transaction.amountYER)} | التاريخ: ${transaction.date}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="financial-voucher-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs print:p-0 print:bg-white overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <style>{`
        @media print {
          @page {
            size: ${printMode === 'thermal80' ? '80mm auto' : 'A4 portrait'};
            margin: ${printMode === 'thermal80' ? '1.5mm' : '8mm'};
          }
          body {
            background: #fff !important;
            color: #000 !important;
            font-family: monospace, 'Cairo', sans-serif !important;
          }
          .print-hidden {
            display: none !important;
          }
          .thermal-voucher-container {
            width: 78mm !important;
            max-width: 78mm !important;
            padding: 2mm !important;
            margin: 0 auto !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200 print:border-none print:shadow-none animate-in fade-in zoom-in duration-150" dir="rtl">
        {/* Header - Screen Only */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 print-hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-600 font-mono font-bold text-xs text-white">
              {transaction.id}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">
                سند قيد / حركة مالية ({transaction.restriction || 'سند مالي'})
              </h3>
              <p className="text-[11px] text-slate-400">مرجع: {transaction.number} • {transaction.day} {transaction.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setPrintMode('standard')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  printMode === 'standard' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>A4 سند</span>
              </button>
              <button
                onClick={() => setPrintMode('thermal80')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  printMode === 'thermal80' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Receipt className="w-3 h-3" />
                <span>80mm حراري</span>
              </button>
            </div>

            {/* WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="إرسال إشعار السند عبر واتساب"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="نسخ ملخص السند"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Print Button */}
            <button
              id="print-financial-voucher-btn"
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                printMode === 'thermal80' ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{printMode === 'thermal80' ? 'طباعة إيصال 80mm' : 'طباعة السند'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 80mm Thermal Receipt View */}
        {printMode === 'thermal80' ? (
          <div className="p-4 sm:p-6 bg-slate-100 flex justify-center print:bg-white print:p-0">
            <div className="thermal-voucher-container w-full max-w-[320px] bg-white p-4 font-mono text-slate-900 border border-dashed border-slate-300 shadow-md rounded-2xl print:shadow-none print:border-none print:rounded-none text-xs">
              <div className="text-center space-y-1 pb-2">
                <div className="text-base font-black tracking-tight">المنظومة-الإدارية-المتكاملة — الإدارة المالية</div>
                <div className="text-[10px] text-slate-600 font-bold">سند قبض / صرف حراري (80mm)</div>
                <div className="text-[11px] font-black border-y border-dashed border-slate-800 py-1 my-1">
                  *** {transaction.restriction} ({transaction.movement}) ***
                </div>
              </div>

              <div className="text-[11px] space-y-1 py-1.5 border-b border-dashed border-slate-400">
                <div className="flex justify-between">
                  <span className="font-bold">رقم السند:</span>
                  <span className="font-mono font-bold">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">الرقم المرجعي:</span>
                  <span className="font-mono">{transaction.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">التاريخ واليوم:</span>
                  <span>{transaction.day} {transaction.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">اسم الحساب:</span>
                  <span className="font-black truncate max-w-[170px]">{transaction.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">تصنيف الحساب:</span>
                  <span>{transaction.categoryAccount}</span>
                </div>
              </div>

              {/* Amount Thermal Block */}
              <div className="py-2.5 border-b border-dashed border-slate-800 text-center space-y-1">
                <div className="text-[11px] font-bold text-slate-600">المبلغ المقيد:</div>
                <div className="text-xl font-black font-mono">
                  {formatCurrency(transaction.amountYER)}
                </div>
                <div className="text-[10px] text-slate-600">
                  {transaction.amountSAR > 0 && <span>{formatCurrency(transaction.amountSAR)} | </span>}
                  {transaction.amountUSD > 0 && <span>{formatCurrency(transaction.amountUSD)}</span>}
                </div>
              </div>

              {/* Statement note */}
              {transaction.statement && (
                <div className="py-2 border-b border-dashed border-slate-400 text-[11px] space-y-1">
                  <span className="font-bold block">البيان والشرح:</span>
                  <p className="text-slate-700 bg-slate-50 p-1.5 rounded">{transaction.statement}</p>
                </div>
              )}

              {/* QR Verification */}
              <div className="pt-3 pb-1 flex flex-col items-center justify-center text-center space-y-1">
                {qrDataUrl && (
                  <img
                    src={qrDataUrl}
                    alt="QR Verification"
                    className="w-24 h-24 mx-auto border border-slate-300 p-1 bg-white"
                  />
                )}
                <span className="text-[9px] text-slate-500 font-mono">
                  رمز التحقق المالي الرقمي ESC/POS
                </span>
              </div>

              {/* Thermal Signatures & Cut Line */}
              <div className="pt-3 space-y-4 text-[10px] text-center border-t border-dashed border-slate-400">
                <div className="flex justify-between text-slate-600">
                  <span>المحاسب: ..........</span>
                  <span>المستلم / الدافع: ..........</span>
                </div>
                <div className="text-[8px] text-slate-400 font-mono">
                  - - - - - - - - [ قص الورق هنا ] - - - - - - - -
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Standard A4 Voucher */
          <div className="p-8 print:p-6 text-slate-800 space-y-6">
            {/* Company Branding */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between flex-wrap gap-4">
              <div className="text-right">
                <h2 className="text-2xl font-black text-slate-900">المنظومة-الإدارية-المتكاملة — الإدارة والمحاسبة المالية</h2>
                <p className="text-xs text-slate-500 mt-1">قسم الحسابات والمالية — السجل المالي اليومي المعتمد</p>
                <p className="text-xs text-slate-500">الجمهورية اليمنية • مركز العمليات والتوزيع</p>
              </div>
              <div className="text-center p-3 border-2 border-slate-800 rounded-2xl bg-slate-50">
                <span className="text-xs font-bold block text-slate-500">نوع القيد والحركة</span>
                <span className="text-lg font-black text-slate-900">
                  {transaction.restriction} ({transaction.movement})
                </span>
              </div>
            </div>

            {/* Voucher Info Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block font-bold">المعرف (ID):</span>
                <span className="font-mono font-bold text-sm text-teal-700">{transaction.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">الرقم المرجعي:</span>
                <span className="font-mono font-bold text-sm text-slate-900">{transaction.number}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">تاريخ القيد:</span>
                <span className="font-bold text-slate-800">{transaction.day} {transaction.date}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">درجة الأهمية:</span>
                <span className="font-bold text-slate-800">{transaction.importance}</span>
              </div>
            </div>

            {/* Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <h4 className="font-bold text-slate-500 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-teal-600" />
                  طرف القيد والحساب المرتبط
                </h4>
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">اسم الحساب:</span>
                    <span className="font-black text-slate-900">{transaction.accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">تصنيف الحساب:</span>
                    <span className="font-bold text-slate-800">{transaction.categoryAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">طريقة الدفع / القيد:</span>
                    <span className="font-bold text-slate-800">{transaction.movementType}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <h4 className="font-bold text-slate-500 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  بيان وشرح الحركة
                </h4>
                <p className="text-slate-800 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl min-h-[64px]">
                  {transaction.statement || 'لا يوجد بيان إضافي مسجل لهذا القيد.'}
                </p>
              </div>
            </div>

            {/* Amounts Grid */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-slate-300 block">المبالغ المسجلة في القيد:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-teal-300 block font-bold">ريال يمني (YER)</span>
                  <span className="text-xl font-black font-mono text-teal-400">
                    {formatCurrency(transaction.amountYER)}
                  </span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-amber-300 block font-bold">ريال سعودي (SAR)</span>
                  <span className="text-xl font-black font-mono text-amber-400">
                    {formatCurrency(transaction.amountSAR)}
                  </span>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <span className="text-[11px] text-sky-300 block font-bold">دولار أمريكي (USD)</span>
                  <span className="text-xl font-black font-mono text-sky-400">
                    {formatCurrency(transaction.amountUSD)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 text-center text-xs font-bold">
              <div>
                <p className="text-slate-500 mb-10">المحاسب / مدخل البيانات</p>
                <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
              </div>
              <div>
                <p className="text-slate-500 mb-10">أمين الصندوق / المعتمد</p>
                <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
              </div>
              <div>
                <p className="text-slate-500 mb-10">المدير المالي / الإدارة العامة</p>
                <div className="border-b border-slate-400 w-3/4 mx-auto"></div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center text-[11px] text-slate-400 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span>تم إصدار هذا المستند آلياً عبر منظومة السجل المالي اليومي</span>
              <span>تاريخ الطباعة: {new Date().toLocaleDateString('ar-YE')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
