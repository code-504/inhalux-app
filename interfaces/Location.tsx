import { ReactElement } from "react";
import Animated, { SharedValue } from "react-native-reanimated";
import { Inhalers } from "./Device";
import MapView from "react-native-maps";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export interface LocationStore {
    inhaler: Inhalers | null;
    pharmacies: pharmacy[] | null;
    bottomSheetState: BottomSheetState;
    buttonState: ButtonLocationState;
    location: LocationPoints | null;
    ubicationState: boolean;
    setUbicationState: (state: boolean) => void;
    setLocation: (state: LocationPoints | null) => void;
    setButtonState: (state: ButtonLocationState) => void;
    setInhaler: (state: Inhalers | null) => void;
    setPharmacies: (state: pharmacy[] | null) => void;
    setBottomSheetState: (state: BottomSheetState) => void;
}

export interface BottomSheetState {
    position: number;
    lockPosition: number;
    storeButtonVisible: boolean;
    secondSheetActive: boolean;
}

export interface BottomSheetViewPorps {
    animatedPosition: Animated.SharedValue<number>;
    children:
        | JSX.Element
        | ReactElement
        | JSX.Element[]
        | ReactElement[]
        | null;
}

export interface LocationPoints {
    latitude: number;
    longitude: number;
}

export interface InitLocation extends LocationPoints {
    latitudeDelta: number;
    longitudeDelta: number;
}

export enum ButtonLocationState {
    Loading = 0,
    Inactive = 1,
    Active = 2,
    Current = 3,
}

export type LocationType = {
    latitude: Number;
    longitude: Number;
    altitude: Number;
    timestamp: Number;
    accuracy: Number;
    altitudeAccuracy: Number;
    speed: Number;
};

export interface LocationPermissions {
    foregroundPermission: boolean;
    hasLocationEnabled: boolean;
}

export interface pharmacy {
    name: string;
    vicinity: string;
    business_status: string;
    opening_hours: {
        open_now: boolean;
    };
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

export interface InhalerMarkerProps {
    latitude: number;
    longitude: number;
}

export interface UbicateButtonProps {
    MapViewRef: React.RefObject<MapView>;
}

export interface MapProps {
    inhalerListModalRef: React.RefObject<BottomSheetModal>;
}

// Bottom Sheet
export interface BottomStoresProps {
    buttonAnimatedPosition: Readonly<SharedValue<number>>;
    buttonAnimatedIndex: Readonly<SharedValue<number>>;
    onItemPress: (pharmacy: pharmacy) => void;
    onClose: () => void;
}

export interface BottomSheetProps {
    buttonAnimatedPosition: Readonly<SharedValue<number>>;
    buttonAnimatedIndex: Readonly<SharedValue<number>>;
    onItemPress?: (item: Inhalers) => void;
    onClose?: () => void;
}
