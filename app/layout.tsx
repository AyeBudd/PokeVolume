import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PokeVolume',
  description: 'Analyze Pokemon TCG booster pack expected value and cost efficiency.'
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
