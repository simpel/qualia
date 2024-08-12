import { EB_Garamond, Inter } from 'next/font/google';

import { Theme } from '@radix-ui/themes';

import './../src/styles/index.css';

// If loading a variable font, you don't need to specify the font weight
const garamond = EB_Garamond({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-garamond',
});
const inter = Inter({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-inter',
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Qualia',
  description: 'The best edtech platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[garamond.variable, inter.variable].join(' ')}>
      <body>
        <Theme accentColor="teal" grayColor="slate" radius="small">
          {children}
        </Theme>
      </body>
    </html>
  );
}
