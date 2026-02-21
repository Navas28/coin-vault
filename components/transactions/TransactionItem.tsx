import { Feather, MaterialIcons } from "@expo/vector-icons";
import { format, parseISO } from "date-fns";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Transaction } from "../../types";

interface TransactionItemProps {
  item: Transaction;
  showDateHeader: boolean;
  onDelete: (id: string) => void;
  onPress?: () => void;
}

export function TransactionItem({
  item,
  showDateHeader,
  onDelete,
  onPress,
}: TransactionItemProps) {
  const { colors, isDark } = useTheme();
  const date = parseISO(item.date);

  return (
    <View>
      {showDateHeader && (
        <Text
          className="text-xs font-bold mb-3 mt-4 first:mt-0 uppercase tracking-widest"
          style={{ color: colors.textMuted }}
        >
          {format(date, "EEEE, dd MMM")}
        </Text>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className="flex-row items-center p-4 rounded-2xl mb-3 border"
        style={{
          backgroundColor: isDark ? colors.whiteOpacity(0.05) : colors.card,
          borderColor: colors.border,
        }}
      >
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

        <View className="flex-1">
          <Text
            className="font-semibold text-base"
            style={{ color: colors.text }}
          >
            {item.note && item.note.trim() !== ""
              ? item.note
              : item.category?.name}
          </Text>
          <Text className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
            {item.category?.name} • {format(date, "h:mm a")}
          </Text>
        </View>

        <View className="flex-row  gap-4 items-center justify-center">
          <Text
            className="font-bold text-base mb-2"
            style={{
              color: item.type === "income" ? "#4ADE80" : "#F87171",
            }}
          >
            {item.type === "income" ? "+" : ""}
            {item.amount < 0
              ? `-₹${Math.abs(item.amount).toFixed(2)}`
              : `₹${item.amount.toFixed(2)}`}
          </Text>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            className="opacity-70 p-1 mb-3"
          >
            <Feather name="trash-2" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}
