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