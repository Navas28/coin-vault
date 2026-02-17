import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavProvider,
} from "@react-navigation/native";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text, View } from "react-native";
import "react-native-reanimated";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import "../global.css";
import { supabase } from "../lib/supabase";

SplashScreen.preventAutoHideAsync();

function RootLayoutContent() {
  const { isDark } = useTheme();

  useEffect(() => {
    // Auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session) {
        // Use direct router object instead of hook
        router.replace("/(tabs)");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <NavProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* The index, welcome, intro, and auth screens are already auto-mapped. 
            We only define them here if we want to lock their options. */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-transaction"
          options={{ presentation: "modal" }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </NavProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading Assets...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
