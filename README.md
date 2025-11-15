<<<<<<< HEAD
# LinkedIn Smart Assistant – Developed by Walid Reyad
# مساعد لينكدإن الذكي – تم التطوير بواسطة Walid Reyad

A full-stack web application to help you manage your LinkedIn account with AI-powered assistance.

## Features

- 🔐 **LinkedIn OAuth Authentication** - Secure login with your LinkedIn account
- 🤖 **AI-Powered Post Generation** - Generate professional LinkedIn posts using OpenAI
- 📅 **Content Calendar** - Schedule and manage your posts
- 📸 **Media Upload** - Attach images to your LinkedIn posts
- 📄 **CV Analyzer** - Get AI-powered suggestions to improve your CV
- 🌐 **Bilingual Support** - Full Arabic and English interface with RTL support
- ⏰ **Local Scheduler** - Schedule posts locally (requires app to be running)

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite
- **Authentication**: NextAuth.js with LinkedIn OAuth
- **AI**: OpenAI API
- **PDF Parsing**: pdf-parse

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Then fill in your credentials (see SETUP.md for detailed instructions).

3. **Initialize database**:
   ```bash
   npx prisma migrate dev
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

## Detailed Setup

For complete setup instructions including LinkedIn app configuration, see [SETUP.md](./SETUP.md).

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard page
│   ├── composer/         # Post composer page
│   ├── calendar/         # Content calendar page
│   ├── cv-assistant/     # CV analyzer page
│   ├── settings/         # Settings page
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/                  # Utility functions
├── prisma/               # Prisma schema
└── public/               # Static files
```

## Important Notes

- This is a **local-only** application. Scheduled posts require the app to be running.
- Only uses **official LinkedIn API** - no scraping or browser automation.
- Media upload features may require additional LinkedIn app permissions.
- See SETUP.md for LinkedIn Developer Portal configuration.

## License

All rights reserved – Created by Walid Reyad

LinkedIn: https://www.linkedin.com/in/walidreyad

=======
# ProLink Smart-AI Assistant  
### Developed by **Walid Reyad**

A bilingual (Arabic + English) smart assistant designed to automate LinkedIn content creation, publishing, scheduling, analytics, and CV enhancement — all in one platform.

The tool helps professionals stay active and consistent on LinkedIn by providing:
- AI-generated posts
- Scheduled publishing
- CV analysis with PDF parsing
- Content calendar
- Drafts and media management
- LinkedIn OAuth login
- Multi-language UI (AR/EN)

---

## 🚀 Features

### 🔹 1. LinkedIn Authentication (OAuth 2.0 + OpenID Connect)
Secure login using official LinkedIn APIs.  
Used for retrieving profile information and publishing posts safely.

### 🔹 2. AI Post Composer  
- Generate high-quality posts using OpenAI API.  
- Support for tones, styles, and lengths.  
- Upload images to attach to posts.

### 🔹 3. Auto Publishing & Scheduler  
- Create drafts  
- Schedule future posts  
- Run scheduler manually or automatically  
- Local scheduler supported

### 🔹 4. Content Calendar  
A clean visual calendar showing:
- Drafts  
- Scheduled posts  
- Published posts  

### 🔹 5. CV Analyzer  
Upload a PDF → extract text → AI improves formatting and phrasing.  
Supports both Arabic & English.

### 🔹 6. Multi-language UI (RTL Supported)  
Switch between Arabic and English instantly using a global context provider.

### 🔹 7. Full LinkedIn API Integration  
Includes:
- Share on LinkedIn  
- Media upload  
- Status checking  
- Disconnect integration  



## 🔧 Tech Stack

| Layer | Technology |
|------|------------|
| UI | Next.js 14 App Router + Tailwind |
| Auth | NextAuth.js + LinkedIn |
| Database | Prisma ORM + SQLite |
| AI | OpenAI API |
| Uploads | LinkedIn Media Upload API |
| Parsing | PDF.js / Custom parser |
| Language | TypeScript |

---

## ⚙️ Environment Variables

Create your `.env` file from `.env.example`:


NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/callback/linkedin

OPENAI_API_KEY=

DATABASE_URL="file:./dev.db"

yaml
Copy code

---

## ▶️ Run Locally (Optional)

npm install
npx prisma migrate dev
npm run dev

yaml
Copy code

---

## 🌐 Deployment

Can be deployed on:
- **Vercel** (recommended)
- **GitHub Codespaces**
- Any Node.js hosting provider

Ensure environment variables are added in the hosting dashboard.

---

## 📄 License
MIT License — Free for personal and commercial use.

---

## ✨ Author
**Walid Reyad**  
Creator & Developer of ProLink Smart-AI Assistant  
LinkedIn: https://www.linkedin.com/in/walidreyad  
>>>>>>> a859a256ccce52e997e793aa2421b4b8d9e5075d
