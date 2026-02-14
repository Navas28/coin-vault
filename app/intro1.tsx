import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Intro1() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white p-6 justify-between">
      <View className="flex-1 justify-center items-center">
        <Image
          source={require("../assets/svg/track-expense.svg")}
          style={{ width: 300, height: 300 }}
          contentFit="contain"
        />

        <Text className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Track Your Expenses
        </Text>
        <Text className="text-base text-gray-600 text-center font-sans">
          Keep track of your daily expenses easily and efficiently. Identify
          where your money goes.
        </Text>
      </View>
      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-xl items-center mb-8"
        onPress={() => router.push("/intro2")}
      >
        <Text className="text-white text-lg font-semibold">
          Next
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
