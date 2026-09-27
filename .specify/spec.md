# Work OS Unified — System & Product Specification

**Version:** 1.0.0  
**Status:** Approved & Living Specification  
**Architecture Pattern:** Clean Multi-Layer (UI → Presentation → Domain Services → Repositories → Persistence Engine)

---

## 1. Executive Purpose & Scope (نطاق المنظومة)
تحويل المنظومة الحالية إلى نظام إداري وتشغيلي موحد عالي الكفاءة (**Work OS Unified / Business Operating System**) لقطاع التوزيع والمبيعات والمستحضرات، يجمع الوحدات التالية في منصة واحدة تعمل في وضع عدم الاتصال أولاً (Offline-First):

1. **لوحة التحكم المركزية (Dashboard & Command Center):** مؤشرات حية، رصد الاستحقاقات المتأخرة، التنبيهات الذكية، وملخص مالي لحظي مستمد حصرياً من البيانات الفعلية.
2. **إدارة الأعمال والمهام (Work OS):** مهام (`Tasks`)، عمليات، أولويات (`A/B/C/D`)، التزامات، مهام روتينية متكررة (`Routines`)، تقويم، وسجل متابعة الأداء.
3. **علاقات العملاء والأطباء (CRM & Medical Rep):** دليل العملاء، تصنيفات الصيدليات، سجل الأطباء والعيادات، والزيارات الميدانية الدورية.
4. **المحاسبة والإدارة المالية (Financial & Treasury):** القيود اليومية، سندات القبض والصرف، عكس القيود (`Reversals`)، تعدد العملات (`YER / SAR / USD`)، ومطابقة القيود مع المخزون.
5. **إدارة المخزون والمستودعات (Stock & Inventory):** حركات التوريد والصرف (`IN/OUT`)، الترقيم المتسلسل، المخزون الحرج، تقييم الأرصدة، وطباعة السندات الحرارية (80mm) و A4.
6. **الديون والذمم والعهد (Debts & Custody):** دفاتر الديون الأربعة (`anwar`, `pms`, `taha`, `ali_qat`)، السداد الجزئي، الرصيد التراكمي، وإدارة عهد المندوبين.
7. **قاعدة المعرفة والروابط (Knowledge Base & Quick Links):** الملاحظات السريعة، تصنيف الوثائق، والروابط الإدارية الهامة.
8. **النسخ الاحتياطي والمزامنة (Sync & Backup Engine):** التصدير والاسترجاع الشامل (`JSON / Excel`)، طابور المزامنة السحابي (`Outbox/Inbox`)، ودعم العمل دون إنترنت عبر IndexedDB.

---

## 2. Protected Components Registry (سجل المكونات المحمية)

| المكون (Protected Component) | الملف المصدري | الوظيفة المحمية | عقد البيانات (Data Contract) |
|---|---|---|---|
| `CustomerModal` | `src/components/CustomerModal.tsx` | إضافة وتعديل العملاء والجهات | `Customer` entity (`id`, `name`, `phone`, `region`, `source`, `type`, `balance`) |
| `DoctorModal` | `src/components/doctors/DoctorModal.tsx` | إدارة بيانات الأطباء والعيادات | `DoctorRecord` entity (`id`, `name`, `specialty`, `clinic`, `phone`, `area`) |
| `RecordDoctorVisitModal` | `src/components/doctors/RecordDoctorVisitModal.tsx` | تسجيل زيارات الأطباء الميدانية | `DoctorVisitLog` entity (`id`, `doctorId`, `date`, `purpose`, `samples`, `notes`) |
| `RecordVisitModal` | `src/components/customers/RecordVisitModal.tsx` | تسجيل زيارات الصيدليات والعملاء | `CustomerVisitRecord` entity (`id`, `customerId`, `date`, `outcome`, `orders`) |
| `FinancialModal` | `src/components/financial/FinancialModal.tsx` | تسجيل القيود المحاسبية وسندات الخزينة | `FinancialTransaction` entity (`id`, `date`, `movement`, `restriction`, `amountYER`, `amountSAR`, `amountUSD`, `accountName`) |
| `FinancialVoucherModal` | `src/components/financial/FinancialVoucherModal.tsx` | معاينة وطباعة السندات المالية | قراءة وتصدير بيانات القيد مع QR Code |
| `MovementModal` | `src/components/MovementModal.tsx` | تسجيل حركات الصرف والتوريد المخزني | `MovementRecord` entity (`subId`, `mainId`, `movementType`, `date`, `beneficiary`, `items`, `category`) |
| `StockVoucherModal` | `src/components/stock/StockVoucherModal.tsx` | معاينة وطباعة سندات الصرف والتوريد (A4 & 80mm) | قراءة السند المخزني وحساب إجمالي الوحدات وتوليد QR |
| `DebtRecordModal` | `src/components/debts/DebtRecordModal.tsx` | تسجيل وتعديل قيود الديون (له/عليه) | `DebtRecord` entity (`id`, `book`, `name`, `date`, `debit`, `credit`, `currency`, `balance`) |
| `DebtVoucherModal` | `src/components/debts/DebtVoucherModal.tsx` | طباعة وإشعار سندات الديون (A4 & 80mm) | تنسيق ومشاركة سند القيد عبر WhatsApp والطباعة |
| `CommitmentModal` | `src/components/debts/CommitmentModal.tsx` | جدولة الالتزامات المالية ومتابعتها | `DebtCommitment` entity (`id`, `title`, `amount`, `currency`, `dueDate`, `status`) |
| `PartialPaymentModal` | `src/components/debts/PartialPaymentModal.tsx` | سداد الدفعات الجزئية وتحديث الأرصدة | تسجيل حركة السداد وتخفيض الرصيد المتبقي |
| `TaskModal` | `src/components/tasks/TaskModal.tsx` | إضافة وتحديث مهام المنظومة | `Task` entity (`id`, `title`, `pri`, `status`, `cat`, `op`, `resp`, `amount`) |

---

## 3. Architecture & Functional Specifications (المعمارية والمواصفات الوظيفية)

### 3.1 Data Flow Pattern
```text
User Action (UI View / Cards / Table)
        ↓
Domain Service Layer (FinancialService / InventoryService / DebtService)
        ↓
Repository Layer (BaseRepository → EntityRepository with Cache)
        ↓
Persistence Layer (IndexedDB Engine + Memory Fallback)
        ↓
Outbox Synchronization Queue (for cloud sync when online)
```

### 3.2 Key Specifications
* **Pagination Everywhere:** ترقيم موحد عبر `Pagination.tsx` لكافة الجداول الكبرى لضمان سرعة فائقة تفوق 10,000 سجل.
* **Dual View Mode (جدول ⟷ بطاقات):** خيار عرض بطاقات الهواتف الذكية لمندوبي المبيعات والمستودع.
* **Dual Printing Engine (A4 & Thermal 80mm):** تجهيز كافة الفواتير والسندات للطباعة الرسمية والحرارية مع رمز QR ومشاركة WhatsApp فورية.
* **Offline-First Resilience:** دعم العمل بدون إنترنت مع حفظ محلي دائم وآلية استرجاع احتياطي موحدة.
