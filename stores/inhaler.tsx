import { create } from "zustand";
import { Device } from "@/interfaces/Device";
import { persist } from "zustand/middleware";

const useInhalerStore = create<Device>((set) => ({
    inhalers: null,
}));

export { useInhalerStore };
