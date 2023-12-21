import { ReactElement } from "react";
import Animated from "react-native-reanimated";

export interface BottomSheetState {
    position            : number;
    lockPosition        : number;
    storeButtonVisible  : boolean;
    secondSheetActive   : boolean;
}

export interface BottomSheetViewPorps {
    animatedPosition: Animated.SharedValue<number>;
    animatedIndex: Animated.SharedValue<number>;
    children: JSX.Element | ReactElement | JSX.Element[] | ReactElement[] | null;
    position: number;
    lockPosition: number;
}

export interface LocationPoints {
    latitude: number;
    longitude: number;
}

export interface InitLocation extends LocationPoints {
    latitudeDelta: number,
    longitudeDelta: number,
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
}

export interface LocationPermissions {
    foregroundPermission: boolean;
    hasLocationEnabled: boolean;
}