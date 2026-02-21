import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Category } from "../../types";

interface CategorySelectorProps {
  selectedCategory: Category | null;
  onPress: () => void;
}

export function CategorySelector({
  selectedCategory,
  onPress,
}: CategorySelectorProps) {
  const { colors, isDark } = useTheme();
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="mt-10">
      <View className="flex-row justify-between items-center mb-6">
        <Text
          className="text-xs font-black uppercase tracking-[2px]"
          style={{ color: colors.textMuted }}
        >
          Select Category
        </Text>
        <TouchableOpacity onPress={onPress}>
          <Text className="text-emerald-500 font-bold">Edit / Add</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={onPress}
        className="w-full p-4 rounded-2xl flex-row items-center border"
        style={{
          backgroundColor: op(0.03),
          borderColor: selectedCategory ? colors.emerald : colors.border,
        }}
      >
        {selectedCategory ? (
          <>
            <View
              className="w-12 h-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: colors.emerald + "20" }}
            >
              <MaterialIcons
                name={selectedCategory.icon as any}
                size={24}
                color={colors.emerald}
              />
            </View>
            <Text
              className="text-lg font-semibold"
              style={{ color: colors.text }}
            >
              {selectedCategory.name}
            </Text>
          </>
        ) : (
          <Text className="text-lg font-medium text-gray-400">
            Tap to select category...
          </Text>
        )}
        <View className="flex-1 items-end">
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.textMuted}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}
