// Fetch, filter, search, delete transactions

import { isSameDay, isSameMonth, isSameWeek, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Transaction } from "../types";

type FilterType = "All" | "Today" | "Week" | "Month";

interface UseTransactions {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  loading: boolean;
  fetchTransactions: () => Promise<void>;
  deleteTransaction: (id: string) => void;
}

export function useTransactions(): UseTransactions {
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
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          id,
          amount,
          type,
          date,
          note,
          payee,
          category:categories(name, icon)
        `,
        )
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setTransactions(data as any);
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
          const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", id);
          if (error) {
            Alert.alert("Error", error.message);
          } else {
            setTransactions((prev) => prev.filter((t) => t.id !== id));
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
