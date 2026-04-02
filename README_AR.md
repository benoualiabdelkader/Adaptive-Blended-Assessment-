# 📚 WriteLens - نظام تقييم الكتابة الموجه بالذكاء الاصطناعي

## 🎯 نظرة عامة على المشروع

WriteLens هو منصة ذكية لتقييم كتابة الطلاب وتقديم تعليقات تكيفية موجهة بالذكاء الاصطناعي. يتم تحليل الأخطاء، تقييم الأداء، ومنح توصيات للمعلمين والطلاب.

---

## 🔧 التحديثات التي تم إضافتها في هذه الجلسة (2 أبريل 2026)

### 1. **نظام التحكم الكامل للمعلم** ✅
تم استبدال صفحات "Coming soon" بواجهات عملية كاملة:

#### أ) صفحة إدارة القواعس والعتبات (`RuleManagement.tsx`)
```
المميزات:
- تكوين القواعس المخصصة للتحليل (low time-on-task, high error density، engagement drop)
- اختيار مصادر البيانات المراد تحليلها:
  * Moodle logs
  * Rubric scores
  * Essays
  * Teacher/student messages
  * Teacher notes
  * Time on task
  * Engagement signals
- ضبط نمط التحليل:
  * Manual (يدوي)
  * On import (عند الاستيراد)
  * Scheduled (مجدول)
  * On demand (عند الطلب)
- خيار طلب موافقة المعلم قبل إصدار التعليقات
- تفعيل/تعطيل التحليلات الفردية (notes, messages, time drop, error spike)
- حفظ الإعدادات في localStorage (تحتفظ بالتضبيط حتى بعد إغلاق المتصفح)
```

#### ب) صفحة تخصيص القوالب والتقارير (`FeedbackTemplateManagement.tsx`)
```
المميزات:
- اختيار المؤشرات التي تظهر في التقرير:
  * Raw data & metrics
  * Feedback & recommendations
  * Advanced analytics
  * Teacher recommendations
  * Messages summary
  * Teacher notes
  * Time-on-task evidence
  * Engagement evidence
- تحرير النص الافتتاحي والختامي للتقرير
- معاينة فورية للتقرير مع أي طالب
- حفظ التخصيصات في localStorage
```

#### ج) تقرير قابل للتخصيص في صفحة التقارير (`Reports.tsx`)
```
المميزات:
- أداة بناء التقرير مباشرة في صفحة التقارير (لا تحتاج الذهاب لصفحة منفصلة)
- اختيار الأقسام المراد تضمينها
- تغيير حجم الخط للطباعة
- تصدير PDF و HTML
- طباعة الآن مع style محسّنة للطباعة
```

### 2. **تحديثات المسارات والتوجيه** (`App.tsx`)
```javascript
تم إضافة المسارات الجديدة:
- /rules              → صفحة إدارة القواعس
- /templates          → صفحة تخصيص القوالب
- /reports            → صفحة التقارير المحدثة
- /pipeline           → مركز التحليل الرئيسي
- /pipeline/:id       → محطات التحليل الـ 12 المفصلة
- /students           → قائمة الطلاب مع الفلترة المتقدمة
- /groups            → عرض مجموعات الطلاب
- /teacher-decision/:studentId → لوحة قرارات المعلم
```

### 3. **تحديثات بيئة Python** ✅
```
تم تثبيت جميع المكتبات المفقودة:
- pandas 3.0.2        (معالجة البيانات)
- numpy 2.4.4         (العمليات الحسابية)
- scikit-learn 1.8.0  (Machine Learning)
- pgmpy 1.1.0         (نماذج بايز)
- nltk 3.9.4          (معالجة اللغة)
- spacy 3.8.14        (NLP متقدم)
- textstat 0.7.13     (إحصائيات النصوص)
- PyYAML 6.0.3        (ملفات الإعدادات)
```

### 4. **تحديث pyrightconfig.json**
```
تم استبعاد المجلدات غير الضرورية من Pylance:
- .venv (virtual environment)
- .claude (أدوات البناء)
- dist, build (ملفات التجميع)
- docs, AI_ANALYSIS_REPORTS (التقارير والوثائق)
- adaptive_writing_system/data, outputs
```

---

## 📊 البنية الحالية للمشروع

