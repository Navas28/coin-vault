import { Feather, MaterialIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";
import { getDb } from "../../lib/database";
import { Transaction } from "../../types";

export default function TransactionDetails() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    if (!id || typeof id !== "string") return;
    try {
      const db = await getDb();
      const row = await db.getFirstAsync<any>(
        `
        SELECT t.*, c.name as cat_name, c.icon as cat_icon, c.type as cat_type
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?
      `,
        [id as string],
      );

      if (row) {
        setTransaction({
          id: row.id,
          amount: row.amount,
          type: row.type,
          date: row.date,
          note: row.note,
          payee: row.payee,
          payment_method: row.payment_method,
          category: {
            name: row.cat_name,
            icon: row.cat_icon,
            type: row.cat_type,
          },
        });
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const db = await getDb();
              await db.runAsync("DELETE FROM transactions WHERE id = ?", [
                id as string,
              ]);
              router.back();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleEdit = () => {
    router.push({
      pathname: "/add-transaction",
      params: { editId: id },
    });
  };

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.emerald} />
      </View>
    );
  }

  if (!transaction) return null;

  const date = parseISO(transaction.date);
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 -ml-2 rounded-full"
            style={{ backgroundColor: op(0.05) }}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-bold" style={{ color: colors.text }}>
            Transaction Details
          </Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={handleEdit}
              className="p-2 rounded-full"
              style={{ backgroundColor: op(0.05) }}
            >
              <Feather name="edit-2" size={20} color={colors.emerald} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="p-2 rounded-full"
              style={{ backgroundColor: op(0.05) }}
            >
              <Feather name="trash-2" size={20} color="#F87171" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View
            className="items-center py-10 mt-6 rounded-3xl border"
            style={{
              backgroundColor: isDark ? colors.whiteOpacity(0.05) : colors.card,
              borderColor: colors.border,
            }}
          >
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
              style={{ backgroundColor: colors.emerald + "20" }}
            >
              <MaterialIcons
                name={(transaction.category?.icon as any) || "category"}
                size={32}
                color={colors.emerald}
              />
            </View>
            <Text
              className="text-xs font-black uppercase tracking-[2px] mb-2"
              style={{ color: colors.textMuted }}
            >
              {transaction.category?.name}
            </Text>
            <Text
              className="text-4xl font-bold"
              style={{
                color: transaction.type === "income" ? "#4ADE80" : "#F87171",
              }}
            >
              {transaction.type === "income" ? "+" : "-"}₹
              {Math.abs(transaction.amount).toFixed(2)}
            </Text>
          </View>

          <View className="mt-8 space-y-6 gap-6">
            <DetailRow
              icon="calendar-today"
              label="Date & Time"
              value={format(date, "EEEE, dd MMMM yyyy • h:mm a")}
            />

            {transaction.note && (
              <DetailRow icon="notes" label="Note" value={transaction.note} />
            )}

            {transaction.payee && (
              <DetailRow
                icon="person"
                label="Payee"
                value={transaction.payee}
              />
            )}

            <DetailRow
              icon="payment"
              label="Payment Method"
              value={transaction.payment_method || "Not Specified"}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const { colors, isDark } = useTheme();
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="flex-row items-center">
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: op(0.05) }}
      >
        <MaterialIcons name={icon as any} size={20} color={colors.accent} />
      </View>
      <View className="flex-1">
        <Text
          className="text-[10px] font-black uppercase tracking-[1.5px]"
          style={{ color: colors.textMuted }}
        >
          {label}
        </Text>
        <Text
          className="text-base font-semibold mt-0.5"
          style={{ color: colors.text }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
