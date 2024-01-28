import {
    ButtonLocationState,
    LocationStore,
    RegionLocationStore,
} from "@/interfaces/Location";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useLocationStore = createWithEqualityFn<LocationStore>(
    (set) => ({
        inhaler: null,
        pharmacies: null,
        buttonState: ButtonLocationState.Inactive,
        location: null,
        ubicationState: false,
        bottomSheetState: {
            position: 108,
            lockPosition: 614,
            storeButtonVisible: true,
            secondSheetActive: false,
        },
        setUbicationState: (state) => set({ ubicationState: state }),
        setLocation: (state) => set({ location: state }),
        setButtonState: (state) => set({ buttonState: state }),
        setInhaler: (state) => set({ inhaler: state }),
        setPharmacies: (state) => set({ pharmacies: state }),
        setBottomSheetState: (state) => set({ bottomSheetState: state }),
    }),
    shallow
);

const useLocationRegionStore = createWithEqualityFn<RegionLocationStore>(
    // @ts-ignore
    persist(
        (set) => ({
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            },
            setRegion: (state) => set({ region: state }),
        }),
        {
            name: "locationRegionStore ",
            storage: createJSONStorage(() => AsyncStorage),
        }
    ),
    shallow
);

export { useLocationStore, useLocationRegionStore };
