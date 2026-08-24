import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';

const title = 'Poliport | Nakliyeci Operasyon Merkezi';
const description = 'Sevkiyatlarınızı, araçlarınızı ve saha operasyonunuzu tek ekrandan yönetin.';

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get('host')?.toLowerCase() ?? '';
  const trustedHost =
    host === 'localhost:3000' ||
    host.endsWith('.openai.com') ||
    host.endsWith('.chatgpt.com') ||
    host.endsWith('.site');
  const origin = trustedHost && host !== 'localhost:3000' ? `https://${host}` : 'http://localhost:3000';
  const image = new URL('/og.png', origin).toString();

  return {
    metadataBase: new URL(origin),
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'tr_TR',
      images: [{ url: image, width: 1729, height: 910, alt: 'Poliport Nakliyeci Operasyon Merkezi' }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
