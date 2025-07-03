'use client';

import type React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { MainNav } from '@/components/navigation/main-nav';
import { CollabCanvasLogo } from '@/components/icons/logo';
import Link from 'next/link';
import { Moon, Sun, Settings } from 'lucide-react';
import { useTheme } from 'next-themes'; // Assuming next-themes is or will be installed for theme toggling

// Placeholder for useTheme if not installed.
// Real implementation would use a theme provider like next-themes.
const useThemeFallback = () => {
  const [theme, setTheme] = React.useState('light');
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);
  return { theme, setTheme: toggleTheme };
};


export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Attempt to use next-themes, fallback if not available
  let resolvedTheme: string | undefined;
  let setThemeFunction: ((theme: string) => void) | (() => void);

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme, setTheme } = useTheme();
    resolvedTheme = theme;
    setThemeFunction = setTheme;
  } catch (e) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme, setTheme } = useThemeFallback();
    resolvedTheme = theme;
    setThemeFunction = () => setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }
  
  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setThemeFunction('light');
    } else {
      setThemeFunction('dark');
    }
  };


  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" side="left" variant="sidebar">
        <SidebarHeader className="p-4">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <CollabCanvasLogo className="h-8 w-8 text-primary" />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">CollabCanvas</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
           <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8"
            aria-label="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8" aria-label="Settings">
            <Settings className="h-5 w-5" />
             <span className="sr-only">Settings</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            {/* Breadcrumbs or page title can go here */}
          </div>
          {/* Add user avatar/menu here if needed */}
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
