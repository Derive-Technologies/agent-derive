import "styles/tailwind.css"
import { Toaster } from 'sonner'
import { ClientProvider } from '@/components/providers/client-provider'

export const metadata = {
  title: {
    template: '%s | Agent Derive',
    default: 'Agent Derive - Intelligent Workflow Automation Platform',
  },
  description: 'Automate your business processes with AI-powered workflows. Create, manage, and optimize workflows with intelligent agents.',
  keywords: ['workflow automation', 'AI agents', 'business process automation', 'approval workflows', 'form builder'],
  authors: [{ name: 'Agent Derive' }],
  creator: 'Agent Derive',
  metadataBase: new URL('https://agent-derive.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://agent-derive.com',
    title: 'Agent Derive - Intelligent Workflow Automation Platform',
    description: 'Automate your business processes with AI-powered workflows. Create, manage, and optimize workflows with intelligent agents.',
    siteName: 'Agent Derive',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Agent Derive - Intelligent Workflow Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent Derive - Intelligent Workflow Automation Platform',
    description: 'Automate your business processes with AI-powered workflows.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress React 19 ref warnings before React loads
              (function() {
                if (typeof console !== 'undefined') {
                  const originalError = console.error;
                  console.error = function() {
                    const msg = arguments[0];
                    if (typeof msg === 'string' && (
                      msg.includes('Accessing element.ref was removed') ||
                      msg.includes('ref is now a regular prop') ||
                      msg.includes('will be removed from the JSX Element type')
                    )) {
                      return;
                    }
                    return originalError.apply(console, arguments);
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClientProvider>
          <div className="relative flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster position="top-right" richColors />
        </ClientProvider>
      </body>
    </html>
  )
}