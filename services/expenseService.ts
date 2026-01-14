
import { Expense, Budget, DEFAULT_CATEGORIES, ChatMessage, UserProfile } from "../types";

const STORAGE_KEY = 'receiptlens_expenses';
const BUDGET_KEY = 'receiptlens_budgets';
const CATEGORIES_KEY = 'receiptlens_categories';
const CHAT_HISTORY_KEY = 'receiptlens_chat_history';
const USER_PROFILE_KEY = 'receiptlens_user_profile';

// Seed data in BRL
const seedData: Expense[] = [
  {
    id: '1',
    user_id: 'user_123',
    created_at: new Date().toISOString(),
    merchant_name: 'Starbucks',
    amount: 18.50,
    category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    ai_summary: 'Café da manhã',
    currency: 'BRL',
    line_items: [{ item: 'Latte', price: 18.50, quantity: 1 }]
  },
  {
    id: '2',
    user_id: 'user_123',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    merchant_name: 'Uber',
    amount: 32.40,
    category: 'Transport',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    ai_summary: 'Corrida para o trabalho',
    currency: 'BRL'
  },
  {
    id: '3',
    user_id: 'user_123',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    merchant_name: 'Pão de Açúcar',
    amount: 145.99,
    category: 'Shopping',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    ai_summary: 'Compras semanais',
    currency: 'BRL'
  }
];

// --- User Profile Management ---

export const getUserProfile = (): UserProfile | null => {
  const stored = localStorage.getItem(USER_PROFILE_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
};

export const updateUserProfile = (updates: Partial<UserProfile>) => {
  const current = getUserProfile();
  if (current) {
    const updated = { ...current, ...updates };
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  }
  return null;
};

export const checkTrialStatus = (): UserProfile | null => {
  const user = getUserProfile();
  if (!user) return null;

  if (user.subscriptionStatus === 'trial' && user.trialStartDate) {
    const start = new Date(user.trialStartDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > 3) {
       // Expire Trial
       const updated = { ...user, subscriptionStatus: 'free' as const };
       saveUserProfile(updated);
       return updated;
    }
  }
  return user;
};

export const incrementAIInteraction = (): boolean => {
    const user = getUserProfile();
    if (!user) return false;

    if (user.subscriptionStatus === 'premium' || user.subscriptionStatus === 'trial') {
        const updated = { ...user, aiInteractionCount: (user.aiInteractionCount || 0) + 1 };
        saveUserProfile(updated);
        return true;
    }

    if ((user.aiInteractionCount || 0) >= 5) {
        return false;
    }

    const updated = { ...user, aiInteractionCount: (user.aiInteractionCount || 0) + 1 };
    saveUserProfile(updated);
    return true;
};

export const clearUserProfile = () => {
    localStorage.removeItem(USER_PROFILE_KEY);
};

// --- Expense Management ---

export const getExpenses = (): Expense[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(stored);
};

export const addExpense = (expense: Omit<Expense, 'id' | 'created_at' | 'user_id'>): Expense => {
  const current = getExpenses();
  const newExpense: Expense = {
    ...expense,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    user_id: 'mock_user'
  };
  
  const updated = [newExpense, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newExpense;
};

export const updateExpense = (expense: Expense): Expense => {
  const current = getExpenses();
  const index = current.findIndex(e => e.id === expense.id);
  
  if (index !== -1) {
    current[index] = expense;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return expense;
  }
  return addExpense(expense);
};

// --- Budget Management ---

export const getBudgets = (): Budget[] => {
  const stored = localStorage.getItem(BUDGET_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveBudget = (budget: Budget) => {
  const current = getBudgets();
  const index = current.findIndex(b => b.category === budget.category);
  
  if (index !== -1) {
    current[index] = budget;
  } else {
    current.push(budget);
  }
  localStorage.setItem(BUDGET_KEY, JSON.stringify(current));
};

// --- Category Management ---

export const getCategories = (): string[] => {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_CATEGORIES;
};

export const canAddCategory = (): boolean => {
    const user = getUserProfile();
    if (!user) return false;
    if (user.subscriptionStatus === 'premium' || user.subscriptionStatus === 'trial') return true;
    
    const current = getCategories();
    return current.length < (DEFAULT_CATEGORIES.length + 2);
};

export const saveCategories = (categories: string[]) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const updateCategoryName = (oldName: string, newName: string) => {
  // Update list
  const categories = getCategories();
  const index = categories.indexOf(oldName);
  if (index !== -1) {
    categories[index] = newName;
    saveCategories(categories);
  }

  // Update Expenses
  const expenses = getExpenses();
  const updatedExpenses = expenses.map(e => {
    if (e.category === oldName) {
      return { ...e, category: newName };
    }
    return e;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));

  // Update Budgets
  const budgets = getBudgets();
  const updatedBudgets = budgets.map(b => {
    if (b.category === oldName) {
      return { ...b, category: newName };
    }
    return b;
  });
  localStorage.setItem(BUDGET_KEY, JSON.stringify(updatedBudgets));
};

// --- Recurring Logic ---

export const processRecurringExpenses = (): Expense[] => {
  const expenses = getExpenses();
  const recurringTemplates = expenses.filter(e => e.is_recurring && !e.parent_id);
  const today = new Date();
  let addedCount = 0;

  recurringTemplates.forEach(template => {
    if (!template.recurrence_frequency) return;

    const templateDate = new Date(template.date);
    
    let targetDateStr = '';
    
    if (template.recurrence_frequency === 'Monthly') {
      const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), templateDate.getDate());
      if (today.getDate() >= templateDate.getDate()) {
        targetDateStr = currentMonthDate.toISOString().split('T')[0];
      }
    } else if (template.recurrence_frequency === 'Weekly') {
      return; 
    } else if (template.recurrence_frequency === 'Yearly') {
       const currentYearDate = new Date(today.getFullYear(), templateDate.getMonth(), templateDate.getDate());
       if (today >= currentYearDate) {
         targetDateStr = currentYearDate.toISOString().split('T')[0];
       }
    }

    if (!targetDateStr) return;

    if (template.recurrence_end_date && new Date(targetDateStr) > new Date(template.recurrence_end_date)) {
      return;
    }

    const alreadyExists = expenses.some(e => 
      (e.parent_id === template.id && e.date === targetDateStr) || 
      (e.id === template.id && e.date === targetDateStr) 
    );

    if (!alreadyExists && targetDateStr !== template.date) {
      const newRecurrence: Expense = {
        ...template,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        date: targetDateStr,
        parent_id: template.id,
        is_recurring: false,
        ai_summary: `[Recorrente] ${template.ai_summary}`
      };
      
      expenses.unshift(newRecurrence);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }

  return expenses;
};

// --- Chat History Management ---

export const getChatHistory = (): ChatMessage[] => {
  const stored = localStorage.getItem(CHAT_HISTORY_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveChatHistory = (history: ChatMessage[]) => {
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
};

export const clearChatHistory = () => {
  localStorage.removeItem(CHAT_HISTORY_KEY);
};
