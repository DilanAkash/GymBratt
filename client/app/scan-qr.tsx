import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAttendance } from "../lib/AttendanceContext";

export default function ScanQrScreen() {
  const router = useRouter();
  const { addCheckIn } = useAttendance();

  const [scanned, setScanned] = useState(false);
  const [checkInInfo, setCheckInInfo] = useState<{
    gymName: string;
    gymId: string;
  } | null>(null);

  const handleFakeScan = () => {
    // 🧪 Template mode: pretend we scanned a real QR
    const gymId = "apex-gym-01";
    const gymName = "Apex Gym";

    // Save attendance entry to global state
    addCheckIn({ gymId });

    setScanned(true);
    setCheckInInfo({ gymId, gymName });
  };

  const handleReset = () => {
    setScanned(false);
    setCheckInInfo(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-3 pt-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="h-9 w-9 items-center justify-center rounded-full bg-white/10"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text className="flex-1 px-2 text-center text-base font-semibold text-slate-100">
            Scan check-in QR
          </Text>

          <View className="h-9 w-9" />
        </View>
      </View>

      <View
        className="flex-1"
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 16,
        }}
      >
        <Text className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Gym access
        </Text>
        <Text className="mt-1 text-sm text-slate-300">
          Scan the QR code displayed at your gym entrance to mark your
          attendance.
        </Text>

        {/* Fake scanner frame */}
        <View className="mt-4 h-[260px] items-center justify-center rounded-3xl border border-white/10 bg-black/80">
          <View className="h-40 w-40 rounded-3xl border-2 border-[rgba(13,242,13,0.9)]" />
          <Text className="mt-4 text-xs text-slate-400">
            (Template mode) Tap the button below to simulate a scan.
          </Text>
        </View>

        {/* Status + actions */}
        <View className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          {!scanned && !checkInInfo && (
            <>
              <Text className="text-sm font-semibold text-slate-100">
                Ready to scan
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                In the final version, your camera will automatically detect
                your gym&apos;s QR code. For now, use the button below to
                simulate a check-in while we wire up the rest of the app.
              </Text>
            </>
          )}

          {checkInInfo && (
            <View className="flex-row items-start gap-2">
              <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20">
                <Ionicons
                  name="checkmark"
                  size={18}
                  color="#6ee7b7"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-emerald-300">
                  Check-in recorded
                </Text>
                <Text className="mt-0.5 text-xs text-slate-300">
                  Welcome to{" "}
                  <Text className="font-semibold">
                    {checkInInfo.gymName}
                  </Text>
                  . Your visit for today is now marked.
                </Text>
                <Text className="mt-1 text-[11px] text-slate-500">
                  Gym ID: {checkInInfo.gymId}
                </Text>
              </View>
            </View>
          )}

          <View className="mt-4 flex-row justify-between gap-3">
            <TouchableOpacity
              className="flex-1 h-11 items-center justify-center rounded-full border border-white/20 bg-transparent"
              activeOpacity={0.85}
              onPress={handleReset}
            >
              <Text className="text-xs font-semibold text-slate-200">
                {scanned ? "Reset" : "Clear"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-11 items-center justify-center rounded-full bg-[rgb(13,242,13)]"
              activeOpacity={0.9}
              onPress={handleFakeScan}
            >
              <Text className="text-xs font-semibold text-[#050816]">
                Simulate scan
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-3 h-10 items-center justify-center rounded-full bg-white/5"
            activeOpacity={0.85}
            onPress={() => router.push("/attendance")}
          >
            <Text className="text-[11px] font-medium text-slate-200">
              View attendance
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
