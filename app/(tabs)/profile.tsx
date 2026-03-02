import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {
  const { colors, isDark, toggleTheme } = useTheme();

  const gradientColors = (
    isDark ? [colors.background, "#1e3843"] : [colors.background, "#E2E8F0"]
  ) as [string, string, ...string[]];

  return (
    <LinearGradient colors={gradientColors} className="flex-1">
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="flex-1 px-8 pt-5 pb-10 justify-center gap-10">
          <View>
            <View className="items-center mb-12">
              <View
                className="w-32 h-32 rounded-full border-2 p-1 mb-6 shadow-xl"
                style={{ borderColor: colors.accent }}
              >
                <View className="w-full h-full rounded-full overflow-hidden bg-white/10 items-center justify-center">
                  <MaterialIcons
                    name="person"
                    size={80}
                    color={colors.accent}
                  />
                </View>
              </View>
              <Text
                className="text-3xl font-extrabold text-center"
                style={{ color: colors.accent }}
              >
                Vault User
              </Text>
              <Text
                className="text-base mt-2 opacity-70"
                style={{ color: colors.textMuted }}
              >
                Local Account
              </Text>
            </View>

            <View className="w-full">
              <View
                className="flex-row items-center justify-between p-5 rounded-[24px] border"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }}
              >
                <View className="flex-row items-center gap-4">
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: isDark
                        ? colors.accentOpacity(0.12)
                        : colors.blackOpacity(0.06),
                    }}
                  >
                    <Feather name="moon" size={22} color={colors.accent} />
                  </View>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: colors.text }}
                  >
                    Dark Mode
                  </Text>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: "#CBD5E1", true: colors.emerald }}
                  thumbColor={"#FFFFFF"}
                />
              </View>
            </View>
          </View>

          <View className="h-20" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
