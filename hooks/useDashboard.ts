import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getDb } from "../lib/database";
import { Transaction } from "../types";

export function useDashboard() {
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
      const db = await getDb();

      const txs = await db.getAllAsync<any>(`
        SELECT 
          t.id, t.amount, t.type, t.date, t.note,
          c.name as category_name, c.icon as category_icon
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.date DESC
      `);

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

        const formatted: Transaction[] = txs.slice(0, 5).map((row) => ({
          id: row.id,
          amount: row.amount,
          type: row.type,
          date: row.date,
          note: row.note,
          payee: row.payee,
          category: {
            name: row.category_name,
            icon: row.category_icon,
          },
        }));

        setRecentTransactions(formatted);
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
    userName: "User",
    isGuest: true,
    balance,
    income,
    expense,
    recentTransactions,
    refreshing,
    onRefresh,
  };
}
