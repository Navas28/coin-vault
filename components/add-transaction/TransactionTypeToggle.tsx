import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface TransactionTypeToggleProps {
  type: "income" | "expense";
  setType: (type: "income" | "expense") => void;
}

export function TransactionTypeToggle({
  type,
  setType,
}: TransactionTypeToggleProps) {
  const { colors, isDark } = useTheme();
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View
      className="flex-row rounded-2xl p-1 mt-6"
      style={{ backgroundColor: op(0.05) }}
    >
      <TouchableOpacity
        onPress={() => setType("income")}
        className="flex-1 py-3 rounded-xl items-center"
        style={{
          backgroundColor: type === "income" ? colors.emerald : "transparent",
        }}
      >
        <Text
          className="font-bold tracking-wide"
          style={{ color: type === "income" ? "#fff" : colors.textMuted }}
        >
          INCOME
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setType("expense")}
        className="flex-1 py-3 rounded-xl items-center"
        style={{
          backgroundColor: type === "expense" ? colors.emerald : "transparent",
        }}
      >
        <Text
          className="font-bold tracking-wide"
          style={{
            color: type === "expense" ? "#fff" : colors.textMuted,
          }}
        >
          EXPENSE
        </Text>
      </TouchableOpacity>
    </View>
  );
}
