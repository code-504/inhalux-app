import { UserStore } from "@/interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { createJSONStorage, persist } from "zustand/middleware";

const useUserStore = createWithEqualityFn<UserStore>(
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
            storage: createJSONStorage(() => AsyncStorage),
            //getStorage: () => sessionStorage, // Choose between localStorage or sessionStorage
        }
    ),
    shallow
);

export { useUserStore };
