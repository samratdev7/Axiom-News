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
