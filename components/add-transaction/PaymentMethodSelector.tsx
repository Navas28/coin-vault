import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface PaymentMethodSelectorProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

const PAYMENT_METHODS = [
  "Cash",
  "Debit Card",
  "Credit Card",
  "UPI",
  "Bank Transfer",
  "Other",
];

export function PaymentMethodSelector({
  paymentMethod,
  setPaymentMethod,
}: PaymentMethodSelectorProps) {
  const { colors, isDark } = useTheme();
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View
      className="rounded-3xl p-5 border mt-6"
      style={{ backgroundColor: op(0.05), borderColor: colors.border }}
    >
      <View className="flex-row items-center mb-5">
        <MaterialIcons name="payment" size={18} color={colors.accent} />
        <Text
          className="ml-2 text-xs font-black uppercase tracking-[1.5px]"
          style={{ color: colors.textMuted }}
        >
          Payment Method
        </Text>
      </View>
      <View className="flex-row flex-wrap gap-3">
        {PAYMENT_METHODS.map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => setPaymentMethod(method)}
            className="px-5 py-2.5 rounded-2xl border"
            style={{
              backgroundColor:
                paymentMethod === method
                  ? colors.emerald + "20"
                  : "transparent",
              borderColor: paymentMethod === method ? colors.emerald : op(0.1),
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{
                color:
                  paymentMethod === method ? colors.emerald : colors.textMuted,
              }}
            >
              {method.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
