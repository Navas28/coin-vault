# 🪙 Coin Vault - Project Documentation

This document serves as a complete map of the **Coin Vault** codebase, explaining the purpose of each directory and file, and how they interact with each other.

---

## 🏗️ Architecture Overview

Coin Vault follows a **Modular Separation of Concerns** pattern:

- **`app/`**: Handles Routing and Screen layouts (Expo Router).
- **`hooks/`**: The **Logic Layer**. These files handle data fetching, state management, and business rules.
- **`components/`**: The **UI Layer**. Small, reusable pieces that only focus on rendering data passed from screens or hooks.
- **`lib/`**: External service configurations (Supabase).
- **`types/`**: Project-wide TypeScript definitions to ensure data consistency.

---

## 📁 Directory Breakdown

### 📱 `/app` (Screens & Navigation)

- `_layout.tsx`: Root configuration. Sets up the Navigation Stack and Context Providers (Theme).
- `(tabs)/_layout.tsx`: Configures the bottom tab bar and icons.
- `(tabs)/index.tsx`: **Home Dashboard**. Displays balance cards and recent transactions.
- `(tabs)/stats.tsx`: **Analytics Screen**. Uses `useStats.ts` and `react-native-gifted-charts` to show spending.
- `(tabs)/profile.tsx`: **User Settings**. Handles Sign Out and Theme toggling.
- `add-transaction.tsx`: The form to create or edit records. Managed by `useAddTransaction.ts`.
- `auth.tsx`: Entrance screen (Google Login / Guest entry).
- `welcome.tsx` & `intro1/2.tsx`: The Onboarding flow for new users.

### 🧠 `/hooks` (Logic & Data)

- **Heart of the App**. If you want to change _how_ something works (e.g., how balance is calculated), look here.
- `useDashboard.ts`: Computes total income/expenses for the home screen.
- `useTransactions.ts`: Handles fetching, filtering, and deleting transactions from Supabase.
- `useAddTransaction.ts`: Manages the complex state of the "Add Record" form (Amount, Date, Category).
- `useStats.ts`: Processes raw data into slices for charts (Income vs Expense categories).
- `useCategories.ts`: Manages the user's custom categories and system defaults.

### 🧩 `/components` (UI Building Blocks)

Categorized by feature for easy discovery:

- `add-transaction/`: Specific inputs for the entry form (Category picker, Amount pad).
- `transactions/`: UI for listing rows (Filters, Transaction cards).
- `category-manager/`: The grid and picker for managing spending categories.
- `VaultButton.tsx`: The custom floating action button (+) in the tab bar.

### 🔧 `/lib` & `/context`

- `lib/supabase.ts`: The bridge to the database. Handles Authentication and CRUD operations.
- `context/ThemeContext.tsx`: Manages Global Dark/Light mode state across the whole app.

---

## 🔄 Core Data Flow

Example: **Adding a Transaction**

1.  **User Interface**: User interacts with `app/add-transaction.tsx`.
2.  **Logic Hook**: The screen uses `useAddTransaction.ts` to track state locally.
3.  **Database Call**: When "Save" is pressed, the hook calls `lib/supabase.ts` to push data to the `transactions` table.
4.  **UI Feedback**: On success, the hook triggers `router.back()`, and the home screen auto-refreshes via the `useFocusEffect` inside `useDashboard.ts`.

---

## 🎨 Styling System

- **NativeWind (Tailwind CSS)**: Uses `className="..."` for most layouts.
- **ThemeContext**: Injected for dynamic colors (Backgrounds, Text colors) that must change between Dark and Light mode.

---

_Last Updated: February 2026_