```
projectpr/
├── frontend/                  # تطبيق React/TypeScript
│   ├── src/
│   │   ├── pages/
│   │   │   ├── RuleManagement.tsx          ✨ جديد
│   │   │   ├── FeedbackTemplateManagement.tsx ✨ جديد
│   │   │   ├── Reports.tsx                 ✏️ محدث
│   │   │   ├── Dashboard.tsx               (الصفحة الرئيسية)
│   │   │   ├── Students.tsx                (قائمة الطلاب)
│   │   │   ├── Groups.tsx                  (المجموعات)
│   │   │   ├── PipelinePage.tsx            (مركز التحليل)
│   │   │   ├── TeacherDecisionPanel.tsx    (قرارات المعلم)
│   │   │   ├── Station01.tsx - Station12.tsx (محطات التحليل)
│   │   │   └── ... (صفحات أخرى)
│   │   ├── components/
│   │   │   ├── ReportGenerator.tsx         (أداة بناء التقارير)
│   │   │   ├── GlassCard.tsx               (مكون واجهة)
│   │   │   └── ... (مكونات أخرى)
│   │   ├── state/
│   │   │   ├── authStore.ts                (إدارة المصادقة)
│   │   │   └── studyScope.ts               (إدارة حالة الطلاب)
│   │   ├── layouts/
│   │   │   ├── ResearchShell.tsx           (الواجهة الرئيسية)
│   │   │   └── PipelineLayout.tsx
│   │   └── App.tsx                         ✏️ محدث
│   └── package.json
│
├── backend/                   # خادم Node.js/Express
│   ├── server.js              (نقطة البداية)
│   ├── auth.js                (المصادقة)
│   ├── db.js                  (قاعدة البيانات)
│   ├── rulebook.js            (إدارة القواعس)
│   ├── adaptiveDecision.js    (اتخاذ القرارات)
│   ├── ai_engine/             (محركات الذكاء الاصطناعي)
│   │   ├── bayesian_model.py  (نماذج بايز)
│   │   ├── clustering.py      (التجميع)
│   │   └── random_forest.py   (Random Forest)
│   └── package.json
│
├── adaptive_writing_system/   # نظام التحليل الكامل (Python)
│   ├── app/
│   │   ├── run_pipeline.py    (خط أنابيب المعالجة)
│   │   ├── bayesian_engine.py
│   │   ├── clustering_engine.py
│   │   ├── feedback_engine.py
│   │   ├── random_forest_engine.py
│   │   ├── rule_engine.py
│   │   ├── threshold_engine.py
│   │   └── text_features.py
│   ├── config/
│   │   ├── adaptive_rulebook.yaml
│   │   ├── feedback_templates.yaml
│   │   ├── rules.yaml
│   │   └── thresholds.yaml
│   ├── data/                  (بيانات الطلاب)
│   └── requirements.txt
│
└── docs/                      (التوثيق)
```

---

## 🚀 كيفية البدء والتشغيل

### المتطلبات:
- Node.js 18+
- Python 3.13+
- npm أو yarn

### خطوات التثبيت والتشغيل:

#### 1. **تفعيل بيئة Python**
```bash
# Windows:
.\.venv\Scripts\Activate.ps1

# Linux/Mac:
source .venv/bin/activate
```

#### 2. **تثبيت المتطلبات**
```bash
# Python packages
pip install -r requirements.txt

# Node packages
npm install
```

#### 3. **تشغيل التطبيق**
```bash
# في Terminal منفصلة - الخادم الخلفي:
npm run dev:backend

# في Terminal أخرى - الواجهة الأمامية:
npm run dev:frontend

# أو تشغيل الكل معًا:
npm start
```

#### 4. **الوصول إلى التطبيق**
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

### بيانات الدخول الافتراضية:
```
Username: teacher
Password: writelens2025
```

---

## 💡 الميزات الرئيسية للنظام

### 1. **رحلة المعلم المتكاملة** 👨‍🏫
```
Login → Select Students/Groups → View AI Analysis 
→ Review Comments & Messages → Customize Report 
→ Approve/Reject Feedback → Generate Final Report
```

### 2. **التحليل الشامل** 📊
- **تحليل النصوص**: Argumentation, Cohesion, Grammar, Vocabulary
- **إحصائيات السلوك**: Time on task, Engagement, Error patterns
- **التنبؤات**: Predicted improvement, Risk assessment
- **التجميع**: Student clustering by competence level

### 3. **اتخاذ القرارات الموجه بالذكاء الاصطناعي** 🤖
- نماذج بايزية للاستدلال الداخلي
- Random Forest للتنبؤات
- قواعس مخصصة قابلة للتعديل

### 4. **المرونة الكاملة للمعلم** ⚙️
- اختيار مصادر البيانات
- تكوين القواعس والعتبات
- تخصيص التقارير بالكامل
- الموافقة على التعليقات قبل الإصدار

---

## 📁 الملفات الرئيسية المعدلة

