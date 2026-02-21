import { Text, TextInput, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface AmountInputProps {
  amount: string;
  setAmount: (amount: string) => void;
}

export function AmountInput({ amount, setAmount }: AmountInputProps) {
  const { colors, isDark } = useTheme();
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View
      className="items-center mt-12 py-10 rounded-3xl"
      style={{ backgroundColor: op(0.02) }}
    >
      <Text
        className="text-xs font-black uppercase tracking-[2px] mb-4"
        style={{ color: colors.textMuted }}
      >
        Amount Input
      </Text>
      <View className="flex-row items-center">
        <Text
          className="text-6xl font-bold mr-2"
          style={{ color: colors.accent }}
        >
          ₹
        </Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          className="text-6xl font-bold"
          style={{ color: colors.accent }}
          placeholder="0.00"
          placeholderTextColor={colors.accentOpacity(0.2)}
          autoFocus
        />
      </View>
    </View>
  );
}
