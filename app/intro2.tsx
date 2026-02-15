import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";

export default function Intro2() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.vault.navy, "#1e3843"]} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-8 justify-between py-12">
          <View className="items-center mt-6">
            <View className="items-center justify-center">
              <View
                className="w-56 h-56 rounded-full border-4 items-center justify-center"
                style={{ borderColor: Colors.vault.accentOpacity(0.8) }}
              >
                <View
                  className="absolute w-40 h-40 rounded-full blur-xl opacity-20"
                  style={{ backgroundColor: Colors.vault.accent }}
                />
                <MaterialIcons
                  name="savings"
                  size={100}
                  color={Colors.vault.whiteOpacity(0.8)}
                />
              </View>
            </View>
          </View>

          <View className="items-center">
            <Text
              className="text-5xl font-semibold text-center mb-6 leading-tight"
              style={{ color: Colors.vault.accent }}
            >
              Set your{"\n"}budgets
            </Text>
            <Text
              className="text-lg text-center leading-relaxed font-medium px-2"
              style={{ color: Colors.vault.whiteOpacity(0.7) }}
            >
              Stay on top of your spending by setting monthly limits and
              achieving your financial goals.
            </Text>
          </View>

          <View className="flex-row space-x-2 gap-2 items-center justify-center">
            <View className="flex-row space-x-2 gap-2 items-center">
              <View
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: Colors.vault.whiteOpacity(0.2) }}
              />
              <View
                className="w-10 h-2.5 rounded-full"
                style={{ backgroundColor: Colors.vault.accent }}
              />
              <View
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: Colors.vault.whiteOpacity(0.2) }}
              />
            </View>
          </View>

          <View className="w-full">
            <TouchableOpacity
              activeOpacity={0.8}
              className="py-5 rounded-[28px] items-center mb-2"
              style={{ backgroundColor: Colors.vault.emerald }}
              onPress={() => router.push("/auth")}
            >
              <Text className="text-white text-xl font-bold">Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
