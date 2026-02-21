/**
 * Shared TypeScript types for the app.
 */

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: "income" | "expense";
}

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  note: string;
  payee: string | null;
  payment_method?: string;
  category: {
    name: string;
    icon: string;
    type?: string;
  };
}
