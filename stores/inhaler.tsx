import { create } from "zustand";
import { Device } from "@/interfaces/Device";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useInhalerStore = create<Device>(
    // @ts-ignore
    persist(
        (set) => ({
            supaInhalers: null,
            setSupaInhalers: (supaInhalers) => set({ supaInhalers }),
            setSupaInhalersFilterById: (prevSupaInhalers, inhaler_id) => {
                prevSupaInhalers?.filter(
                    (inhaler) => inhaler.id !== inhaler_id
                );
            },
            setSupaInhalersMapByName: (prevSupaInhalers, name, newName) => {
                prevSupaInhalers?.map((inhaler) =>
                    inhaler.id === name
                        ? { ...inhaler, title: newName }
                        : inhaler
                );
            },
        }),
        {
            name: "userStore", // Unique name for the persist storage
            storage: createJSONStorage(() => AsyncStorage),
            //getStorage: () => sessionStorage, // Choose between localStorage or sessionStorage
        }
    )
);

export { useInhalerStore };
