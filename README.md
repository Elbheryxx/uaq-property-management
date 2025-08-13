# UAQ Real Estate

موقع شخصي للمستشار العقاري محمد إبراهيم في أم القيوين. الموقع ثنائي اللغة (العربية افتراضيًا مع إمكانية التحويل إلى الإنجليزية) ويستخدم HTML وCSS وJavaScript فقط.

## التشغيل

لا توجد متطلبات بناء. افتح `index.html` في المتصفح. لاختبار نصيّة بسيطة:

```bash
npm test
```

## هيكل المجلدات

- `index.html` الصفحة الرئيسية.
- `properties.html` قائمة العقارات مع فلاتر.
- `property-details.html` تفاصيل كل عقار.
- صفحات إضافية: `about.html`, `services.html`, `contact.html`, `faq.html`, `privacy-policy.html`.
- `assets/` ملفات الأنماط والسكربتات والصور.
- `data/` ملفات الإعدادات وقائمة العقارات.
- `admin/` لوحة إدارة محمية بكلمة السر.

## الدومين المخصص

لربط الموقع بالدومين `www.mohameduaqrealestate.com` عبر GitHub Pages:

1. أضف ملف `CNAME` في جذر المشروع يحتوي على الاسم `www.mohameduaqrealestate.com`.
2. حدّث إعدادات DNS في مزوّد الدومين بإضافة سجلّات `A` أو `CNAME` كما توصي GitHub.
3. انتظر حتى تنتشر السجلات ثم تأكد من عمل الرابط.

