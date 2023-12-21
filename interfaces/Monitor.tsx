import { Dispatch, SetStateAction } from "react"

export interface ListMonitor {
    avatar: string;
    kindred: string;
    name: string
}

export interface ListMonitorState {
    data: ListMonitor[];
    filterText: string;
    loading: boolean;
}

export interface PacientsTabProps {
    pacientState: ListMonitorState;
    setPacientState: Dispatch<SetStateAction<ListMonitorState>>
}

export interface SharesTabProps {
    shareState: ListMonitorState;
    setShareState: Dispatch<SetStateAction<ListMonitorState>>
}