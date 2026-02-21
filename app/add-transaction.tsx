import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmountInput } from "../components/add-transaction/AmountInput";
import { CategorySelector } from "../components/add-transaction/CategorySelector";
import { PaymentMethodSelector } from "../components/add-transaction/PaymentMethodSelector";
import { TransactionFormFields } from "../components/add-transaction/TransactionFormFields";
import { TransactionTypeToggle } from "../components/add-transaction/TransactionTypeToggle";
import { CategoryManager } from "../components/CategoryManager";
import { useTheme } from "../context/ThemeContext";
import { useAddTransaction } from "../hooks/useAddTransaction";

export default function AddTransaction() {
  const { colors, isDark } = useTheme();
  const {
    editId,
    type,
    setType,
    amount,
    setAmount,
    selectedCategory,
    setSelectedCategory,
    isCategoryModalVisible,
    setIsCategoryModalVisible,
    isSaving,
    isLoading,
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
    paymentMethod,
    setPaymentMethod,
    handleSave,
  } = useAddTransaction();

  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.emerald} />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        <View className="px-6 py-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full"
            style={{ backgroundColor: op(0.05) }}
          >
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text
            className="text-xl font-semibold tracking-tight"
            style={{ color: colors.text }}
          >
            {editId ? "Edit Transaction" : "New Transaction"}
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          <TransactionTypeToggle type={type} setType={setType} />

          <AmountInput amount={amount} setAmount={setAmount} />

          <CategorySelector
            selectedCategory={selectedCategory}
            onPress={() => setIsCategoryModalVisible(true)}
          />

          <CategoryManager
            isVisible={isCategoryModalVisible}
            onClose={() => setIsCategoryModalVisible(false)}
            activeType={type}
            onSelect={(cat) => setSelectedCategory(cat)}
          />

          <TransactionFormFields
            type={type}
            note={note}
            setNote={setNote}
            payee={payee}
            setPayee={setPayee}
            date={date}
            setDate={setDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            pickerMode={pickerMode}
            setPickerMode={setPickerMode}
          />

          <PaymentMethodSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <View className="h-32" />
        </ScrollView>

        <View
          className="px-6 py-6 absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: colors.background }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSave}
            className="w-full py-5 rounded-[24px] items-center justify-center shadow-2xl"
            style={{
              backgroundColor: colors.emerald,
              shadowColor: colors.emerald,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.4,
              shadowRadius: 15,
              elevation: 8,
            }}
          >
            <View
              className="absolute w-full h-full rounded-[24px] blur-3xl opacity-30"
              style={{ backgroundColor: colors.emerald }}
            />
            <Text className="text-xl font-black text-white tracking-widest">
              {isSaving
                ? "SAVING..."
                : editId
                  ? "UPDATE TRANSACTION"
                  : "SAVE TRANSACTION"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
