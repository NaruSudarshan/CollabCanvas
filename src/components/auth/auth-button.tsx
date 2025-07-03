"use client";

import { useAuth } from '@/context/AuthContext';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function AuthButton() {
  const { user } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <Button onClick={handleSignIn} variant="outline">
        Sign in with Google
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover rounded-full" />
        ) : (
          <span>{user.displayName?.[0] || user.email?.[0] || "U"}</span>
        )}
      </Avatar>
      <span className="text-sm font-medium">{user.displayName || user.email}</span>
      <Button onClick={handleSignOut} variant="outline" size="sm">
        Sign out
      </Button>
    </div>
  );
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}