<div align="center">

# طباعة عروض — الفجر
### Al-Fajr Price Tag & Offer Print Designer

**أداة ويب لتصميم وطباعة لافتات العروض والأسعار باللغة العربية — بدون خادم، بدون تثبيت، فقط افتح وابدأ.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://faa-print.vercel.app/)
![RTL Support](https://img.shields.io/badge/RTL-Arabic%20Ready-2ecc71)
![No Build Step](https://img.shields.io/badge/Build%20Step-None-3498db)

[العرض الحي](https://faa-print.vercel.app/) &nbsp;·&nbsp; [الإبلاغ عن مشكلة](../../issues) &nbsp;·&nbsp; [طلب ميزة](../../issues)

</div>

---

## نظرة عامة

**طباعة عروض - الفجر** هي أداة ويب من صفحة واحدة (Single Page Application) مصممة خصيصًا للمتاجر والمحلات التي تحتاج طباعة لافتات عروض وأسعار احترافية بسرعة، دون الحاجة لبرامج تصميم معقدة مثل Photoshop أو Illustrator. كل شيء يعمل محليًا في المتصفح — لا خادم، لا تسجيل دخول، لا اتصال بقاعدة بيانات.

<div align="center">

```
┌─────────────────────────────────────┐
│                                       │
│              عرض خاص                 │
│                                       │
│           اسم المنتج هنا              │
│                                       │
│             ١٩٩ ريال                 │
│                                       │
└─────────────────────────────────────┘
```

</div>

## المميزات

<table>
<tr>
<td width="50%" valign="top">

**تخصيص النصوص**
- ثلاثة حقول نصية مستقلة بالكامل
- تحكم بحجم ونوع الخط (Cairo, Amiri, Tajawal...)
- تنسيقات: **غامق**، *مائل*، <u>تحته خط</u>
- لوحة ألوان جاهزة (15 لونًا) لكل حقل

**إدارة الخلفية**
- خلفية افتراضية (شعار المتجر)
- رفع خلفية مخصصة من الجهاز
- تحكم دقيق بالشفافية (Opacity Slider)

</td>
<td width="50%" valign="top">

**تحكم بالطباعة**
- اتجاه الصفحة: عمودي / أفقي
- ثلاثة أحجام طباعة: صفحة كاملة، نصفين، أو نصف واحد
- 7 أنماط إطارات مع تحكم باللون والسمك

**تجربة متجاوبة**
- يعمل بسلاسة على الجوال والحاسوب
- معاينة حية فورية لكل تغيير
- طباعة أو حفظ PDF بضغطة زر

</td>
</tr>
</table>

## البدء السريع

**الخيار الأول — استخدام مباشر (بدون تثبيت):**

جرّب الأداة الآن على الرابط المباشر: **https://faa-print.vercel.app/**

**الخيار الثاني — تشغيل محلي:**

```bash
# 1. استنسخ المستودع
git clone https://github.com/username/alfajr-print.git

# 2. ادخل إلى المجلد
cd alfajr-print

# 3. افتح الملف مباشرة في المتصفح
open index.html   # أو انقر عليه نقرًا مزدوجًا
```

> لا حاجة لـ `npm install` ولا خادم محلي — الملف يعمل فور فتحه.

## طريقة الاستخدام

| الخطوة | الوصف |
|:---:|---|
| 1 | افتح `index.html` في أي متصفح حديث |
| 2 | حرّر النصوص الثلاثة واضبط الخط، الحجم، واللون |
| 3 | اختر الخلفية، اتجاه الصفحة، وحجم الطباعة المناسب |
| 4 | راقب المعاينة الحية أسفل الصفحة |
| 5 | اضغط **"طباعة"** — واختر "حفظ كـ PDF" إن أردت |

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---|---|
| **HTML5** | البنية الأساسية |
| **CSS3** | التصميم، التجاوب، دعم RTL، أنماط الطباعة (`@media print`) |
| **Vanilla JavaScript** | منطق المعاينة الحية، رفع الملفات، التحكم بالطباعة |
| **Google Fonts** | Cairo, Amiri, Tajawal, Droid Arabic Kufi |

## هيكل المشروع

```
alfajr-print/
├── index.html      # الملف الرئيسي (واجهة + تنسيق + منطق)
├── alfajr.PNG       # شعار المشروع (خلفية افتراضية)
├── README.md        # هذا الملف
└── LICENSE           # رخصة المشروع
```

## خطط مستقبلية

- [ ] حفظ التصاميم كقوالب (Templates) محلياً
- [ ] دعم تصدير PNG مباشر بدون طباعة
- [ ] مكتبة أيقونات جاهزة (خصم، جديد، محدود...)
- [ ] وضع ليلي (Dark Mode) لواجهة التحرير

## المساهمة

المساهمات مرحّب بها. إذا كان لديك اقتراح أو إصلاح:

1. اعمل Fork للمستودع
2. أنشئ فرعًا جديدًا (`git checkout -b feature/amazing-feature`)
3. ارفع تعديلاتك (`git commit -m 'إضافة ميزة رائعة'`)
4. ادفع الفرع (`git push origin feature/amazing-feature`)
5. افتح Pull Request

## الترخيص

هذا المشروع مرخّص تحت رخصة **MIT** — راجع ملف [LICENSE](LICENSE) للتفاصيل.

---

<div align="center">

**صُنع بواسطة Ghaith Alrawi**

© 2025 جميع الحقوق محفوظة

</div>
