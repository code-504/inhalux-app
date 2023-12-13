import React, { Dispatch, SetStateAction } from 'react';
import { useContext, useEffect, useState, createContext } from 'react';
import { Session } from '@supabase/supabase-js'
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { supabase } from '@/services/supabase';
import { Alert } from 'react-native';

interface Props {
  children?: React.ReactNode;
}

export type InitializedUser = {
  id: String;
  name: String;
}

export interface AuthContextType {
  session: Session | null | undefined;
  authInitialized: boolean;
  isLoading: boolean;
  supaUser: InitializedUser | null | undefined;
  supaInhalers: any[] | null;
  setSupaInhalers: Dispatch<SetStateAction<any[] | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const initUser = async() => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if(!user) return;

  let { data: users, error } = await supabase
    .from('users')
    .select("name, last_name")
    .eq('id', user.id)

    if(!users) return;

    const initializedUser: InitializedUser = {
      id: user.id,
      name: users[0].name + " " + (users[0].last_name == null ? "" : users[0].last_name)
    };
  
    return initializedUser;
}

const getInhalers = async(userId: any) => {
  const { data: inhalersData, error } = await supabase.from('inhalers').select(`
                id, 
                name,
                inhaler_state ( dosis, battery ),
                inhaler_ubication ( latitude, longitude, altitude, last_seen )
                `).eq('fk_user_id', userId)    
  
    console.log("inhalers: ", inhalersData)
    return inhalersData;
}

export function AuthProvider({ children }: Props) {
  const segments = useSegments();
  const router = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supaUser, setSupaUser] = useState<InitializedUser | null>(null);
  const [supaInhalers, setSupaInhalers] = useState<any | null>(null);

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
        .select("name, last_name")
        .eq('id', user.id)

        if(!users) return;

        const initializedUser: InitializedUser = {
          id: user.id,
          name: users[0].name + " " + (users[0].last_name == null ? "" : users[0].last_name)
        };

        setSupaUser(initializedUser);

        const { data: inhalersData, error: otroGato } = await supabase.from('inhalers').select(`
                id, 
                name,
                inhaler_state ( dosis, battery ),
                inhaler_ubication ( latitude, longitude, altitude, last_seen )
                `).eq('fk_user_id', user.id)
              
        setSupaInhalers(inhalersData);
        console.log("inhalers: ", supaInhalers)
  
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
    <AuthContext.Provider value={{ session, authInitialized, isLoading, supaUser, supaInhalers, setSupaInhalers }}>
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