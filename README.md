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

