import { BottomSheetFlatListMethods } from "@gorhom/bottom-sheet";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { ImageSource } from "expo-image";
import { Dispatch, SetStateAction } from "react"

export interface ListMonitor {
    id: string;
    avatar: string;
    kindred: string;
    name: string;
    pending_state: boolean;
    created_at: string;
}

export interface ListMonitorState {
    data: ListMonitor[];
    filterText: string;
    loading: boolean;
}

export interface SearchListProps {
    title: string;
    placeHolder: string;
    noData: {
        title: string;
        message?: string;
        BackgroundImage: ImageSource;
    },
    state: ListMonitorState/*string*/;
    setState: Dispatch<SetStateAction<ListMonitorState/*string*/>>;
    ListData: React.ReactElement
}

export interface PacientsTabProps {
    onFunction: () => void;
    pacientState: ListMonitorState;
    setPacientState: Dispatch<SetStateAction<ListMonitorState>>
}

export interface SharesTabProps {
    shareState: ListMonitorState;
    setShareState: Dispatch<SetStateAction<ListMonitorState>>
}