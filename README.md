# 📰 Axiom News

A gorgeous Next.js news app translating global events into 6 languages. It uses the GNews API for live stories, but if the free rate limit hits, it pivots to a mock-reality where space stations launch every Tuesday. Perfect for late-night doomscrolling with a sleek dark mode and a sparkly, magical cursor. ✨

---

## ✨ Features

- **Real-Time News**: Integrates with the [GNews API](https://gnews.io) to fetch the latest global news.
- **Smart Offline/Fallback Mode**: Gracefully handles API rate limits (100 free requests/day) by falling back to rich, localized mock data.
- **Polyglot Interface**: Full translation and localization support for 6 major languages: English, German, French, Spanish, Japanese, and Hindi.
- **Dark/Light Mode**: Smooth, eye-pleasing theme toggle to match your environment.
- **Particle Cursor Effect**: An interactive, magical particle-trail following your cursor.
- **Contact & Email Subscription**: Ready-to-go newsletter subscription powered by Nodemailer.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Library**: React
- **Styling**: Vanilla CSS Modules (premium dark mode, HSL tailored color schemes)
- **Mailing**: Nodemailer

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18 or higher) installed.

### 2. Installation
Clone the repository, navigate into the directory, and install the dependencies:
```bash
cd axiom-news
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the project and add your credentials:
```env
# GNews API Key (Optional: get a free key at https://gnews.io)
# If left empty, the application will use localized mock data fallback
GNEWS_API_KEY=your_gnews_api_key_here

# Contact Email Setup (Nodemailer)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASS=your_app_password
```

### 4. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Deployment to Vercel

The easiest way to deploy **Axiom News** is using **GitHub**:

1. Create a new repository on [GitHub](https://github.com).
2. Push your project code (excluding `node_modules` and `.next`) to your GitHub repository.
3. Import the repository in [Vercel](https://vercel.com/new).
4. Add the environment variables (`GMAIL_USER`, `GMAIL_PASS`, `GNEWS_API_KEY`) in the Vercel project configuration.
5. Click **Deploy**!
