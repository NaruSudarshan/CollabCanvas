import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppLayout from '@/components/layout/app-layout';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthButton } from '@/components/auth/auth-button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'CollabCanvas',
  description: 'A unified workspace for real-time collaboration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            disableTransitionOnChange
          >
            <div className="flex h-screen bg-background">
              <AppLayout>
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                  {children}
                </main>
              </AppLayout>
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
