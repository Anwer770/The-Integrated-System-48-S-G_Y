# Work OS Unified — Implementation Tasks (Task Checklist)

**Version:** 1.0.0  
**Status:** In Progress / Maintenance & Continuous Verification

---

## EPIC 0: Discovery, Architecture Mapping & Safety Registry
- [x] **T001**: إجراء مسح كامل لجميع ملفات المشروع ومكونات العرض والتخزين.
- [x] **T002**: إنشاء وتوثيق دستور المشروع ومبادئ الحفاظ على البيانات (`.specify/constitution.md`).
- [x] **T003**: توثيق المواصفات الدقيقة وسجل المكونات المحمية (`.specify/spec.md`).
- [x] **T004**: إعداد خطة التنفيذ المرحلية وجدول الاعتماديات (`.specify/plan.md`).

---

## EPIC 1: Decoupling App.tsx & Core Architecture
- [x] **T010**: تفكيك `App.tsx` وتوزيع المسؤوليات على `AppProviders` و `AppRouter`.
- [x] **T011**: إنشاء طبقة معالجة الأخطاء الشاملة `AppErrorBoundary.tsx`.
- [x] **T012**: توحيد مصفوفة الصلاحيات لجميع الأدوار (`admin`, `accountant`, `sales`, `viewer`) في `PermissionMatrix.ts`.
- [x] **T013**: توحيد تصدير المسارات والأنواع المشتركة في `src/shared/`.

---

## EPIC 2: Unified Repository & Service Layer
- [x] **T020**: بناء `BaseRepository<T>` بدعم الكاش المتزامن ومحرك التخزين المحلي.
- [x] **T021**: بناء وتفعيل `CustomerRepository` و `DoctorRepository`.
- [x] **T022**: بناء وتفعيل `FinancialRepository` مع دعم عكس القيود المحاسبية (`reverseTransaction`).
- [x] **T023**: بناء وتفعيل `ProductRepository` و `StockMovementRepository` وحماية تسلسل السندات (`IN/OUT`).
- [x] **T024**: بناء وتفعيل `DebtRepository`, `SuiteTaskRepository`, و `CommitmentRepository`.
- [x] **T025**: بناء وتفعيل مستودعات `CustodyRepository`, `NotesRepository`, `RoutinesRepository`, `LinksRepository`.
- [x] **T026**: استخراج خدمات الأعمال المركزية (`FinancialService`, `InventoryService`, `DebtService`, `TaskService`).
- [x] **T027**: بناء خدمة المؤشرات الحية للوحة التحكم `DashboardService` بالاعتماد الحصري على الأرقام الحقيقية.

---

## EPIC 3: Performance, Pagination & Mobile Experience
- [x] **T030**: بناء مكون الترقيم الموحد عالي الأداء `src/components/common/Pagination.tsx`.
- [x] **T031**: دمج الترقيم والتقسيم في السجل المالي (`FinancialModule.tsx`) لسرعة استجابة تفوق 10,000 قيد.
- [x] **T032**: دمج الترقيم في سجل حركات الصرف والتوريد للمخزون (`RecordsView.tsx`).
- [x] **T033**: دمج الترقيم في دفاتر الديون والذمم (`DebtLedgerTable.tsx`).
- [x] **T034**: دمج الترقيم في دليل العملاء والصيدليات (`CustomerDirectory.tsx`).
- [x] **T035**: تفعيل وضع عرض البطاقات التفاعلية للهواتف المحمولة (`Mobile Card View`) في السجل المالي والمخزون والديون ودليل العملاء.
- [x] **T036**: بناء محرك البحث الشامل الموحد السريع `GlobalSearchModal.tsx` وربطه باختصار لوحة المفاتيح `Ctrl+K`.
- [x] **T037**: توحيد نافذة تأكيد العمليات الحساسة والحذف الآمن `DeleteConfirmModal.tsx` في السجل المالي والمخزون والديون والعملاء.

---

## EPIC 4: Field Invoicing & Multi-Format Printing Engine
- [x] **T040**: بناء `StockVoucherModal.tsx` لدعم طباعة سندات المخزون (A4 + حراري 80mm + QR + مشاركة واتساب).
- [x] **T041**: بناء `DebtVoucherModal.tsx` لطباعة وإشعار سندات الديون (A4 + حراري 80mm + QR + مشاركة واتساب).
- [x] **T042**: فحص وربط `FinancialVoucherModal.tsx` مع القيود المحاسبية وتعدد العملات (`YER / SAR / USD`).

---

## EPIC 5: Quality Assurance, Safety Audit & Regression Gate
- [x] **T050**: التحقق من عدم المساس بأي Data Contract في النماذج المحمية (100% Unchanged Data Contracts).
- [x] **T051**: فحص الـ TypeScript Type Safety بالأداة `lint_applet` (`tsc --noEmit`).
- [x] **T052**: بناء حزمة الإنتاج بنجاح تام عبر `compile_applet`.
- [ ] **T053**: مراقبة دورية لملاحظات المستخدم الميدانية والتحسينات المستقبلية.
