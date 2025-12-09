import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppUser } from "../../lib/UserContext";
import { auth } from "../../lib/firebase";

const PRIMARY = "#0df20d";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, resetUser } = useAppUser();

  const resolvedUser = {
    name: user.fullName || "Member",
    email: user.email || "member@example.com",
    gymName: user.gymName || "Your Gym",
    membershipStatus: user.membershipStatus || "Active",
    membershipLevel:
      user.membershipLevel || "Standard · 3 days / week",
  };

  const stats = {
    streakDays: 7,
    checkInsThisMonth: 12,
    programsCompleted: 2,
  };

  const handleLogout = async () => {
    // optional confirm — you can remove this if you want instant logout
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (err) {
              console.log("Error during sign out:", err);
              // even if signOut fails (offline), we still reset local state
            } finally {
              resetUser();
              router.replace("/welcome");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050816]">
      {/* Header */}
      <View className="border-b border-white/10 bg-[#050816]/80 px-4 pb-3 pt-4">
        <Text className="text-lg font-semibold text-slate-200">
          Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 32,
        }}
      >
        {/* User card */}
        <View className="mb-5 flex-row items-center rounded-3xl border border-white/10 bg-white/5 p-4">
          <View className="mr-4 h-14 w-14 items-center justify-center rounded-full border border-[rgba(13,242,13,0.8)] bg-black/80">
            <Text className="text-2xl font-semibold text-white">
              {resolvedUser.name.charAt(0)}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-slate-50">
              {resolvedUser.name}
            </Text>
            <Text className="mt-0.5 text-xs text-slate-400">
              {resolvedUser.email}
            </Text>

            <View className="mt-2 flex-row flex-wrap gap-2">
              <View className="flex-row items-center rounded-full bg-emerald-500/10 px-3 py-1">
                <View className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <Text className="text-xs font-medium text-emerald-300">
                  {resolvedUser.membershipStatus}
                </Text>
              </View>
              <View className="flex-row items-center rounded-full bg-white/5 px-3 py-1">
                <Ionicons
                  name="barbell-outline"
                  size={13}
                  color="#9ca3af"
                />
                <Text className="ml-1 text-xs text-slate-300">
                  {resolvedUser.gymName}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick stats */}
        <View className="mb-5 grid grid-cols-3 gap-3">
          <View className="items-start rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Streak
            </Text>
            <Text className="mt-1 text-xl font-bold text-slate-50">
              {stats.streakDays}
            </Text>
            <Text className="mt-0.5 text-[11px] text-slate-400">
              days in a row
            </Text>
          </View>

          <View className="items-start rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Check-ins
            </Text>
            <Text className="mt-1 text-xl font-bold text-slate-50">
              {stats.checkInsThisMonth}
            </Text>
            <Text className="mt-0.5 text-[11px] text-slate-400">
              this month
            </Text>
          </View>

          <View className="items-start rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <Text className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Programs
            </Text>
            <Text className="mt-1 text-xl font-bold text-slate-50">
              {stats.programsCompleted}
            </Text>
            <Text className="mt-0.5 text-[11px] text-slate-400">
              completed
            </Text>
          </View>
        </View>

        {/* Membership card */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-emerald-500/10 p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Membership
              </Text>
              <Text className="mt-1 text-sm font-semibold text-slate-50">
                {resolvedUser.membershipLevel}
              </Text>
            </View>
            <TouchableOpacity
              className="flex-row items-center rounded-full bg-white/10 px-3 py-1"
              onPress={() => router.push("/membership-details")}
            >
              <Text className="text-xs font-medium text-slate-100">
                View details
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color="#e5e7eb"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions list */}
        <View className="mb-6 rounded-3xl border border-white/10 bg-white/5">
          {/* Edit profile */}
          <TouchableOpacity
            className="flex-row items-center justify-between px-4 py-3.5"
            activeOpacity={0.8}
            onPress={() => router.push("/edit-profile")}
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color="#6ee7b7"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-slate-100">
                  Edit profile
                </Text>
                <Text className="text-xs text-slate-400">
                  Update your personal info
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#4b5563"
            />
          </TouchableOpacity>

          {/* Attendance */}
          <TouchableOpacity
            className="flex-row items-center justify-between border-t border-white/10 px-4 py-3.5"
            activeOpacity={0.8}
            onPress={() => router.push("/attendance")}
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-sky-500/10">
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#7dd3fc"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-slate-100">
                  Attendance
                </Text>
                <Text className="text-xs text-slate-400">
                  View your check-in history
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#4b5563"
            />
          </TouchableOpacity>

          {/* Payments */}
          <TouchableOpacity
            className="flex-row items-center justify-between border-t border-white/10 px-4 py-3.5"
            activeOpacity={0.8}
            onPress={() => router.push("/payments")}
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-amber-500/10">
                <Ionicons
                  name="card-outline"
                  size={18}
                  color="#fbbf24"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-slate-100">
                  Payments
                </Text>
                <Text className="text-xs text-slate-400">
                  Invoices & payment history
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#4b5563"
            />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            className="flex-row items-center justify-between border-t border-white/10 px-4 py-3.5"
            activeOpacity={0.8}
            onPress={() => router.push("/settings")}
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-slate-500/10">
                <Ionicons
                  name="settings-outline"
                  size={18}
                  color="#9ca3af"
                />
              </View>
              <View>
                <Text className="text-sm font-medium text-slate-100">
                  Settings
                </Text>
                <Text className="text-xs text-slate-400">
                  Notifications & preferences
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#4b5563"
            />
          </TouchableOpacity>
        </View>

        {/* Logout section */}
        <View className="mt-2 rounded-3xl border border-rose-500/40 bg-rose-500/10 px-4 py-4">
          <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-300/80">
            Account
          </Text>

          <TouchableOpacity
            className="flex-row items-center justify-between"
            activeOpacity={0.85}
            onPress={handleLogout}
          >
            <View className="flex-row items-center">
              <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-rose-500/20">
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color="#fecaca"
                />
              </View>
              <View>
                <Text className="text-sm font-semibold text-rose-100">
                  Log out
                </Text>
                <Text className="text-xs text-rose-200/80">
                  Sign out of this account
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#fecaca"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
