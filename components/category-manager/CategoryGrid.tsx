import { MaterialIcons } from "@expo/vector-icons";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Category } from "../../types";

interface CategoryGridProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function CategoryGrid({
  categories,
  onSelect,
  onClose,
  onDelete,
  onAddNew,
}: CategoryGridProps) {
  const { colors, isDark } = useTheme();
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="flex-row flex-wrap gap-4 justify-between">
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => {
            onSelect(cat);
            onClose();
          }}
          className="w-[47%] p-4 rounded-2xl items-center border relative"
          style={{ backgroundColor: op(0.03), borderColor: colors.border }}
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: colors.emerald + "20" }}
          >
            <MaterialIcons
              name={cat.icon as any}
              size={24}
              color={colors.emerald}
            />
          </View>
          <Text
            className="font-semibold text-center"
            style={{ color: colors.text }}
          >
            {cat.name}
          </Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert("Delete", "Delete this category?", [
                { text: "Cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => onDelete(cat.id),
                },
              ])
            }
            className="absolute top-2 right-2"
          >
            <MaterialIcons
              name="remove-circle-outline"
              size={16}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={onAddNew}
        className="w-[47%] p-4 rounded-2xl items-center justify-center border border-dashed"
        style={{
          borderColor: colors.textMuted,
          backgroundColor: "transparent",
        }}
      >
        <MaterialIcons name="add" size={32} color={colors.textMuted} />
        <Text className="font-medium mt-2" style={{ color: colors.textMuted }}>
          Create New
        </Text>
      </TouchableOpacity>
    </View>
  );
}
