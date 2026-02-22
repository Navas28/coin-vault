import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const redirectUrl = "coinvault://auth";

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl,
        );

        if (result.type === "success") {
          const { url } = result;
          const access_token = url.match(/access_token=([^&]+)/)?.[1];
          const refresh_token = url.match(/refresh_token=([^&]+)/)?.[1];

          if (access_token && refresh_token) {
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            const {
              data: { user: newUser },
            } = await supabase.auth.getUser();
            setUser(newUser);
          }
        }
      }
    } catch (error: any) {
      console.error("AUTH ERROR:", error);
      Alert.alert("Login Error", error.message || "An error occurred.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  const gradientColors = (
    isDark ? [colors.background, "#1e3843"] : [colors.background, "#E2E8F0"]
  ) as [string, string, ...string[]];

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName =
    user?.user_metadata?.full_name ||
    (user?.is_anonymous ? "Guest" : "Alexander Hunt");
  const email =
    user?.email ||
    (user?.is_anonymous ? "guest@gmail.com" : "alexander.hunt@example.com");
  const isGuest = user?.is_anonymous;

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
                  {avatarUrl ? (
                    <Image
                      source={{ uri: avatarUrl }}
                      className="w-full h-full"
                    />
                  ) : (
                    <MaterialIcons
                      name="person"
                      size={80}
                      color={colors.accent}
                    />
                  )}
                </View>
              </View>
              <Text
                className="text-3xl font-extrabold text-center"
                style={{ color: colors.accent }}
              >
                {fullName}
              </Text>
              <Text
                className="text-base mt-2 opacity-70"
                style={{ color: colors.textMuted }}
              >
                {email}
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

          <View className="w-full">
            {isGuest ? (
              <TouchableOpacity
                activeOpacity={0.9}
                className="flex-row items-center justify-center py-5 rounded-[24px]"
                style={{ backgroundColor: isDark ? colors.white : colors.navy }}
                onPress={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <ActivityIndicator
                    color={isDark ? colors.navy : colors.white}
                  />
                ) : (
                  <>
                    <AntDesign
                      name="google"
                      size={24}
                      color={isDark ? "#000" : "#FFF"}
                      style={{ marginRight: 12 }}
                    />
                    <Text
                      className="text-xl font-bold"
                      style={{ color: isDark ? "#000" : "#FFF" }}
                    >
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSignOut}
                className="w-full py-5 rounded-2xl border-2 items-center flex-row justify-center gap-3"
                style={{
                  borderColor: isDark
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.1)",
                }}
              >
                <MaterialIcons
                  name="logout"
                  size={20}
                  color={isDark ? "#FFFFFF" : colors.navy}
                />
                <Text
                  className="font-bold text-lg"
                  style={{ color: isDark ? "#FFFFFF" : colors.navy }}
                >
                  Sign Out
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
