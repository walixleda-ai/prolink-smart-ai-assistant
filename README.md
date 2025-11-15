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
