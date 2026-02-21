import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Category } from "../types";

export function useAddTransaction() {
  const { editId } = useLocalSearchParams<{ editId: string }>();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const [note, setNote] = useState("");
  const [payee, setPayee] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  useEffect(() => {
    if (editId) {
      fetchTransactionForEdit();
    }
  }, [editId]);

  const fetchTransactionForEdit = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          category:categories(name, icon, type)
        `,
        )
        .eq("id", editId)
        .single();

      if (error) throw error;

      setType(data.type);
      setAmount(Math.abs(data.amount).toString());
      setSelectedCategory(data.category);
      setNote(data.note || "");
      setPayee(data.payee || "");
      setDate(new Date(data.date));
      setPaymentMethod(data.payment_method || "Cash");
    } catch (error: any) {
      Alert.alert("Error fetching transaction", error.message);
    } finally {
      setIsLoading(false);
    }
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

      const transactionData = {
        user_id: user.id,
        amount: type === "expense" ? -parseFloat(amount) : parseFloat(amount),
        type,
        category_id: (selectedCategory as any).id,
        date: date.toISOString(),
        note: note.trim(),
        payee: type === "expense" ? payee.trim() : null,
        payment_method: paymentMethod,
      };

      let error;
      if (editId) {
        const { error: updateError } = await supabase
          .from("transactions")
          .update(transactionData)
          .eq("id", editId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("transactions")
          .insert(transactionData);
        error = insertError;
      }

      if (error) throw error;
      router.back();
    } catch (error: any) {
      console.error("Save Error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
}
