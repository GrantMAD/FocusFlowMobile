import { useEffect } from 'react';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useAuthStore } from '@/stores/authStore';

export function useSubscription() {
  const store = useSubscriptionStore();
  const { user } = useAuthStore();

  useEffect(() => {
    let unsub: (() => void) | undefined;

    if (user) {
      store.fetchSubscription(user.id);
      unsub = store.subscribeToChanges(user.id);
    }

    return () => {
      if (unsub) unsub();
    };
  }, [user]);

  return { isPro: store.isPro, status: store.status, isLoading: store.isLoading };
}
