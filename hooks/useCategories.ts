// 	All category Supabase logic 

import { useState } from "react";
import { Alert } from "react-native";
import { supabase } from "../lib/supabase";
import { Category } from "../types";

interface UseCategories {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: (type: "income" | "expense") => Promise<void>;
  addCategory: (
    name: string,
    icon: string,
    type: "income" | "expense",
  ) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<void>;
}

export function useCategories(): UseCategories {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async (type: "income" | "expense") => {
    try {
      setIsLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", type)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (
    name: string,
    icon: string,
    type: "income" | "expense",
  ): Promise<Category | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      const { data, error } = await supabase
        .from("categories")
        .insert({ user_id: user.id, name: name.trim(), icon, type })
        .select()
        .single();

      if (error) throw error;

      setCategories((prev) => [...prev, data]);
      return data;
    } catch (error: any) {
      Alert.alert("Error", error.message);
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      Alert.alert("Error", "Could not delete category.");
    }
  };

  return {
    categories,
    isLoading,
    fetchCategories,
    addCategory,
    deleteCategory,
  };
}
