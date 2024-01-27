import { createContext } from 'react';
import { ToastHandle } from './components/toast';

export type State = {
    toast: ToastHandle;
}

export const StateContext = createContext<State>({} as State);