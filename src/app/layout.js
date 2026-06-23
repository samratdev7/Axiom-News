import './globals.css';

export const metadata = {
  title: 'Axiom News — International News, Fast',
  description: 'A fast, modern international news aggregator for journalists. Browse global news by country and topic with switchable reading modes.',
  keywords: ['news', 'international news', 'journalism', 'news aggregator', 'global news'],
  openGraph: {
    title: 'Axiom News — International News, Fast',
    description: 'Browse global news by country and topic. Built for journalists.',
    type: 'website',
  },
};

// Theme initialization script to prevent flash
const themeScript = `
  (function() {
    var theme = localStorage.getItem('axiom-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  })();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
