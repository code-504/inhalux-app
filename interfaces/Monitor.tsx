import { Dispatch, SetStateAction } from "react"

export interface Pacient {
    avatar: string;
    kindred: string;
    name: string
}

export interface PacientState {
    data: Pacient[];
    filterText: string;
    loading: boolean;
}

export interface PacientsTabProps {
    pacientState: PacientState;
    setPacientState: Dispatch<SetStateAction<PacientState>>
}