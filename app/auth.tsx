import { AntDesign } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
    <SafeAreaView className="flex-1 bg-white p-6 justify-center">
      <View className="items-center">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-[220px] h-[220px] mb-4"
          resizeMode="contain"
        />
      </View>
      <View className="w-full space-y-4">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 py-4 rounded-xl space-x-3 mb-4"
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <>
              <AntDesign
                name="google"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
              <Text className="text-gray-700 text-lg font-semibold">
                Continue with Google
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-100 py-4 rounded-xl items-center"
          onPress={handleGuestSignIn}
        >
          <Text className="text-gray-700 text-lg font-semibold">
            Continue as Guest
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
