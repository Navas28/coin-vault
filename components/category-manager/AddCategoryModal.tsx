import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { IconPicker } from "./IconPicker";

interface AddCategoryModalProps {
  onSave: (name: string, icon: string) => void;
  onCancel: () => void;
}

export function AddCategoryModal({ onSave, onCancel }: AddCategoryModalProps) {
  const { colors, isDark } = useTheme();
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("label");
  const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);

  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="absolute inset-0 bg-black/80 justify-center px-6">
      <View
        className="p-6 rounded-3xl"
        style={{ backgroundColor: colors.card }}
      >
        <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>
          New Category
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
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

        <TouchableOpacity
          onPress={() => setIsIconPickerVisible(true)}
          className="flex-row items-center p-4 rounded-xl mb-6 border"
          style={{ backgroundColor: op(0.05), borderColor: colors.border }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.emerald + "20" }}
          >
            <MaterialIcons
              name={selectedIcon as any}
              size={24}
              color={colors.emerald}
            />
          </View>
          <View className="flex-1">
            <Text className="font-semibold" style={{ color: colors.text }}>
              Change Icon
            </Text>
            <Text className="text-xs" style={{ color: colors.textMuted }}>
              Tap to browse library
            </Text>
          </View>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.textMuted}
          />
        </TouchableOpacity>

        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onCancel}
            className="flex-1 py-4 rounded-xl items-center"
            style={{ backgroundColor: op(0.1) }}
          >
            <Text className="font-bold" style={{ color: colors.text }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (name.trim()) onSave(name, selectedIcon);
            }}
            className="flex-1 py-4 rounded-xl items-center"
            style={{ backgroundColor: colors.emerald }}
          >
            <Text className="font-bold text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <IconPicker
        isVisible={isIconPickerVisible}
        selectedIcon={selectedIcon}
        onSelect={(icon: string) => {
          setSelectedIcon(icon);
          setIsIconPickerVisible(false);
        }}
        onClose={() => setIsIconPickerVisible(false)}
      />
    </View>
  );
}
