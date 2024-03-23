/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, Dispatch, SetStateAction, PropsWithChildren } from "react"
import storyConfig from '../story/story-config';

export type Message = {
    role: 'system' | 'user' | 'assistant' ;
    content: string
    // type: 'callToAction' | 'openingLine' | 'storyText' | 'storyEvent' | 'system' | 'user';
}

type AppState = {
    messages: Message[];
    status: 'idle' | 'loading' | 'error';
    inputMessage: '';
    isEnd: boolean;
    scenariosCompleted: boolean;
}

const initAppState: AppState = {
    messages: [
        { role: 'system', content: storyConfig.instructions },
        // { role: 'assistant', content: 'As you contemplate your next move, an old lady appears at the crosswalk ahead, eyeing the other side anxiously. You could push the accelerator and zip past before she steps off the curb, or you could slow down, ensuring her safe passage across the road. The choice is yours: risk a reckless rush or play the part of the patient driver?' },
        // { role: 'system', content: 'What will you do next? Press the gas, or slow to stop?' },
        { role: 'assistant', content: storyConfig.openingLine },
        { role: 'assistant', content: storyConfig.callToAction}
    ],
    status: 'idle',
    inputMessage: '',
    isEnd: false,
    scenariosCompleted: false,

}

const AppStateContext = createContext(initAppState);
const AppStateReducerContext = createContext<Dispatch<SetStateAction<AppState>>>(() => null);

export default function AppStateProvider({ children }: PropsWithChildren) {
    const [appState, setAppState] = useState(initAppState);

    return (
        <AppStateContext.Provider value={appState}>
            <AppStateReducerContext.Provider value={setAppState}>
                {children}
            </AppStateReducerContext.Provider>
        </AppStateContext.Provider>
    )
}

export function useAppState() { return useContext(AppStateContext) }
export function useSetAppState() {
    const set = useContext(AppStateReducerContext);
    return (newState: Partial<AppState>) => {
        set(currentState => ({ ...currentState, ...newState }));
    }
}






