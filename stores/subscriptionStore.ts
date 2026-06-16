import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { createNotification } from '@/lib/notifications';

type SubscriptionStatus = 'free' | 'trial' | 'active' | 'cancelled' | 'expired' | 'lifetime';

type SubscriptionStore = {
  status: SubscriptionStatus;
  paymentSource: 'revenuecat' | 'stripe' | null;
  currentPeriodEndsAt: string | null;
  isLoading: boolean;
  isPro: boolean;
  fetchSubscription: (userId: string) => Promise<void>;
  subscribeToChanges: (userId: string) => () => void;
};

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  status: 'free',
  paymentSource: null,
  currentPeriodEndsAt: null,
  isLoading: true,
  isPro: false,

  fetchSubscription: async (userId) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('status, payment_source, current_period_ends_at')
      .eq('user_id', userId)
      .single();

    if (data) {
      set({
        status: data.status as SubscriptionStatus,
        paymentSource: data.payment_source,
        currentPeriodEndsAt: data.current_period_ends_at,
        isPro: computeIsPro(data.status, data.current_period_ends_at),
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  // Listens for real-time updates from the subscriptions table
  subscribeToChanges: (userId) => {
    const channelId = `mobile_sub_${userId}_${Math.random().toString(36).substring(7)}`;
    
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        const d = payload.new as any;
        const newIsPro = computeIsPro(d.status, d.current_period_ends_at);
        
        if (newIsPro && !get().isPro) {
          createNotification(
            userId,
            'Welcome to Pro! ⭐',
            'You now have full access to FocusFlow. Enjoy all ambient sounds and history!',
            'success'
          );
        }

        set({
          status: d.status,
          paymentSource: d.payment_source,
          currentPeriodEndsAt: d.current_period_ends_at,
          isPro: newIsPro,
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  },
}));

function computeIsPro(status: string, periodEndsAt: string | null): boolean {
  if (status === 'lifetime') return true;
  if (status === 'active' || status === 'trial') {
    if (!periodEndsAt) return true;
    return new Date(periodEndsAt) > new Date();
  }
  if (status === 'cancelled' && periodEndsAt) {
    return new Date(periodEndsAt) > new Date();
  }
  return false;
}
