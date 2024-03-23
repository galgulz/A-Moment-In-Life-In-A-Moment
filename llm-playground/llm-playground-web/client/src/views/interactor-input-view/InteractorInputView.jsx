import { useCallback, useEffect, useRef, useState } from "react";
import {useAppState, useSetAppState} from "../../app-state/AppStateProvider";
import {SETTINGS} from "../../../settings";
import {useHandleStoryResponse} from "../../story/story-logic";
import "./interactor-input-styles.css";
import LoadingDots from "../../components/LoadingDots";


// eslint-disable-next-line react-refresh/only-export-components
export function playAudio(path) {
    const audio = new Audio(path);
    audio.play().catch(error => console.error('Error playing audio:', error));
    console.log(`Now playing: ${path}`);
    return audio;
}

// images from pictures folder
const images = {
    0: "/pictures/scenario0.webp",
    1: "/pictures/scenario1.webp",
    2: "/pictures/scenario2.webp",
    3: "/pictures/cyclist.webp",
    4: "/pictures/yellowlight.webp",
    5: "/pictures/scenario5.webp",
    6: "/pictures/boss.webp",
    7: "/pictures/school1.webp",
    8: "/pictures/accident.webp",
    9: "/pictures/end.webp",
    // Add more as needed
};

export default function InteractorInputView() {
    const {messages, status, inputMessage, isEnd} = useAppState();
    const setAppState = useSetAppState();
    const {handleStoryResponse} = useHandleStoryResponse();
    const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0); // Index of the current scenario in the scenarios array
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [outcome, setOutcome] = useState(""); // To store the outcome of the player's choice
    const [scenariosCompleted, setScenariosCompleted] = useState(false);
    const [displayDescription, setDisplayDescription] = useState(true);
    const [outcomeColor, setOutcomeColor] = useState("#C1E1C1"); // Replace "initialColor" with your default color
    const [loadingChoice, setLoadingChoice] = useState(null); // Add this line
    const [backgroundImage, setBackgroundImage] = useState(images[currentScenarioIndex]);
    const [typewriterDescription, setTypewriterDescription] = useState("");
    const [showOutcome, setShowOutcome] = useState(false); // New state variable for controlling the visibility of the outcome
    const [outcomeFontSize, setOutcomeFontSize] = useState("initialFontSize");
    const [isTrafficAudioPlaying, setIsTrafficAudioPlaying] = useState(false);
    const trafficAudioRef = useRef(null);
    let brakeAudio; // Variable to hold the brake audio when needed

    let start;
    let isScenariosEnd = false;
    let playedBrake = false;

    // Callback hooks
    const handleUserInteraction = useCallback(() => {
        // setHasUserInteracted(true);
        //  // Play start audio on user interaction
        // // eslint-disable-next-line react-hooks/exhaustive-deps
        // start = playAudio('/audio/traffic.mp4');


        setHasUserInteracted(true);
        // const audio = playAudio('/audio/traffic.mp4'); // Play traffic audio
        setIsTrafficAudioPlaying(true); // This will trigger the useEffect to play the audio

        // setTrafficAudio(audio); // Store the traffic audio object for later control
    }, []);

    // Function to handle the scenario where brake sound needs to be played
    const playBrakeSound = () => {
        // Ensure traffic audio is paused
        if (isScenariosEnd){

            setIsTrafficAudioPlaying(false); // This will trigger the useEffect to pause the audio

            // Initialize and play brake audio
            const brakeAudio = new Audio('/audio/Brake sound effect.mp3');
            brakeAudio.play().catch(error => console.error('Error playing brake audio:', error));
            // Consider managing the brake audio similarly if it needs to be reused or controlled further
        }
    };




    useEffect(() => {
        // Initialize the audio object and store it in the ref
        trafficAudioRef.current = new Audio('/audio/traffic.mp4');

        // // Cleanup function to pause and clean up on component unmount
        // return () => {
        //     trafficAudioRef.current.pause();
        //     trafficAudioRef.current = null;
        // };
    }, []);

    useEffect(() => {
        // Optional: Any initialization if needed
        return () => {
            if (isEnd) {
                playAudio('/audio/end.mp3'); // Play end audio on cleanup if the story has ended
            }
        };
    }, [isEnd]);
    useEffect(() => {
        // Play or pause the audio based on isTrafficAudioPlaying state
        if (isTrafficAudioPlaying) {
            trafficAudioRef.current.play().catch(error => console.error('Error playing traffic audio:', error));
        } else {
            trafficAudioRef.current.pause();
        }
    }, [isTrafficAudioPlaying]);

    const scenarios = [
        {
            id: 1,
            heading: "",
            description: `Morning traffic’s a zoo, and Noah, your child, is in the back, freaking out about being late again. "Seriously?" you groan, glancing at the jam-packed road. "It's like we're moving backwards." With the ticking clock mocking you and Noah's drama queen performance in full swing, you grin devilishly. "Alright, beast," you whisper to your car, flipping it to 'sport mode' with a flick. "Let's show them what we're made of." Time to drive like you're in "Fast & Furious 374", minus the Nissan GTR, and no Tokyo Drifts either.`,
            choices: [
                {label: "Continue Driving"},
            ]
        },
        {
            id: 2,
            heading: "The Rushed Pedestrian",
            description: "Coming up to a crosswalk, you see an old lady eyeing the other side. " +
                "It's now or never: speed up and hope she doesn't step off or hit the brakes and wait for her slow cross?",
            choices: [
                {
                    label: "Press the gas",
                    outcome: "You zoom past just as she steps off. She shakes her fist at you. " +
                        "Nice one, you nearly gave her a heart attack."
                },
                {
                    label: "Slow to stop",
                    outcome: "Look at you stopping! She's so surprised she nearly forgets to walk. " +
                        "Didn't know you had it in you!"
                }
            ]
        },
        {
            id: 3,
            heading: "Sudden Kindergarten Zone",
            description: "Suddenly, you're near a kindergarten. A sign shows you should slow down. Do you follow it, or keep your speed and save time?",
            choices: [
                {
                    label: "Keep speed",
                    outcome: "Ignoring the sign, you zoom past. Quick, sure, but with kids nearby, it's a risky move that leaves you feeling a bit guilty."
                },
                {
                    label: "Slow down",
                    outcome: "You slow down, and everyone looks happy. Look at you being all responsible!"
                }
            ]
        },
        {
            id: 4,
            heading: "The Daring Cyclist",
            description: "Thinking about what to eat later when suddenly, a cyclist cuts in front. Do you swerve around or brake hard to avoid a mess?",
            choices: [
                {
                    label: "Swerve",
                    outcome: "You swerve and miss them, but give someone else a scare. You're like a stunt driver in your own movie."
                },
                {
                    label: "Brake",
                    outcome: "You hit the brakes and avoid an accident. The cyclist just nods and moves on. You're a secret hero, minus the applause."
                }
            ]
        },
        {
            id: 5,
            heading: "The Yellow Light",
            description: "A yellow light ahead. Stopping is awkward, but so is blasting through. What'll it be?",
            choices: [
                {label: "Run it", outcome: "You go for it and make it through. A mini-heart attack for free!"},
                {
                    label: "Try stopping",
                    outcome: "You stop in time, getting some surprised looks. Since when did you follow rules?"
                }
            ]
        },
        {
            id: 6,
            heading: "Lane Merging Courtesy",
            description: "Someone signals to merge into your lane. Do you ease up and let them, or do you lay on the horn and give them a piece of your mind for trying to cut you off?",
            choices: [
                {
                    label: "Honk and fuss",
                    outcome: "You honk, shout something about their mom's job, and keep tight on your lane. Feels kinda petty now, doesn't it?"
                },
                {
                    label: "Let them in",
                    outcome: "You back off a bit and let them in. They give you a thankful wave. Look at you, spreading good vibes on the road!"
                }
            ]
        },
        {
            id: 7,
            heading: "The Boss's Text",
            description: "An urgent text from your boss buzzes in. Do you sneak a quick text back while behind the wheel, or wait until you've safely dropped off Noah at school?",
            choices: [
                {
                    label: "Text now",
                    outcome: "You try to sneak in a quick reply, almost rear-ending the car in front of you. Heart racing, message sent – but at what risk?"
                },
                {
                    label: "Slow down",
                    outcome: "Safety first. You choose to ignore it for now, planning to reply once Noah is safely dropped off. A little delay for a lot of safety."
                }
            ]
        },
        {
            // Last scenario - continue to main story
            id: 8,
            description: "",
            choices: [
                {label: "Continue Driving"},
            ]
        },
        {
            // Last scenario - continue to main story
            id: 9,
            description: "",
            choices: []
        }
        // Add more scenarios as needed
    ];


    const handlePlayerChoice = (choiceLabel) => {
        // Mark the choice as loading
        setLoadingChoice(choiceLabel);

        const scenario = scenarios[currentScenarioIndex];
        const choice = scenario.choices.find(choice => choice.label === choiceLabel);


        // Hide the scenario description and set the initial outcome based on the choice
        setDisplayDescription(false);
        setOutcome(choice.outcome);
        // Reset the outcome color to the default immediately
        // setOutcomeColor("#8FBC8F");
        setOutcomeColor("#C1E1C1"); // Adjust the color as needed

        setOutcomeFontSize("22px"); // Reset to default font size


        // Simulate processing the choice (e.g., fetching new data or just waiting)
        setTimeout(() => {
            // Hide the loading indicator for this choice
            setLoadingChoice(null);

            if (currentScenarioIndex < scenarios.length - 1) {
                // Proceed to the next scenario if there are more
                setCurrentScenarioIndex(current => current + 1);
                // Show the scenario description for the next scenario
                setDisplayDescription(true);
            } else {
                // If there are no more scenarios, mark them as completed
                setScenariosCompleted(true);
                setAppState(prevState => ({...prevState, scenariosCompleted: true}));
            }

            // Change the outcome color after processing is done
            // setOutcomeColor("#C1E1C1"); // Adjust the color as needed
            setOutcomeColor("#8FBC8F"); // Adjust the color as needed
            // setOutcomeFontSize("18px"); // Make the text smaller
            setOutcomeFontSize("22px"); // Make the text smaller

            // if ( choice.outcome ){
            //     setShowOutcome(true); // Make the outcome visible after pressing the button
            //
            // }
            setShowOutcome(true); // Make the outcome visible after pressing the button


        }, 2500); // This delay simulates the time taken to process the choice
    };
    // In your render method or return statement of the component


    useEffect(() => {

        console.log("Current scenario index:", currentScenarioIndex, " of ", scenarios.length);
        console.log("Current scenario:", scenarios[currentScenarioIndex]);
        // console.log("completed3 ", useAppState().scenariosCompleted);
        console.log("Scenarios completed1:", isScenariosEnd);
        console.log("Scenarios completed2:", scenariosCompleted);
        setBackgroundImage(images[currentScenarioIndex]);



        const rootElement = document.getElementById("root");
        if (rootElement) {
            const backgroundImageUrl = images[currentScenarioIndex] || images[8];
            // Use images[0] as the initial background, then update based on currentScenarioIndex
            rootElement.style.backgroundImage = `url(${backgroundImageUrl})`;
            rootElement.style.backgroundSize = "cover"; // Ensure it covers the entire element
            rootElement.style.backgroundPosition = "center"; // Center the background image
            if (isEnd){
                rootElement.style.backgroundImage = `url(${images[9]})`;
            }
        }


        if (currentScenarioIndex === scenarios.length - 1 && !scenariosCompleted) {

            // setScenariosCompleted(true); // Indicate that initial scenarios are completed
            // set scenariosCompleted to true
            console.log("All scenarios completed. ");
            // eslint-disable-next-line react-hooks/exhaustive-deps
            isScenariosEnd = true;
            setAppState({scenariosCompleted: true});
            if(!playedBrake){
                playBrakeSound(); // Call the function to play the brake sound

                // playAudio(`/audio/Brake sound effect.mp3`);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                playedBrake = true;
            }

        }

        // Clear existing text immediately before starting the typewriter effect.
        // Resetting typewriter description outside of typewriter function to ensure immediate effect.
        setTypewriterDescription("");

        // Assuming scenarios[currentScenarioIndex] is defined and has a 'description' property.
        const currentDescription = scenarios[currentScenarioIndex].description;

        if (currentDescription && currentDescription.length > 0) {
            // Initialize the typewriterDescription with the first character of the description.
            setTypewriterDescription(currentDescription.charAt(0));

            let index = 0; // Start from the second character
            const typeWriterEffect = () => {
                if (index < currentDescription.length) {
                    setTypewriterDescription((prev) => prev + currentDescription.charAt(index));
                    index++;
                } else {
                    clearInterval(intervalId); // Stop the interval when done
                }
            };

            // Start typing right away without delay for the first character
            // This is now removed because we already added the first character.
            // typeWriterEffect();

            const intervalId = setInterval(typeWriterEffect, 50); // Continue with the rest of the characters.

            return () => clearInterval(intervalId); // Cleanup on unmount or when dependencies change.
        }
        // Cleanup function to play end audio when component unmounts or scenarios are completed
        // return () => {
        //     //
        //     // if (isEnd) {
        //     //     console.log("play end");
        //     //     playAudio(`/audio/end.mp3`);
        //     //
        //     // }
        // };


    }, [currentScenarioIndex, scenarios.length]);


    const analyzeSentiment = useCallback((message) => {
        // Implement sentiment analysis logic here (you can use the existing analyzeSentiment function)
    }, []);

    const playAudioForSentiment = useCallback((sentiment) => {
        // Implement audio playback logic here (you can use the existing playAudioForSentiment function)
    }, []);

    const send = useCallback(() => {
        const sentiment = analyzeSentiment(inputMessage); // Analyze sentiment before sending
        const newMessages = [...messages, {role: 'user', content: inputMessage}];

        setAppState({messages: newMessages, status: 'loading', inputMessage: ''});

        fetch(
            `${SETTINGS.SERVER_URL}/story-completions`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(newMessages)
            }
        ).then(response => response.json())
            .then(data => {
                try {
                    let storytellerResponse = data.choices[0].message.content;
                    storytellerResponse = JSON.parse(storytellerResponse);

                    setAppState({status: 'idle'});
                    handleStoryResponse(newMessages, storytellerResponse);

                    playAudioForSentiment(sentiment); // Play audio based on sentiment
                } catch (err) {
                    console.error('Error processing response:', err);
                }
            }).catch(err => {
            console.error('API error:', err);
            setAppState({status: 'error'});
        });

    }, [messages, inputMessage, analyzeSentiment, handleStoryResponse, playAudioForSentiment, setAppState]);


    if (!hasUserInteracted) {
        return (
            // <div id="interactor-box" style={{ /* Styles */ }}>
                <button onClick={handleUserInteraction}>Start Experience</button>
            // </div>
        );
    }


    return (
        <div id="interactor-box" style={{
            // backgroundImage: `url(${backgroundImage})`,
            // backgroundSize: "cover", // Cover the entire div
            opacity: status === 'loading' ? 0.3 : 1,
            pointerEvents: status === 'loading' ? 'none' : 'auto',
            color: status === 'error' ? 'red' : 'auto'
        }}>
            {/*<label htmlFor="interactor-text-input" className="input-label">Matthew:</label>*/}

            {!isEnd ? (
                <>
                    {/* Check if scenarios have been completed */}
                    {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
                    {scenarios[currentScenarioIndex] && !useAppState().scenariosCompleted ? (
                        // {scenarios[currentScenarioIndex] && !isScenariosEnd || !useAppState().scenariosCompleted ? (
                        // {scenarios[currentScenarioIndex] && currentScenarioIndex < scenarios.length ? (
                        <>
                            {displayDescription && (
                                <>
                                    <div className="section-scenarios">
                                        {currentScenarioIndex > 0 && currentScenarioIndex < 7 ? (
                                            <div
                                                className={"sc-head"}>{scenarios[currentScenarioIndex].heading}</div>) : null}

                                    </div>
                                    {/* Display the current scenario description */}
                                    {
                                        currentScenarioIndex === 0 ? (
                                            <div className="first-scenario">
                                                {/*{scenarios[0].description}*/}
                                                {typewriterDescription}

                                            </div>
                                        ) : (
                                            currentScenarioIndex < scenarios.length - 2 && (
                                                <div className="sc-description">
                                                    {typewriterDescription}
                                                    {/*{scenarios[currentScenarioIndex].description}*/}
                                                </div>)
                                        )
                                    }
                                </>
                            )}

                            <div className="Matthew-label1">Matthew Chooses To:</div>

                            {/* Display choices for the current scenario */}
                            <div
                                className={"scenario-num"}>{scenarios[currentScenarioIndex].choices.map((choice, index) => (
                                <button key={index}
                                        onClick={() => {handlePlayerChoice(choice.label); handleUserInteraction(); playBrakeSound()}}
                                        disabled={loadingChoice === choice.label}>
                                    {loadingChoice === choice.label ? (
                                        <LoadingDots size={8} color="#444" speed={1}/>
                                    ) : (
                                        choice.label
                                    )}
                                </button>
                            ))}</div>
                            {/*<div className={"outcome"}>{outcome}</div> /!* Render the outcome of the last choice *!/*/}
                            {/*<div className={"outcome"} style={{color: outcomeColor}}>{outcome}</div>*/}
                            {showOutcome && (
                                // <div className={"outcome"} style={{color: outcomeColor}}>{outcome}</div>
                                <div className="outcome" style={{color: outcomeColor, fontSize: outcomeFontSize}}>
                                    {outcome}
                                </div>

                            )}

                        </>
                    ) : (
                        // Regular textbox for chat interactions if scenarios are completed or not present
                        <>
                            <div className="Matthew-label2">Matthew:</div>

                            <input
                                id="interactor-text-input"
                                value={inputMessage}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') send();
                                }}
                                onChange={e => setAppState({inputMessage: e.target.value})}
                            />
                            {/*<div className={"send-button"} onClick={send}>Send</div>*/}
                        </>
                    )}
                    {/*<div className={"outcome"}>{outcome}</div> /!* Render the outcome of the last choice *!/*/}
                    {status === 'error' && 'Something is broken 😵‍💫'}
                </>
            ) : (
                <div className={"end"}>End of story</div>
            )}
        </div>
    );


}