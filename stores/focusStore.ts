import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { FocusSession } from '@/types';
import { createNotification } from '@/lib/notifications';

type FocusStore = {
  currentSession: Partial<FocusSession> | null;
  isActive: boolean;
  timeLeft: number;
  mode: 'work' | 'break';

  startSession: (type: FocusSession['session_type'], duration: number, taskId?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: (completed: boolean) => Promise<void>;
  tick: () => void;
};

export const useFocusStore = create<FocusStore>((set, get) => ({
  currentSession: null,
  isActive: false,
  timeLeft: 15 * 60,
  mode: 'work',

  startSession: (type, duration, taskId) => {
    set({
      currentSession: {
        session_type: type,
        planned_minutes: Math.floor(duration / 60),
        started_at: new Date().toISOString(),
        task_id: taskId,
      },
      isActive: true,
      timeLeft: duration,
      mode: 'work',
    });
  },

  pauseSession: () => set({ isActive: false }),
  resumeSession: () => set({ isActive: true }),

  tick: () => {
    const { timeLeft, isActive } = get();
    if (isActive && timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else if (isActive && timeLeft === 0) {
      set({ isActive: false });
    }
  },

  endSession: async (completed) => {
    const { currentSession } = get();
    if (!currentSession) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const sessionData = {
      ...currentSession,
      user_id: user.id,
      actual_minutes: completed ? (currentSession.planned_minutes || 0) : 0,
      completed,
      ended_at: new Date().toISOString(),
    };

    await supabase.from('focus_sessions').insert([sessionData]);

    if (completed) {
      // 1. Success notification for the session
      await createNotification(
        user.id,
        'Deep Work Complete! 🎯',
        `Great job! You just banked ${currentSession.planned_minutes} minutes of focused work.`,
        'success',
        '/progress'
      );

      // 2. Check for daily goal reached (e.g., 60 mins)
      const today = new Date().toISOString().split('T')[0];
      const { data: stats } = await supabase.rpc('get_weekly_stats', { 
        p_user_id: user.id,
        p_start_date: today
      });

      const totalToday = stats?.[0]?.total_focus_minutes || 0;
      const prevTotal = totalToday - (currentSession.planned_minutes || 0);

      if (totalToday >= 60 && prevTotal < 60) {
        await createNotification(
          user.id,
          'Daily Goal Reached! 🔥',
          "You've hit 60 minutes of focus today! You're on fire.",
          'streak'
        );
      }
    }

    set({
      currentSession: null,
      isActive: false,
      timeLeft: 15 * 60,
      mode: 'work',
    });
  },
}));
