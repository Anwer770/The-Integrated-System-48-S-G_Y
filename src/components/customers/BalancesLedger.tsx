import React, { useState, useMemo } from 'react';
import { Customer, CustomerSource } from '../../types';
import { CUSTOMER_SOURCES } from '../../data/defaultCustomers';
import { calculateCustomerStats } from '../../utils/customers';
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Search,
  Filter,
  Printer,
  ChevronRight,
  ShieldCheck,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

interface Props {
  customers: Customer[];
  onViewDetails: (customer: Customer) => void;
  onOpenStatement: (customer: Customer) => void;
}

export const BalancesLedger: React.FC<Props> = ({
  customers,
  onViewDetails,
  onOpenStatement,
}) => {
  const [activeTab, setActiveTab] = useState<'debtors' | 'all' | 'internal' | 'sources'>('debtors');
  const [search, setSearch] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('الكل');

  const stats = useMemo(() => calculateCustomerStats(customers), [customers]);

  // Negative debtors (مديونيات بالسالب)
  const debtorCustomers = useMemo(() => {
    return customers
      .filter((c) => c.balanceYER < 0)
      .sort((a, b) => a.balanceYER - b.balanceYER);
  }, [customers]);

  // Internal accounts (حسابات داخلية، عهد، بضاعة تالفة)
  const internalAccounts = useMemo(() => {
    return customers.filter((c) => c.isInternalAccount);
  }, [customers]);

  // Filtered list based on current sub-tab
  const currentList = useMemo(() => {
    let list: Customer[] = [];
    if (activeTab === 'debtors') list = debtorCustomers;
    else if (activeTab === 'internal') list = internalAccounts;
    else list = customers;

    return list.filter((c) => {
      if (selectedSource !== 'الكل' && c.source !== selectedSource) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.responsible.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [activeTab, debtorCustomers, internalAccounts, customers, selectedSource, search]);

  return (
    <div className="space-y-4">
      {/* KPI Cards Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total YER Debt */}
        <div className="bg-white p-4 rounded-3xl border border-rose-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="flex items-center gap-1 text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" />
              إجمالي مديونيات العملاء
            </span>
            <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-bold">
              {stats.debtorCount} عميل مدين
            </span>
          </div>
          <div className="text-xl font-black font-mono text-rose-600">
            {(stats.totalDebtYER || 0).toLocaleString('ar-YE')} ريال
          </div>
          <p className="text-[10px] text-slate-400 font-medium">مجموع الأرصدة السالبة المستحقة</p>
        </div>

        {/* Total Balance SAR */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>الرصيد التراكمي (سعودي)</span>
            <span className="text-[10px] font-mono">SAR</span>
          </div>
          <div className="text-xl font-black font-mono text-slate-800">
            {(stats.totalBalanceSAR || 0).toLocaleString('ar-SA')} ر.س
          </div>
          <p className="text-[10px] text-slate-400 font-medium">حسابات التوكيلات والعملات</p>
        </div>

        {/* Total Balance USD */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>الرصيد التراكمي (دولار)</span>
            <span className="text-[10px] font-mono">USD</span>
          </div>
          <div className="text-xl font-black font-mono text-slate-800">
            ${(stats.totalBalanceUSD || 0).toLocaleString()}
          </div>
          <p className="text-[10px] text-slate-400 font-medium">أرصدة العملة الصعبة</p>
        </div>

        {/* Internal Accounts */}
        <div className="bg-white p-4 rounded-3xl border border-purple-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span className="text-purple-700 font-bold">الحسابات الخاصة والعهدة</span>
            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
              {stats.internalAccountsCount} حساب
            </span>
          </div>
          <div className="text-xl font-black font-mono text-purple-800">
            {(internalAccounts.reduce((sum, c) => sum + (c.balanceYER || 0), 0) || 0).toLocaleString('ar-YE')}{' '}
            ريال
          </div>
          <p className="text-[10px] text-slate-400 font-medium">تشمل بضاعة تالفة، عهد مندوبين، وتوالف</p>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Sub tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full sm:w-auto text-xs font-bold">
            <button
              onClick={() => setActiveTab('debtors')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'debtors'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>المديونيات بالسالب ({debtorCustomers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              كافة الأرصدة ({customers.length})
            </button>

            <button
              onClick={() => setActiveTab('internal')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'internal'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>الحسابات الداخلية والعهدة ({internalAccounts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('sources')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sources'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              توزيع المصادر
            </button>
          </div>

          {/* Search & Source filter */}
          {activeTab !== 'sources' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث في الأرصدة والعملاء..."
                  className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                />
              </div>

              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
              >
                <option value="الكل">كافة العلامات</option>
                {CUSTOMER_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* View Content */}
      {activeTab === 'sources' ? (
        /* Source Breakdown Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats.sourceBreakdown).map(([sourceName, data]: [string, any]) => {
            return (
              <div
                key={sourceName}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-black text-slate-900 text-base">{sourceName}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {data.count} عميل
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 bg-rose-50/60 px-2.5 rounded-xl border border-rose-100">
                    <span className="text-rose-700 font-bold">المديونيات بالسالب:</span>
                    <span className="font-mono font-black text-rose-700">
                      {(data.totalDebtYER || 0).toLocaleString()} ريال
                    </span>
                  </div>

                  <div className="flex justify-between py-1 px-2">
                    <span className="text-slate-500">إجمالي رصيد YER:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {(data.balanceYER || 0).toLocaleString()} ريال
                    </span>
                  </div>

                  <div className="flex justify-between py-1 px-2">
                    <span className="text-slate-500">رصيد SAR:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {(data.balanceSAR || 0).toLocaleString()} ر.س
                    </span>
                  </div>

                  <div className="flex justify-between py-1 px-2">
                    <span className="text-slate-500">رصيد USD:</span>
                    <span className="font-mono font-bold text-slate-800">
                      ${(data.balanceUSD || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table of Balances */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">المعرف</th>
                  <th className="p-3">اسم العميل / المنشأة</th>
                  <th className="p-3">المصدر</th>
                  <th className="p-3">المنطقة</th>
                  <th className="p-3">المسار</th>
                  <th className="p-3">المندوب</th>
                  <th className="p-3 text-left">الرصيد اليمني (YER)</th>
                  <th className="p-3 text-left">سعودي (SAR)</th>
                  <th className="p-3 text-left">دولار (USD)</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentList.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-400">
                      لا توجد حسابات مطابقة لمعايير التصفية
                    </td>
                  </tr>
                ) : (
                  currentList.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{c.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{c.name}</div>
                        {c.notes && <p className="text-[10px] text-slate-400 line-clamp-1">{c.notes}</p>}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {c.source}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{c.region}</td>
                      <td className="p-3 font-bold text-blue-700">{c.route}</td>
                      <td className="p-3 font-bold text-indigo-700">{c.responsible}</td>
                      <td className="p-3 text-left font-mono">
                        <span
                          className={`font-black text-xs ${
                            (c.balanceYER || 0) < 0
                              ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200'
                              : 'text-emerald-700'
                          }`}
                        >
                          {(c.balanceYER || 0).toLocaleString('ar-YE')} ريال
                        </span>
                      </td>
                      <td className="p-3 text-left font-mono font-bold text-slate-700">
                        {c.balanceSAR ? `${(c.balanceSAR || 0).toLocaleString()} SAR` : '—'}
                      </td>
                      <td className="p-3 text-left font-mono font-bold text-slate-700">
                        {c.balanceUSD ? `$${(c.balanceUSD || 0).toLocaleString()}` : '—'}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenStatement(c)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold text-[11px] border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3" />
                            كشف حساب
                          </button>
                          <button
                            onClick={() => onViewDetails(c)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
