import { toCssVariables } from '@blackcinnamon/design-tokens';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'BlackCinnamon',
  description: 'Survival, trading and a player-driven economy.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style id="design-tokens" dangerouslySetInnerHTML={{ __html: toCssVariables() }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