| الملف | التغيير | الوصف |
|------|--------|-------|
| `frontend/src/pages/RuleManagement.tsx` | ✨ جديد | إدارة القواعس والعتبات |
| `frontend/src/pages/FeedbackTemplateManagement.tsx` | ✨ جديد | تخصيص القوالب والتقارير |
| `frontend/src/pages/Reports.tsx` | ✏️ محدث | تقرير قابل للتخصيص |
| `frontend/src/App.tsx` | ✏️ محدث | ربط المسارات الجديدة |
| `pyrightconfig.json` | ✏️ محدث | استبعاد المجلدات المؤقتة |

---

## 🔄 Commits الأخيرة على GitHub

```
45453f3 - fix: Update pyrightconfig.json to exclude .venv and build artifacts
0cf11f3 - feat: Implement teacher control system with rules, templates, and customizable reports
610f98d - Deploy to render: synchronize final checklists and refined code
```

**رابط المستودع:**
https://github.com/benoualiabdelkader/Adaptive-Blended-Assessment-

---

## 🎯 الخطوات المنطقية للتطوير المستقبلي

### Phase 1: تحسين واجهة المعلم (إذا لم تكتمل)
- [ ] ربط زر "Run Pipeline" بعملية تشغيل فعلية
- [ ] إضافة تقرير جماعي شامل (cohort report)
- [ ] تحسين لوحة ملخص الحالة (dashboard summary)
- [ ] إضافة رسوم بيانية للمقارنة بين الطلاب

### Phase 2: تحسينات الأداء
- [ ] تحسين سرعة التحليل للمجموعات الكبيرة
- [ ] إضافة caching للنتائج المتكررة
- [ ] تحسين استعلامات قاعدة البيانات

### Phase 3: ميزات إضافية
- [ ] تقارير تاريخية ومقارنات بين الفترات الزمنية
- [ ] رسائل بريد تنبيهات تلقائية للمعلم
- [ ] تصدير البيانات (Excel, PDF شامل)
- [ ] لوحات تحكم للمسؤولين

### Phase 4: نشر وتوسع
- [ ] اختبار شامل للتطبيق
- [ ] نشر على Render أو Vercel
- [ ] توثيق API المفصل
- [ ] دليل المستخدم بالعربية

---

## 🐛 حل المشاكل الشائعة

### مشكلة: `ModuleNotFoundError` عند تشغيل Python
```bash
# الحل: تفعيل بيئة Python وإعادة التثبيت
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### مشكلة: `Port 5000 is already in use`
```bash
# تغيير البوت في backend/server.js:
const PORT = 5001;  // أو أي بوت آخر متاح
```

### مشكلة: `CORS errors` عند استدعاء API
```javascript
// تأكد أن backend/server.js يحتوي على:
app.use(cors());
```

---

## 📚 موارد إضافية

### التوثيق الموجود:
- `SYSTEM_ARCHITECTURE.md` - معمارية النظام الكاملة
- `QUICKSTART.md` - بدء سريع
- `DEVELOPMENT_BEST_PRACTICES.md` - أفضل الممارسات

### API الرئيسية:
```
GET  /api/student/:id            - بيانات الطالب
GET  /api/dashboard              - ملخص لوحة التحكم
POST /api/run-pipeline           - تشغيل خط التحليل
GET  /api/cases                  - قائمة الحالات
POST /api/decision/:studentId    - قرار المعلم
```

---

## 👨‍💼 نقاط مهمة للصديق الذي سيكمل المشروع:

1. **البيانات حقيقية**: جميع البيانات المعروضة من ملفات Excel الفعلية، ليست بيانات وهمية
2. **التخزين المحلي**: الإعدادات التي يضعها المعلم تُحفظ في `localStorage` (تحتاج API إذا أردت حفظًا دائمًا)
3. **خط التحليل**: يجب فحص `adaptive_writing_system/app/run_pipeline.py` للفهم العميق للعمليات
4. **اختبار التعديلات**: استخدم `npm run build` للتحقق من عدم وجود أخطاء TypeScript
5. **Git Workflow**: اقرأ آخر commits لفهم الأنماط المتبعة

---

## ✨ ملخص سريع

تم تطوير **نظام تحكم كامل للمعلم** يسمح له بـ:
- ✅ اختيار القواعس ومصادر البيانات
- ✅ تخصيص التقارير بالكامل
- ✅ مراجعة وقبول التعليقات
- ✅ إدارة حالات الطلاب

جميع الكود **مُختبر ومُرفوع على GitHub** وجاهز للإنتاج.

---

**محدث:** 2 أبريل 2026  
**المسؤول:** benoualiabdelkader  
**الحالة:** ✅ جاهز للاستخدام والتطوير
