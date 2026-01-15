import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withDelay,
    runOnJS
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

interface Props {
    visible: boolean;
    message?: string;
    onFinish?: () => void;
}

export default function SuccessAnimation({ visible, message = "Completed!", onFinish }: Props) {
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            opacity.value = withSpring(1);
            scale.value = withSequence(
                withSpring(1.2),
                withSpring(1)
            );

            // Auto hide after 2 seconds
            const timeout = setTimeout(() => {
                opacity.value = withSpring(0, {}, (finished) => {
                    if (finished && onFinish) {
                        runOnJS(onFinish)();
                    }
                });
                scale.value = withSpring(0);
            }, 2000);

            return () => clearTimeout(timeout);
        } else {
            scale.value = 0;
            opacity.value = 0;
        }
    }, [visible]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value
        };
    });

    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.container}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                <Animated.View style={[styles.card, animatedStyle]}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark" size={50} color="#0df20d" />
                    </View>
                    <Text style={styles.text}>{message}</Text>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    card: {
        backgroundColor: '#050816',
        padding: 30,
        borderRadius: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(13,242,13,0.3)',
        shadowColor: '#0df20d',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(13,242,13,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#0df20d'
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5
    }
});
