# LinkedIn Smart Assistant - Setup Guide
# دليل إعداد مساعد لينكدإن الذكي

## English Instructions

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A LinkedIn Developer account
- An OpenAI API key

### Step 1: Clone and Install

```bash
npm install
```

### Step 2: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in the following variables in `.env`:

- `NEXTAUTH_SECRET`: Generate a random string (you can use `openssl rand -base64 32`)
- `LINKEDIN_CLIENT_ID`: Your LinkedIn app's Client ID (see Step 3)
- `LINKEDIN_CLIENT_SECRET`: Your LinkedIn app's Client Secret (see Step 3)
- `OPENAI_API_KEY`: Your OpenAI API key from https://platform.openai.com/api-keys
- `OPENAI_MODEL`: Model to use (default: `gpt-4o-mini`)
- `DATABASE_URL`: SQLite database path (default: `"file:./dev.db"`)

### Step 3: Create a LinkedIn App

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in the required information:
   - App name: "LinkedIn Smart Assistant" (or your preferred name)
   - Company: Your company name
   - Privacy policy URL: Your privacy policy URL (required)
   - App logo: Upload a logo (optional)
4. After creating the app, go to the "Auth" tab
5. Under "Redirect URLs", add:
   - `http://localhost:3000/api/auth/callback/linkedin` (for local development)
   - Your production URL if deploying (e.g., `https://yourdomain.com/api/auth/callback/linkedin`)
6. Under "Products", request access to:
   - **Sign In with LinkedIn using OpenID Connect** (required)
   - **Share on LinkedIn** (required for posting)
   - **Marketing Developer Platform** (optional, for additional features)
7. Copy the **Client ID** and **Client Secret** to your `.env` file

### Step 4: LinkedIn API Permissions and Scopes

The app requires the following OAuth scopes:
- `openid` - For authentication
- `profile` - To access user profile information
- `email` - To access user email
- `w_member_social` - To post content on LinkedIn

These scopes are automatically requested during the OAuth flow.

### Step 5: Media Upload Setup

LinkedIn's media upload API requires:
1. Your app must be approved for the "Marketing Developer Platform" product (if using advanced media features)
2. For basic image uploads with posts, the `w_member_social` scope should be sufficient
3. Note: Some media features may require additional approval from LinkedIn

**Important**: If you encounter issues with media uploads:
- Ensure your LinkedIn app has the necessary permissions
- Check LinkedIn's API documentation for the latest requirements
- Some features may require your app to be in "Live" status (not just "Development")

### Step 6: Initialize Database

```bash
npx prisma migrate dev
```

This will:
- Create the SQLite database file (`dev.db`)
- Run all migrations to set up the schema

### Step 7: Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 8: First Login

1. Navigate to `http://localhost:3000`
2. Click "Sign in with LinkedIn"
3. Authorize the app with your LinkedIn account
4. You'll be redirected to the dashboard

### Troubleshooting

#### LinkedIn OAuth Issues

- **"Redirect URI mismatch"**: Ensure the redirect URI in your LinkedIn app settings exactly matches `http://localhost:3000/api/auth/callback/linkedin`
- **"Invalid client"**: Verify your `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET` are correct
- **"Insufficient permissions"**: Make sure you've requested the correct products in the LinkedIn Developer Portal

#### OpenAI API Issues

- **"API key not configured"**: Ensure `OPENAI_API_KEY` is set in your `.env` file
- **Rate limits**: If you hit rate limits, consider upgrading your OpenAI plan or using a different model

#### Database Issues

- If you get database errors, try deleting `dev.db` and running `npx prisma migrate dev` again
- Ensure the database directory is writable

#### Media Upload Issues

- Ensure images are in supported formats (JPEG, PNG)
- Check file size limits (LinkedIn may have restrictions)
- Verify your LinkedIn app has the necessary permissions for media uploads

---

## تعليمات بالعربية

### المتطلبات الأساسية

