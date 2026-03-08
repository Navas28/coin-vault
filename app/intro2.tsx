import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VaultButton } from "../components/VaultButton";
import { useTheme } from "../context/ThemeContext";

export default function Intro2() {
  const { colors, isDark } = useTheme();

  const gradientColors = (
    isDark ? [colors.background, "#1e3843"] : [colors.background, "#E2E8F0"]
  ) as [string, string, ...string[]];

  return (
    <LinearGradient colors={gradientColors} className="flex-1">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-1 px-8 justify-between py-12">
          <View className="items-center mt-6">
            <View className="items-center justify-center">
              <View
                className="w-56 h-56 rounded-full border-4 items-center justify-center"
                style={{ borderColor: colors.accentOpacity(0.8) }}
              >
                <View
                  className="absolute w-40 h-40 rounded-full blur-xl opacity-20"
                  style={{ backgroundColor: colors.accent }}
                />
                <MaterialIcons
                  name="savings"
                  size={100}
                  color={isDark ? colors.whiteOpacity(0.8) : colors.navy}
                />
              </View>
            </View>
          </View>

          <View className="items-center">
            <Text
              className="text-5xl font-semibold text-center mb-6 leading-tight"
              style={{ color: isDark ? colors.accent : colors.navy }}
            >
              Set your{"\n"}budgets
            </Text>
            <Text
              className="text-lg text-center leading-relaxed font-medium px-2"
              style={{ color: colors.textMuted }}
            >
              Stay on top of your spending by setting monthly limits and
              achieving your financial goals.
            </Text>
          </View>

          <View className="flex-row space-x-2 gap-2 items-center justify-center">
            <View className="flex-row space-x-2 gap-2 items-center">
              <View
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: isDark
                    ? colors.whiteOpacity(0.2)
                    : colors.blackOpacity(0.1),
                }}
              />
              <View
                className="w-10 h-2.5 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <View
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: isDark
                    ? colors.whiteOpacity(0.2)
                    : colors.blackOpacity(0.1),
                }}
              />
            </View>
          </View>

          <View className="w-full">
            <VaultButton
              label="Get Started"
              onPress={() => {
                router.replace("/home");
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
