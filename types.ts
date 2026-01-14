
export type Category = string;

export const DEFAULT_CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Bills & Utilities",
  "Health",
  "Entertainment",
  "Other"
];

export const AVATAR_URL = "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People/Man%20Technologist.png";

export type RecurrenceFrequency = 'Weekly' | 'Monthly' | 'Yearly';

export type Language = 'en' | 'pt';
export type Theme = 'light' | 'dark';
export type SubscriptionStatus = 'free' | 'trial' | 'premium';

export interface LineItem {
  item: string;
  price: number;
  quantity: number;
}

export interface Budget {
  category: Category;
  amount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  monthlyBudget?: number;
  onboardingCompleted: boolean;
  currencyPreference: string;
  
  // Subscription & Limits
  subscriptionStatus: SubscriptionStatus;
  trialStartDate?: string; // ISO Date
  aiInteractionCount: number;
}

export interface Expense {
  id: string;
  user_id: string;
  created_at: string;
  merchant_name: string;
  amount: number;
  category: Category;
  date: string;
  receipt_image_url?: string;
  ai_summary: string;
  currency: string;
  line_items?: LineItem[];
  
  is_recurring?: boolean;
  recurrence_frequency?: RecurrenceFrequency;
  recurrence_end_date?: string;
  parent_id?: string;
}

export interface AIReceiptResponse {
  merchant_name: string;
  transaction_date: string;
  total_amount: number;
  currency: string;
  category: string;
  line_items: LineItem[];
  summary_note: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isActionable?: boolean;
  actionData?: {
    type: 'SET_BUDGET' | 'NAVIGATE' | 'CREATE_EXPENSE';
    category?: string;
    amount?: number;
    merchant?: string;
    date?: string;
    target?: 'dashboard' | 'scan';
  };
  suggestions?: string[];
}
