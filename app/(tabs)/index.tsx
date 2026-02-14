import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email ?? "User");
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800">Welcome Home!</Text>
        <Text className="text-lg text-blue-600 mt-2">{userEmail}</Text>

        <View className="mt-12 bg-blue-50 p-6 rounded-2xl w-full items-center">
          <Text className="text-gray-600 text-center">
            You have successfully logged in with Google.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className="mt-12 bg-red-50 py-3 px-8 rounded-xl"
        >
          <Text className="text-red-600 font-semibold text-lg">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
