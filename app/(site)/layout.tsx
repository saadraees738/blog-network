import '../globals.css';

export const metadata = {
  icons: { icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png', sizes: '512x512' }], apple: '/apple-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
