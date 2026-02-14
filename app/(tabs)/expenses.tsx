import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Expenses() {
  return (
    <SafeAreaView className="flex-1 bg-white p-6">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-800">Expenses</Text>
        <Text className="text-gray-500 mt-2">Activity coming soon...</Text>
      </View>
    </SafeAreaView>
  );
}
