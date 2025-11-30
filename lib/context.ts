import { RefObject, createContext } from 'react';
import { ToastHandle } from './components/toast';

export type State = {
    toast: RefObject<ToastHandle | null>;
}

export const StateContext = createContext<State>({} as State);