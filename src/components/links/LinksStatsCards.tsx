import React from 'react';
import { LinksKPIs } from '../../types/linksLibrary';
import {
  Link2,
  Sparkles,
  Star,
  FileSpreadsheet,
  ShieldCheck,
  Share2,
} from 'lucide-react';

interface LinksStatsCardsProps {
  kpis: LinksKPIs;
  activeFilter: {
    onlyFavorites: boolean;
    onlyAI: boolean;
    classification: string;
    importance: string;
  };
  onFilterChange: (updates: {
    onlyFavorites?: boolean;
    onlyAI?: boolean;
    classification?: string;
    importance?: string;
  }) => void;
}

export const LinksStatsCards: React.FC<LinksStatsCardsProps> = ({
  kpis,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Total Links */}
      <div
        onClick={() =>
          onFilterChange({
            onlyFavorites: false,
            onlyAI: false,
            classification: 'الكل',
            importance: 'الكل',
          })
        }
        className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-500 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500">إجمالي الروابط</span>
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Link2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-black text-slate-900 font-mono">{kpis.total}</span>
          <span className="text-[10px] text-slate-400 font-medium">رابط مفهرس</span>
        </div>
      </div>

      {/* 2. AI Tools & Models */}
      <div
        onClick={() =>
          onFilterChange({
            onlyAI: !activeFilter.onlyAI,
            onlyFavorites: false,
          })
        }
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
          activeFilter.onlyAI
            ? 'bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/20'
            : 'bg-white border-slate-200/80 hover:shadow-md hover:border-purple-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-purple-700">ذكاء اصطناعي</span>
          <div className="p-2 bg-purple-100 text-purple-700 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-black text-purple-900 font-mono">{kpis.aiCount}</span>
          <span className="text-[10px] text-purple-600 font-medium">أدوات ونماذج</span>
        </div>
      </div>

      {/* 3. Favorites */}
      <div
        onClick={() =>
          onFilterChange({
            onlyFavorites: !activeFilter.onlyFavorites,
            onlyAI: false,
          })
        }
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
          activeFilter.onlyFavorites
            ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20'
            : 'bg-white border-slate-200/80 hover:shadow-md hover:border-amber-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-amber-700">المفضلة</span>
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-black text-amber-900 font-mono">{kpis.favoritesCount}</span>
          <span className="text-[10px] text-amber-600 font-medium">روابط مميزة</span>
        </div>
      </div>

      {/* 4. Office & Sheets */}
      <div
        onClick={() =>
          onFilterChange({
            classification:
              activeFilter.classification === 'الاوفس الاكسل'
                ? 'الكل'
                : 'الاوفس الاكسل',
          })
        }
        className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-emerald-700">أوفيس وإكسل</span>
          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-black text-emerald-900 font-mono">{kpis.officeCount}</span>
          <span className="text-[10px] text-emerald-600 font-medium">جداول ومعادلات</span>
        </div>
      </div>

      {/* 5. Security & Cyber */}
      <div
        onClick={() =>
          onFilterChange({
            classification:
              activeFilter.classification === 'الامن سيبراني'
                ? 'الكل'
                : 'الامن سيبراني',
          })
        }
        className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-500 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-rose-700">أمن وحماية</span>
          <div className="p-2 bg-rose-50 text-rose-700 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-black text-rose-900 font-mono">{kpis.securityCount}</span>
          <span className="text-[10px] text-rose-600 font-medium">أدوات فحص</span>
        </div>
      </div>

      {/* 6. Importance A & High Value */}
      <div
        onClick={() =>
          onFilterChange({
            importance: activeFilter.importance === 'A' ? 'الكل' : 'A',
          })
        }
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer group ${
          activeFilter.importance === 'A'
            ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
            : 'bg-white border-slate-200/80 hover:shadow-md hover:border-indigo-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700">درجة الأهمية (A)</span>
          <div className="px-2 py-0.5 bg-purple-700 text-white text-[11px] font-black rounded-lg">
            A
          </div>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-black text-indigo-950 font-mono">{kpis.importanceCounts.A}</span>
          <span className="text-[10px] text-indigo-600 font-medium">عالي الأهمية</span>
        </div>
      </div>
    </div>
  );
};
