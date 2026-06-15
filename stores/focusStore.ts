import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { FocusSession } from '@/types';

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

    set({
      currentSession: null,
      isActive: false,
      timeLeft: 15 * 60,
      mode: 'work',
    });
  },
}));
