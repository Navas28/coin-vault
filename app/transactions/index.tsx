import { Feather, MaterialIcons } from "@expo/vector-icons";
import { format, isSameDay, isSameMonth, isSameWeek, parseISO } from "date-fns";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  note: string;
  payee: string | null;
  category: {
    name: string;
    icon: string;
  };
}

export default function AllTransactions() {
  const { colors, isDark } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [filter, setFilter] = useState<"Today" | "Week" | "Month" | "All">(
    "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, searchQuery, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          id,
          amount,
          type,
          date,
          note,
          payee,
          category:categories(name, icon)
        `,
        )
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setTransactions(data as any);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = transactions;

    // Time Filter
    const today = new Date();
    if (filter === "Today") {
      result = result.filter((t) => isSameDay(parseISO(t.date), today));
    } else if (filter === "Week") {
      result = result.filter((t) => isSameWeek(parseISO(t.date), today));
    } else if (filter === "Month") {
      result = result.filter((t) => isSameMonth(parseISO(t.date), today));
    }

    // Search Filter
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.note?.toLowerCase().includes(lowerQuery) ||
          t.payee?.toLowerCase().includes(lowerQuery) ||
          t.category?.name.toLowerCase().includes(lowerQuery),
      );
    }

    setFilteredTransactions(result);
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Transaction", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id);
          if (error) {
            Alert.alert("Error", error.message);
          } else {
            // Optimistic update
            setTransactions((prev) => prev.filter((t) => t.id !== id));
          }
        },
      },
    ]);
  };

  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  const renderItem = ({
    item,
    index,
  }: {
    item: Transaction;
    index: number;
  }) => {
    const date = parseISO(item.date);
    const prevItem = filteredTransactions[index - 1];

    // Show header if it's the first item OR if the date is different from the previous one
    const showHeader = !prevItem || !isSameDay(parseISO(prevItem.date), date);

    return (
      <View>
        {showHeader && (
          <Text
            className="text-xs font-bold mb-3 mt-4 first:mt-0 uppercase tracking-widest"
            style={{ color: colors.textMuted }}
          >
            {format(date, "EEEE, dd MMM")}
          </Text>
        )}

        <View
          className="flex-row items-center p-4 rounded-2xl mb-3 border"
          style={{
            backgroundColor: isDark ? colors.whiteOpacity(0.05) : colors.card,
            borderColor: colors.border,
          }}
        >
          {/* Icon */}
          <View
            className="w-12 h-12 rounded-xl items-center justify-center mr-4"
            style={{ backgroundColor: colors.emerald + "20" }}
          >
            <MaterialIcons
              name={(item.category?.icon as any) || "category"}
              size={24}
              color={colors.emerald}
            />
          </View>

          {/* Details */}
          <View className="flex-1">
            <Text
              className="font-semibold text-base"
              style={{ color: colors.text }}
            >
              {item.note && item.note.trim() !== ""
                ? item.note
                : item.category?.name}
            </Text>
            <Text
              className="text-xs mt-0.5"
              style={{ color: colors.textMuted }}
            >
              {item.category?.name} • {format(date, "h:mm a")}
            </Text>
          </View>

          {/* Amount & Actions */}
          <View className="items-end justify-center">
            <Text
              className="font-bold text-base mb-2"
              style={{
                color: item.type === "income" ? "#4ADE80" : colors.text,
              }}
            >
              {item.type === "income" ? "+" : ""}
              {item.amount < 0
                ? `-₹${Math.abs(item.amount).toFixed(2)}`
                : `₹${item.amount.toFixed(2)}`}
            </Text>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              className="opacity-70 p-1"
            >
              <Feather name="trash-2" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full"
            style={{ backgroundColor: op(0.05) }}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-bold" style={{ color: colors.accent }}>
            All Transactions
          </Text>
          <View className="w-8" />
        </View>

        {/* Search & Filter Container */}
        <View className="px-6 pb-2">
          {/* Search Bar */}
          <View
            className="flex-row items-center px-4 py-3 rounded-2xl mb-4"
            style={{ backgroundColor: op(0.05) }}
          >
            <Feather name="search" size={18} color={colors.textMuted} />
            <TextInput
              placeholder="Search note, payee..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-base font-medium"
              style={{ color: colors.text }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons
                  name="close"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filters */}
          <View className="flex-row gap-3 mb-2">
            {["All", "Today", "Week", "Month"].map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f as any)}
                className="px-4 py-1.5 rounded-full border"
                style={{
                  backgroundColor:
                    filter === f ? colors.emerald : "transparent",
                  borderColor: filter === f ? colors.emerald : colors.border,
                }}
              >
                <Text
                  className="text-xs font-bold"
                  style={{ color: filter === f ? "#fff" : colors.textMuted }}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* List */}
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
