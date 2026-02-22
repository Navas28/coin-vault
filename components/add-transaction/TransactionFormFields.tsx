import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface TransactionFormFieldsProps {
  type: "income" | "expense";
  note: string;
  setNote: (note: string) => void;
  payee: string;
  setPayee: (payee: string) => void;
  date: Date;
  setDate: (date: Date) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  pickerMode: "date" | "time";
  setPickerMode: (mode: "date" | "time") => void;
}

export function TransactionFormFields({
  type,
  note,
  setNote,
  payee,
  setPayee,
  date,
  setDate,
  showDatePicker,
  setShowDatePicker,
  pickerMode,
  setPickerMode,
}: TransactionFormFieldsProps) {
  const { colors, isDark } = useTheme();
  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="mt-12 space-y-6 gap-6">
      <View
        className="rounded-3xl p-5 border"
        style={{ backgroundColor: op(0.05), borderColor: colors.border }}
      >
        <View className="flex-row items-center mb-3">
          <MaterialIcons name="notes" size={18} color={colors.accent} />
          <Text
            className="ml-2 text-xs font-black uppercase tracking-[1.5px]"
            style={{ color: colors.textMuted }}
          >
            Note
          </Text>
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Add a description..."
          placeholderTextColor={op(0.3)}
          className="text-lg font-medium py-1"
          style={{ color: colors.text }}
          multiline
        />
      </View>

      {type === "expense" && (
        <View
          className="rounded-3xl p-5 border"
          style={{
            backgroundColor: op(0.05),
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="person" size={18} color={colors.accent} />
            <Text
              className="ml-2 text-xs font-black uppercase tracking-[1.5px]"
              style={{ color: colors.textMuted }}
            >
              Payee
            </Text>
          </View>
          <TextInput
            value={payee}
            onChangeText={setPayee}
            placeholder="Enter payee name"
            placeholderTextColor={op(0.3)}
            className="text-lg font-medium py-1"
            style={{ color: colors.text }}
          />
        </View>
      )}

      <View className="flex-row gap-4">
        <TouchableOpacity
          onPress={() => {
            setPickerMode("date");
            setShowDatePicker(true);
          }}
          className="flex-1 rounded-3xl p-5 border flex-row items-center justify-between"
          style={{
            backgroundColor: op(0.05),
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: op(0.05) }}
            >
              <MaterialIcons
                name="calendar-today"
                size={20}
                color={colors.accent}
              />
            </View>
            <View>
              <Text
                className="text-[10px] font-bold uppercase tracking-[1.5px]"
                style={{ color: colors.textMuted }}
              >
                Date
              </Text>
              <Text
                className="text-base font-semibold mt-0.5"
                style={{ color: colors.text }}
              >
                {date.toLocaleDateString()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setPickerMode("time");
            setShowDatePicker(true);
          }}
          className="flex-1 rounded-3xl p-5 border flex-row items-center justify-between"
          style={{
            backgroundColor: op(0.05),
            borderColor: colors.border,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: op(0.05) }}
            >
              <MaterialIcons
                name="access-time"
                size={20}
                color={colors.accent}
              />
            </View>
            <View>
              <Text
                className="text-[10px] font-black uppercase tracking-[1.5px]"
                style={{ color: colors.textMuted }}
              >
                Time
              </Text>
              <Text
                className="text-base font-semibold mt-0.5"
                style={{ color: colors.text }}
              >
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode={pickerMode}
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event.type === "set" && selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}
    </View>
  );
}
