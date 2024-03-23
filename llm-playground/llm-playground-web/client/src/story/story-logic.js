import { useCallback, useEffect, useRef } from 'react';
import { useAppState, useSetAppState } from '../app-state/AppStateProvider';
import Timer from '../utils/timer';

window.nowPlayingAudio = null;
window.nowPlayingString = null;

export function useHandleStoryResponse() {
    const { inputMessage } = useAppState();
    const setAppState = useSetAppState();
    const idleTimer = useRef();

    useEffect(() => {
        idleTimer.current?.cancel();
    }, [inputMessage]);

    function checkGoalProgressAndUpdateStory(progress, story) {
        console.log('Goal progress check:', progress);
        if (progress >= 1) {
            // Goal has been sufficiently met. Time to conclude the story.
            console.log("Goal progress indicates the story should conclude.");
            concludeStory(story);
        } else {
            // Continue the game since the goal hasn't been fully met yet.
            console.log("Continue the story. Goal progress:", progress);
            // continueStory(); // This function would continue the normal game flow.
        }
    }

    function concludeStory(storyText){
        // Craft a positive, descriptive ending, symbolizing Matthew's growth.
        const endingMessage = {
            storyText: "After ensuring Logan's safety and reflecting on his actions, Matthew feels a profound change within. As the crowd disperses and peace returns to the scene, he realizes the true value of life and the importance of patience and care on the road.",
            callToAction: "",
            storyEvent: "Matthew, now with a newfound understanding and commitment to safety, promises to make amends and approaches life with a calmer, more thoughtful perspective.",
            goalProgress: 1,
            playerSentiment: "Reflective", // This could be an additional sentiment reflecting Matthew's growth.
            playerEngagement: 1
        };

        storyText = endingMessage.storyText;
        // Assuming you have a mechanism to display or process this message:
        // displayEndingMessage(endingMessage);
        // handleStoryResponse([], endingMessage);
        setAppState({isEnd: true});
        window.nowPlayingAudio.pause();
        console.log('Story concluded. paused music ' );

    }


    function handleStoryResponse(messages, response) {
        if (!response) return;

        const newMessages = [...messages];

        // Test modifying the words limit:
        // if (!isNaN(parseInt(newMessage))) {
        //     newMessages.push({ role: 'system', content: `Your next storyText output has maximum length of ${newMessage} words.` })
        // }

        // handlePlayerChoice(response.choice); // Example of handling the player's choice (if the response includes a choice

        if (response.storyText) {
            newMessages.push({ role: 'assistant', content: response.storyText });
        }

        setAppState({ messages: [...newMessages] });

        // TODO: end story with a long closing paragraph, and 'THE END' message.
        console.log('goal progress: ', response.goalProgress);
        console.log('story text: ', response.storyText);
        console.log('call to action: ', response.callToAction);
        console.log('story event: ', response.storyEvent);
        console.log('player sentiment: ', response.playerSentiment);

        // Example of checking the goal progress.
        // This value would dynamically change based on player actions throughout the game.
        checkGoalProgressAndUpdateStory(response.goalProgress, response.storyText); // You would replace 0.8 with the current goalProgress value.


        // const sentiments = [
        //     { name: 'happy', values: ['happy', 'joy', 'pleased', 'hopeful'] },
        //     { name: 'excited', values: ['excited'] },
        //     { name: 'sad', values: ['sad', 'unhappy', 'depressed'] },
        //     { name: 'mad', values: ['mad', 'angry', 'yelling', 'aggressive'] },
        //     { name: 'confused', values: ['confused', 'unsure', 'hesitated'] },
        //     { name: 'fine', values: ['fine', 'ok', 'okay'] },
        //     { name: 'scared', values: ['scared', 'panicked', 'stressed', 'fear', 'anxious'] },
        //     { name: 'calm', values: ['calm', 'chill', 'soft'] },
        //     { name: 'agitated', values: ['agitated', 'tense'] },
        //     { name: 'guilty', values: ['guilty', 'regret'] }
        //     // { name: 'surprised', values: ['surprised'] }
        // ];

        const sentiments = ['Happy', 'Excited', 'Pleased', 'Sad', 'Mad', 'Confused', 'Fine', 'Scared', 'Calm', 'Agitated', 'Guilty']

        for (const sentiment of sentiments) {
            // console.log('sentiment search: ', sentiment);
            // if (sentiment.values.includes(response.playerSentiment)) {
            //     playAudioForSentiment(sentiment.name);
            //     break; // Exit the loop once a match is found
            // }
            if (sentiment.toLowerCase() === response.playerSentiment.toLowerCase()){
                playAudioForSentiment(sentiment.toLowerCase());
                break; // Exit the loop once a match is found
            }
        }


        // If the player is idle for a long period, add some content or a hint to push the story forward.
        idleTimer.current = new Timer(10000, () => {
            let random = Math.random();
            if (response.storyEvent && random > 0.7) {
                // Trigger an independent story event:
                newMessages.push({ role: 'assistant', content: response.storyEvent });
                setAppState({ messages: [...newMessages] });
                console.log('story event triggered after 10 seconds of idle time. ', random);
            }

            // if (response.callToAction && Math.random() > 0.8) {
            //     // Apply call to action hint:
            //     newMessages.push({ role: 'assistant', content: `(${response.callToAction})` });
            //     setAppState({ messages: [...newMessages] });
            // }
        });
        idleTimer.current.start();
        let wasSent = false;

        idleTimer.current = new Timer(15000, () => {
            let random = Math.random();

            if (response.callToAction && random > 0.7) {
                // Apply call to action hint:
                newMessages.push({ role: 'assistant', content: `(${response.callToAction})`});
                setAppState({ messages: [...newMessages] });
                wasSent = true;
                console.log('call to action triggered after 15 seconds of idle time. ', random);
            }

        });
        idleTimer.current.start();

        idleTimer.current = new Timer(30000, () => {

            if (response.callToAction && wasSent === false) {
                // Apply call to action hint:
                newMessages.push({ role: 'assistant', content: `(${response.callToAction})`});
                setAppState({ messages: [...newMessages] });
                wasSent = true;
                console.log('call to action triggered after 25 seconds of idle time.');
            }

        });
        idleTimer.current.start();
    }

    return {handleStoryResponse};
}

