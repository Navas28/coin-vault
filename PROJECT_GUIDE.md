# 🪙 Coin Vault - Project Documentation

This document serves as a complete map of the **Coin Vault** codebase, explaining the purpose of each directory and file, and how they interact with each other. This app is now **Local-Only (Offline)**, using SQLite for privacy and speed.

---

## 🏗️ Architecture Overview

Coin Vault follows a **Modular Separation of Concerns** pattern:

- **`app/`**: Handles Routing and Screen layouts (Expo Router).
- **`hooks/`**: The **Logic Layer**. These files handle local database queries, state management, and business rules.
- **`components/`**: The **UI Layer**. Small, reusable pieces that only focus on rendering data passed from screens or hooks.
- **`lib/`**: Internal service configurations (**SQLite Database**).
- **`types/`**: Project-wide TypeScript definitions to ensure data consistency.

---

## 📁 Directory Breakdown

### 📱 `/app` (Screens & Navigation)

- `_layout.tsx`: Root configuration. Initializes the Local SQLite Database and Context Providers (Theme).
- `(tabs)/_layout.tsx`: Configures the bottom tab bar and icons.
- `(tabs)/index.tsx`: **Home Dashboard**. Displays balance cards and recent transactions.
- `(tabs)/stats.tsx`: **Analytics Screen**. Uses `useStats.ts` and `react-native-gifted-charts` to show spending.
- `(tabs)/profile.tsx`: **User Local Profile**. Handles Theme toggling.
- `add-transaction.tsx`: The form to create or edit records. Managed by `useAddTransaction.ts`.
- `welcome.tsx` & `intro1/2.tsx`: The Onboarding flow for new users.

### 🧠 `/hooks` (Logic & Data)

- **Heart of the App**. If you want to change _how_ something works (e.g., how balance is calculated), look here.
- `useDashboard.ts`: Computes total income/expenses from the local database.
- `useTransactions.ts`: Handles fetching, filtering, and deleting transactions from SQLite.
- `useAddTransaction.ts`: Manages the state of the "Add Record" form and persists it locally.
- `useStats.ts`: Processes raw database records into slices for charts.
- `useCategories.ts`: Manages the user's custom categories and system defaults.

### 🧩 `/components` (UI Building Blocks)

Categorized by feature for easy discovery:

- `add-transaction/`: Specific inputs for the entry form (Category picker, Amount pad).
- `transactions/`: UI for listing rows (Filters, Transaction cards).
- `category-manager/`: The grid and picker for managing spending categories.
- `VaultButton.tsx`: The custom floating action button (+) in the tab bar.

### 🔧 `/lib` & `/context`

- `lib/database.ts`: The bridge to the **Local SQLite** database. Handles schema initialization and connection.
- `context/ThemeContext.tsx`: Manages Global Dark/Light mode state across the whole app.

---

## 🔄 Core Data Flow

Example: **Adding a Transaction**

1.  **User Interface**: User interacts with `app/add-transaction.tsx`.
2.  **Logic Hook**: The screen uses `useAddTransaction.ts` to track state locally.
3.  **Database Call**: When "Save" is pressed, the hook calls `lib/database.ts` to run an `INSERT` statement into the local `transactions` table.
4.  **UI Feedback**: On success, the hook triggers `router.back()`, and the home screen auto-refreshes via the `useFocusEffect` inside `useDashboard.ts`.

---

## 🎨 Styling System

- **NativeWind (Tailwind CSS)**: Uses `className="..."` for most layouts.
- **ThemeContext**: Injected for dynamic colors (Backgrounds, Text colors) that must change between Dark and Light mode.

---

_Last Updated: March 2, 2026_
