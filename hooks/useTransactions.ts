import { isSameDay, isSameMonth, isSameWeek, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getDb } from "../lib/database";
import { Transaction } from "../types";

type FilterType = "All" | "Today" | "Week" | "Month";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [filter, setFilter] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filter, searchQuery, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const db = await getDb();

      // SQL JOIN to get category name and icon
      const result = await db.getAllAsync<any>(`
        SELECT 
          t.id, t.amount, t.type, t.date, t.note, t.payee, t.payment_method,
          c.name as category_name, c.icon as category_icon
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.date DESC
      `);

      // Maps flat SQLite result to the Transaction type nesting
      const formatted: Transaction[] = result.map((row) => ({
        id: row.id,
        amount: row.amount,
        type: row.type,
        date: row.date,
        note: row.note,
        payee: row.payee,
        payment_method: row.payment_method,
        category: {
          name: row.category_name,
          icon: row.category_icon,
        },
      }));

      setTransactions(formatted);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = transactions;
    const today = new Date();

    if (filter === "Today") {
      result = result.filter((t) => isSameDay(parseISO(t.date), today));
    } else if (filter === "Week") {
      result = result.filter((t) => isSameWeek(parseISO(t.date), today));
    } else if (filter === "Month") {
      result = result.filter((t) => isSameMonth(parseISO(t.date), today));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.note?.toLowerCase().includes(query) ||
          t.payee?.toLowerCase().includes(query) ||
          t.category?.name.toLowerCase().includes(query),
      );
    }

    setFilteredTransactions(result);
  };

  const deleteTransaction = (id: string) => {
    Alert.alert("Delete Transaction", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const db = await getDb();
            await db.runAsync("DELETE FROM transactions WHERE id = ?", [id]);
            setTransactions((prev) => prev.filter((t) => t.id !== id));
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  return {
    transactions,
    filteredTransactions,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    loading,
    fetchTransactions,
    deleteTransaction,
  };
}
