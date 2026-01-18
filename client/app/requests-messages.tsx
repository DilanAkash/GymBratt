import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View, Modal, TextInput, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppUser } from "../lib/UserContext";
import { useState, useEffect } from "react";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

const PRIMARY = "#0df20d";

type Ticket = {
  id: string;
  subject: string;
  status: 'Open' | 'Resolved' | 'Closed';
  createdAt: any;
  userId: string;
  gymId: string;
};

export default function RequestsMessagesScreen() {
  const router = useRouter();
  const { user } = useAppUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user.uid) return;

    // Listen to user's tickets
    const q = query(
      collection(db, "tickets"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      setTickets(fetched);
      setLoading(false);
    });

    return () => unsub();
  }, [user.uid]);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, "tickets"), {
        userId: user.uid,
        gymId: user.gymId || "global",
        subject,
        message,
        status: 'Open',
        createdAt: serverTimestamp(),
        userName: user.fullName
      });
      setModalVisible(false);
      setSubject("");
      setMessage("");
      Alert.alert("Success", "Ticket submitted.");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSending(false);
    }
  };

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
            Requests & Support
          </Text>

          <View className="h-10 w-10" />
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* New request button */}
        <TouchableOpacity
          className="mb-5 flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600 bg-slate-800/70 px-4 py-3"
          activeOpacity={0.9}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={18} color={PRIMARY} />
          <Text className="text-sm font-semibold text-[rgb(13,242,13)]">
            New Ticket
          </Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator color={PRIMARY} />
        ) : (
          <View className="rounded-3xl border border-white/10 bg-white/5">
            {tickets.length === 0 ? (
              <View className="p-4 items-center">
                <Text className="text-slate-400">No tickets found.</Text>
              </View>
            ) : (
              tickets.map((item, idx) => (
                <View key={item.id}>
                  {idx > 0 && <View className="h-[1px] w-full bg-white/10" />}

                  <TouchableOpacity
                    className="flex-row items-center px-4 py-4"
                    activeOpacity={0.9}
                  >
                    <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-white/10">
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={18}
                        color="#e5e7eb"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-sm font-medium text-slate-50">
                        {item.subject}
                      </Text>
                      <Text className="mt-1 text-xs text-slate-400">
                        {/* Format timestamp if needed */}
                        Ticket #{item.id.slice(0, 5)}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text
                        className={`text-xs font-semibold ${item.status === "Open"
                            ? "text-yellow-400"
                            : "text-[rgb(13,242,13)]"
                          }`}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Create Ticket Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/80 justify-center px-4">
          <View className="bg-zinc-900 rounded-3xl p-6 border border-white/10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-bold">New Ticket</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-slate-400 text-xs mb-1 ml-1">Subject</Text>
            <TextInput
              className="bg-zinc-800 text-white p-3 rounded-xl mb-4 border border-zinc-700"
              placeholder="e.g. Pause Membership"
              placeholderTextColor="#666"
              value={subject}
              onChangeText={setSubject}
            />

            <Text className="text-slate-400 text-xs mb-1 ml-1">Message</Text>
            <TextInput
              className="bg-zinc-800 text-white p-3 rounded-xl mb-6 border border-zinc-700 h-32"
              placeholder="Describe your request..."
              placeholderTextColor="#666"
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={sending}
              className="bg-[rgb(13,242,13)] p-4 rounded-xl items-center"
            >
              {sending ? <ActivityIndicator color="black" /> : <Text className="font-bold text-black">Submit Ticket</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
