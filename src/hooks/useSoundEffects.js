import { useCallback } from "react";

const SOUND_PATHS = {
    click: "/sounds/click.mp3",
    correct: "/sounds/correct.mp3",
    wrong: "/sounds/wrong.mp3",
};

export const useSoundEffects = () => {
    const playSound = useCallback((path) => {
        // Basic Audio playback. 
        // In a real production app with high frequency, we might use Howler.js, 
        // but for this scope (simple button clicks), standard Audio is sufficient.
        const audio = new Audio(path);
        audio.play().catch((error) => {
            // Catch errors (e.g., if file doesn't exist or user hasn't interacted yet)
            console.warn("Audio playback failed:", error);
        });
    }, []);

    const playClick = useCallback(() => {
        playSound(SOUND_PATHS.click);
    }, [playSound]);

    const playCorrect = useCallback(() => {
        playSound(SOUND_PATHS.correct);
    }, [playSound]);

    const playWrong = useCallback(() => {
        playSound(SOUND_PATHS.wrong);
    }, [playSound]);

    return {
        playClick,
        playCorrect,
        playWrong,
    };
};
