import * as Crypto from "expo-crypto";
import { useState } from "react";
import { Alert } from "react-native";
import { getDb } from "../lib/database";
import { Category } from "../types";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async (type: "income" | "expense") => {
    if (!type) {
      console.warn("fetchCategories called without type");
      return;
    }
    try {
      setIsLoading(true);
      const db = await getDb();
      const result = await db.getAllAsync<Category>(
        "SELECT * FROM categories WHERE type = ? ORDER BY name ASC",
        [type],
      );
      setCategories(result || []);
    } catch (error: any) {
      console.error("fetchCategories error:", error);
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
    if (!name || !icon || !type) {
      Alert.alert("Error", "Name and icon are required.");
      return null;
    }
    try {
      const db = await getDb();
      const id = Crypto.randomUUID();
      const newCategory: Category = { id, name: name.trim(), icon, type };

      await db.runAsync(
        "INSERT INTO categories (id, name, icon, type) VALUES (?, ?, ?, ?)",
        [id, newCategory.name, icon, type],
      );

      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    } catch (error: any) {
      console.error("addCategory error:", error);
      Alert.alert("Error", error.message);
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const db = await getDb();
      await db.runAsync("DELETE FROM categories WHERE id = ?", [id]);
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
