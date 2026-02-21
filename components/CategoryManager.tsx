import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useCategories } from "../hooks/useCategories";
import { Category } from "../types";
import { AddCategoryModal } from "./category-manager/AddCategoryModal";
import { CategoryGrid } from "./category-manager/CategoryGrid";

interface CategoryManagerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
  activeType: "income" | "expense";
}

export function CategoryManager({
  isVisible,
  onClose,
  onSelect,
  activeType,
}: CategoryManagerProps) {
  const { colors, isDark } = useTheme();
  const {
    categories,
    isLoading,
    fetchCategories,
    addCategory,
    deleteCategory,
  } = useCategories();
  const [isAdding, setIsAdding] = useState(false);
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  useEffect(() => {
    if (isVisible) fetchCategories(activeType);
  }, [isVisible, activeType]);

  const handleSave = async (name: string, icon: string) => {
    const newCat = await addCategory(name, icon, activeType);
    if (newCat) setIsAdding(false);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        className="flex-1"
        style={{ backgroundColor: colors.background, paddingTop: 40 }}
      >
        <View
          className="px-6 py-4 flex-row items-center justify-between border-b"
          style={{ borderColor: colors.border }}
        >
          <Text className="text-lg font-bold" style={{ color: colors.text }}>
            Select {activeType === "income" ? "Income" : "Expense"} Category
          </Text>
          <TouchableOpacity
            onPress={onClose}
            className="p-2 rounded-full"
            style={{ backgroundColor: op(0.05) }}
          >
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.emerald} />
          </View>
        ) : (
          <ScrollView className="flex-1 p-6">
            <CategoryGrid
              categories={categories}
              onSelect={onSelect}
              onClose={onClose}
              onDelete={deleteCategory}
              onAddNew={() => setIsAdding(true)}
            />
          </ScrollView>
        )}

        {isAdding && (
          <AddCategoryModal
            onSave={handleSave}
            onCancel={() => setIsAdding(false)}
          />
        )}
      </View>
    </Modal>
  );
}
