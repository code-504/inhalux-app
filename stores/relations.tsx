import { ListMonitor } from "@/interfaces/Monitor";
import { UserStore, SupaUser } from "@/interfaces/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const usePacientStore = create<ListMonitor>(
    // @ts-ignore
    persist(
        (set) => ({
            id: "",
            avatar: "",
            kindred: "",
            name: "",
            pending_state: false,
            created_at: ""
        }),
        {
            name: "pacientStore", // Unique name for the persist storage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

const useMonitorStore = create<ListMonitor>(
    // @ts-ignore
    persist(
        (set) => ({
            id: "",
            avatar: "",
            kindred: "",
            name: "",
            pending_state: false,
            created_at: ""
        }),
        {
            name: "monitorStore", // Unique name for the persist storage
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export { usePacientStore, useMonitorStore };