// Audio Playback

// Adjust these constants to tweak the crossfade duration and steps
const fadeDuration = 500; // Crossfade duration in milliseconds
const fadeStep = 200; // Duration between volume adjustments in milliseconds

export function playAudioForSentiment(sentiment) {
    const audioFile = `/audio/${sentiment}.mp3`;
    if (audioFile) {
        const audio = new Audio(audioFile);
        if (window.nowPlayingAudio && window.nowPlayingString !== sentiment) {
            crossfadeAudio(window.nowPlayingAudio, audio);
        } else if (window.nowPlayingString != sentiment) {
            audio.volume = 0;
            fadeInAudio(audio, fadeDuration);
            console.log('fading in');
        }
        window.nowPlayingString = sentiment;
        window.nowPlayingAudio = audio;
        console.log(`Now playing: ${sentiment}`);
    } else {
        console.log('No audio file found for the sentiment.');
    }
}

function crossfadeAudio(audioOut, audioIn) {
    fadeOutAudio(audioOut, fadeDuration);
    fadeInAudio(audioIn, fadeDuration);
}

function fadeOutAudio(audio, duration) {
    let step = audio.volume / (duration / fadeStep);
    let interval = setInterval(() => {
        if (audio.volume > step) {
            audio.volume -= step;
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(interval);
        }
    }, fadeStep);
}

function fadeInAudio(audio, duration) {
    let step = 1 / (duration / fadeStep);
    audio.volume = 0;
    audio.play().catch(error => console.error('Error playing audio:', error));
    let interval = setInterval(() => {
        if (audio.volume < 1 - step) {
            audio.volume += step;
        } else {
            audio.volume = 1;
            clearInterval(interval);
        }
    }, fadeStep);
}

