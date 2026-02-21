import { MaterialIcons } from "@expo/vector-icons";
import { isSameDay, parseISO } from "date-fns";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TransactionFilters } from "../../components/transactions/TransactionFilters";
import { TransactionItem } from "../../components/transactions/TransactionItem";
import { useTheme } from "../../context/ThemeContext";
import { useTransactions } from "../../hooks/useTransactions";
import { Transaction } from "../../types";

export default function AllTransactions() {
  const { colors } = useTheme();
  const {
    filteredTransactions,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    loading,
    deleteTransaction,
  } = useTransactions();

  const renderItem = ({
    item,
    index,
  }: {
    item: Transaction;
    index: number;
  }) => {
    const prevItem = filteredTransactions[index - 1];
    const showDateHeader =
      !prevItem || !isSameDay(parseISO(prevItem.date), parseISO(item.date));

    return (
      <TransactionItem
        item={item}
        showDateHeader={showDateHeader}
        onDelete={deleteTransaction}
        onPress={() =>
          router.push({
            pathname: "/transaction-details/[id]",
            params: { id: item.id },
          })
        }
      />
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full"
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-bold" style={{ color: colors.accent }}>
            All Transactions
          </Text>
          <View className="w-8" />
        </View>

        <TransactionFilters
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.emerald} />
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center py-20 opacity-50">
                <MaterialIcons
                  name="receipt-long"
                  size={64}
                  color={colors.textMuted}
                />
                <Text className="text-gray-500 mt-4 font-medium">
                  No transactions found
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}
