import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Intro2() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-between">
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../assets/svg/analys-spending.svg")}
          style={{ width: 300, height: 300 }}
          contentFit="contain"
        />

        <Text className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Analyze Your Spending
        </Text>
        <Text className="text-base text-gray-600 text-center font-sans">
          Get detailed insights and reports on your spending habits. Make
          smarter financial decisions.
        </Text>
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-xl items-center mb-8"
        onPress={() => router.push("/auth")}
      >
        <Text className="text-white text-lg font-semibold">
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
