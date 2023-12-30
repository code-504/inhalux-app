import React, { Dispatch, SetStateAction } from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import { Session } from '@supabase/supabase-js'
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { supabase } from '@/services/supabase';
import { Avatar } from 'tamagui';

interface Props {
  children?: React.ReactNode;
}

export type InitializedUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | undefined;
}

export interface AuthContextType {
  session: Session | null | undefined;
  authInitialized: boolean;
  isLoading: boolean;
  supaUser: InitializedUser | null | undefined;
  setSupaUser: Dispatch<SetStateAction<any>>;
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
  const [supaUser, setSupaUser] = useState<InitializedUser | null>(null);

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

    const fetchSupaUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
  
      if(!user) return;

      let { data: users, error } = await supabase
        .from('users')
        .select("name, last_name, avatar")
        .eq('id', user.id)

        if(!users) return;

        const initializedUser: InitializedUser = {
          id: user.id,
          name: users[0].name + " " + (users[0].last_name == null ? "" : users[0].last_name),
          email: user.email ? user.email : "",
          avatar: users[0].avatar == null ? "https://ckcwfpbvhbstslprlbgr.supabase.co/storage/v1/object/public/avatars/default_avatar.png?t=2023-12-19T02%3A43%3A15.423Z" : users[0].avatar
        };

        setSupaUser(initializedUser);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setAuthInitialized(true);
        setIsLoading(false);

        if (_event == 'TOKEN_REFRESHED') {
          //Handle Accordinngly
        }
      }
    );

    fetchSupaUser();

    return () => {
      authListener.subscription;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, authInitialized, isLoading, supaUser, setSupaUser }}>
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