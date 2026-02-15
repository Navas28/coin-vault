import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

export default function Settings() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  const gradientColors = (
    isDark ? [colors.background, "#1e3843"] : [colors.background, "#E2E8F0"]
  ) as [string, string, ...string[]];

  return (
    <LinearGradient colors={gradientColors} className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-8 py-12">
          <Text
            className="text-4xl font-bold mb-8"
            style={{ color: colors.text }}
          >
            Settings
          </Text>

          <View className="w-full space-y-6 gap-4">
            {/* Theme Toggle Section */}
            <View
              className="flex-row items-center justify-between p-4 rounded-2xl border"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-center gap-3">
                <MaterialIcons
                  name={isDark ? "dark-mode" : "light-mode"}
                  size={24}
                  color={colors.accent}
                />
                <Text
                  className="text-lg font-semibold"
                  style={{ color: colors.text }}
                >
                  {isDark ? "Dark Mode" : "Light Mode"}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: "#CBD5E1",
                  true: colors.accentOpacity(0.5),
                }}
                thumbColor={isDark ? colors.accent : "#F8FAFC"}
              />
            </View>

            {/* Sign Out Section */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSignOut}
              className="w-full py-4 rounded-2xl border-2 items-center"
              style={{ borderColor: "#ff4444" }}
            >
              <Text className="text-[#ff4444] font-bold text-lg">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
