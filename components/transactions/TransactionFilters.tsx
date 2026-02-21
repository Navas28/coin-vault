import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

type FilterType = "All" | "Today" | "Week" | "Month";
const FILTERS: FilterType[] = ["All", "Today", "Week", "Month"];

interface TransactionFiltersProps {
  filter: FilterType;
  onFilterChange: (f: FilterType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function TransactionFilters({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: TransactionFiltersProps) {
  const { colors, isDark } = useTheme();
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="px-6 pb-2">
      <View
        className="flex-row items-center px-4 py-3 rounded-2xl mb-4"
        style={{ backgroundColor: op(0.05) }}
      >
        <Feather name="search" size={18} color={colors.textMuted} />
        <TextInput
          placeholder="Search note, payee..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          className="flex-1 ml-3 text-base font-medium"
          style={{ color: colors.text }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange("")}>
            <MaterialIcons name="close" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-row gap-3 mb-2">
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => onFilterChange(f)}
            className="px-4 py-1.5 rounded-full border"
            style={{
              backgroundColor: filter === f ? colors.emerald : "transparent",
              borderColor: filter === f ? colors.emerald : colors.border,
            }}
          >
            <Text
              className="text-sm font-bold"
              style={{ color: filter === f ? "#fff" : colors.textMuted }}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
