import * as SQLite from "expo-sqlite";

const DB_NAME = "coinvault.db";
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDb = async () => {
  if (dbPromise) return dbPromise;
  dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  return dbPromise;
};

export const initializeDatabase = async () => {
  const db = await getDb();

  try {
    // Enable foreign keys and WAL mode
    await db.execAsync("PRAGMA foreign_keys = ON;");
    await db.execAsync("PRAGMA journal_mode = WAL;");

    // Categories table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL
      );
    `);

    // Transactions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY NOT NULL,
        amount REAL NOT NULL,
        type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
        category_id TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT,
        payee TEXT,
        payment_method TEXT,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
      );
    `);

    // Seed default categories if none exist
    const categories = await db.getAllAsync(
      "SELECT id FROM categories LIMIT 1",
    );
    if (categories.length === 0) {
      console.log("Seeding default categories...");
      const defaultCategories = [
        ["1", "Food & Drinks", "restaurant", "expense"],
        ["2", "Transport", "directions-car", "expense"],
        ["3", "Shopping", "shopping-bag", "expense"],
        ["4", "Entertainment", "movie", "expense"],
        ["5", "Health", "medical-services", "expense"],
        ["6", "Salary", "payments", "income"],
        ["7", "Business", "business", "income"],
        ["8", "Investment", "trending-up", "income"],
      ];

      for (const cat of defaultCategories) {
        await db.runAsync(
          "INSERT INTO categories (id, name, icon, type) VALUES (?, ?, ?, ?)",
          cat[0],
          cat[1],
          cat[2],
          cat[3],
        );
      }
      console.log("Seeding completed.");
    }
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
};
