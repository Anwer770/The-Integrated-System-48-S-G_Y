import React, { useState, useMemo } from 'react';
import {
  FolderKanban,
  LayoutGrid,
  Table as TableIcon,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronLeft,
  X,
  Plus,
  Play,
  CheckSquare,
  FileText,
  Activity,
  Paperclip,
  Share2,
} from 'lucide-react';
import {
  WorkProject,
  WorkTask,
  TeamMember,
  ProjectStatus,
  TaskPriority,
} from '../../types/workos';

interface WorkOSProjectsTabProps {
  projects: WorkProject[];
  tasks: WorkTask[];
  team: TeamMember[];
  onOpenTaskDetail: (task: WorkTask) => void;
  onNavigateToTasksWithProject: (projectId: string) => void;
  onUpdateProject?: (project: WorkProject) => void;
}

export const WorkOSProjectsTab: React.FC<WorkOSProjectsTabProps> = ({
  projects = [],
  tasks = [],
  team = [],
  onOpenTaskDetail,
  onNavigateToTasksWithProject,
  onUpdateProject,
}) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);
  const [projectDetailTab, setProjectDetailTab] = useState<
    'overview' | 'tasks' | 'timeline' | 'team' | 'budget' | 'attachments' | 'activity'
  >('overview');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Compute status helpers
  const getProjectStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            قيد التنفيذ
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            مكتمل
          </span>
        );
      case 'delayed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            متأخر
          </span>
        );
      case 'paused':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            متوقف
          </span>
        );
      case 'planned':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            لم يبدأ
          </span>
        );
    }
  };

  const getPriorityBadge = (pri: TaskPriority) => {
    switch (pri) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">حرجة</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">عالية</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">متوسطة</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">منخفضة</span>;
    }
  };

  // Helper calculation for project tasks
  const getProjectStats = (projId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projId);
    const completedTasks = projectTasks.filter((t) => t.status === 'completed');
    const remainingTasks = projectTasks.filter((t) => t.status !== 'completed');
    const overdueTasks = remainingTasks.filter((t) => t.dueDate && t.dueDate < todayStr);

    const calculatedProgress =
      projectTasks.length > 0
        ? Math.round((completedTasks.length / projectTasks.length) * 100)
        : 0;

    return {
      total: projectTasks.length,
      completed: completedTasks.length,
      remaining: remainingTasks.length,
      overdue: overdueTasks.length,
      progress: calculatedProgress,
      tasks: projectTasks,
    };
  };

  // If a project detail is open, render the 7-tab detailed page/view
  if (selectedProject) {
    const stats = getProjectStats(selectedProject.id);

    return (
      <div className="space-y-4" dir="rtl">
        {/* Breadcrumb & Navigation Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProject(null)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
              title="العودة إلى قائمة المشاريع"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-slate-400 font-bold">{selectedProject.code}</span>
                <h2 className="text-base font-black text-slate-900">{selectedProject.name}</h2>
                {getProjectStatusBadge(selectedProject.status)}
                {getPriorityBadge(selectedProject.priority)}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{selectedProject.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTasksWithProject(selectedProject.id)}
              className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
              <span>لوحة المهام ({stats.total})</span>
            </button>
            <button
              onClick={() => setSelectedProject(null)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              إغلاق التفاصيل
            </button>
          </div>
        </div>

        {/* 7 Detailed Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-200 px-4 bg-slate-50/50 text-xs font-bold overflow-x-auto no-scrollbar">
            <button
              onClick={() => setProjectDetailTab('overview')}
              className={`py-3 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
                projectDetailTab === 'overview'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              نظرة عامة
            </button>

            <button
              onClick={() => setProjectDetailTab('tasks')}
              className={`py-3 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                projectDetailTab === 'tasks'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>مهام المشروع</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono">
                {stats.total}
              </span>
            </button>

            <button
              onClick={() => setProjectDetailTab('timeline')}
              className={`py-3 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
                projectDetailTab === 'timeline'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              الجدول الزمني
            </button>

            <button
              onClick={() => setProjectDetailTab('team')}
              className={`py-3 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
                projectDetailTab === 'team'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              الفريق والمسؤوليات
            </button>

            <button
              onClick={() => setProjectDetailTab('budget')}
              className={`py-3 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
                projectDetailTab === 'budget'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              الميزانية والتكاليف
            </button>

            <button
              onClick={() => setProjectDetailTab('attachments')}
              className={`py-3 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
                projectDetailTab === 'attachments'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              المرفقات
            </button>

            <button
              onClick={() => setProjectDetailTab('activity')}
              className={`py-3 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap ${
                projectDetailTab === 'activity'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              سجل النشاط
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6">
            {/* 1. OVERVIEW */}
            {projectDetailTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block mb-1">نسبة الإنجاز الفعلية</span>
                    <span className="text-xl font-black font-mono text-teal-800">{stats.progress}%</span>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div className="bg-teal-600 h-full rounded-full" style={{ width: `${stats.progress}%` }} />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block mb-1">المهام المكتملة</span>
                    <span className="text-xl font-black font-mono text-emerald-700">
                      {stats.completed} <span className="text-xs text-slate-400 font-normal">من {stats.total}</span>
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-[11px] text-slate-500 block mb-1">المهام المتبقية</span>
                    <span className="text-xl font-black font-mono text-blue-700">{stats.remaining}</span>
                  </div>

                  <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200">
                    <span className="text-[11px] text-rose-700 block mb-1 font-bold">مهام متأخرة</span>
                    <span className="text-xl font-black font-mono text-rose-700">{stats.overdue}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">المعلومات الإدارية:</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">مدير المشروع:</span>
                        <strong className="text-slate-800">{selectedProject.manager}</strong>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">تاريخ البداية:</span>
                        <span className="font-mono text-slate-700">{selectedProject.startDate || 'غير محدد'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-slate-500">تاريخ النهاية المستهدف:</span>
                        <span className="font-mono text-slate-700 font-bold">{selectedProject.dueDate || 'غير محدد'}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">التصنيف:</span>
                        <span className="text-slate-800 font-medium">{selectedProject.category || 'عام'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900">الوصف وأهداف المبادرة:</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                      {selectedProject.description || 'لا يوجد وصف مدخل لهذا المشروع حتى الآن.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PROJECT TASKS */}
            {projectDetailTab === 'tasks' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">قائمة المهام المرتبطة بهذا المشروع:</span>
                  <span className="text-xs text-slate-500 font-mono">{stats.total} مهمة مسجلة</span>
                </div>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {stats.tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onOpenTaskDetail(t)}
                      className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 cursor-pointer transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{t.taskNumber}</span>
                        <span className="text-xs font-bold text-slate-900">{t.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-slate-500">{t.dueDate}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {t.status === 'completed' ? 'مكتملة' : 'قيد التنفيذ'}
                        </span>
                      </div>
                    </div>
                  ))}

                  {stats.tasks.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      لا توجد مهام مسندة لهذا المشروع بعد.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. TIMELINE */}
            {projectDetailTab === 'timeline' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <span>فترة المشروع: من <strong className="font-mono">{selectedProject.startDate}</strong> إلى <strong className="font-mono">{selectedProject.dueDate}</strong></span>
                  <span className="text-teal-700 font-bold">{stats.progress}% إنجاز زمني</span>
                </div>

                <div className="space-y-2">
                  {stats.tasks.map((t) => (
                    <div key={t.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{t.title}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400">{t.dueDate}</span>
                        <div className="w-24 bg-slate-100 rounded-full h-2">
                          <div className="bg-teal-600 h-full rounded-full" style={{ width: `${t.progress}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TEAM */}
            {projectDetailTab === 'team' && (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs text-indigo-900">
                  مدير المشروع الرئيسي: <strong>{selectedProject.manager}</strong>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {team.map((m) => (
                    <div key={m.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{m.name}</span>
                          <span className="text-[10px] text-slate-400">{m.role}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {stats.tasks.filter((t) => t.assigneeId === m.id).length} مهام
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. BUDGET */}
            {projectDetailTab === 'budget' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">الميزانية التقديرية المعتمدة:</span>
                    <span className="text-xl font-black font-mono text-slate-900">
                      {selectedProject.budget ? selectedProject.budget.toLocaleString() : '0'} YER
                    </span>
                  </div>
                  <DollarSign className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
            )}

            {/* 6. ATTACHMENTS */}
            {projectDetailTab === 'attachments' && (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                <Paperclip className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700">لا توجد مستندات مرفقة للمشروع حالياً</p>
                <p className="text-[10px] mt-1">يمكن رفع كراسة الشروط، العقود، والتقارير الفنية</p>
              </div>
            )}

            {/* 7. ACTIVITY */}
            {projectDetailTab === 'activity' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">تم تسجيل وتأسيس المشروع في النظام</span>
                  <span className="font-mono text-slate-400">{selectedProject.startDate || 'سابقاً'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Projects Main List (Cards or Table)
  return (
    <div className="space-y-4" dir="rtl">
      {/* Switcher & Sub-header */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800">
            مشاريع ومبادرات العمل ({projects.length})
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'cards' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="عرض البطاقات"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="عرض الجدول"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const stats = getProjectStats(project.id);

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                {/* Header of card */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 font-bold block">
                        {project.code}
                      </span>
                      <h3 className="font-black text-slate-900 text-sm">{project.name}</h3>
                    </div>
                    {getProjectStatusBadge(project.status)}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {project.description || 'مشروع تنفيذي بدون وصف مسجل.'}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>نسبة الإنجاز:</span>
                    <span className="font-mono text-indigo-700">{stats.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.progress}%` }}
                    />
                  </div>
                </div>

                {/* Detailed stats chips */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-100">
                  <div className="p-1.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">المكتملة</span>
                    <span className="font-black font-mono text-emerald-700">{stats.completed}</span>
                  </div>

                  <div className="p-1.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">المتبقية</span>
                    <span className="font-black font-mono text-blue-700">{stats.remaining}</span>
                  </div>

                  <div className="p-1.5 bg-rose-50/60 rounded-xl">
                    <span className="text-[10px] text-rose-700 block font-bold">المتأخرة</span>
                    <span className="font-black font-mono text-rose-700">{stats.overdue}</span>
                  </div>
                </div>

                {/* Manager & Dates */}
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>المدير: <strong className="text-slate-800">{project.manager}</strong></span>
                    </div>
                    {getPriorityBadge(project.priority)}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>البداية: {project.startDate || '—'}</span>
                    <span>النهاية: {project.dueDate || '—'}</span>
                  </div>
                </div>

                {/* Action Button: فتح المشروع */}
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200/80 hover:border-transparent"
                >
                  <span>فتح المشروع وتفاصيله</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">كود</th>
                <th className="py-3 px-4">اسم المشروع</th>
                <th className="py-3 px-4">المدير</th>
                <th className="py-3 px-4">الحالة</th>
                <th className="py-3 px-4">الأولوية</th>
                <th className="py-3 px-4">الإنجاز</th>
                <th className="py-3 px-4">مكتملة/متبقية</th>
                <th className="py-3 px-4">متأخرة</th>
                <th className="py-3 px-4">تاريخ الانتهاء</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((project) => {
                const stats = getProjectStats(project.id);

                return (
                  <tr key={project.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{project.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{project.name}</td>
                    <td className="py-3 px-4 text-slate-700">{project.manager}</td>
                    <td className="py-3 px-4">{getProjectStatusBadge(project.status)}</td>
                    <td className="py-3 px-4">{getPriorityBadge(project.priority)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${stats.progress}%` }} />
                        </div>
                        <span className="font-mono text-indigo-700 font-bold">{stats.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <span className="text-emerald-700 font-bold">{stats.completed}</span> / {stats.remaining}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {stats.overdue > 0 ? (
                        <span className="text-rose-600 font-bold">{stats.overdue}</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{project.dueDate}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg text-[11px] font-bold transition cursor-pointer"
                      >
                        فتح المشروع
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
