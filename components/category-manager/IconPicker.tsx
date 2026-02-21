import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ALL_ICONS } from "../../constants/icons";
import { useTheme } from "../../context/ThemeContext";

interface IconPickerProps {
  isVisible: boolean;
  selectedIcon: string;
  onSelect: (icon: string) => void;
  onClose: () => void;
}

export function IconPicker({
  isVisible,
  selectedIcon,
  onSelect,
  onClose,
}: IconPickerProps) {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  const filteredIcons = ALL_ICONS.filter((icon) =>
    icon.includes(searchQuery.toLowerCase()),
  );

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View
          className="h-[80%] rounded-t-[40px] px-6 pt-8"
          style={{ backgroundColor: colors.card }}
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              Icon Library
            </Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <MaterialIcons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View
            className="flex-row items-center px-4 py-3 rounded-2xl mb-6 border"
            style={{ backgroundColor: op(0.05), borderColor: colors.border }}
          >
            <MaterialIcons name="search" size={20} color={colors.textMuted} />
            <TextInput
              placeholder="Search icons (e.g. food, car)"
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-base"
              style={{ color: colors.text }}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between">
              {filteredIcons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => {
                    onSelect(icon);
                    setSearchQuery("");
                  }}
                  className="w-[18%] aspect-square items-center justify-center mb-4 rounded-2xl"
                  style={{
                    backgroundColor:
                      selectedIcon === icon
                        ? colors.emerald + "20"
                        : "transparent",
                  }}
                >
                  <MaterialIcons
                    name={icon as any}
                    size={28}
                    color={selectedIcon === icon ? colors.emerald : colors.text}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
