import {SETTINGS} from "../settings"
import './index.css'; // Adjust the path if your CSS file is located elsewhere

import AppStateProvider from "./app-state/AppStateProvider"
import StoryBodyView from "./views/content-view/StoryBodyView"
import InteractorInputView from "./views/interactor-input-view/InteractorInputView"

import storyConfig from './story/story-config';

import React, {useEffect, useState} from 'react';
import {useAppState} from "./app-state/AppStateProvider"; // Import useAppState

const StoryContent = () => {
    // const { scenariosCompleted } = useAppState();
    // console.log("All scenarios completed2. ", useAppState().scenariosCompleted);

    return (
        <>
            {/*{scenariosCompleted? (<StoryBodyView />) : null}*/}
            {useAppState().scenariosCompleted ? <StoryBodyView/> : null}
            <InteractorInputView/>
        </>
    );
};

function App() {
    return (
        <AppStateProvider>
            <h3>{storyConfig.name || 'A Moment In Life In A Moment'}</h3>
            <StoryContent/>
            {/*<StoryBodyView />*/}
        </AppStateProvider>
    );
}

export default App;