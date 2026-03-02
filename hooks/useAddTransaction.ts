import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getDb } from "../lib/database";
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
      const db = await getDb();
      const row = await db.getFirstAsync<any>(
        `
        SELECT t.*, c.name as cat_name, c.icon as cat_icon, c.type as cat_type
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?
      `,
        [editId],
      );

      if (row) {
        setType(row.type);
        setAmount(Math.abs(row.amount).toString());
        setSelectedCategory({
          id: row.category_id,
          name: row.cat_name,
          icon: row.cat_icon,
          type: row.cat_type,
        });
        setNote(row.note || "");
        setPayee(row.payee || "");
        setDate(new Date(row.date));
        setPaymentMethod(row.payment_method || "Cash");
      }
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
      const db = await getDb();
      const numericAmount =
        type === "expense" ? -parseFloat(amount) : parseFloat(amount);
      const categoryId = (selectedCategory as any).id;
      const isoDate = date.toISOString();
      const cleanNote = note.trim();
      const cleanPayee = type === "expense" ? payee.trim() : null;

      if (editId) {
        await db.runAsync(
          `UPDATE transactions SET amount=?, type=?, category_id=?, date=?, note=?, payee=?, payment_method=? WHERE id=?`,
          [
            numericAmount,
            type,
            categoryId,
            isoDate,
            cleanNote,
            cleanPayee,
            paymentMethod,
            editId,
          ],
        );
      } else {
        const id = Crypto.randomUUID();
        await db.runAsync(
          `INSERT INTO transactions (id, amount, type, category_id, date, note, payee, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            numericAmount,
            type,
            categoryId,
            isoDate,
            cleanNote,
            cleanPayee,
            paymentMethod,
          ],
        );
      }

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
