import { createContext, useContext, useMemo, ReactNode } from "react";
import type { AppData, PaymentMethod, WalletTransaction, Reminder } from "../store/types";
import { useAuth } from "./AuthContext";
import {
  SEED_PAYMENT_METHODS,
  SEED_TRANSACTIONS,
  SEED_REMINDERS,
  SEED_WALLET_BALANCE,
  SEED_WALLET_RESERVED
} from "../store/seedData";

// ─── Context value shape ─────────────────────────────────────────────
interface AppDataContextValue extends AppData {
  /** Mobile money detail string derived from user phone */
  mobileMoneyDetail: string;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────
interface AppDataProviderProps {
  children: ReactNode;
}

export function AppDataProvider({ children }: AppDataProviderProps): React.JSX.Element {
  const { user } = useAuth();

  const value = useMemo<AppDataContextValue>(() => {
    const phone = user?.phone ?? "";

    // Inject user phone into mobile money payment method detail
    const paymentMethods: PaymentMethod[] = SEED_PAYMENT_METHODS.map((pm) => {
      if (pm.type === "mobile_money") {
        return { ...pm, detail: `${pm.label} • ${phone.replace(/\s/g, "")}` };
      }
      return pm;
    });

    const transactions: WalletTransaction[] = SEED_TRANSACTIONS;
    const reminders: Reminder[] = SEED_REMINDERS;

    return {
      walletBalance: SEED_WALLET_BALANCE,
      walletReserved: SEED_WALLET_RESERVED,
      paymentMethods,
      transactions,
      reminders,
      mobileMoneyDetail: `MTN Mobile Money • ${phone.replace(/\s/g, "")}`
    };
  }, [user]);

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────
export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData must be used within an AppDataProvider");
  }
  return context;
}
