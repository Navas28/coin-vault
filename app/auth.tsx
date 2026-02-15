import { Colors } from "@/constants/Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
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
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

export default function Auth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Create a redirect URL that opens your app
      const redirectUrl = Linking.createURL("/auth");

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

          // Supabase uses # (hash) for tokens. We need to parse that.
          const fragment = url.split("#")[1];
          if (!fragment) {
            console.log("No fragment found in URL");
            return;
          }

          const params = Object.fromEntries(new URLSearchParams(fragment));
          const { access_token, refresh_token } = params;

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
      Alert.alert(
        "Login Error",
        error.message || "An error occurred during sign in.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    // @ts-ignore
    router.replace("/(tabs)");
  };

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
                  name="shield"
                  size={100}
                  color={Colors.vault.accent}
                />
              </View>
            </View>
          </View>

          <View className="items-center">
            <Text
              className="text-5xl font-semibold text-center mb-6 leading-tight"
              style={{ color: Colors.vault.accent }}
            >
              Stay Secure
            </Text>
            <Text
              className="text-lg text-center leading-relaxed font-medium px-2"
              style={{ color: Colors.vault.whiteOpacity(0.7) }}
            >
              Your financial data is encrypted and protected with
              industry-leading security.
            </Text>

            <View className="flex-row space-x-2 mt-12 gap-2 items-center justify-center">
              <View
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: Colors.vault.whiteOpacity(0.2) }}
              />
              <View
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: Colors.vault.whiteOpacity(0.2) }}
              />
              <View
                className="w-10 h-2.5 rounded-full"
                style={{ backgroundColor: Colors.vault.accent }}
              />
            </View>
          </View>

          <View className="w-full space-y-4">
            <TouchableOpacity
              activeOpacity={0.9}
              className="flex-row items-center justify-center bg-white py-5 rounded-[24px] shadow-xl"
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.vault.navy} />
              ) : (
                <>
                  <AntDesign
                    name="google"
                    size={24}
                    color="#000"
                    style={{ marginRight: 12 }}
                  />
                  <Text className="text-black text-xl font-bold">
                    Continue with Google
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className="py-5 rounded-[24px] items-center border-2 mt-2"
              style={{ borderColor: Colors.vault.accentOpacity(0.5) }}
              onPress={handleGuestSignIn}
            >
              <Text
                className="text-xl font-bold"
                style={{ color: Colors.vault.accent }}
              >
                Continue as Guest
              </Text>
            </TouchableOpacity>

            <Text
              className="text-center text-xs mt-8 font-medium uppercase tracking-widest"
              style={{ color: Colors.vault.whiteOpacity(0.3) }}
            >
              By continuing, you agree to our Terms & Privacy
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
