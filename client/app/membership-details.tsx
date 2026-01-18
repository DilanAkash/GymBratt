import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppUser } from "../lib/UserContext";
import QRCode from "react-native-qrcode-svg";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useState } from "react";

const PRIMARY = "#0df20d";

export default function MembershipDetailsScreen() {
  const router = useRouter();
  const { user } = useAppUser();
  const [flipped, setFlipped] = useState(false);

  // Animation values
  const rotation = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      width: '100%',
      height: '100%'
    };
  });

  const backStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotation.value + 180}deg` }],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      width: '100%',
      height: '100%'
    };
  });

  const handleFlip = () => {
    if (flipped) {
      rotation.value = withSpring(0);
    } else {
      rotation.value = withSpring(180);
    }
    setFlipped(!flipped);
  };

  // Safe defaults if fields missing
  const gymName = user.gymName || "No Gym Joined";
  const plan = user.membershipLevel || "Free Tier";
  const memberId = user.uid?.substring(0, 8).toUpperCase() || "N/A";

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-2 pt-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-10 w-10 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text className="flex-1 px-2 text-center text-lg font-bold text-white">
            Membership Card
          </Text>

          <View className="h-10 w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>

        <View style={{ height: 220, marginBottom: 24 }}>
          <TouchableOpacity activeOpacity={0.9} onPress={handleFlip} style={{ flex: 1 }}>

            {/* Front Side */}
            <Animated.View style={[frontStyle]} className="rounded-3xl bg-slate-800 overflow-hidden border border-white/10 p-6 flex justify-between">
              <View className="absolute right-[-40] top-[-40] w-40 h-40 bg-[rgba(13,242,13,0.1)] rounded-full blur-2xl" />

              <View className="flex-row justify-between items-start">
                <View>
                  <Text className="text-xl font-bold text-white tracking-widest uppercase">{gymName}</Text>
                  <Text className="text-xs text-lime-400 uppercase tracking-widest mt-1">Member Access</Text>
                </View>
                <Ionicons name="grid" size={24} color="rgba(255,255,255,0.2)" />
              </View>

              <View>
                <Text className="text-slate-400 text-xs uppercase tracking-wider mb-1">Card Holder</Text>
                <Text className="text-lg font-bold text-white mb-4">{user.fullName}</Text>

                <View className="flex-row justify-between items-end">
                  <View>
                    <Text className="text-slate-500 text-[10px] uppercase">ID Number</Text>
                    <Text className="text-slate-300 font-mono text-sm">{memberId}</Text>
                  </View>
                  <View>
                    <Text className="text-slate-500 text-[10px] uppercase text-right">Plan</Text>
                    <Text className="text-lime-400 font-bold text-sm text-right">{plan}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>

            {/* Back Side (QR) */}
            <Animated.View style={[backStyle]} className="rounded-3xl bg-white items-center justify-center p-6 border border-white/10">
              <Text className="text-black font-bold mb-4">Scan for Entry</Text>
              {user.uid && <QRCode value={user.uid} size={120} />}
              <Text className="text-slate-500 text-xs mt-4">{memberId}</Text>
            </Animated.View>

          </TouchableOpacity>
        </View>

        <Text className="text-center text-zinc-500 text-xs mb-8">Tap card to flip and view QR code</Text>

        {/* Details List */}
        <View className="rounded-3xl border border-white/10 bg-white/5 p-5 mb-6">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-4">Plan Details</Text>

          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-300">Status</Text>
            <View className="rounded-full bg-lime-500/20 px-2 py-0.5">
              <Text className="text-lime-400 text-xs font-bold">{user.membershipStatus}</Text>
            </View>
          </View>
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-300">Gym</Text>
            <Text className="text-white font-medium">{gymName}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-slate-300">Member Since</Text>
            <Text className="text-white font-medium">Jan 2024</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