- Node.js 18 أو أحدث
- npm أو yarn
- حساب مطور LinkedIn
- مفتاح API من OpenAI

### الخطوة 1: التثبيت

```bash
npm install
```

### الخطوة 2: إعداد متغيرات البيئة

1. انسخ `.env.example` إلى `.env`:
```bash
cp .env.example .env
```

2. املأ المتغيرات التالية في `.env`:

- `NEXTAUTH_SECRET`: أنشئ سلسلة عشوائية (يمكنك استخدام `openssl rand -base64 32`)
- `LINKEDIN_CLIENT_ID`: معرف العميل لتطبيق LinkedIn الخاص بك (انظر الخطوة 3)
- `LINKEDIN_CLIENT_SECRET`: السر السري لتطبيق LinkedIn الخاص بك (انظر الخطوة 3)
- `OPENAI_API_KEY`: مفتاح API الخاص بك من https://platform.openai.com/api-keys
- `OPENAI_MODEL`: النموذج المستخدم (افتراضي: `gpt-4o-mini`)
- `DATABASE_URL`: مسار قاعدة بيانات SQLite (افتراضي: `"file:./dev.db"`)

### الخطوة 3: إنشاء تطبيق LinkedIn

1. اذهب إلى [بوابة مطوري LinkedIn](https://www.linkedin.com/developers/apps)
2. انقر على "Create app"
3. املأ المعلومات المطلوبة:
   - اسم التطبيق: "LinkedIn Smart Assistant" (أو الاسم الذي تفضله)
   - الشركة: اسم شركتك
   - رابط سياسة الخصوصية: رابط سياسة الخصوصية الخاص بك (مطلوب)
   - شعار التطبيق: ارفع شعاراً (اختياري)
4. بعد إنشاء التطبيق، اذهب إلى تبويب "Auth"
5. تحت "Redirect URLs"، أضف:
   - `http://localhost:3000/api/auth/callback/linkedin` (للتطوير المحلي)
   - رابط الإنتاج الخاص بك إذا كنت تقوم بالنشر (مثل `https://yourdomain.com/api/auth/callback/linkedin`)
6. تحت "Products"، اطلب الوصول إلى:
   - **Sign In with LinkedIn using OpenID Connect** (مطلوب)
   - **Share on LinkedIn** (مطلوب للنشر)
   - **Marketing Developer Platform** (اختياري، للميزات الإضافية)
7. انسخ **Client ID** و **Client Secret** إلى ملف `.env` الخاص بك

### الخطوة 4: أذونات وامتيازات LinkedIn API

التطبيق يتطلب الأذونات التالية:
- `openid` - للمصادقة
- `profile` - للوصول إلى معلومات الملف الشخصي
- `email` - للوصول إلى البريد الإلكتروني
- `w_member_social` - لنشر المحتوى على LinkedIn

يتم طلب هذه الأذونات تلقائياً أثناء عملية OAuth.

### الخطوة 5: إعداد رفع الوسائط

واجهة برمجة تطبيقات رفع الوسائط في LinkedIn تتطلب:
1. يجب أن يكون تطبيقك معتمداً لمنتج "Marketing Developer Platform" (إذا كنت تستخدم ميزات الوسائط المتقدمة)
2. لرفع الصور الأساسية مع المنشورات، يجب أن يكون النطاق `w_member_social` كافياً
3. ملاحظة: قد تتطلب بعض ميزات الوسائط موافقة إضافية من LinkedIn

**مهم**: إذا واجهت مشاكل في رفع الوسائط:
- تأكد من أن تطبيق LinkedIn الخاص بك لديه الأذونات اللازمة
- تحقق من وثائق API الخاصة بـ LinkedIn للحصول على أحدث المتطلبات
- قد تتطلب بعض الميزات أن يكون تطبيقك في حالة "Live" (وليس فقط "Development")

### الخطوة 6: تهيئة قاعدة البيانات

```bash
npx prisma migrate dev
```

سيؤدي هذا إلى:
- إنشاء ملف قاعدة بيانات SQLite (`dev.db`)
- تشغيل جميع عمليات الترحيل لإعداد المخطط

### الخطوة 7: تشغيل خادم التطوير

```bash
npm run dev
```

سيكون التطبيق متاحاً على `http://localhost:3000`

### الخطوة 8: تسجيل الدخول الأول

1. انتقل إلى `http://localhost:3000`
2. انقر على "بدء الاستخدام عبر لينكدإن"
3. أذن للتطبيق باستخدام حساب LinkedIn الخاص بك
4. سيتم توجيهك إلى لوحة التحكم

### استكشاف الأخطاء وإصلاحها

#### مشاكل OAuth في LinkedIn

- **"Redirect URI mismatch"**: تأكد من أن رابط إعادة التوجيه في إعدادات تطبيق LinkedIn يطابق تماماً `http://localhost:3000/api/auth/callback/linkedin`
- **"Invalid client"**: تحقق من أن `LINKEDIN_CLIENT_ID` و `LINKEDIN_CLIENT_SECRET` صحيحان
- **"Insufficient permissions"**: تأكد من أنك طلبت المنتجات الصحيحة في بوابة مطوري LinkedIn

#### مشاكل OpenAI API

- **"API key not configured"**: تأكد من تعيين `OPENAI_API_KEY` في ملف `.env` الخاص بك
- **حدود المعدل**: إذا وصلت إلى حدود المعدل، فكر في ترقية خطة OpenAI الخاصة بك أو استخدام نموذج مختلف

#### مشاكل قاعدة البيانات

- إذا واجهت أخطاء في قاعدة البيانات، حاول حذف `dev.db` وتشغيل `npx prisma migrate dev` مرة أخرى
- تأكد من أن مجلد قاعدة البيانات قابل للكتابة

#### مشاكل رفع الوسائط

- تأكد من أن الصور بصيغ مدعومة (JPEG, PNG)
- تحقق من حدود حجم الملف (قد يكون لدى LinkedIn قيود)
- تحقق من أن تطبيق LinkedIn الخاص بك لديه الأذونات اللازمة لرفع الوسائط

---

## Production Deployment Notes

### Environment Variables for Production

When deploying to production, update:
- `NEXTAUTH_URL` to your production domain
- `LINKEDIN_REDIRECT_URI` to your production callback URL
- Ensure all other environment variables are set

### Database

For production, consider using PostgreSQL or MySQL instead of SQLite:
1. Update `DATABASE_URL` in `.env` to your production database connection string
2. Update `prisma/schema.prisma` to use the appropriate provider
3. Run migrations: `npx prisma migrate deploy`

### Security

- Never commit `.env` files
- Use secure, randomly generated `NEXTAUTH_SECRET`
- Keep your LinkedIn and OpenAI API keys secure
- Consider using environment variable management services for production

---

## ملاحظات النشر للإنتاج

### متغيرات البيئة للإنتاج

عند النشر للإنتاج، قم بتحديث:
- `NEXTAUTH_URL` إلى نطاق الإنتاج الخاص بك
- `LINKEDIN_REDIRECT_URI` إلى رابط الاستدعاء للإنتاج
- تأكد من تعيين جميع متغيرات البيئة الأخرى

### قاعدة البيانات

للإنتاج، فكر في استخدام PostgreSQL أو MySQL بدلاً من SQLite:
1. قم بتحديث `DATABASE_URL` في `.env` إلى سلسلة اتصال قاعدة البيانات للإنتاج
2. قم بتحديث `prisma/schema.prisma` لاستخدام المزود المناسب
3. قم بتشغيل عمليات الترحيل: `npx prisma migrate deploy`

### الأمان

- لا تلتزم أبداً بملفات `.env`
- استخدم `NEXTAUTH_SECRET` آمنة ومولدة عشوائياً
- احتفظ بمفاتيح API الخاصة بـ LinkedIn و OpenAI آمنة
- فكر في استخدام خدمات إدارة متغيرات البيئة للإنتاج

