import { Text, View } from "react-native";

export default function ExpensesScreen() {
  return (
      <View className="flex-1 justify-center items-center p-5 bg-white dark:bg-gray-900">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Expenses
      </Text>
      <Text className="text-base font-medium text-gray-700 dark:text-gray-300">
        Your expense list will appear here
      </Text>
    </View>
  );
}

