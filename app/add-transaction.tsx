import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryManager } from "../components/CategoryManager";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";

export default function AddTransaction() {
  const { colors, isDark } = useTheme();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null); // To store full category object
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [note, setNote] = useState("");
  const [payee, setPayee] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [receipt, setReceipt] = useState<string | null>(null);

  // We no longer need the static `categories` array.
  // Instead, we will fetch the user's categories or default ones.

  const paymentMethods = ["Cash", "Bank Transfer", "Credit Card"];

  const pickImage = async () => {
    Alert.alert("Attach Receipt", "Choose an option", [
      {
        text: "Camera",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission to access camera is required!");
            return;
          }
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) setReceipt(result.assets[0].uri);
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) setReceipt(result.assets[0].uri);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      Alert.alert(
        "Missing Info",
        "Please enter an amount and select a category.",
      );
      return;
    }

    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let receiptUrl = null;

      // 1. Upload Receipt (if exists)
      if (receipt) {
        const fileExt = receipt.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const formData = new FormData();

        // React Native specific way to append file
        formData.append("file", {
          uri: receipt,
          name: fileName,
          type: `image/${fileExt}`,
        } as any);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(fileName, formData);

        if (uploadError) {
          console.error(uploadError);
          // Optional: Continue without receipt or throw error
        } else {
          const { data: publicUrlData } = supabase.storage
            .from("receipts")
            .getPublicUrl(fileName);
          receiptUrl = publicUrlData.publicUrl;
        }
      }

      // 2. Insert Transaction
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
        type,
        category_id: selectedCategory.id,
        date: date.toISOString(),
        note,
        payee: type === "expense" ? payee : null,
        payment_method: paymentMethod,
        receipt_url: receiptUrl,
      });

      if (error) throw error;

      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const op = isDark ? colors.whiteOpacity : colors.blackOpacity;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
        {/* Header */}
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
            New Transaction
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Transaction Type Toggle */}
          <View
            className="flex-row rounded-2xl p-1 mt-6"
            style={{ backgroundColor: op(0.05) }}
          >
            <TouchableOpacity
              onPress={() => setType("income")}
              className="flex-1 py-3 rounded-xl items-center"
              style={{
                backgroundColor:
                  type === "income" ? colors.emerald : "transparent",
              }}
            >
              <Text
                className="font-bold tracking-wide"
                style={{ color: type === "income" ? "#fff" : colors.textMuted }}
              >
                INCOME
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setType("expense")}
              className="flex-1 py-3 rounded-xl items-center"
              style={{
                backgroundColor:
                  type === "expense" ? colors.emerald : "transparent",
              }}
            >
              <Text
                className="font-bold tracking-wide"
                style={{
                  color: type === "expense" ? "#fff" : colors.textMuted,
                }}
              >
                EXPENSE
              </Text>
            </TouchableOpacity>
          </View>

          {/* 2. Amount Entry */}
          <View
            className="items-center mt-12 py-10 rounded-3xl"
            style={{ backgroundColor: op(0.02) }}
          >
            <Text
              className="text-xs font-black uppercase tracking-[2px] mb-4"
              style={{ color: colors.textMuted }}
            >
              Amount Input
            </Text>
            <View className="flex-row items-center">
              <Text
                className="text-4xl font-bold mr-2"
                style={{ color: colors.accent }}
              >
                ₹
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                className="text-6xl font-bold"
                style={{ color: colors.accent }}
                placeholder="0.00"
                placeholderTextColor={colors.accentOpacity(0.2)}
                autoFocus
              />
            </View>
          </View>

          {/* 3. Category Selector */}
          <View className="mt-10">
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-xs font-black uppercase tracking-[2px]"
                style={{ color: colors.textMuted }}
              >
                Select Category
              </Text>
              <TouchableOpacity onPress={() => setIsCategoryModalVisible(true)}>
                <Text className="text-emerald-500 font-bold">Edit / Add</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setIsCategoryModalVisible(true)}
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
                      name={selectedCategory.icon}
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

          {/* Category Modal */}
          <CategoryManager
            isVisible={isCategoryModalVisible}
            onClose={() => setIsCategoryModalVisible(false)}
            activeType={type}
            onSelect={(cat) => setSelectedCategory(cat)}
          />

          {/* 4. Form Fields */}
          <View className="mt-12 space-y-6 gap-6">
            {/* Note */}
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
                className="text-white text-lg font-medium py-1"
                multiline
              />
            </View>

            {/* Payee (Expense only) */}
            {type === "expense" && (
              <View
                className="rounded-3xl p-5 border"
                style={{
                  backgroundColor: op(0.05),
                  borderColor: colors.border,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <MaterialIcons
                    name="person"
                    size={18}
                    color={colors.accent}
                  />
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
                  className="text-white text-lg font-medium py-1"
                />
              </View>
            )}

            {/* Date & Time Split */}
            <View className="flex-row gap-4">
              {/* Date Picker */}
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
                      className="text-[10px] font-black uppercase tracking-[1.5px]"
                      style={{ color: colors.textMuted }}
                    >
                      Date
                    </Text>
                    <Text className="text-white text-base font-semibold mt-0.5">
                      {date.toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Time Picker */}
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
                    <Text className="text-white text-base font-semibold mt-0.5">
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

            {/* Payment Method */}
            <View
              className="rounded-3xl p-5 border"
              style={{ backgroundColor: op(0.05), borderColor: colors.border }}
            >
              <View className="flex-row items-center mb-5">
                <MaterialIcons name="payment" size={18} color={colors.accent} />
                <Text
                  className="ml-2 text-xs font-black uppercase tracking-[1.5px]"
                  style={{ color: colors.textMuted }}
                >
                  Payment Method
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-3">
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    className="px-5 py-2.5 rounded-2xl border"
                    style={{
                      backgroundColor:
                        paymentMethod === method
                          ? colors.emerald + "20"
                          : "transparent",
                      borderColor:
                        paymentMethod === method ? colors.emerald : op(0.1),
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{
                        color:
                          paymentMethod === method
                            ? colors.emerald
                            : colors.textMuted,
                      }}
                    >
                      {method.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Attachments */}
            <TouchableOpacity
              onPress={pickImage}
              className="rounded-3xl p-8 border items-center justify-center border-dashed"
              style={{ backgroundColor: op(0.02), borderColor: op(0.1) }}
            >
              {receipt ? (
                <View className="w-full h-48 rounded-2xl overflow-hidden relative">
                  <Image
                    source={{ uri: receipt }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => setReceipt(null)}
                    className="absolute top-3 right-3 bg-black/60 p-2 rounded-full"
                  >
                    <MaterialIcons name="close" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center mb-4"
                    style={{ backgroundColor: op(0.05) }}
                  >
                    <MaterialIcons
                      name="camera-alt"
                      size={32}
                      color={colors.textMuted}
                    />
                  </View>
                  <Text
                    className="text-sm font-bold tracking-tight"
                    style={{ color: colors.textMuted }}
                  >
                    ATTACH RECEIPT
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View className="h-32" />
        </ScrollView>

        {/* Save Button */}
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
              {isSaving ? "SAVING..." : "SAVE TRANSACTION"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
