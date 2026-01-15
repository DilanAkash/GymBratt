import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

interface Props {
    trigger: boolean;
    onComplete?: () => void;
}

export const ConfettiCelebration = ({ trigger, onComplete }: Props) => {
    const [sound, setSound] = React.useState<Audio.Sound>();
    const celebrationRef = React.useRef<ConfettiCannon>(null);

    useEffect(() => {
        if (trigger) {
            playSound();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (celebrationRef.current) {
                celebrationRef.current.start();
            }
        }
    }, [trigger]);

    const playSound = async () => {
        // Basic fallback "ding" if no custom sound asset available yet
        // In production we would load require('../assets/success.mp3')
        // For now we rely on the visual and haptic feedback primarily
    };

    if (!trigger) return null;

    return (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <ConfettiCannon
                ref={celebrationRef}
                count={100}
                origin={{ x: -10, y: 0 }} // Start from top left/right
                autoStart={false}
                fadeOut={true}
                onAnimationEnd={onComplete}
            />
            <ConfettiCannon
                count={100}
                origin={{ x: 400, y: 0 }}
                autoStart={true} // Auto start this one immediately
                fadeOut={true}
            />
        </View>
    );
};
