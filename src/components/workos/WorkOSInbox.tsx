import React, { useState } from 'react';
import { InboxItem } from '../../types/workos';
import {
  Inbox,
  Sparkles,
  ArrowRightLeft,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  Tag,
  CheckSquare,
  BookOpen,
  Calendar,
  FolderKanban,
  Send,
} from 'lucide-react';
import { parseNaturalLanguageTask } from '../../utils/workosStorage';

interface WorkOSInboxProps {
  inbox: InboxItem[];
  onAddInboxItem: (rawText: string) => void;
  onConvertToTask: (item: InboxItem) => void;
  onConvertToNote: (item: InboxItem) => void;
  onConvertToAppointment: (item: InboxItem) => void;
  onConvertToProject: (item: InboxItem) => void;
  onDeleteInboxItem: (id: string) => void;
}

export const WorkOSInbox: React.FC<WorkOSInboxProps> = ({
  inbox = [],
  onAddInboxItem = (..._args: any[]) => {},
  onConvertToTask = (..._args: any[]) => {},
  onConvertToNote = (..._args: any[]) => {},
  onConvertToAppointment = (..._args: any[]) => {},
  onConvertToProject = (..._args: any[]) => {},
  onDeleteInboxItem = (..._args: any[]) => {},
}) => {
  const [quickInput, setQuickInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onAddInboxItem(quickInput.trim());
    setQuickInput('');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header card with Quick Thought Capture input */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Inbox className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">صندوق الوارد المركزي (Inbox & Brain Dump)</h2>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              التقط أي فكرة أو مهمة أو مكالمة أو ملاحظة واردة هنا فوراً لتصفية ذهنك، ثم قم بفرزها وتحويلها بنقرة واحدة إلى الكيان المناسب.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 self-start">
            {inbox.length} فكرة غير مفرزة
          </span>
        </div>

        {/* Quick Input Bar */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="اكتب هنا أي فكرة، مهمة، أو موعد (مثال: الاتصال بمدير صيدلية المجد غداً الساعة 11 لمناقشة الخصم)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden bg-slate-50/50"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إدخال فوري</span>
          </button>
        </form>
      </div>

      {/* Inbox Items List */}
      <div className="space-y-3">
        {inbox.map((item) => {
          const parsed = parseNaturalLanguageTask(item.rawText);
          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{item.rawText}</span>
                  {item.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Natural Language Intelligence Badge */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1 text-teal-700 font-bold">
                    <Sparkles className="w-3 h-3 text-teal-600" /> تحليل ذكي:
                  </span>
                  <span>الموعد المقترح: <strong className="font-mono text-slate-700">{parsed.dueDate} {parsed.dueTime}</strong></span>
                  <span>•</span>
                  <span>الأولوية: <strong className="text-slate-700">{parsed.priority}</strong></span>
                </div>
              </div>

              {/* Action Buttons to convert */}
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                <button
                  onClick={() => onConvertToTask(item)}
                  title="تحويل إلى مهمة رسمية"
                  className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                  <span>مهمة</span>
                </button>

                <button
                  onClick={() => onConvertToNote(item)}
                  title="تحويل إلى ملاحظة معرفية"
                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                  <span>ملاحظة</span>
                </button>

                <button
                  onClick={() => onConvertToAppointment(item)}
                  title="تحويل إلى موعد في التقويم"
                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>موعد</span>
                </button>

                <button
                  onClick={() => onConvertToProject(item)}
                  title="تحويل إلى مشروع متكامل"
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <FolderKanban className="w-3.5 h-3.5 text-indigo-600" />
                  <span>مشروع</span>
                </button>

                <button
                  onClick={() => onDeleteInboxItem(item.id)}
                  title="حذف من الوارد"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {inbox.length === 0 && (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
            <CheckCircle className="w-8 h-8 text-teal-500 mx-auto mb-2 opacity-60" />
            <h3 className="font-bold text-slate-700 text-sm">صندوق الوارد فارغ تماماً (Inbox Zero)!</h3>
            <p className="text-xs text-slate-400 mt-1">كافة الأفكار تم فرزها وتحويلها إلى أعمال ومشاريع مجدولة.</p>
          </div>
        )}
      </div>
    </div>
  );
};
