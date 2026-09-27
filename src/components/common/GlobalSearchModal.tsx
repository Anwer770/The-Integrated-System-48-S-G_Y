import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Package,
  CreditCard,
  Users,
  CheckSquare,
  FileText,
  DollarSign,
  Building,
  Calendar,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { ActiveModuleTab } from '../../types';
import { financialService } from '../../services/financial/FinancialService';
import { inventoryService } from '../../services/inventory/InventoryService';
import { customerService } from '../../services/crm/CustomerService';
import { doctorService } from '../../services/crm/DoctorService';
import { taskService } from '../../services/work/TaskService';
import { debtService } from '../../services/debts/DebtService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveModuleTab) => void;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'financial' | 'stock' | 'customer' | 'doctor' | 'task' | 'debt';
  categoryLabel: string;
  targetTab: ActiveModuleTab;
  date?: string;
  amount?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Normalized search query
  const cleanQuery = query.trim().toLowerCase();

  const allResults = useMemo(() => {
    if (!cleanQuery) return [];

    const results: SearchResultItem[] = [];

    // 1. Search Customers
    try {
      const customers = customerService.getAll();
      for (const c of customers) {
        if (
          c.name.toLowerCase().includes(cleanQuery) ||
          (c.phone && c.phone.includes(cleanQuery)) ||
          (c.region && c.region.toLowerCase().includes(cleanQuery))
        ) {
          results.push({
            id: `cust-${c.id}`,
            title: c.name,
            subtitle: `عميل / صيدلية • المنطقة: ${c.region || 'غير محدد'} • هاتف: ${c.phone || '—'}`,
            category: 'customer',
            categoryLabel: 'العملاء',
            targetTab: 'customers',
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Search Products & Stock Movements
    try {
      const products = inventoryService.getAllProducts();
      for (const p of products) {
        if (p.name.toLowerCase().includes(cleanQuery) || (p.description && p.description.toLowerCase().includes(cleanQuery))) {
          results.push({
            id: `prod-${p.id}`,
            title: p.name,
            subtitle: `صنف مخزني • الوحدة: ${p.unit || 'حبة'} • الرصيد الافتتاحي: ${p.openingStock}`,
            category: 'stock',
            categoryLabel: 'المخزون والأصناف',
            targetTab: 'stock',
          });
        }
      }

      const movements = inventoryService.getAllMovements();
      for (const m of movements) {
        if (
          m.subId.toLowerCase().includes(cleanQuery) ||
          m.beneficiary.toLowerCase().includes(cleanQuery) ||
          (m.description && m.description.toLowerCase().includes(cleanQuery))
        ) {
          results.push({
            id: `mov-${m.subId}`,
            title: `${m.movementType === 'توريد' ? 'سند توريد' : 'سند صرف'} #${m.subId}`,
            subtitle: `المستفيد: ${m.beneficiary} • التاريخ: ${m.date}`,
            category: 'stock',
            categoryLabel: 'حركات المخزون',
            targetTab: 'stock',
            date: m.date,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Search Financial Transactions
    try {
      const transactions = financialService.getAll();
      for (const t of transactions) {
        if (
          t.id.toLowerCase().includes(cleanQuery) ||
          (t.accountName && t.accountName.toLowerCase().includes(cleanQuery)) ||
          (t.description && t.description.toLowerCase().includes(cleanQuery)) ||
          (t.number && t.number.toLowerCase().includes(cleanQuery))
        ) {
          results.push({
            id: `fin-${t.id}`,
            title: `قيد مالي #${t.id} (${t.restriction || t.movement})`,
            subtitle: `الحساب: ${t.accountName} • ${t.description || 'لا يوجد بيان'}`,
            category: 'financial',
            categoryLabel: 'السجل المالي',
            targetTab: 'financial',
            date: t.date,
            amount: `${(t.amountYER || 0).toLocaleString()} YER`,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 4. Search Tasks & Commitments
    try {
      const tasks = taskService.getAllTasks();
      for (const t of tasks) {
        if (t.title.toLowerCase().includes(cleanQuery) || (t.desc && t.desc.toLowerCase().includes(cleanQuery))) {
          results.push({
            id: `task-${t.id}`,
            title: t.title,
            subtitle: `مهمة (${t.status || 'قيد التنفيذ'}) • الأولوية: ${t.pri || 'عادية'}`,
            category: 'task',
            categoryLabel: 'المهام',
            targetTab: 'tasks',
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 5. Search Debts
    try {
      const debts = debtService.getAll();
      for (const d of debts) {
        if (
          d.name.toLowerCase().includes(cleanQuery) ||
          (d.note && d.note.toLowerCase().includes(cleanQuery))
        ) {
          const isDebit = (d.debit || 0) > 0;
          results.push({
            id: `debt-${d.id}`,
            title: `سند دين: ${d.name}`,
            subtitle: `${isDebit ? 'مدين (عليه)' : 'دائن (له)'} • ${d.note || 'قيد ذمة'}`,
            category: 'debt',
            categoryLabel: 'الديون والالتزامات',
            targetTab: 'debts',
            amount: `${(isDebit ? d.debit : d.credit).toLocaleString()} ${d.currency || 'YER'}`,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    // 6. Search Doctors
    try {
      const doctors = doctorService.getAll();
      for (const doc of doctors) {
        if (
          doc.name.toLowerCase().includes(cleanQuery) ||
          (doc.specialty && doc.specialty.toLowerCase().includes(cleanQuery)) ||
          (doc.clinicName && doc.clinicName.toLowerCase().includes(cleanQuery))
        ) {
          results.push({
            id: `doc-${doc.id}`,
            title: doc.name,
            subtitle: `طبيب • التخصص: ${doc.specialty || 'عام'} • المركز: ${doc.clinicName || '—'}`,
            category: 'doctor',
            categoryLabel: 'الأطباء',
            targetTab: 'doctors',
          });
        }
      }
    } catch (e) {
      console.error(e);
    }

    return results;
  }, [cleanQuery]);

  const filteredResults = useMemo(() => {
    if (selectedCategory === 'all') return allResults;
    return allResults.filter((r) => r.category === selectedCategory);
  }, [allResults, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-3 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      dir="rtl"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[82vh] transition-all">
        {/* Search Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/50">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في كافة أرجاء المنظومة (صنف، عميل، قيد مالي، سند، مهمة، طبيب)..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md hidden sm:inline">
            ESC للإغلاق
          </span>
        </div>

        {/* Filter Category Chips */}
        <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: `الكل (${allResults.length})` },
            { id: 'financial', label: 'مالية' },
            { id: 'stock', label: 'مخزون وأصناف' },
            { id: 'customer', label: 'عملاء' },
            { id: 'doctor', label: 'أطباء' },
            { id: 'task', label: 'مهام' },
            { id: 'debt', label: 'ديون' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 min-h-[220px]">
          {!cleanQuery ? (
            <div className="py-14 text-center text-slate-400 dark:text-slate-500 space-y-2">
              <Search className="w-10 h-10 mx-auto opacity-30 text-teal-600" />
              <p className="text-xs font-bold">ابدأ بكتابة أي كلمة مفتاحية للبحث الشامل</p>
              <p className="text-[11px] text-slate-400">
                يمكنك كتابة رقم سند (مثل OUT-001)، اسم عميل، صيدلية، قيد مالي، أو اسم صنف
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-14 text-center text-slate-400 dark:text-slate-500 space-y-1">
              <p className="text-xs font-bold">لا توجد نتائج مطابقة لـ "{query}"</p>
              <p className="text-[11px]">تأكد من صحة الكلمة أو جرّب البحث بكلمة أخرى</p>
            </div>
          ) : (
            filteredResults.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onNavigate(item.targetTab);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800/60 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200/80 dark:border-slate-700/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-teal-100/60 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                    {item.category === 'financial' && <CreditCard className="w-4 h-4" />}
                    {item.category === 'stock' && <Package className="w-4 h-4" />}
                    {item.category === 'customer' && <Users className="w-4 h-4" />}
                    {item.category === 'doctor' && <Building className="w-4 h-4" />}
                    {item.category === 'task' && <CheckSquare className="w-4 h-4" />}
                    {item.category === 'debt' && <DollarSign className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-teal-700 dark:group-hover:text-teal-300">
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
                        {item.categoryLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.amount && (
                    <span className="text-xs font-mono font-black text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-1 rounded-lg">
                      {item.amount}
                    </span>
                  )}
                  <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-transform group-hover:-translate-x-0.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>نتائج البحث: {filteredResults.length} عنصر</span>
          <span>انقر على النتيجة للانتقال الفوري للقسم المخصص</span>
        </div>
      </div>
    </div>
  );
};
