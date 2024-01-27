import { ButtonLocationState, LocationStore } from "@/interfaces/Location";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

const useLocationStore = createWithEqualityFn<LocationStore>(
    (set) => ({
        inhaler: null,
        pharmacies: null,
        buttonState: ButtonLocationState.Inactive,
        location: null,
        ubicationState: false,
        bottomSheetState: {
            position: 80,
            lockPosition: 580,
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

export { useLocationStore };
