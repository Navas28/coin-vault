import {
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from "date-fns";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getDb } from "../lib/database";

export type FilterPeriod = "Week" | "Month" | "Year" | "Custom";
export type ChartMode = "expense" | "income";

export interface CategoryStat {
  name: string;
  icon: string;
  total: number;
  percentage: number;
  color: string;
}

export interface StatsData {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  expenseCategoryStats: CategoryStat[];
  incomeCategoryStats: CategoryStat[];
  loading: boolean;
  filter: FilterPeriod;
  setFilter: (f: FilterPeriod) => void;
  customFrom: Date;
  customTo: Date;
  setCustomFrom: (d: Date) => void;
  setCustomTo: (d: Date) => void;
  refetch: () => void;
}

const EXPENSE_COLORS = [
  "#FF5252",
  "#FF8F00",
  "#F4511E",
  "#AD1457",
  "#D84315",
  "#C62828",
  "#8E24AA",
  "#FF7043",
];

const INCOME_COLORS = [
  "#00C853",
  "#00BFA5",
  "#00B0FF",
  "#64DD17",
  "#0091EA",
  "#1DE9B6",
  "#76FF03",
  "#2962FF",
];

function buildCategoryStats(
  txs: any[],
  type: "income" | "expense",
  palette: string[],
): CategoryStat[] {
  const catMap: Record<string, { name: string; icon: string; total: number }> =
    {};

  txs
    .filter((t) => (type === "expense" ? t.amount < 0 : t.amount > 0))
    .forEach((t) => {
      const name = t.category_name || "Other";
      const icon = t.category_icon || "category";
      if (!catMap[name]) catMap[name] = { name, icon, total: 0 };
      catMap[name].total += Math.abs(t.amount);
    });

  const totalAll = Object.values(catMap).reduce((s, c) => s + c.total, 0);
  return Object.values(catMap)
    .sort((a, b) => b.total - a.total)
    .map((c, i) => ({
      name: c.name,
      icon: c.icon,
      total: c.total,
      percentage: totalAll > 0 ? (c.total / totalAll) * 100 : 0,
      color: palette[i % palette.length],
    }));
}

export function useStats(): StatsData {
  const [filter, setFilter] = useState<FilterPeriod>("Month");
  const [customFrom, setCustomFrom] = useState<Date>(() =>
    startOfMonth(new Date()),
  );
  const [customTo, setCustomTo] = useState<Date>(new Date());
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netSavings, setNetSavings] = useState(0);
  const [expenseCategoryStats, setExpenseCategoryStats] = useState<
    CategoryStat[]
  >([]);
  const [incomeCategoryStats, setIncomeCategoryStats] = useState<
    CategoryStat[]
  >([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [filter, customFrom, customTo]),
  );

  const getDateRange = (): { from: Date; to: Date } => {
    const now = new Date();
    if (filter === "Week") {
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      };
    } else if (filter === "Month") {
      return { from: startOfMonth(now), to: endOfMonth(now) };
    } else if (filter === "Year") {
      return { from: startOfYear(now), to: endOfYear(now) };
    } else {
      return { from: customFrom, to: customTo };
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { from, to } = getDateRange();
      const db = await getDb();

      const txs = await db.getAllAsync<any>(
        `
        SELECT t.amount, c.name as category_name, c.icon as category_icon
        FROM transactions t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.date >= ? AND t.date <= ?
      `,
        [from.toISOString(), to.toISOString()],
      );

      let income = 0;
      let expense = 0;
      txs.forEach((t) => {
        if (t.amount > 0) income += t.amount;
        else expense += Math.abs(t.amount);
      });
      setTotalIncome(income);
      setTotalExpense(expense);
      setNetSavings(income - expense);

      setExpenseCategoryStats(
        buildCategoryStats(txs, "expense", EXPENSE_COLORS),
      );
      setIncomeCategoryStats(buildCategoryStats(txs, "income", INCOME_COLORS));
    } catch (e) {
      console.error("Stats fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  return {
    totalIncome,
    totalExpense,
    netSavings,
    expenseCategoryStats,
    incomeCategoryStats,
    loading,
    filter,
    setFilter,
    customFrom,
    customTo,
    setCustomFrom,
    setCustomTo,
    refetch: fetchStats,
  };
}
