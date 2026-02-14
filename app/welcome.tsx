import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("./intro1");
    }, 2000);

    return () => clearTimeout(timer);
  });
  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <View className="items-center">
        <Image
          source={require("../assets/images/logo.png")}
          className="w-80 h-80"
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}
