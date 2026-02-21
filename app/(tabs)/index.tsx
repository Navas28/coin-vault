import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionItem } from "../../components/transactions/TransactionItem";
import { useTheme } from "../../context/ThemeContext";
import { useDashboard } from "../../hooks/useDashboard";
import { useTransactions } from "../../hooks/useTransactions";

export default function Home() {
  const { colors, toggleTheme, isDark } = useTheme();
  const {
    balance,
    income,
    expense,
    recentTransactions,
    refreshing,
    onRefresh,
  } = useDashboard();
  const { deleteTransaction } = useTransactions();

  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
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

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.emerald}
            />
          }
        >
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
              className="text-4xl font-bold mb-8"
              style={{ color: colors.text }}
            >
              ₹{balance.toFixed(2)}
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
                    className="font-semibold text-lg"
                    style={{ color: "#4ADE80" }}
                  >
                    +₹ {income.toFixed(2)}
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
                    className="font-semibold text-lg"
                    style={{ color: "#F87171" }}
                  >
                    -₹ {Math.abs(expense).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-10 mb-6 flex-row justify-between items-center">
            <Text
              className="text-xl font-medium"
              style={{ color: colors.text }}
            >
              Recent Activity
            </Text>
            <TouchableOpacity onPress={() => router.push("/transactions")}>
              <Text
                className="font-bold tracking-wider text-xs uppercase"
                style={{ color: colors.emerald }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-3 mb-24">
            {recentTransactions.map((item) => (
              <TransactionItem
                key={item.id}
                item={item as any}
                showDateHeader={false}
                onDelete={deleteTransaction}
                onPress={() =>
                  router.push({
                    pathname: "/transaction-details/[id]",
                    params: { id: item.id },
                  })
                }
              />
            ))}
            {recentTransactions.length === 0 && (
              <Text className="text-center text-gray-500 py-4">
                No recent activity
              </Text>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/add-transaction")}
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
          <MaterialIcons name="add" size={36} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
