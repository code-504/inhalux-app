import { create } from "zustand";
import { Device } from "@/interfaces/Device";

const useInhalerStore = create<Device>((set) => ({
    inhalers: null,
}));

export { useInhalerStore };
