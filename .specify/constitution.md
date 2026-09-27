# Work OS Unified — Project Constitution

**Version:** 1.0.0  
**Status:** Mandatory & Binding  
**Project Type:** Existing Application Refactoring & Enterprise Expansion  
**Development Strategy:** Refactor in Place + Preserve Behavior + Zero Data Loss + Protected Input Components

---

## Article 1 — Core Principle (المبدأ الأساسي)
هذا المشروع ليس مشروع إعادة بناء من الصفر (No Rewrites from Scratch).
القاعدة الذهبية الملزمة لجميع مراحل التطوير:
> **Refactor in Place + Preserve Behavior + Preserve Data + Protect Input Components**
يجب تطوير التطبيق الحالي داخل بنيته القائمة ومساراته المعتمدة، مع الحفاظ الصارم على البيانات والوظائف والعلاقات القائمة دون أي انقطاع في تجربة المستخدم أو سجلات النظام.

---

## Article 2 — Data Safety & Zero Data Loss (سلامة البيانات)
سلامة البيانات هي الأولوية الدستورية القصوى التي لا تخضع لأي مساومة:
1. يُمنع منعاً باتاً استدعاء `localStorage.clear()` أو مسح قواعد IndexedDB المعتمدة.
2. الحفاظ الكامل على المعرفات (`IDs`) التاريخية وسلاسل الترقيم التلقائي المعتمدة (`IN-XXXX`, `OUT-XXXX`, `T-XXXX`, إلخ).
3. منع كسر العلاقات بين الكيانات (العملاء، الأطباء، الزيارات، السجلات المالية، قيود الديون، حركات المخزون).
4. عدم إسقاط أي حقل أو خاصية من خصائص الكائنات أثناء التحديث.
5. أي تحديث في بنية المخططات (`Schema`) يجب أن يمر بآلية هجرة (`Migration`) آمنة متوافقة عكسياً مع النسخ الاحتياطية.

---

## Article 3 — Protected Input Components (المكونات المحمية)
كل مكون يُستخدم لإدخال أو تعديل أو إضافة بيانات يعتبر **Protected Component 🔒**.  
تشمل المكونات المحمية على سبيل المثال لا الحصر:
* `CustomerModal`
* `DoctorModal`
* `RecordDoctorVisitModal`
* `RecordVisitModal`
* `FinancialModal`
* `FinancialVoucherModal`
* `MovementModal`
* `StockVoucherModal`
* `DebtRecordModal`
* `DebtVoucherModal`
* `CommitmentModal`
* `PartialPaymentModal`
* `TaskModal`

**العناصر المحمية غير القابلة للتغيير العشوائي:**
* أسماء الحقول ومفتاح كل حقل (`Field Keys / Data Contract`)
* أنواع البيانات وتنسيقات التواريخ والمبالغ
* الترتيب الوظيفي للأقسام
* شروط التحقق (`Validation Rules`)
* القيم الافتراضية ودوال الحفظ والتعديل (`onSubmit`, `onSave`, `Callbacks`)

---

## Article 4 — Visual-Only Refactoring for Protected Zones (التطوير البصري فقط)
يُسمح بتطوير المكونات المحمية **بصرياً وأدائياً فقط**:
* تحسين التجاوب للهواتف والأجهزة اللوحية (`Responsive UI`).
* ترقية الطباعة والهوامش والظلال وفق الـ Design System.
* تعزيز سهولة الوصول (`Accessibility & Focus`).
* تسريع عمليات التصيير ومنع إعادة الرسم غير الضرورية (`Re-rendering Optimization`).

---

## Article 5 — CRUD & State Integrity (تكامل العمليات والحالة)
* الحفاظ على كافة عمليات `Create, Read, Update, Delete, Search, Filter, Sort, Pagination, Export, Import`.
* دعم مصدر حقيقة واحد للحالة لكل نطاق (`Single Source of Truth`).
* عدم تكرار التخزين في أكثر من مكان دون حاجة معمارية موثقة.

---

## Article 6 — AI Safety & Non-Destructive Actions (أمان الذكاء الاصطناعي)
الذكاء الاصطناعي أداة مساعدة للتحليل والاقتراح والتلخيص والبحث الدلالي؛ ولا يُسمح لأي نموذج ذكاء اصطناعي بتنفيذ عمليات حذف أو تعديل مالي مباشر دون موافقة وتأكيد يدوي صريح من المستخدم البشري:
```text
AI Suggestion → Validation → User Confirmation → Application Action
```

---

## Article 7 — Order of Priorities (ترتيب الأولويات الإجباري)
عند حدوث أي تعارض، يسري الترتيب التالي:
```text
1. سلامة البيانات الحالية (Data Safety)
        ↓
2. الحفاظ على وظائف التطبيق الحالية (Behavior Preservation)
        ↓
3. حماية شاشات الإدخال والنماذج (Protected Components)
        ↓
4. سلامة العمليات (CRUD Integrity)
        ↓
5. تكامل الأعمال المحاسبية والمخزنية (Business Logic)
        ↓
6. هندسة المعمارية النظيفة (Clean Architecture)
        ↓
7. تحسين الأداء والتجاوب (Performance & Responsive)
        ↓
8. الميزات الإضافية والتوسعات المستقبلية
```
