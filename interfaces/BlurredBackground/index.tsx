import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import { BackdropPressBehavior } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";

export interface BlurredBackground extends BottomSheetBackdropProps {
    pressBehavior      ?: BackdropPressBehavior;
    disappearsOnIndex  ?: number;
    appearsOnIndex     ?: number;
    enableTouchThrough ?: boolean
    onPress            ?: (() => void) | undefined
}