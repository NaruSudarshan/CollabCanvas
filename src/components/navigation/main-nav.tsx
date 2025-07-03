'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  ClipboardList,
  LayoutGrid,
  Sparkles,
  History,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { AuthButton } from '@/components/auth/auth-button';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/documents', label: 'Documents', icon: FileText, tooltip: 'Documents' },
  { href: '/spreadsheets', label: 'Spreadsheets', icon: FileSpreadsheet, tooltip: 'Spreadsheets' },
  { href: '/tasks', label: 'Task Boards', icon: ClipboardList, tooltip: 'Task Boards' },
  { href: '/templates', label: 'Templates', icon: LayoutGrid, tooltip: 'Templates' },
  { href: '/smart-tools', label: 'Smart Tools', icon: Sparkles, tooltip: 'Smart Tools' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.tooltip}
              aria-label={item.label}
            >
              <item.icon aria-hidden="true" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
      <div className="mt-auto p-4">
        <AuthButton />
      </div>
    </SidebarMenu>
  );
}
