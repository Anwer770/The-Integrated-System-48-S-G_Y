# Work OS Unified — Implementation Plan

**Version:** 1.0.0  
**Methodology:** Incremental Refactoring + Safe Continuous Integration + Regression Verification Gate

---

## Phases Overview

```text
Phase 0: Discovery & Inventory Audit
       ↓
Phase 1: Baseline Architecture & Safety Locks
       ↓
Phase 2: Decoupled Core & Repositories Extraction
       ↓
Phase 3: Domain Services & Business Logic Unification
       ↓
Phase 4: High-Performance UI (Pagination & Mobile Cards)
       ↓
Phase 5: Field Print & Invoicing Engine (A4 & 80mm Thermal + WhatsApp)
       ↓
Phase 6: Multi-Domain Regression & Final Validation Gate
```

---

## Detailed Phases Execution

### Phase 0 — Discovery & Baseline Audit (مكتملة ومحققة)
* فحص شجرة الملفات والـ Components والنماذج.
* جرد الـ Data Models والـ Local Storage keys ونقاط الدخول.
* استخراج سجل المكونات المحمية (**Protected Components Registry**).

### Phase 1 & 2 — Repository Pattern & Architecture Decoupling (مكتملة ومحققة)
* تفكيك ملف `App.tsx` إلى طبقة موفري سياق معيارية وموجه تنفيذي (`AppRouter`).
* بناء طبقة المستودعات الموحدة `src/database/repositories/` لكل من:
  * `CustomerRepository`, `DoctorRepository`
  * `FinancialRepository` (مع دعم عكس القيود المحاسبية الآمن)
  * `ProductRepository`, `StockMovementRepository`
  * `DebtRepository`, `SuiteTaskRepository`, `CommitmentRepository`
  * `CustodyRepository`, `NotesRepository`, `RoutinesRepository`, `LinksRepository`
* بناء طبقة الـ Services (`FinancialService`, `InventoryService`, `DebtService`, `DashboardService`, إلخ).

### Phase 3 — Safety & Synchronization Architecture (مكتملة ومحققة)
* تشغيل طابور المزامنة `Outbox` ومحرك التدقيق `AuditService`.
* تأسيس مخططات قاعدة البيانات العلائقية الجاهزة للمستقبل (`SqliteSchema.ts`).
* حاجز الحماية من الأخطاء `AppErrorBoundary.tsx` ومصفوفة الصلاحيات الموحدة `PermissionMatrix.ts`.

### Phase 4 — High-Volume Pagination & Mobile Card Views (مكتملة ومحققة)
* تطوير ونشر مكون الترقيم الموحد `src/components/common/Pagination.tsx`.
* دعم الترقيم والتقسيم في:
  * السجل المالي (`FinancialModule.tsx`)
  * سجل حركات المخزون (`RecordsView.tsx`)
  * سجل الديون والذمم (`DebtLedgerTable.tsx`)
  * دليل العملاء والصيدليات (`CustomerDirectory.tsx`)
* نشر وضع عرض البطاقات التفاعلية للهواتف المحمولة (`Mobile Card View`) في كافة الشاشات الميدانية.

### Phase 5 — Printing & Invoicing Engine (A4 & 80mm Thermal) (مكتملة ومحققة)
* بناء وتفعيل `StockVoucherModal.tsx` لمعاينة وطباعة سندات الصرف والتوريد (A4 + حراري 80mm + واتساب + QR).
* بناء وتفعيل `DebtVoucherModal.tsx` لطباعة وإشعار سندات الديون (A4 + حراري 80mm + واتساب + QR).
* تفعيل وتدقيق `FinancialVoucherModal.tsx` للسندات المالية وتعدد العملات.

### Phase 6 — Continuous Regression & Verification (بوابة القبول النهائي)
* فحص دوري لكافة الـ Protected Components والتأكد من مطابقة الـ Data Contracts بنسبة 100%.
* التحقق من سلامة البناء بالأمر `compile_applet` واجتياز الـ Linter (`tsc --noEmit`) دون أي أخطاء.
