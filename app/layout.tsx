import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'Trdy', description: 'Google-style trading signals with a polished purple search overlay.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
