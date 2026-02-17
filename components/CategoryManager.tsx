import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";

interface Category {
  id: string;
  name: string;
  icon: string;
  type: "income" | "expense";
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("label");

  const icons = [
    "home",
    "restaurant",
    "shopping-bag",
    "directions-car",
    "movie",
    "medical-services",
    "school",
    "flight",
    "pets",
    "sports-esports",
    "work",
    "savings",
    "card-giftcard",
    "build",
    "label",
  ];

  useEffect(() => {
    if (isVisible) {
      fetchCategories();
    }
  }, [isVisible, activeType]);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", activeType)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("categories")
        .insert({
          user_id: user.id,
          name: newCategoryName.trim(),
          icon: selectedIcon,
          type: activeType,
        })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      setNewCategoryName("");
      setIsAdding(false);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error: any) {
      Alert.alert("Error", "Could not delete category.");
    }
  };

  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        className="flex-1"
        style={{
          backgroundColor: colors.background,
          paddingTop: 40, // Manual safe area padding if needed
        }}
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
            <View className="flex-row flex-wrap gap-4 justify-between">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => {
                    onSelect(cat);
                    onClose();
                  }}
                  className="w-[47%] p-4 rounded-2xl items-center border relative"
                  style={{
                    backgroundColor: op(0.03),
                    borderColor: colors.border,
                  }}
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

                  {/* Delete Button (Long Press could be better, but keeping simple) */}
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert("Delete", "Delete this category?", [
                        { text: "Cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => handleDeleteCategory(cat.id),
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

              {/* Add New Button */}
              <TouchableOpacity
                onPress={() => setIsAdding(true)}
                className="w-[47%] p-4 rounded-2xl items-center justify-center border border-dashed"
                style={{
                  borderColor: colors.textMuted,
                  backgroundColor: "transparent",
                }}
              >
                <MaterialIcons name="add" size={32} color={colors.textMuted} />
                <Text
                  className="font-medium mt-2"
                  style={{ color: colors.textMuted }}
                >
                  Create New
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Add Category Modal/Overlay */}
        {isAdding && (
          <View className="absolute inset-0 bg-black/80 justify-center px-6">
            <View
              className="p-6 rounded-3xl"
              style={{ backgroundColor: colors.card }}
            >
              <Text
                className="text-xl font-bold mb-4"
                style={{ color: colors.text }}
              >
                New Category
              </Text>

              <TextInput
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="Category Name"
                placeholderTextColor={colors.textMuted}
                className="p-4 rounded-xl mb-4 border"
                style={{
                  color: colors.text,
                  backgroundColor: op(0.05),
                  borderColor: colors.border,
                }}
                autoFocus
              />

              <Text
                className="text-xs font-bold mb-2 uppercase"
                style={{ color: colors.textMuted }}
              >
                Choose Icon
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-6"
              >
                {icons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    onPress={() => setSelectedIcon(icon)}
                    className="mr-3 p-3 rounded-xl border"
                    style={{
                      backgroundColor:
                        selectedIcon === icon ? colors.emerald : op(0.05),
                      borderColor:
                        selectedIcon === icon ? colors.emerald : colors.border,
                    }}
                  >
                    <MaterialIcons
                      name={icon as any}
                      size={24}
                      color={selectedIcon === icon ? "white" : colors.text}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => setIsAdding(false)}
                  className="flex-1 py-4 rounded-xl items-center"
                  style={{ backgroundColor: op(0.1) }}
                >
                  <Text className="font-bold" style={{ color: colors.text }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddCategory}
                  className="flex-1 py-4 rounded-xl items-center"
                  style={{ backgroundColor: colors.emerald }}
                >
                  <Text className="font-bold text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
