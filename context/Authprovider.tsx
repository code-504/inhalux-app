import React from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import { Session } from '@supabase/supabase-js'
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface Props {
  children?: React.ReactNode;
}

export interface AuthContextType {
  session: Session | null | undefined;
  authInitialized: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: Props) {
  const segments = useSegments();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || !authInitialized) return;
    
    const inAuthGroup = segments[0] === '(auth)';

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session?.user &&
      !inAuthGroup
    ) {
      router.replace('/(auth)/login');
    } else if (session?.user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(tabs)/device'); // to tabs
    }
  }, [session, segments, authInitialized, navigationState?.key]);

  useEffect(() => {
    if (authInitialized) { setIsLoading(false); return };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: authListner } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setAuthInitialized(true);
        setIsLoading(false);

        if (_event == 'TOKEN_REFRESHED') {
          //Handle Accordinngly
        }
      }
    );

    return () => {
      authListner.subscription;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, authInitialized, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a MyUserContextProvider.`);
  }
  return context;
};