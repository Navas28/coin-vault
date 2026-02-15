import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

export default function Home() {
  const { colors, toggleTheme, isDark } = useTheme();
  const [userName, setUserName] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setIsGuest(user.is_anonymous ?? false);
      setUserName(
        user.is_anonymous
          ? "Guest"
          : user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "User",
      );
    }
  }

  const transactions = [
    {
      id: 1,
      merchant: "The Coffee Roasters",
      category: "Food",
      time: "10:30 AM",
      amount: -12.5,
      status: "SUCCESS",
      color: "#FF9F43",
    },
    {
      id: 2,
      merchant: "Uber Technologies",
      category: "Transport",
      time: "08:15 AM",
      amount: -24.0,
      status: "SUCCESS",
      color: "#4834D4",
    },
    {
      id: 3,
      merchant: "Apple Store",
      category: "Shopping",
      time: "Yesterday",
      amount: -150.0,
      status: "SUCCESS",
      color: "#A29BFE",
    },
  ];

  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        {/* 1. Top Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-lg items-center justify-center border"
              style={{ borderColor: colors.border }}
            >
              <MaterialIcons
                name="account-balance-wallet"
                size={30}
                color={isDark ? colors.whiteOpacity(0.8) : colors.navy}
              />
            </View>
            <View className="ml-3">
              <Text
                className="font-semibold text-lg leading-tight tracking-wider"
                style={{ color: colors.text }}
              >
                Coin Vault
              </Text>
              <Text
                className="text-[10px] font-sans tracking-wide"
                style={{ color: colors.textMuted }}
              >
                Financial Security
              </Text>
            </View>
          </View>

          <View className="flex-row items-center space-x-4 gap-4">
            <TouchableOpacity
              onPress={toggleTheme}
              className="p-2 rounded-full"
              style={{ backgroundColor: op(0.05) }}
            >
              <Feather
                name={isDark ? "sun" : "moon"}
                size={20}
                color={colors.accent}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* 2. Total Balance Card */}
          <View
            className="w-full mt-6 p-8 rounded-2xl border"
            style={{
              backgroundColor: isDark ? colors.whiteOpacity(0.05) : colors.card,
              borderColor: colors.border,
            }}
          >
            <Text
              className="text-base font-medium mb-1"
              style={{ color: colors.textMuted }}
            >
              Total Balance
            </Text>
            <Text
              className="text-5xl font-medium mb-8"
              style={{ color: colors.text }}
            >
              $12,480.50
            </Text>

            <View
              className="flex-row justify-between items-center border-t pt-6"
              style={{ borderTopColor: colors.border }}
            >
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-green-500/10 items-center justify-center mr-3">
                  <MaterialIcons
                    name="arrow-downward"
                    size={16}
                    color="#4ADE80"
                  />
                </View>
                <View>
                  <Text
                    className="text-[11px] font-semibold"
                    style={{ color: colors.textMuted }}
                  >
                    Income
                  </Text>
                  <Text
                    className="font-medium text-lg"
                    style={{ color: colors.text }}
                  >
                    +$4,250
                  </Text>
                </View>
              </View>

              <View
                className="w-px h-8"
                style={{ backgroundColor: colors.border }}
              />

              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-red-500/10 items-center justify-center mr-3">
                  <MaterialIcons
                    name="arrow-upward"
                    size={16}
                    color="#F87171"
                  />
                </View>
                <View>
                  <Text
                    className="text-[11px] font-semibold"
                    style={{ color: colors.textMuted }}
                  >
                    Expenses
                  </Text>
                  <Text
                    className="font-medium text-lg"
                    style={{ color: colors.text }}
                  >
                    -$1,120
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. Recent Activity */}
          <View className="mt-10 mb-6 flex-row justify-between items-center">
            <Text
              className="text-xl font-medium"
              style={{ color: colors.text }}
            >
              Recent Activity
            </Text>
            <TouchableOpacity>
              <Text
                className="font-medium tracking-wider text-md uppercase"
                style={{ color: colors.accent }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4 mb-24">
            {transactions.map((item) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                className="flex-row items-center p-4 rounded-3xl mb-3 border"
                style={{
                  backgroundColor: isDark
                    ? colors.whiteOpacity(0.05)
                    : colors.card,
                  borderColor: colors.border,
                }}
              >
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                  style={{ backgroundColor: item.color + "20" }}
                >
                  <MaterialIcons
                    name={
                      item.category === "Food"
                        ? "restaurant"
                        : item.category === "Transport"
                          ? "directions-car"
                          : "shopping-bag"
                    }
                    size={24}
                    color={item.color}
                  />
                </View>

                <View className="flex-1">
                  <Text
                    className="font-medium text-base"
                    style={{ color: colors.text }}
                  >
                    {item.merchant}
                  </Text>
                  <Text
                    className="text-xs font-medium"
                    style={{ color: colors.textMuted }}
                  >
                    {item.category} • {item.time}
                  </Text>
                </View>

                <View className="items-end">
                  <Text
                    className="font-medium text-base mb-1"
                    style={{ color: colors.text }}
                  >
                    {item.amount < 0
                      ? `-$${Math.abs(item.amount).toFixed(2)}`
                      : `+$${item.amount.toFixed(2)}`}
                  </Text>
                  <View className="bg-green-500/10 px-2 py-0.5 rounded-md">
                    <Text className="text-green-400 text-[8px] font-black uppercase tracking-widest">
                      {item.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* 4. Floating Action Button */}
        <TouchableOpacity
          activeOpacity={0.9}
          className="absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-2xl"
          style={{
            backgroundColor: colors.emerald,
            shadowColor: colors.emerald,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10,
          }}
        >
          <View
            className="absolute w-20 h-20 rounded-full blur-2xl opacity-20"
            style={{ backgroundColor: colors.emerald }}
          />
          <MaterialIcons name="add" size={36} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
