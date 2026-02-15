import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { Colors } from "../constants/Colors";
import { useEffect } from "react";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("./intro1");
    }, 2000);
    return () => clearTimeout(timer);
  });

  return (
    <LinearGradient
      colors={[Colors.vault.navy, Colors.vault.emerald]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <Image
        source={require("../assets/images/wel.png")}
        className="absolute inset-0 w-full h-full opacity-10"
        resizeMode="cover"
      />
      <View className="flex-1 justify-center items-center px-10">
        <View className="items-center w-full">
          <View className="mb-14 relative">
            <View className="w-44 h-44 rounded-[48px] items-center justify-center border border-white/20">
              <MaterialIcons
                name="health-and-safety"
                size={88}
                color={Colors.vault.accent}
              />
            </View>
            <View className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full items-center justify-center border border-white/20 shadow-lg backdrop-blur-lg">
              <MaterialIcons
                name="currency-rupee"
                size={28}
                color={Colors.vault.accent}
              />
            </View>
            <View className="absolute -bottom-5 -left-5 w-16 h-16 bg-white/10 rounded-2xl items-center justify-center border border-white/20 shadow-lg backdrop-blur-lg">
              <MaterialIcons
                name="account-balance-wallet"
                size={28}
                color={Colors.vault.accent}
              />
            </View>
          </View>
          <View className="items-center">
            <Text className="text-6xl font-black text-white tracking-tighter mb-2">
              Coin Vault
            </Text>
            <Text className="text-white/70 text-lg font-medium tracking-[2px] uppercase text-center">
              Secure your future, One Coin at a time
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
