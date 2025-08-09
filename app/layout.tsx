import './globals.css';
export const metadata = { title: 'Trdy', description: 'FX + Crypto signals' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body><main className="main">{children}</main></body></html>);
}