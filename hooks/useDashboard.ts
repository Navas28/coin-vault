import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { supabase } from "../lib/supabase";
import { Transaction } from "../types";

interface DashboardData {
  userName: string | null;
  isGuest: boolean;
  balance: number;
  income: number;
  expense: number;
  recentTransactions: Transaction[];
  refreshing: boolean;
  onRefresh: () => void;
}

export function useDashboard(): DashboardData {
  const [userName, setUserName] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  );
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, []),
  );

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setIsGuest(user.is_anonymous ?? false);
      setUserName(
        user.is_anonymous
          ? "Guest"
          : user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "User",
      );

      const { data: txs, error } = await supabase
        .from("transactions")
        .select(
          `
          id,
          amount,
          date,
          note,
          type,
          category:categories(name, icon, type)
        `,
        )
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;

      if (txs) {
        const totalIncome = txs
          .filter((t) => t.amount > 0)
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = txs
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0);

        setIncome(totalIncome);
        setExpense(totalExpense);
        setBalance(totalIncome + totalExpense);
        setRecentTransactions(txs.slice(0, 5) as any);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  return {
    userName,
    isGuest,
    balance,
    income,
    expense,
    recentTransactions,
    refreshing,
    onRefresh,
  };
}
