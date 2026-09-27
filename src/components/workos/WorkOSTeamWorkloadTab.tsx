import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  TeamMember,
  WorkTask,
  WorkProject,
} from '../../types/workos';

interface WorkOSTeamWorkloadTabProps {
  team: TeamMember[];
  tasks: WorkTask[];
  projects: WorkProject[];
  onOpenTaskDetail: (task: WorkTask) => void;
}

export const WorkOSTeamWorkloadTab: React.FC<WorkOSTeamWorkloadTabProps> = ({
  team = [],
  tasks = [],
  projects = [],
  onOpenTaskDetail,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter tasks based on project
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedProjectId !== 'all' && t.projectId !== selectedProjectId) return false;
      return true;
    });
  }, [tasks, selectedProjectId]);

  // Compute workload per member
  const memberWorkloads = useMemo(() => {
    return team
      .filter((m) => selectedDept === 'all' || m.department === selectedDept)
      .map((member) => {
        const memberTasks = filteredTasks.filter((t) => t.assigneeId === member.id);
        const currentTasks = memberTasks.filter((t) => t.status !== 'completed');
        const completedTasks = memberTasks.filter((t) => t.status === 'completed');
        const overdueTasks = currentTasks.filter(
          (t) => t.dueDate && t.dueDate < todayStr
        );
        const urgentTasks = currentTasks.filter((t) => t.priority === 'urgent');

        const completionRate =
          memberTasks.length > 0
            ? Math.round((completedTasks.length / memberTasks.length) * 100)
            : 0;

        // Workload stress indicator:
        // أخضر (منخفض): 0-3 مهام نشطة
        // برتقالي (متوسط): 4-7 مهام نشطة
        // أحمر (مرتفع): 8+ مهام نشطة أو وجود مهام متأخرة عاجلة
        let stressLevel: 'low' | 'medium' | 'high' = 'low';
        if (currentTasks.length >= 8 || overdueTasks.length >= 3) {
          stressLevel = 'high';
        } else if (currentTasks.length >= 4 || overdueTasks.length >= 1) {
          stressLevel = 'medium';
        }

        return {
          member,
          totalCount: memberTasks.length,
          currentCount: currentTasks.length,
          completedCount: completedTasks.length,
          overdueCount: overdueTasks.length,
          urgentCount: urgentTasks.length,
          completionRate,
          stressLevel,
          currentTasks,
        };
      });
  }, [team, filteredTasks, selectedDept, todayStr]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    team.forEach((m) => {
      if (m.department) set.add(m.department);
    });
    return Array.from(set);
  }, [team]);

  return (
    <div className="space-y-4" dir="rtl">
      {/* Filtering Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-700" />
          <span className="font-bold text-slate-800">مراقبة وتوزيع عبء الفريق</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold">القسم:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer font-medium"
            >
              <option value="all">كل الأقسام</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-bold">المشروع:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer font-medium"
            >
              <option value="all">كل المشاريع</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Legend Indicator */}
      <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200/80 text-[11px] font-bold text-slate-600">
        <span className="text-slate-400">مؤشرات مستوى ضغط العمل:</span>
        <span className="flex items-center gap-1.5 text-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>عبء منخفض (0 - 3 مهام)</span>
        </span>
        <span className="flex items-center gap-1.5 text-amber-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>عبء متوسط (4 - 7 مهام)</span>
        </span>
        <span className="flex items-center gap-1.5 text-rose-700">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span>عبء مرتفع (8+ مهام أو تأخير)</span>
        </span>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memberWorkloads.map((item) => {
          const isExpanded = expandedMemberId === item.member.id;

          let stressBadge = (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>عبء منخفض</span>
            </span>
          );

          if (item.stressLevel === 'medium') {
            stressBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>عبء متوسط</span>
              </span>
            );
          } else if (item.stressLevel === 'high') {
            stressBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>عبء مرتفع!</span>
              </span>
            );
          }

          return (
            <div
              key={item.member.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex flex-col justify-between space-y-3 hover:border-slate-300 transition"
            >
              {/* Member Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-teal-800 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                    {item.member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.member.name}</h3>
                    <span className="text-[11px] text-slate-400 block">{item.member.role || 'عضو الفريق'}</span>
                  </div>
                </div>
                {stressBadge}
              </div>

              {/* Workload Metric Chips */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs py-1">
                <div className="p-2 bg-slate-50 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-bold">الحالية</span>
                  <span className="font-black font-mono text-slate-900 text-sm">{item.currentCount}</span>
                </div>

                <div className="p-2 bg-emerald-50/60 rounded-xl">
                  <span className="text-[10px] text-emerald-700 block font-bold">المكتملة</span>
                  <span className="font-black font-mono text-emerald-700 text-sm">{item.completedCount}</span>
                </div>

                <div className="p-2 bg-rose-50/60 rounded-xl">
                  <span className="text-[10px] text-rose-700 block font-bold">المتأخرة</span>
                  <span className="font-black font-mono text-rose-700 text-sm">{item.overdueCount}</span>
                </div>

                <div className="p-2 bg-amber-50/60 rounded-xl">
                  <span className="text-[10px] text-amber-700 block font-bold">العاجلة</span>
                  <span className="font-black font-mono text-amber-700 text-sm">{item.urgentCount}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold">
                  <span>نسبة الإنجاز الإجمالية:</span>
                  <span className="font-mono text-teal-800">{item.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Toggle show assigned tasks */}
              <button
                type="button"
                onClick={() => setExpandedMemberId(isExpanded ? null : item.member.id)}
                className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border border-slate-200"
              >
                <span>المهام المكلف بها ({item.currentCount})</span>
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Expanded Tasks List */}
              {isExpanded && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                  {item.currentTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onOpenTaskDetail(t)}
                      className="p-2 bg-slate-50 hover:bg-teal-50 rounded-lg text-xs flex items-center justify-between cursor-pointer transition"
                    >
                      <span className="font-medium text-slate-800 truncate max-w-[170px]">{t.title}</span>
                      <span className="font-mono text-[10px] text-slate-400">{t.dueDate}</span>
                    </div>
                  ))}

                  {item.currentTasks.length === 0 && (
                    <div className="text-center py-2 text-slate-400 text-xs">
                      لا توجد مهام نشطة حالياً.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
