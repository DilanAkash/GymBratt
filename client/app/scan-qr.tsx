import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAttendance } from "../lib/AttendanceContext";

export default function ScanQrScreen() {
  const router = useRouter();
  const { addCheckIn } = useAttendance();
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [checkInInfo, setCheckInInfo] = useState<{
    gymName: string;
    gymId: string;
  } | null>(null);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || processing) return;
    setScanned(true);
    setProcessing(true);

    try {
      // Assuming data is just the gymId or a JSON.
      // For simple MVP, assume data is "gymId" or "json"
      // Let's assume it's simply the gym ID string for now, or we can try to parse JSON
      let gymId = data;
      let gymName = "Unknown Gym";

      try {
        const parsed = JSON.parse(data);
        if (parsed.gymId) {
          gymId = parsed.gymId;
          gymName = parsed.gymName || "Gym";
        }
      } catch (e) {
        // Not JSON, treat as raw ID
      }

      // Just use a mock name lookup if we only have ID
      if (gymName === "Unknown Gym" && gymId.includes("apex")) {
        gymName = "Apex Gym";
      }

      await addCheckIn({ gymId });
      setCheckInInfo({ gymId, gymName });
    } catch (error) {
      Alert.alert("Check-in Failed", "Could not verify scanned code.");
      setScanned(false);
    } finally {
      setProcessing(false);
    }
  };

  const handleManualCheckIn = async () => {
    // 🧪 Fallback/Template mode
    if (scanned || processing) return;
    setScanned(true);
    setProcessing(true);

    // Simulate delay
    setTimeout(async () => {
      try {
        const gymId = "apex-gym-01";
        await addCheckIn({ gymId });
        setCheckInInfo({ gymId, gymName: "Apex Gym" });
      } finally {
        setProcessing(false);
      }
    }, 1000);
  };

  const handleReset = () => {
    setScanned(false);
    setCheckInInfo(null);
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View className="flex-1 bg-[#050816]" />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-[#050816] items-center justify-center p-6">
        <Text className="text-center text-slate-100 font-semibold mb-4">
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[rgb(13,242,13)] px-6 py-3 rounded-full"
        >
          <Text className="font-bold text-[#050816]">Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4"
        >
          <Text className="text-slate-400">Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
          Scan the QR code displayed at your gym entrance.
        </Text>

        {/* Camera Frame */}
        <View className="mt-4 h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-black">
          {/* If processing check-in or done, maybe blur or show overlay? */}
          {/* For simplicity: always show camera, but stop scanning if 'scanned' is true */}
          <CameraView
            style={{ flex: 1 }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
          >
            {/* Overlay guides */}
            <View className="flex-1 items-center justify-center">
              <View className="h-48 w-48 rounded-3xl border-2 border-[rgba(13,242,13,0.5)] bg-transparent" />
            </View>
          </CameraView>

          {processing && (
            <View className="absolute inset-0 items-center justify-center bg-black/60">
              <ActivityIndicator size="large" color="#0df20d" />
              <Text className="mt-2 text-sm font-medium text-white">Verifying...</Text>
            </View>
          )}
        </View>

        {/* Status + actions */}
        <View className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-4">
          {!scanned && !checkInInfo && (
            <>
              <Text className="text-sm font-semibold text-slate-100">
                Ready to scan
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                Point your camera at the code. If it doesn't work, ensure there's enough light.
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
              disabled={!scanned}
            >
              <Text className={`text-xs font-semibold ${!scanned ? "text-zinc-600" : "text-slate-200"}`}>
                Reset
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 h-11 items-center justify-center rounded-full bg-white/10"
              activeOpacity={0.9}
              onPress={handleManualCheckIn}
              disabled={scanned}
            >
              <Text className={`text-xs font-semibold ${scanned ? "text-zinc-500" : "text-slate-200"}`}>
                Manual Check-in
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="mt-3 h-10 items-center justify-center rounded-full bg-white/5"
            activeOpacity={0.85}
            onPress={() => router.push("/attendance")}
          >
            <Text className="text-[11px] font-medium text-slate-200">
              View attendance history
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
