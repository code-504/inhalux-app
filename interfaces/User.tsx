import { Session } from "@supabase/supabase-js";

export interface SupaUser {
    id: string;
    name: string;
    email: string;
    avatar: string | undefined;
    token: string;
    external_provider: boolean;
}

export interface UserStore {
    session: Session | null;
    authInitialized: boolean;
    isLoading: boolean;
    supaUser: SupaUser | null;
    setSupaUser: (supaUser: SupaUser | null) => void;
    setSession: (session: Session | null) => void;
    setAuthInitialized: (authInitialized: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
    logout: () => void;
}
