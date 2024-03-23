import {useEffect, useRef, useState} from "react";
import {useAppState} from "../../app-state/AppStateProvider"
import scrollToBottom from "../../utils/scrollToBottom";
import './story-body-styles.css'
import LoadingDots from "../../components/LoadingDots";

export default function StoryBodyView() {
    const {messages, status} = useAppState();
    const mainBodyContRef = useRef();
    const [finalTexts, setFinalTexts] = useState([]);

    // Apply typewriter effect to the latest message
    useEffect(() => {
        // Initialize finalTexts array based on messages length
        if (finalTexts.length !== messages.length) {
            setFinalTexts(messages.map(msg => msg.content));
        }

        // If there's no message or only system messages, do nothing
        if (!messages.length || messages.every(msg => msg.role === 'system')) return;

        const latestMessageIndex = messages.length - 1;
        const latestMessage = messages[latestMessageIndex];

        // Skip system messages
        if (latestMessage.role === 'system') return;

        let currentText = '';
        let index = 0;

        const typeWriterEffect = () => {
            if (index < latestMessage.content.length) {
                currentText += latestMessage.content.charAt(index++);
                // Update the specific message in the state
                setFinalTexts(texts => texts.map((text, i) => i === latestMessageIndex ? currentText : text));
            } else {
                clearInterval(intervalId);
            }
        };

        const intervalId = setInterval(typeWriterEffect, 50); // Adjust typing speed as necessary

        return () => clearInterval(intervalId); // Cleanup
    }, [messages]);

    useEffect(() => {
        if (mainBodyContRef.current && messages.length > 2) {
            scrollToBottom(mainBodyContRef.current);
        }
    }, [messages, finalTexts]); // Ensure scrolling accounts for the typewriter effect updates

    function inferMessageType(message) {
        if (message.role === 'user') {
            return 'user';
        }
        if (message.content.length <= 20) { // Assuming storyText has a max length of 35 words as per config
            return 'callToAction';
        } else {
            return 'story';
        }
    }

    // } else if (content.length > 35 && content.length <= 50) { // Assuming storyEvent has a max length of 50 words
    //     return 'storyEvent';
    // }


    return (
        <main ref={mainBodyContRef} id="main-body-cont">
            <div id="text-column-cont">
                {finalTexts.map((text, i) => {

                    const msgType = messages[i].role || 'user'; // Fallback to 'user' if undefined
                    // Skip system messages
                    if (msgType === 'system') return null;

                    return (
                        <p key={'msg' + i} className={inferMessageType(messages[i])}>
                            {text}
                        </p>
                    );
                })}
                {status === 'loading' && <LoadingDots/>}
            </div>
        </main>
    );
}