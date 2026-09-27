import React from 'react';
import { AutomationRule } from '../../types/workos';
import { Cpu, Zap, CheckCircle2, Play, ToggleLeft, ToggleRight, Clock } from 'lucide-react';

interface WorkOSAutomationViewProps {
  automations: AutomationRule[];
  onToggleAutomation: (id: string) => void;
  onExecuteAutomationManually: (rule: AutomationRule) => void;
}

export const WorkOSAutomationView: React.FC<WorkOSAutomationViewProps> = ({
  automations,
  onToggleAutomation,
  onExecuteAutomationManually,
}) => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">محرك الأتمتة وقواعد سير العمل (Automation Engine)</h2>
            <p className="text-[11px] text-slate-500">تنفيذ الإجراءات التلقائية عند تغير حالات المهام والمشاريع والمواعيد</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {automations.map((rule) => {
          return (
            <div
              key={rule.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                rule.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60 bg-slate-50'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <Zap className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{rule.name}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{rule.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>تم التنفيذ تلقائياً: <strong className="font-mono text-slate-700">{rule.executionsCount} مرة</strong></span>
                  {rule.lastExecutedAt && (
                    <>
                      <span>•</span>
                      <span>آخر تنفيذ: <strong className="font-mono">{rule.lastExecutedAt.split('T')[0]}</strong></span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => onExecuteAutomationManually(rule)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-teal-700" />
                  <span>تشغيل تجريبي</span>
                </button>

                <button
                  onClick={() => onToggleAutomation(rule.id)}
                  className="cursor-pointer"
                  title={rule.isActive ? 'تعطيل القاعدة' : 'تفعيل القاعدة'}
                >
                  {rule.isActive ? (
                    <ToggleRight className="w-8 h-8 text-teal-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
