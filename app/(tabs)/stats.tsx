import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export default function Stats() {
  const { colors, isDark } = useTheme();
  const gradientColors = (
    isDark ? [colors.background, "#1e3843"] : [colors.background, "#E2E8F0"]
  ) as [string, string, ...string[]];

  return (
    <LinearGradient colors={gradientColors} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-8 py-12 items-center justify-center">
          <Text className="text-4xl font-bold" style={{ color: colors.text }}>
            Stats
          </Text>
          <Text
            className="mt-4 text-center"
            style={{ color: colors.textMuted }}
          >
            Coming soon: Detailed spending analytics and charts.
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
