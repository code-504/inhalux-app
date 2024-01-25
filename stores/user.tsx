import { UserStore, SupaUser } from "@/interfaces/User";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create<UserStore>(
    // @ts-ignore
    persist(
        (set) => ({
            session: null,
            authInitialized: false,
            isLoading: true,
            supaUser: null,
            setSupaUser: (supaUser) => set({ supaUser }),
            setSession: (session) => set({ session }),
            setAuthInitialized: (authInitialized) => set({ authInitialized }),
            setIsLoading: (isLoading) => set({ isLoading }),
            logout: () => set({ supaUser: null }),
        }),
        {
            name: "userStore", // Unique name for the persist storage
            getStorage: () => sessionStorage, // Choose between localStorage or sessionStorage
        }
    )
);

export { useUserStore };
