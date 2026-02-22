import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface VaultButtonProps {
  label: string;
  onPress: () => void;
  variant?: "solid" | "ghost";
  color?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function VaultButton({
  label,
  onPress,
  variant = "solid",
  color,
  isLoading = false,
  icon,
  className = "",
}: VaultButtonProps) {
  const { colors } = useTheme();
  const isGhost = variant === "ghost";

  const baseButtonStyles =
    "py-5 rounded-[24px] items-center justify-center flex-row shadow-sm";

  const variantStyles = isGhost ? `border-2` : "";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={isLoading}
      className={`${baseButtonStyles} ${variantStyles} ${className}`}
      style={[
        !isGhost && { backgroundColor: color || colors.emerald },
        isGhost && { borderColor: colors.accentOpacity(0.5) },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={isGhost ? colors.accent : "white"} />
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-3">{icon}</View>}
          <Text
            className="text-xl font-bold"
            style={{ color: isGhost ? colors.accent : "white" }}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
