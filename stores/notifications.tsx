import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { Device } from "@/interfaces/Device";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useNotificationStore = createWithEqualityFn<Notification>(
    // @ts-ignore
    persist(
        (set) => ({
            supaNotifications: null
        }),
        {
            name: "userStore", // Unique name for the persist storage
            storage: createJSONStorage(() => AsyncStorage),
            //getStorage: () => sessionStorage, // Choose between localStorage or sessionStorage
        }
    ),
    shallow
);

export { useNotificationStore };
