import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function Auth() {
  const { colors, isDark } = useTheme();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Hardcode the scheme to ensure it NEVER uses exp://
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
          // Robust token extraction
          const access_token = url.match(/access_token=([^&]+)/)?.[1];
          const refresh_token = url.match(/refresh_token=([^&]+)/)?.[1];

          if (access_token && refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (sessionError) throw sessionError;
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

  const handleGuestSignIn = async () => {
    setIsGuestLoading(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", "Could not sign in as guest.");
    } finally {
      setIsGuestLoading(false);
    }
  };

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
                <MaterialIcons name="shield" size={100} color={colors.accent} />
              </View>
            </View>
          </View>

          <View className="items-center">
            <Text
              className="text-5xl font-semibold text-center mb-6 leading-tight"
              style={{ color: isDark ? colors.accent : colors.navy }}
            >
              Stay Secure
            </Text>
            <Text
              className="text-lg text-center leading-relaxed font-medium px-2"
              style={{ color: colors.textMuted }}
            >
              Your financial data is encrypted and protected with
              industry-leading security.
            </Text>

            <View className="flex-row space-x-2 mt-12 gap-2 items-center justify-center">
              <View
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: isDark
                    ? colors.whiteOpacity(0.2)
                    : colors.blackOpacity(0.1),
                }}
              />
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
            </View>
          </View>

          <View className="w-full space-y-4 gap-4">
            <TouchableOpacity
              activeOpacity={0.9}
              className="flex-row items-center justify-center py-5 rounded-[24px] shadow-xl"
              style={{ backgroundColor: isDark ? colors.white : colors.navy }}
              onPress={handleGoogleSignIn}
              disabled={isGoogleLoading || isGuestLoading}
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

            <TouchableOpacity
              activeOpacity={0.7}
              className="py-5 rounded-[24px] items-center border-2 flex-row justify-center"
              style={{ borderColor: colors.accentOpacity(0.5) }}
              onPress={handleGuestSignIn}
              disabled={isGoogleLoading || isGuestLoading}
            >
              {isGuestLoading ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <Text
                  className="text-xl font-bold"
                  style={{ color: isDark ? colors.accent : colors.emerald }}
                >
                  Continue as Guest
                </Text>
              )}
            </TouchableOpacity>

            <Text
              className="text-center text-xs mt-8 font-medium uppercase tracking-widest"
              style={{ color: colors.textMuted }}
            >
              By continuing, you agree to our Terms & Privacy
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
